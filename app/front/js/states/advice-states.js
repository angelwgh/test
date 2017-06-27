/**
 * 一件反馈
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-19
 */
define(['angularUiRouter','modules/advice/main'],function () {
	'use strict';
	return angular.module('app.states.advice',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.advice',{
					  	url: '/advice',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			templateUrl:'views/advice/advice-basic.html',
					  			controller:'app.advice.basic'	  				
					  			
					  		}
	            		}
				  		
				  })

			}]);
})