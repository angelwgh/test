define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var user = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/userController')
		})
		return{
			
            getUserInfo:function() {
                return user.one('queryUser').get();
            }
		}
	}]
})