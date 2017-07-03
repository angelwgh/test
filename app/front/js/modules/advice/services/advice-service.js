define(function(){
	return['Restangular', '$http', function (Restangular, $http) {
		var advice = Restangular.withConfig(function (config) {
			config.setBaseUrl('/FxbManager/feedbackController/')
		})
		return{
			 
            saveFeedback:function (data) {
            	var req = {
			            "msgHead":"",
			            "msgBody":"",
			            "jsonHead":{                   
			            	"accessToken":data.accessToken
			            },
			            "jsonBody":{
			                "content": data.content   // 帖子id
			      		} 
			        }
			    return advice.all('saveFeedback').post(req);
            	
            }
		}
	}]
})