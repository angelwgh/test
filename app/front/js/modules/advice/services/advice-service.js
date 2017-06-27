define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var adver = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/advertController/')
		})
		return{
			
            a:1
		}
	}]
})