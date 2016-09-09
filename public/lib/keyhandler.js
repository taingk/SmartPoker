
//object library
var lib={};
lib.int_app = null;
lib.int_keyset = null;
lib.int_ksVisible = null;

if( typeof(VK_BACK) == 'undefined' ) VK_BACK = 461;
if( typeof(VK_ENTER) == 'undefined' ) VK_ENTER = 13;

if( typeof(VK_LEFT) == 'undefined' ) VK_LEFT = 37;
if( typeof(VK_UP) == 'undefined' ) VK_UP = 38;
if( typeof(VK_RIGHT) == 'undefined' ) VK_RIGHT = 39;
if( typeof(VK_DOWN) == 'undefined' ) VK_DOWN = 40;

if( typeof(VK_RED) == 'undefined' ) VK_RED = 403;
if( typeof(VK_GREEN) == 'undefined' ) VK_GREEN = 404;
if( typeof(VK_YELLOW) == 'undefined' ) VK_YELLOW = 405;
if( typeof(VK_BLUE) == 'undefined' ) VK_BLUE = 406;

if( typeof(VK_PLAY) == 'undefined' ) VK_PLAY = 415;
if( typeof(VK_STOP) == 'undefined' ) VK_STOP = 413;
if( typeof(VK_PAUSE) == 'undefined' ) VK_PAUSE = 414;
if( typeof(VK_FAST_FWD) == 'undefined' ) VK_FAST_FWD = 473;
if( typeof(VK_REWIND) == 'undefined' ) VK_REWIND = 412;

if( typeof(VK_0) == 'undefined' ) VK_0 = 48;
if( typeof(VK_1) == 'undefined' ) VK_1 = 49;
if( typeof(VK_2) == 'undefined' ) VK_2 = 50;
if( typeof(VK_3) == 'undefined' ) VK_3 = 51;
if( typeof(VK_4) == 'undefined' ) VK_4 = 52;
if( typeof(VK_5) == 'undefined' ) VK_5 = 53;
if( typeof(VK_6) == 'undefined' ) VK_6 = 54;
if( typeof(VK_7) == 'undefined' ) VK_7 = 55;
if( typeof(VK_8) == 'undefined' ) VK_8 = 56;
if( typeof(VK_9) == 'undefined' ) VK_9 = 57;

//Function called after keydown event
lib.eventExe=function(e) {
	
	//$("#todo").html(e);
	var exitReturn;	
	switch(e){
		case VK_UP:
			keyFunction("UP");
			exitReturn=true;
			break;
		case VK_DOWN:
			keyFunction("DOWN");
			exitReturn=true;
			break;
		case VK_LEFT:
			keyFunction("LEFT");
			exitReturn=true;
			break;
		case VK_RIGHT:
			keyFunction("RIGHT");
			exitReturn=true;
			break;
		case VK_ENTER:
			keyFunction("OK");
			exitReturn=true;
			break;
		case VK_0:
			keyFunction(0);
			exitReturn=true;
			break;
		case VK_1:
			keyFunction(1);
			exitReturn=true;
			break;
		case VK_2:
			keyFunction(2);
			exitReturn=true;
			break;
		case VK_3:
			keyFunction(3);
			exitReturn=true;
			break;
		case VK_4:
			keyFunction(4);
			exitReturn=true;
			break;
		case VK_5:
			keyFunction(5);
			exitReturn=true;
			break;
		case VK_6:
			keyFunction(6);
			exitReturn=true;
			break;
		case VK_7:
			keyFunction(7);
			exitReturn=true;
			break;
		case VK_8:
			keyFunction(8);
			exitReturn=true;
			break;
		case VK_9:
			keyFunction(9);
			exitReturn=true;
			break;
		case VK_RED:
			keyFunction("RED");
			exitReturn=true;
			break;
		case VK_YELLOW:
		case VK_YELLOW2:
			keyFunction("YELLOW");
			exitReturn=true;
			break;
		case VK_GREEN:
			keyFunction("GREEN");
			exitReturn=true;
			break;
		case VK_BLUE:
			keyFunction("BLUE");
			exitReturn=true;
			break;
		case VK_PLAY:
			keyFunction("PLAY");
			exitReturn=true;
			break;
		case VK_PAUSE:
			keyFunction("PAUSE");
			exitReturn=true;
			break;
		case VK_STOP:
			keyFunction("STOP");
			exitReturn=true;
			break;
		case VK_BACK:
			keyFunction("BACK");
			exitReturn=true;
			break;
		case VK_FAST_FWD:
		case VK_FAST_FWD2:
			keyFunction("FAST_FWD");
			exitReturn=true;
			break;
		case VK_REWIND:
			keyFunction("REWIND");
			exitReturn=true;
			break;
		default: exitReturn=false;
		}
	return exitReturn;
};

//function to initiate application
lib.init=function() {
	var appmgr = document.createElement('object');
		appmgr.setAttribute('id',"oipfID");
	    appmgr.setAttribute('type',"application/oipfApplicationManager");
	    appmgr.setAttribute('style',"position: absolute; left: 0px; top: 0px; width: 0px; height: 0px;");

	var oipfcfg = document.createElement('object');
		oipfcfg.setAttribute('type', "application/oipfConfiguration");
		oipfcfg.setAttribute('style', "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px;");

	document.body.appendChild(appmgr);
	document.body.appendChild(oipfcfg);

	//document listener
	document.addEventListener("keydown", function(e){
		if(lib.eventExe(e.keyCode)){
			e.preventDefault();}
		},false);
	

	// set appMngr to the application/oipfApplicationManager object
	var appMgr = document.getElementById("oipfID");
	if (typeof(appMgr.getOwnerApplication) !== "undefined"){
		// create the application
		lib.int_app = appMgr.getOwnerApplication(document);
		//setting remote control buttons
		lib.int_keyset = lib.int_app.privateData.keyset;
		lib.int_ksVisible =  0xFFF;  //0x33F color + nav + vcr + numeric + alpha
		lib.int_app.show();
		lib.int_keyset.setValue(lib.int_ksVisible);
		}
};

//play function
lib.play=function(obj){
	var playerObj=document.getElementById(obj);
	try{
		playerObj.play(1);
	}
	catch(err){
		//msg error
	}
	
};
//pause function
lib.pause=function(obj){
	var playerObj=document.getElementById(obj);
	try{
		playerObj.play(0);
	}
	catch(err){
		//msg error
	}
	
};
//stop function
lib.stop=function(obj){
	var playerObj=document.getElementById(obj);
	try{
		playerObj.stop();
	}
	catch(err){
		//msg error
	}
	
};

//fast forward function
lib.fastFWD=function(obj,miliSeconds){
	var playerObj=document.getElementById(obj);
	try{
		playerObj.play(0);
		playerObj.seek(playerObj.playPosition+miliSeconds);
		playerObj.play(1);
	}catch(err){
		//msg error
	}
};

//rewind function
lib.rewind=function(obj,miliSeconds){
	var playerObj=document.getElementById(obj);
	try{
		playerObj.play(0);
		playerObj.seek(playerObj.playPosition-miliSeconds);
		playerObj.play(1);
	}catch(err){
		//msg error
	}
};

//function to set the source
lib.source=function(obj,url){
	document.getElementById(obj).data=url;
};

var keyhandlerReady=true;
