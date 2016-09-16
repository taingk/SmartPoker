/* Copyright © 2014 Ngine Networks - All Rights Reserved. */
function find_dealer(table, game) {
    var pos = 1;

    if (table.playing_seats.length < 2)
        return 0;
    if (game.d_pos == -1 || game.d_pos > 6 || game.d_pos <= 0) // First game of the table
    {
        while (table.playing_seats.indexOf(pos) == -1)
            pos = Math.floor(Math.random() * 6);
        return pos;
    }
    if (game.sb_pos) {
        pos = game.d_pos + 1;
        while (table.playing_seats.indexOf(pos) == -1) {
            if (pos >= 7 || pos <= 0)
                pos = 0;
            ++pos;
        }
    }
    return pos;
}

function find_sb(table, game) {
    var pos = game.d_pos + 1;

    if (table.playing_seats.length < 2)
        return 0;
    if (pos >= 7 || pos <= 0)
        pos = 1;
    if (table.playing_seats.length == 2) // Heads-up situation
        return game.d_pos;
    pos = game.d_pos + 1;
    while (table.playing_seats.indexOf(pos) == -1) {
        if (pos >= 7 || pos <= 0)
            pos = 0;
        ++pos;
    }
    return pos;
}

function find_bb(table, game) {
    var pos = game.sb_pos + 1;

    if (table.playing_seats.length < 2)
        return 0;
    while (table.playing_seats.indexOf(pos) == -1 && pos != game.sb_pos && pos != game.d_pos) {
        if (pos >= 7 || pos <= 0)
            pos = 0;
        ++pos;
    }
    return pos;
}

function get_next_player(table, game) {
    var pos = game.highlights_pos + 1;

    if (table.playing_seats.length < 2)
        return 0;
    while (table.playing_seats.indexOf(pos) == -1) {
        if (pos >= 7 || pos <= 0)
            pos = 0;
        ++pos;
    }
    console.log("get_next_player() = " + pos);
    return pos;
}

function get_first_to_talk(table, game) {
    var pos = game.bb_pos + 1;

    if (table.playing_seats.length < 2)
        return 0;
    if (table.playing_seats.length == 2) {
        game.highlights_pos = game.d_pos;
        return game.d_pos;
    }
    while (table.playing_seats.indexOf(pos) == -1) {
        if (pos >= 7 || pos <= 0)
            pos = 0;
        ++pos;
    }
    game.highlights_pos = pos;
    return pos;
}

function preflop_deal(socket, game, table) {
    var idx = 1;
    var curseat;

    while (idx <= 6) {
        curseat = get_seat(table.seats, idx);
        if (curseat && curseat.state == "playing") {
            io.to(get_private_id(table.private_ids, idx)).emit("first deal", game.deck[idx], game.deck[idx + 1]);
            curseat.player.card1 = game.deck[idx];
            curseat.player.card2 = game.deck[idx + 1];
            game.deck.splice(idx, 2);
        }
        ++idx;
    }
}

function get_first_cards_suit(card1, card2) {
    return (card1[0] === card2[0]) ? "One Pair" : "High Card";
}

function preflop_first_cards_suits(socket, game, table) {
    var idx = 1;
    var player;
    var first_suit;
    var curseat;

    while (idx <= 6) {
        curseat = get_seat(table.seats, idx);
        if (curseat.state == "playing") {
            player = curseat.player;
            first_suit = get_first_cards_suit(player.card1, player.card2);
            player.rank_name = first_suit;
            io.to(get_private_id(table.private_ids, idx)).emit("first suit", first_suit);
        }
        ++idx;
    }
}

function send_raise_limits(table, game, seat_nb, token) {
    var player;
    var raise_limit1;

    if (get_seat(table.seats, seat_nb).player.bankroll) {
        if (token) {
            raise_limit1 = cfg.conf.big_blind;
            io.to(get_private_id(table.private_ids, seat_nb)).emit("raise limits", raise_limit1, get_seat(table.seats, seat_nb).player.bankroll);
        } else {
            raise_limit1 = game.curbet * 2;
            if (get_seat(table.seats, seat_nb).player.bankroll < raise_limit1) {
                io.to(get_private_id(table.private_ids, seat_nb)).emit("raise limits", raise_limit1, raise_limit1);
            } else
                io.to(get_private_id(table.private_ids, seat_nb)).emit("raise limits", raise_limit1, get_seat(table.seats, seat_nb).player.bankroll);
        }
    } else {
        io.to(get_private_id(table.private_ids, seat_nb)).emit("raise limits", 0, 0);
    }
}

function send_option(table, seat_nb, option, choice, amount) {
    var player;
    var curseat = get_seat(table.seats, seat_nb);

    if (curseat && curseat.player.bankroll === "ALL IN" && amount > curseat.player.bankroll)
        amount = curseat.player.bankroll;
    if (curseat.state == "playing") {
        if (choice === "fold") // As it's the last option, client should be ready.
        {
            io.to(get_private_id(table.private_ids, seat_nb)).emit("your turn");
        }
        player = get_seat(table.seats, seat_nb).player;
        io.to(get_private_id(table.private_ids, seat_nb)).emit(option, choice, amount);
    }

}

