(function (window, $) {
	var PrimeHeaderNav = null;
	PrimeHeaderNav = {
		init : function(){
			var funcThis = this,
				$header = $("#header"),
				$window = $(window),
				$naviTab = $("#navi_tab"),
				$navigation = $('.navigation');
			funcThis.bind();
			
			$window.on('scroll', function() {
				if($window.scrollTop() > 0){
					$header.addClass("scroll");
					$navigation.addClass("scroll");
			 		if($('#hamberger').hasClass('show')){
						$('.nav_dim').show();
					}
			  	}else{
					$header.removeClass("scroll");
					$navigation.removeClass("scroll");
			  		$('.nav_dim').attr('style', '');
			  	}
			});

			$window.on('scroll', function () {
				if (matchMedia("screen and (min-width: 1025px)").matches) {
					if ($window.scrollTop() > 400) {
						$naviTab.show();
					}
					else {
						$naviTab.hide();
					}
				} else {
					if ($window.scrollTop() > 262) {
						$naviTab.show();
					}
					else {
						$naviTab.hide();
					}
				}
			});
			
			$window.resize(function(e){
				if(matchMedia("screen and (min-width: 1025px)").matches){
					if($('#hamberger').hasClass('show')){
						funcThis.totalMenuClose();
					}
				}else{
					if($('#checkerboard').hasClass('show')){
						$('#checkerboard').removeClass("show");
						$(".menu_pop").hide();
					}
					if($('.user_link').css('display') == 'block'){
						$(".user_link").hide();
					}
				}
			});
			
			if($window.scrollTop() > 0){
				$header.addClass("scroll");
				$naviTab.addClass("scroll");

		  	}else{
				$header.removeClass("scroll");
				$naviTab.removeClass("scroll");
		  	}
		  	$header.fadeIn(100);
		},
        bind : function(){ // 이벤트 바인딩
        	var $hamberger = $('#hamberger'),
				$header = $("#header"),
				funcThis = this;

            // 전체메뉴버튼
			$('#hamberger, .nav_dim').on('click', function (e) {
				e.preventDefault();
				if (!$hamberger.hasClass("show")) {
					if (matchMedia("screen and (max-width: 1024px)").matches) {
						$hamberger.addClass("show");
						$('.total_menu').addClass("on");
						$('.dim').addClass("on");
						$('body').addClass("layer_on");
						noScrollRun();
						$('body').on('scroll touchmove mousewheel', function (event) {
							event.preventDefault();
							event.stopPropagation();
							return false;
						});
					} else {
						if (!$('.lang_list').hasClass('on')) {
							$header.addClass("active");// twkim 20210202 header 아래 영역 지우기
							$hamberger.addClass('show');
						}
					}
				} else {
					$hamberger.removeClass('show');
					funcThis.totalMenuClose();
					$header.removeClass("active"); //twkim 20210202 header 아래 영역 지우기
					//$('.nav_dim').hide();
				}
			});
			// lnb
			//$('.lnb > li').on('click',function(){
			//	if (matchMedia("screen and (max-width: 1024px)").matches) { 
			//		$(this).toggleClass("on");
			//		$(this).find(".sub_depth").stop().slideToggle();
			//	}
			//}); //sihong 20210528 사이드바 영역 고정을 위해 주석
			$(".lnb > li, .login_info").on('mouseenter focusin', function () {
				if (matchMedia("screen and (min-width: 1025px)").matches) {
					if (!$hamberger.hasClass('show') && !$('.lang_list').hasClass('on')) {
						$header.addClass("active"); //twkim 20210202 header 아래 영역 지우기
						$hamberger.addClass("show");
					}
				}
			});
			$(".lnb, .login_info").on('mouseleave focusout', function () {
				if (matchMedia("screen and (min-width: 1025px)").matches) {
					if ($hamberger.hasClass('show')) {
						$header.removeClass("active"); //twkim 20210202 header 아래 영역 지우기
						$hamberger.removeClass("show");
					}
				}
			});
			$('#checkerboard').on('click',function(){
				var $menuPop = $(".menu_pop"),
				     $this = $(this);
				$menuPop.toggle();
				$this.toggleClass("show");
				
				$(document).mouseup(function(e){
				    if (!$menuPop.is(e.target) && $menuPop.has(e.target).length === 0 && !$this.is(e.target) && $this.has(e.target).length === 0) {
				    	$menuPop.hide();
				    	$this.removeClass("show");
				    }
				});
			});

			$('#user_logout').on('click', function () {
                var $userLink = $(".user_link"),
                    $this = $(this);
                $userLink.toggle();

                $(document).mouseup(function (e) {
                    if (!$this.is(e.target) && $this.has(e.target).length === 0) {
                        $userLink.hide();
                    }
                });
            });
			
			$('#user_login').on('click',function(){
				//로그인 페이지 띄우기

				fnShowLoginLayer("init");
			})
			$(".ModifyState").on("click", function () {
				layerPopup("#outside_write_pop");
			});
        },
        totalMenuClose : function(){
        	$('body').removeClass("layer_on");
			noScrollClear();
			$('body').off('scroll touchmove mousewheel');
			$('#hamberger').removeClass('show');
			$('.total_menu').removeClass("on");
			$('.dim').removeClass("on");
			$('.total_menu .lnb > li').removeClass("on");
			$(".total_menu .sub_depth").attr('style', '');
			$("#header").removeClass("active");
			$('.nav_dim').attr('style', '');
        }
	};
	window.PrimeHeaderNav = PrimeHeaderNav;
	
	// delivery_step 각 항목의 .location 길이 통일
	var DeliveryStep = null;
	DeliveryStep = {
		init : function(){
			var funcThis = this;
			funcThis.locationH();
			$(window).resize(function(e){
				funcThis.locationH();
			});
		},
		locationH : function(){
			var $deliveryStep = $(".delivery_step"),
				 $deliveryStepItem = $(".delivery_step li");
			$deliveryStepItem.find(".location").attr("style", '');
			if (!matchMedia("screen and (max-width: 1024px)").matches) { 
				$deliveryStep.each(function(){
					var maxH = 0;
					$(this).find("li").each(function(){
						var h = $(this).find(".location").height();
						if(maxH < h){
							maxH = h;
						}
					});
					$(this).find(".location").css("height", maxH);
				});
			}
		}
	};
	window.DeliveryStep = DeliveryStep;
})(window, jQuery);	

