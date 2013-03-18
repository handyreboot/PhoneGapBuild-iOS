var Global = {};

function CountryQuickStatsController($scope,$http) {  
	//$http.jsonp('http://statcompiler.blueraster.net/API/DHS/getCountries/?callback=JSON_CALLBACK&f=json').success(function(data, status, headers, config){
	//	$scope.Countries = data.DATA;
	//});
	$scope.Countries = Global.getCountries;
	$scope.Flags = [];
	for (var index = 0; index < $scope.Countries.length; index++) {
		$scope.Flags.push(Global.getCountryDetailsByCountryCode[$scope.Countries[index][0]].Flag);
	}

}
function CountriesHomepageController($scope, $routeParams, $http) {

  //gaEvent("Country",$routeParams.CountryName);

	$scope.CountryLabel = $routeParams.CountryName;
	$scope.CountryId = $routeParams.CountryId;
	$scope.previous = $routeParams.Previous;
	$scope.Flag = Global.getCountryDetailsByCountryCode[$routeParams.CountryId].Flag;
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getCountryData/?CountryCode='+$routeParams.CountryId+ '&callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){

	temp = Global.getCountryDetailsByCountryCode[$routeParams.CountryId].Surveys;
	$scope.Surveys = [];
	for(var index = 0; index < temp.length; index++) {
		$scope.Surveys.push(Global.getSurveyDetailsBySurveyId[temp[index]]);
	}
	
	if (Global.getDataByCountry[$routeParams.CountryId]) {
		var any = Math.floor(Math.random()*Global.getDataByCountry[$routeParams.CountryId].FACTS.length);
		$scope.Fact = Global.getDataByCountry[$routeParams.CountryId].FACTS[any];
	} else {
		$scope.Fact = "There are no facts available at this time for this Country."
	}
	// Set the CSS for the Survey Rows based off the size of the label
	$scope.labelClass = function(length) {
		if (length < 18)
			return 'SurveyLargeCtryLabel';
		else if (length > 18 && length < 25)
			return 'SurveyMediumCtryLabel';
		else
			return 'SurveySmallCtryLabel';
	}
	// Set the back button with the correct URL
	if ($scope.previous == 'Survey') {
		$scope.prevUrl = '#/Home/Surveys/Countries';
		$scope.nextUrl = 'Countries/'+$scope.CountryLabel+'/'+$scope.CountryId+'/Quickstats/'+$scope.previous;
	} else {
		$scope.prevUrl = '#/Home/Indicators/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;	
		$scope.nextUrl = 'Countries/'+$scope.CountryLabel+'/'+$scope.CountryId+'/Quickstats/'+$scope.previous+'/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;
	}
	
	// Set the next URL for the Survey Page
	if ($scope.previous == 'Survey') {
		$scope.surveyUrl = 'Home/Countries/'+$scope.CountryLabel+'/'+$scope.CountryId;
		$scope.surveyUrl2 = $scope.previous;
	} else {
		$scope.surveyUrl = 'Home/Countries/'+$scope.CountryLabel+'/'+$scope.CountryId;
		$scope.surveyUrl2 = $scope.previous+'/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;
	}
	
}

function CountriesIndicatorsController($scope, $routeParams, $http) {

	//$http.jsonp('http://www.measuredhs.com/API/DHS/getDataByCountry/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
	//gaEvent("Quickstats",$routeParams.CountryName);

  $scope.CountryData = Global.getDataByCountry[$routeParams.CountryId];
  if ($scope.CountryData != undefined) {
    $scope.indicatorYears = $scope.CountryData.YEARS;
    $scope.indicatorValues = $scope.CountryData.DATA;
    $scope.counter = $scope.indicatorYears.length - 1;
    $scope.Previous = $routeParams.Previous;
    // Init variables to bind whether button is enabled or disabled
    if ($scope.counter-2 < 0)
      $scope.decrementIsDisabled = true;
    else
      $scope.decrementIsDisabled = false;

      $scope.incrementIsDisabled = true;

    // If only one year available, only show one view, else show two
    if ($scope.indicatorYears.length > 1)
      $scope.dataSize = 'MoreThanOne';
    else
      $scope.dataSize = 'OnlyOne';
  } else {
    $scope.dataSize = 'none';
  }
		
	$scope.Flag = Global.getCountryDetailsByCountryCode[$routeParams.CountryId].Flag;
	
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
	//	$scope.indicatorLabels = data.DATA;
	//});
	
	$scope.indicatorLabels = Global.getQuickStats
	$scope.CountryName = $routeParams.CountryName;
	$scope.CountryId = $routeParams.CountryId;
  $scope.IndicatorId = $routeParams.IndicatorId;
  $scope.IndicatorLabel = $routeParams.IndicatorLabel;
	
	// Increment and Decrement Functions for View with Atleast Two Years
	$scope.increaseYears = function() {
		$scope.counter++;
		// Enable/Disable Buttons if at the end of the array
		if ($scope.counter == $scope.indicatorYears.length-1)
			$scope.incrementIsDisabled = true;
		else
			$scope.incrementIsDisabled = false;
			
		if ($scope.counter > 1)
			$scope.decrementIsDisabled = false;	
	}
	$scope.decreaseYears = function() {
		$scope.counter--;
		// Enable/Disable Buttons if at the end of the array
		if ($scope.counter == 1)
			$scope.decrementIsDisabled = true;
		else
			$scope.decrementIsDisabled = false;
		
		if ($scope.counter < $scope.indicatorYears.length-1)
			$scope.incrementIsDisabled = false;		
	}

  // Show Info about Indicator
  // TODO CSS for this guy is position: fixed, may need to be adjusted for Android, do some testing
  var defs;
  $http.get('data/indicatorDefinitions.json').success(function(data) {
    defs = data.Defs;
  });

  $scope.showInfo = function(index){
    document.getElementById("indicatorDescription").style.visibility = "visible";
    document.getElementById("indicatorDescriptionContent").innerHTML = "<img src='./img/close_24x24.png' height='24px' width='24px' ng-click='hideDescription()'/>"+
    "<h4 style='margin: 5px 10px;'>"+$scope.indicatorLabels[index][0]+":</h4>"+"<p>"+defs[index]+"</p>";
  }

  $scope.hideDescription = function() {
    document.getElementById("indicatorDescription").style.visibility = "hidden";
  }
	
	// Set up previous Url
	if ($routeParams.Previous == 'Country') {
		$scope.prevUrl = '#/Home/Countries';
		$scope.indicatorUrl = '#/Home/IndicatorInfo/'+$routeParams.Previous+'/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/null/null';
	} else {
		$scope.prevUrl = '#/Home/Countries/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/'+$routeParams.Previous+'/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;
		$scope.indicatorUrl = '#/Home/IndicatorInfo/'+$routeParams.Previous+'/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;
	}
}

