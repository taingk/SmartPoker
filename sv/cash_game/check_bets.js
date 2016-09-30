function check_bets(table, seats) {
    var curseat;
    var bet = 0;
    var idx;
	var player;

    for (idx = 1; idx <= 6; ++idx) {
        if (table.playing_seats.indexOf(idx) != -1) {
            curseat = get_seat(seats, idx);
			if (!curseat.player.bankroll)
				console.log('Bonjour tu es fauché ! ' + curseat.player.bankroll, curseat.player.nickname);
            if (+curseat.bet > bet)
                bet = +curseat.bet;
        }
    }
    if (bet == 0) {
        console.log("0 BETS, FINE");
        return (1);
    }
    bet = -1;
    for (idx = 1; idx <= 6; ++idx) {
        if (table.playing_seats.indexOf(idx) != -1) {
            curseat = get_seat(seats, idx);
            if (curseat.bet <= 0 || bet > 0 && curseat.bet != bet) {
                console.log("BETS DIFFERS");
                return (0);
            }
            if (curseat.bet > 0)
                bet = curseat.bet;
        }
    }
    console.log("SAME BETS");
    return (1);
}

/*function	check_bets(seats)
{
	var		idx = 1;
	var		seat;
	var		bet = -1;

	while (idx <= 6)
	{
		seat = get_seat(seats, idx);
		if (seat && seat.state === "playing")
		{
			seat.bet = seat.bet.toString();
			if (seat.bet.length > 5)
				seat.bet = Math.round(seat.bet * 100) / 100;
			console.log(seat.bet);
			if (+bet > 0 && +seat.bet != +bet)
			{
				console.log("BETS DIFFERS!");
				return (0);
			}
			else
				bet = +seat.bet;
		}
		++idx;
	}
	var	 check = 0;
	for (idx = 1; idx <= 6; ++idx)
	{
		seat = get_seat(seats, idx);
		if (seat.state === "playing" && +seat.bet > 0)
			check = 1;
	}
	if (!check)
	{
		console.log("BETS DIFFERS! ALL AT ZERO!");
		return (0);
	}
	console.log("SAME BETS!");
	return (1);
}
*/
