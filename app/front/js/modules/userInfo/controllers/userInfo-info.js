define(function () {
	'use strict';

	return ['$scope','userInfoServices','BasicData','$state','modalfix',
		function ($scope,userInfoServices,BasicData,$state,modalfix) {
			$scope.data={
				modify:false
			}

			$scope.modify_data={

			}

			$scope.events={
				modifyInfo:function () {
					$scope.data.modify = true;
					$scope.modify_data.name = $scope.user_info.name;
					$scope.modify_data.tel  = $scope.user_info.tel;
					$scope.modify_data.createTime = $scope.user_info.createTime;
					$scope.modify_data.sex  = $scope.user_info.sex;
					$scope.modify_data.card  = $scope.user_info.card;
					$scope.modify_data.keyWord  = $scope.user_info.keyWord;

				},
				back:function () {
					$scope.data.modify = false;
				},
				updateUserInfo:function (e) {
					e.stopPropagation();
					console.log($scope.modify_data)
					var modify = {
						name:$scope.modify_data.name,
						sex:$scope.modify_data.sex,
                        tell:$scope.modify_data.tel,
                        keyWord:$scope.modify_data.keyWord,
                        card:$scope.modify_data.card
					}
					userInfoServices.updateUserInfo(modify).then(function (data) {
						console.log(data)
						if(data.state == 1){
							modalfix.ok({
								msg:'修改成功!'
							});
							$scope.basic_events.getUserInfo()
						}
						
					})
	                //return baseUrl.one('updateUserInfo').get(data)
	            },
			}
	}]
})