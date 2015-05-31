var host = "http://www.robsonluz.com.br/";

$.ajaxSetup({
	dataType: "json",
	beforeSend: function(request){ $.mobile.loading('show'); },
	error: function(){ toast("erro ao realizar o operacao") },
	complete: function(){ $.mobile.loading('hide'); }
});



var loginSuccesCallback = function(response){
//	if(!response.id){
//		toast("erro ao realizar o operação");
//		return;
//	}
//	toast("sucesso");
//	console.log("usuário logado: " + response.id);
	$.mobile.changePage("#streamPage");
};

$(document).on("pageshow", "#loginPage", function(){
	$("form").submit(function(event){
		$.ajax({
			type: "POST",
			url: host + "login/login.json",
			data: $("#loginPage form").serialize(),
			success: loginSuccesCallback
		});
	});
});

$(document).on("pageshow", "#cadastre-se", function(event){
	$("form").submit(function(event){
		$.ajax({
			type: "POST",
			url: host + "register/save.json",
			data: $("#cadastre-se form").serialize(),
			success: loginSuccesCallback
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
	
	posts = response;
	$("#posts").html("");
	$("#postTemplate").tmpl(response).appendTo("#posts");
	$("#posts").listview("refresh", true);
	
}
$(document).on("pageshow", "#streamPage", function(){
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
	$("#commentPage input[name='postId']").val(postId);
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
	for(i in posts){
		if(posts[i].id == postId){
			$("#commentTemplate").tmpl(posts[i].comentarios).appendTo("#comments");
		}
	}
	$("#comments").listview("refresh", true);
});