$(function () {
	PrimeHeaderNav.init();

	$(document).on('click', '.file_view .file', function (e) {
		var $file = $(this).closest('.file_view'),
			$layer = $file.find('.file_layer_new');
		$('.file_view').not($file).find('.file_layer_new').hide();
		if ($layer.is(':visible')) {
			//$layer.hide();
		} else {
			$layer.show();
			if ($file.find('.scrollbar-outer').length) {
				$file.find('.scrollbar-outer').scrollbar();
			}

			$(document).mouseup(function (e) {
				if (!$file.is(e.target) && $file.has(e.target).length === 0) {
					$layer.hide();
				}
			});
		}
	});

	$(document).on('click', '.delivery_status .btn_close', function (e) {
		if ($('.delivery_status').hasClass('hide')) {
			$('.delivery_status').removeClass('hide');
			$(this).text('CLOSE');
		} else {
			$('.delivery_status').addClass('hide');
			$(this).text('OPEN');
		}
	})

	// TOP버튼
	$('.btn_top').on("click", function () {
		$('html, body').animate({ scrollTop: 0 }, 400);
		return false;
	});

	// 탭
	$('.tab > li').on("click", function () {
		var $panel = $('.tab_panel .panel').eq($(this).index());
		var $navi = $('.navi_tab .navi_list').eq($(this).index());
		$('.tab > li').removeClass("on");
		$('.tab.mo > li').removeClass("on");
		$('.navi_tab .navi_list').removeClass("on");
		$(this).addClass("on");
		$('.tab > li').eq($(this).index()).addClass("on");
		$('.tab.mo > li').eq($(this).index()).addClass("on");
		if ($(this).index() == 0 || $(this).index() == 1 || $(this).index() == 2) {
			$('.company').removeClass("on");
			$('.notice').removeClass("on");
        }
		if ($(this).index() == 3 || $(this).index() == 4) {
			$('.company').addClass("on");
			$('.notice').addClass("on");
		}
		$navi.addClass("on");
		$('.tab_panel .panel').hide();
		$panel.show();

		//twkim 20210517 - 메인 탭 클릭시 초기화 
		fnInitClickTab($panel);

		if ($('.slick-slider').length > 0) {
			$('.slick-slider').slick('setPosition');
		}
	});

	// Incoterms 탭
	$('.logi_table td a').on("click", function () {
		var $panel = $('.logi_panel').eq($(this).index());
		$('.logi_table td a').removeClass("on");
		$('.logi_panel').removeClass("on");
		$(this).addClass("on");
		$panel.addClass("on");
	})

	// 네비게이션 탭
	$('.navi_tab .navi_list').on("click", function () {

		//twkim - 메인 화면을 제외한 곳에서 '화물진행' , '수출이행' 클릭 시 메인으로 이동
		if (window.location.origin.replace(/\//gi, "") != window.location.href.replace(/\//gi, "")) {
			if ($(this).attr("id") == "UniCargo") {
				window.location.href = window.location.origin + "/?unipass=UniCargo";
			}
			else if ($(this).attr("id") == "UniOB") {
				window.location.href = window.location.origin + "/?unipass=UniOB";
            }
		}

		var $panel = $('.tab_panel .panel').eq($(this).index());
		var $tab_li = $('.tab > li').eq($(this).index());
		var windowWidth = $(window).width();
		$('.tab > li').removeClass("on");
		$('.navi_tab .navi_list').removeClass("on");
		if (windowWidth < 1025) { // sihong - 모바일일 때 탭 포커싱 바꾸기 추가
			if ($(this).index() > 1) {
				$('.tab.mo > li').eq($(this).index()).addClass("on");
				$(this).addClass("on");
			}
			else {
				$(this).addClass("on");
				$tab_li.addClass("on");
			}
		}
		else {
			$(this).addClass("on");
			$tab_li.addClass("on");
		}
		$('.tab_panel .panel').hide();
		$panel.show();

		if ($('.slick-slider').length > 0) {
			$('.slick-slider').slick('setPosition');
		}
	});

	// sub_location 드롭다운
	if ($(window).width() < 1025) {
		$('.sub_location .depth').on("click", function () {
			if (!$('.sub_location .depth').hasClass("on")) {
				$(this).addClass("on");
				$(this).find(".sub_list").stop().slideDown(300);
			} else {
				$(this).removeClass("on");
				$(this).find(".sub_list").stop().slideUp(300);
			}
		});
	} else {
		$('.sub_location .depth').hover(function () {
			$(this).addClass("on");
			$(this).find(".sub_list").stop().slideDown(300);
		}, function () {
			$(this).removeClass("on");
			$(this).find(".sub_list").stop().slideUp(300);
		});
    }

	// 달력플러그인 Type1 - 단독
	var calDate = $(".cal_date");
	if(calDate.length > 0) {
		calDate.datetimepicker({
			timepicker:false,
			format:'Y-m-d',
			/*startDate:'2018.02.01',*/
			onSelectDate:function(dp,$input){
		        var str = $input.val();
		        var m = str.substr(0,10);
		        calDate.find(".date").val(m);
			 }
		});
	}

	var calDate2 = $(".cal_date2");
	if (calDate2.length > 0) {
		calDate2.datetimepicker({
			timepicker: false,
			format: 'Y-m-d',
			/*startDate:'2018.02.01',*/
			onSelectDate: function (dp, $input) {
				var str = $input.val();
				var m = str.substr(0, 10);
				calDate2.find(".date").val(m);
			}
		});
	}
	
	// 달력플러그인 Type2 - 시작일~종료일
	// 달력플러그인
	var sDate = $(".start_date");
	sDate.datetimepicker({
		timepicker:false,
		format:'Y-m-d',
		onShow:function( ct ){
		   this.setOptions({
		    	maxDate: eDate.find(".date").val()? eDate.find(".date").val():false
		 	});
		},
		/*startDate:'2018.02.01',*/
		onSelectDate:function(dp,$input){
	        var str = $input.val();
	        var m = str.substr(0,10);
	        sDate.find(".date").val(m);
	   }
	});
	var eDate = $(".end_date");
	eDate.datetimepicker({
		timepicker:false,
		format:'Y-m-d',
		 onShow:function( ct ){
		   this.setOptions({
		    minDate:sDate.find(".date").val()?sDate.find(".date").val():false
		   });
		 },
		/*startDate:'2018.02.01',*/
		onSelectDate:function(dp,$input){
	        var str = $input.val();
	        var m = str.substr(0,10);
	        eDate.find(".date").val(m);
	    }
	});
	
	$(document).on("click", ".plus", function () {
		$relatedInfo = $(this).parents(".row").next("tr");

		if ($relatedInfo.css("display") == "none") {
			$relatedInfo.show();
		} else {
			$relatedInfo.hide();
		}
	});
	
	// 상세검색 펼치기
	$('.btn_detail').on("click", function() {
		if($('.search_detail').length > 0) {
			$(this).toggleClass("on");
			$('.search_detail').toggle();
		}
	});
	
	// input X버튼
	$(".int_box .delete").on("click",function(){
		var intBox = $(this).closest(".int_box");
		intBox.find("input[type='text']").val('').focus();
		intBox.find(".delete").hide();
		intBox.removeClass("has_del");
		intBox.find(".input_hidden").val("");		
	});
	$(".int_box input[type='text']").bind("change keyup input", function(event) {
		var intBox = $(this).closest(".int_box");
		intBox.addClass("has_del");
		intBox.find(".delete").toggle(Boolean($(this).val()));
	});
	
	// 스크롤바 커스텀
	if ($('.scrollbar').length > 0) {
		$('.scrollbar').slimScroll({
			height: '150px',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	if ($('.scrollbar_tbl').length > 0) {
		$('.scrollbar_tbl').slimScroll({
			height: '161px',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	if ($('.scrollbar_tbl2').length > 0) {
		$('.scrollbar_tbl2').slimScroll({
			height: '100%',
			width: 'auto',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	if ($('.scrollbar_layer').length > 0) {
		$('.scrollbar_layer').slimScroll({
			height: '100%',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	if ($('.scrollbar_surcharge').length > 0) {
		$('.scrollbar_surcharge').slimScroll({
			height: '290px',
			width: '100%',
			alwaysVisible: false,
			railVisible: true,
		});
	}
	if ($('.scrollbar_notice').length > 0) {
		$('.scrollbar_notice').slimScroll({
			height: '630px',
			width: '100%',
			color: '#005bac',
			alwaysVisible: false,
			railVisible: true,
        })
	}
	if (matchMedia("screen and (max-width: 1024px)").matches) {
		if ($('.scrollbar_booking').length > 0){
			$('.scrollbar_booking').slimScroll({
				height: '400px',
				width: '100%',
				alwaysVisible: true,
				railVisible: true,
			});
		}
	}
	else if ($('.scrollbar_booking').length > 0) {
		$('.scrollbar_booking').slimScroll({
			height: '578px',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	//if ($('.scrollbar_file').length > 0){
	//	$('.scrollbar_file').slimScroll({
	//		height: '96px',
	//		width: '100%',
	//		alwaysVisible: true,
	//		railVisible: false,
	//	});
	//}

	if ($('.scrollbar_bkfile').length > 0) {
		$('.scrollbar_bkfile').slimScroll({
			height: '72px',
			width: '100%',
			alwaysVisible: false,
			railVisible: false,
        })
    }

	//언어 설정 박스
	$('#hamberger2').on("click", function () {
		$('.lang_list').toggleClass("on");
	});
	$('.lang_list').on('mouseleave focusout', function () {
		$('.lang_list').removeClass("on");
    });

});


function increase(obj){
	var num = 0;
	var $input = $(obj).siblings(".int");
	if($input.val() != null && $input.val() != '' && $input.val() != 'undefined'){
		num = $input.val();
	}
	num = parseInt(num);
	$input.val(++num);
}
function decrease(obj){
	var num = 0;
	var $input = $(obj).siblings(".int");
	if($input.val() == null || $input.val() == '' || $input.val() == 'undefined'){
		return false;
	}else{
		num = $input.val();
	}
	num = parseInt(num);
	if(num > 1){
		$input.val(--num);
	}else{
		$input.val('');
	}
}

function selectPopOpen(obj){
	var $obj = $(obj),
	     $intBox = $(obj).closest(".int_box");
	    
	if($obj.css("display") == 'block'){
		$obj.hide();
	}else{
		if(matchMedia("screen and (min-width: 1025px)").matches){
			var wrapWidth = $("#wrap").outerWidth(),
			     intBoxLeft = $intBox.offset().left,
			     objWidth = $obj.outerWidth(true);
			if ((wrapWidth - intBoxLeft) < objWidth) {
				var left = (wrapWidth - intBoxLeft)-objWidth;
				$obj.css('left', left);
			}
		}else{
			$obj.attr('style', '');
		}
				
		$obj.show();
	}
	
	$(document).mouseup(function(e){
	    if (!$obj.is(e.target) &&$obj.has(e.target).length === 0 && !$intBox.is(e.target) && $intBox.has(e.target).length === 0) {
	    	$obj.hide();
	    }
	});
}
function selectPopClose(obj){
	$(obj).hide();
} 

function selectQuotePopOpen(obj) {
	var $obj = $(obj),
		$cell = $(obj).closest(".cell");

	if ($obj.css("display") == 'block') {
		$obj.hide();
	} else {
		if (matchMedia("screen and (min-width: 1025px)").matches) {
			var wrapWidth = $("#wrap").outerWidth(),
				cellLeft = $cell.offset().left,
				objWidth = $obj.outerWidth(true);
			if ((wrapWidth - cellLeft) < objWidth) {
				var left = (wrapWidth - cellLeft) - objWidth;
				$obj.css('left', left);
			}
		} else {
			$obj.attr('style', '');
		}

		$obj.show();
	}

	$(document).mouseup(function (e) {
		if (!$obj.is(e.target) && $obj.has(e.target).length === 0 && !$cell.is(e.target) && $cell.has(e.target).length === 0) {
			$obj.hide();
		}
	});
}
function selectQuotePopClose(obj) {
	$(obj).hide();
} 

$(window).resize(function() {
    if(this.resizeTO) {
        clearTimeout(this.resizeTO);
    }
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 0);
});
$(window).on('resizeEnd', function() {
	
});

$(window).resize(function(e){
	if($('.select_pop').css("display") == 'block'){
		$('.select_pop').attr('style', '');
		$('.select_pop').hide();
	}
});

/* 레이어팝업 */
var layerPopup = function(obj){
	var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
	if($glayer_zone.length===0){return;}
	$glayer_zone.hide();
	$("body").addClass("layer_on");   // ★본문스크롤 제거
	$laybtn.fadeIn(200);
	
	$glayer_zone.on("click",".close",function(e){
		var $this = $(this),
			t_layer = $this.parents(".layer_zone");
		$("body").removeClass("layer_on");   // ★본문스크롤 제거
		t_layer.fadeOut(300);
	});
	$glayer_zone.on("click",function(e){
		var $this = $(this),
			$t_item = $this.find(".layer_cont");
		if($(e.target).parents(".layer_cont").length>0){
			return;
		}
		$("body").removeClass("layer_on");  // ★본문스크롤 제거
		$this.fadeOut(300);
	});
};

/* 레이어 팝업 공백 클릭 시 닫히지 않게 하는 팝업*/
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
		////레이어 안에 레이어 팝업을 확인 눌렀을 때, Alert 레이어 팝업 hide 시키는 구문 
		if ($(e.target).attr("id") == "alert_layer01") {
			alert_layerClose("#layer_in_alert");
			return;
		}
	});
};

/* 레이어팝업 닫기 */
var layerClose = function(obj){
	var $laybtn = $(obj);

	//Twkim - B/L 조회 화면에서 Iframe 초기화가 되지 않아서 추가하였음.
	if (obj == "#Tracking_pop") {		
		$("#Tracking_pdfIframe").attr("src", "");
    }
	$("#" + closeVar).focus(); //focus
	$("body").removeClass("layer_on");  // ★본문스크롤 제거
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

function showSwitchOp(obj1, obj2) {
	$(obj1).show();
	$(obj2).hide();
} 

// 메인페이지 tab_area로 자동 스크롤
function fnMovePage(vId) {

	var offset = $("#" + vId).offset();

	//클릭시 window width가 몇인지 체크
	var windowWidth = $(window).width();
	var vHeaderHeight = $("#header").height();

	if (windowWidth < 1025) {
		$('html, body').animate({ scrollTop: offset.top - vHeaderHeight }, 350);
		$('.total_menu, .dim').fadeOut(300, function () {
			$('.total_menu, .dim').attr('style', '');
		});
	}
	else {
		$('html, body').animate({ scrollTop: offset.top - 71 }, 350);
	}

}

//스케줄 조회 plus 버튼 바꾸기
$(document).on("click", ".plus", function () {

	var checkPlusBtn = $(this);

	var tr = checkPlusBtn.closest('tr');
	if (!tr.hasClass("add_minus")) {
		tr.addClass("add_minus");
	} else {
		tr.removeClass("add_minus");
	}
});

//twkim / 20210517 탭 클릭 시 input 박스 및 데이터 초기화
function fnInitClickTab(vTab) {

	if (vTab.attr("id") == "seaSchedule")
	{
		_SEA_isSearch = false;
		$("table[name='Main_SEATable_List'] th button").removeClass();
		$("#SEA_Schedule_AREA").hide();
		$("#Btn_SEAScheduleMore").hide();
		$("#NoData_SEA")[0].innerHTML = "<span>원하시는 <strong>정보를 검색해보세요.</strong></span>";
		$("#NoData_SEA").show();
		$("#AC_SeaDeparture_Width").find(".delete").hide();
		$("#AC_SeaArrival_Width").find(".delete").hide();

		$("#input_SEA_ETD").val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2)); //ETD
		$("#input_SEA_Departure").val("");
		$("#input_SEA_POL").val("");
		$("#input_SEA_Arrival").val("");
		$("#input_SEA_POD").val("");
	}
	else if (vTab.attr("id") == "ferrySchedule")
	{
		_FERRY_isSearch = false;
		$("table[name='Main_FERRYTable_List'] th button").removeClass();
		$("#FERRY_Schedule_AREA").hide();
		$("#Btn_FERRYScheduleMore").hide();
		$("#NoData_FERRY")[0].innerHTML = "<span>원하시는 <strong>정보를 검색해보세요.</strong></span>";
		$("#NoData_FERRY").show();
		$("#AC_FerryDeparture_Width").find(".delete").hide();
		$("#AC_FerryArrival_Width").find(".delete").hide();				

		$('#input_FERRY_ETD').val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2));//ETD
		$("#input_FERRY_Departure").val("");
		$("#input_FERRY_POL").val("");
		$("#input_FERRY_Arrival").val("");
		$("#input_FERRY_POD").val("");
	}
	else if (vTab.attr("id") == "airSchedule")
	{
		_AIR_isSearch = false;
		$("table[name='Main_AIRTable_List'] th button").removeClass();
		$("#AIR_Schedule_AREA").hide();
		$("#Btn_AIRScheduleMore").hide();
		$("#NoData_AIR")[0].innerHTML = "<span>원하시는 <strong>정보를 검색해보세요.</strong></span>";
		$("#NoData_AIR").show();
		$("#AC_AirDeparture_Width").find(".delete").hide();
		$("#AC_AirArrival_Width").find(".delete").hide();			

		$("#input_AIR_ETD").val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2)); //ETD
		$("#input_AIR_Departure").val("");
		$("#input_AIR_POL").val("");
		$("#input_AIR_Arrival").val("");
		$("#input_AIR_POD").val("");
	}
	else if (vTab.attr("id") == "containerUnipass")
	{
		//fnInitUniPass();

		//화물진행정보 화면 가리기
		$("#UniCarogo_no_data").show();
		$("#div_UniCargoArea").show();
		$("#UniCargoList").hide();
		$("#div_UniCargoFirst2").hide();
		$("#div_UniCargoSecond").hide();
		$("#div_UniCargoSecond2").hide();
		$(".notice_box").hide();
		$(".cnt_box").hide();
		$("#UniCarogo_Result").hide();

		$("#input_UniCargoMtno").val("");
		$("#input_UniCargoMBL").val("");
		$("#input_UniCargoHBL").val("");
		$("#select_UniCargoYear option:eq(1)").prop("selected", true);
		$("#cargo01").prop("checked", true);
		$("div[name='Cargo_Express_Input_Box']").eq(0).css("display", "table");
		$("div[name='Cargo_Express_Input_Box']").eq(1).hide();
	}
	else if (vTab.attr("id") == "exportUnipass")
	{
		//fnInitUniPass();

		//수출이행내역 화면 가리기
		$("#UniOB_no_data").show();
		$("#div_UniOB_NumArea").hide();
		$("#div_UniOB_BLArea").hide();

		$("#input_UniOBnum").val("");
		$("#input_UniOBbl").val("");
		$("#export01").prop("checked", true);
		$("div[name='UniPass_Export_Box']").eq(0).css("display", "table");
		$("div[name='UniPass_Export_Box']").eq(1).hide();
	}
}