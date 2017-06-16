define([
		'angular',
		'modules/adver/services/adver-service',
		'modules/adver/controllers/adver-basic',
		'modules/adver/controllers/adver-finish',
		'modules/adver/controllers/adver-release',
		'angularBootstrap'
	],
	function(angular,adverServices,adverBasic,adverFinish,adverRelease){
		'use strict';
		return angular.module('app.adver', [])

		.factory('adverServices', adverServices)
		.controller('app.adver.basic', adverBasic)
		.controller('app.adver.finish', adverFinish)
		.controller('app.adver.release', adverRelease)
	})