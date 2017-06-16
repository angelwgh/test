define([
		'const/futureStates',
		'const/modules',
		'directives/list-tree-directive',
		'directives/commom-directives',
		'directives/upload-img-directives',
		'commom/interceptor',
		'oclazyload',
		'uiRouterExtras',
		'states/home-states',
		'home',
		'services/principal'
	],function (futureStates,modules) {
	var app = angular.module('app',[
			'HB_interceptor',
			'oc.lazyLoad',
			'listTree',
			'common',
			'uploadImg',
			//'AuthorizationSystem',
			'ct.ui.router.extras',
			'ui.router',
			'app.home',
			'app.states.home'
		])
})