/* General settings modification here.
** Copyright © 2014 Ngine Networks.
*/

function		get_player_seat_by_nickname(seats, nick)
{
		if (seats.seat1.player.nickname == nick)
		{
			seats.seat1.state = "available";
			return seats.seat1.player.seat_nb;
		}
		else if (seats.seat2.player.nickname == nick)
		{
			seats.seat2.state = "available";
			return seats.seat2.player.seat_nb;
		}
		else if (seats.seat3.player.nickname == nick)
		{
			seats.seat3.state = "available";
			return seats.seat3.player.seat_nb;
		}
		else if (seats.seat4.player.nickname == nick)
		{
			seats.seat4.state = "available";
			return seats.seat4.player.seat_nb;
		}
		else if (seats.seat5.player.nickname == nick)
		{
			seats.seat5.state = "available";
			return seats.seat5.player.seat_nb;
		}
		else if (seats.seat6.player.nickname == nick)
		{
			seats.seat6.state = "available";
			return seats.seat6.player.seat_nb;
		}
	return (-1);
}

function		remove_from_seat_array(table, nick)
{
	var 		idx = 0;

	console.log(nick + " will be kicked");
	while (idx < table.nicknames.length)
	{
		if (table.nicknames[idx] == nick)
		{
			table.nicknames.splice(idx, 1);
			return (1);
		}
		++idx;
	}
	return (-1);
}

function		remove_from_playing_seats(playing_seats, idx)
{
	var 		i = 0;

	if (playing_seats.indexOf(idx) == -1)
		return (-1);
	while (i < playing_seats.length)
	{
		if (playing_seats[i] == idx)
		{
			playing_seats.splice(i, 1);
			return (1);
		}
		++i;
	}
	return (-1);
}

function		socket_listens_global_settings(socket, table, private_channel)
{
	var			socket_nickname;
	var			player_seat_idx;

	socket.emit("player name info");
	socket.on("socket nickname on table", function(nickname)
	{
		if (nickname && socket_nickname != nickname)
			socket_nickname = nickname;
	});
	socket.on("disconnect", function()
	{
		if (socket_nickname)
		{
			player_seat_idx = get_player_seat_by_nickname(table.seats, socket_nickname);
			if (player_seat_idx  && table.game.moment != "waiting")
			{
				switch_next_player(table);
				remove_from_seat_array(table, socket_nickname/*get_seat(table.seats, table.game.highlights_pos)*/);
				console.log("table playing seats " + table.playing_seats);
				get_seat(table.seats, table.playing_seats).state = "busy";
				remove_from_playing_seats(table.playing_seats, player_seat_idx);
				io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
				table.game.highlights_pos = 0;
				io.to(table.id).emit("bet", player_seat_idx, 0);
				io.to(table.id).emit("kick player", player_seat_idx);
				if (table.players_nb > 0)
					--table.players_nb;
				if (table.playing_seats.length == 1) {
					console.log('one player left');
					return one_playing_player_left(table);
				}
			}
			else {
				remove_from_seat_array(table, socket_nickname/*get_seat(table.seats, table.game.highlights_pos)*/);
				console.log("table playing seats " + table.playing_seats);
				remove_from_playing_seats(table.playing_seats, player_seat_idx);
				io.to(table.id).emit("bet", player_seat_idx, 0);
				io.to(table.id).emit("kick player", player_seat_idx);
				if (table.players_nb > 0)
					--table.players_nb;
			}
			socket.leave(private_channel);
			socket.disconnect();
		}
	});
}
