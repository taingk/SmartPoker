function	send_seats_infos(table)
{
	var		seat_idx = 1;

	while (seat_idx <= 6)
	{
	    if (!is_available_seat(table.seats, seat_idx))
			io.to(table.id).emit("seated players info", get_seat(table.seats, seat_idx), seat_idx);
		++seat_idx;
	}
}
