/**
 * 我的员工
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-07-01
 */
define(['angularUiRouter','modules/employees/main'],function () {
	'use strict';
	return angular.module('app.states.employees',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.employees',{
					  	url: '/employees',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			templateUrl:'views/employees/employees-basic.html',
					  			//template:'<div>人脉圈</div>',
					  			controller:'app.employees.basic'
					  			  				
					  			
					  		}
	            		}
				  		
				  })

			}]);
})