function IndicatorListController($scope,$http) {
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
	//	$scope.Indicators = data.DATA;
	//});
	$scope.Indicators = Global.getQuickStats; //Global.getQuickStats

}

function IndicatorCountriesController($scope,$http,$routeParams,$timeout) {
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getDataByIndicator/?callback=JSON_CALLBACK&f=json').success(function(data,status,header,config){
	//	$scope.IndicatorValues = data[$routeParams.IndicatorId].DATA;
	//});

  //gaEvent("Indicators",$routeParams.IndicatorLabel);

	$scope.IndicatorValues = Global.getDataByIndicator[$routeParams.IndicatorId]; 
	$scope.Flags = Global.getCountryDetailsByCountryCode;
	
	$scope.IndicatorId = $routeParams.IndicatorId;
	$scope.IndicatorLabel = $routeParams.IndicatorLabel;
	
	if ($scope.IndicatorLabel.length < 40) 
		$scope.IndicatorLabelTitle = 'headerViewTitleSmall';
	else if ($scope.IndicatorLabel.length > 40 && $scope.IndicatorLabel.length < 60)
		$scope.IndicatorLabelTitle = 'headerViewTitleEvenSmaller';
	else
		$scope.IndicatorLabelTitle = 'headerViewTitleSmallest';	
	
	$scope.table = '';
	$scope.chart = 'selectedOption';
	$scope.CurrentView = 'Chart';
	$scope.reverse = true;

	$scope.setClass = function(value) {
		if (value == 0) {
			$scope.chart = 'selectedOption';
			$scope.table = '';
			if ($scope.sorter == 'D' || $scope.sorter == 'E')
				$scope.CurrentView = 'ChartRegion';
			else
				$scope.CurrentView = 'Chart';	
		} else {
			$scope.chart = '';
			$scope.table = 'selectedOption';
			if ($scope.sorter == 'D' || $scope.sorter == 'E')
				$scope.CurrentView = 'TableRegion';
			else
				$scope.CurrentView = 'Table';
		}
		window.scrollTo(0,0);
	}
	// Function to set color of chart rows
	$scope.setColor = function(index) {
		var value = index % 10;
		switch(value) {
			case 0:
				return 'red';
				break;
			case 1:
				return 'green';
				break;
			case 2:
				return 'orange';
				break;
			case 3:
				return 'blue';
				break;
			case 4:
				return 'yellow';
				break;
			case 5:
				return 'black';
				break;
			case 6:
				return 'purple';
				break;
			case 7:
				return 'teal';
				break;
			case 8:
				return 'brown';
				break;
			case 9:
				return 'grey';
				break;									
		}
	};
	
	// Toggle Sorting Popover
	
	$scope.togglePopover = function() {
		if (document.getElementsByClassName('popover')[0].style.display != 'block')
			document.getElementsByClassName('popover')[0].style.display = 'block';
		else	
			document.getElementsByClassName('popover')[0].style.display = 'none';
	}

  var defs;
  $http.get('data/indicatorDefinitions.json').success(function(data) {
    defs = data.Defs;
  });

  $scope.showInfo = function(){
    document.getElementById("indicatorDescription").style.visibility = "visible";
    document.getElementById("indicatorDescriptionContent").innerHTML = "<img src='./img/close_24x24.png' height='24px' width='24px' ng-click='hideDescription()'/>"+
    "<h4 style='margin: 5px 10px;'>"+$scope.IndicatorLabel+":</h4>"+"<p>"+defs[Config.indicatorDefsLookup[$scope.IndicatorLabel]]+"</p>";
  }

  $scope.hideDescription = function() {
    document.getElementById("indicatorDescription").style.visibility = "hidden";
  }
	
	// Filters to filter out rows with missing Data
	$scope.missingData = function(item) {
		return item.val != '';
	}
	$scope.missingChartData = function(item) {
		return item.chartvalue != '';
	}
	// Filters for the same as above and Regions
	$scope.region1 = function(item) {
		return (item.chartvalue != '' && item.region == 1);
	}
	$scope.region2 = function(item) {
		return (item.chartvalue != '' && item.region == 2);
	}
	$scope.region3 = function(item) {
		return (item.chartvalue != '' && item.region == 3);
	}
	$scope.region4 = function(item) {
		return (item.chartvalue != '' && item.region == 4);
	}
	$scope.region5 = function(item) {
		return (item.chartvalue != '' && item.region == 6);
	}
	//Global.getCountries // regionOrder
	
	// Default $Scope Param to be used for ordering 
	$scope.chartOrdering = function(item){
		if (item.chartvalue == "0" || item.chartvalue == "0.0" || item.chartvalue == "")
			return 0;
	  else 
		return parseFloat(item.chartvalue);
	}	
	// Function to Change Sorting optons if the user decides to
	// Variable to decide whether or not we need to show the region separators
	$scope.sorter = 'A';
	$scope.changeSortDesriptor = function(item) {
		switch(item.sorter) {
			case 'A':
				$scope.chartOrdering = function(item){
					if (item.chartvalue == "0" || item.chartvalue == "0.0" || item.chartvalue == "")
						return 0;
					else 
						return parseFloat(item.chartvalue);
				}
				$scope.reverse = true;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'Table';
				} else {
					$scope.CurrentView = 'Chart';
				}
				break;
			case 'B':
				$scope.chartOrdering = function(item){
					if (item.chartvalue == "0" || item.chartvalue == "0.0" || item.chartvalue == "")
						return 0;
					else 
						return parseFloat(item.chartvalue);
				}
				$scope.reverse = false;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'Table';
				} else {
					$scope.CurrentView = 'Chart';
				}
				break;
			case 'C':
				$scope.chartOrdering = 'label';
				$scope.reverse = false;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'Table';
				} else {
					$scope.CurrentView = 'Chart';
				}
				break;
			case 'D':
				$scope.chartOrdering = function(item){
					if (item.chartvalue == "0" || item.chartvalue == "0.0" || item.chartvalue == "")
						return 0;
					else 
						return parseFloat(item.chartvalue);
				}
				$scope.reverse = true;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'TableRegion';
				} else {
					$scope.CurrentView = 'ChartRegion';
				}		
				break;
			case 'E':
				$scope.chartOrdering = function(item){
					if (item.chartvalue == "0" || item.chartvalue == "0.0" || item.chartvalue == "")
						return 0;
					else 
						return parseFloat(item.chartvalue);
				}
				$scope.reverse = false;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'TableRegion';
				} else {
					$scope.CurrentView = 'ChartRegion';
				}		
				break;	
			case 'F':	
				$scope.chartOrdering = 'label';
				$scope.reverse = false;
				if ($scope.table == 'selectedOption') {
					$scope.CurrentView = 'TableRegion';
				} else {
					$scope.CurrentView = 'ChartRegion';
				}	
				break;
		}
		
		window.scrollTo(0,0);
	} // End Sort Descriptor
	
	$timeout(function() {
		$("#indicators").css("padding-top", $('#indicatorTitle').outerHeight(true)+"px");
	});

}

