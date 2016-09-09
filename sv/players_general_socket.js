function		socket_listens_players(socket, table)
{
	var			player;	  // Current player.
	var			curseat;  // Current seat.
	var			channel;  // Channel involved.

	socket.on("is valid nickname", function(nickname, seat_idx)
	{
		curseat = get_seat(table.seats, seat_idx);
		channel = get_private_id(table.private_ids, seat_idx);
		if (!nickname || check_blanks(nickname) || nickname.length < 2 || nickname.length > 8)
		{
			console.log("Invalid nickname!");
			socket.emit("is valid nickname info", "invalid");
		}
		else if (table.nicknames.indexOf(nickname) != -1)
		{
			console.log("Nickname already taken!");
			socket.emit("is valid nickname info", "already taken");
		}
		else if (curseat.state != "available")
			socket.emit("is valid nickname info", "seat busy");
		else
		{
			console.log(nickname + " is valid!");
			socket.emit("is valid nickname info", "valid", nickname);
			table.nicknames.push(nickname);	// Add the user nickname to the table nicknames array.
			if (table.players_nb < 6)
				++table.players_nb;
			console.log("There are now " + table.players_nb +  " seated at the table (imo of course)!");
			player = new Player(seat_idx, nickname, +table.start_bankroll, -1, -1, -1, -1);
			curseat.state = "busy";
			curseat.player = player;
			console.log("Seat" + seat_idx + " is now " + curseat.state);
			io.to(table.id).emit("new player", player);
			if (table.playing_seats.indexOf(seat_idx) != -1)
				return ;
			if (table.game.moment === "waiting")
				table.playing_seats.push(seat_idx);
			if (table.playing_seats.length >= 2 && table.game.moment == "waiting")
			{
				console.log("Starting a new game...");
				for (var i = 0; i < table.playing_seats.length; i++)
					get_seat(table.seats, table.playing_seats[i]).state = "playing";
				new_cashgame(socket, table);
			}
			return ;
		}
	});
	socket.on("get seated players", function()
	{
		send_seats_infos(table);
	});
	socket.on("get board", function()
	{
		if (table.game.board.length >= 3)
			io.to(table.id).emit("send flop", table.game.board[0], table.game.board[1], table.game.board[2]);
		if (table.game.board.length >= 4)
			io.to(table.id).emit("send turn", table.game.board[3]);
		if (table.game.board.length === 5)
			io.to(table.id).emit("send river", table.game.board[4]);
	});

	socket.on("player decision", function(decision, channel_id, bet_amount)
	{
		if (!decision || !channel_id)
			return ;
		var seat_nb = +channel_id[channel_id.length - 1];
		if (seat_nb != table.game.highlights_pos)
			return ;
		if (bet_amount && bet_amount[bet_amount.length - 1] == "$")
		{
			bet_amount = bet_amount.slice(0, bet_amount.length - 1);
			bet_amount = (Math.round(+bet_amount * 100)) / 100;
		}
		console.log(decision + " " + bet_amount + " has been chosen by seat n°" + seat_nb);
		treat_decision(table, get_seat(table.seats, seat_nb), decision, bet_amount, get_seat(table.seats, seat_nb).player, seat_nb);
		io.to(table.id).emit("last action", decision, seat_nb);
		console.log(table.game.round_nb + "/" + table.playing_seats.length);
		console.log(table.playing_seats);
		if (table.game.round_nb >= table.playing_seats.length && check_bets(table, table.seats))
		{
			next_moment(table, table.game);
			if (table.playing_seats.length < 2) {
				console.log('switch 1');
				return one_playing_player_left(table);
			}
		}
		else {
			switch_next_player(table, decision);
			if (table.playing_seats.length < 2) {
				console.log('switch 2');
				return one_playing_player_left(table);
			}
		}
		++table.game.round_nb;
	});
}

function	doublesb(){
	setInterval(function() {
		var sb = cfg.conf.small_blind = cfg.conf.small_blind * 2;
		callBack(sb);
	}, 10000);
}

//var doublebb = setInterval(function() {cfg.conf.big_blind = cfg.conf.big_blind * 2; callBack}, 10000);

function 	callBack(fct_retour) {
	console.log(fct_retour); // appel de la fonction
}

