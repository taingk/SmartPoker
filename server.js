/*
 ** Server of the poker application - www.smartgames.tv
 ** Development contact: aimeric.seguin(at)gmail.com
 ** Project started: 20/08/2014.
 ** Last update: 13/10/2014.
 ** Copyright © 2014 Ngine Networks - All Rights Reserved.
 */

/*******************************************/
/*          	  MAJOR                    */
/*******************************************/
var cfg = require("./conf.json"); // Configuration file, mainly to use aliases/macros.
var express = require("express"); // Web application framework we use.
var app = express(); // Express server handle.
var http = require("http").createServer(app); // Web server object with express server as request listener.
var io = require("socket.io")(http); // Socket interface, server side.
var nsp = require("express-namespace"); // Namespace utility.
var shortId = require("shortid"); // Universal short unique-ID generator.
var table_name; // Common table name prefix.
var table_id; // Unique table name suffix. (example: /pokertable-Zqc9qQWZf).
var seat_nb; // Seat number (1 to 6 included).
var fs = require("fs"); // Files parsing utility.
var device_client; // Identify client type.
var _ = require("underscore"); // Required.
var texas = require("texas"); // Poker Hands evaluator we use.

/*******************************************/
/*          	ROUTING                    */
/*******************************************/
var tables_ids = new Array(); // List of tables ID (in order to check the existence of a table).

app.get("/", function(request, response) {
    table_id = shortId.generate(); // "pro" for test only.
    table_name = "pokertable-" + table_id;
    tables_ids.push(table_id);
    response.redirect(cfg.conf.host + ":" + cfg.conf.port + "/" + table_name);
});

var router = express.Router(); // Express router we use.

router.get("/pokertable-:name", function(request, response) {
    table_id = request.params.name; // Table ID is which indicates on the URL.
    if (tables_ids.indexOf(table_id) != -1) {
        device_client = false;
        response.sendFile("public/index.html", {
            root: __dirname
        });
    } else {
        response.status(404);
        response.sendFile("public/table_not_found.html", {
            root: __dirname
        });
    }
});

router.get("/seat-:name", function(request, response) {
    if (tables_ids.indexOf(request.params.name.substr(5)) != -1) {
        device_client = true;
        seat_nb = +request.params.name[0];
        table_id = request.params.name.substr(5); // Indicate we are not on a table.
        if (seat_nb <= 0 || seat_nb >= 7) {
            response.status(404);
            response.sendFile("public/2nd_screen/page_not_found.html", {
                root: __dirname
            });
        }
        response.sendFile("public/2nd_screen/login.html", {
            root: __dirname
        });
    } else if (request.params.name == "disconnected.html") {
        response.sendFile("public/2nd_screen/disconnected.html", {
            root: __dirname
        });
    } else {
        response.status(404);
        response.sendFile("public/2nd_screen/page_not_found.html", {
            root: __dirname
        });
    }
});

app.use('/', router);

