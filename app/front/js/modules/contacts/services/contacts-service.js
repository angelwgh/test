define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var contacts = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/CircleTopicController/')
		});

		var category= Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/advertController/')
		})
		return{
			//查询帖子列表
            queryUserCircleList:function (data) {
            	return contacts.all('queryUserCircleList').post(data);
            },

            //获取类别
            getCategorys:function () {
            	return category.one('queryCategoryInfo').get();
            }
		}
	}]
})