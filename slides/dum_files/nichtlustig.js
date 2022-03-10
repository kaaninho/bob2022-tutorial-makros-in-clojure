/*
* Hallo :)
*/

var thumbscrollerVisible = false;
var thumbsearchVisible = false;
var cartoonThumbs = null;
var cartoons = cartoonList.length;
var lastTab = "all";
var shareText;
var last_search = "";
var cartoonPath = ajaxPath+"data/media/cartoons/";
var cartoonThumbPath = ajaxPath+"data/media/cartoons/thumbs/";
var bonusCartoonPath = ajaxPath+"data/media/cartoons/bonus/";
var cartoonImage = $('#comic_image img.current');
var cartoonArea = $('#comic_area');
var currentCartoonList = [];
var tempCartoonList = [];
var lastCartoon = 0;
var randomCartoonList = [];
var cartoonData = null;
var firstPageLoad = true;

$(function(){
	loadCartoons();
	loadCartoon();

	$('#bonuspanel_button, .isSupporter #comic_image_bonus').click(function(){
		toggleBonuspanel();
		return false;
	});

	var key_fired = false;
	$(document).keydown(function( event ) {
	  if(!key_fired){
		  switch(event.which) 
		  {
		    case 37 : 
		    	$('.thumbscroller_navigation[data-direction="next"]').trigger('click');
		      break;
		    case 38 : 
		    	if($('#comic_area').hasClass('hasBonus'))
		    		toggleBonuspanel();
		      break;
		    case 39 : 
		    	$('.thumbscroller_navigation[data-direction="prev"]').trigger('click');
		      break;
		    case 40 : 
		    	if($('#comic_area').hasClass('hasBonus'))
		    		toggleBonuspanel();
		      break;
		  }
	  }
	  key_fired = true;
	});

	$(document).keyup(function( event ) {
	  key_fired = false;
	});

	$('#comic_image img').click(function(){
		if($('#comic_area').hasClass('hasBonus'))
			toggleBonuspanel();
		return false;
	});

	$('#share a').click(function(){
		gtag('event', "share", {'event_category': 'Cartoon', 'event_label': cartoonData.slug+" ("+cartoonData.title+")"});
		if($('#main_navigation_mobile_toggle').is(':visible'))
			$('#share').stop().fadeOut(250);
	});

	var isNavigating = false;
	$('.thumbscroller_navigation').click(function(){
		if(isNavigating)
			return false;
		fixClass();
		if($(this).attr('data-direction') == "prev"){
			activeCartoon--;
		}else{
			activeCartoon++;
		}
		if(activeCartoon < 0)
			activeCartoon = 0;
		if(activeCartoon >= currentCartoonList.length)
			activeCartoon = currentCartoonList.length-1;
		window.setTimeout(function(){
			isNavigating = false;
		},300);
		isNavigating = true;
		loadCartoon();
		return false;
	});

	$('#thumbscroller_elements').on('click','a',function(){
		last_search = $('#thumbsearch input').val();
		$('#comic_overlay').removeClass('show');
		$('#comic_area').removeClass('showOverlay');
		$('body').removeClass('showThumbscroller');
		activeCartoon = parseInt($(this).attr('data-index'));
		randomCartoonList = [];
		loadCartoon();
		return false;
	});

	var loadThumbsAfterScroll = null;
	var c = 0;

	$('#thumbscroller_scrollarea').on('scroll', function(){
		c++;
		if(c%8 == 0)
			loadThumbnails(true);
		
		if(loadThumbsAfterScroll) clearTimeout(loadThumbsAfterScroll);
		loadThumbsAfterScroll = window.setTimeout(function(){
			loadThumbnails(true);
		},250);
	});

	var rollingDice = false;
	$('.comic_random').click(function(){
		if(rollingDice)
			return false;
		var cartoonSelect = Math.floor(Math.random()*currentCartoonList.length);
		while(randomCartoonList.indexOf(cartoonSelect) !== -1){
			cartoonSelect = Math.floor(Math.random()*currentCartoonList.length);
		}
		activeCartoon = cartoonSelect;
		$('#comic_area').addClass('rollDice');
		window.setTimeout(function(){
			$('#comic_area').removeClass('rollDice');
			rollingDice = false;
		},1100);
		rollingDice = true;
		loadCartoon();
		gtag('event', "randomCartoon", {'event_category': 'Cartoon'});
		return false;
	});


	$('.close-comic-overlay').click(function(){
		$('#comic_overlay').removeClass('show');
		$('#comic_area').removeClass('showOverlay');
		$('body').removeClass('showThumbscroller');
		$('#thumbsearch input').val(last_search);
		currentCartoonList = tempCartoonList;
		window.setTimeout(function(){
			loadCartoons(last_search);
		},250);
		return false;
	});

	$('.view_cartoons').click(function(){
		$('#current_cartoon_indicator').show();
		tempCartoonList = currentCartoonList;
		scrollToCurrentThumbnail();
		$('#comic_overlay .overlay-section').hide();
		$('#comic_overlay .overlay-search').show();
		$('#comic_overlay').addClass('show');
		$('#comic_area').addClass('showOverlay');
		$('body').addClass('showThumbscroller');
		if($('#main_navigation_mobile_toggle').is(':visible')){
        	$('body').height(50).addClass('lock_body');;
        	$('html, body').scrollTop(0,500);
		}
		loadThumbnails(true);
		return false;
	});

	$('#thumbsearch input').on('keyup', function(){
		$('#current_cartoon_indicator').hide();
		searchCartoon();
	});

	$('.delete-input').click(function(){
		$('#current_cartoon_indicator').hide();
		$('#thumbsearch input').val('');
		searchCartoon();
		return false;
	});

	$('#onlyBonusCheckbox').change(function(){
		$('#current_cartoon_indicator').hide();
		loadCartoons($('#thumbsearch input').val());
		loadThumbnails(true);
		if($(this).is(':checked')){
			$('#comic_navigation').addClass("onlyBonus");
		}else{
			$('#comic_navigation').removeClass("onlyBonus");
		}
		return false;
	});

	$('#thumbsearch input').on('focus', function(){
		$('html, body').animate({'scroll-top':($('#thumbsearch').offset().top)+'px'},250);
	});
});

