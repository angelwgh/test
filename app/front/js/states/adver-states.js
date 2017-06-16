/**
 * 广告中心模块
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-10
 * @param  {[type]}   ) {	'use       strict';	return angular.module('app.states.userInfo',['ui.router'])		   .config(['$stateProvider',				 '$urlRouterProvider',				 function($stateProvider,$urlRouterProvider) {				  $stateProvider.state('states.userInfo',{					  	url: '/userInfo',	            			            		views:{							'@':{					  			template:'<div>个人中心</div>'					  		}	            		}				  						  })			}]);} [description]
 * @return {[type]}     [description]
 */
define(['angularUiRouter','modules/adver/main'],function () {
	'use strict';
	return angular.module('app.states.adver',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.adver',{
				  		abstract: true,
					  	url: '/adver',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			templateUrl:'views/adver/adver-basic.html',
					  			controller :'app.adver.basic' 				
					  		
					  		}
	            		} 
				  		
				  })
				  .state('states.adver.list',{
				  	url:'/list',
				  	views:{
				  		'@states.adver':{
				  			templateUrl:'views/adver/adver-list.html',
				  			controller:function ($scope) {
				  				$scope.events.queryBeforeAdvertList();
				  				$scope.adver_data.modify = null;
				  				$scope.adver_data.upload = 'add';
				  				//console.log($scope.adver_data)
				  			}
				  		}
				  	}
				  })
				  .state('states.adver.finish',{
				  	url:'/finish',
				  	views:{
				  		'@states.adver':{
				  			templateUrl:'views/adver/adver-finish.html',
				  			controller:'app.adver.finish'
				  		}
				  	}
				  })
				  .state('states.adver.release',{
				  	url:'/release',
				  	views:{
				  		'@states.adver':{
				  			templateUrl:'views/adver/adver-release.html',
				  			controller:'app.adver.release'
				  		}
				  	}
				  })

			}]);
})