var lock = false;

function socket_listens_players(socket, table) {
    var player; // Current player.
    var curseat; // Current seat.
    var channel; // Channel involved.

    socket.on("is valid nickname", function(nickname, seat_idx) {
        curseat = get_seat(table.seats, seat_idx);
        channel = get_private_id(table.private_ids, seat_idx);
        if (!nickname || check_blanks(nickname) || nickname.length < 2 || nickname.length > 8) {
            console.log("Invalid nickname!");
            socket.emit("is valid nickname info", "invalid");
        } else if (table.nicknames.indexOf(nickname) != -1) {
            console.log("Nickname already taken!");
            socket.emit("is valid nickname info", "already taken");
        } else if (curseat.state != "available")
            socket.emit("is valid nickname info", "seat busy");
        else {
            console.log(nickname + " is valid!");
            socket.emit("is valid nickname info", "valid", nickname);
            table.nicknames.push(nickname); // Add the user nickname to the table nicknames array.
            if (table.players_nb < 6)
                ++table.players_nb;
            console.log("There are now " + table.players_nb + " seated at the table (imo of course)!");
            player = new Player(seat_idx, nickname, +table.start_bankroll, -1, -1, -1, -1);
            curseat.state = "busy";
            curseat.player = player;
            console.log("Seat" + seat_idx + " is now " + curseat.state);
            io.to(table.id).emit("new player", player);
            if (table.playing_seats.indexOf(seat_idx) != -1)
                return;
            if (table.game.moment == "waiting")
                table.playing_seats.push(seat_idx);
            for (var i = 0; i < table.playing_seats.length; i++)
                get_seat(table.seats, table.playing_seats[i]).state = "playing";
            console.log(table.game.moment);
            if (table.players_nb >= 1 && table.game.moment == "waiting") {
                if (lock)
                    return;
                else
                    tryChrono(socket, table);
            }
            return;
        }
    });
    socket.on("get seated players", function() {
        send_seats_infos(table);
    });
    socket.on("get board", function() {
        if (table.game.board.length >= 3)
            io.to(table.id).emit("send flop", table.game.board[0], table.game.board[1], table.game.board[2]);
        if (table.game.board.length >= 4)
            io.to(table.id).emit("send turn", table.game.board[3]);
        if (table.game.board.length === 5)
            io.to(table.id).emit("send river", table.game.board[4]);
    });
    socket.on("player decision", function(decision, channel_id, bet_amount, rc) {
		console.log('Decision ' + decision);
		console.log('Bet amount ' + bet_amount);
        if (!decision || !channel_id)
            return;
        var seat_nb = +channel_id[channel_id.length - 1];
        var player = get_seat(table.seats, seat_nb).player;

        if (table.playing_seats.length == 2)
            table.game.highlights_pos = seat_nb;
        if (seat_nb != table.game.highlights_pos)
            return;
        if (bet_amount && bet_amount[bet_amount.length - 1] == "$") {
            bet_amount = bet_amount.slice(0, bet_amount.length - 1);
            bet_amount = (Math.round(+bet_amount * 100)) / 100;
        }
        treat_decision(table, get_seat(table.seats, seat_nb), decision, bet_amount, get_seat(table.seats, seat_nb).player, seat_nb, rc);
		console.log(decision + " " + bet_amount + " has been chosen by seat n°" + seat_nb);
		console.log('Decision ' + decision);
        io.to(table.id).emit("last action", decision, seat_nb, bet_amount);
        console.log(table.game.round_nb + "/" + table.playing_seats.length);
        if (decision == "FOLD" && table.game.round_nb > table.playing_seats.length && check_bets(table, table.seats)) {
            if (table.playing_seats.length < 2)
                return one_playing_player_left(table);
            next_moment(table, table.game);
        } else if (table.game.round_nb >= table.playing_seats.length && check_bets(table, table.seats)) {
            if (table.playing_seats.length < 2)
                return one_playing_player_left(table);
            decision == "FOLD" ? switch_next_player(table) : next_moment(table, table.game);
        } else {
            if (table.playing_seats.length < 2)
                return one_playing_player_left(table);
            switch_next_player(table);
        }
        if (decision == "FOLD" && (table.game.round_nb + 1) == table.playing_seats.length)
			return;
        else
            ++table.game.round_nb;
    });
    socket.on("action done", function() {
        io.to(table.id).emit("action is true");
    });
    socket.on("stop timer action", function(tablee) {
        stop_timer(tablee);
    });
    socket.on("ask buttons", function() {
        if (table.game.highlights_pos) {
            io.to(table.id).emit("place button", "sb", table.game.sb_pos); // Respect this sending order.
            io.to(table.id).emit("place button", "dealer", table.game.d_pos);
            io.to(table.id).emit("place button", "bb", table.game.bb_pos);
        }
        io.to(table.id).emit("highlights", table.game.highlights_pos);
    });
    socket.on('get pot amount', function() {
        socket.emit('pot amount', table.game.pot_amount);
    });
    socket.on('need Id', function() {
        io.to(table.id).emit('give Idx', table_id);
    });
    io.to(table.id).emit("pot modification", table.game.pot_amount);
}

