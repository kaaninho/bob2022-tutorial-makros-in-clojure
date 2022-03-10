var mobileSidebarVisible = false;
var saveScroll;
var scrollPosition = $(document).scrollTop();
var cachedWidth = -1;
var comeToMe = null;

history.scrollRestoration = "manual";
document.addEventListener("touchstart", function(){}, true);

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) 
        return "device_default";
    if (/android/i.test(userAgent))
        return "device_default";
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
        return "device_ios";
    return "device_default";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function cookieNotice(){
	setCookie("cookieNotice", "true", 365);
	$('#cookie_notice').animate({'bottom':'-200px'}, 250, function(){
		$(this).remove();
	});
}

var hideCookieNotice = false;
if($('#hideCookieNotice').length > 0)
	hideCookieNotice = true;

if(!getCookie("cookieNotice") && !hideCookieNotice)
	document.body.innerHTML += '<div id="cookie_notice"><div id="cookie_notice_content"><p>Diese Webseite benutzt Cookies! Einige von ihnen sind essenziell, während andere helfen, diese Website zu verbessern. &nbsp; </p><a href="#" class="okay" onClick="cookieNotice(); return false;">Ok!</a></div></div>';

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;

}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkModifications(){
	if($('.contentInHeader #content').height() > $(window).height())
		$('.contentInHeader #content').css({'margin-bottom':'0px', 'border-bottom':'0px', 'border-radius':'0px'});
}

function scrollToPos(pos){
	if(comeToMe != null)
		clearTimeout(comeToMe);
	comeToMe = window.setTimeout(function(){
		$('#sidebar').css({'margin-top':scrollPosition+'px'});
	},250);
}

var headerHeight = $('#main_header_logo').height();
var setScrollAt = 10;


function scroll(check){
		if(check == undefined)
			check = false;

		scrollPosition = $(document).scrollTop();
		if(!$('#main_navigation_mobile_toggle').is(':visible')){
			var sidebarHeight = $('#sidebar_navigation').height();
			var documentHeight = $(document).height();
			if(scrollPosition+sidebarHeight < documentHeight-200)
				scrollToPos(scrollPosition);
			if(scrollPosition > setScrollAt){
				$('body').addClass('scroll');
			}else{
				$('body').removeClass('scroll');
				if(!$('body').hasClass('contentInHeader') && scrollPosition == 0){
					$('#content').css({'padding-top':$('#main_header_logo').height()+75});
					setScrollAt = headerHeight;
				}
			}
			$('#main_header_logo').css({'top':'0px'});
			$('#header_background_spacer').css('margin-top', '-50px');
		}else{
			$('#sidebar').css({'margin-top':'0px'});
			if(scrollPosition > setScrollAt){
				$('body').addClass('scroll');
			}else{
				$('body').removeClass('scroll');
			}

			var x = 1-$(window).scrollTop()/headerHeight;
			if(x >= -0.5 && x <= 1 || check){
				if($('#page_blog').length == 1 || $('#page_accounttest').length == 1){
					$('#header_background_spacer').css({'margin-top':$(window).scrollTop()*-1-50});
					$('.left_bar').css({'top':-50+$(window).scrollTop()});
				}else{
					if($('.contentInHeader').length == 0){
						$('.left_bar').css({'top':-50+$(window).scrollTop()});
						$('#main_header_logo').css({'top':$(window).scrollTop()*-1+50});
					}
				}
			}
		}

		check = false;
}

function resizeWindow(){
    var newWidth = $(window).width();
    if(newWidth !== cachedWidth){
		if(!$('#main_navigation_mobile_toggle').is(':visible')){
			if(!$('body').hasClass('contentInHeader'))
				$('#content').css({'padding-top':$('#main_header_logo').height()+75});
			$('.contentInHeader').removeClass('main_color').removeAttr('style');
			$('#sidebar').prependTo('#page');
			$('#comic_overlay').appendTo('#comic_area');
		}else{
			if(!$('body').hasClass('contentInHeader'))
				$('#content').css({'padding-top':$('#main_header_logo').height()});
			$('#sidebar').prependTo('body');
			$('#comic_overlay').appendTo('body');
			if(newWidth < 800){
				$('.contentInHeader').addClass('main_color');
			}else{
				$('.contentInHeader').removeClass('main_color');
			}
		}
		scroll();
        cachedWidth = newWidth;
	}
}

