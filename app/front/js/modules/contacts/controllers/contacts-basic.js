define(function () {
	'use strict';

	return ['$scope','contactsServices','BasicData','$state','modalfix','$window','$q','$http',
		function ($scope,contactsServices,BasicData,$state,modalfix,$window,$q,$http) {
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
		
		$scope.pages={
			totalItems:1000, //总数据条数
			currentPage:1, //当前页数
			maxSize:10,  //可选择的页数范围
			pageSize:10, //每页的条数 //每页的条数 

			pageChanged:function () {
				//console.log($scope.pages.currentPage)
				$scope.events.queryUserCircleList();
			}
		}
		//console.log(angular.toJson($scope.data))
		$scope.select_category={}
		
		$scope.events={
			//查询帖子列表
			queryUserCircleList:function (e) {
				if(e){
					e.stopPropagation();
				}
				var data ={
					"msgHead":"",
		            "msgBody":"",
		            "jsonHead":{                   
		            	"accessToken":accessToken
		                    }
		                ,
		            "jsonBody":{
						"type": 2,   //类别主键: 好友圈 1 ; 人脉圈 2
						"cgid": $scope.select_category.id,//人脉圈下类别  
						"page": $scope.pages.currentPage,   //页码
						"limit": $scope.pages.pageSize  //每页多少条数据

					    } 
				}
				contactsServices.queryUserCircleList(data).then(function (data) {
					//console.log(data)
					$scope.data.article_list= data.jsonBody;
					$scope.current_category=$scope.select_category;
					$scope.pages.totalItems = parseInt(data.msg);

				})
			},
			//查看帖子详情
			toViewArticleDetails:function (e,id) {
					//console.log(id);
					if(e){
						e.stopPropagation();
					}
					var data = {
						"msgHead":"",
				        "msgBody":"",
				        "jsonHead":{                   
				            "accessToken":accessToken
				        },
				        "jsonBody":{
				            "id": id,   // 帖子id
							"type": $scope.current_category.id,   //帖子类型
						} 

					}
					contactsServices.queryCircleTopicById(data).then(function (data) {
						//console.log(data)
						var options={
							title:'帖子内容',
							category:$scope.current_category,
							confirmFn:null,
							model:data.jsonBody,
							controller:'app.contacts.articlView',
							templateUrl:'views/contacts/contacts-articl-view.html'
						}
						options.model.content = angular.fromJson(data.jsonBody.content);
						//console.log(angular.fromJson(data.jsonBody.content))
						options.model.category=$scope.current_category;
						modalfix.richTextEdit(options)
					})
			},
			//发表帖子
			postArticle:function () {
				
				modalfix.richTextEdit({
					model:$scope.data,
					confirmFn:function (data) {
						post(data)
					}
				})

				function post(data) {
					//console.log(data)
					//
					var firstpic = null;
					angular.forEach(data.content, function(value, key){
						if(value.type == 'txt'){
							value.obj = value.obj.replace(/\n/g,'<br/>')
						}
						//console.log(value.type)
						if(firstpic == null){
							if(value.type == 'img'){
								firstpic = value.obj[0];
							}else if(value.type == 'video'){
								firstpic = value.img;
							}
						}
						
					});
					//console.log(data)
					var options={
			            "msgHead":"",
			            "msgBody":"",
			            "jsonHead":{                   
			            	"accessToken":accessToken
			            },
			            "jsonBody":{
			                "aid": 3,   //区域主键 暂定"义乌:3"
							"cgid": data.categoryid,   //类别主键
							"title": data.title,   //帖子标题
							"content": angular.toJson(data.content),   //帖子内容
							"firstpic": firstpic || '',   ///第一张图片
							"type": 2,   //类型
							"autographId": 1,   //签名主键
						} 
					}

					//console.log(options)
					$scope.events.queryAutographList().then(function (data) {
						
						options.jsonBody.autographId = data[0].id;
						//console.log(options)
						contactsServices.addCircleTopic(options).then(function (data) {
							modalfix.ok({
								msg:data.msg
							})
							$scope.events.queryUserCircleList()
						})
					})
				};
			},
			//删除帖子
			deleteArticle:function (e,id) {
				if(e){
					e.stopPropagation();
				}
				
				var options = {
						"msgHead":"",
           				"msgBody":"",
             			"jsonHead":{                   
              				"accessToken":accessToken
                    	},
                		"jsonBody":{
                    		"id": id,   // 帖子id
      					} 

				}

				modalfix.confirm({
					msg:'确定要删除吗',
					confirmFn:function () {
						contactsServices.deleteCircleTopicById(options).then(function (data) {
							//console.log(data)
							modalfix.ok({
										msg:data.msg
									})
							$scope.events.queryUserCircleList()
						})
					}
				})
				
			},
			//获取签名
			queryAutographList:function () {
				var deferred = $q.defer()
				var a = {
					"msgHead":"",
		            "msgBody":"",
		            "jsonHead":{                   
		              	"accessToken":accessToken
		            }

				}
				contactsServices.queryAutographList(a).then(function (data) {
					//console.log(data)
					deferred.resolve(data.jsonBody)

				})

				return deferred.promise
			},
			//获取类别列表
			getCategorys:function () {
				var deferred = $q.defer();

				contactsServices.getCategorys().then(function (data) {
					//console.log(data)
					$scope.data.category = data.jsonBody[1]
					$scope.current_category=$scope.select_category = $scope.data.category.sub[0]
					
					//console.log($scope.data)
					deferred.resolve()
				})

				return deferred.promise;
			},
			//选择类别
			selectCategorys:function (item) {
				//console.log(item)
				$scope.select_category=item;
			}
		}
		$scope.events.getCategorys().then(function () {
			$scope.events.queryUserCircleList();
		})
		
		
	}]
})