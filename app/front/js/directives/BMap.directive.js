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

	//添加位置
	baiduMap.directive('mapAddPosition', ['$q', function($q){
		// Runs during compile
		// 
		

		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				model:'='
			}, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.model = $scope.model || {}
			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			 templateUrl: 'templates/Bmap.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				
					
					//console.log(iAttrs.model)
				//$scope.model= $scope.model || {};
				//console.log($scope.model || {})
				
				loadBaiduMaps($q,'1.4').then(function () {
					console.log($scope)
					var ele = document.getElementById('baidu_map')

					
					setTimeout(function () {
						$scope.map = new window.BMap.Map(ele);              // 创建地图实例 
						$scope.geoc = new BMap.Geocoder();                  // 创建地址解析器实例 

						console.log($scope.model)

						if($scope.model.local_position){
							mapInit($scope.model.local_position.cityName)   //有默认地址
						}else{
							
							var myCity = new BMap.LocalCity(); 				//根据ip获取城市
							myCity.get(function (result) {
								
								var cityName = result.name;
								//console.log("当前定位城市:"+cityName);
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
					

					
				})
			}
		};
	}])
	
	//员工定位
	.directive('mapEmployeePosition', ['$q','$timeout', function($q,$timeout){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			 scope: {
			 	cityName:'@',
			 	refreshTime:'@',
			 	model:'='
			 }, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs, $transclude) {

			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: 'templates/Bmap.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var isInit = true;

				function loadMapSuccess() {
					var ele = document.getElementById('baidu_map');

					creatMap(ele).then(initMarker)
				
				}

				//新建地图
				function creatMap(ele) {
					var deferred = $q.defer(),
						map = new window.BMap.Map(ele),  // 创建地图实例 
						geoc =  new BMap.Geocoder();     // 创建地址解析器实例

					if($scope.cityName){
						map.centerAndZoom($scope.cityName,15)
						map.enableScrollWheelZoom(true);
						deferred.resolve(map)
					}else{
						var myCity =  new BMap.LocalCity();  //根据ip获取当前城市
						myCity.get(function (result) {

							var cityName = result.name;
							console.log("当前定位城市:"+cityName);
							//mapInit(cityName)
							map.centerAndZoom(cityName,15)  //初始化
							map.enableScrollWheelZoom(true);
							deferred.resolve(map)
						})
					}
					
					

					return deferred.promise;

				}

				$scope.makers=[]
				
				//初始化标注
				function initMarker(map) {
					//console.log(map)
					isInit = true
					var watch = $scope.$watch('model', function(newValue, oldValue, scope) {
						if(angular.isArray(newValue)){
							angular.forEach(newValue, function(value, key){
								$scope.makers[key] = {};
								angular.extend($scope.makers[key], value)

								var point = new BMap.Point(value.lon, value.lat);
								var marker = $scope.makers[key].marker = new BMap.Marker(point);

								map.addOverlay(marker)

								/*var opts = {
									width : 200,     // 信息窗口宽度
									height: 100,     // 信息窗口高度
									title : "海底捞王府井店" , // 信息窗口标题
									enableMessage:true,//设置允许信息窗发送短息
									message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
								}*/
								value.headImg = value.headImg.replace('/upfile','/mfs')
									console.log(value)
								var sContent = '<div class="media">'+
												  '<div class="media-left">'+
												   '<a href="jiavascript:void(0)">'+
												      '<img class="media-object" style="width:120px;" src="'+'/mfs/headImage/4a1c43e8c3b6483aac26127826669332-small.png'+'">'+
												    '</a>'+
												  '</div>'+
												  '<div class="media-body">'+
												    '<h4 class="media-heading">'+value.gcName+'</h4>'+
												    '<p>电话: <span>'+value.tel+'</span></p>'+
												  '</div>'+
												'</div>'
								var infoWindow = new BMap.InfoWindow(sContent);//创建信息窗口对象

								marker.addEventListener('click',function () {
									this.openInfoWindow(infoWindow);//打开信息窗口
									 //图片加载完毕重绘infowindow
									
								})


							});
							//console.log(newValue)
							isInit = false;//初始化结束
							watch()
						}
					},true);


					

				}
				

				$scope.$watch('model',function (newValue,oldValue,scope) {
					if(isInit == false){
						angular.forEach(newValue, function(value, key){
							var point = new BMap.Point(value.lon, value.lat);
							//var point = new BMap.Point(null,null)
							$scope.makers[key].marker.setPosition(point)
						});
					}
					
				})

				loadBaiduMaps($q,'1.4').then(loadMapSuccess)
			}
		};
	}]);
	

});



