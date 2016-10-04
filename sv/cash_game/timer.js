var timeLock = false;

function stop_timer(table) {
    console.log("AFK fold");
    /*    remove_from_playing_seats(table.playing_seats, table.game.highlights_pos);
        get_seat(table.seats, table.game.highlights_pos).state = "busy";
    	io.to(table.id).emit("fold", table.game.highlights_pos);
        io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
        io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
        io.to(table.id).emit("bet", table.game.highlights_pos, 0);*/
    io.to(table.id).emit("i fold", "FOLD", get_private_id(table.private_ids, table.game.highlights_pos), 0);
    if (table.playing_seats.length == 1)
        return one_playing_player_left(table);
    else
        return;
}
/*
function start_timer(table, nick) {
	var sec = 0;

	console.log("Start timer");
	var lockTimer = setInterval(function() {
		sec++;
		console.log('Statut '+timeLock + ' ' + sec);
		if (timeLock && sec != 30) {
			clearInterval(lockTimer);
			timeLock = false;
		} else if (sec == 30) {
			clearInterval(lockTimer);
			timeLock = false;
			stop_timer(table, nick);
		}
	}, 1000);
}

function check_timeLock(action) {
    timeLock = action;
}
*/
