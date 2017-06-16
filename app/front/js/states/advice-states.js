define(['angularUiRouter'],function () {
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
					  			template:'<div>意见反馈</div>'
					  		}
	            		}
				  		
				  })

			}]);
})