function	treat_decision(table, seat, decision, bet_amount, player, seat_nb)
{
	if (decision == "CHECK" && +seat.bet === +table.game.curbet)
		return (1);
	else if (decision == "CALL")
	{
		player.bankroll -= (+table.game.curbet - +seat.bet) > 0 ? (+table.game.curbet - +seat.bet) : +table.game.curbet;
		if (player.bankroll < 0)
			player.bankroll = 0;
		seat.bet = +seat.bet + +bet_amount;
		seat.bet = Math.round(seat.bet * 100) / 100;
		seat.bet = +seat.bet + (+table.game.curbet - +seat.bet);
		table.game.pot_amount = +table.game.pot_amount + +bet_amount;
		io.to(table.id).emit("bet", seat_nb, +seat.bet);
		io.to(table.id).emit("bankroll modification", seat_nb, player);
		io.to(table.id).emit("pot modification", +table.game.pot_amount);
		return (1);
	}
	else if (decision == "RAISE" || decision == "BET")
	{
		if (bet_amount > player.bankroll || bet_amount <= 0)
			return (0);
		player.bankroll -= +bet_amount;
		if (player.bankroll < 0)
			player.bankroll = 0;
		table.game.curbet = +bet_amount /*+ +seat.bet*/;
		seat.bet = /*+seat.bet +*/ +bet_amount;
		seat.bet = Math.round(seat.bet * 100) / 100;
		table.game.pot_amount = +table.game.pot_amount + +bet_amount;
		io.to(table.id).emit("bet", seat_nb, +seat.bet);
		io.to(table.id).emit("bankroll modification", seat_nb, player);
		io.to(table.id).emit("pot modification", +table.game.pot_amount);
		return (1);
	}
	else if (decision == "FOLD")
	{
		remove_from_playing_seats(table.playing_seats, seat_nb);
		seat.state = "busy";
		io.to(table.id).emit("fold", seat_nb);
		return (1);
	}
	return (1);
}

function	adjust_bets_values(table)
{
	var		curseat;

	for (var idx = 1; idx <= 6; ++idx)
	{
		if (table.playing_seats.indexOf(idx) != -1)
		{
			curseat = get_seat(table.seats, idx);
			curseat.bet = (Math.round(curseat.bet * 100)) / 100;
			console.log("Seat bet n°" + idx + ": " +curseat.bet);
		}
	}
}

function	switch_next_player(table, decision)
{
	var		curseat;

	if (table.game.highlights_pos == "none")
		return ;
	io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
	io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
	remove_last_actions(table, 3);
	table.game.highlights_pos = get_next_player(table, table.game);
	io.to(table.id).emit("highlights", table.game.highlights_pos, "on");
	send_raise_limits(table, table.game, table.game.highlights_pos);
	curseat = get_seat(table.seats, table.game.highlights_pos);
	adjust_bets_values(table);
	if (table.game.curbet == "0" /*|| table.game.curbet <= +curseat.bet*/)
		send_option(table, table.game.highlights_pos, "first choice", "check", 0);
	else
		send_option(table, table.game.highlights_pos, "first choice", "call",/*
			((table.game.curbet - curseat.bet) > 0) ? (table.game.curbet - curseat.bet) : */table.game.curbet);
	send_option(table, table.game.highlights_pos, "second choice", "raise",/*
			((table.game.curbet - curseat.bet) * 2 > 0) ? (table.game.curbet - curseat.bet) * 1.10 : */table.game.curbet*2);
	send_option(table, table.game.highlights_pos, "third choice", "fold");
}

function	next_moment(table, game, decision)
{
	if (game.moment == "preflop")
	{
		table.game.curbet = "0";
		game.moment = "flop";
		deal_flop(table, game);
		remove_last_actions(table, 2);	// Remove on the UI, on the seat, the last action.
		evalhand(table, game); // Evaluate the current hand of all the players playing.
	}
	else if (game.moment == "flop")
	{
		table.game.curbet = "0";
		game.moment = "turn";
		deal_turn(table, game);
		remove_last_actions(table, 2);
		evalhand(table, game);
	}
	else if (game.moment == "turn")
	{
		table.game.curbet = "0";
		game.moment = "river";
		remove_last_actions(table, 2);
		deal_river(table, game);
		evalhand(table, game);
	}
	else if (game.moment == "river")
		return show_down(table, game);
	game.round_nb = 0;
	table.game.curbet = "0";
	for (var idx = 1; idx <= 6; ++idx)
	{
		get_seat(table.seats, idx).bet = 0;
		io.to(table.id).emit("bet", idx, "");
	}
	io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
	io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
	table.game.highlights_pos = get_first_to_talk(table, game);
	io.to(table.id).emit("highlights", table.game.highlights_pos, "on");
	remove_last_actions(table, 3);
	send_raise_limits(table, table.game, table.game.highlights_pos);
	var curseat = get_seat(table.seats, table.game.highlights_pos);
	//if (table.game.curbet == "0" || table.game.curbet <= +curseat.bet)
		send_option(table, table.game.highlights_pos, "first choice", "check", 0);
	//else
	//	send_option(table, table.game.highlights_pos, "first choice", "call",/*
	//		((table.game.curbet - curseat.bet) > 0) ? (table.game.curbet - curseat.bet) :*/ table.game.curbet);
	send_option(table, table.game.highlights_pos, "second choice", "raise",/*
			((table.game.curbet - curseat.bet) * 2 > 0) ? (table.game.curbet - curseat.bet) * 1.10 : */table.game.curbet*2);
	send_option(table, table.game.highlights_pos, "third choice", "fold");
}

function	one_playing_player_left(table)
{
	var		player = get_seat(table.seats, table.playing_seats[0]).player;

	player.bankroll += +table.game.pot_amount;
	io.to(table.id).emit("bankroll modification", table.playing_seats[0], player);
	return end_game(table, table.game, 42, player);
}
