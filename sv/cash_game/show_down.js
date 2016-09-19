function	evalwin(table, game)
{
	var		winners = new Array();
	var		idx = 1;
	var		best = 0;
	var		player;

	while (idx <= 6)
	{
		player = get_seat(table.seats, idx).player;
		//console.log("Player hand value: " + player.rank_value);
		if (player.rank_value)
		{
			if (!best || player.rank_value > best.rank_value)
				best = player;
			else if (player.rank_value === best.rank_value)
				winners.push(player);
		}
		++idx;
	}
	if (!winners.length)
		winners.push(best);
	//console.log("winners: " + winners);
	//console.log("best: " + best.rank_value);
	return winners;
}

function	show_down(table, game)
{
	var		winners; // Indeed, with a 's' at the end in case of split.
	var		player;


	table.game.moment = "waiting end game";
	if (!(winners = evalwin(table, game)))
		console.log("Can't retrieve winner(s)! Game error!");
	console.log("And the winner is..." + winners[0].nickname);

	for (var i = 1; i < 7; i++) {
		io.to(get_private_id(table.private_ids, i)).emit("cancel buttons", "hidden");
	}

	if (winners.length == 1)
	{
		winners[0].bankroll += game.pot_amount;
		io.to(table.id).emit("bankroll modification", winners[0].seat_nb, winners[0]);
	}
	else
	{
		console.log("Split!");
		for (var idx = 0; idx < winners.length; ++idx)
		{
			winners[idx].bankroll += game.pot_amount / winners.length;
			io.to(table.id).emit("bankroll modification", winners[idx].seat_nb, winners[idx]);
		}
	}
	for (idx = 1; idx <= 6; ++idx)
	{
		if (table.playing_seats.indexOf(idx) != -1)
		{
			player = get_seat(table.seats, idx).player;
			console.log(player);
			io.to(table.id).emit("show down", player.card1, player.card2, idx);
		}
	}
	return end_game(table, game, winners, player);
}
