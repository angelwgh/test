 /*列表树*/
 //model 列表树对象
 //active 当前选中的项目

define(['angular'],function (angular) {
	var listTree = angular.module('listTree',[]);

	listTree.directive('listTree', [ function(){
		// Runs during compile
		return {
			restrict: 'AE',

			scope:{
				model:'=',
				active:'='
			},
			template:'<ul class="layer-1">'+
						'<li class="layer-1-item" ng-repeat="item in model" ng-click="event.setActive($event,item.id)">'+
							'<i class="icon glyphicon" ng-class="{\'glyphicon-triangle-bottom\':(activeId==item.id),\'glyphicon-triangle-right\':(activeId!==item.id)}"></i>'+
							'<h4>b{{item.name}}</h4>'+
							'<ul ng-if="activeId==item.id" class="layer-2 clearfix">'+
								'<li class="layer-2-item"'+ 
											'ng-repeat="subItem in item.sub"'+
											' ng-click="event.setSelectedItem($event,subItem,item.name)"'+
											'ng-class="{\'active\':(subItem.id==active.id)}"'+
											'>b{{subItem.name}}</li>'+
							'</ul>'+
						'</li>'+
					'</ul>',
			link: function($scope, iElm, iAttrs, controller) {


				$scope.event={
					setActive:function (e,id) {
						e.stopPropagation();
						if($scope.activeId !== id){
							$scope.activeId = id;
						}else{
							$scope.activeId=null;
						}
						
					},
					setSelectedItem:function (e,o,n) {
						e.stopPropagation();
						$scope.active.id = o.id;
						$scope.active.name=n+' > '+o.name;
						$scope.activeId=null;
						//console.log($scope.active)
						//console.log(o)
						//
					}
				}
			}
		};
	}]);
})