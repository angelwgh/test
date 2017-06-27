define(['md5'],function (md5) {
	'use strict';

	return ['$scope','userInfoServices','BasicData','$state','modalfix',
		function ($scope,userInfoServices,BasicData,$state,modalfix) {
			$scope.psw_data={}

			$scope.$watch('psw_data', function(newValue, oldValue, scope) {


				if(newValue.oldPassword == newValue.newPassword){
					$scope.psw_data.same_o_pwd = true;
					//console.log(newValue)

				}else{
					$scope.psw_data.same_o_pwd = false;
					//console.log(newValue)
				}


				if(newValue.newPassword == newValue.conPassword){
					//console.log(newValue)
					$scope.psw_data.same_n_pwd = true;
				}else{
					//console.log(newValue)
					$scope.psw_data.same_n_pwd = false;
				}


			}, true);

			$scope.events= {
				updataPassword:function (e) {
					e.stopPropagation();
					var data = {
						username:$scope.user_info.account,
						password:md5($scope.psw_data.oldPassword),
						newPassWord:md5($scope.psw_data.newPassword)
					}
					userInfoServices.updatePassWord(data).then(function (data) {
						console.log(data)
						if(data.state == 1){
							modalfix.ok({msg:'密码修改成功'})
						}else{
							modalfix.ok({msg:data.msg})
						}
					})
					console.log(data)
					
				}
			} 
	}]
})