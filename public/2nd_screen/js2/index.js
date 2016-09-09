function 	init_me()
{
	var		end = setInterval(function()
	{
								try
								{
									if (keyhandlerReady && mouseEventReady)
									{
										lib.init();
										$("#nick_zone").focus();
										mouse_handler_device();
										$('.ui-slider .ui-slider-handle').css('width', '4em');
										$('.ui-slider .ui-slider-handle').css('height', '4em');
										$('.ui-slider-horizontal .ui-slider-handle').css('top', '-33%');
										$('.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default').css('border', '5px solid black');
										$('.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default').css('border-radius', '50px');
										clearInterval(end);
									}
								}
								catch (err)
								{
									alert("Error detected: " + err);
								}
						}, 100);
}
