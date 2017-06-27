define(function () {
	'use strict';

	return ['$scope','adverServices','BasicData','$state','modalfix',
		function ($scope,adverServices,BasicData,$state,modalfix) {

		$scope.finish_advers={
			permissions:BasicData.permissions.adver,
			params:{
				pageNo: 1,
                pageSize: 17,
                endCreateTime: "yesterday",
                keyword: null 
			}
		}
		$scope.adver_data.upload='add';
		$scope.adver_data.modify=null;
		//console.log($scope.adver_data)
		$scope.events={
			queryBeforeAdvertList:function () {
				adverServices.queryBeforeAdvertList($scope.finish_advers.params)
				.then(function (data) {
					//console.log(data.jsonBody)

					angular.forEach(data.jsonBody,function (item,index) {
						if (item.imagePath) {
	                        item.imagePath =BasicData.img_basic_url+item.imagePath.substring(7);
	                    };
	                    if(item.beginTime){
	                    	item.effTime = item.beginTime+'至'+item.endTime
	                    }else{
	                    	item.effTime = '未认证时间'
	                    }
					})
					
					$scope.finish_advers.adver_list = data.jsonBody;
					//console.log($scope.finish_advers)
				})
			},
			modifyBeforeAdvert:function (e,adver) {
				e.stopPropagation();
				$scope.adver_data.modify=adver;
				$scope.adver_data.upload='modify';
				$state.go('states.adver.release')
			},
			delete:function (e,adver) {

				modalfix.confirm({
					msg:'确认要删除这条广告吗?',
					confirmFn:function () {
						//console.log($scope.finish_advers.adver_list);
						angular.forEach($scope.finish_advers.adver_list, function(value, key){
							if(value.id == adver.id){
								//console.log(value)
								
								$scope.finish_advers.adver_list.splice(key,1)
							}
						});
						adverServices.delete(adver.id);
					}
				})
			}
		}

		//console.log(modalfix)
		$scope.events.queryBeforeAdvertList()
	}]
})