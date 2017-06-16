/**
 * 设置站点的一些基本服务
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-09
 * @return {[type]}   [description]
 */
define(function () {
	'use strict';

	var authorizationSystem = angular.module ('AuthorizationSystem', ['ui.bootstrap']);

	authorizationSystem.factory('BasicData',['authorize',function (authorize) {
		return{
			user_info:null,
			menu_list:[
				{
					id:'01',
					name:'广告管理',
					icon:"glyphicon-davice",
					state:'states.adver',
					subs:[
						{
							name:'在用广告',
							state:'states.adver.list'
						},
						{
							name:'以往广告',
							state:'states.adver.finish'
						},
						{
							name:'发布广告',
							state:'states.adver.release'
						}
					]
				},
				{
					id:'02',
					name:'个人中心',
					icon:'glyphicon-user',
					state:'states.userInfo',
					subs:[
						{
							name:'个人基础信息',
							state:'states.userInfo.basicInfo'
						},
						{
							name:'修改头像',
							state:'states.userInfo.headImgModify'
						},
						{
							name:'修改密码',
							state:'states.userInfo.pswModify'
						}
					]

				},
				{
					id:'03',
					name:'意见反馈',
					icon:'glyphicon-comment',
					state:'states.advice',
					subs:[]
				}
			],
			//用户权限
			permissions:{
				adver:{
					list:true,
					finish:true,
					release:true,
					delete:true,
					modify:true
				},
				userInfo:{
					get:true,
					modify:true,
					modify_headimg:true,
					modify_password:true,
				},
				advice:{

				}
			},
			loginOut:function () {
				return authorize.loginOut()
			}
		}
	}])
	//注销
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
		// 监听路由变化
		$rootScope.$on('$stateChangeStart',function (e,toState) {
			$rootScope.activeState = toState //保存当前路由状态

			$http.get ('/FxbManager/userController/userInfo')
		 	  .then(function (data) {
		 	  	if(data.data.state=='-1'||data.data.jsonBody == null){
		 	  		alert(data.data.msg);
		 	  		window.location = '/login'
		 	  	}
		 	})
		})
	}])

	//模态框服务
	authorizationSystem.factory('modalfix', ['$modal', function($modal){
			var options={
				size:'sm',
				msg:''
			}

			function open() {
				var modalInstance = $modal.open({
			      	templateUrl: 'templates/modal.html',
			      	controller: function ($scope,items,$modalInstance) {
			      		//console.log(items)
			      		$scope.msg = items.msg
				      	$scope.ok=function () {			      		
							//console.log(items)
							$modalInstance.close(items.confirmFn)
						}
						$scope.cancel=function () {
							$modalInstance.dismiss('cancel')
						}
				    },
				    size: options.size,
				      //把items注入到controller中去
				    resolve: {
				        items: function () {
				          return options;
				        }
				      }
			    })
				
			     modalInstance.result.then(function (fn) {
			     	if(typeof fn == 'function'){
			     		fn();
			     	}
			     	
			     },function () {
			     	//console.log('Modal dismissed at: ' + new Date())
			     })
			}
			

		return {
			//是否确认
			confirm:function (data) {
				//options.msg = data.msg
				angular.forEach(data, function(value, key){
					options[key] = data[key]
				});
				//console.log(options)
				open();
				
			},
			ok:function (data) {
				angular.forEach(data, function(value, key){
					options[key] = data[key]
				});

				open();
			}
		}

			
			

		
	}])

})