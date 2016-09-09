/* Returns a handler of the table
**	table_id: id of the table to get.
**	tables: array of tables object.
*/
function	get_table(table_id, tables)
{
	var		idx = 0;

	while (idx < tables.length)
	{
		if (tables[idx].id == table_id)
			return tables[idx];
		++idx;
	}
	return "not found";
}