/**** Survey Pages ****/

function SurveysController($scope, $http) {
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getSurveys/?callback=JSON_CALLBACK&f=json&recent=true').success(function(data,status,header,config){
	//	$scope.Surveys = data.DATA;
	//});
	
	// CHeck if we are online
	Online = 'Offline';
	$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
		Online = 'Online';
	});
}

function SurveysCountryController($scope,$http) {

	$scope.Countries = Global.getCountries;
	$scope.Flags = [];
	for (var index = 0; index < $scope.Countries.length; index++) {
		$scope.Flags.push(Global.getCountryDetailsByCountryCode[$scope.Countries[index][0]].Flag);
	}
	
}
function SurveysRecentController($scope,$http) {
	
	temp = Global.getRecentSurveys;
	$scope.Surveys = [];
	for(var index = 0; index < temp.length; index++) {
		$scope.Surveys.push(Global.getSurveyDetailsBySurveyId[temp[index][0]]);
	}
	
	$scope.recentSurveys = function(survey) {
		if (survey != undefined)
			return (survey.SURVEYSTATUS == 'Completed');
		else
			return false;
	}
	
	$scope.togglePopover = function() {
		if (document.getElementsByClassName('popoverSurveys')[0].style.display != 'block')
			document.getElementsByClassName('popoverSurveys')[0].style.display = 'block';
		else	
			document.getElementsByClassName('popoverSurveys')[0].style.display = 'none';
	}
	
	$scope.ordering = 'SURVEYYEAR';
	$scope.reverse = true;
	$scope.sorter = 'A';
	$scope.changeSortDesriptor = function(item) {
		switch(item.sorter) {
			case 'A':
				$scope.ordering = 'SURVEYYEAR';
				$scope.reverse = true;
				break;
			case 'B':
				$scope.ordering = 'SURVEYYEAR';
				$scope.reverse = false;
				break;
			case 'C':
				$scope.ordering = 'COUNTRYNAME';
				$scope.reverse = false;
				break;
		
		}
		
	}

}
function SurveysOngoingController($scope,$http) {

	temp = Global.getRecentSurveys;
	$scope.Surveys = [];
	for(var index = 0; index < temp.length; index++) {
		$scope.Surveys.push(Global.getSurveyDetailsBySurveyId[temp[index][0]]);
	}
	
	
	$scope.ongoingSurveys = function(survey) {
		if (survey != undefined)
			return survey.SURVEYSTATUS == 'Ongoing';
		else
			return false;
	}
	
	$scope.togglePopover = function() {
		if (document.getElementsByClassName('popoverSurveys')[0].style.display != 'block')
			document.getElementsByClassName('popoverSurveys')[0].style.display = 'block';
		else	
			document.getElementsByClassName('popoverSurveys')[0].style.display = 'none';
	}
	
	$scope.ordering = 'SURVEYYEAR';
	$scope.reverse = true;
	$scope.sorter = 'A';
	$scope.changeSortDesriptor = function(item) {
		switch(item.sorter) {
			case 'A':
				$scope.ordering = 'SURVEYYEAR';
				$scope.reverse = true;
				break;
			case 'B':
				$scope.ordering = 'SURVEYYEAR';
				$scope.reverse = false;
				break;
			case 'C':
				$scope.ordering = 'COUNTRYNAME';
				$scope.reverse = false;
				break;
		
		}
		
	}
	
}

