function	stop_timer(table, timer, nick)
{
	io.to(table.id).emit("kick player", table.game.highlights_pos);
	remove_from_seat_array(table, nick/*get_seat(table.seats, table.game.highlights_pos)*/);
	remove_from_playing_seats(table.playing_seats, table.game.highlights_pos);
	io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
	io.to(table.id).emit("bet", table.game.highlights_pos, 0);
	io.to(table.id).emit("fold", get_seat(table.seats, table.game.highlights_pos));
	table.game.highlights_pos = 0;
	console.log("AFK KICKED!");
	if (table.players_nb > 0)
		--table.players_nb;
	clearInterval(timer);
}

function		starts_timer(table, nick)
{
	var 	cpt;
	var		timer;

	cpt = 30;
	timer = setInterval(function()
		{
			console.log('cpt : ' + cpt);
			if (!cpt)
				stop_timer(table, timer, nick);
			if (cpt > 0)
		    	--cpt;
		}, 1000);
}