function send_emplacements(table) {
    io.to(table.id).emit("place button", "sb", table.game.sb_pos); // Respect this sending order.
    io.to(table.id).emit("place button", "dealer", table.game.d_pos);
    io.to(table.id).emit("place button", "bb", table.game.bb_pos);
    io.to(table.id).emit("highlights", table.game.highlights_pos, "on");
}

function blinds_treatment(table, sb, bb) {
    if (sb.player.bankroll <= 0)
        sb.player.bankroll = +cfg.start_bankroll; // New cave!
    if (bb.player.bankroll <= 0)
        bb.player.bankroll = +cfg.start_bankroll;
    sb.player.bankroll -= cfg.conf.small_blind;
    table.game.pot_amount += +cfg.conf.small_blind;
    bb.player.bankroll -= cfg.conf.big_blind;
    table.game.pot_amount += +cfg.conf.big_blind;
    table.game.curbet = cfg.conf.big_blind;
}

function send_blinds(table, sb, bb) {
    io.to(table.id).emit("bankroll modification", table.game.sb_pos, sb.player);
    io.to(table.id).emit("bankroll modification", table.game.bb_pos, bb.player);
    io.to(table.id).emit("pot modification", table.game.pot_amount);
    io.to(table.id).emit("bet", table.game.sb_pos, sb.bet = cfg.conf.small_blind);
    io.to(table.id).emit("bet", table.game.bb_pos, bb.bet = cfg.conf.big_blind);

    console.log('sb : ' + sb.bet, 'bb : ' + bb.bet);
}

function ask_first_player(socket, table, game) {
    //starts_timer(table, player.nickname);
    send_option(table, game.highlights_pos, "first choice", "call", /*game.highlights_pos === game.sb_pos ? game.curbet / 2 :*/ game.curbet);
    send_option(table, game.highlights_pos, "second choice", "null", -1 /*game.highlights_pos === game.sb_pos ? game.curbet * 2 / 2 : game.curbet */ );
    send_option(table, game.highlights_pos, "third choice", "fold");
    /* SEE PLAYER GENERAL SOCKETS FOR THE FOLLOWING */
}

function players_wait_mode(table) {
    for (var idx = 1; idx <= 6; ++idx)
        io.to(get_private_id(table.private_ids, idx)).emit("turn wait");
}

function game_routine(socket, table) {
    var sb; // small blind.
    var bb; // big blind.

    table.game.d_pos = find_dealer(table, table.game);
    table.game.sb_pos = find_sb(table, table.game);
    table.game.bb_pos = find_bb(table, table.game);
	get_first_to_talk(table, table.game);
    console.log("Dealer is at seat " + table.game.d_pos);
    console.log("Small blind is at seat " + table.game.sb_pos);
    console.log("Big blind is at seat " + table.game.bb_pos);
    send_emplacements(table); // Send buttons emplacements.
    sb = get_seat(table.seats, table.game.sb_pos);
    bb = get_seat(table.seats, table.game.bb_pos);
    blinds_treatment(table, sb, bb); // Take blinds (server side).
    send_blinds(table, sb, bb); // Send blinds to clients.
    /* Preflop */
    preflop_deal(socket, table.game, table);
    preflop_first_cards_suits(socket, table.game, table);
    table.game.curbet = cfg.conf.big_blind;
    send_raise_limits(table, table.game, table.game.highlights_pos, 0);
    players_wait_mode(table);
    console.log('ask first player');
    ask_first_player(socket, table, table.game);
}

function init_obj(table) {
    var idx = 1;
    var seat;

    while (idx <= 6) {
        seat = get_seat(table.seats, idx);
        seat.bet = 0;
        ++idx;
    }
}

function stop_high_rollers(table) {
    var seat;

    for (var idx = 1; idx <= 6; ++idx) {
        seat = get_seat(table.seats, idx)
        if (seat.player.bankroll >= 9999)
            seat.player.bankroll = 9000;
        else if (seat.player.bankroll <= 0)
            seat.player.bankroll = +cfg.start_bankroll;
        io.to(table.id).emit("bankroll modification", idx, seat.player);
        /* send cards to player (should not be here) */
        if ((table.playing_seats.indexOf(idx) != -1))
            io.to(table.id).emit("give cards", idx);
    }
}

function new_cashgame(socket, table) {
    init_obj(table);
    table.game.moment = "preflop";
	log(table.game.moment, game.moment);
    table.game.round_nb = socket === 42 ? 0 : 1;
    table.game.pot_amount = 0;
    table.game.curbet = 0;
    io.to(table.id).emit("pot modification", table.game.pot_amount);
    fisher_shuffle(table.game.deck);
    stop_high_rollers(table);
    console.log("Round nb: " + table.game.round_nb);
    return game_routine(socket, table);
}
