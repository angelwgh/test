define(function () {
	'use strict';

	return ['$scope','adverServices','BasicData','$state','modalfix',
		function ($scope,adverServices,BasicData,$state,modalfix) {
		//console.log(adverServices)
		//console.log(adverServices)
		$scope.adver_data={
			permissions:BasicData.permissions.adver,
			params:{
				pageNo: 1,
                pageSize: 17,
                endCreateTime: 'today',
                keyword: null 
			},

			upload:'add',
			modify:null
		}

		//console.log($scope.adver_data)

		$scope.events={
			queryBeforeAdvertList:function () {
				
				adverServices.queryBeforeAdvertList($scope.adver_data.params)
				.then(function (data) {
					//console.log(data.jsonBody)

					angular.forEach(data.jsonBody,function (item,index) {
						if (item.imagePath) {
	                        item.imagePath = BasicData.img_basic_url+item.imagePath.substring(7);
	                    };
	                    if(item.beginTime){
	                    	item.effTime = item.beginTime+'至'+item.endTime
	                    }else{
	                    	item.effTime = '未认证时间'
	                    }
					})
					
					$scope.adver_data.adver_list = data.jsonBody;
					//console.log($scope.adver_data)
				})
			},
			modifyBeforeAdvert:function (e,adver) {
				e.stopPropagation();
				$scope.adver_data.modify=adver;
				$scope.adver_data.upload='modify';
				$state.go('states.adver.release')
			},
			delete:function (e,adver) {
				e.stopPropagation();
				modalfix.confirm({
					msg:'确认要删除这条广告吗?',
					confirmFn:function () {
						console.log(adver)
						adverServices.delete(adver.id);
						angular.forEach($scope.adver_data.adver_list, function(value, key){
							if(value.id == adver.id){
								$scope.adver_data.adver_list.splice(key,1)
							}
						});
					}
				})
				
				//$scope.events.queryBeforeAdvertList();
				
			}
		}

		$scope.events.queryBeforeAdvertList();
		
	}]
})