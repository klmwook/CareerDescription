cssVars({ }); // CSS 사용자 정의 속성지원을 위한 스크립트 선언 css-vars-ponyfill.min.js
(function (window,$){
	var OVERSEAS = null;
	OVERSEAS = {
		init : function(){
			var funcThis = this,
			     $window = $(window);
			funcThis.pluginFunc();
			funcThis.bind();
			
			$window.resize(function(e){
				if(matchMedia("screen and (min-width: 1025px)").matches){
					if($('#hamberger').hasClass('show')){
						$('#hamberger').removeClass('show');
						$('.total_menu').attr('style', '');
					}
				}
				
				if($('.select_pop').length && $('.select_pop').css("display") == 'block'){
					$('.select_pop').attr('style', '');
					$('.select_pop').hide();
				}
			});
		},
		pluginFunc : function(){ 
			if($('.scrollbar-outer').length) {
				$('.scrollbar-outer').scrollbar();
			}
			
			// 달력플러그인 Type1 - 단독
			var calDate = $(".cal_date");
			if(calDate.length > 0) {
				calDate.each(function (index, item) {
					var $this = $(this);
					$this.datetimepicker({
						timepicker:false,
						format:'Y-m-d',
						/*startDate:'2018.02.01',*/
						onSelectDate:function(dp,$input){
					        var str = $input.val();
					        var m = str.substr(0,10);
					        
					        $this.find(".date").val(m);
						 }
					});
				});
			}
			
			// 달력플러그인 Type2 - 시작일~종료일
			// 달력플러그인
			var sDate = $(".start_date");
			if(sDate.length > 0) {
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
			}
			var eDate = $(".end_date");
			if (eDate.length > 0) {
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
			}
		},
        bind : function(){ // 이벤트 바인딩
        	$(document).on('click', '.tbl_type1 .view', function (e) {
        		if($(this).css('display') != 'block'){
	        		var target = $(e.target),
					     targetparent = $(e.target.parentNode);
					if (target.is("a") || target.is("button") || targetparent.is("button")) {
					    return false;
					}
					var $this = $(this),
					     $relatedInfo = $("#"+$(this).data("row"));
					 if($relatedInfo.length > 0){
					     $(this).toggleClass("active");
					     $relatedInfo.toggle();
				     }
			     }
			}).on('click', '#hamberger, .total_menu', function (e) {
				var $hamberger = $('#hamberger');
				if(!$hamberger.hasClass("show")){
					$hamberger.addClass('show');
					$('.total_menu').fadeIn(200);
				}else{
					if($(e.target).parents(".menu_in").length>0){
						return;
					}
					$hamberger.removeClass('show');
					$('.total_menu').fadeOut(200, function(){
						$(this).attr('style', '');
					});
				}
			}).on('click', '.delivery_status .btn_close', function (e) {
				if($('.delivery_status').hasClass('hide')){
					$('.delivery_status').removeClass('hide');
					$(this).text('CLOSE');
				}else{
					$('.delivery_status').addClass('hide');
					$(this).text('OPEN');
				}
			}).on('click', '.tab button', function (e) {
				if($('.tab_panel').length > 0) {
					var $tab = $(this).closest('.tab'),
					     $tabLi = $(this).closest('li'),
					     $panel = $('.tab_panel .panel').eq($tabLi.index());
					$tab.find('li').removeClass("on");
					$tabLi.addClass("on");
					$('.tab_panel .panel').hide();
					$panel.show();
				}
			}).on('click', '.del', function (e) {
				var intBox = $(this).closest(".int_box");
				intBox.find("input[type='text']").val('').focus();
				intBox.find(".del").remove();
			}).on('click', '.file_view .file', function (e) {
				var $file = $(this).closest('.file_view'),
					 $layer = $file.find('.file_layer');
				$('.file_view').not($file).find('.file_layer').hide();
				if($layer.is(':visible')){
					$layer.hide();
				}else{
					$layer.show();
					if($file.find('.scrollbar-outer').length) {
						$file.find('.scrollbar-outer').scrollbar();
					}
					
					$(document).mouseup(function(e){
					    if (!$file.is(e.target) &&$file.has(e.target).length === 0) {
					    	$layer.hide();
					    }
					});
				}
			}).on('click', '#header .nav_toggle', function (e) {
				$('#header.sub').toggleClass('close');
			});
        	
        	$(".int_box input[type='text']").bind("change keyup input", function(e) {
				if($(e.target).parents(".main_search").length){
					var intBox = $(this).closest(".int_box");
					if(!intBox.find('.del').length){
						$(this).after('<button type="submit" class="btns del"><span class="blind">삭제</span></button>');
					}
					intBox.find(".del").toggle(Boolean($(this).val()));
				}
			});

			$(document).on("click", ".icn_direct", function () {
				$relatedInfo = $(this).parents(".row").next("tr");
				$icnTr = $(this).parents("tr");
				if ($relatedInfo.css("display") == "none") {
					$relatedInfo.show();
					$icnTr.addClass("active");
				} else {
					$relatedInfo.hide();
					$icnTr.removeClass("active");
				}
			});
			// 탭
			$('.tab > li').on("click", function () {
				var $panel = $('.tab_panel .panel').eq($(this).index());
				$('.tab > li').removeClass("on");
				$('.tab.mo > li').removeClass("on");
				$(this).addClass("on");
				$('.tab > li').eq($(this).index()).addClass("on");
				if ($(this).index() == 0 || $(this).index() == 1 || $(this).index() == 2) {
					$('.company').removeClass("on");
					$('.notice').removeClass("on");
				}
				if ($(this).index() == 3 || $(this).index() == 4) {
					$('.company').addClass("on");
					$('.notice').addClass("on");
				}
				$('.tab_panel .panel').hide();
				$panel.show();

				//twkim 20210517 - 메인 탭 클릭시 초기화 
				//fnInitClickTab($panel);

			});
        }
	};
	window.OVERSEAS = OVERSEAS;
})(window, jQuery);	

