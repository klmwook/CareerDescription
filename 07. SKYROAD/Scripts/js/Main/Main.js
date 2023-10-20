////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vPage_Notice = 0;
var _vREQ_SVC = "";
var _ObjCheck = new Object();

////////////////////jquery event///////////////////////
$(function () {
	//메인 페이지 기본 변수 세팅
	$("#input_SEA_ETD").val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2)); //ETD
	$('#input_FERRY_ETD').val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2));//ETD
	$("#input_AIR_ETD").val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2)); //ETD

	//화물진행 , 수출이행 Get으로 데이터 보냈을 경우 
	if (_getParameter("unipass") == "UniCargo") {
	
		$(".panel").hide();
		$(".tab li[value=UniCargo]").addClass('on');
		$("#containerUnipass").show();
		
		fnMovePage('tab_area');
	
		history.pushState(null, null, "/");
	}
	else if (_getParameter("unipass") == "UniOB") {
	
		$(".panel").hide();
		$(".tab li[value=UniOB]").addClass('on');
		$("#exportUnipass").show();

		fnMovePage('tab_area');

		history.pushState(null, null, "/");
    }

	//$('.notice_list > li .notice_tit').on('click', function (e) {
	//	e.preventDefault();
	//	var $par = $(this).closest("li");
	//	var inx = $par.index();
	//	if ($par.hasClass("on") == true) {
	//		$('.notice_list > li:eq(' + inx + ')').find(".notice_cont").stop().slideUp();
	//		$par.removeClass("on");
	//	} else {
	//		if ($('.notice_list > li').hasClass("on")) {
	//			$('.notice_list > li').removeClass("on");
	//			$('.notice_list > li').find(".notice_cont").slideUp();
    //        }
	//		$('.notice_list > li:eq(' + inx + ')').addClass("on");
	//		$par.find(".notice_cont").slideDown();
	//	}
	//});

	var $visualSlide = $('.visual_slide');
	if ($visualSlide.length > 0) {
		var itemBgUrl = $(".visual_slide .item:eq(0) .bg").css('background-image').match(/^url\("?(.+?)"?\)$/)[1];
		$('<img>').attr('src', itemBgUrl).one('load', function () {
			$(".visual_slide").addClass("load");
			$visualSlide.on('init', function (event, slick) {

				var $item = $visualSlide.find(".item");
				var $itemActive = $visualSlide.find(".slick-active");
				$item.removeClass("on");
				$item.find(".txt01").removeClass('fadeInDown');
				$item.find(".txt02").removeClass('fadeInUp');
				$itemActive.addClass("on");
				$itemActive.find(".txt01").addClass('fadeInDown');
				$itemActive.find(".txt02").addClass('fadeInUp');

				$(".slick-dots").append("<button type='button' class='pause'>정지</button><button type='button' class='play'>재생</button>");

			});
			$visualSlide.slick({
				dots: false,
				infinite: true,
				speed: 0,
				fade: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: 4000,
				pauseOnHover: false
			});
			$visualSlide.on('afterChange', function (event, slick, currentSlide, nextSlide) {
				var $item = $visualSlide.find(".item");
				var $itemActive = $visualSlide.find(".slick-active");
				$item.removeClass("on");
				$itemActive.addClass("on");
			});
		});

		$(document).on("click", ".pause", function (event) {
			$visualSlide.slick('slickPause');
			$(this).hide();
			$('.play').show();
		});
		$(document).on("click", ".play", function (event) {
			$visualSlide.slick('slickPlay');
			$(this).hide();
			$('.pause').show();
		});
		$(document).on("click", ".slick-dots > li", function (event) {
			$visualSlide.slick('slickPause');
			var slickTimer = setTimeout(function () {
				$visualSlide.slick('slickPlay');
				clearTimeout(slickTimer);
			}, 1000);
		});
	}

	//공지사항 데이터 뿌리기
	//fnGetNoticeList();

	_fnSetUniYear("select_UniCargoYear");

});

//자동완성 브라우저 변경 시 보이지 않게
$(window).resize(function () {
	$(".ui-menu").hide();
});

