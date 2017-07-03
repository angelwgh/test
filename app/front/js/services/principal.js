/**
 * 设置站点的一些基本服务
 * 菜单列表
 * 用户权限
 * 用户注销
 * 监听路由变化
 * 模态框服务
 * @作者     翁光辉
 *             --->angelwgh
 * @日期     2017-06-09
 * @return {[type]}   [description]
 */
define(function () {
	'use strict';

	var authorizationSystem = angular.module ('AuthorizationSystem', ['ui.bootstrap']);

	authorizationSystem.filter('trusted', ['$sce', function ($sce) {
	    return function(url) {
	        return $sce.trustAsResourceUrl(url);
	    };
	}]);

	authorizationSystem.factory('BasicData',['authorize',function (authorize) {
		return{
			user_info:null,
			img_basic_url:'/mfs',
			menu_list:[
				{
					id:'01',
					name:'广告管理',
					icon:"fa-edit",
					state:'states.adver',
					subs:[
						{
							name:'在用广告',
							state:'states.adver.list'
						},
						{
							name:'以往广告',
							state:'states.adver.finish'
						},
						{
							name:'发布广告',
							state:'states.adver.release'
						}
					]
				},
				{
					id:'02',
					name:'我的人脉圈',
					icon:'fa-cloud',
					state:'states.contacts',
				},
				{
					id:'03',
					name:'我的员工',
					icon:'fa-users',
					state:'states.employees'
				},
				{
					id:'04',
					name:'个人中心',
					icon:'fa-user',
					state:'states.userInfo',
					subs:[
						{
							name:'个人基础信息',
							state:'states.userInfo.basicInfo'
						},
						{
							name:'修改头像',
							state:'states.userInfo.headImgModify'
						},
						{
							name:'修改密码',
							state:'states.userInfo.pswModify'
						}
					]

				},
				{
					id:'05',
					name:'意见反馈',
					icon:'fa-comment-o',
					state:'states.advice',
					subs:[]
				}
			],
			//用户权限
			permissions:{
				adver:{
					list:true,
					finish:true,
					release:true,
					delete:true,
					modify:true
				},
				userInfo:{
					get:true,
					modify:true,
					modify_headimg:true,
					modify_password:true,
				},
				advice:{

				},
				contacts:{
					
				}
			},
			loginOut:function () {
				return authorize.loginOut()
			}
		}
	}])
	//注销
	authorizationSystem.factory ('authorize', ['$window', '$http', '$rootScope',
		function function_name($window,$http,$rootScope) {
			return{
				loginOut:function () {
					return $http.get('/FxbManager/userController/doLogout')
				}
			}
		}])

	authorizationSystem.run(['$http','$rootScope','BasicData',function ($http,$rootScope,BasicData) {
		$http.get('/FxbManager/userController/queryUser')
			 .then(function (data) {
			 	//获取基本的用户信息
			 	BasicData.user_info = data.data.jsonBody;

			 })
		// 监听路由变化
		$rootScope.$on('$stateChangeStart',function (e,toState) {
			$rootScope.activeState = toState //保存当前路由状态

			$http.get ('/FxbManager/userController/userInfo')
		 	  .then(function (data) {
		 	  	if(data.data.state=='-1'||data.data.jsonBody == null){
		 	  		alert(data.data.msg);
		 	  		window.location = '/login'
		 	  	}
		 	})
		})
	}])

	//上传文件服务

	authorizationSystem.factory('upLoadfile', ['$http', function($http){
		return function (url,data){
			//上传图片的服务
			return $http.post(url,data,{
				transformRequest: angular.identity,
    			headers: {'Content-Type': undefined}
			})
			

		};
	}])

	//模态框服务
	authorizationSystem.factory('modalfix', ['$modal', function($modal){

			function Modalfix() {
				this.options={
					size:'sm', //模态框大小
					msg:null,	//简单模态框显示的信息
					confirmFn:null,//点确认时调用的函数
					templateUrl:'templates/modal/modal.html', //模态框html模版
					controller:'modalfix.confirm',
					backdrop:true,//打开模态框时的背景设置
				}				
			}

			Modalfix.prototype.init = function(options) {
				var that = this;
				//console.log(that)
				angular.forEach(options,function(item,key,options){
					that.options[key] = item
					//console.log(item)
					//console.log(options)
				})

				return this;
			};
			Modalfix.prototype.open = function() {
				var that = this;

				that.options.resolve = {
					options:function () {
						return that.options;
					}
				}

				var modalInstance = $modal.open(that.options)


				 modalInstance.result.then(function (fn) {
				 	if(typeof fn == 'function'){
			     		fn();
			     	}
				 },function () {
				 	// body...
				 })

			};
			

		return {
			//是否确认
			confirm:function (data) {
				var options={
					msg:data.msg,
					confirmFn:data.confirmFn
				}
				var modalfix = new Modalfix();
				modalfix.init(options).open();
			},
			ok:function (data) {
				var options={
					msg:data.msg
				}
				var modalfix = new Modalfix();
				modalfix.init(options).open();
			},
			richTextEdit:function (data) {
				//console.log(1)
				var data = data||{};
				//console.log(data)
				var options={
					//title:data.title || '发表文章',
					model:data.model || {},
					size:'lg',
					backdrop:'static',
					confirmFn:null,
					controller:'modalfix.editor',
					templateUrl:'templates/modal/modal-rich-text-edit.html'
				}
				//console.log(options)
				angular.extend(options, data);
				var modalfix = new Modalfix();
				modalfix.init(options).open();
			},

			//添加纯文本内容
			addText:function (data) {
				var options={
					size:'lg',
					confirmFn:null,
					controller:'modalfix.addText',
					templateUrl:'templates/modal/add-text.html'
				}
				angular.extend(options, data);
				var modalfix = new Modalfix();
				modalfix.init(options).open();


			},

			//添加链接
			addUrl:function (data) {
				var options={
					size:'lg',
					confirmFn:null,
					controller:'modalfix.addUrl',
					templateUrl:'templates/modal/add-url.html'
				}
				angular.extend(options, data);
				var modalfix = new Modalfix();
				modalfix.init(options).open();
			},

			addPosition:function (data) {
				var options={
					size:'lg',
					confirmFn:null,
					controller:'modalfix.addPosition',
					templateUrl:'templates/modal/add-position.html'
				}
				angular.extend(options, data)
				//console.log(options)
				var modalfix = new Modalfix();
				modalfix.init(options).open();
			}

		}
	}])


	//简单的模态框控制器
	authorizationSystem.controller('modalfix.confirm', ['$scope','options','$modalInstance', 
		function($scope,options,$modalInstance){
			//console.log(options)
      		$scope.msg = options.msg
	      	$scope.ok=function () {			      		
				//console.log(options)
				$modalInstance.close(options.confirmFn)
			}
			$scope.cancel=function () {
				$modalInstance.dismiss('cancel')
			}
	}])
			
	//发帖编辑器控制器
	authorizationSystem.controller('modalfix.editor',
		['$scope','options','$modalInstance', 'modalfix','$q','$timeout','upLoadfile','BasicData',
		function($scope,options,$modalInstance,modalfix,$q,$timeout,upLoadfile,BasicData){
			
			$scope.model = options.model;

			console.log($scope.model);


			$scope.text={
				title:null,
				category:null,
				count:0,
				content:[]
			}
			$scope.state_control={
				category_show:false
			};

			//console.log(modal_add_img)
			$scope.events={
				showCategory:function (e) {
					e.stopPropagation();
					$scope.state_control.category_show = true;
				},
				hideCategory:function (e) {
					e.stopPropagation();
					$scope.state_control.category_show = false;
				},
				//选择类别
				selectCategory:function (e,item) {
					e.stopPropagation();
					$scope.events.hideCategory(e);
					$scope.text.category = item.name;
					$scope.text.categoryid = item.id;
					console.log(item)
				},
				//确认
				ok:function () {
					if(!$scope.text.title){
						modalfix.ok({
							msg:'请输入标题'
						});
						return;
					}
					if(!$scope.text.category){
						modalfix.ok({
							msg:'请选择分类'
						});
						return;
					}

					if($scope.text.count <=0){
						modalfix.ok({
							msg:'请输入内容'
						});
						return;
					}
					$modalInstance.close(options.confirmFn($scope.text))
				},
				//取消
				cancel:function () {
					$modalInstance.dismiss()
				},
				//添加内容
				addContect:function (type) {
					var file_form  = angular.element('.file-upload');
					switch(type){
						case 'txt':
							$scope.events.addText().then(function (data) {
								var obj ={
									index:$scope.text.count++,
									obj:data,
									type:'txt'
								}
								Array.prototype.push.call($scope.text.content,obj);

								console.log($scope.text)
							});
							break;
						case 'img':
							$scope.events.addImg().then(function (data) {
								file_form[0].reset();
								if(!data){
									return
								}
								var obj={
									index:$scope.text.count++,
									obj:[],
									type:'img'
								}
								if(!data){return}
								//console.log(data)
								angular.forEach(data.data.jsonBody,function (item,key) {
									console.log(item)
									Array.prototype.push.call(obj.obj,BasicData.img_basic_url+item.saveFile);
								})
								console.log(obj)
								Array.prototype.push.call($scope.text.content,obj);
							});
							break;
						case 'url':
							//console.log(1);
							$scope.events.addUrl().then(function (data) {
								var obj={
									index:$scope.text.count++,
									title:data.title,
									url:data.url,
									type:'url'
								}
								Array.prototype.push.call($scope.text.content,obj)
							});
							break;
						case 'video':
							//$scope.events.addVideo();
							$scope.events.addVideo().then(function (data) {
								file_form[0].reset();
								if(!data) return;
								var obj={
									index:$scope.text.count++,
									img:'',
									obj:BasicData.img_basic_url+data.data.jsonBody[0].saveFile,
									type:'video'
								}

								$scope.events.captureImage(obj.obj).then(function (data) {
									//console.log(data)
									obj.img = BasicData.img_basic_url+data;
									Array.prototype.push.call($scope.text.content,obj);

									//console.log($scope.text.content)
								})

								//
								
							})
							
							break;
						case 'lbs':
							$scope.events.addPosition().then(function (data) {
								data.index = $scope.text.count++;
								Array.prototype.push.call($scope.text.content,data);
							})
							break;
						default:
							break;
					}
				},
				
				//添加文本
				addText:function () {
					var deferred = $q.defer();

					modalfix.addText({
						size:'lg',
						confirmFn:function (data) {
							if(typeof data == 'string'){
								var text = data;						
								deferred.resolve(text)

							}							
						}
					})
					return deferred.promise;
				},

				//添加图片
				addImg:function () {
					var id='#modal_add_image';

					return $scope.events.upLoadfile(id);
				},
				//添加链接
				addUrl:function () {
					var deferred = $q.defer();

					modalfix.addUrl({
						size:'lg',
						confirmFn:function (data) {
							deferred.resolve(data)
						}
					})
					return deferred.promise;
				},
				//添加视频
				addVideo:function () {
					var id='#modal_add_video';
					return $scope.events.upLoadfile(id)
					
				},
				//添加定位
				addPosition:function () {
					var deferred = $q.defer();
					//console.log(document.getElementsByTagName('div')[0])
					modalfix.addPosition({
						size:'lg',
						modal:$scope.model,
						//appendTo:document.getElementsByTagName('div')[0],
						confirmFn:function (data) {
							deferred.resolve(data)
						}
					})
					return deferred.promise;
				},
				//选择文件 //判断文件类型
				selectFile:function (id) {
					var file_input = angular.element(id);
					var file_form  = angular.element('.file-upload');

					var deferred = $q.defer();
					$timeout(function () {		
						file_input.click();
					})
					file_input.off('change');
					file_input.on('change', fileInputChange);

					function fileInputChange() {
						//event.preventDefault();
						var files = this.files;
						var check_type = true;
						console.log(files[0])
						console.log(new Date())
						for(var i = 0; i < files.length; i++){
							if(files[i].type.indexOf(id.substring(11)+'/')!=0){
								//console.log(files[i])
								this.value='';
								deferred.resolve()
								modalfix.ok({
									msg:'请选择正确的文件类型'
								})
								file_form[0].reset();
								return;
							}
						}
						deferred.resolve(files);
						
					}
					
					return deferred.promise;
				},
				//上传文件,返回结果
				upLoadfile:function (id) {
					
				    return 	$scope.events.selectFile(id).then(function (data) {
				    	var deferred = $q.defer();
				    	//console.log(data)
						if(!data || data.length==0){
							deferred.resolve()
							return deferred.promise;
						}
						var formData = new FormData()

						for(var i = 0; i < data.length; i++ ){
							if(data[i].type.indexOf(id.substring(11)+'/')==0){
								formData.append(id.substring(11)+i,data[i])
							}else{
								console.log(data[i].type)
								
								return
							}
							
						}

			 			var server = '/FxbManager/uploadController/uploadFile?uploadSync=true'
			 			return upLoadfile(server,formData)
			 			
					})
				},
				//获取视频当前帧图片,上传,然后获取地址
				captureImage:function (src) {
					var deferred = $q.defer();

					var video = document.createElement('video');
					video.src=src;
					
					video.onloadeddata=function () {
						var canvas = document.createElement("canvas");
						canvas.width=video.videoWidth;
						canvas.height=video.videoHeight;
						//console.log(video.currentTime)
						canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
						
						var data=canvas.toDataURL();

						// dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
						data = data.split(',')[1];
						data = window.atob(data);
						var ia = new Uint8Array(data.length);
						for (var i = 0; i < data.length; i++) {
						    ia[i] = data.charCodeAt(i);
						};

						// canvas.toDataURL 返回的默认格式就是 image/png
						var blob = new Blob([ia], {type:"image/png"});
						var file = new File([blob],'capture.jpg',{type:'image/jpg'})
						
						console.log(file)

						var formData = new FormData()
						formData.append('capture',file);
						/*img.src=canvas.toDataURL("image/png");
						img.onload=function () {
							
						}	*/
						var server = '/FxbManager/uploadController/uploadFile?uploadSync=true'
			 			upLoadfile(server,formData).then(function (data) {
			 				console.log(data)
			 				deferred.resolve(data.data.jsonBody[0].saveFile)
			 			})
					}

					return deferred.promise;
				},

				/**
				 * 编辑帖子内容
				 */
				moveUp:function (e,item) {
					e.stopPropagation();
					var temp = $scope.text.content[item.index-1]

					$scope.text.content[item.index-1] = item;
					$scope.text.content[item.index] =temp;

					angular.forEach($scope.text.content, function(value, key){
						value.index = key;
					});
				},
				moveDown:function (e,item) {
					e.stopPropagation();
					var temp = $scope.text.content[item.index+1]

					$scope.text.content[item.index+1] = item;
					$scope.text.content[item.index] =temp;

					angular.forEach($scope.text.content, function(value, key){
						value.index = key;
					});
				},
				remove:function (e,index) {
					e.stopPropagation();
					modalfix.confirm({
						msg:'确定要删除吗?',
						confirmFn:function () {
							$scope.text.content.splice(index,1);
							angular.forEach($scope.text.content, function(value, key){
								value.index = key;
							});
							$scope.text.count = $scope.text.content.length;
						}
					})
					
				},
				modify:function (e,item) {
					e.stopPropagation();
					console.log(item)
					switch(item.type){
						case 'txt':
							modifyTxt(item);
							break;
						case 'url':
							modifyUrl(item);
							break;
						default:
							break;
					};

					function modifyTxt(item) {
						modalfix.addText({
							model:item,
							confirmFn:function (data) {
								//console.log(data)
								item.obj = data;
							}
						})
					}

					function modifyUrl(item) {
						modalfix.addUrl({
							model:item,
							confirmFn:function (data) {
								//console.log(data)
								console.log(data)
								item.title = data.title;
								item.url = data.url;
							}
						})
					}
				}

			}



	}]);

	/**
	 * 模态框控制器
	 */
	authorizationSystem.controller('modalfix.addText',['$scope','options','$modalInstance',
		function($scope,options,$modalInstance){
			//console.log(options)
			$scope.text=options.model ? options.model.obj : null;
			$scope.ok=function () {

				$modalInstance.close(options.confirmFn($scope.text))
			}
			$scope.cancel=function () {
				$modalInstance.dismiss()
			}
	}]);

	authorizationSystem.controller('modalfix.addUrl',['$scope','options','$modalInstance','modalfix',
		function($scope,options,$modalInstance,modalfix){
			console.log(options)
			$scope.url = {
				title:options.model ? options.model.title : null,
				url:options.model ? options.model.url : null
			}
			$scope.events={
				ok:function function_name() {
					//console.log($scope.url);
					if(!$scope.url.title){
						modalfix.ok({msg:'请填写链接名称'});
					}else if(!$scope.url.url){
						modalfix.ok({msg:'请填写链接地址'});
					}else{
						$modalInstance.close(options.confirmFn($scope.url))
					}
					
				},
				cancel:function function_name() {
					$modalInstance.dismiss();
				},

			}

	}]);

	authorizationSystem.controller('modalfix.addPosition',['$scope','options','$modalInstance',
		function($scope,options,$modalInstance){
			//console.log(options.modal.position)
			///console.log($scope.model)
			$scope.model={
				local_position:options.modal.position
			}
			var timer=null
			$scope.events={
				adressChange:function () {
					//e.stopPropagation();
					clearTimeout(timer)
					timer = setTimeout(function () {
						//console.log($scope.model)
						$scope.model.events.getPoint($scope.model.address_str)
					},1000)
				}
			}

			//angular.extend($scope.model, options.modal.position)
			$scope.ok=function () {
				var data={
					"lat": $scope.model.point.lat,
			        "lon": $scope.model.point.lng,
			        "obj": $scope.model.address_str,
			        "type": "lbs"
				}
				console.log($scope.model)
				console.log(data)
				$modalInstance.close(options.confirmFn(data))
			}
			$scope.cancel=function () {
				$modalInstance.dismiss()
			}
	}]);

	


})