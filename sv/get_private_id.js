/* Returns the private ID by only giving the private_ids array and the seat number as parameters */
function	get_private_id(private_ids, seat_nb)
{
	var		idx = 0;
	var		str;

	while (idx < 6)
	{
		str = private_ids[idx];
		if (str && +str[str.length - 1] == seat_nb)
			return str;
		++idx;
	}
	return 0;
}