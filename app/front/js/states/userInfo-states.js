/**
 * 个人中心模块,用于用于路由懒加载
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-09
 */
define(['angularUiRouter','modules/userInfo/main'],function () {
	'use strict';
	return angular.module('app.states.userInfo',['ui.router'])
		   .config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {

				  $stateProvider.state('states.userInfo',{
				  		abstract: true,
					  	url: '/userInfo',
	            		/*sticky: true,*/
	            		views:{
							'@':{
					  			templateUrl:'views/userInfo/userInfo-basic.html',
					  			controller:'app.userInfo.basic'
					  		}
	            		}
				  		
				  })
				  .state('states.userInfo.basicInfo',{
				  	url:'/basicInfo',
				  	views:{
				  		'@states.userInfo':{
				  			templateUrl:'views/userInfo/userInfo-info.html',
				  			controller:'app.userInfo.info'
				  		}
				  	}
				  })
				  .state('states.userInfo.headImgModify',{
				  	url:'/headImgModify',
				  	views:{
				  		'@states.userInfo':{
				  			templateUrl:'views/userInfo/userInfo-headImg.html',
				  			controller:'app.userInfo.headImg'
				  		}
				  	}
				  })
				  .state('states.userInfo.pswModify',{
				  	url:'/pswModify',
				  	views:{
				  		'@states.userInfo':{
				  			templateUrl:'views/userInfo/userInfo-password.html',
				  			controller:'app.userInfo.password'
				  		}
				  	}
				  })

			}]);
})