var firstCartoon = true;
var search = null;
var allCartoons = "";

function toggleShare(){
	if(!$('#share').is(':visible')){
		$('#share').stop().fadeIn(250);
	}else{
		$('#share').stop().fadeOut(250);
	}
}

function loadCartoons(search){

	if(search == undefined)
		search = "";
	lastTab = "all";
	if(search != "")
		lastTab = "search";

	$('#comic_navigation').removeClass('activeSearch');
	if(search != ""){
		$('#comic_navigation').addClass('activeSearch');
	}

	currentCartoonList = [];

	var numCartoons = cartoonList.length;
	var c = document.createDocumentFragment();
	for(var i = 0; i < numCartoons; i++){
		var data = cartoonList[i];
		if(($('#onlyBonusCheckbox').is(':checked')) && !data.bonus)
			continue;
		if(search != "" && data.tags.indexOf(" "+search.toLowerCase().trim()+" ") == -1)
			continue;
		currentCartoonList.push(i);
	}

	if(currentCartoonList.length == 1){
		$('.comic_random').hide();
	}else{
		$('.comic_random').show();
	}

	generateCartoonThumbnails();
	firstPageLoad = false;
}

window.onpopstate = function(event) {
    if(window.location.href != document.location)
  		window.location.href = document.location;
};

