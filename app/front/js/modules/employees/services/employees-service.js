define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var contacts = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/shopController/')
		});
		return{
			queryEmployees:function (data) {
				return contacts.all('queryEmployees').post(data)
			}
		}
	}]
})