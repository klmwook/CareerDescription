////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vPage_Notice = 0;
var _vREQ_SVC = "";
var _ObjCheck = new Object();

////////////////////jquery event///////////////////////
$(function () {
	//메인 페이지 기본 변수 세팅
	$("#input_SEA_ETD").val(new Date().getFullYear() + "-" + _pad(new Date().getMonth() + 1, 2) + "-" + _pad(new Date().getDate(), 2)); //ETD
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
	} else if (_getParameter("tracking") != "") {
		$("#Pc_Input_Tracking").val(_getParameter("tracking"));
		$("#Mo_Input_Tracking").val(_getParameter("tracking"));

		fngetLayerTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");

		history.pushState(null, null, "/");
    }

	_fnSetUniYear("select_UniCargoYear");
	fnSetServiceType("#select_SEA_CntrType","SEA","SCH");
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
////////////////////////function///////////////////////
/////////////////function MakeList/////////////////////
