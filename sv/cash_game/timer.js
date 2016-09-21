var timeLock = false;

function stop_timer(table, nick) {
    //io.to(table.id).emit("kick player", table.game.highlights_pos);
    //remove_from_seat_array(table, nick /*get_seat(table.seats, table.game.highlights_pos)*/ );
/*    io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
    io.to(table.id).emit("bet", table.game.highlights_pos, 0);
    table.game.highlights_pos = 0;*/
	remove_from_playing_seats(table.playing_seats, table.game.highlights_pos);
	get_seat(table.seats, table.game.highlights_pos).state = "busy";
	io.to(table.id).emit("fold", table.game.highlights_pos);
    console.log("AFK fold");
}

function starts_timer(table, nick) {
    var timer = setInterval(function() {
		clearInterval(timer);
		if (!timeLock)
        	stop_timer(table, nick);
    }, 30000);
}
