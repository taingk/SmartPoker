function	new_table(table_id, players_nb, viewers_nb, state, nicknames, start_bankroll, curgame, playing_seats, private_ids)
{
	if (typeof table_id === "undefined")
		return ;
	return new Table(table_id, players_nb, viewers_nb, state,
					 nicknames, start_bankroll, curgame,
					 playing_seats, private_ids);
}