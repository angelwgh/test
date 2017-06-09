/**
 * angular 主模块
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-07
 * 
 */
define([
		'home',
		'states/home-states'
	],function () {
	'use strict';
	var frontModule = angular.module('app', 
		[
			'app.home',
			'states.home'
		])

	return frontModule;
})