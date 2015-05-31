/*** Fun��es para mudar de p�gina, utilizando ajax, com envio de par�metros ***/
var globalParams = null;
function changePage(page, params) {
	globalParams = params;
	$.mobile.changePage(page, { data: params } );		
}
function getParameterByName(param) {
	if(globalParams!=null) {
		return globalParams[param];
	}else{
		var url = window.location;
		var match = RegExp('[?&]' + param + '=([^&]*)').exec(url);  	
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));  
	}
}
/******************************************************************************/


/**
$(document).bind("mobileinit", function(){
	$.mobile.defaultPageTransition = "none";
});
**/

