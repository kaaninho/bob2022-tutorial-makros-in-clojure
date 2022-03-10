var noSubscription = false;
if (window.location.href.indexOf("noSubscription") > -1)
	noSubscription = true;

$(function(){
	var episodeCount = 6;
	var episodeTimer = null;
	var popupCount = 0;
	var currentEpisode = 1+Math.floor(Math.random()*6);
	var redirectTo = "";
	var triggered = false;
	if(noSubscription)
		displaySteadyPopup("steadyPopup");

	$('.thumbscroller_navigation').click(function(){
		popupCount++;
		checkPopup();
	});
	$('#blog_pagination a').click(function(){
		popupCount++;
		redirectTo = $(this).attr('href');
		if(checkPopup())
			return false;
	});
	$('.podcast_episode').click(function(){
		popupCount++;
		checkPopup();
	});
	function checkPopup(){
		if(getCookie("steadyPopup") != 1 && popupCount > 0 && $('#main_navigation_mobile_toggle').is(':visible')){
			displaySteadyPopup("steadyPopup steadyPopupAction");
			return true;
		}
		return false;
	}
	function displaySteadyPopup(extraClass){
		var image_extra = "";
		if(extraClass.indexOf("steadyPopupAction") > -1)
			image_extra = "_black";
		var text = "<div id=\"newsletter_area\"><p class=\"kgn\" style=\"max-width: 100%;\">Wenn du Unterstützer wirst<span class=\"kommata\">,</span> hilfst Du mir<span class=\"kommata\">,</span> weiterhin Cartoons<span class=\"kommata\">,</span> Videos und Podcasts zu produzieren. Außerdem bekommst Du<span class=\"kommata\" style=\"position: relative; top: -2px;\">:</span></p><div class=\"supporterinfo\"><div><img src=\""+ajaxPath+"data/media/goodie_bonuspanel"+image_extra+".png\"></div><div><img src=\""+ajaxPath+"data/media/supporterepisode_folge"+currentEpisode+".png\" class=\"episodeImage\" style=\"z-index: 1\"><img src=\""+ajaxPath+"data/media/supporterepisode_folge"+currentEpisode+".png\" class=\"episodeImage\" style=\"z-index: 2\"><img src=\""+ajaxPath+"data/media/goodie_tv"+image_extra+".png\" style=\"z-index: 5;\"></div></div><p style=\"text-align: center\"><a href=\"https://steadyhq.com/de/joscha\" target=\"_blank\" class=\"supporterinfo_button\">&nbsp;</a></p></div>";
		$('#popup_content').html(text);
		if($('#main_navigation_mobile_toggle').is(':visible') && extraClass.indexOf("steadyPopupAction") > -1){
			$('#popup_content #newsletter_area').prepend($('#sidebar_navigation li.banner a'));
			$('#popup_content #newsletter_area a:first').addClass('bannerImage');
		}
		triggered = true;
		$('#popup_wrapper').addClass(extraClass).fadeIn(250);
		setCookie("steadyPopup", 1, 0.5);
		episodetimer = window.setInterval(function(){
			toggleEpisode();
		},5000);
	}
	$('.close-popup').click(function(){
		$('#sidebar_navigation li.banner').append($('#popup_content #newsletter_area a.bannerImage'));
		if(redirectTo != "")
			window.location.href = redirectTo;
		episodeTimer = null;
	});
	function toggleEpisode(){
		var img = new Image();
		img.onload = function(id){
			$('.episodeImage:nth-child(1)').attr('src', img.src);
			$('.episodeImage:nth-child(2)').fadeOut(500, function(){
			$(this).attr('src', img.src).show();
			});
		};
		img.src = ajaxPath+'data/media/supporterepisode_folge'+currentEpisode+'.png';
		currentEpisode++;
		if(currentEpisode > 6)
			currentEpisode = 1;
	}
})