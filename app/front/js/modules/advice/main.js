define([
		'angular',
		'modules/advice/services/advice-service',
		'modules/advice/controllers/advice-basic',

	],
	function(angular,adviceServices,adviceBasic){
		'use strict';
		return angular.module('app.advice', [])

		.factory('adviceServices', adviceServices)
		.controller('app.advice.basic', adviceBasic)
	})