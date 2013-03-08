// Device Ready for PhoneGap API
function deviceReady() {
  initializePlugins();
}

function initializePlugins() {
  Global.gaPlugin = window.plugins.gaPlugin;
  Global.gaPlugin.init(function(){},function(error){},"UA-5275645-4",10);
}

// Plugin Support Functions
function gaEvent(eventAction,eventLabel) {
  Global.gaPlugin.trackEvent(function(){/*Success*/},function(){/*Failure*/},"Page",eventAction,eventLabel,1);
}

// Plugin Support Functions

// To be used in PhoneGap Version
function changeView(view) {
	//debug('#/'+view);
	location.href = '#/'+view;
}
function backButton(prevLocation) {
	location.href = prevLocation;
}

function debug(message) {
	//console.log("MEASUREDHS >>> "+message);
}