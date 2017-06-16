define(['angular'],function (angular) {
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
						console.log(newValue)
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
							console.log(data.data.jsonBody)
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
})