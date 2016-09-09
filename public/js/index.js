function 	init()
{
	var		end = setInterval(function()
	{
								try
								{
									if (jQueryReady && keyhandlerReady && eventIndexReady && mouseEventReady)
									{
										lib.init();
										sync_sv();
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