function generateCartoonThumbnails(){
	document.getElementById("thumbscroller_elements").innerHTML = '';
	var c = document.createDocumentFragment();
	for(var i = 0; i < currentCartoonList.length; i++){
		var data = cartoonList[currentCartoonList[i]];
		var e = document.createElement("div");
		e.setAttribute('class', (data.bonus ? 'hasBonus ' : '')+(data.public_bonus ? 'publicBonus ' : '')+'element');
		e.setAttribute('id', 'cartoon'+i);
		e.style.backgroundImage = "url("+ajaxPath+"data/media/cartoons/platzhalter.jpg)";
		var a = document.createElement("a");
		a.setAttribute('href', ajaxPath+"nichtlustig/"+data.slug);
		a.setAttribute('alt', data.title);
		a.setAttribute("data-index", i);
		e.appendChild(a);
		c.appendChild(e);
	}
	document.getElementById("thumbscroller_elements").appendChild(c);
}

function searchCartoon(){
    if (search) clearTimeout(search);
    search = setTimeout(function(){
		loadCartoons($('#thumbsearch input').val());
		loadThumbnails("all");
    }, 100);
    if($('#thumbsearch input').val() != "" && !$('#thumbsearch').hasClass('has-input')){
    	$('#thumbsearch').addClass('has-input');
    }else if($('#thumbsearch input').val() == "" && $('#thumbsearch').hasClass('has-input')){
    	$('#thumbsearch').removeClass('has-input');
    }
}

function scrollToCurrentThumbnail(){

		if(activeCartoon < 0)
			activeCartoon = 0;
		if(activeCartoon >= currentCartoonList.length)
			activeCartoon = currentCartoonList.length-1;
		
	var currentCartoonThumbnail = document.getElementById('cartoon'+activeCartoon);
	var elementWidth = currentCartoonThumbnail.offsetWidth;
 	var thumbscrollerOffset = currentCartoonThumbnail.offsetTop+elementWidth/2-$('#comic_area').height()/2.5;
	$('#thumbscroller_scrollarea').scrollTop(thumbscrollerOffset);

	$('#current_cartoon_indicator').width(elementWidth+8).height(elementWidth+8).css({'left':currentCartoonThumbnail.offsetLeft, 'top':currentCartoonThumbnail.offsetTop});

	loadThumbnails(true);
}

function fixClass(){
	$('#comic_image_bonus').removeClass('rotateAnimation');
	$('#comic_image').removeClass('rotateAnimation');
}

var tempCartoonImage = new Image();
tempCartoonImage.onload = function(){
	cartoonImage.attr('src',tempCartoonImage.src);
	isNavigating = false;
};