//화물진행정보 M B/L-H B/L, 화물관리번호 인풋박스 보여주기
$(document).on("click", "input[name='cargo']", function () {

	if ($(this).attr("id") == "cargo01") {
		$("div[name='Cargo_Express_Input_Box']").eq(0).show();
		$("div[name='Cargo_Express_Input_Box']").eq(1).hide();
	} else if ($(this).attr("id") == "cargo02") {
		$("div[name='Cargo_Express_Input_Box']").eq(0).hide();
		$("div[name='Cargo_Express_Input_Box']").eq(1).show();
	}

});

//수출이행내역 수출신고번호, B/L 인풋박스 보여주기
$(document).on("click", "input[name='export']", function () {

	if ($(this).attr("id") == "export01") {
		$("div[name='UniPass_Export_Box']").eq(0).show();
		$("div[name='UniPass_Export_Box']").eq(1).hide();
	} else if ($(this).attr("id") == "export02") {
		$("div[name='UniPass_Export_Box']").eq(0).hide();
		$("div[name='UniPass_Export_Box']").eq(1).show();
	}
});

//공지사항 클릭시 내용 show / hide 이벤트
$(document).on("click", ".notice_tit", function () {
	var $par = $(this).closest("li");
	var inx = $par.index();
	if ($par.hasClass("on") == true) {
		$('.notice_list > li:eq(' + inx + ')').find(".notice_cont").stop().slideUp();
		$par.removeClass("on");
	} else {
		if ($('.notice_list > li').hasClass("on")) {
			$('.notice_list > li').removeClass("on");
			$('.notice_list > li').find(".notice_cont").slideUp();
		}
		$('.notice_list > li:eq(' + inx + ')').addClass("on");
		$par.find(".notice_cont").slideDown();
	}
});

//이미지 클릭 시 파일 다운로드
$(document).on("click", ".notice_file li", function () {
	$(this).find("a").get(0).click();
});

////////////////////////function///////////////////////

