/* Returns a handler to seat passed in parameter */
function	get_seat(seats, idx)
{
	if (idx == 1)
		return seats.seat1;
	else if (idx == 2)
		return seats.seat2;
	else if (idx == 3)
		return seats.seat3;
	else if (idx == 4)
		return seats.seat4;
	else if (idx == 5)
		return seats.seat5;
	else if (idx == 6)
		return seats.seat6;
	return 0;
}