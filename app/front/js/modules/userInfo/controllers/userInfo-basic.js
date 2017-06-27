define(function () {
	'use strict';

	return ['$scope','userInfoServices','BasicData','$state','modalfix',
		function ($scope,userInfoServices,BasicData,$state,modalfix) {

			$scope.basic_events={
				getUserInfo:function () {
					userInfoServices.getUserInfo().then(function (data) {
						//console.log(data.jsonBody)
						data.jsonBody.headImg = BasicData.img_basic_url+data.jsonBody.headImg.replace('/upfile','');
						$scope.user_info = data.jsonBody;
						//console.log($scope.user_info)
						
					})
				}
			}
			$scope.basic_events.getUserInfo();
				
	}]
})