/*******************************************/
/*          	PATH                   	   */
/*******************************************/
app.use(express.static(__dirname + '/public')); // Serve files in ./public using the express.static() middleware.
app.use(express.static(__dirname + '/public/img'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public/2nd_screen'));
app.use(express.static(__dirname + '/public/2nd_screen/js2'));

/*******************************************/
/*            SPECIAL STATUS               */
/*******************************************/
// When Express has executed all middleware/routes, and found that none of them responded then...
app.use(function(request, response) {
    response.status(404);
    response.sendFile("public/2nd_screen/page_not_found.html", {
        root: __dirname
    });
});

/********************************************/
/*          	PORT                        */
//*******************************************/
http.listen(cfg.conf.port, function(request, response) {
    console.log("Running at " + cfg.conf.host + " from " + __dirname);
});

/*******************************************/
/*           SERVER INCLUDED OBJECTS       */
/*******************************************/
eval(fs.readFileSync("sv/objects.js").toString());
eval(fs.readFileSync("sv/new_table.js").toString());
eval(fs.readFileSync("sv/new_table_seats.js").toString());
eval(fs.readFileSync("sv/get_table.js").toString());
eval(fs.readFileSync("sv/get_private_id.js").toString());
eval(fs.readFileSync("sv/table_general_socket.js").toString());
eval(fs.readFileSync("sv/players_general_socket.js").toString());
eval(fs.readFileSync("sv/send_qrcodes.js").toString());
eval(fs.readFileSync("sv/send_seats_infos.js").toString());
eval(fs.readFileSync("sv/send_bets.js").toString());
eval(fs.readFileSync("sv/get_seat.js").toString());
eval(fs.readFileSync("sv/cash_game/fisher_shuffle.js").toString());
eval(fs.readFileSync("sv/cash_game/timer.js").toString());
eval(fs.readFileSync("sv/cash_game/check_blanks.js").toString());
eval(fs.readFileSync("sv/cash_game/new_cashgame.js").toString());
eval(fs.readFileSync("sv/cash_game/show_down.js").toString());
eval(fs.readFileSync("sv/cash_game/end_game.js").toString());
eval(fs.readFileSync("sv/cash_game/evalhand.js").toString());
eval(fs.readFileSync("sv/cash_game/deal_board.js").toString());
eval(fs.readFileSync("sv/cash_game/remove_last_actions.js").toString());
eval(fs.readFileSync("sv/cash_game/check_bets.js").toString());

/*******************************************/
/*          SOCKET INTERACTIONS            */
/*******************************************/
var tables = new Array(); // Array of tables objects.
var table; // Current table handler.
var private_channel; // Device private channel.
var clients = [];

io.on("connection", function(socket) {
    var client_ip = socket.request.connection.remoteAddress;
    var curgame;

    if (typeof table_id === "undefined")
        return;
    console.log("New connection from " + client_ip);
    if ((table = get_table(table_id, tables)) == "not found" && !device_client) {
        var deck = new Array('2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'tc', 'jc', 'qc', 'kc', '1c',
            '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'ts', 'js', 'qs', 'ks', '1s',
            '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'td', 'jd', 'qd', 'kd', '1d',
            '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'th', 'jh', 'qh', 'kh', '1h');
        console.log("Creating a new table...\nTable ID: " + table_id);
        curgame = new Game(deck, -1, -1, cfg.conf.small_blind, -1, cfg.conf.big_blind, 0, 0, 0, 0, "waiting", 0, new Array());
        table = new_table(table_id, 0, "waiting", new Array(), +cfg.conf.start_bankroll, new_table_seats(), curgame, new Array(), new Array()); // We're also calling a function.
        tables.push(table);
        socket.join(table.id);
        send_qrcodes(table, table.seats);
        table.game.turn_to = "joiners";

        io.to(table.id).emit('tableId', table.id, get_table(table.id, tables), get_table(table.id, tables).game);

        socket.on('get tableId and tableGame', function(id) {
            io.to(id).emit('give tableId and tableGame', get_table(id, tables), get_table(id, tables).game);
        });

        socket.on('re init', function(table, game) {
            var player;

            evalhand(table, game);
            for (idx = 1; idx <= 6; ++idx) {
                player = get_seat(table.seats, idx).player;
                console.log(player);
                io.to(table.id).emit("show down", player.card1, player.card2, idx);
            }
            show_down(table, game);
        });
    }
    if (device_client) {
		hide_qr(table, seat_nb);
        if (!get_private_id(table.private_ids, seat_nb)) {
            console.log(table.private_ids);
            private_channel = table_id + seat_nb; //shortId.generate() + seat_nb;
            table.private_ids.push(private_channel);
            socket.on("get private channel", function() {
                socket.emit("private channel", private_channel, seat_nb);
            });
            socket.join(private_channel);
            console.log("Joining private channel " + private_channel);
            socket.on("disconnect", function() {
                var i = 0;
                var j = null;

                console.log("Seat 'waiting' disconnect");
                for (; i < table.private_ids.length; i++) {
                    j = table.private_ids[i];
                    if (j == private_channel)
                        table.private_ids.splice(i, 1);
                }
                io.to(table.id).emit("kick player", seat_nb);
            });
        } else {
            console.log("Seat busy");
        }
    }
    socket.on("disconnect", function() {
        re_qr(table, seat_nb);
    });
	socket.on("action done", function() {
		var action = true;
		check_timeLock(action);
	});
    //io.to(table.id).emit("double blind", cfg.conf.small_blind, cfg.conf.big_blind);
    /*  socket.on("get qrcodes", function()
    {
    	send_qrcodes(table, table.seats);
    });*/
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
    send_bets(table); // Currents bets on the table.
    socket_listens_players(socket, table);
    socket_listens_global_settings(socket, table, table.seats); // Event handler for major events.
});
