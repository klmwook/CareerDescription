$(function () {
	$('#hamberger, .total_menu .dim, .total_menu .close').on('click',function(e){
		e.preventDefault();
		if (matchMedia("screen and (max-width: 767px)").matches) { // 모바일

			if ($('.total_menu').css("display") != 'block') {
				$('.total_menu, .dim').show();
				$('body').addClass("layer_on");

				noScrollRun();

				$('body').on('scroll touchmove mousewheel', function (event) { 
					event.preventDefault();     

					event.stopPropagation();    
					return false; 
				});

				$(".total_nav").stop().animate({right: 0}, 300);

			}else{
				$(".total_nav").stop().animate({right: "-78%"}, 200, function(){
					$('body').removeClass("layer_on");
					noScrollClear();
					$('body').off('scroll touchmove mousewheel');
					$('.total_menu, .dim').fadeOut(300);
				});
			}
		}else{
			if(!$('#header').hasClass("active")){
				$('#header').addClass("active");
				$('#hamberger').addClass("show");
				$('#navi_bg').stop().slideDown();
				$('.lnb .depth').stop().slideDown();
				$("#header .inner").css("background", "rgb(255,255,255)"); /*header 마스크 */
			}else{
				$('#navi_bg').stop().slideUp(200);
				$('.lnb .depth').stop().slideUp(200);		

				$('#header').delay(100).queue(function(next){
				    $(this).removeClass("active");
				    next();
				});			
				
				$('#hamberger').removeClass("show");
				$("#header .inner").css("background", "rgba(33,33,33,0.2)"); /*header 마스크 */

			}
		}
	});	

	$("#header .lnb").on('mouseenter focusin', function(){
		if (!matchMedia("screen and (max-width: 767px)").matches) { 
			if(!$('#header').hasClass("active")){
				$('#header').addClass("active");
				$('#hamberger').addClass("show");
				$('.lnb').addClass("active");
				$('#navi_bg').stop().slideDown();
				$('.lnb .depth').stop().slideDown();
				$("#header .inner").css("background", "rgb(255,255,255)"); /*header 마스크 */
			}
		}
	});

	$("#header").on('mouseleave focusout', function(){
		if (!matchMedia("screen and (max-width: 767px)").matches) { 
			if($('#header').hasClass("active")){
				$('#navi_bg').stop().slideUp(200);
				$('.lnb .depth').stop().slideUp(200);
				
				$('#header').delay(100).queue(function(next){
				    $(this).removeClass("active");
				    next();
				});
				
				$('#hamberger').removeClass("show");
				$("#header .inner").css("background", "rgba(33,33,33,0.2)"); /*header 마스크 */
			}
		}
	});
	

	$('.location .depth').hover(function() {
	  $(this).addClass("on");
	  $(this).find(".sub_list").stop().slideDown(300);
	}, function(){
	  $(this).removeClass("on");
	  $(this).find(".sub_list").stop().slideUp(300);
	});

	$('#tab > li').on("click", function() {
		$('#tab > li').removeClass("on");
		$(".tab_panel").find(".panel").hide();
		$(this).addClass("on");
		$(".tab_panel").find(".panel").eq($(this).index()).show();
	});

	$('.top').on("click", function() {
		$('html, body').animate({ scrollTop : 0 }, 400);
		return false;
	});

	$('.btn_scroll').click(function(e){
		e.preventDefault();
		$('html, body').animate({scrollTop: $(this.hash).offset().top}, 500);
	});	

	$(window).resize(function(){
		if($('#header').hasClass("active")){
	    	$('#header').removeClass("active");
	    	$('#hamberger').removeClass("show");
			$('#navi_bg').stop().slideUp(200);
			$('.lnb .depth').stop().slideUp(200);
		}		

		if($('.total_menu').css("display") == 'block'){
			$(".total_nav").stop().animate({right: "-78%"}, 200, function(){
				$('body').removeClass("layer_on");
				noScrollClear();
				$('body').off('scroll touchmove mousewheel');
				$('.total_menu, .dim').fadeOut(300);
			});
		}
	}); 
});

$(window).scroll(function(){
	goSchedule();
});

function goSchedule(){
	if($(this).scrollTop() > 130){
		$('.sched_wrap').fadeIn(500);
	}else{
		$('.sched_wrap').fadeOut(500);
	}
}

function lock(v1, v2){
	$(".lnb > li").eq(v1).addClass("on");
}

/* 레이어팝업 */
var layerPopup = function(obj){
	var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
	if ($glayer_zone.length === 0) { return; }

	$glayer_zone.hide();
	$("body").addClass("layer_on");
	$laybtn.fadeIn(200);	

	$glayer_zone.on("click",".close",function(e){
		var $this = $(this),
			t_layer = $this.parents(".layer_zone");
		$("body").removeClass("layer_on");
		t_layer.fadeOut(300);
	});

	$glayer_zone.on("click",function(e){
		var $this = $(this),
			$t_item = $this.find(".layer_cont");
		if($(e.target).parents(".layer_cont").length>0){
			return;
		}

		$("body").removeClass("layer_on");
		$this.fadeOut(300);
	});
};

/* 레이어팝업 닫기 */
var layerClose = function(obj){
	var $laybtn = $(obj);
	$("body").removeClass("layer_on");
	$laybtn.hide();
};

function BrowserVersionCheck() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("kakaotalk") != -1 || agent.indexOf("iphone") != -1 || agent.indexOf("ipad") != -1 || agent.indexOf("ipod") != -1 || agent.indexOf("safari") != -1) {
		return true;
    }else{
    	return false
    }
}

var posY;

function noScrollRun() {
	if(BrowserVersionCheck()){
	    posY = $(window).scrollTop();
	    $('body').addClass('noscroll');
	    $("#wrap").css("top",-posY);
   }
}

function noScrollClear() {
	if(BrowserVersionCheck()){
	    $('body').removeClass('noscroll');
	    posY = $(window).scrollTop(posY);
	    $("#wrap").attr("style","");
	}
}