/**
 * app主模块,设置一些基本参数
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-08
 * @param  {[type]}   ) {	}         [description]
 * @return {[type]}     [description]
 */
define([
		'const/futureStates',
		'const/modules',
		'commom/interceptor',
		'oclazyload',
		'uiRouterExtras',
		'states/home-states',
		'home',
		'services/principal'
	],function (futureStates,modules) {
	
	var app = angular.module('app', [
			'HB_interceptor',
			'oc.lazyLoad',
			'AuthorizationSystem',
			'ct.ui.router.extras',
			'ui.router',
			'app.home',
			'app.states.home'
		])

	app.config(function ($interpolateProvider,
					      $httpProvider,
					      $futureStateProvider,
					      $ocLazyLoadProvider,//懒加载
					     /**restAngular配置项目的一个服务*/
					     RestangularProvider,
					     HBInterceptorProvider
					     ) {
				
				// 以'b{{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
				$interpolateProvider.startSymbol ('b{{');
				//在HBInterceptor后添加Provider可以生成一个新的提供者,
				//HBInterceptorProvider可以被注入到到config()函数中
				HBInterceptorProvider.app = 'front';

				/**
				 * 配置Restangular,设置请求拦截
				 * @param  element     发送到服务器的element		
				 * @param  operation   http请求的方式,'get' 'post'
				 * @param  route       请求的路由
				 * @param  url         请求的路径
				 * @param  headers     发送的请求头
				 * @param  params      发送请求的参数
				 * @param  httpConfig  调用的httpConfig
				 * @return 如果没有返回属性，则使用发送的属性。
				 */
				RestangularProvider.addFullRequestInterceptor (function
					(element, operation, route, url, headers, params, httpConfig) {
						//console.log(arguments)
					if (operation === 'post') {
						if (headers['Content-Type'] && angular.isObject (element)) {
							if (headers['Content-Type'].indexOf ('application/x-www-form-urlencoded') !== -1) {
								element = $.param (element);
							}
						}
					}
					return {
						element: element,
						params: params,
						headers: headers,
						httpConfig: httpConfig
					};
				});
				//设置缓存请求,false为不缓存
				RestangularProvider.setDefaultHttpFields ({cache: false});

				//angular 懒加载设置 
				//=========================================================
				$ocLazyLoadProvider.config ({
					//debug: true, //当出现错误时将会被拒绝，如果设置调试为true，$ocLazyLoad将会将所有错误记录到控制台。
					jsLoader: requirejs, //使用requirejs去加载文件
					//events: true,//当加载模块、组件或文件(js/css/模板)时，$ocLazyLoad可以广播事件。默认情况下，它是禁用的，
					loadedModules: ['states'],//主模块名
					modules: modules.modules //
				});

				//$futureStateProvider来自uiRouterExtras中的futureState
				//
				
				var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
					var deferred = $q.defer ();
					$ocLazyLoad.load (futureState.module).then (function (name) {
						deferred.resolve ();
					}, function () {
						deferred.reject ();
					});
					return deferred.promise;
				}];
				
				$futureStateProvider.stateFactory ('ocLazyLoad', ocLazyLoadStateFactory);

				$futureStateProvider.addResolve (['$q', '$injector', '$http', function ($q, $injector, $http) {
					var deferd = $q.defer (),
						promise = deferd.promise;
					angular.forEach (futureStates.futureStates, function (futureState) {
						$futureStateProvider.futureState (futureState);
					});
					deferd.resolve (futureStates.futureStates);
					return promise;
				}]);
				//=================================================================
				
	})
})