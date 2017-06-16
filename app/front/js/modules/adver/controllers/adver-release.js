//发布/修改广告
define(function () {
	'use strict';

	return ['$scope','adverServices','BasicData','modalfix','$state',
		function ($scope,adverServices,BasicData,modalfix,$state) {
		$scope.release_data={
			active_category:{},
			category_show:false,
			files:{
				options:{
					type:[
						'jpg',
						'png'
					],
					size:{
						width:700,
						height:225
					}
				}
			},
			url:null,
			title:null
			
		}

		var fn = function () {
			console.log('确认删除')
		}
		
		$scope.$watch('adver_data',function (newValue, oldValue) {
			//console.log(newValue)
			if(newValue.upload == "modify"){
				$scope.release_data.id=newValue.modify.id;
				$scope.release_data.url = newValue.modify.url;
				$scope.release_data.title = newValue.modify.title;
				$scope.release_data.active_category.id = newValue.modify.categoryid;
				$scope.release_data.active_category.name = newValue.modify.category;
				$scope.release_data.files.files=
					[{
						src:'/mfs'+ newValue.modify.imagePath
					}]
				$scope.release_data.files.imgInfo={
					saveFile:newValue.modify.imagePath
				}
			}
		},true)

		//console.log($scope.adver_form)
		//监听是否获取到类别
		$scope.$watch('release_data.active_category.name', function(newValue, oldValue, scope) {
			if(newValue!==oldValue){
				$scope.release_data.category_show=false;
			}
		});

		$scope.$watch('release_data.files', function(newValue, oldValue, scope) {
			//console.log($scope.release_data)
			if(newValue.imgInfo){
				console.log($scope.release_data.files.imgInfo)
				$scope.release_data.isImgUploaded=true;
			}else{
				//console.log($scope.release_data.files.imgInfo)
				$scope.release_data.isImgUploaded=false;
			}
			//console.log($scope.adver_form.$invalid)
			//console.log($scope.release_data.isImgUploaded)
			
		}, true);
		//监听图片是否上传成功
		/*$scope.$watch('release_data.files.imgInfo',function (newValue, oldValue, scope) {
			if(newValue){
				console.log($scope.release_data.files.imgInfo)
				$scope.release_data.isImgUploaded=true;
			}else{
				console.log($scope.release_data.files.imgInfo)
				$scope.release_data.isImgUploaded=false;
			}
		},true)*/
		
		$scope.events = {
			getCategorysList:function (e) {
				e.stopPropagation();
				adverServices.getCategorys()
				.then(function (data) {
					data.jsonBody.shift()
					$scope.release_data.categorys=data.jsonBody;
					$scope.release_data.category_show=true;
				})
			},
			hideCategorysList:function (e) {
				e.stopPropagation();
				$scope.release_data.category_show=false;
			},
			categoryBlur:function (e) {
				e.stopPropagation();
				e.preventDefault();
				$scope.adver_form.category.$dirty = true;
				//console.log($scope.adver_form.category)
			},
			submit:function (e) {
				e.stopPropagation();
				e.preventDefault();
				var adver = {};
                adver.url = $scope.release_data.url;
                adver.title = $scope.release_data.title;
                adver.imagePath = $scope.release_data.files.imgInfo.saveFile;
                adver.categoryid = $scope.release_data.active_category.id;
		
				//console.log($scope.release_data)
				//console.log(adver)
				//
				adverServices.uploadAdver(adver).then(function (data) {
					console.log(data)

					modalfix.ok({
						msg:data.msg,
						confirmFn:function () {
							$state.reload('states.adver.release')
						}
					})
					/*if(data.state==1){
						$scope.release_data.url=null;
						$scope.release_data.title=null;
						$scope.release_data.active_category = null;
						$scope.release_data.files.files = null;
						$scope.release_data.files.imgInfo = null;
						console.log($scope.release_data.files)
					}*/
					
				})
			},

			modifyAdevr:function (e) {
				e.stopPropagation();
				e.preventDefault();

				var adver ={}
				adver.id = $scope.release_data.id;
				adver.url = $scope.release_data.url;
                adver.title = $scope.release_data.title;
                adver.imagePath = $scope.release_data.files.imgInfo.saveFile;
                adver.categoryid = $scope.release_data.active_category.id;

                adverServices.modifyAdver(adver).then(function (data) {
                	modalfix.ok({
						msg:data.msg,
						confirmFn:function () {

						}
					})
                })
			}
		}
	}]
})