function loadCartoon(){

	fixClass();

	//var wasBonus = cartoonArea.hasClass('hasBonus');
	//cartoonArea.removeClass('fromBonusToDefault');

	var cartoonID = currentCartoonList[activeCartoon];
	var cartoon = cartoonList[cartoonID];

	cartoonData = cartoon;

	if(tempCartoonImage.src == cartoonPath+cartoon.image)
		return false;
	
	var color = cartoon.color;
	$('.main_color').attr('style','background-color: '+color+'; border-color: '+shadeColor(color,-40)+' !important;');
	checkModifications();

	cartoonImage.attr('src',cartoonThumbPath+cartoon.image);
	tempCartoonImage.src = cartoonPath+cartoon.image;

	setCookie("last_cartoon", cartoon.slug, 1);

	var nextCartoonIndex = activeCartoon+1;
	var prevCartoonIndex = activeCartoon-1;

	if(nextCartoonIndex > currentCartoonList.length-1)
		nextCartoonIndex = currentCartoonList.length-1;
	if(prevCartoonIndex < 0)
		prevCartoonIndex = 0;

	var nextCartoon = cartoonList[currentCartoonList[nextCartoonIndex]];
	var prevCartoon = cartoonList[currentCartoonList[prevCartoonIndex]];

	var nextURL = ajaxPath+"nichtlustig/"+nextCartoon.slug+"/";
	var prevURL = ajaxPath+"nichtlustig/"+prevCartoon.slug+"/";

	$('.thumbscroller_navigation[data-direction="next"]').attr('href',nextURL);
	$('.thumbscroller_navigation[data-direction="prev"]').attr('href',prevURL);

    document.title = "NICHTLUSTIG-Cartoon: "+cartoon.title;
    var currentUrl = ajaxPath+'nichtlustig/'+cartoon.slug+'/';

	shareText = (document.title + " " + currentUrl).replace('"','');
	$('.share_fb').attr('href', 'https://www.facebook.com/sharer/sharer.php?u='+currentUrl);
	$('.share_tw').attr('href', 'https://twitter.com/intent/tweet?text='+shareText);
	$('.share_wa').attr('href', 'https://api.whatsapp.com/send?text='+shareText);

	if(!firstPageLoad){
		if(cartoonArea.hasClass('noSupporter') && cartoon.bonus_image == ""){
			window.setTimeout(function(){
				$('#comic_image_bonus img').attr('src', $('#comic_image_bonus').attr('data-placeholder'));
			},250);
		}else if(cartoon.bonus_image != ""){
			$('#comic_image_bonus img').attr('src',bonusCartoonPath+cartoon.bonus_image);
		}
	}

	if(cartoonArea.hasClass('showBonus')){
		cartoonArea.removeClass('showBonus');
		cartoonArea.addClass('hideBonus');
	}else{
		cartoonArea.removeClass('hideBonus');
	}

	if(cartoon.bonus == true){
		cartoonArea.addClass('hasBonus');
	}else{
		cartoonArea.removeClass('hasBonus');
	}

	if(cartoon.public_bonus == true){
		cartoonArea.addClass('publicBonus');
	}else{
		cartoonArea.removeClass('publicBonus');
	}

	//if(wasBonus && !cartoonArea.hasClass('hasBonus'))
	//	cartoonArea.addClass('fromBonusToDefault');

	if(activeCartoon == 0){
		$('.thumbscroller_navigation[data-direction="prev"]').addClass('inactive');
	}else{
		$('.thumbscroller_navigation[data-direction="prev"]').removeClass('inactive');
	}

	if(activeCartoon == currentCartoonList.length-1){
		$('.thumbscroller_navigation[data-direction="next"]').addClass('inactive');
	}else{
		$('.thumbscroller_navigation[data-direction="next"]').removeClass('inactive');
	}

	scrollToCurrentThumbnail();
	lastCartoon = activeCartoon;

	$('#current_cartoon_indicator').show();
	if($('#comic_area').hasClass('init'))
		$('#comic_area').removeClass('init');

	randomCartoonList.push(activeCartoon);
	var maxCartoons = Math.floor(currentCartoonList.length*0.8);
	if(maxCartoons < 1)
		maxCartoons = 1;
	if(maxCartoons > 50)
		maxCartoons = 50;

	while(randomCartoonList.length > maxCartoons){
		randomCartoonList.shift();
	}

	if($('.steady_login').length == 1){
		if(!$('.steady_login').hasClass('logged_in'))
			$('.steady_login').attr('href', 'https://steadyhq.com/oauth/authorize?response_type=code&client_id=4a4561b4-ac17-43bb-b2ce-03ac4c8800b5&redirect_uri=https://joscha.com/&scope=read&state=nichtlustig/'+cartoon.slug+'/');
	}

	if(window.location.hash) {
		var hash = window.location.hash.substring(1);
		if(hash == "bonus"){
			window.setTimeout(function(){
				toggleBonuspanel();
			},500);
		}
	}
	
    if(window.location.href != currentUrl)
		history.pushState(null, cartoon.title, currentUrl);

	gtag('event', "viewCartoon", {'event_category': 'Cartoon', 'event_label': cartoon.slug+" ("+cartoon.title+")"});

	$('a.supporterNotice-close').click(function(e){
		$('#supporterNotice').removeClass('show');
		window.setTimeout(function(){
			$('#supporterNotice').remove();
		},250);
	});

	$('a.supporterNotice-cta').click(function(){
		gtag('event', "supporterNotice", {'event_category': 'Cartoon', 'event_label': cartoonData.slug+" ("+cartoonData.title+")"});
	});
}

var loadImages = 0;