function SurveyInformationController($scope, $routeParams, $http) {

	//$http.jsonp('http://www.measuredhs.com/API/DHS/getSurveys/?callback=JSON_CALLBACK&f=json&SurveyIds='+$routeParams.SurveyId).success(function(data,status,header,config){
	//});
	//$http.jsonp('http://www.measuredhs.com/API/DHS/getSurveyCharacteristics/?callback=JSON_CALLBACK&f=json&SurveyIds='+$routeParams.SurveyId).success(function(data,status,header,config){

	$scope.data = Global.getSurveyDetailsBySurveyId[$routeParams.SurveyId];

  //gaEvent("Surveys","Id: "+$routeParams.SurveyId+", Label: "+$scope.data.COUNTRYNAME+" "+$scope.data.SURVEYTYPE+" "+$scope.data.SURVEYYEAR);
	
	$scope.HeaderLabel = $scope.data.COUNTRYNAME+" "+$scope.data.SURVEYTYPE+" "+$scope.data.SURVEYYEAR;
	$scope.Characteristics = Global.getSurveyCharacteristicsBySurveyId[$routeParams.SurveyId];
	$scope.Publications = Global.getPublicationsBySurveyId[$routeParams.SurveyId];
	// Set the default selected tab
	$scope.Information = 'selectedOption';
	// Set the style for the selected tab
	$scope.setClass = function(value) {
		if (value == 0) {
			$scope.Information = 'selectedOption';
			$scope.Publication = '';
			
		}	else {
			$scope.Information = '';
			$scope.Publication = 'selectedOption';
		}
	}
	
	// Set the style of the Publications view based on whether we are online or offline
	if (Online == "Online")
		$scope.Online = 'Online';
	else
		$scope.Online = 'Offline';
	
	
	$scope.previous = $routeParams.Previous;
	
	// Set the Url to go back to the Correct Page
	if ($routeParams.Previous === 'TableChart') {
		$scope.backUrl = '#/Home/Countries/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/TableChart/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;
	} else if ($routeParams.Previous === 'Survey') {
		$scope.backUrl = '#/Home/Countries/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/Survey';
	} else if ($routeParams.Previous === 'Recent') {
		$scope.backUrl = '#/Home/Surveys/Recent';
	} else if ($routeParams.Previous === 'Home'){
		$scope.backUrl = '#/Home';
	} else {
		$scope.backUrl = '#/Home/Surveys/Ongoing';
	}
		
		
}
/**** Survey Pages ****/

function InfoController($scope,$http) {
  $http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
    document.getElementById('updateData').style.visibility = 'visible';
  });

  // Show Last Date Updated
  var date = new Date(localStorage.getItem('Update'));
  $scope.currentDate = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear()+' - '+date.getHours()+':'+date.getMinutes();
}
/**********************************************************************************************/
function footerController($scope,$route,$window, $location) {
	$scope.$on('$viewContentLoaded',function(){

    $(window).resize(function(){
      resizeWidgets($route.current.$route.templateUrl);
    });

		switch ($route.current.$route.templateUrl) {
			case 'partials/Homepage.html' :
				/* Set the App Footer position to Absolute for this view TODO Android Specific Code Here
				$('#AppFooter').css("position","absolute");
				$('#AppFooter').css("left","");	*/
				$scope.Quickstats = '';
				$scope.Indicators = '';
				$scope.Surveys = '';
				$scope.Home = 'selected';
				$scope.Maps = '';
				break;
			case 'partials/CountryQuickstats.html' :
				/* Set the App Footer position to Fixed for this view TODO Android Specific Code Here
				$('#AppFooter').css("position","fixed");
				$('#AppFooter').css("left","0");*/
				$scope.Quickstats = 'selected';
				$scope.Indicators = '';
				$scope.Surveys = '';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/Surveys.html' :
				/* Set the App Footer position to Fixed for this view TODO Android Specific Code Here
				$('#AppFooter').css("position","fixed");
				$('#AppFooter').css("left","0");*/
				$scope.Quickstats = '';
				$scope.Indicators = '';
				$scope.Surveys = 'selected';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/IndicatorList.html' :
				/* Set the App Footer position to Fixed for this view TODO Android Specific Code Here
				$('#AppFooter').css("position","fixed");
				$('#AppFooter').css("left","0");*/
				$scope.Quickstats = '';
				$scope.Indicators = 'selected';
				$scope.Surveys = '';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/Map.html' :
				/* Set the App Footer position to Absolute for this view TODO Android Specific Code Here
				$('#AppFooter').css("position","absolute");
				$('#AppFooter').css("left","");*/
				$scope.Quickstats = '';
				$scope.Indicators = '';
				$scope.Surveys = '';
				$scope.Home = '';
				$scope.Maps = 'selected';
				break;
		}
	});
	
}

