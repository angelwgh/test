/**
 * 主页控制器
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-08
 * @param  {[type]}   angular) {	}         [description]
 * @return {[type]}            [description]
 */
define(['angular','restangular'],function (angular) {
	var home = angular.module('app.home', ['restangular'])

	home.controller('homeController', ['$scope','$rootScope','BasicData','$state', function($scope,$rootScope,BasicData,$state){

		$scope.basic_data = BasicData;

		$scope.data = {
			show_top_dropdown : false
		};

		$scope.$watch('basic_data',function (newValue) {
			if(newValue.user_info){
				console.log(newValue)
				//newValue.user_info.headImg = newValue.user_info.headImg.replace('/upfile','')
				newValue.user_info.headImg='/headImage/LOGO-62c8d4cf557e4185869348ab5704c49c.png'
			}
				
		},true)
		$scope.events={

			loginOut:function () {
				BasicData.loginOut();
				window.location = '/login';
			},

			stateGo:function (state) {
				$state.go('states.userInfo')
				
			}

		}

	}])
})

