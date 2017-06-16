define(function () {
	'use strict';

	return ['$scope','userInfoServices','BasicData','$state','modalfix',
		function ($scope,userInfoServices,BasicData,$state,modalfix) {
				userInfoServices.getUserInfo().then(function (data) {
					data.jsonBody.headImg = '/mfs/headImage/LOGO-62c8d4cf557e4185869348ab5704c49c.png';
					$scope.user_info = data.jsonBody;
					console.log($scope.user_info)
					
				})
	}]
})