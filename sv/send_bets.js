function	send_bets(table)
{
	var		idx = 1;
	var		curseat;

	while (idx <= 6)
	{
		curseat = get_seat(table.seats, idx);
		if  (curseat.state == "playing" && curseat.bet)
			io.to(table.id).emit("bet", idx, curseat.bet);
		++idx;
	}
}
