// Keyhandler for some TVs. Doesn't work with Samsung ones.
function 	keyFunction(evnt)
{
	switch (evnt)
	{
		case "UP":
			break;
		case "DOWN":
			break;
		case "RIGHT":
			move_right();
			break;
		case "LEFT":
			move_left();
			break;
		case "OK":
		//if (push == true)
			valid_choice();
		//else
		//	confirm();
			break;
		case "BACK":
			back_func();
			break;
		case 1:
			new_table();
			break;
		case 2:
			show_prompt(1);
			break;
		case 3:
			show_prompt(2);
			break;
		case 4:
			backToPortal();
			break;
		case 5:
		//	restart();
			break;
		case "RED":
			new_table();
			break;
		case "GREEN":
			show_prompt(1);
			break;
		case "YELLOW":
			show_prompt(2);
			break;
		case "BLUE":
			backToPortal();
			break;
		}
}

function 	new_table()
{
	document.location.href="http://poker.smartgames.tv/";
}

// Doesn't work on Samsung TVs
function backToPortal()
{
	lib.back.general();
}

var			g_pos = 0;
var			divs = new Array("#new_table", "#show_links", "#help", "#exit");

function 	gui_pos_modification()
{
	for (var idx = 0; idx < divs.length; ++idx)
	{
		if (idx != g_pos)
			$(divs[idx]).removeClass('border');
	}
	$(divs[g_pos]).addClass('border');
}

function 	move_right()
{
	if (g_pos < 3)
		++g_pos;
	else if (g_pos == 3)
		g_pos = 0;
	gui_pos_modification();
}

function 	move_left()
{
	if (g_pos > 0)
		--g_pos;
	else if (g_pos == 0)
		g_pos = 3;
	gui_pos_modification();
}

function 	show_prompt(prompt_nb)
{
	var		attribute = $('#prompt' + prompt_nb).css('visibility') == 'hidden' ? 'visible' : 'hidden';

	$('#prompt' + prompt_nb).css("visibility", attribute);
}



function 	valid_choice()
{
	if (g_pos == 0)
		new_table();
	else if (g_pos == 1)
		show_prompt(1);
	else if (g_pos == 2)
		show_prompt(2);
	else if (g_pos == 3)
		backToPortal();
}

function 	back_func()
{
	var		attribute1 = $("#prompt1").css('visibility');
	var		attribute2 = $("#prompt2").css('visibility');

	if (attribute1 === "hidden" && attribute2 === "hidden")
		return backToPortal();
	if (attribute1 === 'visible')
		show_prompt(1);
	if (attribute2 === 'visible')
		show_prompt(2);
}

var eventIndexReady=true;
