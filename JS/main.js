// Initialize PhoneGap API then initialize the App
var phonegapAPI =  {
		initialize: function() {
			// Check to make sure the PhoneGap JS is ready to use before attempting to use it
			document.addEventListener('deviceready',this.deviceReady,false);
		},
		deviceReady: function() {
			alert('Ready to use PhoneGap API.');
      //onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
      var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
      window.addEventListener(orientationEvent, function() {
        if(map) {
          map.reposition();
          map.resize();
        }
      }, false);
			app.initialize();
		}
};

var app = {
		initialize: function() {
			//Begin Here
      app.gaPlugin = window.plugins.gaPlugin;
      app.gaPlugin.init(function(){alert('GA Ready!');},function(error){},"UA-5275645-4",10);
	  },

    gaEvent: function() {
      app.gaPlugin.trackEvent(function(){alert('Event Tracked!')},function(){alert('failure')},"Link","Click","Clicked Test Link",1);
    }

};