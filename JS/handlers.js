// Device Ready for PhoneGap API
function deviceReady() {
  alert('Device Ready');
  initializePlugins();
}

function initializePlugins() {
  Global.gaPlugin = window.plugins.gaPlugin;
  Global.gaPlugin.init(function(){alert('GA Ready!');},function(error){},"UA-5275645-4",10);
}

// Plugin Support Functions
function gaEvent() {
  Global.gaPlugin.trackEvent(function(){alert('Event Tracked!')},function(){alert('failure')},"Link","Click","Clicked Test Link",1);
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