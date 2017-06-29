
//查看帖子窗口
define(function () {
	'use strict';

	return ['$scope','options','$modalInstance',
		function ($scope,options,$modalInstance) {

		$scope.data=options.model;
		$scope.events={
			close:function () {
				$modalInstance.dismiss()
			}
		}
	}]
})