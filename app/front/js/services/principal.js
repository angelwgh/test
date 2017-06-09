/**
 * 设置站点的一些基本服务
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-09
 * @return {[type]}   [description]
 */
define(function () {
	'use strict';

	var authorizationSystem = angular.module ('AuthorizationSystem', []);

	authorizationSystem.factory('BasicData',['authorize',function (authorize) {
		return{
			user_info:null,
			menu_list:[
				{
					id:'01',
					name:'广告管理',
					icon:"glyphicon-edit"
				},
				{
					id:'02',
					name:'个人中心',
					icon:'glyphicon-user',
					state:'states.userInfo'
				},
				{
					id:'03',
					name:'意见反馈',
					icon:'glyphicon-comment'
				}
			],
			loginOut:function () {
				return authorize.loginOut()
			}
		}
	}])
	authorizationSystem.factory ('authorize', ['$window', '$http', '$rootScope',
		function function_name($window,$http,$rootScope) {
			return{
				loginOut:function () {
					return $http.get('/FxbManager/userController/doLogout')
				}
			}
		}])
	authorizationSystem.run(['$http','$rootScope','BasicData',function ($http,$rootScope,BasicData) {
		$http.get('/FxbManager/userController/queryUser')
			 .then(function (data) {
			 	//获取基本的用户信息
			 	BasicData.user_info = data.data.jsonBody;

			 })
		// 路由开始转换的时候触发事件
		$rootScope.$on('$stateChangeStart',function (e,toState) {
			$http.get ('/FxbManager/userController/userInfo')
		 	  .then(function (data) {
		 	  	if(data.data.state=='-1'||data.data.jsonBody == null){
		 	  		alert(data.data.msg);
		 	  		window.location = '/login'
		 	  	}
		 	})
		})
	}])
})