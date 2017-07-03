define(function () {
	'use strict';

	return ['$scope','adviceServices','BasicData','$window','modalfix',
		function ($scope,adviceServices,BasicData,$window,modalfix) {
			var accessToken = $window.localStorage['accessToken'];
			console.log(accessToken)
		$scope.advice_data={
			
			content:null,

		}

		$scope.events = {
			submit:function (e) {
				e.stopPropagation()
				var data ={
					content:$scope.advice_data.content,
					accessToken:accessToken
				}
				adviceServices.saveFeedback(data).then(function (data) {
					console.log(data)
					if(data.state == 1){
						modalfix.ok({
							msg:'提交成功'
						})
					}else{
						modalfix.ok({
							msg:'提交失败'
						})
					}
					
				})
				///console.log($scope)
			}
		}
		
	}]
})