function		check_blanks(nickname)
{
	var			idx = 0;
	var			invalid = 0;

	while (nickname[idx])
	{
		if (nickname[idx] == ' ' || nickname[idx] == '\t' ||nickname[idx] == '\n')
			invalid = 1;
		++idx;
	}
	return invalid;
}