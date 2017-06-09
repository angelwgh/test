/**
 * 首页路由设置
 */

define(['angularUiRouter'],function (router) {
	'use strict';
	var statesModel = angular.module('states.home',[
			'ui.router'
		])

	statesModel.config(function (
			$stateProvider,
            $urlRouterProvider
		) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider.state('states',{
			abstract: true,
			url:'',
			views:{
				"topView":{
					templateUrl:'views/home/top.html'
				},
				"footView":{
					templateUrl:'views/home/foot.html'
				}
			}
		})
		.state('states.home',{
			url:'/home',
			views:{
				'bodyView@':{
					templateUrl:'views/home/body.html',
					controller:'homeController'
				}
			}
		})
	})
})