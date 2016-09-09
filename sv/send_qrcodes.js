/* Sending QR codes for the table here.
** Copyright © 2014 Ngine Networks.
*/

function	is_available_seat(seats, seat_idx)
{

	if (seat_idx == 1 && seats.seat1.state == "available")
			return 1;
	else if (seat_idx == 2 && seats.seat2.state == "available")
			return 1;
	else if (seat_idx == 3 && seats.seat3.state == "available")
			return 1;
	else if (seat_idx == 4 && seats.seat4.state == "available")
			return 1
	else if (seat_idx == 5 && seats.seat5.state == "available")
			return 1;
	else if (seat_idx == 6 && seats.seat6.state == "available")
			return 1;
	return 0;
}

function	send_qrcodes(table, seats)
{
	for (var idx = 1; idx <= 6; ++idx)
		io.to(table.id).emit("qrcode", idx, "-id-" + table.id);
	io.to(table.id).emit("qrcode OK");
}

function	hide_qr(table, seat_nb)
{
	io.to(table.id).emit("hide qrcode", seat_nb);
}

function	re_qr(table, seat_nb) {
	seat = get_seat(table.seats, seat_nb)
	io.to(table.id).emit("re qrcode", seat);
}