function tryChrono(socket, table) {
    lock = true;
    io.to(table.id).emit("chrono", 45, "The game will begin ...");
    var timer = setInterval(function() {
        clearInterval(timer);
        io.to(table.id).emit("chrono off");
        if (table.playing_seats.length > 1) {
            console.log("Starting a new game...");
            new_cashgame(socket, table);
            lock = false;
        } else
            tryChrono(socket, table);
    }, 45000);
}

function treat_decision(table, seat, decision, bet_amount, player, seat_nb, rc) {
    if (decision == "FOLD")
        decision = "FOLD";
    else if (rc == "undefined")
        decision = "CALL";
    else if (rc == 1)
        decision = "RAISE";
    if (decision == "CHECK" && +seat.bet === +table.game.curbet)
        return (1);
    else if (decision == "CALL") {
        player.bankroll -= (+table.game.curbet - +seat.bet) > 0 ? (+table.game.curbet - +seat.bet) : +table.game.curbet;
        if (player.bankroll < 0)
            player.bankroll = 0;
        seat.bet = +seat.bet + +bet_amount;
        seat.bet = Math.round(seat.bet * 100) / 100;
        seat.bet = +seat.bet + (+table.game.curbet - +seat.bet);
        table.game.pot_amount = +table.game.pot_amount + +bet_amount;
        io.to(table.id).emit("bet", seat_nb, +seat.bet);
        io.to(table.id).emit("bankroll modification", seat_nb, player);
        io.to(table.id).emit("pot modification", +table.game.pot_amount);
        return (1);
    } else if (decision == "RAISE" || decision == "BET") {
        if (bet_amount > player.bankroll || bet_amount <= 0)
            return (0);
        player.bankroll -= +bet_amount;
        if (player.bankroll < 0)
            player.bankroll = 0;
        table.game.curbet = +bet_amount /*+ +seat.bet*/ ;
        seat.bet = /*+seat.bet +*/ +bet_amount;
        seat.bet = Math.round(seat.bet * 100) / 100;
        table.game.pot_amount = +table.game.pot_amount + +bet_amount;
        io.to(table.id).emit("bet", seat_nb, +seat.bet);
        io.to(table.id).emit("bankroll modification", seat_nb, player);
        io.to(table.id).emit("pot modification", +table.game.pot_amount);
        return (1);
    } else if (decision == "FOLD") {
        remove_from_playing_seats(table.playing_seats, seat_nb);
        seat.state = "busy";
        io.to(table.id).emit("fold", seat_nb);
        return (1);
    }
    return (1);
}

function adjust_bets_values(table) {
    var curseat;

    for (var idx = 1; idx <= 6; ++idx) {
        if (table.playing_seats.indexOf(idx) != -1) {
            curseat = get_seat(table.seats, idx);
            curseat.bet = (Math.round(curseat.bet * 100)) / 100;
            console.log("Seat bet n°" + idx + ": " + curseat.bet);
        }
    }
}

