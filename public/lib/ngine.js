//object library
var lib = {};
lib.int_app = null;
lib.int_keyset = null;
lib.int_ksVisible = null;

if (typeof(VK_BACK) == 'undefined') VK_BACK = 461;
if (typeof(VK_BACK_OPERA) == 'undefined') VK_BACK_OPERA = 8;
if (typeof(VK_ENTER) == 'undefined') VK_ENTER = 13;

if (typeof(VK_LEFT) == 'undefined') VK_LEFT = 37;
if (typeof(VK_UP) == 'undefined') VK_UP = 38;
if (typeof(VK_RIGHT) == 'undefined') VK_RIGHT = 39;
if (typeof(VK_DOWN) == 'undefined') VK_DOWN = 40;

if (typeof(VK_RED) == 'undefined') VK_RED = 403;
if (typeof(VK_GREEN) == 'undefined') VK_GREEN = 404;
if (typeof(VK_YELLOW) == 'undefined') VK_YELLOW = 405;
if (typeof(VK_YELLOW_OPERA) == 'undefined') VK_YELLOW_OPERA = 502;
if (typeof(VK_BLUE) == 'undefined') VK_BLUE = 406;

if (typeof(VK_PLAY) == 'undefined') VK_PLAY = 415;
if (typeof(VK_STOP) == 'undefined') VK_STOP = 413;
if (typeof(VK_PAUSE) == 'undefined') VK_PAUSE = 414;
if (typeof(VK_FAST_FWD) == 'undefined') VK_FAST_FWD = 473;
if (typeof(VK_REWIND) == 'undefined') VK_REWIND = 412;

if (typeof(VK_0) == 'undefined') VK_0 = 48;
if (typeof(VK_1) == 'undefined') VK_1 = 49;
if (typeof(VK_2) == 'undefined') VK_2 = 50;
if (typeof(VK_3) == 'undefined') VK_3 = 51;
if (typeof(VK_4) == 'undefined') VK_4 = 52;
if (typeof(VK_5) == 'undefined') VK_5 = 53;
if (typeof(VK_6) == 'undefined') VK_6 = 54;
if (typeof(VK_7) == 'undefined') VK_7 = 55;
if (typeof(VK_8) == 'undefined') VK_8 = 56;
if (typeof(VK_9) == 'undefined') VK_9 = 57;

//Function called after keydown event
lib.eventExe = function(e) {

    var exitReturn;
    switch (e) {
        case VK_UP:
            keyFunction("UP");
            exitReturn = true;
            break;
        case VK_DOWN:
            keyFunction("DOWN");
            exitReturn = true;
            break;
        case VK_LEFT:
            keyFunction("LEFT");
            exitReturn = true;
            break;
        case VK_RIGHT:
            keyFunction("RIGHT");
            exitReturn = true;
            break;
        case VK_ENTER:
            keyFunction("OK");
            exitReturn = true;
            break;
        case VK_0:
            keyFunction(0);
            exitReturn = true;
            break;
        case VK_1:
            keyFunction(1);
            exitReturn = true;
            break;
        case VK_2:
            keyFunction(2);
            exitReturn = true;
            break;
        case VK_3:
            keyFunction(3);
			portalControllerBack();
            exitReturn = true;
            break;
        case VK_4:
            keyFunction(4);
            exitReturn = true;
            break;
        case VK_5:
            keyFunction(5);
            exitReturn = true;
            break;
        case VK_6:
            keyFunction(6);
            exitReturn = true;
            break;
        case VK_7:
            keyFunction(7);
            exitReturn = true;
            break;
        case VK_8:
            keyFunction(8);
            exitReturn = true;
            break;
        case VK_9:
            keyFunction(9);
            exitReturn = true;
            break;
        case VK_RED:
            keyFunction("RED");
            exitReturn = true;
            break;
        case VK_YELLOW:
            keyFunction("YELLOW");
			portalControllerBack();
            exitReturn = true;
            break;
        case VK_YELLOW_OPERA:
            keyFunction("YELLOW");
			portalControllerBack();
            exitReturn = true;
            break;
        case VK_GREEN:
            keyFunction("GREEN");
            exitReturn = true;
            break;
        case VK_BLUE:
            keyFunction("BLUE");
            exitReturn = true;
            break;
        case VK_PLAY:
            keyFunction("PLAY");
            exitReturn = true;
            break;
        case VK_PAUSE:
            keyFunction("PAUSE");
            exitReturn = true;
            break;
        case VK_STOP:
            keyFunction("STOP");
            exitReturn = true;
            break;
        case VK_BACK:
            keyFunction("BACK");
            exitReturn = true;
            break;
        case VK_BACK_OPERA:
            keyFunction("BACK");
            exitReturn = true;
            break;
        case VK_FAST_FWD:
            keyFunction("FAST_FWD");
            exitReturn = true;
            break;
        case VK_REWIND:
            keyFunction("REWIND");
            exitReturn = true;
            break;
        default:
            exitReturn = false;
    }
    return exitReturn;
};

