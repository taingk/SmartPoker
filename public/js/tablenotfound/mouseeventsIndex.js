function	redirects_on_new_table()
{
	document.location.href= "http://192.168.1.200:1337/";
}

function	mouse_handler()
{
	$("#new_table_btn").click(redirects_on_new_table);
}

var	mouseEventReady = true;