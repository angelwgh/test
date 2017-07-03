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
                  },
                  //查看帖子详情
                  queryCircleTopicById:function (data) {
                  	return contacts.all('queryCircleTopicById').post(data);
                  },
                  //查询用户签名
                  queryAutographList:function (data) {
                  	return contacts.all('queryAutographList').post(data);
                  },
                  //发帖
                  addCircleTopic:function (data) {
                  	return contacts.all('addCircleTopic').post(data);
                  },
                  //删除帖子
                  deleteCircleTopicById:function (data) {
                 		return contacts.all('deleteCircleTopicById').post(data);
                  }
		}
	}]
})