function switch_next_player(table) {
    var player;

    console.log('switch next player');
    if (table.game.highlights_pos == "none")
        return;
    io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
    io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
    table.game.highlights_pos = get_next_player(table, table.game);
    io.to(table.id).emit("highlights", table.game.highlights_pos, "on");
    send_raise_limits(table, table.game, table.game.highlights_pos, 0);
    adjust_bets_values(table);
    io.to(table.id).emit("timer action", get_table(table.id, tables));
    if (get_seat(table.seats, table.game.highlights_pos).player.bankroll) {
        if (table.game.curbet == "0") {
            send_option(table, table.game.highlights_pos, "first choice", "check", 0);
            send_option(table, table.game.highlights_pos, "second choice", "call", cfg.conf.big_blind);
            send_raise_limits(table, table.game, table.game.highlights_pos, 1);
        } else {
            if (table.game.curbet > get_seat(table.seats, table.game.highlights_pos).player.bankroll) {
                send_option(table, table.game.highlights_pos, "first choice", "call", get_seat(table.seats, table.game.highlights_pos).player.bankroll);
                send_option(table, table.game.highlights_pos, "second choice", "null", -1);
            } else {
                send_option(table, table.game.highlights_pos, "first choice", "call", table.game.curbet);
                if (table.game.curbet * 2 > get_seat(table.seats, table.game.highlights_pos).player.bankroll) {
                    send_option(table, table.game.highlights_pos, "second choice", "null", -1);
                } else {
                    send_option(table, table.game.highlights_pos, "second choice", "raise", table.game.curbet * 2)
                }
            }
        }
        send_option(table, table.game.highlights_pos, "third choice", "fold", 0);
    } else {
        if (table.playing_seats.length < 3) {
            if (table.game.moment == "preflop") {
                table.game.moment = "flop";
                deal_flop(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "flop") {
                table.game.moment = "turn";
                deal_turn(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "turn") {
                table.game.moment = "river";
                deal_river(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "river") {
                return show_down(table, table.game);
            }
        }
        send_option(table, table.game.highlights_pos, "first choice", "check", -1);
        send_option(table, table.game.highlights_pos, "second choice", "null", -1);
        send_option(table, table.game.highlights_pos, "third choice", "fold", -1);
        //		io.to(table.id).emit("i fold", "PASS", get_private_id(table.private_ids, table.game.highlights_pos), 0);
    }
}

function next_moment(table, game) {
    var player;

    console.log('next_moment');
    if (table.game.moment == "preflop") {
        table.game.curbet = "0";
        table.game.moment = "flop";
        deal_flop(table, game);
        evalhand(table, game);
    } else if (table.game.moment == "flop") {
        table.game.curbet = "0";
        table.game.moment = "turn";
        deal_turn(table, game);
        evalhand(table, game);
    } else if (table.game.moment == "turn") {
        table.game.curbet = "0";
        table.game.moment = "river";
        deal_river(table, game);
        evalhand(table, game);
    } else if (table.game.moment == "river") {
        return show_down(table, game);
    }
    table.game.round_nb = 0;
    table.game.curbet = "0";
    for (var idx = 1; idx <= 6; ++idx) {
        get_seat(table.seats, idx).bet = 0;
        io.to(table.id).emit("bet", idx, "");
    }
    io.to(table.id).emit("timer action", get_table(table.id, tables));
    io.to(get_private_id(table.private_ids, table.game.highlights_pos)).emit("turn wait");
    io.to(table.id).emit("highlights", table.game.highlights_pos, "off");
    table.game.highlights_pos = get_first_to_talk(table, game, false);
    io.to(table.id).emit("highlights", table.game.highlights_pos, "on");
    send_raise_limits(table, table.game, table.game.highlights_pos, 1);
    if (get_seat(table.seats, table.game.highlights_pos).player.bankroll) {
        send_option(table, table.game.highlights_pos, "first choice", "check", 0);
        if (get_seat(table.seats, table.game.highlights_pos).player.bankroll < cfg.conf.big_blind)
            send_option(table, table.game.highlights_pos, "second choice", "null", -1);
        else
            send_option(table, table.game.highlights_pos, "second choice", "call", cfg.conf.big_blind);
        send_option(table, table.game.highlights_pos, "third choice", "fold", 0);
    } else {
        if (table.playing_seats.length < 3) {
            if (table.game.moment == "preflop") {
                table.game.moment = "flop";
                deal_flop(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "flop") {
                table.game.moment = "turn";
                deal_turn(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "turn") {
                table.game.moment = "river";
                deal_river(table, table.game);
                evalhand(table, table.game);
            }
            if (table.game.moment == "river") {
                return show_down(table, table.game);
            }
        }
        send_option(table, table.game.highlights_pos, "first choice", "check", -1);
        send_option(table, table.game.highlights_pos, "second choice", "null", -1);
        send_option(table, table.game.highlights_pos, "third choice", "fold", -1);
        //io.to(table.id).emit("i fold", "PASS", get_private_id(table.private_ids, table.game.highlights_pos), 0);
    }
}

function one_playing_player_left(table) {
    var player = get_seat(table.seats, table.playing_seats[0]).player;
    table = get_table(table.id, tables);

    player.bankroll += +table.game.pot_amount;
    io.to(table.id).emit("bankroll modification", table.playing_seats[0], player);
    if (table.game.moment != "waiting" || table.game.moment != "waiting end game")
        return end_game(table, table.game, 42, player);
    else
        return;
}
