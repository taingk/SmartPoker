function	remove_last_actions(table, val)
{
	var 	cpt;
	var		timer;

	if (val <= 0)
	{
		console.log("Bad value");
		return ;
	}
	cpt = val;
	setInterval(function()
		{
			if (!cpt)
			{
				io.to(table.id).emit("remove last actions");
				clearInterval(timer);
			}
			if (cpt > 0)
		    	--cpt;
		}, 1000);
}