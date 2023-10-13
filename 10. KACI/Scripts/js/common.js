$(function () {
    // 전체메뉴버튼
    //$('#hamberger, .total_menu .dim, .total_menu .close').on('click', function (e) {
    //    e.preventDefault();
    //    if ($('.total_menu').css("display") != 'block') {
    //        $('.total_menu, .dim').show();
    //        if (matchMedia("screen and (max-width: 767px)").matches) {
    //            $('body').addClass("layer_on");
    //            noScrollRun();
    //            $('body').on('scroll touchmove mousewheel', function (event) {
    //                event.preventDefault();
    //                event.stopPropagation();
    //                return false;
    //            });
    //            $(".total_nav").stop().animate({ right: 0 }, 200);
    //        } else {
    //            $(".total_nav").stop().animate({ top: 0, opacity: 1 }, 300);
    //        }
    //    } else {
    //        if (matchMedia("screen and (max-width: 767px)").matches) {
    //            $(".total_nav").stop().animate({ right: "-88%" }, 100, function () {
    //                totalMenuClose();
    //                $('.total_menu, .dim').fadeOut(300);
    //            });
    //        } else {
    //            $(".total_nav").stop().animate({ top: "-100%", opacity: 0 }, 100, function () {
    //                totalMenuClose();
    //                $('.total_menu, .dim').fadeOut(300);
    //            });
    //        }
    //    }
    //});
    // lnb
//    $('.lnb > li').on('click', function () {
//        if (matchMedia("screen and (max-width: 767px)").matches) {
////            $('.lnb > li').removeClass("active");
////            $('.lnb > li').find(".sub_depth").stop().slideUp();
////            $(this).toggleClass("active");
////            $(this).find(".sub_depth").stop().slideDown();

//            $(this).toggleClass("on");
//            $(this).find(".sub_depth").stop().slideToggle();
//        }
//    });

//    $(".lnb > li").on('mouseenter focusin', function () {
//        $('.lnb .sub_depth, .sub_dim').stop().fadeIn(100);
//    });
//    $("#header").on('mouseleave focusout', function () {
//        $('.lnb .sub_depth, .sub_dim').stop().fadeOut(300);
//    });

    // TOP버튼
    $('.btn_top').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
        return false;
    });

    /* 스케쥴목록 info보기
    $(document).on('click', '.schedule_list .tit_row, .schedule_list .logo_img, .schedule_list .logo_img + .cell', function (e) {
        var $etcInfo = $(this).closest(".box_in").find('.etc_info');
        if (!$etcInfo.hasClass("show")) {
            $etcInfo.toggle();
        }
    });*/

    // 달력플러그인
    //var sDate = $("#start_date");
    //sDate.datetimepicker({
    //    timepicker: false,
    //    format: 'Y-m-d',
    //    onShow: function (ct) {
    //        this.setOptions({
    //            maxDate: eDate.find(".date").val() ? eDate.find(".date").val() : false
    //        });
    //    },
    //    /*startDate:'2018.02.01',*/
    //    onSelectDate: function (dp, $input) {
    //        var str = $input.val();
    //        var m = str.substr(0, 10);
    //        sDate.find(".date").val(m);
    //    }
    //});

    //var eDate = $("#end_date");
    //eDate.datetimepicker({
    //    timepicker: false,
    //    format: 'Y-m-d',
    //    onShow: function (ct) {
    //        this.setOptions({
    //            minDate: sDate.find(".date").val() ? sDate.find(".date").val() : false
    //        });
    //    },
    //    /*startDate:'2018.02.01',*/
    //    onSelectDate: function (dp, $input) {
    //        var str = $input.val();
    //        var m = str.substr(0, 10);
    //        eDate.find(".date").val(m);
    //    }
    //});

    //var msgStartDate = $("#msg_start_date");
    //msgStartDate.datetimepicker({
    //    timepicker: false,
    //    format: 'Y-m-d',
    //    onShow: function (ct) {
    //        this.setOptions({
    //            maxDate: msgEenDate.find(".date").val() ? msgEenDate.find(".date").val() : false
    //        });
    //    },
    //    /*startDate:'2018.02.01',*/
    //    onSelectDate: function (dp, $input) {
    //        var str = $input.val();
    //        var m = str.substr(0, 10);
    //        msgStartDate.find(".date").val(m);
    //    }
    //});
    //var msgEenDate = $("#msg_end_date");
    //msgEenDate.datetimepicker({
    //    timepicker: false,
    //    format: 'Y-m-d',
    //    onShow: function (ct) {
    //        this.setOptions({
    //            minDate: msgStartDate.find(".date").val() ? msgStartDate.find(".date").val() : false
    //        });
    //    },
    //    /*startDate:'2018.02.01',*/
    //    onSelectDate: function (dp, $input) {
    //        var str = $input.val();
    //        var m = str.substr(0, 10);
    //        msgEenDate.find(".date").val(m);
    //    }
    //});

    // 개발진행시 수정필요 (화면확인용)
    //$(".location").focus(function () {
    //    var $intZone = $(this).closest(".int_box");
    //    $intZone.find(".auto_list").addClass("active");

    //    $(document).mouseup(function (e) {
    //        if (!$intZone.is(e.target) && $intZone.has(e.target).length === 0) {
    //            $intZone.find(".auto_list").removeClass("active");
    //        }
    //    });
    //});

    //$('.btn_toggle').on("click", function () {
    //    $(this).toggleClass("on");
    //    var $parent = $(this).closest("div");
    //    $parent.find(".toggle_panel").toggle();
    //});

    //$('.btns.bell, .notice_msg .close').on("click", function () {
    //    $(".btns.bell").toggleClass("active");
    //    $(".notice_msg").toggle();
    //});

    //$('.toast_box .close').on("click", function () {
    //    var $parent = $(this).closest(".toast_box");
    //    $parent.hide()
    //});

    // 탭
    $('.tab > li').on("click", function () {
        var $panel = $('.tab_panel .panel').eq($(this).index());
        var $tbl_panel = $('.CustomerReg_table .panel_tbl').eq($(this).index());
        $('.tab > li').removeClass("on");
        $(this).addClass("on");
        $('.tab > li').eq($(this).index()).addClass("on");
        $('.tab_panel .panel').hide();
        //$('.CustomerReg_table .panel_tbl').hide();
        $panel.show();
        $tbl_panel.show();
    });

});

