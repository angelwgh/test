'use strict'; 
var lrSnippet = require('connect-livereload')({port:35729});
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');

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
			html:{
				files:['<%=project.dist%>/*.html'],
				options:{
					livereload: 35729
				}
			}
		},

		// 启动grunt server任务后的服务器设置,connect中不可以使用<%=%>这种变量表达式
		connect:{
			/*options: {

			},
			proxies: [
				{
			}],
			livereload:{

			},*/
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
						   serveStatic('dist'),
						   // 启用目录浏览(相当于IIS中的目录浏览)
						   serveIndex('dist')
						];

					}
				}
			}
		}


	})

	//注册一个名为'serve', 输入grunt serve执行这个任务
	grunt.registerTask('serve','Compile then start a connect web server',function (target) {
		if(target === 'dist'){

		}else if (target === 'static'){

		}

		grunt.task.run([
				
				'connect',
				'watch'
			])
	});

	grunt.event.on('watch', function(action, filepath, target) {
		  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
		  grunt.log.writeln('action='+action);
		  grunt.log.writeln('filepath='+filepath);
		  grunt.log.writeln('target='+target);
		});

}
