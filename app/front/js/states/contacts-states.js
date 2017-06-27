/**
 * 我的人脉圈
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-20
 */
define(['angularUiRouter','modules/contacts/main'],function () {
	'use strict';
	return angular.module('app.states.contacts',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.contacts',{
					  	url: '/contacts',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			templateUrl:'views/contacts/contacts-basic.html',
					  			//template:'<div>人脉圈</div>',
					  			controller:'app.contacts.basic'
					  			  				
					  			
					  		}
	            		}
				  		
				  })

			}]);
})