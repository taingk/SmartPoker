function 	init()
{
	var		end = setInterval(function()
	{
								try
								{
									if (jQueryReady && keyhandlerReady && eventIndexReady && mouseEventReady)
									{
										lib.init();
										mouse_handler();
										clearInterval(end);
									}
								}
								catch (err)
								{
									alert("Error detected: " + err);
								}
						}, 100);
}
