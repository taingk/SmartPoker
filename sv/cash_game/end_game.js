function	end_timer(table, game)
{
	var 	cpt;
	var		timer;

	cpt = 10;
	timer = setInterval(function()
		{
			if (!cpt)
			{
				reinit(table, game);
				clearInterval(timer);
			}
			if (cpt > 0)
		    	--cpt;
		}, 1000);
}

function	end_game(table, game, winners, player)
{
	var		idx;

	table.game.pot_amount = 0;
	io.to(table.id).emit("pot modification", table.game.pot_amount);
	for (idx = 1; idx <= 6; ++idx)
	{
		io.to(table.id).emit("highlights", idx, "off");
		io.to(table.id).emit("bet", idx, "");
	}
	if (winners != 42)
	{
		idx = 0;
		while (idx < winners.length)
			io.to(table.id).emit("bet", winners[idx++].seat_nb, +game.pot_amount / winners.length);
	}
	if (winners.length === 1) {
		io.to(table.id).emit("winner", winners[0].seat_nb, winners[0].rank_name);
	}
	else if (winners != 42) {
		io.to(table.id).emit("winner", 42, 'null');
	}
	if (winners == 42)
	{
		io.to(table.id).emit("winner", player.seat_nb, 'disconnected');
		for (idx = 1; idx <= 6; ++idx)
		{
			if ((player = get_seat(table.seats, idx).player) != -1 ) {
				io.to(table.id).emit("show down", player.card1, player.card2, idx);
			}
		}
//		io.to(table.id).emit("show down", player.card1, player.card2, player.seat_nb);
		end_timer(table, game);
	}
	else
		end_timer(table, game);
}

function	reinit(table, game)
{
	console.log('reinit');
	io.to(table.id).emit("win off", 42);
	for (var idx = 1; idx <= 6; ++idx)
	{
		var seat = get_seat(table.seats, idx);
		seat.player.card_1 = "undefined";
		seat.player.card_2 = "undefined";
		seat.player.rank_name = "undefined";
		seat.player.rank_value = 0;
		if (seat.player.bankroll != undefined) {
			if (seat.player.bankroll <= 0) {
				console.log(seat.player.nickname + ' is Game Over!');
				io.to(get_private_id(table.private_ids, seat.player.seat_nb)).emit('game over');
			}
		}
		io.to(get_private_id(table.private_ids, idx)).emit("turn wait");
	}
	io.to(table.id).emit("remove board");
	io.to(table.id).emit("remove emplacements");
	game.highlights_pos = "none"; // We don't need it anymore for now.
	game.board = new Array();
	game.moment = "waiting";
	++game.d_pos;
	++game.sb_pos;
	++game.bb_pos;
	game.deck = new Array('2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'tc', 'jc', 'qc', 'kc', '1c',
						   '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'ts', 'js', 'qs', 'ks', '1s',
							'2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'td', 'jd', 'qd', 'kd', '1d',
							 '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'th', 'jh', 'qh', 'kh', '1h');
	console.log("***END***");
	for (var i = 1; i < 7; i++) {
		io.to(get_private_id(table.private_ids, i)).emit("show buttons", "visible");
	}
	console.log('1');
	/* ADD NEW PLAYERS TO PLAYING SEATS ARRAY */
	for (idx = 1; idx <= 6; ++idx)
		if (get_seat(table.seats, idx).state === "busy")
			table.playing_seats.push(idx);
	table.game.moment = "waiting";
	if (table.playing_seats.length >= 2 && table.game.moment == "waiting")
	{
		console.log("Starting a new game...");
		for (var i = 0; i < table.playing_seats.length; i++)
				get_seat(table.seats, table.playing_seats[i]).state = "playing";
		console.log('3');
		new_cashgame(42, table);
	}
	console.log('end reinit');
}
