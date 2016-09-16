function	deal_flop(table, game)
{
	game.board[0] = game.deck[0];
	game.board[1] = game.deck[1];
	game.board[2] = game.deck[2];
	game.deck.splice(0, 3);
	io.to(table.id).emit("send flop", game.board[0], game.board[1], game.board[2]);
}

function	deal_turn(table, game)
{
	game.board[3] = game.deck[3];
	game.deck.splice(0, 1);
	io.to(table.id).emit("send turn", game.board[3]);
}

function	deal_river(table, game)
{
	game.board[4] = game.deck[4];
	game.deck.splice(0, 1);
	io.to(table.id).emit("send river", game.board[4]);
}

function	deal_all(table, game) {
	game.board[0] = game.deck[0];
	game.board[1] = game.deck[1];
	game.board[2] = game.deck[2];
	game.board[3] = game.deck[3];
	game.board[4] = game.deck[4];
	game.deck.splice(0, 5);
	io.to(table.id).emit("send flop", game.board[0], game.board[1], game.board[2]);
	io.to(table.id).emit("send turn", game.board[3]);
	io.to(table.id).emit("send river", game.board[4]);
}
