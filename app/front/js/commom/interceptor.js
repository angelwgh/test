/**
 * 作者: 翁鹏飞
 *            --- > 亡灵走秀
 * 日期: 2015/8/19
 * 时间: 10:47
 *
 */
 
define (['angular', 'angularCookies'], function () {
	'use strict';

	var HB_interceptor = angular.module ('HB_interceptor', ['ngCookies'])

		.config ([function () {
		$.ajaxSetup ({
			cache: false
		});
	}])

		.provider ('HBInterceptor',
		[function () {
			var that = this;
			this.app = undefined;
			this.loginPageStr = undefined;
			this.$get = [function () {
				return {
                    getAppString: function () {
                        return that.app;
                    },
					getApp: function () {
						return that.app === 'admin' ? 2 : 1;
					},
					getLoginPage: function () {
						return that.loginPageStr || '/login/login.html';
					},
					toLoginPage: function () {
						//window.location.href = this.getLoginPage ();
					}
				}
			}]
		}])
		/*.run (['hbLoginService', 'HBInterceptor', '$rootScope',
		function (hbLoginService, HBInterceptor, $rootScope) {
			HBInterceptor.getApp () === 2 ? (function () {
				HBInterceptor.storeVar = 'adminUserInfo';
			}) () : (function () {
				HBInterceptor.storeVar = 'frontUserInfo';
			}) ();
			(function (XHR) {
				var open = XHR.prototype.open;
				var send = XHR.prototype.send;

				XHR.prototype.open = function (method, url, async, user, pass) {
					if (url.indexOf ('.html') === -1) {
						var nowTime = new Date ().getTime ();
						if (url.indexOf ('?') === -1) {
							url = url + '?' + nowTime;
						} else {
							url = url + '&' + nowTime;
						}
					}
					open.call (this, method, url, async, user, pass);
				};

				XHR.prototype.send = function (data, complete) {
					var self = this,
						oldOnReadyStateChange;

					function onReadyStateChange () {
						if (self.readyState == 4) {
							if (self.status === 401) {
								hbLoginService.createLoginForm ();
							} else if (self.status === 500) {
								if (self['responseURL'].indexOf ('getUserInfo.action') !== -1) {
									HBInterceptor.toLoginPage ();
								}
							} else if (self.status === 404) {
								if (self['responseURL'].indexOf ('getUserInfo.action') !== -1) {
									HBInterceptor.toLoginPage ();
								}
							}
						}
						if (oldOnReadyStateChange) {
							oldOnReadyStateChange ();
						}
					}

					if (!this.noIntercept) {
						if (this.addEventListener) {
							this.addEventListener ("readystatechange", onReadyStateChange, false);
						} else {
							oldOnReadyStateChange = this.onreadystatechange;
							this.onreadystatechange = onReadyStateChange;
						}
					}

					send.call (this, data);
				}
			}) (XMLHttpRequest);

		}]);

	HB_interceptor.factory ('hbLoginService', ['$injector', '$rootScope', '$http', '$state', '$stateParams', '$cookieStore', 'HBInterceptor', '$q',
		function ($injector, $rootScope, $http, $state, $stateParams, $cookieStore, HBInterceptor, $q) {
			var hbLoginServiceInstance = {};
			hbLoginServiceInstance.createLoginForm = function () {
				if (!hbLoginServiceInstance.loginForm) {
					var loginHtml = '<div hb-login-form></div>',
						$compile = $injector.get ('$compile'),
						linkFunc = $compile (loginHtml) ($rootScope);
					hbLoginServiceInstance.loginForm = linkFunc;
					angular.element ('body').append (linkFunc);
				}
			};

			hbLoginServiceInstance.closeLoginForm = function () {
				if (this.loginForm) {
					this.loginForm.remove ();
					this.loginForm = undefined;
				}
			};

			function rememberThePass ($theScopeModel) {
				// 当选中记住密码的时候，登录完成执行记住密码操作， 将密码账号保存到本地cookie当中
				if ($theScopeModel['rememberPass']) {
					$cookieStore.put (HBInterceptor.storeVar, {
						userName: $theScopeModel.userName,
						password: $theScopeModel.userName
					});
				} else {
					$cookieStore.remove (HBInterceptor.storeVar);
				}
			}

			function encodeReturnCode (data, $theScopeModel) {
				var defer = $q.defer (),
					promise = defer.promise;
				var loginResult = {
						style: {
							marginLeft: '30px',
							fontSize: '13px',
							fontWeight: 'bold'
						},
						message: '没有定义的错误'
					},
					code = data.code;
				switch (code) {
					case 600:
						loginResult.style.color = 'yellow';
						loginResult.message = '等待登录!';
						defer.resolve (loginResult);
						break;
					case 603:
						$http ({
							url: data.location,
							method: 'get',
							headers: {
								"X-Requested-With": "X-Request-With"
							}
						}).success (function (retu) {
							var result = retu.state || retu.status;
							if (result) {
								HBInterceptor.userInfo = $theScopeModel;
								loginResult.style.color = 'green';
								loginResult.message = '登录成功!';
								hbLoginServiceInstance.closeLoginForm ();
								rememberThePass ($theScopeModel);
								$state.reload ();
								defer.resolve (loginResult);
							}
						});
						break;
					case 604:
						loginResult.style.color = 'blue';
						loginResult.message = '登录成功，账户未绑定!';
						defer.resolve (loginResult);
						break;
					case 610:
						loginResult.style.color = 'red';
						loginResult.message = '用户名密码不匹配';
						defer.resolve (loginResult);
						break;
					case 611:
						loginResult.style.color = 'gray';
						loginResult.message = '帐户被锁定';
						defer.resolve (loginResult);
						break;
				}
				return promise;
			}


			hbLoginServiceInstance.getLoginScript = function ($scope) {
				return $http ({
					url: '/FxbManager/userController/userInfo',
					method: 'get'
				})
					.success (function (data) {

						$scope.$apply (function () {
							encodeReturnCode (data, $scope.model)
								.then (function (data) {
								$scope.model.loginResult = data;
							})
						})
				});
			};

			return hbLoginServiceInstance;
		}]);

	HB_interceptor.directive ('hbLoginForm', LoginDirective);
	LoginDirective.$inject = ['hbLoginService', '$cookieStore'];
	function LoginDirective (hbLoginService, $cookieStore) {
		var linkFunc = {};
		linkFunc.scope = {};
		linkFunc.link = function ($scope, $element, $attr, $controller) {
			$scope.handler = $controller.handler;
			hbLoginService.getLoginScript ($scope);
		};

		linkFunc.controller = ['hbLoginService', 'HBInterceptor', '$scope', '$window',
			function (hbLoginService, HBInterceptor, $scope, $window) {
				$scope.model = {};
				var userInfo = $cookieStore.get (HBInterceptor.storeVar) || {userName: '', password: ''};
				$scope.model.userName = userInfo.userName;
				$scope.model.password = userInfo.password;
				if (
					$scope.model.userName !== ''
					&& $scope.model.password !== ''
					&& angular.isDefined ($scope.model.userName)
					&& angular.isDefined ($scope.model.password)
				) {
					$scope.model.rememberPass = true;
				} else {
					$scope.model.rememberPass = false;
				}
				this.handler = {
					closeLoginForm: function ($e) {
						hbLoginService.closeLoginForm ();
						$e.preventDefault ();
					},

					login: function ($e) {
						if ($scope.theLoginForm.$invalid) return false;
						var loginHandle = ssoLogin || {};
						if (loginHandle) {
							var loginParams = {
								accountType: HBInterceptor.getApp (),
								username: $scope.model.userName,
								password: $scope.model.password
							};
							loginHandle.login ({
								accountType: HBInterceptor.getApp (),
								username: $scope.model.userName,
								password: $scope.model.password
							}, "{'portalType':'mall'}");
						}
					},
					forgotPass: function ($e) {
						$window.location.href = '/login/forgetPassword.html';
						if ($e) {
							$e.preventDefault ();
						}
					},
					enterKeyDo: function ($e) {
						if ($e.keyCode === 13) {
							this.login ($e);
						}
					}
				}
			}];
		linkFunc.templateUrl = 'templates/common/login.html';
		linkFunc.restrict = 'AE';
		return linkFunc;
	}*/

});
