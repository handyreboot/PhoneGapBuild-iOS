// Device Ready for PhoneGap API
function deviceReady() {
  initializePlugins();
}

function initializePlugins() {
  alert('initializePlugins');
  console.dir(window.plugins);
  var gaPlugin = window.plugins.gaPlugin;
  gaPlugin.init(function(){alert('GA Ready!');},function(error){alert(JSON.stringify(error));},"UA-5275645-4",10);
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