//공지사항 리스트 가져오기
function fnGetNoticeList()
{
	var objJsonData = new Object();

	//선사인지 훼리인지 체크
	if (_vPage_Notice == 0) {
		objJsonData.PAGE = "1";
	} else {
		objJsonData.PAGE = _vPage_Notice;
    }

	$.ajax({
		type: "POST",
		url: "/Home/fnGetNoticeList",
		async: true,
		dataType: "json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeNoticeList(result);				
			fnNoticePaging(JSON.parse(result).NoticeList[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
		}, error: function (xhr, status, error) {
			$("#ProgressBar_Loading").hide(); //프로그래스 바
			_fnAlertMsg("담당자에게 문의 하세요.");
			console.log(error);
		}
	});
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnNoticePaging(totalData, dataPerPage, pageCount, currentPage) {
	var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
	var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
	if (pageCount > totalPage) pageCount = totalPage;
	var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
	if (last > totalPage) last = totalPage;
	var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
	var next = last + 1;
	var prev = first - 1;

	$("#notice_paging_list").empty();

	var prevPage;
	var nextPage;
	if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
	if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

	var vHTML = "";

	vHTML += " <a href=\"javascript:void(0)\" onclick=\"fnNoticeGoPage(1)\" class=\"page first\"> ";
	vHTML += " 	<span class=\"blind\">처음페이지로 가기</span> ";
	vHTML += " </a> ";
	vHTML += " <a href=\"javascript:void(0)\" onclick=\"fnNoticeGoPage(" + prevPage + ")\" class=\"page prev\"> ";
	vHTML += " 	<span class=\"blind\">이전페이지로 가기</span> ";
	vHTML += " </a> ";

	for (var i = first; i <= last; i++) {
		if (i == currentPage) {
			vHTML += " <span class=\"number\"><span class=\"on\">" + i + "</span></span> ";
		} else {
			vHTML += " <span class=\"number\"><span onclick=\"fnNoticeGoPage(" + i + ")\">" + i + "</span></span> ";
		}
	}

	vHTML += " <a href=\"javascript:void(0)\" onclick=\"fnNoticeGoPage(" + nextPage + ")\" class=\"page next\"> ";
	vHTML += " 	<span class=\"blind\">다음페이지로 가기</span> ";
	vHTML += " </a> ";
	vHTML += " <a href=\"javascript:void(0)\" onclick=\"fnNoticeGoPage(" + totalPage + ")\" class=\"page last\"> ";
	vHTML += " 	<span class=\"blind\">마지막페이지로 가기</span> ";
	vHTML += " </a> ";

	$("#notice_paging_list").append(vHTML);    // 페이지 목록 생성		
}

function fnNoticeGoPage(vPage) {
	_vPage_Notice = vPage;
	fnGetNoticeList();
}
/////////////////function MakeList/////////////////////
function fnMakeNoticeList(vJsonData) {

	var vHTML = "";
	var vResult = "";

	try {
		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
			vResult = JSON.parse(vJsonData).NoticeList;
						
			$.each(vResult, function (i) {
				vHTML += " <li> ";
				vHTML += " 	<a href=\"javascript:void(0)\" class=\"notice_tit\"> ";
				vHTML += " 		<span class=\"icn q\">" + _fnToNull(vResult[i]["REGDT"]) + "</span> ";
				vHTML += " 		" + _fnToNull(vResult[i]["TITLE"])+"  ";
				vHTML += " 	</a> ";
				vHTML += " 	<div class=\"notice_cont\"> ";
				vHTML += " 		<div class=\"scrollbar_notice\"> ";
				vHTML += " 			<div class=\"inner\"> " + _fnToNull(vResult[i]["CONTENT"]) +" ";
				vHTML += " 			</div> ";
				vHTML += " 		</div> ";

				if (_fnToNull(vResult[i]["FILE_NAME"]) != "") {
					vHTML += " 		<div class=\"notice_file\"> ";
					vHTML += " 			<ul> ";
					

					//파일이 있는 경우 그리기
					if (_fnToNull(vResult[i]["FILE_NAME"]) != "") {
						vHTML += " 				<li> ";
						vHTML += "					<a href=\"/HP_File/NoticeDownload?filename=" + _fnToNull(vResult[i]["FILE_NAME"]) + "&rFilename=" + _fnToNull(vResult[i]["FILE"])+"\"> ";
						vHTML += "						<span>" + _fnToNull(vResult[i]["FILE_NAME"]) + "</span> ";
						vHTML += "					</a> ";
						vHTML += "				</li> ";
					}

					if (_fnToNull(vResult[i]["FILE1_NAME"]) != "") {
						vHTML += " 				<li> ";
						vHTML += "					<a href=\"/HP_File/NoticeDownload?filename=" + _fnToNull(vResult[i]["FILE1_NAME"]) + "&rFilename=" + _fnToNull(vResult[i]["FILE1"]) + "\"> ";
						vHTML += "						<span>" + _fnToNull(vResult[i]["FILE1_NAME"]) + "</span> ";
						vHTML += "					</a> ";
						vHTML += "				</li> ";
					}

					if (_fnToNull(vResult[i]["FILE2_NAME"]) != "") {
						vHTML += " 				<li> ";
						vHTML += "					<a href=\"/HP_File/NoticeDownload?filename=" + _fnToNull(vResult[i]["FILE2_NAME"]) + "&rFilename=" + _fnToNull(vResult[i]["FILE2"]) + "\"> ";
						vHTML += "						<span>" + _fnToNull(vResult[i]["FILE2_NAME"]) + "</span> ";
						vHTML += "					</a> ";
						vHTML += "				</li> ";
					}
					
					vHTML += " 			</ul> ";
					vHTML += " 		</div> ";
                }

				vHTML += " 	</div> ";
				vHTML += " </li> ";
			});

		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
			//데이터 검색 오류
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
			//데이터 검색 오류
		}

		//데이터 넣기
		$("#notice_list")[0].innerHTML = vHTML;
	}
	catch (err)
	{
		console.log(err);
    }
}