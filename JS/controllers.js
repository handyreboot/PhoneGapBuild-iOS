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
	$scope.CountryId = $routeParams.CountryId	;
	
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

function InfoController() { }

function footerController($scope,$route,$window, $location) {
	$scope.$on('$viewContentLoaded',function(){
		//$window._gaq.push(['_trackPageview', $location.path()]);
		
		switch ($route.current.$route.templateUrl) {
			case 'partials/Homepage.html' :
				$scope.Quickstats = '';
				$scope.Indicators = '';
				$scope.Surveys = '';
				$scope.Home = 'selected';
				$scope.Maps = '';
				break;
			case 'partials/CountryQuickstats.html' :
				$scope.Quickstats = 'selected';
				$scope.Indicators = '';
				$scope.Surveys = '';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/Surveys.html' :
				$scope.Quickstats = '';
				$scope.Indicators = '';
				$scope.Surveys = 'selected';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/IndicatorList.html' :
				$scope.Quickstats = '';
				$scope.Indicators = 'selected';
				$scope.Surveys = '';
				$scope.Home = '';
				$scope.Maps = '';
				break;
			case 'partials/Map.html' :
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
	$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
		Online = 'Online';
		dojo.require("esri.map");
		dojo.require("esri.layers.FeatureLayer");
		dojo.require("esri.tasks.query");
		dojo.require("esri.renderer");
		dojo.require("esri.layers.graphics");
		dojo.require("dojo.number")
		
		var initialExtent = new esri.geometry.Extent({
			"xmin" : -2200000,
			"ymin" : -4500000,
			"xmax" : 6800000,
			"ymax" : 4500000,
			"spatialReference" : {
				"wkid" : 102100
			}
		});

		
		map = new esri.Map("map" , {
			extent : initialExtent,
			fitExtent : true,
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
		
		var buildLegend = function() {
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

		var tiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://ags101-08-mdhs-prod.blueraster.com/ArcGIS/rest/services/production/MeasureDHS_LabelBaseTiles/MapServer/");
		map.addLayer(tiledMapServiceLayer);
		// Symbols for the Renderer
		var defaultSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([0,0,0,0]), 1),new dojo.Color([255,0,0,0]));
		
		var class1 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([0,0,0,0]), 1),new dojo.Color([203, 201, 226,0.5]));
			
		var class2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([0,0,0,0]), 1),new dojo.Color([158, 154, 200,0.5]));
			
		var class3 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([0,0,0,0]), 1),new dojo.Color([117, 107, 177,0.5]));
			
		var class4 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
			new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
			new dojo.Color([0,0,0,0]), 1),new dojo.Color([84, 39, 143,0.5]));			
			
		// Set up the renderer
		var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, "class");
		renderer.addValue("1",class1);
		renderer.addValue("2",class2);
		renderer.addValue("3",class3);
		renderer.addValue("4",class4);	
			
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
				graphicsLayer.add(graphic);
				graphicsArray[Global.getCountries[i][0]] = graphic;
			}
		}	
		graphicsLayer.setRenderer(renderer);
		graphicsLayer.setInfoTemplate(new esri.InfoTemplate("<b>${name}</b>","${year} - ${value}"));
		map.addLayer(graphicsLayer);
		buildLegend();
		
		$scope.changer = '20171000'
		$scope.changeIndicator = function(changer) {
			var newValues = Global.getDataByIndicator[changer.changer];
			for (var i = 0; i < newValues.length; i++) {
				graphicsLayer.graphics[i].attributes.class = newValues[i].class;
				graphicsLayer.graphics[i].attributes.value = newValues[i].val;
				graphicsLayer.graphics[i].attributes.name = newValues[i].label;
				graphicsLayer.graphics[i].attributes.year = newValues[i].year;
			}
			map.setExtent(map.extent);
			buildLegend();
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

function HomePageController($http, $scope, $timeout) {

	/*var slider = $('#mySlider').carousel({
		elements: {
			prevNext: false,
			counter: false
		}
	});
	slider.init();
	*/
	
	var mySlider = new Swipe(document.getElementById('mySlider'),{
		callback: function(event, index, elem) {
			var node = dojo.query('.on');
			dojo.removeClass(node[0],'on');
			dojo.addClass('_'+index,'on');
		}
	});

	mySlider.setup();
	
	$timeout(function() {
		var viewportHeight = parseInt($(window).innerHeight(),10);
		var newHeight = viewportHeight-158;
		$("<style>.swipe li { height: "+newHeight+"px; }</style>" ).appendTo( "head" );
	});		
	
	// Check if I am online or Offline
	Online = 'Offline';
	$http.jsonp('http://www.measuredhs.com/API/DHS/getQuickStats/?callback=JSON_CALLBACK&f=json').success(function(data,status,headers,config){
		Online = 'Online';
	});
	
	// Create Database On Initial Load
	if (!AppLoaded) {
		AppLoaded = true;
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
	}
}