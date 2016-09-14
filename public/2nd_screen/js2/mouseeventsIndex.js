var			g_nickname;
var			g_connected = 0;

function	register_player()
{
	g_nickname = $("#nick_zone").val();
	if (!g_connected)
		socket.emit("is valid nickname", g_nickname, seat_nb);

	socket.on("is valid nickname info", function(res, nick)
	{
		if (res == "invalid" && !g_connected)
			$("#msg").text("Size must be between 2 and 8 characters without blanks!");
		else if (res == "valid" && !g_connected)
		{
			socket.emit("socket nickname on table", g_nickname);
			$("#msg").text("");
			$("#play").remove();
			$("#nick_zone").remove();
			$('#container').css("background-image", "url(img/please_wait.png)");
			$("#player_name").css("visibility", "hidden");
			$("#player_name").text(nick);
			g_connected = 1;
		}
		else if (res == "seat busy" && !g_connected)
			$("#msg").text("Seat busy. Please wait or choose another one.");
		else if (res == "already taken" && !g_connected)
			$("#msg").text("This nickname is already taken!");
	});
	socket.on("player name info")
		socket.emit("socket nickname on table", g_nickname);
	socket.on("first deal", function(card1, card2)
	{
		if (g_connected)
		{
			if ($("#container").css("background-image") != "url(img/player_decision.png)");
				$('#container').css("background-image", "url(img/player_decision.png)");
			$("#card1, #card2, #aim, #player_name, #slider, #hide_cards").css("visibility", "visible");
			$("#card1").attr("src", "img/cards/" + card1 + ".png");
			$("#card2").attr("src", "img/cards/" + card2 + ".png");
			$("#ui-state-default").focus();
			$("#curtain").css("visibility", "hidden");
		}
	});
	socket.on("first suit", function(suit)
	{
		$("#hand_value").text(suit);
	});
	socket.on("raise limits", function(r1, r2)
	{
		if (r1 >= 0) {
			$("#min_bet").text((Math.floor(+r1 * 100)) / 100 + "$");
			$("#c2_amount").text((Math.floor(+r1 * 100)) / 100 + "$");
		}
		if (r2 >= 0)
			$("#max_bet").text((Math.floor(+r2 * 100)) / 100 + "$");
	});
	socket.on("first choice", function(choice, amount)
	{
		$('#bet_pot').css("visibility", "visible");
		$("#choice1").css("visibility", "visible");
		$("#choice2").css("visibility", "visible");
		$("#choice3").css("visibility", "visible");
		$("#hide_cards").css("visibility", "visible");
		if (choice == "call" && amount >= 0)
		{
			$("#c1").text("CALL");
			$("#c1_amount").text((Math.floor(+amount * 100)) / 100 + "$");
		}
		else if (choice == "check")
		{
			$("#c1").text("CHECK");
			$("#c1_amount").text('');
		}
	});
	socket.on("second choice", function(choice, amount)
	{
		console.log('choice = '  +choice);
		if (choice == "call" && amount >= 0)
		{
			$('#choice2').show();
			$("#c2").text("CALL");
			$("#c2_amount").text((Math.floor(+amount * 100)) / 100 + "$");
		}
		else if (choice == "null" && amount < 0)
		{
			$('#choice2').hide();
		}
		else if ((choice == "raise" || choice == "bet") && amount >= 0)
		{
			if (!amount)
				console.log('amount : ' + amount);
			$('#choice2').show();
			$("#c2").text(choice.toUpperCase() + " +");
			$("#c2_amount").text((Math.floor(amount * 100)) / 100 + "$");
			$("#raise_amount").text((Math.floor(amount * 100)) / 100 + "$");
		}
	});
	socket.on("cancel buttons", function(hidden){
		$("#choice1").css("visibility", hidden);
		$("#choice2").css("visibility", hidden);
		$("#choice3").css("visibility", hidden);
	});
	socket.on("show buttons", function(visible){
		$("#choice1").css("visibility", visible);
		$("#choice2").css("visibility", visible);
		$("#choice3").css("visibility", visible);
	});
	socket.on("third choice", function(choice)
	{
		$("#c3").text("FOLD");
	});
	socket.on("turn wait", function()
	{
		$("#curtain").css("visibility", "visible");
	});
	socket.on("your turn", function()
	{
		$("#curtain").css("visibility", "hidden");
		$("#raise_amount").text($("#min_bet").text());
		$('.ui-slider-horizontal .ui-slider-handle').css('left', '0%');
	});
	socket.on("init cards", function()
	{
		$("#card1, #card2").attr("src", "img/cards/card_back.png");
	});
}

