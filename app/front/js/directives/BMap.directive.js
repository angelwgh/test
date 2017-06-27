/**
 * 加载百度地图指令
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-23
 * @param  {[type]}   argument) {	}         [description]
 * @return {[type]}             [description]
 */
define(['angular'],function (angular) {
	'use strict';

	var loadBaiduPromise;
	var loadBaiduMaps = function ($q, version, apiKey ) {
	    if (loadBaiduPromise) {  	
	        return loadBaiduPromise;
	    }
	    var deferred = $q.defer(),
	        resolve = function () {
	            deferred.resolve(window.BMap ? window.BMap : false);
	        },
	        callbackName = "loadBaiduMaps_" + ( new Date().getTime() ),
	        params = {"ak": apiKey || '', "v": version};
	    
	    //console.log(window.BMap)
	    if (window.BMap) {
	        
	    	resolve();
	   	} else {

	        angular.extend(params, {
	            'v': version || '2.0', 'callback': callbackName
	        });

	        window[callbackName] = function () {
	            resolve();
	            //Delete callback
	            setTimeout(function () {
	                try {
	                    delete window[callbackName];
	                } catch (e) {
	                }
	            }, 20);
	        };

	        //TODO 后续改进加载效果
	        var head = document.getElementsByTagName('HEAD').item(0);
	        var bdscript = document.createElement("script");
	        bdscript.type = "text/javascript";
	        bdscript.src = 'http://api.map.baidu.com/api?v=' + params.v + '&ak=' + params.ak + '&callback=' + params.callback;
	        //bdscript.src = 'http://api.map.baidu.com/api?v=1.4&callback='+ params.callback;
	        head.appendChild(bdscript);
	       
	    }
	    loadBaiduPromise = deferred.promise;
	    return loadBaiduPromise;
	};

	

	var baiduMap = angular.module('baidiMap', []);

	baiduMap.directive('baiduMap', ['$q', function($q){
		// Runs during compile
		// 
		

		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				model:'='
			}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			 templateUrl: 'templates/Bmap.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				$scope.model= $scope.model || {};


				loadBaiduMaps($q,'1.4').then(function () {

					var ele = document.getElementById('baidu_map')

					
					setTimeout(function () {
						$scope.map = new window.BMap.Map(ele);              // 创建地图实例 
						$scope.geoc = new BMap.Geocoder();                  // 创建地址解析器实例 

						//console.log($scope.model)

						if($scope.model.local_position){
							mapInit($scope.model.local_position.cityName)   //有默认地址
						}else{
							
							var myCity = new BMap.LocalCity(); 				//根据ip获取城市
							myCity.get(function (result) {
								
								var cityName = result.name;
								console.log("当前定位城市:"+cityName);
								mapInit(cityName)
							})
						}
						
						function mapInit(cityName) {						//初始化地图
							$scope.map.centerAndZoom(cityName,15) 
			
							
							setTimeout(function () {
								$scope.point = $scope.map.getCenter(); //获取中心点
								$scope.marker = new BMap.Marker($scope.point) //新建标志
								$scope.map.addOverlay($scope.marker); 		  //添加标注	
								$scope.marker.setAnimation(BMAP_ANIMATION_BOUNCE);//设置标注图标的动画效果
								console.log();

								getAdressStr($scope.point).then(function (data) {
									$scope.model.address = data.addComp;
									$scope.model.address_str = data.addStr;
									$scope.model.point = data.point;
								})

							},200)
						}		 

						

						$scope.map.addEventListener("click",function(e){

							//console.log(e.point)
							$scope.marker.setPosition(e.point);              //把标注定位到点击的位置
							$scope.model.point = e.point;                  
						

							getAdressStr(e.point).then(function (data) {
								//console.log(data)

									$scope.model.address = data.addComp;
									$scope.model.address_str = data.addStr;
									$scope.model.point = data.point;
									
									//getPoint($scope.model.address_str)
							});

						})

						//通过坐标解析地址
						function getAdressStr(point) {
							var deferred = $q.defer();

							$scope.geoc.getLocation(point,function (rs) {
								var addComp = rs.addressComponents;
								var addStr = addComp.province +
											 addComp.city +
											 addComp.district+
											 (addComp.street || '')+
											 (addComp.streetNumber || '');
								var adress={
									addComp:addComp,
									addStr:addStr,
									point:point
								}
											 
								deferred.resolve(adress)
								//console.log($scope.model)
							})

							return deferred.promise;
						}

						//通过地址解析坐标
						function getPoint(adress) {
							var center_point = $scope.map.getCenter(); //获取当前中心点坐标
							getAdressStr(center_point).then(function (data) {  //获取当前城市
								console.log(data.addComp.city)	       
							})
						}

						$scope.$apply(function () {
							$scope.model.events = {
								getPoint:function (adress) {
									getPoint(adress)
								}
							}
						})
						//$scope.map.addControl(new BMap.MapTypeControl());     // 地图类型控件，默认位于地图右上方。
						//$scope.map.addControl(new BMap.NavigationControl());  // 地图平移缩放控件，
						//$scope.map.addControl(new BMap.ScaleControl());       // 比例尺控件，默认位于地图左下方，显示地图的比例关系。
						//$scope.map.addControl(new BMap.OverviewMapControl()); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
						$scope.map.enableScrollWheelZoom();
					})
					

					/*$scope.model.point = new BMap.Point(120.071688,29.306353);   // 创建点坐标 
					console.log($scope.model.point);
					map.centerAndZoom($scope.model.point, 19);                  // 初始化地图，设置中心点坐标和地图级别  
					//======== 添加地图控件 =======											
					map.addControl(new BMap.MapTypeControl());     // 地图类型控件，默认位于地图右上方。
					map.addControl(new BMap.NavigationControl());  // 地图平移缩放控件，
					map.addControl(new BMap.ScaleControl());       // 比例尺控件，默认位于地图左下方，显示地图的比例关系。
					map.addControl(new BMap.OverviewMapControl()); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
					map.enableScrollWheelZoom();


					var marker = new BMap.Marker($scope.model.point);      // 创建标注    
					
					marker.setAnimation(BMAP_ANIMATION_BOUNCE);

					var geoc = new BMap.Geocoder(); 

					console.log($scope)
					map.addEventListener("click",function(e){

						marker.setPosition(e.point)


						geoc.getLocation(e.point, function(rs){
							var addComp = rs.addressComponents;
							console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
						});  
						console.log(e.point)
						console.log(e.point.lng + "," + e.point.lat);
						console.log(map.getCenter())
					});


					function myFun(result){
						console.log(result)
						var cityName = result.name;
						map.setCenter(cityName);
						console.log("当前定位城市:"+cityName);
					}
					var myCity = new BMap.LocalCity();
					myCity.get(myFun);*/
				})
			}
		};
	}]);
});

