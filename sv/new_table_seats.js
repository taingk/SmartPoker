/*
**	Make new seats for the current table.
*/

/* Returns a seats handler for the current table. */
function	new_table_seats()
{
	var		seat1 = new Seat("available", -1, 0);
	var		seat2 = new Seat("available", -1, 0);
	var		seat3 = new Seat("available", -1, 0);
	var		seat4 = new Seat("available", -1, 0);
	var		seat5 = new Seat("available", -1, 0);
	var		seat6 = new Seat("available", -1, 0);
	var		seats = new Seats(seat1, seat2, seat3, seat4, seat5, seat6);
	return seats;
}