function MappingController($http,$timeout,$scope) {
	
	Online = 'Offline';
	//onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
	var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	window.addEventListener(orientationEvent, function() {
		if(map) {
			map.reposition();
			map.resize();
		}
	}, false);

	$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
		Online = 'Online';
		dojo.require("esri.map");
		dojo.require("esri.layers.FeatureLayer");
		dojo.require("esri.tasks.query");
		dojo.require("esri.renderer");
		dojo.require("esri.layers.graphics");
		dojo.require("dojo.number");

    // Custom Extended Layer
    dojo.declare("CustomDynamicLayer",esri.layers.ArcGISDynamicMapServiceLayer,{
      constructor: function() {
        // Do Constructor Stuff Here
      },
      getImageUrl: function(extent,width,height,callback){
        var params = {
          //serviceUrl: "http://ags101.blueraster.net/arcgis/rest/services/sdr/spatialDataExport/MapServer/",
          dynamicLayers: JSON.stringify(Config.dynamicLayerInfo),//Config.test
          transparent:true,
          dpi: 96,
          format:"png24",
          layers:"show:1,3",
          f:"image",
          imageSR:102100,
          bboxSR:102100,
          bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
          size: width+","+height,
        }
        callback(Config.dynamicLayer.url+"/export?"+dojo.objectToQuery(params));
        //callback(this.url+"/export?"+dojo.objectToQuery(params));
      }
    });
    // Custom Extended Layer

    var options;
		if (window.innerWidth < 450)
      options = Config.mapDefaults.phone;
    else
      options = Config.mapDefaults;

		map = new esri.Map("map" , {
      center: [options.centerX,options.centerY],
      zoom: options.zoom,
			logo : true,
			wrapAround180: false
		});

		// Make Sure the Map is sized appropriately
		$timeout(function() {
			var viewportHeight = $(window).innerHeight();
			viewportHeight -= 90;
			$("#map").css('height',viewportHeight+'px');
			if(map) {
				map.reposition();
				map.resize();
			}
		});

    /* Add Tiled Layer */
    var tiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://ags101-08-mdhs-prod.blueraster.com/ArcGIS/rest/services/production/MeasureDHS_LabelBaseTiles/MapServer/");
    map.addLayer(tiledMapServiceLayer);
    /* Add Tiled Layer */

    /* Add Dynamic Layer */
    var imageParams = new esri.layers.ImageParameters();
    imageParams.layerIds = Config.dynamicLayer.defaultVisibleLayers;
    imageParams.layerOption = esri.layers.ImageParameters.LAYER_OPTION_SHOW;

    // Config.dynamicLayer.url
    var DHSMapLayer = new CustomDynamicLayer("http://gis101.measuredhs.com/arcgis/rest/services/production/StatCompiler/MapServer/exts/DynamicLayersRESTSOE",{
    //var DHSMapLayer = new esri.layers.ArcGISDynamicMapServiceLayer(Config.dynamicLayer.url,{
      id: Config.dynamicLayer.id,
      imageParameters:imageParams,
      opacity: .5
    });

    map.addLayer(DHSMapLayer);

    // Default Layer Defs for Demo
    var layerdefs = [];
    layerdefs[1] = "DHS_CC in ('KE','UG','TZ','RW')";
    layerdefs[3] = "DHS_CC in ('KE','UG','TZ','RW')";
    DHSMapLayer.setLayerDefinitions(layerdefs);

    // Some Defualts for the Map
    var currentData = Global.getDataByIndicator["20171000"];
    $scope.currentIndicator = Config.indicatorByCode["20171000"];

    // Set up Identify
    var identifyTask = new esri.tasks.IdentifyTask(Config.dynamicLayer.url);
    var params = new esri.tasks.IdentifyParameters();
    params.tolerance = 4;
    params.returnGeometry = false;
    params.layerIds = [3];
    params.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    params.width = map.width;
    params.height = map.height;

    dojo.connect(map,"onClick",function(evt){
      params.geometry = evt.mapPoint;
      params.mapExtent = map.extent;
      var deferred = identifyTask.execute(params);

      deferred.addCallback(function(results){
        var content, infoTemplate,countryData,indicatorYears,indicatorValues,location,yearValue,chartValue,chartData = [],chartLabels = [];
        dojo.forEach(currentData,function(item){
          if (results[0].feature.attributes.DHS_CC == item.countryCode){
            location = Config.indicatorDefsLookup[$scope.currentIndicator];
            countryData = Global.getDataByCountry[results[0].feature.attributes.DHS_CC];
            indicatorYears = countryData.YEARS;
            indicatorValues = countryData.DATA;
            dojo.forEach(indicatorYears,function(year){
              dojo.forEach(indicatorValues,function(value,index){
                if (index == location){
                  if (value[year] === undefined) {} else {
                    chartValue = value[year];
                    if (typeof year == "string")
                      yearValue = parseInt(year.slice(0,4));
                    else
                      yearValue = year;
                    chartData.push(chartValue);
                    chartLabels.push(yearValue);
                  }
                }
              });
            });
            content = "<p>"+$scope.currentIndicator+" - "+item.year+": "+item.val+"</p><div id='chartDiv' class='chartPopup'></div>";
            // item.label,content
            document.getElementById("myInfoWindow").style.display = "block";
            document.getElementById("myInfoWindowTitle").innerHTML = item.label;
            document.getElementById("myInfoWindowContent").innerHTML = content;
            if (chartData.length > 0) {
              Global.chart = new Highcharts.Chart({
                chart: {
                  renderTo: 'chartDiv',
                  type: 'column'
                },
                title: {
                  text: null
                },
                xAxis: {
                  categories: chartLabels,
                  title: {
                    text: null
                  }
                },
                yAxis: {
                  min: 0,
                  title: {
                    text: '',
                    align: 'high'
                  }
                },
                tooltip: {
                  enabled: false
                },
                plotOptions: {
                  column: {
                    dataLabels: {
                      enabled: true
                    }
                  }
                },
                legend: {
                  enabled: false
                },
                credits: {
                  enabled: false
                },
                series: [{
                  name: $scope.CountryName,
                  data: chartData
                }]
              }); // End Chart
            } else {
              document.getElementById("chartDiv").innerHTML = "<p>There is no data for this particular Indicator.</p>";
            }
          } // End if we had a match
        }); // End for-each
      }); // End Deferred Callback

    }); // End Map onclick

    // Symbols for the Renderer
    var defaultSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([0,0,0,0]),0),new dojo.Color([255,0,0,0]));

    var class1Symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([0,0,0,0]), 1),new dojo.Color([253, 204, 138,1]));

    var class2Symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([0,0,0,0]), 1),new dojo.Color([252, 141, 89,1]));

    var class3Symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([0,0,0,0]), 1),new dojo.Color([227, 74, 51,1]));

    var class4Symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    new dojo.Color([0,0,0,0]), 1),new dojo.Color([179, 0, 0,1]));

    // Set up the renderer
    var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol,"DHS_CC");

		var buildLegend = function(indData){
      var class1Min,class1Max,
      class2Min,class2Max,
      class3Min,class3Max,
      class4Min,class4Max;
      var c1First = true, c2First = true, c3First = true,c4First = true;
      var c1 = [], c2 = [], c3 = [], c4 = [];
      renderer.addValue('KE',class1Symbol);
      renderer.addValue('UG',class4Symbol);
      renderer.addValue('TZ',class1Symbol);
      renderer.addValue('RW',class4Symbol);
      for (var i = 0; i < Global.getCountries.length;i++) {
        switch(indData[i].class){
          case 1:
            //renderer.addValue(indData[i].countryCode,class1Symbol);
            c1.push(indData[i].countryCode);
            if (c1First) {
              class1Min = class1Max = indData[i].val;
              c1First = false;
            }
            class1Min = Math.min(class1Min,indData[i].val);
            class1Max = Math.max(class1Max,indData[i].val);
            break;
          case 2:
            //renderer.addValue(indData[i].countryCode,class2Symbol);
            c2.push(indData[i].countryCode);
            if (c2First) {
              class2Min = class2Max = indData[i].val;
              c2First = false;
            }
            class2Min = Math.min(class2Min,indData[i].val);
            class2Max = Math.max(class2Max,indData[i].val);
            break;
          case 3:
            //renderer.addValue(indData[i].countryCode,class3Symbol);
            c3.push(indData[i].countryCode);
            if (c3First) {
              class3Min = class3Max = indData[i].val;
              c3First = false;
            }
            class3Min = Math.min(class3Min,indData[i].val);
            class3Max = Math.max(class3Max,indData[i].val);
            break;
          case 4:
            //renderer.addValue(indData[i].countryCode,class4Symbol);
            c4.push(indData[i].countryCode);
            if (c4First) {
              class4Min = class4Max = indData[i].val;
              c4First = false;
            }
            class4Min = Math.min(class4Min,indData[i].val);
            class4Max = Math.max(class4Max,indData[i].val);
            break;
        }
      }
      var uniqueInfo = [
        {symbol:class1Symbol,values:c1,labels:c1},
        {symbol:class2Symbol,values:c2,labels:c2},
        {symbol:class3Symbol,values:c3,labels:c3},
        {symbol:class4Symbol,values:c4,labels:c4}
      ];
      renderer.uniqueValueInfos = uniqueInfo;
      //Config.test[0].drawingInfo.renderer.uniqueValueInfos = uniqueInfo;
      var ldos = [];
      var ldo = new esri.layers.LayerDrawingOptions();
      ldo.renderer = renderer;
      ldos[3] = ldo;
      DHSMapLayer.setLayerDrawingOptions(ldos);


      $scope.c1min = class1Min;
      $scope.c1max = class1Max;
      $scope.c2min = class2Min;
      $scope.c2max = class2Max;
      $scope.c3min = class3Min;
      $scope.c3max = class3Max;
      $scope.c4min = class4Min;
      $scope.c4max = class4Max;
    }

    buildLegend(currentData);

		/*var buildLegend = function() {
			var class1Min,class1Max;
			var class2Min,class2Max;
			var class3Min,class3Max;
			var class4Min,class4Max;
			var c1First = c2First = c3First = c4First = true;
			dojo.forEach(graphicsLayer.graphics,function(graphic){
				switch (graphic.attributes.class) {
					case 1:
						if (c1First) {
							class1Min = class1Max = graphic.attributes.value;
							c1First = false;
						}
						class1Min = Math.min(class1Min,graphic.attributes.value);
						class1Max = Math.max(class1Max,graphic.attributes.value);
						break;
					case 2:
						if (c2First) {
							class2Min = class2Max = graphic.attributes.value;
							c2First = false;
						}
						class2Min = Math.min(class2Min,graphic.attributes.value);
						class2Max = Math.max(class2Max,graphic.attributes.value);
						break;
					case 3:	
						if (c3First) {
							class3Min = class3Max = graphic.attributes.value;
							c3First = false;
						}
						class3Min = Math.min(class3Min,graphic.attributes.value);
						class3Max = Math.max(class3Max,graphic.attributes.value);
						break;
					case 4:
						if (c4First) {
							class4Min = class4Max = graphic.attributes.value;
							c4First = false;
						}
						class4Min = Math.min(class4Min,graphic.attributes.value);
						class4Max = Math.max(class4Max,graphic.attributes.value);
						break;
				}
			});
			
			$scope.c1min = class1Min;
			$scope.c1max = class1Max;
			$scope.c2min = class2Min;
			$scope.c2max = class2Max;
			$scope.c3min = class3Min;
			$scope.c3max = class3Max;
			$scope.c4min = class4Min;
			$scope.c4max = class4Max;
		}
		
		map.infoWindow.resize(150,60);
			
		var graphicsLayer = new esri.layers.GraphicsLayer();	
		var geometry;
		var graphicsArray = {};
		var indData = Global.getDataByIndicator["20171000"];
		for (var i = 0; i < Global.getCountries.length;i++){
			if (Global.getCountryDetailsByCountryCode[Global.getCountries[i][0]].Geometry != '') {
				geometry = '{"geometry":'+Global.getCountryDetailsByCountryCode[Global.getCountries[i][0]].Geometry+',"spatialReference":{"wkid":102100}}';
				geometry = JSON.parse(geometry);
				var graphic = new esri.Graphic(geometry);
				graphic.attributes={"class":indData[i].class,"value":indData[i].val,"name":indData[i].label,"year":indData[i].year};
				//graphicsLayer.add(graphic);
				graphicsArray[Global.getCountries[i][0]] = graphic;
			}
		}	
		graphicsLayer.setRenderer(renderer);
		graphicsLayer.setInfoTemplate(new esri.InfoTemplate("<b>${name}</b>","${year} - ${value}"));
		map.addLayer(graphicsLayer);
		buildLegend();
		*/
    // Set up Custom Select
    $("#indicatorSelect").customSelect();
    $("<span class='customSelectImage'></span>").insertAfter("#indicatorSelect");

    $(".customSelectInner").html("Total fertility rate (children per women)");
    $scope.currentIndicator = "Total fertility rate (children per women)";
		$scope.changer = '20171000';
		$scope.changeIndicator = function(changer) {
      currentData = Global.getDataByIndicator[changer.changer];
			map.setExtent(map.extent);
			buildLegend(currentData);
      $scope.currentIndicator = Config.indicatorByCode[changer.changer];
      /*for (var i = 0; i < newValues.length; i++) {
      graphicsLayer.graphics[i].attributes.class = newValues[i].class;
      graphicsLayer.graphics[i].attributes.value = newValues[i].val;
      graphicsLayer.graphics[i].attributes.name = newValues[i].label;
      graphicsLayer.graphics[i].attributes.year = newValues[i].year;*/

		}

    $scope.togglePopover = function() {
      if (document.getElementsByClassName('popoverMap')[0].style.display != 'block')
        document.getElementsByClassName('popoverMap')[0].style.display = 'block';
      else
        document.getElementsByClassName('popoverMap')[0].style.display = 'none';
    }

    $scope.hidePopover = function() {
      document.getElementsByClassName('popoverMap')[0].style.display = 'none';
    }

    $scope.closeCustomInfoWindow = function() {
      document.getElementById("myInfoWindow").style.display = "none";
      document.getElementById("myInfoWindowTitle").innerHTML = "";
      document.getElementById("myInfoWindowContent").innerHTML = "";
    }

	}).error(function(error){
		$('#map').replaceWith("<div class='facts'>This Feature is currently only available when the device is connected to the internet or the database is still being built. Check back again later.</div>");
	});

}