$(function(){
	OVERSEAS.init();

	// input X버튼
	$(".int_box .delete").on("click", function () {
		var intBox = $(this).closest(".int_box");
		intBox.find("input[type='text']").val('').focus();
		intBox.find(".delete").hide();
		intBox.removeClass("has_del");
		intBox.find(".input_hidden").val("");
	});
	$(".int_box input[type='text']").bind("change keyup input", function (event) {
		var intBox = $(this).closest(".int_box");
		intBox.addClass("has_del");
		intBox.find(".delete").toggle(Boolean($(this).val()));
	});
});

/* 레이어팝업 */
var layerPopup = function(obj){
	var $laybtn = $(obj),
		$glayer_zone = $(".layer_zone");
	if($glayer_zone.length===0){return;}
	$("body").addClass("layer_on");   
	$laybtn.fadeIn(200);
	
	$glayer_zone.on("click",".loginChk",function(e){
		var $this = $(this),
		$t_layer = $this.parents(".layer_zone");
		$("body").removeClass("layer_on");   
		$t_layer.fadeOut(300);
	});
};

/* 레이어팝업 닫기 */
var layerClose = function(obj){
	var $laybtn = $(obj);
	$("#" + closeVar).focus(); //focus
	$("body").removeClass("layer_on");  
	$laybtn.hide();
};

var selectOpen = function(obj){
	var $obj = $(obj);
	$obj.show();
	
	if($obj.find('.scrollbar-outer').length) {
		$obj.find('.scrollbar-outer').scrollbar();
	}
	
	$(document).mouseup(function(e){
	    if (!$obj.is(e.target) &&$obj.has(e.target).length === 0) {
	    	$obj.hide();
	    }
	});
};
var selectClose = function(obj1, obj2){
	$(obj1).closest('.int_box').find('input').val('').focus();
	$(obj2).hide();
};

var selectPopOpen = function(obj){
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
				
		$obj.fadeIn(100);
		
		if($obj.find('.scrollbar-outer').length) {
			$obj.find('.scrollbar-outer').scrollbar();
		}
	}
	
	$(document).mouseup(function(e){
	    if (!$obj.is(e.target) &&$obj.has(e.target).length === 0 && !$intBox.is(e.target) && $intBox.has(e.target).length === 0) {
	    	$obj.hide();
	    }
	});
	
	$(window).resize(function(e){
		if($obj.css("display") == 'block'){
			$obj.attr('style', '');
			$obj.hide();
		}
	});
};
var selectPopClose = function(obj){
	$(obj).hide();
};

var showRadioPanel = function(obj1, obj2){
	 $(obj1).show();
	 $(obj2).hide();
};

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