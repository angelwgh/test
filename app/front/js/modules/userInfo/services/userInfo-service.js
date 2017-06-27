define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var user = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/userController')
		})
		return{
			//获取基本信息
            getUserInfo:function() {
                return user.one('queryUser').get();
            },
            //修改基本信息
            updateUserInfo:function (data) {
            	return user.one('updateUserInfo').get(data)
            },
            //修改头像
            modifyHeadImg:function (data) {
            	return user.one('updateUserHeadImg').get(data)
            },
            //修改密码
            updatePassWord:function (data) {
                return user.one('updatePassWord').get(data)
            },
		}
	}]
})