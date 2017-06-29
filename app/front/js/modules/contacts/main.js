/**
 * 我的人脉圈
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-20
 */
define([
		'angular',
		'modules/contacts/services/contacts-service',
		'modules/contacts/controllers/contacts-basic',
		'modules/contacts/controllers/contacts-articl-view',
	],
	function(angular,contactsServices,contactsBasic,contactsArticlView){
		'use strict';
		return angular.module('app.contacts', [])

		.factory('contactsServices', contactsServices)
		.controller('app.contacts.basic', contactsBasic)
		.controller('app.contacts.articlView', contactsArticlView)
	})