function portalControllerBack()
{
	var currentURL = window.location.href;
	var pattHashtag = /#\w+/; // Regex qui cherche #... jusqu'à ? (#NOad etc...)
	var resultH;

	if (resultH = pattHashtag.exec(currentURL)) {
		switch(resultH[0]) {
			case '#adsound':
				window.history.pushState({}, document.title, '#adsound');
				break;
			case '#ad':
				window.history.pushState({}, document.title, '#ad');
				break;
			case '#NOadsound':
				window.history.pushState({}, document.title, '#NOadsound');
				break;
			case '#NOad':
				window.history.pushState({}, document.title, '#NOad');
				break;
			case '#sound':
				window.history.pushState({}, document.title, '#sound');
				break;
			default:
				window.history.pushState({}, document.title, '#quit_game_url');
				break;
		}
	} else {
		window.history.pushState({}, document.title, '#quit_game_url');
	}
}

function checkAd()
{
	var currentURL = window.location.href;
	var pattHashtag = /#\w+/; // Regex qui cherche #... jusqu'à ? (#NOad etc...)
	var resultH;

	if (resultH = pattHashtag.exec(currentURL)) {
		switch(resultH[0]) {
			case '#NOadsound':
				return 0;
			case '#NOad':
				return 0;
			case '#sound':
				return 0;
			default:
				return 1;
		}
	} else {
		return 1;
	}
}

function checkSound()
{
	var currentURL = window.location.href;
	var pattHashtag = /#\w+/; // Regex qui cherche #... jusqu'à ? (#NOad etc...)
	var resultH;

	if (resultH = pattHashtag.exec(currentURL)) {
		switch(resultH[0]) {
			case '#adsound':
				return 0;
			case '#NOad':
				return 0;
			case '#sound':
				return 0;
			default:
				return 1;
		}
	} else {
		return 0;
	}
}

function checkToshUrlBack()
{
	var currentUrl = window.location.href;
	var pattTosh = /'(.+)'/; // Regex qui cherche entre les ' '
	var resultTosh;

	if (resultTosh = pattTosh.exec(currentUrl)) {
		alert(resultTosh[1]);
		return resultTosh[1];
	} else {
		return;
	}
}


//function to initiate application
lib.init = function() {
    lib.toshiba();

    /*if (checkSound() == 0) {
      playsong();
      setInterval(function() {playsong();}, 120000);
  }*/

    //$('#log').append('lib.init 1');
    //var handlerToshiba = false;

    //document listener
    if (window.KeyboardEvent) {
        document.addEventListener("keydown", function(e){
            //if ((event.type == 'keydown' && !('repeat' in event)) || (event.type == 'keypress' && ('repeat' in event))) {
            //    $('#log').append('il return');
            //    return;
            //}
    		if(lib.eventExe(e.keyCode)){
                //$('#log').append('handler toshiba');
    			e.preventDefault();
            }
    	},false);
    } else {
        document.addEventListener('keypress', function(e){
            //if ((event.type == 'keydown' && !('repeat' in event)) || (event.type == 'keypress' && ('repeat' in event))) {
            //    $('#log').append('il return');
            //    return;
            //}
    		if(lib.eventExe(e.keyCode)){
                //$('#log').append('handler toshiba');
    			e.preventDefault();
            }
    	},false);
    }/*
    function handler(e) {
        if ((event.type == 'keydown' && !('repeat' in event)) || (event.type == 'keypress' && ('repeat' in event))) {
            $('#log').append('il return');
            return;
        }
        if (lib.eventExe(e.keyCode)) {
            $('#log').append('handler');
            e.preventDefault();
        }

    }

    if (!handlerToshiba) {
        document.addEventListener("keydown", function(e){
    		if(lib.eventExe(e.keyCode)){
                //$('#log').append('handler toshiba');
    			e.preventDefault();
            }
    	},false);
    }*/
};


