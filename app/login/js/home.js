/**
 * 首页控制器
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-07
 */
define(['angular','md5','cookie'],function (angular,md5,cookie) {
	'use strict';
	var home = angular.module('app.home',[]);

	home.factory('getCookiesInfo',  function(){
		return function (data) {
			console.log(cookie.get(data.cruuent+'_remember'))
			//如果cookies中有帐号信息,读取cookie中的用户名和密码
			if(cookie.get(data.cruuent+'_remember')){
				//data.username = $cookies[data.cruuent+'_username'];
				//data.password = $cookies[data.cruuent+'_password'];
				//data.remember = true;
				data.username = cookie.get(data.cruuent+'_username');
				data.password = cookie.get(data.cruuent+'_password');
				data.remember = true;
			}else{
				data.username = null;
				data.password = null;
				data.remember = false;
			}
			
			
			//console.log(data)
		}
	});

	home.controller('homeController', [
		'$scope',
		'getCookiesInfo',
		'$http',
		function($scope,getCookiesInfo,$http){
		$scope.account_info={
			account_type:'1',
			cruuent:'normal',
			remember:false,
			username:null,
			password:null
		};

		$scope.$watch('account_info.account_type', function(newValue, oldValue, scope) {

			if(newValue == '1'){
				$scope.account_info.cruuent = 'normal';
				
				
			}else if(newValue == "2"){
				$scope.account_info.cruuent = 'admin';
				
			}
			getCookiesInfo($scope.account_info)
		});



		$scope.events={
			//选择帐号类型
			selectAccountType:function (type) {
				$scope.account_info.account_type=type;
			},
			//提交登录
			submit:function () {

				//判断是否保存cookies
				if($scope.account_info.remember){
					var d = (new Date("2018/1/6 11:44:30")).toGMTString();
					/*$cookies[$scope.account_info.cruuent+'_username'] = $scope.account_info.username
					console.dir($cookies)
					$cookies[$scope.account_info.cruuent+'_password'] = $scope.account_info.password;
					$cookies[$scope.account_info.cruuent+'_remember'] = $scope.account_info.remember;*/
					cookie.set($scope.account_info.cruuent+'_username',$scope.account_info.username,{expires: d});
					cookie.set($scope.account_info.cruuent+'_password',$scope.account_info.password,{expires: d});
					cookie.set($scope.account_info.cruuent+'_remember',$scope.account_info.remember,{expires: d});
				}else{
					//删除cookie
					cookie.expire($scope.account_info.cruuent+'_username');
					cookie.expire($scope.account_info.cruuent+'_password');
					cookie.expire($scope.account_info.cruuent+'_remember');

					/*delete $cookies[$scope.account_info.cruuent+'_username'];
					delete $cookies[$scope.account_info.cruuent+'_password'];
					delete $cookies[$scope.account_info.cruuent+'_remember'];*/
				}

				//console.log(md5($scope.account_info.password))
				$http({
					method:'get',
					url:'/FxbManager/userController/login',
					params:{
						username:$scope.account_info.username,
						password:md5($scope.account_info.password),
						accountType:$scope.account_info.account_type
					}
				})
				.then(function (data) {
					//console.log(data.data.jsonBody.location.replace(/^https?:\/\/[\w-.]+(:\d+)?/i,''))
					window.location = data.data.jsonBody.location.replace(/^https?:\/\/[\w-.]+(:\d+)?/i,'')
					//console.log(window.location)
				})
				
			}
		}
	}])
})