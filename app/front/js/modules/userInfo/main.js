define([
		'angular',
		'modules/userInfo/services/userInfo-service',
		'modules/userInfo/controllers/userInfo-basic',
		'modules/userInfo/controllers/userInfo-info',
		'modules/userInfo/controllers/userInfo-headImg',
		'modules/userInfo/controllers/userInfo-password',
		
	],
	function(angular,userInfoServices,userInfoBasic,userInfoInfo,userInfoHeadImg,userInfoPassword){
		'use strict';

		return angular.module('app.userInfo', [])

		.factory('userInfoServices', userInfoServices)
		.controller('app.userInfo.basic', userInfoBasic)
		.controller('app.userInfo.info', userInfoInfo)
		.controller('app.userInfo.headImg', userInfoHeadImg)
		.controller('app.userInfo.password', userInfoPassword)
	})