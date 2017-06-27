define(function () {
	'use strict';

	return ['$scope','userInfoServices','BasicData','$state','modalfix',
		function ($scope,userInfoServices,BasicData,$state,modalfix) {
			$scope.model={}

			$scope.$watch('model', function(newValue, oldValue, scope) {
				if(!newValue.file){return}
				console.log(newValue.file.uploadImgPath)
				if(newValue.file.uploadImgPath){
					userInfoServices.modifyHeadImg({headImg:newValue.file.uploadImgPath})
					.then(function (data) {
						if(data.state == 1){
							modalfix.ok({msg:'头像修改成功'})
						}else{
							modalfix.ok({msg:'头像修改失败'})
						}
					})
				}
			}, true);
	}]
})