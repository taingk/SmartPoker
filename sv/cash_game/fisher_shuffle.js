/* Shuffling algorithm */
function 	fisher_shuffle(deck)
{
	var		idx = deck.length - 1;
	var		r_pos;
	var		tmp;

	if (deck.length <= 0)
		return (0);
	while (idx > 0)
	{
		if ((r_pos = Math.floor(Math.random() * idx)) < 0 || r_pos >= deck.length)
			return (0);
		tmp = deck[idx];
		deck[idx] = deck[r_pos];
		deck[r_pos] = tmp;
		--idx;
	}
	return (1);
}