function loadThumbnails(currentPosition){

	if(currentPosition == "all"){
		for(var i = 0; i < currentCartoonList.length; i++){
			var element = $('#thumbscroller_elements .element').eq(i);
			if(element != undefined && !element.hasClass('loaded')){
				var cartoon = cartoonList[currentCartoonList[i]];
				var img = new Image();
				img.onload = function(id){
					id.target.thumbElement.css({'background-image':'url('+id.target.src+')'});
				};
				img.src = cartoonThumbPath+cartoon.image;
				img.thumbElement = element;

				element.addClass('loaded');
			}
		}
		return false;
	}

	if(currentPosition == undefined)
		currentPosition = false;

	var loadPos = activeCartoon;

	var exampleElement = $('#thumbscroller_elements .element').eq(0);

	if(currentPosition == true){
		var elementWidth =exampleElement.outerWidth()-5;
		var itemsPerRow = Math.floor($('#thumbscroller').width()/elementWidth);

	 	var row =  Math.floor($('#thumbscroller_scrollarea').scrollTop()/elementWidth);
	 	var rows = Math.floor(currentCartoonList.length/itemsPerRow);

	 	var currentRow = Math.floor(($('#thumbscroller_scrollarea').scrollTop()/$('#thumbscroller_scrollarea')[0].scrollHeight)*rows)+2;

		loadPos = Math.floor(currentRow*itemsPerRow+Math.floor(itemsPerRow/2));
	}

	if(!$('#comic_overlay').hasClass('show'))
		return;

	if(loadImages < 5){
		var perRow = $('#thumbscroller').width()/exampleElement.outerWidth();
		var perColumn = $('#thumbscroller').height()/exampleElement.outerWidth();
		loadImages = Math.ceil(perRow*perColumn/2);
	}

	var load_temp = loadImages;

	if(load_temp < 5)
		load_temp = 20;

	var loadFrom = Math.floor(loadPos - load_temp*1.5);
	var loadTo =  Math.round(loadPos + load_temp*1.5);

	if($('#main_navigation_mobile_toggle').is(':visible')){
		loadFrom = loadPos - (load_temp+4);
		loadTo = loadPos + (load_temp+4);
	}

	if(loadFrom < 0){
		loadTo -= loadFrom;
		loadFrom = 0;
	}

	if(loadTo >= cartoons.length)
		loadTo = cartoons.length-1;

	for(var i = loadFrom; i <= loadTo; i++){

		var element = $('#thumbscroller_elements .element').eq(i);
		if(element != undefined && !element.hasClass('loaded')){

			var cartoon = cartoonList[currentCartoonList[i]];
			if(cartoon != undefined){
				var img = new Image();
				img.onload = function(id){
					id.target.thumbElement.css({'background-image':'url('+id.target.src+')'});
				};
				img.src = cartoonThumbPath+cartoon.image;
				img.thumbElement = element;

				element.addClass('loaded');
			}

		}

	}
}

function toggleBonuspanel(){	
	fixClass();
	if($('#comic_area').hasClass('showBonus')){
		$('#comic_image_bonus').addClass('rotateAnimation');
		$('#comic_area').removeClass('showBonus');
		$('#comic_area').addClass('hideBonus');
	}else{

		if($('.steady_login').hasClass('logged_in') || $('#comic_area').hasClass('publicBonus')){
			gtag('event', "viewBonuspanel", {'event_category': 'Cartoon', 'event_label': cartoonData.slug+" ("+cartoonData.title+")"});
		}

		$('#comic_image').addClass('rotateAnimation');
		$('#comic_area').addClass('showBonus');
		$('#comic_area').removeClass('hideBonus');

		if($('#comic_area').hasClass('publicBonus') && $('#supporterNotice').length > 0){
			$('#supporterNotice').addClass('show');
		}
	}

	$('#main_navigation a.steady_login.button_wobble').removeClass('button_wobble');
	if($('#comic_area').hasClass('hasBonus') && $('#comic_area').hasClass('showBonus') && !$('#comic_area').hasClass('publicBonus')){
		if(!$('#main_navigation a.steady_login').hasClass('logged_in')){
			$('#main_navigation a.steady_login').addClass('button_wobble');
		}
	}
}