function totalMenuClose(){
	$('body').removeClass("layer_on");
	noScrollClear();
	$('body').off('scroll touchmove mousewheel');
	$(".total_nav").removeAttr("style"); 
}


//$('.total_menu .lnb > li').on('click', function () {
//    if (matchMedia("screen and (max-width: 767px)").matches) {
//        //$('.total_menu .nav > li').removeClass("on"); 
//        //$('.total_menu .nav > li').find(".sub_depth").stop().slideUp(); 
//        $(this).toggleClass("on");
//        $(this).find(".sub_depth").stop().slideToggle();
//    }
//}); 

$(window).resize(function(e){
	if($('.total_menu').css("display") == 'block'){
		totalMenuClose();
		$('.total_menu, .dim').hide();
	}
});

//테스트
function _fnAlertMsg(msg, id) {
    $(".alert_cont .inner").html("");
    $(".alert_cont .inner").html(msg);
    if (_fnToNull(id) != "") {
        layerPopup('#alert01', "", true, id);
    } else {
        layerPopup('#alert01', "");
    }
    $("#alert_close").focus();
}

/* 레이어팝업 */
var layerPopup = function (obj, target, bool,id) {
    var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
    $focus = target;
    if ($glayer_zone.length === 0) { return; }
    $glayer_zone.hide();
    $("body").addClass("layer_on");
    $laybtn.fadeIn(200);

    $glayer_zone.on("click", ".close", function (e) {
        var $this = $(this),
			t_layer = $this.parents(".layer_zone");
        $("body").removeClass("layer_on");
        t_layer.fadeOut(300);
    });

    $glayer_zone.on("click", function (e) {
        if (bool != false) {
            var $this = $(this),
                $t_item = $this.find(".layer_cont");
            if (id != undefined) {
                $("#" + id).focus();
            }
            if ($(e.target).parents(".layer_cont").length > 0) {
                return;
            }
            $("body").removeClass("layer_on");
            $this.fadeOut(300);
        }
    });

};

var layerPopup2 = function (obj, target) {
    var $laybtn = $(obj),
        $glayer_zone = $(".layer_zone");
    $focus = target;
    if ($glayer_zone.length === 0) { return; }
    //$glayer_zone.hide(); 
    $("body").addClass("layer_on");   // ★본문스크롤 제거 
    $laybtn.fadeIn(200);
    $laybtn.attr("tabindex", "0").focus();
    $glayer_zone.on("click", function (e) {
        if ($(e.target).attr("id") == "alert_layer01") {
            alert_layerClose($laybtn);
            return;
        }
    });
}; 

var alert_layerClose = function (obj) {
    var $laybtn = $(obj);
    $laybtn.hide();
}; 

$(window).scroll(function () {
    goSchedule();
});
function goSchedule() {
    if ($(this).scrollTop() > 130) {
        $('.sched_wrap').fadeIn(500);
    } else {
        $('.sched_wrap').fadeOut(500);
    }
}

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
    	return false;
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