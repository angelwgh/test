define(function () {
	'use strict';

	return ['$scope','contactsServices','BasicData','$state','modalfix','$window',
		function ($scope,contactsServices,BasicData,$state,modalfix,$window) {
		var accessToken = $window.localStorage['accessToken'];

		//发表文章的一些参数
		$scope.data={
			title:'发表帖子',//模块标题
			category:null,//帖子类别
			position:{
				cityName:'义乌' //当前位置
			},
			confirmFn:null,
			sideMenuList:[
				{
					ico:'fa fa-pencil-square-o',
					text:'添加文本',
					type:'txt'
				},
				{
					ico:'fa fa-photo',
					text:'添加图片',
					type: 'img'
				},
				{
					ico:'fa fa-link',
					text:'添加链接',
					type:'url'
				},
				{
					ico:'fa fa-file-video-o',
					text:'添加视频',
					type:'video'
				},
				{
					ico:'fa fa-map-marker',
					text:'添加位置',
					type:'lbs'
				}

			]
		}

		$scope.current_category={}

		
		$scope.events={
			//查询帖子列表
			queryUserCircleList:function () {
				
				var data ={
					"msgHead":"",
		            "msgBody":"",
		            "jsonHead":{                   
		            	"accessToken":accessToken
		                    }
		                ,
		            "jsonBody":{
						"type": 2,   //类别主键: 好友圈 1 ; 人脉圈 2
						"cgid": 4,//人脉圈下类别  
						"page": 1,   //页码
						"limit": 10   //每页多少条数据

					    } 
				}
				contactsServices.queryUserCircleList(data).then(function (data) {
					console.log(data)
				})
			},
			//发表帖子
			postArticle:function () {
				
				modalfix.richTextEdit({
					model:$scope.data,
					confirmFn:function (data) {
						console.log(data)
					}
				})
			},

			getCategorys:function () {
				contactsServices.getCategorys().then(function (data) {
					console.log(data)
					$scope.data.category = data.jsonBody[1]
					$scope.current_category = $scope.data.category.sub[0]
					console.log($scope.current_category)
				})
			},

			selectCategorys:function (item) {
				console.log(item)
				$scope.current_category=item;
			}
		}

		$scope.events.queryUserCircleList()
		$scope.events.getCategorys()
	}]
})