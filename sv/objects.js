/*
**	Server Objects part.
**	Each session represents one distinct object.
**  Copyright © 2014 Ngine Networks - All Rights Reserved.
/*

/*******************************************/
/*              TABLE OBJECT               */
/*******************************************/
function	Table(id, players_nb, state, nicknames, start_bankroll, seats, game, playing_seats, private_ids, reinit)
{
	this.id = id;
	this.players_nb = players_nb;
	this.state = state;
	this.nicknames = nicknames;
	this.start_bankroll = start_bankroll;
	this.seats = seats;
	this.game = game; // Game OBJ
	this.playing_seats = playing_seats; // Array representing seats "inside a game".
	this.private_ids = private_ids; // Array of seats channel for socket.
}

/*******************************************/
/*              SEATS OBJECTS (2)          */
/*******************************************/
function 	Seats(seat1, seat2, seat3, seat4, seat5, seat6)
{
	this.seat1 = seat1;
	this.seat2 = seat2;
	this.seat3 = seat3;
	this.seat4 = seat4;
	this.seat5 = seat5;
	this.seat6 = seat6;
}

function 	Seat(state, player, bet)
{
	this.state = state;
	this.player = player; // Player OBJ
	this.bet = bet; // Bet on the table (close to the seat)
}

/*******************************************/
/*              PLAYERS OBJECTS            */
/*******************************************/
function	Player(seat_nb, nickname, bankroll, card1, card2, rank_name, rank_value)
{
	this.seat_nb = seat_nb;
	this.nickname = nickname;
	this.bankroll = bankroll;
	this.card1 = card1;
	this.card2 = card2;
	this.rank_name = rank_name;
	this.rank_value = rank_value;
}

/*******************************************/
/*              GAME OBJECTS            */
/*******************************************/
function	Game(deck, d_pos, sb_pos, sb_amount, bb_pos, bb_amount, pot_amount, highlights_pos, curbet, turn_to, moment, round_nb, board)
{
	this.deck = deck;
	this.d_pos= d_pos;
	this.sb_pos = sb_pos;
	this.sb_amount = sb_amount;
	this.bb_pos = bb_pos;
	this.bb_amount = bb_amount;
	this.pot_amount = pot_amount;
	this.highlights_pos = highlights_pos; // Current player position.
	this.curbet = curbet; // Amount to pay to place a simple call.
	this.moment = moment;	// Waiting ||Preflop || Flop[1-4] || Turn[1-4] || River[1-4]
	this.round_nb = round_nb; // 0|1|2|3|4
	this.board = board; // Array of board cards
}