function IndicatorInfoController($scope,$routeParams,$http) {
	if ($routeParams.Previous == 'List')
		$scope.prevUrl = '#/Home/Indicators';
	else if ($routeParams.Previous == 'Country') {
		$scope.prevUrl = '#/Countries/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/Quickstats/Country';
	}	else {
		$scope.prevUrl = '#/Countries/'+$routeParams.CountryName+'/'+$routeParams.CountryId+'/Quickstats/'+$routeParams.Previous+'/'+$routeParams.IndicatorLabel+'/'+$routeParams.IndicatorId;	
	}
	
	// Set up the data
	$scope.Indicators = Global.getQuickStats;
	$http.get('data/indicatorDefinitions.json').success(function(data) {
		$scope.Defs = data.Defs;
	});
	
}


// Uses CountryIndicatorSpecifics.html
// Countries/:CountryName/:CountryId/Quickstats/:Previous/:IndicatorLabel/:IndicatorId'
function CountryIndicatorSpecifics($scope,$routeParams,$timeout,$window) {

  var chartData,chartLabels,location,countryData,indicatorYears,indicatorValues;

  $('#detailsAccordion').accordion();
  $('#detailsAccordion').accordion("option","icons",{ 'header': 'accordionCollapse', 'headerSelected': 'accordionExpand' });
  $timeout(function() {
    if($('.customSelect').css('height') == '17px')
      $('#detailsAccordion').css('top','45px');
    else
      $('#detailsAccordion').css('top','62px');
  });

  $("#indicatorSelect").customSelect();
  $("<span class='customSelectImage'></span>").insertAfter("#indicatorSelect");
  //$(".customSelectInner").html($scope.IndicatorLabel);

  $scope.Flag = Global.getCountryDetailsByCountryCode[$routeParams.CountryId].Flag;
  $scope.CountryName = $routeParams.CountryName;
  $scope.IndicatorLabel = $routeParams.IndicatorLabel;

  // Create Chart
  Global.chart = new Highcharts.Chart({
    chart: {
      renderTo: 'chartContainer',
      type: 'column'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: chartLabels,
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        align: 'high'
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      name: $scope.CountryName,
      data: chartData
    }]
  });

  // Support Functions
  $scope.changer = $routeParams.IndicatorLabel;
  $scope.changeIndicator = function(changer) {
    chartData = [], chartLabels = [];
    if (typeof changer === 'string'){
      location = Config.indicatorDefsLookup[changer];
      $('.customSelectInner').html(changer);
    } else {
      location = Config.indicatorDefsLookup[changer.changer];
      $('.customSelectInner').html(changer.changer);
    }
    countryData = Global.getDataByCountry[$routeParams.CountryId];
    indicatorYears = countryData.YEARS;
    indicatorValues = countryData.DATA;
    $.each(indicatorYears,function(i,year){
      $.each(indicatorValues,function(index,value){
        if (index == location){
          if (value[year] === undefined){} else {
            chartValue = value[year];
            if (typeof year == "string")
              yearValue = parseInt(year.slice(0,4));
            else
              yearValue = year;

            chartData.push(chartValue);
            chartLabels.push(yearValue); // For Bar Charts
          }
        }
      });
    });


    if (chartData.length > 0) {
      if($('.customSelect').css('height') == '17px')
        $('#detailsAccordion').css('top','45px');
      else
        $('#detailsAccordion').css('top','62px');

      $('#chartContainer').css('display','block');
      $('#noChartMessage').css('display','none');
      Global.chart.series[0].setData(chartData);
      Global.chart.xAxis[0].setCategories(chartLabels);
    } else {
      $('#chartContainer').css('display','none');
      $('#noChartMessage').css('display','block');
      document.getElementById("noChartMessage").innerHTML = "<p>There is no data for this particular Indicator.</p>";
    }

  }

  // Call the Chart
  $scope.changeIndicator($scope.IndicatorLabel);

  if ($routeParams.Previous == "Country")
    $scope.prevUrl = "#/Countries/"+$routeParams.CountryName+"/"+$routeParams.CountryId+"/Quickstats/"+$routeParams.Previous;
  else
    $scope.prevUrl = "#/Countries/"+$routeParams.CountryName+"/"+$routeParams.CountryId+"/Quickstats/"+$routeParams.Previous+"/"+$routeParams.IndicatorLabel+"/"+$routeParams.IndicatorId;
}


