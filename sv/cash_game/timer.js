var timeLock = false;

function stop_timer(table, nick) {
    //io.to(table.id).emit("kick player", table.game.highlights_pos);
    //remove_from_seat_array(table, nick /*get_seat(table.seats, table.game.highlights_pos)*/ );
	console.log("AFK fold");
	remove_from_playing_seats(table.playing_seats, table.game.highlights_pos);
	get_seat(table.seats, table.game.highlights_pos).state = "busy";
	io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
	io.to(table.id).emit("fold", table.game.highlights_pos);
	io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
	io.to(table.id).emit("bet", table.game.highlights_pos, 0);
	table.game.highlights_pos = 0;
	if (table.playing_seats.length == 1)
		return one_playing_player_left(table);
	else if (table.game.round_nb > table.playing_seats.length)
		next_moment(table, table.game);
	else
		switch_next_player(table)
	}
}

function starts_timer(table, nick) {
    var timer = setInterval(function() {
		clearInterval(timer);
		if (!timeLock)
        	stop_timer(table, nick);
    }, 30000);
}