lib.hbbtv = function() {

    var appmgr = document.createElement('object');
    appmgr.setAttribute('id', "oipfID");
    appmgr.setAttribute('type', "application/oipfApplicationManager");
    appmgr.setAttribute('style', "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px;");

    var oipfcfg = document.createElement('object');
    oipfcfg.setAttribute('type', "application/oipfConfiguration");
    oipfcfg.setAttribute('style', "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px;");

    document.body.appendChild(appmgr);
    document.body.appendChild(oipfcfg);

    // set appMngr to the application/oipfApplicationManager object
    var appMgr = document.getElementById("oipfID");
    if (typeof(appMgr.getOwnerApplication) !== "undefined") {
        // create the application
        lib.int_app = appMgr.getOwnerApplication(document);
        //setting remote control buttons
        lib.int_keyset = lib.int_app.privateData.keyset;
        lib.int_ksVisible = 0xFFF; //0x33F color + nav + vcr + numeric + alpha
        lib.int_app.show();
        lib.int_keyset.setValue(lib.int_ksVisible);
    }
};

lib.toshiba = function() {
    // If the library is not already loaded
    if (typeof com == "undefined") {
        // Create a script tag to load the library
        /*var script = document.createElement('script');
        script.src = "http://dtv-api.toshibaplaces.com/toshiba-js-utils/2.0/js/toshiba-js-utils.js";
        document.getElementsByTagName('head')[0].appendChild(script);*/
    }

};


// backToPortal function
lib.back = {

    general: function() {
        if (window.location.href.substr(-8) == '#adsound') {
          window.location = 'http://smartgames.tv/vprod/fPortal/index.php?brand=Opera';
        }
        else if (window.location.href.substr(-6) == '#sound') {
          window.location = 'http://smartgames.tv/vprod/fPortal/index.php?brand=ToshibaPlaces';
        }
        else if (window.location.href.substr(-10) == '#NOadsound') {
          window.location = 'http://smartgames.tv/vprod/fPortal/index.php?brand=HiSense';
        }
        else {
            if (typeof SmartTvA_API != "undefined" && typeof SmartTvA_API.exit == "function") {
                $('#log').append('sta');
                //thoshiba & panasonic
                lib.back.go.sta();
            }  else if (/SmartTvA/.test(navigator.userAgent)) {
                $('#log').append('sta devices');
                //Other STA devices
                lib.back.go.sta();
            } else if (/TOSHIBA-DTV/.test(navigator.userAgent)) {
                $('#log').append('vestel2');
                //Vestel Toshiba
                lib.back.go.vestelTosh();
            } else if (/Toshiba/.test(navigator.userAgent)) {

                //toshiba Places
                lib.back.go.oldToshiba();
            } else if (window.NetCastBack) {
                //LG
                lib.back.go.lg();
            } else if (/Philips/.test(navigator.userAgent)) {
                //philips
                lib.back.go.philips();
            }else if (/NETRANGEMH/.test(navigator.userAgent)) {
                // Netrange
                lib.back.go.netrange();
            } else if (lib.back.IsVeselTV()) {
                //vestel
                lib.back.go.vestel();
            } else if (/Presto/.test(navigator.userAgent)) {
                //Opera
                lib.back.go.opera();
            } else if (/TV Store[ \/][0-9]+/.test(navigator.userAgent)) {
                //Opera
				$('#log').append('Tvstore 2');
                lib.back.go.opera();
            } else {
                // Default
                window.history.back();
            }
        }
    },

    game: function() {
        lib.cookie.set("sg_back", "back", 60);
        window.location.replace(document.referrer);
    },
    go: {
        opera: function() {
            window.close();
        },

        netrange: function() {
            // For back.netrange function
            var lastHistoryPos = window.history.length - 1;
            window.history.go(lastHistoryPos - window.history.length);
        },

        vestel: function() {
            //document.location.href = 'http://portal-tv.com';
            window.history.back();
        },

        vestelTosh: function() {
            window.history.back();
        },

        philips: function() {
            window.history.go(-999);
        },

        lg: function() {
            window.NetCastBack();
        },

        oldToshiba: function() {
			$('#log').append('toshiba back<br>')
            if (/ToshibaTP\/2.0/.test(navigator.userAgent)) {
                //toshiba 2013
				$('#log').append('go to could lite portal');
				com.toshiba.api.goToCloudLitePortal();
            } else {
                //toshiba < 2013
				$('#log').append('toshiba places<br>');
                //com.toshiba.api.goToshibaPlacesPortal();
				window.location = checkToshUrlBack();
            }
        },

        sta: function() {
            try {
                SmartTvA_API.exit();
            } catch (e) {
                window.history.back();
            }
        }
    },
    IsVeselTV: function() {
        try {

            var obj = document.createElement("object");

            obj.type = "systeminfoobject";

            obj.style.position = "absolute";

            obj.style.visibility = "hidden";

            document.body.appendChild(obj);

            if (typeof obj.vendor == 'string') {
                return true;
            } else {
                return false;
            }

        } catch (ex) {
            return false;
        }
    }
};


lib.cookie = {
    get: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";

    },
    set: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
    }
};

var ngineReady = true;
var keyhandlerReady = true;
