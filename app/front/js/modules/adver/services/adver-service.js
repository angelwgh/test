define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var adver = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/advertController/')
		})
		return{
			//查询广告列表
			queryBeforeAdvertList:function (data) {
				return adver.all('queryBeforeAdvertList').post(data);
			},

			//获取广告类别列表
			getCategorys:function () {
                return adver.one('queryCategoryInfo').get();
            },

            //上传广告
            uploadAdver:function (data) {
            	return adver.all('addBeforeAdvert').post(data);
            },

            //修改广告
            modifyAdver:function (data) {
            	return adver.all("updateBeforeAdvert").post(data);
            },
            //删除广告
            delete: function (aid) {
                return adver.one("delete").get({id: aid});
            }
            
		}
	}]
})