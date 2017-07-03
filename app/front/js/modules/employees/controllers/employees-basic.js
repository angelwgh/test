define(function () {
	'use strict';

	return ['$scope','employeesServices','$window',
		function ($scope,employeesServices,$window) {
		//console.log(1)
		var accessToken = $window.localStorage['accessToken'];
		console.log(accessToken)
		$scope.data = '义乌'

		//$scope.employees
		$scope.r_time = 1000*600; //更新时间


		$scope.timer =null; //计时器
		var a = 1
		$scope.events={
			queryEmployees:function () {
				var data = {
					"msgHead":"",
           			"msgBody":"",
             		"jsonHead":{                   
              			"accessToken":accessToken
                    },
                	"jsonBody":{
                    	"pageDto":{
							"pageNo": 1,
							"pageSize": 10 
						}
      				} 
				}
				employeesServices.queryEmployees(data).then(function (data) {
					console.log(data);
					$scope.employees = data.jsonBody;
				})
			},
			refreshEmployees:function () {
				//console.log(a++)
				$scope.events.queryEmployees()

				//console.log(11111111111)
				$scope.timer =setTimeout($scope.events.refreshEmployees,$scope.r_time)
			}
		}
		$scope.events.queryEmployees()
		setTimeout($scope.events.refreshEmployees,$scope.r_time)
		
		//$scope.events.refreshEmployees()
	}]
})