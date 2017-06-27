define(function () {
	'use strict';

	return ['$scope','adviceServices','BasicData','$state','modalfix',
		function ($scope,adviceServices,BasicData,$state,modalfix) {
		$scope.advice_data={
			type:'1',
			content:null,
			tel:null
		}

		$scope.events = {
			submit:function (e) {
				e.stopPropagation()
				console.log($scope)
			}
		}
		
	}]
})