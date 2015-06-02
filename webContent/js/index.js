var host = "http://www.robsonluz.com.br/";

$.ajaxSetup({
	dataType: "json",
	beforeSend: function(request){ $.mobile.loading('show'); },
	error: function(){ toast("erro ao realizar o operacao") },
	complete: function(){ $.mobile.loading('hide'); },
	xhrFields: { withCredentials: true },
	crossDomain: true
});

var doLogin = function(data){
	$.ajax({
		type: "POST",
		url: host + "login/login.json",
		data: data,
		success: loginSuccesCallback
	});
}
var registroSucessCalback = function(response){
	doLogin($("#cadastre-se form").serialize());
}

var loginSuccesCallback = function(response){
	if(!response.id){
		toast("erro ao realizar o operação");
		return;
	}
	sessionStorage.setItem("user", JSON.stringify(response)) ;
	$.mobile.changePage("#streamPage");
};
$(document).on("pagecontainerbeforeshow", function(){
	if(!sessionStorage.user){
		$.mobile.changePage("#loginPage");
		return;
	}
	
	$("form").unbind();
	$("input[type!='submit'], textarea").each(function(){$(this).val("")})
});
$(document).on("pageshow", "#loginPage", function(){
	$("form").submit(function(event){
		doLogin($("#loginPagee form").serialize());
	});
});

$(document).on("pageshow", "#cadastre-se", function(event){
	$("form").submit(function(event){
		$.ajax({
			type: "POST",
			url: host + "register/save.json",
			data: $("#cadastre-se form").serialize(),
			success: registroSucessCalback
		});
	});
});

var posts = null;
var postId = null;
var loadStreamSuccessCallback = function(response){
	if(response.message){
		toast(response.message);
		return;
	}

	if(response.length == 0){
		$.mobile.changePage("#postPage");
		return;
	}
	
	sessionStorage.setItem("posts", JSON.stringify(response)) ;
	
	$("#postTemplate").tmpl(response).appendTo("#posts");
	$("#posts").listview("refresh", true);
	
}
$(document).on("pageshow", "#streamPage", function(){
	$("#posts").html("");
	$.ajax({
		type: "GET",
		url: host + "stream/index.json",
		success: loadStreamSuccessCallback,
	});
});

$(document).on("pageshow", "#postPage", function(){
	$("form").submit(function(event){
		$.ajax({
			type: "POST",
			url: host + "stream/create.json",
			data: $("#postPage form").serialize(),
			success: function(){ $.mobile.changePage("#streamPage");},
		});
	});
});

$(document).on("pageshow", "#commentPage", function(){
	$("#commentPage input[name='postId']").val(sessionStorage.postId);
	$("form").submit(function(event){
		$.ajax({
			type: "POST",
			url: host + "stream/createComentario.json",
			data: $("#commentPage form").serialize(),
			success: function(){ $.mobile.changePage("#streamPage");},
		});
	});
});

$(document).on("pageshow", "#viewCommentsPage", function(){
	$("#comments").html("");
	var posts = JSON.parse(sessionStorage.getItem('posts'));
	for(i in posts){
		if(posts[i].id == sessionStorage.getItem('postId')){
			
			if(posts[i].comentarios.length == 0){
				$.mobile.changePage("#commentPage");
				return;
			}
			
			$("#commentTemplate").tmpl(posts[i].comentarios).appendTo("#comments");
		}
	}
	$("#comments").listview("refresh", true);
});
