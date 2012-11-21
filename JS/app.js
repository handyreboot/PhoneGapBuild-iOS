var module = angular.module('measureDHS',['filters']).
	config(['$routeProvider',function($routeProvider) {
		$routeProvider.
			when('/Home',{templateUrl:'partials/Homepage.html',controller: HomePageController
			}).
			when('/Home/Countries',{templateUrl:'partials/CountryQuickstats.html', controller: CountryQuickStatsController 
			}).
			when('/Home/Indicators',{templateUrl:'partials/IndicatorList.html', controller:IndicatorListController
			}).
			when('/Home/Surveys',{templateUrl:'partials/Surveys.html',controller: SurveysController
			}).
			when('/Home/About',{templateUrl:'partials/Info.html', controller: InfoController 
			}).
			when('/Home/Maps',{templateUrl:'partials/Map.html',controller: MappingController
			}).
			when('/Home/IndicatorInfo/:Previous',{templateUrl:'partials/IndicatorInfo.html',controller: IndicatorInfoController
			}).
			when('/Home/IndicatorInfo/:Previous/:CountryName/:CountryId/:IndicatorLabel/:IndicatorId',{templateUrl:'partials/IndicatorInfo.html',controller: IndicatorInfoController
			}).
			/**** Survey Pages ****/
			when('/Home/Surveys/Countries',{templateUrl:'partials/SurveysCountry.html', controller: SurveysCountryController 
			}).
			when('/Home/Surveys/Recent',{templateUrl:'partials/SurveysRecent.html', controller: SurveysRecentController 
			}).
			when('/Home/Surveys/Ongoing',{templateUrl:'partials/SurveysOngoing.html', controller: SurveysOngoingController 
			}).
			when('/Home/Countries/:CountryName/:CountryId/:Previous',{templateUrl:'partials/CountriesHomepage.html',controller: CountriesHomepageController
			}).
			/**** Survey Pages ****/
			when('/Home/Countries/:CountryName/:CountryId/:Previous/:IndicatorLabel/:IndicatorId',{templateUrl:'partials/CountriesHomepage.html',controller: CountriesHomepageController
			}).
			when('/Countries/:CountryName/:CountryId/Quickstats/:Previous',{templateUrl:'partials/CountriesIndicatorsView.html', controller: CountriesIndicatorsController
			}).
			when('/Countries/:CountryName/:CountryId/Quickstats/:Previous/:IndicatorLabel/:IndicatorId',{templateUrl:'partials/CountriesIndicatorsView.html', controller: CountriesIndicatorsController
			}).
			when('/Home/Countries/:CountryName/:CountryId/:SurveyId/:Previous',{templateUrl:'partials/SurveyInformation.html',controller:SurveyInformationController	
			}).
			when('/Home/Countries/:CountryName/:CountryId/:SurveyId/:Previous/:IndicatorLabel/:IndicatorId',{templateUrl:'partials/SurveyInformation.html',controller:SurveyInformationController	
			}).
			when('/Home/Surveys/:CountryName/:CountryId/:SurveyId/:Previous',{templateUrl:'partials/SurveyInformation.html',controller:SurveyInformationController	
			}).
			when('/Home/Surveys/:Previous/:SurveyId',{templateUrl:'partials/SurveyInformation.html',controller:SurveyInformationController
			}).
			when('/Home/Indicators/:IndicatorLabel/:IndicatorId',{templateUrl:'partials/IndicatorCountriesView.html', controller: IndicatorCountriesController 
			}).
			otherwise({redirectTo:'/Home'});
}]);

angular.module('filters',[]).
	filter('replaceNulls',function() {
		return function(number, result) {
				if (number == '' || number == undefined)
					return ' - ';	
				else if (number % 1.0 == 0)
					return Math.floor(number);
				else
					return number;	
		};
	}).
	filter('removeDecimals',function(){
		return function(number) {
			if (number % 1.0 == 0)
				return Math.floor(number);
			else
				return number;
		};
	});
