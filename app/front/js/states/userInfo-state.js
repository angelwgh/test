/**
 * 个人中心模块,用于用于路由懒加载
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-09
 */
define(['angularUiRouter'],function () {
	'use strict';
	return angular.module('app.states.userInfo',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.userInfo',{
					  	url: '/userInfo',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			template:'<div>个人中心</div>'
					  		}
	            		}
				  		
				  })

			}]);
})