

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

});