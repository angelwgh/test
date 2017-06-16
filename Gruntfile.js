'use strict'; 
var lrSnippet = require('connect-livereload')({port:35729});//实时加载
var serveStatic = require('serve-static'); //静态文件
var serveIndex = require('serve-index');   //目录浏览
var proxySnippet = require ('grunt-connect-proxy2/lib/utils').proxyRequest;//代理

var mountFolder = function (dir) {
	//解析绝对路径 'F:\\wgh\\develop\\test\\'+dir
	return serveStatic (require ('path').resolve (dir));
};

module.exports=function (grunt) {
	//该模块将读取的package.json中的
	//  dependencies
	//  devDependencies
	//  peerDependencies
	//  optionalDependencies
	//  并加载与提供的模式匹配的grunt任务。
	require('load-grunt-tasks')(grunt); 
	

	//  显示grunt任务的已执行时间
	require('time-grunt')(grunt)
	
	//  配置基本路径参数
	var config={
		app:'app',    //生产目录
		dist:'dist',  //产品目录
		tmp:'.tmp'    //临时文件夹
	};

	//  给grunt任务定义配置
	grunt.initConfig({

		//项目设置
		project:config,

		//监听文件变化执行，相应任务，实现文件变化后，浏览器可以及时变化
		watch:{
			
			livereload:{
				options:{
					livereload: 35729
				},
				files:[
					'<%=project.app%>/*.html',
					'<%=project.app%>/**/*.html',
					'<%=project.app%>/**/*.js',
					'<%=project.app%>/**/*.css'
				],	
			},
			style:{
				files:['<%=project.app%>/**/*.less'],
				tasks:['less:server','newer:autoprefixer:server']
			}
		},

		// 启动grunt server任务后的服务器设置,connect中不可以使用<%=%>这种变量表达式
		connect:{
			options: {

			},
			proxies: [
				{
                    context: '/FxbManager',
                    //host: '192.168.88.199',
                    host: '192.168.88.110',
                    //host: '192.168.1.97',
                    port: 8080,
                    https: false,
					changeOrigin: true
				}],
			dist:{
				options:{
					port:9001,
					base:'dist',
					open:true,
					middleware:function (connect) {
						return [
						   // 把脚本，注入到静态文件中
						   lrSnippet,
						   // 静态文件服务器的路径
						   //connect.static
						   //serveStatic('F:\\wgh\\develop\\test\\dist'),
						   mountFolder('./dist'),
						   connect ().use ('/bower_components', serveStatic ('./bower_components')),

						   // 启用目录浏览(相当于IIS中的目录浏览)
						   // connect.directory
						   //serveIndex('F:\\wgh\\develop\\test\\dist')
						   
						   //代理
						   proxySnippet 
						];

					}
				}
			},
			server:{
				options:{
					port:9001,
					base:'app',
					open:true,
					middleware:function (connect) {
						return [
						   // 把脚本，注入到静态文件中
						   lrSnippet,
						   // 静态文件服务器的路径
						   //connect.static
						   //serveStatic('F:\\wgh\\develop\\test\\dist'),
						   mountFolder('./app'),
						    connect ().use ('/bower_components', serveStatic ('./bower_components')),
						   // 启用目录浏览(相当于IIS中的目录浏览)
						   // connect.directory
						   //serveIndex('F:\\wgh\\develop\\test\\dist')
						   connect ().use ('/mfs', serveStatic ('z:\\')),
						   //代理
						   proxySnippet
						];

					}
				}
			}
		},

		//语法检查
		jshint:{
			options: {
				jshintrc: '.jshintrc',
				reporter: require ('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= project.app %>/**/*.js'
				]
			}
		},

		// grunt-contrib-less编译插件

		less:{
			dist: {
				files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: '**/*.less',
					dest: '<%= project.tmp %>',
					ext: '.css'
				}]
			},
			server: {
				files:[{
					expand:true,
					cwd:'<%= project.app %>',
					src:'**/*.less',
					dest:'<%= project.tmp %>',
					ext:'.css',
					rename:function (dest,filename) {
						//ba s把生成的css文件放到css目录下
						return dest+'/'+filename.replace('styles/','css/')
					}
				}]
			}
		},

		// 复制文件
		copy:{
			options:{
				mtimeUpdate: true
			},
			dist:{
				files:[{
					expand: true,
					dot: true,
					cwd: './<%= project.app %>',
					dest: './<%= project.dist %>',
					src: ['**/*','!**/*.less']
				},
				{
					expand:true,
					dot:true,
					cwd:'./<%= project.tmp %>',
					dest:'./<%= project.dist %>',
					src:['**/*']
				}
				]
			},
			all:{
				src:'<%= project.app %>/*.html',
				dest:'<%= project.dist %>/'
			}
		},
		//删除文件
		clean:{
			dist:{
				files:{
					src:['<%= project.dist %>','<%= project.tmp %>']
				}
			}
		},

		//在CSS样式中为兼容各大浏览器自动添加前缀的插件
		autoprefixer:{
			options: {
				browsers: ['last 2 version','ie 8', 'ie 9','chrome 10']
			},
			server: {
				
				files: [{
					expand: true,
					cwd: '<%= project.tmp %>',
					src: '**/*.css',
					dest: '<%= project.app %>'
				}]
			},
		},

		//自动把Bower的组件注入到HTML文件中
		wiredep:{

		},

		// 使用grunt-contrib-compass对文件进行编译并压缩
		compass:{
			options: {
				sassDir: '<%= project.app %>/**/styles',
				cssDir: '<%= project.tmp %>/**/styles',
				generatedImagesDir: '<%= project.tmp %>/images/generated',
				imagesDir: '<%= project.app %>/**/images',
				javascriptsDir: '<%= project.app %>/**/js',
				fontsDir: '<%= project.app %>/**/fonts',
				importPath: './bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
		}


	})


	grunt.registerTask('loadStates',function () {
		
	})

	//注册一个名为'serve', 输入grunt serve执行这个任务
	grunt.registerTask('serve','Compile then start a connect web server',function (target) {
		if(target === 'dist'){

		}else if (target === 'static'){

		}

		grunt.task.run([
				'less:server',
				'autoprefixer',
				'configureProxies',
				'connect:server',
				'watch'
			])
	});


}
