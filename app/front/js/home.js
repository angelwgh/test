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
			show_top_dropdown : false,
			active : 'states.home'
		};

		$scope.$watch('basic_data',function (newValue) {
			if(newValue.user_info){
				//console.log(newValue)
				//newValue.user_info.headImg = newValue.user_info.headImg.replace('/upfile','')
				newValue.user_info.headImg='/headImage/LOGO-62c8d4cf557e4185869348ab5704c49c.png'
			}
				
		},true)
		$rootScope.$watch('activeState.name',function (newValue,oldValue) {
			
			//$scope.data
			if(newValue){
				$scope.data.active = (newValue.match(/states\.([a-zA-Z0-9_]*)/g))[0]
				$scope.data.subActive = newValue;
			}
			
		})
		$scope.events={
			//退出登录
			loginOut:function () {
				BasicData.loginOut();
				window.location = '/login';
			},

			menuClick:function (e,item) {
				if(arguments.length==0){
					$state.go('states.home');
					/*$scope.data.active = 'states.home';
					$scope.data.subActive='';*/
					return
				}
				

				if(item.subs && item.subs.length>0){
					item.isSubShow = !item.isSubShow;
				}else{
					$state.go(item.state)
					//console.log(item.state.match(/states\.([a-zA-Z0-9_]*)/g))
					/*$scope.data.active = item.state.match(/states\.([a-zA-Z0-9_]*)/g);
					$scope.data.subActive = item.state;*/
				}
				
				
					
			},
			statesGo:function (e,item) {
				e.stopPropagation();
				if(item.subs && item.subs.length>0){
					item.isSubShow = !item.isSubShow;
					//console.log(item.subs[0].state)
					$state.go(item.subs[0].state)
					$scope.data.subActive = item.subs[0].state;
				}else{
					$state.go(item.state)
				}
				//$scope.data.active = item.state.match(/states\.([a-zA-Z0-9_]*)/g);
				
			},
			/*setActive:function () {
				var state = window.location.hash.match(/([a-zA-Z\.0-9_]{1,})/g);
				//console.log(state)
				$scope.data.active = 'states.'+state[0];
				$scope.data.subActive = $scope.data.active +'.'+ state[1];
				//console.log($scope.data.subActive);
				/*var active = state.replace(/states\./,'');
				console.log(window.location.hash.match(/#\/(.*)\/?/));*/
			/*}*/

		}
		//$scope.events.setActive()

	}])
})

