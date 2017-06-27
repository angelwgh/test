//$.cropper图片剪裁插件
define(['angular','cropper'],function (angular) {


	var upload = angular.module('uploadImg', [])

	upload.factory('upLoadImg', ['$http', function($http){
		return function (url,data){
			//上传图片的服务
			return $http.post(url,data,{
				transformRequest: angular.identity,
    			headers: {'Content-Type': undefined}
			})
			

		};
	}])
	upload.directive('uploadSingleImg', ['$http','upLoadImg','$timeout',
		function($http,upLoadImg,$timeout){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			 scope: {
			 	model:'='
			 }, // {} = isolate, true = child, false/undefined = no change
			 controller: function($scope, $element, $attrs, $transclude) {
			 	$scope.events={
			 		selectImg:function () {
			 			$scope.fns.selectImg()
			 		},
			 		uploadimg:function (e) {
			 			e.preventDefault();
						$scope.fns.getResult()
			 		}
			 	}
			 },
			//require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
			//template: '<div>图片上传</div>',
			templateUrl: 'templates/upload-img.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var file_input = angular.element('input[type="file"]');
				//console.log(file_input)
				$scope.msgs={
					type_err:false,
					size_err:false
				};

				$scope.options={
					size:null,
					type:null,

				}
				angular.forEach($scope.model.options, function(value, key){
					$scope.options[key]=value
				});
				//console.log($scope.options)
				
				setMsg($scope.options);

				$scope.$watch('model', function(newValue, oldValue, scope) {
					if(newValue != oldValue ){
						//console.log(newValue)
						//console.log(newValue)
						setMsg($scope.options);
					}
				}, true);

				
				//监听文件选择事件
				file_input.on('change',function () {
					if(file_input[0].files.length ==0){
						return;
					}
					$scope.$apply(function () {
						//获取file对象
						$scope.model.files = file_input[0].files

						if($scope.msgs.type_err){
							return
						}

						for(var i = 0; i < $scope.model.files.length; i++){
							var file = $scope.model.files[i]
							//console.log(file)
							var reader = new FileReader();
							//图片加载完成后获取预览图片的数据
							reader.onload = (function (file) {
								return function (e) {
										var image = new Image();
										image.src = e.target.result;

										image.onload = function () {
											$scope.$apply(function () {
												file.src = image.src;
												file.width = image.width;
												file.height = image.height;
												//console.log(file)
											})

										}
								}
							})(file);
							reader.readAsDataURL(file)
						}		
					})
				})


				$scope.fns={
					//获取上传图片后服务器返回的信息
					getResult:function () {
						//新建formData对象
						if(!$scope.model.files||$scope.model.files.length<=0){
							alert('请选择一张图片');
							return;
						}
						$scope.formData = new FormData();
						//把文件添加进formData对象
						for(var i = 0 ;i < $scope.model.files.length ; i++){
							$scope.formData.append('img'+i, $scope.model.files[i]);
						}
						//上传的服务器地址
						$scope.serve = '/FxbManager/uploadController/uploadFile?uploadSync=true';
						//发送请求
						upLoadImg($scope.serve,$scope.formData).then(function (data) {
							//console.log(data.data.jsonBody)
							$scope.model.imgInfo = data.data.jsonBody[0];
							$scope.msgs.success =true;
						})
					},
					//手动添加file的点击事件选择图片
					selectImg:function () {
						//console.log(file_input)
						//用$timeout防止再触发$apply
						$timeout(function () {
							file_input.click();
						})
					}
				}
				
				//设置提示信息
				function setMsg(options) {
					var img_types=options.type.join(',')
					var type = false;
					
					$scope.msgs.default = '请上传1张'+img_types+'格式的图片,'+
										  '图片尺寸'+options.size.width + 'X'+options.size.height+'像素'
					//console.log($scope.model)
					if(!$scope.model.files || $scope.model.files.length == 0){
						$scope.msgs.has_files = false;
						return
					}else{
						$scope.msgs.has_files = true;
					}
					
					//console.log($scope.model.files[0].type)
					angular.forEach(options.type, function(value, key){
						var reg = new RegExp(value)
						//console.log(reg)
						if(reg.test($scope.model.files[0].type)){
							type = true;
						}
					});
					$scope.msgs.type_err = !type;
					
					//console.log($scope.model.files[0])
					if($scope.model.files[0].width != options.size.width || $scope.model.files[0].height != options.size.height){
						$scope.msgs.size_err = true;
					}else{
						$scope.msgs.size_err = false;
					}
					//console.log($scope.model)
					$scope.msgs.type_err_msg = '文件格式不正确,请上传'+img_types+'格式的图片';
					$scope.msgs.size_err_msg = '图片尺寸不正确,请上传'+options.size.width + 'X'+options.size.height+'像素的图片';

				}
			

			}
		};
	}]);
	
	//上传头像
	upload.directive('uploadHeadImg',['$http','upLoadImg','$timeout','modalfix','$q',
		function ($http,upLoadImg,$timeout,modalfix,$q) {
			return{
				scope: {
				 	model:'='
				}, 
				controller:function($scope, $element, $attrs, $transclude) {
				 	$scope.events={
				 		selectImg:function (e) {
				 			e.stopPropagation();
				 			$scope.fns.selectImg()
				 		},
				 		determine:function (e) {
				 			e.stopPropagation();
				 			$scope.fns.determine();
				 		},
				 		uploadImg:function (e) {
				 			e.stopPropagation();
				 			$scope.fns.uploadImg();
				 		}
				 	}
				},
				restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
				//template: '<div>图片上传</div>',
				templateUrl: 'templates/upload-head-img.html',
				link:function ($scope, iElm, iAttrs, controller) {

					$scope.isImgReady = false;


					angular.element ('head').append ('<link href="../bower_components/cropper/dist/cropper.css" rel="stylesheet">');

					var file_input = angular.element('#file_input');
					var img = $('#upload_head_img');
					var canvas=$('<canvas width="400" height="400"></canvas>')[0];
					var ctx=canvas.getContext('2d');
					//console.log(canvas.toDataURL())
					
					//监听文件选择事件
					file_input.on('change', function(event) {
						
						
						var that = this;
						//如果没有选择文件,则返回
						if(that.files.length == 0){
							return
						}
						//console.log(that.files[0])
						//console.log(that.files[0].src)
						//检查文件格式是否正确
						if(!$scope.fns.checkFileType(that.files[0].type)){
							console.log('文件格式错误')
							modalfix.ok({
								msg:'文件格式错误,请上传jpg,jpeg,png格式的文件'
							})

							return
						}
						//初始化canvas画布
						canvas=$('<canvas width="400" height="400"></canvas>')[0];
						ctx=canvas.getContext('2d');
						//console.log(that.files[0].type)
						$scope.$apply(function () {
							
							 $scope.fns.previewImg(that.files[0]).then(function (file) {
							 	//console.log(file.src)
							 	$scope.model.file = file
							 	//console.log(img.cropper)
							 	$timeout(function () {
							 		//图片剪裁设置
							 		$scope.fns.getCropperImg(img,file)
							 		
							 		
							 	})
							 	
							 })
						})
						
					});


					$scope.fns={
						selectImg:function () {
							$timeout(function () {
								file_input.click();
							})
						},

						//检查文件格式
						checkFileType:function (type) {
							if(type.length == 0){
								return false;
							}
							type =type.match(/\/(.*)/)[1];

							if ('jpg|jpeg|png'.indexOf(type) == -1){
								return false;
							}else{
								return true;
							}
							
						},

						//预览图片
						previewImg:function (file) {
							//console.log(file)
							var deferred = $q.defer();
							var promise = deferred.promise;

        					//console.log(promise)
							var reader = new FileReader();
							//图片加载完成后获取预览图片的数据
							reader.onload = (function (file) {
								return function (e) {
										var image = new Image();
										image.src = e.target.result;
										//获取文件的尺寸
										image.onload = function () {
											$scope.$apply(function () {
												file.src = image.src;
												file.width = image.width;
												file.height = image.height;
												deferred.resolve(file)
												//console.log(file)
											})

										}

										//console.log(file)
								}
							})(file);
							reader.readAsDataURL(file)

							return promise;
						},
						//获取剪裁后的图片
						getCropperImg:function (img,file) {
							//console.log(img)
							
							img.cropper({
							 			aspectRatio: 9 / 9,
										mouseWheelZoom: false,
										preview: ".img-preview",
										autoCropArea: 0.65,
										crop:function (data) {
											setCanvas(data)
										}
								 	})

							img.cropper('replace',file.src);
							
							function setCanvas(data) {
								//console.log(data)
								//获取剪裁的区域
								var x = Math.round(data.x*10)/10,
									y = Math.round(data.y*10)/10,
									width = Math.round(data.width*10)/10,
									height = Math.round(data.height*10)/10;
								
								//console.log(img)
								ctx.drawImage(img[0],x,y,width,height,0,0,400,400)

							}
							

							
						},

						determine:function () {
							img.cropper('destroy');

							if(!$scope.model.file) return
							//console.log(canvas.toDataURL());
							//$scope.model.file.src=canvas.toDataURL();
							//console.log(new File())
							if(typeof canvas.toBlob == 'function'){
								canvas.toBlob(function (blob) {
									//更新$scope.model.file对象
									var file = new File([blob],'headimg.png',{type:'image/png'})
									file.src = canvas.toDataURL();
									$scope.$apply(function () {
										$scope.model.file = file;
									})
									
									//console.log($scope.model.file)
								})
							}else{
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
								var file = new File([blob],'headimg.png',{type:'image/png'})
								file.src = canvas.toDataURL()
								$scope.model.file = file;
							}
							

							$scope.isImgReady = true;
							//console.log($scope.model.file)
						},
						
						//上传图片
						uploadImg:function (e) {

				 			//console.log($scope.model.file)
				 			var formData = new FormData()

				 				formData.append('headImg',$scope.model.file)

				 			var server = '/FxbManager/uploadController/uploadFile?uploadSync=true'
				 			upLoadImg(server,formData).then(function (data) {
				 				if( data.data.state == 1){
				 					$scope.model.file.uploadImgPath = data.data.jsonBody[0].saveFile


				 				}else{
				 					modalfix.ok({msg:'图片上传失败'})
				 				}
				 			})
				 		}
					}
				}
			}
		}])
})