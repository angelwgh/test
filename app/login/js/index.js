/**
 * 页面主程序入口
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-07
 */
(function () {
	require.config({
		paths:{
			jquery: '../../../bower_components/jquery/dist/jquery',
			angular: '../../../bower_components/angular/angular',
			angularCookies: '../../../bower_components/angular-cookies/angular-cookies',
			angularUiRouter: '../../../bower_components/angular-ui-router/release/angular-ui-router',
			jquery: '../../../bower_components/jquery/dist/jquery',
      		cookie: '../../../bower_components/cookies-js/dist/cookies',
      		md5: '../../../bower_components/js-md5/js/md5'
		},
		shim:{
			angular: {deps: ['jquery'], exports: 'angular'},
			angularCookies: {deps: ['angular'], exports: 'angularCookies'},
			angularUiRouter: {deps: ['angular'], exports: 'angularUiRouter'},
			md5: {deps: [], exports: 'md5'}
		},
		packages: [],
		waitSeconds: 0
	});
	require(['angular','app'],function (angular,app) {
		'use strict';
		var html = angular.element (document.getElementsByTagName ('html')[0]);
		angular.bootstrap (html, ['app']);
	})
})();
