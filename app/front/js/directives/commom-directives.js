

define (['angular'], function (angular) {

	var common = angular.module ('common', []);

	common.directive ('ghReadonly', readonly);
	//input输入框只读
	readonly.$inject = [];
	function readonly () { 

		return {
			link: function ($scope, $element, $attributes) {
				$element.on ('keyup keydown', function () {
					return false;
				})
			}
		}
	}


	common.directive('ghWindow', ['$log', function($log){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			//template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				console.log(iElm)
				console.log(controller)
			}
		};
	}]);

	common.directive('repeatDone', ['$log', function($log){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				//$log.info($scope.$last)
				//$log.info(iAttrs)
				if($scope.$last){
					$scope.$eval(iAttrs.repeatDone)
				}
			}
		};
	}]);
});