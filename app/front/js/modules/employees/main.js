/**
 * 我的人脉圈
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-20
 */
define([
		'angular',
		'modules/employees/services/employees-service',
		'modules/employees/controllers/employees-basic'

	],
	function(angular,
		employeesServices,
		employeesBasic){
		'use strict';
		return angular.module('app.employees', [])

		.factory('employeesServices', employeesServices)
		.controller('app.employees.basic', employeesBasic)

	})
