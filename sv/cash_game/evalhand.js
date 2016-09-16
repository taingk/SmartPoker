function	evalhand(table, game)
{
	var		r;
	var		hand; // Example: Array("2s", "4d", "6h", "8c", "Tc");
	var		idx = 1;
	var		player;
	var		j;

	while (idx <= 6)
	{
		if (get_seat(table.seats, idx).state == "playing")
		{
			player = get_seat(table.seats, idx).player;
			hand = game.board.slice(0);
			hand.push(player.card1);
			hand.push(player.card2);
			for (j = 0; j < hand.length; ++j)
			{
				if (hand[j][0] == "1")
					hand[j] = "A" + hand[j][1];
				else if (hand[j][0] == "k" || hand[j][0] == "q"
						|| hand[j][0] == "j" || hand[j][0] == "t")
					hand[j] = hand[j][0].toUpperCase() + hand[j][1];
			}
			r = texas.evaluate(hand);
			//console.log(hand);
			//console.log("SEAT" + idx + "->" + r.name);
			console.log(r.name);
			player.rank_name = r.name.slice(0);
			player.rank_value = r.value;
			//console.log("Value: " + r.value);
			io.to(get_private_id(table.private_ids, idx)).emit("first suit", r.name);
		}
		++idx;
	}
}
