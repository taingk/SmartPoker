// Doesn't work on Samsung TVs
function backToPortal()
{
	if (typeof SmartTvA_API != "undefined")
	{
      // Toshiba & Panasonic
      	try
      	{
    		SmartTvA_API.exit();
    	}
    	catch(e)
    	{
	    	window.history.back();
	    }
    }
    else if(window.NetCastBack)
    {
      //LG
        window.NetCastBack();
    }
    else if(/Philips/.test(navigator.userAgent))
    {
    		//philips
    		window.history.go(-999);
    }
    else
    {
    		// opera
    		window.close();
    }
}


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

			break;
		case "LEFT":

			break;
		case "OK":
			document.location.href="http://192.168.1.200:1337/";
			break;
		case "BACK":

			break;
		case 1:

			break;
		case 2:
	
			break;
		case 3:
	
			break;
		case 4:
		
			break;
		case "RED":
		
			break;
		case "GREEN":
		
			break;
		case "YELLOW":
		
			break;
		case "BLUE":
		
			break;
		}
}

var eventIndexReady=true;