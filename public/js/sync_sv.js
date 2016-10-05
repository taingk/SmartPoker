var id;
var array;
var game;
var newTables;
var push = true;
var timeLock = false;
var lockTimer;
var lock = false;
var lockEnd = false;

function sync_sv() {
    socket.emit("get seated players");
    socket.on("chrono", function(i, str) {
        $("#chrono").html(str + '<br><span id="sec">' + i + '</span> sec remaining<br>to add more players');
        var chrono = setInterval(function() {
            i--;
            $("#sec").html(i);
            if (i == 0) {
                clearInterval(chrono);
            }
        }, 1000);
    });
    socket.on("chrono off", function() {
        $("#chrono").empty();
    });
    socket.on("action is true", function() {
        console.log('timeLock est true');
        timeLock = true;
    });
    socket.on("timer action", function(table) {
        var sec = 0;

		clearInterval(lockTimer);
		timeLock=false;
        lockTimer = setInterval(function() {
            sec++;
			console.log(sec);
            if (timeLock && sec != 30) {
				sec = 0;
                timeLock = false;
				clearInterval(lockTimer);
            } else if (sec == 30) {
                sec = 0;
                timeLock = false;
                socket.emit("stop timer action", table);
				clearInterval(lockTimer);
            }
        }, 1000);
    });
    socket.on("seated players info", function(seat, seat_idx) {
        $("#qr" + seat_idx).css("visibility", "hidden");
        $("#qr_spot" + seat_idx).css("visibility", "hidden");
        $("#scan_msg" + seat_idx).css("visibility", "hidden");
        $("#player_name" + seat_idx).css("visibility", "visible");
        $("#player_name" + seat_idx).text(seat.player.nickname);
        $("#player_bankroll" + seat_idx).css("visibility", "visible");
        $("#player_bankroll" + seat_idx).text((Math.floor(+seat.player.bankroll * 100)) / 100 + "$");
        $("#player_cards" + seat_idx).css("visibility", "visible");
    });
    socket.on("new player", function(player) {
        $("#qr" + player.seat_nb).css("visibility", "hidden");
        $("#qr_spot" + player.seat_nb).css("visibility", "hidden");
        $("#scan_msg" + player.seat_nb).css("visibility", "hidden");
        $("#player_name" + player.seat_nb).css("visibility", "visible");
        $("#player_name" + player.seat_nb).text(player.nickname);
        $("#player_bankroll" + player.seat_nb).css("visibility", "visible");
        $("#player_bankroll" + player.seat_nb).text((Math.floor(+player.bankroll * 100)) / 100 + "$");
        $("#player_cards" + player.seat_nb).css("visibility", "visible");
    });
    socket.on("kick player", function(seat_nb) {
        $("#qr" + seat_nb).css("visibility", "visible");
        $("#qr_spot" + seat_nb).css("visibility", "visible");
        $("#scan_msg" + seat_nb).css("visibility", "visible");
        $("#player_name" + seat_nb).css("visibility", "hidden");
        $("#player_name" + seat_nb).text("");
        $("#player_bankroll" + seat_nb).css("visibility", "hidden");
        $("#player_bankroll" + seat_nb).text("");
        $("#player_cards" + seat_nb).css("visibility", "hidden");
        $("#btn" + seat_nb).attr("src", "");
        $("#btn" + seat_nb).css("visibility", "hidden");
        $("#card1_" + seat_nb).css("visibility", "hidden");
        $("#card2_" + seat_nb).css("visibility", "hidden");
        $("#last_action" + seat_nb).css("visibility", "hidden");
    });
    socket.emit("ask buttons");
    socket.on("place button", function(type, seat_nb) {
        if (seat_nb <= 0 || seat_nb >= 7)
            return;
        if (type == "dealer") {
            $("#btn" + seat_nb).attr("src", "../img/Dealer.png")
            $("#btn" + seat_nb).css("visibility", "visible");
        } else if (type == "sb") {
            $("#btn" + seat_nb).attr("src", "../img/sb.png")
            $("#btn" + seat_nb).css("visibility", "visible");
        } else if (type == "bb") {
            $("#btn" + seat_nb).attr("src", "../img/bb.png")
            $("#btn" + seat_nb).css("visibility", "visible");
        }
        $("#player_cards" + seat_nb).attr("src", "../img/hidden_cards.png");
    });
    socket.on("give cards", function(seat_nb) {
        $("#player_cards" + seat_nb).attr("src", "../img/hidden_cards.png");
    });
    socket.on("highlights", function(seat_idx, new_state) {
        var pos = $("#hSeat" + seat_idx);
        var idx;
        var pos_idx;

        if (new_state == "off") {
            for (idx = 1; idx <= 6; idx++) {
                pos_idx = $("#hSeat" + idx);
                pos_idx.hide();
                pos_idx.stop();
                pos_idx.css("width", "100%");
            }
        } else if (new_state == "on") {
            pos.show();
            pos.css("background-color", "#FE554C");
            pos.animate({
                "width": "0%"
            }, 31000);
        }
    });
    socket.on("i fold", function(decision, private_ids, zero) {
        socket.emit("player decision", decision, private_ids, zero);
    })
    socket.on("bankroll modification", function(seat_idx, player) {
        if (player.bankroll == "ALL IN")
            $("#player_bankroll" + seat_idx).text("ALL IN");
        else
            $("#player_bankroll" + seat_idx).text((Math.floor(player.bankroll * 100)) / 100 + "$");
    });
    socket.on("pot modification", function(pot_amount) {
        $("#pot").text(Math.floor(+pot_amount * 100) / 100 + "$");
    });
    socket.on("bet", function(seat_idx, amount) {
        if (!amount)
            $("#last_action" + seat_idx).text('');
        else {
            $("#last_action" + seat_idx).text((Math.floor(amount * 100)) / 100 + "$");
        }
    });

    socket.on("last action", function(decision, seat_nb, amount) {
        amount == 0 ? amount = "" : amount = " " + amount + "$";
        var nick = $("#player_name" + seat_nb).text();
        var str = decision.split(" ");
        var text = "<p>" + nick + " " + str[0] + amount + "</p>";

        $("#last_action").text(nick + " " + str[0] + amount);
        $("#histoContent").empty();
        $("#histoContent").append(text);
    });
    socket.on("fold", function(seat_nb) {
        $("#seat" + seat_nb).css('opacity', '0.3');
        $("#btn" + seat_nb).css("visibility", "hidden");
        $("#bet_val" + seat_nb).text('');
        $("#player_cards" + seat_nb).attr("src", "../img/avatar.png");
        $("#last_action" + seat_nb).text('FOLD');
    });
    socket.on("fold off", function() {
        var id;

        for (id = 1; id <= 6; id++) {
            $("#seat" + id).css('opacity', '1');
            $("#hSeat" + id).hide();
        }
    });
    socket.emit("get board");
    socket.on("send flop", function(card1, card2, card3) {
        $("#b1").attr("src", "img/cards/" + card1 + ".png");
        $("#b2").attr("src", "img/cards/" + card2 + ".png");
        $("#b3").attr("src", "img/cards/" + card3 + ".png");
        $("#b1, #b2, #b3").css("visibility", "visible");
    });
    socket.on("send turn", function(card4) {
        $("#b4").attr("src", "img/cards/" + card4 + ".png");
        $("#b4").css("visibility", "visible");
    });
    socket.on("send river", function(card5) {
        $("#b5").attr("src", "img/cards/" + card5 + ".png");
        $("#b5").css("visibility", "visible");
    });
    socket.on("remove last actions", function() {
        for (var idx = 1; idx <= 6; ++idx)
            $("#last_action" + idx).remove();
    });
    socket.on("remove board", function() {
        $("#b1, #b2, #b3, #b4, #b5").css("visibility", "hidden");
        for (var idx = 1; idx <= 6; ++idx)
            $("#player_cards" + idx).attr("src", "../img/avatar.png");
        $("#last_action").text('');
    });
    socket.on("remove emplacements", function() {
        for (var idx = 1; idx <= 6; ++idx)
            $("#btn" + idx).css("visibility", "hidden");
    });
    socket.on("show down", function(card1, card2, seat_nb) {
        if ($('#qr_spot' + seat_nb).css('visibility') == 'hidden') {
            if (card1 != -1 && card2 != -1) {
                $("#card1_" + seat_nb).attr("src", "../img/cards/" + card1 + ".png");
                $("#card2_" + seat_nb).attr("src", "../img/cards/" + card2 + ".png");
                $("#card1_" + seat_nb).css("visibility", "visible");
                $("#card2_" + seat_nb).css("visibility", "visible");
            } else {
                $("#card1_" + seat_nb).css("visibility", "hidden");
                $("#card2_" + seat_nb).css("visibility", "hidden");
            }
        }
    });
    socket.on("show down off", function(seat_nb) {
        $("#card1_" + seat_nb).css("visibility", "hidden");
        $("#card2_" + seat_nb).css("visibility", "hidden");
    });
    socket.on("winner", function(seat_nb, rank_name) {
        var disconnect = '<p>' + $("#player_name" + seat_nb).text() + ' won because player ' + rank_name + ' or folded</p>';
        var won = '<p>' + $("#player_name" + seat_nb).text() + ' won with ' + rank_name + '</p>';

        if (rank_name == "null")
            return;
        if (rank_name == 'disconnected') {
            $('#histoContent').empty();
            $('#histoContent').append(disconnect);
        } else if (seat_nb == 42 && rank_name == 'null') {
            $('#histoContent').empty();
            $('#histoContent').append('<p>Split !</p>');
        } else {
            $('#histoContent').empty();
            $('#histoContent').append(won);
        }
    });
    socket.on("win off", function() {
        $("#winner, #card1_1, #card2_1, #card1_2, #card2_2, #card1_3, #card2_3, #card1_4, #card2_4, #card1_5, #card2_5, #card1_6, #card2_6").css("visibility", "hidden");
    });
    socket.on("what is lock", function() {
        socket.emit("lock is true or false", lock);
    });
    socket.on("lock is true", function(vrai) {
        lock = vrai;
    })
    socket.on("lock is false", function(faux) {
        lock = faux;
    })
}

function check_timeLock(action) {
    timeLock = action;
}
