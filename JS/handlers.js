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
function manualCheckForUpdates() {
  // Check For Updates
  document.getElementById('lastUpdated').innerHTML = 'Updating...';
  //local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
    local_resources.checkForUpdates(Global.Database,"data/data-update.json","json",function(error,results){
      local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
        for (var i = 0; i < results.length; i++) {
          if (results[i].name == 'getQuickStats' || results[i].name == 'getCountries' || results[i].name == 'getRecentSurveys')
            Global[results[i].name] = JSON.parse(results[i].json).Data;
          else
            Global[results[i].name] = JSON.parse(results[i].json);
        }
      });
      local_resources.checkForUpdates(Global.Database,"http://measuredhs.com/API/DHS/checkForDataUpdates/","jsonp",function(error,results){
        Online = 'Online';
        if (error != null){
          document.getElementById('lastUpdated').innerHTML = 'Update Failed. Try again later please.';
          return;
        }
        local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
          for (var i = 0; i < results.length; i++) {
            if (results[i].name == 'getQuickStats' || results[i].name == 'getCountries' || results[i].name == 'getRecentSurveys')
              Global[results[i].name] = JSON.parse(results[i].json).Data;
            else
              Global[results[i].name] = JSON.parse(results[i].json);
          }
          localStorage.setItem('Update',new Date());
          // Update TimeStamp to show last update time
          var date = new Date(localStorage.getItem('Update'));
          var hours = date.getHours(), minutes = date.getMinutes();
          if (hours < 10)
            hours = "0"+hours;
          if (minutes < 10)
            minutes = "0"+minutes;

          document.getElementById('lastUpdated').innerHTML = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear()+' - '+hours+':'+minutes;
          // Remove Loading Wheel
        });
      });
    });
  //});

}
function resizeWidgets(view) {
  switch (view){
    case "partials/CountryIndicatorSpecifics.html":
      $.each(Config.unresponsiveWidgets,function(index,widget){
        $(widget).css('width','100%');
      });
      break;
    case "partials/Map.html":
      $.each(Config.unresponsiveWidgets,function(index,widget){
        $(widget).css('width','100%');
      });
      break;
  }

}
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