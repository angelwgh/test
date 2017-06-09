//首页路由设置
define(['angularUiRouter'],function (router) {
	'use strict';
	return angular.module('app.states.home', ['ui.router'])
		.config(['$stateProvider',
				 '$urlRouterProvider',
				 function($stateProvider,$urlRouterProvider) {
			$urlRouterProvider
                .otherwise('home');
            $stateProvider
            	.state("states",{
            		abstract: true, url: "",
            		views:{
            			'top-view':{
            				templateUrl: 'views/home/top.html',
            			},
            			'sideBar-view':{
            				templateUrl: 'views/home/sideBar.html',
            			}
            		}
            	})
            	.state('states.home', {
                    url: '/home',
                    views: {
                        '@': {
                            templateUrl: 'views/home/home.html'
                        }
                    }
                })
		}])
})