function HomePageController($http, $scope, $timeout) {

	/*var slider = $('#mySlider').carousel({
		elements: {
			prevNext: false,
			counter: false
		}
	});
	slider.init();
	*/
	
	/* Set the App Footer position to Absolute for this view TODO Android Specific Code Here
	$('#AppFooter').css("position","absolute");*/

	var mySlider = new Swipe(document.getElementById('mySlider'),{
		callback: function(event, index, elem) {
			var node = dojo.query('.on');
			dojo.removeClass(node[0],'on');
			dojo.addClass('_'+index,'on');

			/* TODO This Code is ONLY FOR ANDROID < 4.0
			$("#swipeGallery li").each(function() {
				if (this.id === elem.id) {
					$(this).css("display","block");
				} else {
					$(this).css("display","none");
		    }
	    });*/

		}
	});

	mySlider.setup();
	
	$timeout(function() {
    /*   TODO Android Specific Code Here
     var viewportHeight = parseInt($(window).outerHeight(),10);
     */
		var viewportHeight = parseInt($(window).innerHeight(),10); //iOS Version
		var newHeight = viewportHeight-158;
		$("<style>.swipe li { height: "+newHeight+"px !important; }</style>" ).appendTo( "head" );
		/* TODO This Code is ONLY FOR ANDROID < 4.0
		$("#swipeGallery li").each(function() {
			if(this.id == 'education') {
				$(this).css("display","block");
			} else {
				$(this).css("display","none");
			}
		});
		*/
	});
	
	// Check if I am online or Offline
	Online = 'Offline';
	$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
		Online = 'Online';
	});
	
	// Create Database On Initial Load
	if (!AppLoaded) {
		AppLoaded = true;
    document.addEventListener('deviceready',deviceReady,false);
		Global.Database = local_resources.createDatabase("DHSDB",1.0,"DHSDB",5000000);
		local_resources.createTables(Global.Database,function(response){
			
			local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
				if (results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						if (results[i].name == 'getQuickStats' || results[i].name == 'getCountries' || results[i].name == 'getRecentSurveys') {
					  	Global[results[i].name] = JSON.parse(results[i].json).Data;
					  }
						else  	 
					  	Global[results[i].name] = JSON.parse(results[i].json);
					}
					local_resources.checkForUpdates(Global.Database,"http://measuredhs.com/API/DHS/checkForDataUpdates/","jsonp",function(error,results){
						Online = 'Online';
						local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
						  for (var i = 0; i < results.length; i++) {
						 	  if (results[i].name == 'getQuickStats' || results[i].name == 'getCountries' || results[i].name == 'getRecentSurveys')
						 	    Global[results[i].name] = JSON.parse(results[i].json).Data;
						 	  else  	 
							 	  Global[results[i].name] = JSON.parse(results[i].json);
						  }
						  // Remove Loading Wheel 
					  });
					});
				} else { 
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
							local_resources.selectRows(Global.Database,"SELECT name,json FROM offline_jsonresources",function(results){
						  	for (var i = 0; i < results.length; i++) {
						 	  	if (results[i].name == 'getQuickStats' || results[i].name == 'getCountries' || results[i].name == 'getRecentSurveys')
						 	    	Global[results[i].name] = JSON.parse(results[i].json).Data;
						 	    else  	 
							 	  	Global[results[i].name] = JSON.parse(results[i].json);
							  }
							 	// Remove Loading Wheel 
						  });
					  });
						
						
					}); 
				}
			}); // End Select Rows Test	
		}); // End Create Tables

    // Update TimeStamp to show last update time
    localStorage.setItem('Update',new Date());
	}
}