$(window).on('load', function(){
	cachedWidth = -1;
	resizeWindow();
	scroll();
	checkModifications();
	headerHeight = $('#main_header_logo').height();
	if($('#page_blog').length ==  1 || $('#page_accounttest').length == 1){
		headerHeight = parseInt($('#header_background_spacer').css('padding-top'));
		setScrollAt = headerHeight;
	}
});

$(function(){

	setCookie("last_cartoon", "", -1);

	$('body').addClass(getMobileOperatingSystem());

	document.addEventListener("touchstart", function(){}, true);

	$('#main_navigation_mobile_toggle').click(function(){
		mobileSidebarVisible = !mobileSidebarVisible;
		if(mobileSidebarVisible){
			saveScroll = $(window).scrollTop();
			$('body').addClass('showSidebar').css({'top':saveScroll+'px'});
		}else{
			$('body').removeClass('showSidebar');
			$(window).scrollTop(saveScroll);
			scroll(true);
		}
		return false;
	});

	$('.close-popup').click(function(){
		$('#popup_wrapper').fadeOut(250, function(){
			$('#popup_wrapper').removeAttr('class');
		});
		return false;
	});

	$('#sidebar_navigation a, .popup a, a.popup').click(function(e){
		if($(this).hasClass('extern') || $(this).parent().hasClass('extern'))
		  gtag('event', "Bannerklick", {'event_category': $(this).find('img').attr('data-id')});
		if($(this).parent().hasClass('popup') || $(this).hasClass('popup')){
			e.preventDefault();
			var page = $(this).parent().attr('data-popup');
			if(page == undefined)
				page = $(this).attr('data-popup');
			$.get(ajaxPath + 'ajax.php', {'action':'popup', 'popup': page}, function(html){
				if(html != ""){
					$('#popup_content').html(html);
					$('#popup_wrapper').fadeIn(250);
				}else{
					return true;
				}
			});
		}else{
			if(!$(this).parent().hasClass('extern')){
				$('#sidebar_navigation li').addClass('no_hover');
				$(this).parent().removeClass('no_hover').addClass('active');
				$('#sidebar_navigation li.no_effect').removeClass('no_hover');
			}
		}
	});

	$(window).resize(function(){
		resizeWindow();
	});
	resizeWindow();

	$(document).scroll(function(){
		scroll();
	});
	scroll();

	$('body').on('submit', '#newsletter_form', function(e){
		e.preventDefault();
		$('.newsletter-response-text').css({'opacity':'0'});
		$('#newsletter_form button').prop('disabled', true);
		$('#newsletter_form input').prop('readonly', true);
		$.post(ajaxPath + 'ajax.php', $('#newsletter_form').serialize(), function(data){
			if(data == 1){
				$('.newsletter-response-text').removeClass('error').html('<b>Dankeschön!</b><br/>Du erhälst in kürze eine Bestätigungsmail, um die Anmeldung abzuschließen.').stop().fadeTo(250,1);
				$('#newsletter_form').stop().fadeTo(250,0, function(){
					$('#newsletter_form').slideUp(250);
				});
			}else{
				$('.newsletter-response-text').addClass('error');
				$('.newsletter-response-text').html('<b>Hoppla!</b><br/>Es ist ein Fehler mit dieser E-Mail Adresse aufgetreten.');
				if(data == "bounced email address.")
					$('.newsletter-response-text').html('<b>Hoppla!</b><br/>Du bist bereits angemeldet, aber dir konnten in letzter Zeit keine E-Mails zugestellt werden. Bitte melde dich vom Newsletter ab und dann erneut an.');
				if(data == "already subscribed.")
					$('.newsletter-response-text').html('<b>Hoppla!</b><br/>Du bist bereits für den Newsletter angemeldet!');
				if(data == "invalid email address.")
					$('.newsletter-response-text').html('<b>Hoppla!</b><br/>Diese E-Mail Adresse ist nicht gültig.');
				$('.newsletter-response-text').stop().fadeTo(250,1);
				$('#newsletter_form button').prop('disabled', false);
				$('#newsletter_form input').prop('readonly', false);
			}
		});
	});

});