function	choice1_chose()
{
	if ($("#c1").text() == "CHECK")
		socket.emit("player decision", "CHECK", channel + seat_nb.toString(), 0);
	else
		socket.emit("player decision", "CALL", channel + seat_nb.toString(), $("#c1_amount").text());
}

function	choice2_chose(cdeux)
{
	socket.emit("player decision", cdeux, channel + seat_nb.toString(), $("#c2_amount").text());
}

function	choice3_chose()
{
	socket.emit("player decision", "FOLD", channel + seat_nb.toString(), 0);
}

function	hide_cards()
{
	var		visibility = $("#card1, #card2").css("visibility");

	if (!g_connected)
		return ;
	if (visibility != "hidden")
		$("#card1, #card2, #hand_value").css("visibility", "hidden");
	else
		$("#card1, #card2, #hand_value").css("visibility", "visible");
}

function pot1_chosen() {
	socket.emit('get pot amount');
	socket.on('pot amount', function(pot) {
		var UnTier = pot/3;
		var max_bet = parseFloat($('#max_bet').text().substring(-1));
		var min_bet = parseFloat($('#min_bet').text().substring(-1));
		var toSlide = ((UnTier/max_bet).toFixed(2))*100;

		if (toSlide >= 100) {
			$("#c2_amount").text(max_bet.toFixed(2) + "$");
			$("#raise_amount").text(max_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '97%');
		}
		else if (UnTier <= min_bet){
			$("#c2_amount").text(min_bet.toFixed(2) + "$");
			$("#raise_amount").text(min_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '-3%');
		}
		else {
			$("#c2_amount").text(UnTier.toFixed(2) + "$");
			$("#raise_amount").text(UnTier.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', toSlide+'%');
		}
	});
}

function pot2_chosen() {
	socket.emit('get pot amount');
	socket.on('pot amount', function(pot) {
		var UnTier = pot = pot / 3;
		var DeuxTier = UnTier + UnTier;
		var max_bet = parseFloat($('#max_bet').text().substring(-1));
		var min_bet = parseFloat($('#min_bet').text().substring(-1));
		var toSlide = ((DeuxTier/max_bet).toFixed(2))*100;

		if (toSlide >= 100) {
			$("#c2_amount").text(max_bet.toFixed(2) + "$");
			$("#raise_amount").text(max_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '97%');
		}
		else if (DeuxTier <= min_bet){
			$("#c2_amount").text(min_bet.toFixed(2) + "$");
			$("#raise_amount").text(min_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '-3%');
		}
		else {
			$("#c2_amount").text(DeuxTier.toFixed(2) + "$");
			$("#raise_amount").text(DeuxTier.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', toSlide+'%');
		}
	});
}

function pot3_chosen() {
	socket.emit('get pot amount');
	socket.on('pot amount', function(pot) {
		var max_bet = parseFloat($('#max_bet').text().substring(-1));
		var min_bet = parseFloat($('#min_bet').text().substring(-1));
		var toSlide = ((pot/max_bet).toFixed(2))*100;

		if (toSlide >= 100) {
			$("#c2_amount").text(max_bet.toFixed(2) + "$");
			$("#raise_amount").text(max_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '97%');
		}
		else if (pot <= min_bet){
			$("#c2_amount").text(min_bet.toFixed(2) + "$");
			$("#raise_amount").text(min_bet.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', '-3%');
		}
		else {
			$("#c2_amount").text(pot.toFixed(2) + "$");
			$("#raise_amount").text(pot.toFixed(2) + "$");
			$('.ui-slider-horizontal .ui-slider-handle').css('left', toSlide+'%');
		}
	});
}

function allin_chosen() {
	var allin = parseFloat($('#max_bet').text().substring(-1));
	$("#c2_amount").text(allin.toFixed(2) + "$");
	$("#raise_amount").text(allin.toFixed(2) + "$");
	$('.ui-slider-horizontal .ui-slider-handle').css('left', '97%');
}

function	mouse_handler_device()
{
	$("#play").click(register_player);
	$("#choice1").click(choice1_chose);
	$("#choice2").click(choice2_chose($('#c2').text()));
	$("#choice3").click(choice3_chose);
	$("#hide_cards").click(hide_cards);
	$('#pot1').click(pot1_chosen);
	$('#pot2').click(pot2_chosen);
	$('#pot3').click(pot3_chosen);
	$('#allin').click(allin_chosen);
	$('#disconnect').click(function() {
		socket.disconnect();
		window.location = "http://poker.smartgames.tv/seat-disconnected.html";
	});
}

var	mouseEventReady = true;
