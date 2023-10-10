////////////////////전역 변수//////////////////////////
//alert($("input[name='date_interval']:checked").val()); 체크박스 체크
var _vPage = 0;
var _vREQ_SVC = "";
var _Carr = "";
var _ObjCheck = new Object();
var _ObjNowSchedule = new Object();
var _OrderBy = "";
var _Sort = "";
var _isSearch = false;

////////////////////jquery event///////////////////////
$(function () {	

	//뒤로가기 이벤트로 왔을 경우 이벤트
	if (event.persisted || (window.performance && window.performance.navigation.type == 2) || event.originalEvent && event.originalEvent.persisted) {
		if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "SCHEDULE_SEA") {
			/*$("#select_SEA_CntrType").val(_fnToNull(sessionStorage.getItem("CNTR_TYPE"))).prop('checked', true);*/
			$("#input_SEA_ETD").val(_fnToNull(sessionStorage.getItem("ETD"))); //ETD
			$("#input_SEA_Departure").val(_fnToNull(sessionStorage.getItem("POL_NM"))); //POL_NM
			$("#input_SEA_POL").val(_fnToNull(sessionStorage.getItem("POL_CD"))); //POL_CD
			$("#input_SEA_Arrival").val(_fnToNull(sessionStorage.getItem("POD_NM"))); //POD_NM
			$("#input_SEA_POD").val(_fnToNull(sessionStorage.getItem("POD_CD"))); //POD_CD
			sessionStorage.clear();

			//검색
			$("#btn_SEASchdule_Search").click();
        }
	}

	//로그인 세션 확인
	if (_fnToNull($("#Session_USR_ID").val()) == "") {
		window.location = window.location.origin;
	}

	$("#SEA_Schedule_AREA").hide();
	$("#Btn_SEAScheduleMore").hide();

	//메인 페이지 기본 변수 세팅
	//$('input[type="text"]').keydown(function (event) {
	//	if (event.keyCode == 13) {
	//		event.preventDefault();
	//		return false;
	//	}
	//});
	
	$("#input_SEA_ETD").val(_fnPlusDate(0)); //ETD	

	//Carr에서 글자가 16자리 이상 넘어갈 때는 ...으로 표기 하게 만듬
	$('.label_vertical_mid').each(function () {
		var length = 16; //글자수
		$(this).each(function () {
			if ($(this).text().length >= length) {
				$(this).text($(this).text().substr(0, length) + '...');
			}
		});
	});	
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_SEA_ETD", function () {
	var vValue = $("#input_SEA_ETD").val();
	var vValue_Num = vValue.replace(/[^0-9]/g, "");
	if (vValue != "") {
		vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
		$(this).val(vValue);
	}
});

//sort 기능 - SEA
$(document).on("click", "#Main_SEATable_List th", function () {

	if (_isSearch) {
		if ($(this).find("button").length > 0) {

			var vValue = "";

			if ($(this).find("button").hasClass("asc")) {
				vValue = "desc";
			}
			else if ($(this).find("button").hasClass("desc")) {
				vValue = "asc";
			} else {
				vValue = "desc";
			}

			//초기화
			$("#Main_SEATable_List th button").removeClass();
			$(this).find("button").addClass(vValue);

			if ($("#Main_SEA_Search_detail").css("display") == "block") {
				var vChkValue = "";

				//체크되어있는 내용이 있는지 없는지 확인.
				$("input[name='SEA_carrier']:checked").each(function () {
					if ($(this).val() != "All") {
						if (vChkValue == "") {
							vChkValue += "'" + $(this).val() + "'";
						} else {
							vChkValue += ",'" + $(this).val() + "'";
						}
					}
				});

				if (vChkValue != "") {
					_OrderBy = $(this).find("button").val();
					_Sort = vValue.toUpperCase();
					_vPage = 0;
					fnGetSeachkSchedule(vChkValue);
				} else {
					$("#Main_SEATable_List th button").removeClass();
				}
			} else {
				_OrderBy = $(this).find("button").val();
				_Sort = vValue.toUpperCase();
				_vPage = 0;
				if (fnVali_Schedule()) {
					fnGetSEAScheduleData();
				}
			}
		}
    }
});

//Carr 보여주기
$(document).on("click", "#carrier_menu", function () {
	if ($(this).prop("checked") == true) {
		$(".search_detail").hide();
		$(".search_detail").eq(0).show();
	}
	else {
		$(".search_detail").hide();
	};
	//if (fnCheckCarr()) {
	//} else {
	//	$(this).prop("checked", true);
	//	fnClick_Carr();
 //   }
});

//input_POL 초기화
$(document).on("keyup", "#input_SEA_Departure", function () {
	if (_fnToNull($(this).val()) == "") {
		$("#input_SEA_POL").val("");
	}
});

//input_POD 초기화
$(document).on("keyup", "#input_SEA_Arrival", function () {
	if (_fnToNull($(this).val()) == "") {
		$("#input_SEA_POD").val("");
	}
});

//퀵 Code - POL
$(document).on("click", "#input_SEA_Departure", function () {
	if ($("#input_SEA_Departure").val().length == 0) {
		$("#select_SEA_pop01").hide();
		$("#select_SEA_pop02").hide();
		selectPopOpen("#select_SEA_pop01");
	}	
});

//퀵 Code - POD
$(document).on("click", "#input_SEA_Arrival", function () {
	if ($("#input_SEA_Arrival").val().length == 0) {
		$("#select_SEA_pop01").hide();
		$("#select_SEA_pop02").hide();
		selectPopOpen("#select_SEA_pop02");
	}
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_SEA_POLCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_SEA_Departure").val(vSplit[0]);
	$("#input_SEA_POL").val(vSplit[1]);
	$("#select_SEA_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POL", "Q", "select_SEA_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
	selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_SEA_POLCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_SEA_Departure").val(vSplit[0]);
	$("#input_SEA_POL").val(vSplit[1]);
	$("#select_SEA_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POL", "Q", "select_SEA_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
	selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - POD
$(document).on("click", "#quick_SEA_PODCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_SEA_Arrival").val(vSplit[0]);
	$("#input_SEA_POD").val(vSplit[1]);
	$("#select_SEA_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POD", "Q", "select_SEA_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

$(document).on("click", "#quick_SEA_PODCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_SEA_Arrival").val(vSplit[0]);
	$("#input_SEA_POD").val(vSplit[1]);
	$("#select_SEA_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POD", "Q", "select_SEA_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//자동완성 기능 - POL
$(document).on("keyup", "#input_SEA_Departure", function () {

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_SEA_POL").val("");
	}

	//출발 도시 바로 선택 화면 가리기
	if ($(this).val().length > 0) {
		$("#select_SEA_pop01").hide();
	} else if ($(this).val().length == 0) {
		$("#select_SEA_pop01").hide();
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_SeaDeparture_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetPortData($("#input_SEA_Departure").val().toUpperCase());
			if (result != undefined) {
				result = JSON.parse(result).Table
				response(
					$.map(result, function (item) {
						return {
							label: item.NAME,
							value: item.NAME,
							code: item.CODE
						}
					})
				);
			}
		},
		delay: 150,
		select: function (event, ui) {
			if (ui.item.value.indexOf('데이터') == -1) {
				$("#input_SEA_Departure").val(ui.item.value);
				$("#input_SEA_POL").val(ui.item.code);
			} else {
				ui.item.value = "";
			}
		},
		focus: function (event, ui) {
			return false;
		}		
	}).autocomplete("instance")._renderItem = function (ul, item) {
			return $("<li>")
			.append("<div>" + item.value + "<br>" + item.code + "</div>")
			.appendTo(ul);
		};
});

//자동완성 기능 - POD
$(document).on("keyup", "#input_SEA_Arrival", function () {

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_SEA_POD").val("");
	}

	//출발 도시 바로 선택 화면 가리기
	if ($(this).val().length > 0) {
		$("#select_SEA_pop02").hide();
	} else if ($(this).val().length == 0) {
		$("#select_SEA_pop02").hide();
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_SeaArrival_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetPortData($("#input_SEA_Arrival").val().toUpperCase());
			if (result != undefined) {
				result = JSON.parse(result).Table
				response(
					$.map(result, function (item) {
						return {
							label: item.NAME,
							value: item.NAME,
							code: item.CODE
						}
					})
				);
			}
		},
		delay: 150,
		select: function (event, ui) {
			if (ui.item.value.indexOf('데이터') == -1) {
				$("#input_SEA_Arrival").val(ui.item.value);
				$("#input_SEA_POD").val(ui.item.code);
			} else {
				ui.item.value = "";
			}
		},
		focus: function (event, ui) {
			return false;
		}		
	}).autocomplete("instance")._renderItem = function (ul, item) {
		return $("<li>")
			.append("<div>" + item.value + "<br>" + item.code + "</div>")
				.appendTo(ul);
	};
});

//스케줄 검색
$(document).on("click", "#btn_SEASchdule_Search", function () {

	if (fnVali_Schedule()) {
		$("#Main_SEATable_List th button").removeClass();
		_OrderBy = "";
		_Sort = "";
		_vPage = 0;
		fnGetSEAScheduleData();
		fnGetSEALinerData();
		$('#container.schedule').css('padding-bottom', '50px');
	}
});

//더보기 버튼 이벤트
$(document).on("click", "#Btn_SEAScheduleMore button", function () {	
	if (_Carr == "Y") {
		if (fnCheckCarr()) {
			var vChkValue = "";

			//체크되어있는 내용이 있는지 없는지 확인.
			$("input[name='SEA_carrier']:checked").each(function () {
				if ($(this).val() != "All") {
					if (vChkValue == "") {
						vChkValue += "'" + $(this).val() + "'";
					} else {
						vChkValue += ",'" + $(this).val() + "'";
					}
				}
			});
			fnGetSeachkSchedule(vChkValue);
		} else {
			_vPage = 0;
			fnGetSEAScheduleData();
			fnGetSEALinerData();
		}
	} else if (_Carr == "") {
		if (fnCheckCarr()) {
			fnGetSEAScheduleData();
		} else {
			_vPage = 0;
			fnGetSEAScheduleData();
			fnGetSEALinerData();
		}
	}
});

//Carr - 전체선택 체크박스
$(document).on("click", "#sea_carrier_All", function () {
			
	if ($("#sea_carrier_All").is(":checked") == true) {
		$("input[name='SEA_carrier']").prop("checked", true);
	} else {
		$("input[name='SEA_carrier']").prop("checked", false);
	}

});

// Carr - T/S 체크 박스 클릭 시 데이터 보여주기
$(document).on("click", "#sea_ts", function () {
	var vChkValue = "";
	//체크되어있는 내용이 있는지 없는지 확인.
	$("input[name='SEA_carrier']:checked").each(function () {
		if ($(this).val() != "All") {
			if (vChkValue == "") {
				vChkValue += "'" + $(this).val() + "'";
			} else {
				vChkValue += ",'" + $(this).val() + "'";
			}
		}
	});

	if (vChkValue != "") {
		_vPage = 0;
		fnGetSeachkSchedule(vChkValue);
    }
});

// Carr - Direct 체크 박스 버튼 클릭 시 데이터 보여주기
$(document).on("click", "#sea_direct", function () {
	var vChkValue = "";

	//체크되어있는 내용이 있는지 없는지 확인.
	$("input[name='SEA_carrier']:checked").each(function () {
		if ($(this).val() != "All") {
			if (vChkValue == "") {
				vChkValue += "'" + $(this).val() + "'";
			} else {
				vChkValue += ",'" + $(this).val() + "'";
			}
		}
	});

	if (vChkValue != "") {
		_vPage = 0;
		fnGetSeachkSchedule(vChkValue);
	}
});

//Carr - 체크 클릭 시 데이터 검색
$(document).on("click", "input[name='SEA_carrier']", function () {

	//Carr - 체크박스 관련 이벤트
	if ($("#sea_carrier_All").is(":checked") == true) {
		$("input[name='SEA_carrier']").each(function (i) {	//현재 클릭 된 것이 checked인 경우 전체 체크 삭제
			if ($(this).prop("checked") == false) {
				if ($("#sea_carrier_All").prop("checked") == true) {
					$("#sea_carrier_All").prop("checked", false);
				}
			}
		});
	}
	else if ($("#sea_carrier_All").is(":checked") == false) {

		var vCheck = true;

		$("input[name='SEA_carrier']").each(function (i) {	//현재 클릭 된 것이 checked인 경우 전체 체크 삭제
			if ($(this).prop("checked") == false) {
				if ($(this).val() != "All") {
					if ($(this).is(":checked") == false) {
						vCheck = false;
					}
				}
			}
		});

		if (vCheck) {
			$("#sea_carrier_All").prop("checked", true);
		}
	}

	//스케줄 검색
	if ($("#sea_carrier_All").is(":checked") == true) {
		//전체 검색으로 스케줄 다시 보여주기	
		_vPage = 0;
		fnGetSeachkSchedule("All");
	} else {

		var vChkValue = "";

		//체크되어있는 내용이 있는지 없는지 확인.
		$("input[name='SEA_carrier']:checked").each(function () {
			if ($(this).val() != "All") {
				if (vChkValue == "") {
					vChkValue += "'" + $(this).val() + "'";
				} else {
					vChkValue += ",'" + $(this).val() + "'";
				}
			}
		});

		if (_fnToNull(vChkValue) == "") {
			//$(this).prop("checked", true);
			fnMakeSEANoData();
		} else {
			_vPage = 0;
			fnGetSeachkSchedule(vChkValue);
		}
	}
});

//부킹 버튼 - 이벤트
$(document).on("click", "a[name='btn_SEA_Booking']", function () {
	//_fnAlertMsg("하기 담당자에게 연락바랍니다. </br></br>이미옥 팀장 / TEL. 070-8666-7027 / E-MAIL: export3@ilsimls.co.kr</br></br>조윤주 대리 / TEL. 070-8666-6929 / E-MAIL: export4@ilsimls.co.kr</br></br>박성진 대리 / TEL. 070-8666-6927 / E-MAIL: export6@ilsimls.co.kr ");
	fnSetBooking($(this).siblings("input[type='hidden']").val());
});

//부킹 마감
$(document).on("click", "a[name='btn_SEA_Booking_Close']", function () {
	//_fnAlertMsg("하기 담당자에게 연락바랍니다. </br></br>이미옥 팀장 / TEL. 070-8666-7027 / E-MAIL: export3@ilsimls.co.kr</br></br>조윤주 대리 / TEL. 070-8666-6929 / E-MAIL: export4@ilsimls.co.kr</br></br>박성진 대리 / TEL. 070-8666-6927 / E-MAIL: export6@ilsimls.co.kr ");
	_fnAlertMsg("<span style=\"color:red\">마감 된 스케줄</span>입니다.");
});
////////////////////////function///////////////////////
//port 정보 가져오는 함수
function fnGetPortData(vValue)
{
	try {
		var rtnJson;
		var objJsonData = new Object();

		objJsonData.LOC_TYPE = "S";		
		objJsonData.LOC_CD = vValue;

		$.ajax({
			type: "POST",
			url: "/Common/fnGetPort",
			async: false,
			dataType: "json",
			//data: callObj,
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				rtnJson = result;
			}, error: function (xhr, status, error) {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
				_fnAlertMsg("담당자에게 문의 하세요.");
				console.log(error);
			},
			beforeSend: function () {
				$("#ProgressBar_Loading").show(); //프로그래스 바
			},
			complete: function () {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
			}
		});

		return rtnJson;
	} catch (e) {
		console.log(e.message);
	}
}

//스케줄 화면 - Carr 버튼
function fnClick_Carr() {
	if (fnVali_Schedule()) {
		_vPage = 0;
		$("div[name='Main_search_detail']").eq(0).show();
		fnGetSEAScheduleData();
		$("div[name='Main_search_detail']").hide();
		fnGetSEALinerData();
		$('#container.schedule').css('padding-bottom', '50px');
	}
}

//스케줄 벨리데이션
function fnVali_Schedule() {

	//ETD를 입력 해 주세요.
	if (_fnToNull($("#input_SEA_ETD").val().replace(/-/gi, "")) == "") {
		$("#Main_SEATable_List th button").removeClass();
		$("#carrier_menu").prop("checked", false);
		_fnAlertMsg("ETD를 입력 해 주세요. ","input_SEA_ETD");
		//$("#input_SEA_ETD").focus();
		return false;
	}

	//POL을 입력 해 주세요.
	if (_fnToNull($("#input_SEA_Departure").val()) == "") {
		$("#Main_SEATable_List th button").removeClass();
		$("#carrier_menu").prop("checked", false);
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_SEA_Departure");
		//$("#input_SEA_Departure").focus();
		return false;
	}

	//POD을 입력 해 주세요. 
	if (_fnToNull($("#input_SEA_Arrival").val()) == "") {
		$("#Main_SEATable_List th button").removeClass();
		$("#carrier_menu").prop("checked", false);
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_SEA_Arrival");
		//$("#input_SEA_Arrival").focus();
		return false;
	}

	return true;
}

//SEA - Liner 코드 가져오기
function fnGetSEALinerData()
{
	try {
		var rtnJson;
		var objJsonData = new Object();		
						
		objJsonData.REQ_SVC = "SEA";
		objJsonData.POL = $("#input_SEA_Departure").val();
		objJsonData.POL_CD = $("#input_SEA_POL").val();
		objJsonData.POD = $("#input_SEA_Arrival").val();
		objJsonData.POD_CD = $("#input_SEA_POD").val();
		objJsonData.ETD_START = $("#input_SEA_ETD").val().replace(/-/gi, "");
		objJsonData.LINE_TYPE = "L"; //Line(L) : 선사 , Ferry(F) : 훼리
		/*objJsonData.CNTR_TYPE = $("#select_SEA_CntrType").find("option:selected").val();*/
		//objJsonData.ETD_END = fnSetWeekDate($("#input_SEA_ETD").val().replace(/-/gi, ""), $("input[name='date_interval']:checked").val());

		$.ajax({
			type: "POST",
			url: "/Schedule/fnGetSEALiner",
			async: true,
			dataType: "json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeSEALiner(result);
			}, error: function (xhr, status, error) {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
				_fnAlertMsg("담당자에게 문의 하세요.");
				console.log(error);
			},
			beforeSend: function () {
				$("#ProgressBar_Loading").show(); //프로그래스 바
			},
			complete: function () {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
			}
		});
	} catch (e) {
		console.log(e.message);
	}
}

//스케줄 데이터 가져오는 함수
function fnGetSEAScheduleData() {

	try {
		var rtnJson;
		var objJsonData = new Object();
				
		objJsonData.REQ_SVC = "SEA";		
		objJsonData.POL = $("#input_SEA_Departure").val();
		objJsonData.POL_CD = $("#input_SEA_POL").val();
		objJsonData.POD = $("#input_SEA_Arrival").val();
		objJsonData.POD_CD = $("#input_SEA_POD").val();
		objJsonData.ETD_START = $("#input_SEA_ETD").val().replace(/-/gi, "");
		objJsonData.LINE_TYPE = "L"; //Line(L) : 선사 , Ferry(F) : 훼리
		/*objJsonData.CNTR_TYPE = $("#select_SEA_CntrType").find("option:selected").val();*/


		//objJsonData.ETD_END = fnSetWeekDate($("#input_ETD").val().replace(/-/gi, ""), $("input[name='date_interval']:checked").val());

		if (_vPage == 0) {
			//검색시 데이터 확인.
			_ObjCheck.REQ_SVC = "SEA";		
			_ObjCheck.POL = $("#input_SEA_Departure").val();
			_ObjCheck.POL_CD = $("#input_SEA_POL").val();
			_ObjCheck.POD = $("#input_SEA_Arrival").val();
			_ObjCheck.POD_CD = $("#input_SEA_POD").val();
			_ObjCheck.ETD_START = $("#input_SEA_ETD").val().replace(/-/gi, "");
			_ObjCheck.LINE_TYPE = "L"; //Line(L) : 선사 , Ferry(F) : 훼리
			/*_ObjCheck.CNTR_TYPE = $("#select_SEA_CntrType").find("option:selected").val();*/
			//_ObjCheck.ETD_END = fnSetWeekDate($("#input_ETD").val().replace(/-/gi, ""), $("input[name='date_interval']:checked").val());

			_vREQ_SVC = "SEA"; //처음에 들어가서 체크
			objJsonData.PAGE = 1;
			_vPage = 1;
		} else {
			_vPage++;
			objJsonData.PAGE = _vPage;
		}

		//Sort
		if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
			objJsonData.ORDERBY = _OrderBy;
			objJsonData.SORT = _Sort;
		} else {
			objJsonData.ORDERBY = "";
			objJsonData.SORT = "";
		}

		$.ajax({
			type: "POST",
			url: "/Schedule/fnGetSEASchedule",
			async: true,
			dataType: "json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {	
				$("#NoData_SEA").hide();
				fnMakeSEASchedule(result);
			}, error: function (xhr, status, error) {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
				_fnAlertMsg("담당자에게 문의 하세요.");
				console.log(error);
			},
			beforeSend: function () {
				$("#ProgressBar_Loading").show(); //프로그래스 바
			},
			complete: function () {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
			}
		});
	} catch (e) {
		console.log(e.message);
	}
}

//Carr에서 체크된 스케줄만 가지고 데이터 보여주기
function fnGetSeachkSchedule(ChkValues) {

	try {
		var rtnJson;
		var objJsonData = new Object();

		objJsonData.REQ_SVC = "SEA";
		objJsonData.POL = $("#input_SEA_Departure").val();
		objJsonData.POL_CD = $("#input_SEA_POL").val();
		objJsonData.POD = $("#input_SEA_Arrival").val();
		objJsonData.POD_CD = $("#input_SEA_POD").val();
		objJsonData.ETD_START = $("#input_SEA_ETD").val().replace(/-/gi, "");
		//objJsonData.ETD_END = fnSetWeekDate($("#input_ETD").val().replace(/-/gi, ""), $("input[name='date_interval']:checked").val());
		objJsonData.LINE_TYPE = "L"; //Line(L) : 선사 , Ferry(F) : 훼리
		/*objJsonData.CNTR_TYPE = $("#select_SEA_CntrType").find("option:selected").val();*/
		objJsonData.LINE_CD = ChkValues;

		if (_vPage == 0) {	
			_Carr = "Y";
			objJsonData.PAGE = 1;
			_vPage = 1;
		} else {
			_vPage++;
			objJsonData.PAGE = _vPage;
		}

		if ($("#sea_ts").is(":checked") && $("#sea_direct").is(":checked")) {
			objJsonData.TS = "Y";
		}
		else if ($("#sea_ts").is(":checked")) {
			objJsonData.TS = "T";
		} else if ($("#sea_direct").is(":checked")) {
			objJsonData.TS = "D";
		} else {
			objJsonData.TS = "N";
        }
	
		//if ($("#sea_ts").is(":checked")) {
		//	objJsonData.TS = "Y";
		//} else if ($("#sea_direct").is(":checked")) {
		//	objJsonData.TS = "D";
		//} else {
			
		//}

		//Sort
		if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
			objJsonData.ORDERBY = _OrderBy;
			objJsonData.SORT = _Sort;
		} else {
			objJsonData.ORDERBY = "";
			objJsonData.SORT = "";
		}

		$.ajax({
			type: "POST",
			url: "/Schedule/fnGetSEAChkSchedule",
			async: true,
			dataType: "json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				//rtnJson = result;				
				//데이터 받은거 바로 그리기
				//$("#SEA_Schedule_AREA").eq(0).empty();
				$("#NoData_SEA").hide();
				fnMakeSEASchedule(result);
			}, error: function (xhr, status, error) {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
				_fnAlertMsg("담당자에게 문의 하세요.");
				console.log(error);
			},
			beforeSend: function () {
				$("#ProgressBar_Loading").show(); //프로그래스 바
			},
			complete: function () {
				$("#ProgressBar_Loading").hide(); //프로그래스 바
			}
		});
	} catch (e) {
		console.log(e.message);
	}
}

//선사 스케줄 Booking 클릭 시
function fnSetBooking(vSCH_NO) {
	try {

		var objJsonData = new Object();
		objJsonData.SCH_NO = vSCH_NO

		sessionStorage.setItem("BEFORE_VIEW_NAME", "SCHEDULE_SEA");
		sessionStorage.setItem("VIEW_NAME", "REGIST");
		sessionStorage.setItem("POL_CD", $("#input_SEA_POL").val());
		sessionStorage.setItem("POD_CD", $("#input_SEA_POD").val());
		sessionStorage.setItem("POL_NM", $("#input_SEA_Departure").val());
		sessionStorage.setItem("POD_NM", $("#input_SEA_Arrival").val());
		sessionStorage.setItem("ETD", $("#input_SEA_ETD").val());
		/*sessionStorage.setItem("CNTR_TYPE", $("#select_SEA_CntrType").find("option:selected").val());*/
		sessionStorage.setItem("LINE_TYPE", 'SEA');

		controllerToLink("Regist", "Booking", objJsonData);

	}
	catch (err) {
		console.log("[Error - fnSetBooking]" + err.message);
	}
}

//Carr 동일한 데이터인지 확인
function fnCheckCarr() {
	var vCheck = true;

	if (_ObjCheck.POL != $("#input_SEA_Departure").val()) {
		vCheck = false;
	}
	if (_ObjCheck.POL_CD != $("#input_SEA_POL").val()) {
		vCheck = false;
	}
	else if (_ObjCheck.POD != $("#input_SEA_Arrival").val()) {
		vCheck = false;
	}
	else if (_ObjCheck.POD_CD != $("#input_SEA_POD").val()) {
		vCheck = false;
	}
	else if (_ObjCheck.ETD_START != $("#input_SEA_ETD").val().replace(/-/gi, "")) {
		vCheck = false;
	}	

	return vCheck;
}
/////////////////function MakeList/////////////////////
//SEA Liner 만들기
function fnMakeSEALiner(vJsonData)
{
	var vHTML = "";

	try {
		//선사 코드 만들기
		var vResult = JSON.parse(vJsonData).Liner;

		if (vResult == undefined) {
			$("#carrier_menu").prop("checked", false);
			$("#carrier_menu").attr("disabled", true);
			$("#Main_SEA_Search_detail").hide();
			$(".switch_label_sub").addClass("disabled");
			//vHTML += "    </div> ";
			//vHTML += "    <div class=\"no_data\"> ";
			//vHTML += "    	<span>데이터가 없습니다.</span> ";
			//vHTML += "    </div> ";
			//vHTML += "    </div> ";
		} else {
			vHTML += "    <div class=\"row\"> ";
			vHTML += "        <div class=\"left_area\"> ";
			vHTML += "        <h4 class=\"title02\">선사 선택</h4> ";
			//vHTML += "        <div class=\"grid_col\"> ";
			//vHTML += "        	  <span class=\"check\"> ";
			//vHTML += "        		  <input type=\"checkbox\" id=\"sea_ts\" name=\"ts\" class=\"chk\" checked> ";
			//vHTML += "        		  <label for=\"sea_ts\"><div class=\"label_vertical_mid\">T/S 포함</div></label> ";
			//vHTML += "        	  </span> ";
			//vHTML += "        </div> ";
			vHTML += "        <div class=\"cont\"> ";
			vHTML += "        	  <span class=\"check\"> ";
			vHTML += "        		  <input type=\"checkbox\" id=\"sea_carrier_All\" name=\"SEA_carrier\" class=\"chk\" value=\"All\" checked> ";
			vHTML += "        		  <label for=\"sea_carrier_All\"><div class=\"label_vertical_mid\">모두선택</div></label> ";
			vHTML += "        	</span> ";
			//show hide로 조지자. Check박스에는 해당 선사 Class명 or name명
			if (vResult.length > 0) {
				$.each(vResult, function (i) {
					//_fnToNull(vResult[i]["SHORT_NM"]) , _fnToNull(vResult[i]["CARR_CD"])
					vHTML += "    	<span class=\"check\"> ";
					vHTML += "    		<input type=\"checkbox\" id=\"sea_carrier0" + i + "\" name=\"SEA_carrier\" class=\"chk\" value=\"" + _fnToNull(vResult[i]["CARR_CD"]) + "\" checked> ";
					vHTML += "    		<label for=\"sea_carrier0" + i + "\"><div class=\"label_vertical_mid\">" + _fnToNull(vResult[i]["CARR_NM"]) + "</div></label> ";
					vHTML += "    	</span>	 ";
				});
				vHTML += "    </div> ";
				vHTML += "</div>"
				vHTML += "<div class=\"right_area\">"
				vHTML += "	<h4 class=\"title02\">환적여부</h4>"
				vHTML += "	<div class=\"cont\">"
				vHTML += "		<span class=\"check\">"
				vHTML += "			<input type=\"checkbox\" id=\"sea_direct\" name=\"ts\" class=\"chk\" checked>"
				vHTML += "			<label for=\"sea_direct\"><div class=\"label_vertical_mid\">Direct</div></label>"
				vHTML += "      </span>"
				vHTML += "		<span class=\"check\">"
				vHTML += "			<input type=\"checkbox\" id=\"sea_ts\" name=\"ts\" class=\"chk\" checked>"
				vHTML += "			<label for=\"sea_ts\"><div class=\"label_vertical_mid\">Direct + T/S</div></label>"
				vHTML += "      </span>"
				vHTML += "   </div>"
				vHTML += "</div>"			}
			else {
				vHTML += "    </div> ";
				vHTML += "    <div class=\"no_data\"> ";
				vHTML += "    	<span>데이터가 없습니다.</span> ";
				vHTML += "    </div> ";
				vHTML += "    </div> ";
			}
        }

		$("div[name='Main_search_detail']")[0].innerHTML = vHTML;

		$('.label_vertical_mid').each(function () {
			var length = 16; //글자수
			$(this).each(function () {
				if ($(this).text().length >= length) {
					$(this).text($(this).text().substr(0, length) + '...');
				}
			});
		});	
	} catch (e) {
		console.log(e.message);
	}
}

//SEA 스케줄 만들기
function fnMakeSEASchedule(vJsonData)
{	
	var vHTML = "";		

	try {
		//스케줄 데이터 만들기
		vResult = JSON.parse(vJsonData).Schedule;
		var vMorePage = true;

		//초기화
		if (_vPage == 1) {
			$("#SEA_Schedule_AREA").eq(0).empty();
		}
		if (vResult == undefined) {
			_isSearch = false;
			vHTML += " <span>데이터가 없습니다.</span> ";
			$("#NoData_SEA")[0].innerHTML = vHTML;
			$("#NoData_SEA").show();
			vHTML = "";
			$("#Btn_SEAScheduleMore").hide();

			//캐리어 버튼 비활성화
			$("#carrier_menu").attr("disabled", true);
			$(".switch_label_sub").addClass("disabled");
			//캐리어 버튼 비활성화
			//$("#carrier_menu").attr("disabled", true);
		} else {
			_isSearch = true;
			if (vResult.length > 0) {
				$.each(vResult, function (i) {
					vHTML += "   <tr class=\"row Schedule_" + _fnToNull(vResult[i]["LINE_CD"]) + "\" data-row=\"row_1\"> ";
					//twkim 20210713 - Logo가 없을 경우 일심 로고가 찍히게 수정
					if (_fnToNull(vResult[i]["IMG_PATH"]) == "") {
						vHTML += "   	<td><img src=\"/Images/logo.png\" alt=\"\"></td> ";
					} else {
						vHTML += "   	<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
					}
					//vHTML += "   	<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
					vHTML += "   	<td> ";
					vHTML += _fnToNull(vResult[i]["LINE_CD"]) + "<br />";
					vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
					vHTML += "   	</td> ";
					vHTML += "   	<td> ";
					vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
					vHTML += _fnToNull(vResult[i]["POL_CD"]) + "";
					vHTML += "   	</td> ";
					vHTML += "   	<td> ";
					vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
					vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
					vHTML += "   	</td> ";
					if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
						vHTML += "   	<td> ";
						vHTML += "";
					} else {

						if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
							vHTML += "   	<td style='color:red'> ";
						}
						else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
							vHTML += "   	<td style='color:orange'> ";
						} else {
							vHTML += "   	<td> ";
						}
						vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
						vHTML += _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
					}

					vHTML += "   	</td> ";

					//Cargo Closing
					if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
						vHTML += "   	<td> ";
						vHTML += "";
					} else {

						vHTML += "   	<td> ";						
						vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
						if (_fnToZero(vResult[i]["CARGO_CLOSE_HM"]) == 0) {
							vHTML += "00:00";
						} else {
							vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
                        }
					}

					vHTML += "   	</td> ";

					//Service
					//vHTML += "   	<td> ";					
					//vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
					//vHTML += "   	</td> ";

					if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
						if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</td> ";
						} else {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</td> ";
						}
					} else {
						vHTML += "   	<td></td> ";
					}

					if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {
						vHTML += "   	<td>T/S</td> ";
					} else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {
						vHTML += "   	<td>Direct</td> ";
					} else {
						vHTML += "   	<td></td> ";
					}

					vHTML += "   	<td class=\"btns_w1\"> ";
					//수입일때는 Booking이 뜨지 않게
					if (_fnToNull(vResult[i]["BOUND"]) == "E") {
						if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
							vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_SEA_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
						} else {
							vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_SEA_Booking\" class=\"btn_type1\">BOOKING</a>";
						}
					}

					vHTML += "			<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\" /> 		";
					vHTML += "		</td>";

					vHTML += "		<td class=\"btns_w2\"> ";
					vHTML += "			<a class=\"plus\" id=\"plus\" href=\"javascript:void(0)\"><span class=\"btn_minus\"></span><span class=\"btn_plus\"></span></a> ";
					vHTML += "		</td> ";

					/* mobile_layout  */
					vHTML += "   <td class=\"mobile_layout\" colspan=\"9\"> ";
					vHTML += "   	<div class=\"layout_type2\"> ";
					vHTML += "   		<div class=\"row s3\"> ";
					vHTML += "   			<table> ";
					vHTML += "   				<tbody> ";

					vHTML += "   					<tr> ";
					vHTML += "   						<th>Carrier</th> ";
					//twkim 20210713 - Logo가 없을 경우 일심 로고가 찍히게 수정
					if (_fnToNull(vResult[i]["IMG_PATH"]) == "") {
						vHTML += "  					<td><img src=\"/Images/logo.png\" alt=\"\"></td> ";
					} else {
						vHTML += "  					<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
					}
					//vHTML += "  					<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
					vHTML += "   					</tr> ";

					vHTML += "   					<tr> ";
					vHTML += "   						<th>Vessel</th> ";
					vHTML += "   						<td>" + _fnToNull(vResult[i]["LINE_CD"]) + " " + _fnToNull(vResult[i]["VSL_VOY"]) + "</td> ";
					vHTML += "   					</tr> ";

					vHTML += "   					<tr> ";
					vHTML += "   						<th>Departure</th> ";
					vHTML += "   						<td>" + String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + "(" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") " + _fnToNull(vResult[i]["POL_TRMN"]) + "</td> ";
					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";
					vHTML += "   						<th>Arrival</th> ";
					vHTML += "   						<td>" + String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + "(" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") " + _fnToNull(vResult[i]["POD_TRMN"]) + "</td> ";
					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";
					vHTML += "   						<th>Doc Closing</th> ";

					if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
						vHTML += "   						<td> ";
						vHTML += "   						</td> ";
					} else {

						if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
							vHTML += "   	<td style='color:red'> ";
						}
						else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
							vHTML += "   	<td style='color:orange'> ";
						} else {
							vHTML += "   	<td> ";
						}

						vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ") " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
						vHTML += "   						</td> ";
					}

					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";

					//Service
					//vHTML += "   						<th>Service</th> ";
					//vHTML += " <td> ";
					//vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
					//vHTML += " </td> ";

					//Cargo Closing
					vHTML += "   						<th>Cargo Closing</th> ";
					if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
						vHTML += "   	<td> ";
						vHTML += "";
					} else {

						vHTML += "   	<td> ";
						vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ") "; //+ _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));

						if (_fnToZero(vResult[i]["CARGO_CLOSE_HM"]) == 0) {
							vHTML += "00:00";
						} else {
							vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
						}


					}

					vHTML += "   	</td> ";


					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";
					vHTML += "   						<th>T/time</th> ";

					if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
						if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</td> ";
						} else {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</td> ";
						}
					} else {
						vHTML += "   	<td></td> ";
					}

					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";
					vHTML += "   						<th>T/S</th> ";

					if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {
						vHTML += "   	<td>T/S</td> ";
					} else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {
						vHTML += "   	<td>Direct</td> ";
					} else {
						vHTML += "   	<td></td> ";
					}
					vHTML += "   					</tr> ";

					vHTML += "   <tr class=\"sch_comment\"> ";
					vHTML += "   	<td colspan=\"2\"> ";
					vHTML += "   		<ul class=\"etc_info\"> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>반입지 : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>비고 : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   		</ul> ";
					vHTML += "   	</td> ";
					vHTML += "   </tr> ";
					vHTML += "   <tr> ";
					vHTML += "   	<td colspan=\"2\"> ";
					//수입일때는 Booking이 뜨지 않게
					if (_fnToNull(vResult[i]["BOUND"]) == "E") {
						//alert(vResult[i]["DOC_CLOSE_YMD"] + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, ""));
						if (vResult[i]["DOC_CLOSE_YMD"] + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
							vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_SEA_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
						} else {
							vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_SEA_Booking\" class=\"btn_type1\">BOOKING</a>";
						}
					}
					vHTML += "			<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\" /> 		";
					vHTML += "   	</td> ";
					vHTML += "   </tr> ";
					vHTML += "   				</tbody> ";
					vHTML += "   			</table> ";
					vHTML += "   		</div> ";
					vHTML += "   	</div> ";
					vHTML += "   </td> ";
					/* mobile_layout  */

					vHTML += "   </tr> ";
					vHTML += "   <tr class=\"related_info\" id=\"row_1\"> ";
					vHTML += "   	<td colspan=\"10\"> ";
					vHTML += "   		<ul class=\"etc_info\"> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>반입지 : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   			<li class=\"item\"> ";
					vHTML += "   				<em>비고 : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
					vHTML += "   			</li> ";
					vHTML += "   		</ul> ";
					vHTML += "   	</td> ";
					vHTML += "   </tr> ";

					//더보기 체크 RNUM == TOTCNT
					if (_fnToNull(vResult[i]["RNUM"]) == _fnToNull(vResult[i]["TOTCNT"])) {
						vMorePage = false;
					} else {
						vMorePage = true;
					}
				});

				//더보기 영역
				if (vMorePage) {
					$("#Btn_SEAScheduleMore").show();
				} else {
					$("#Btn_SEAScheduleMore").hide();
				}

				//캐리어 버튼 활성화
				$("#carrier_menu").attr("disabled", false);
				$(".switch_label_sub").removeClass("disabled");
			}
			else {
				_isSearch = false;
				vHTML += " <span>데이터가 없습니다.</span> ";
				$("#NoData_SEA")[0].innerHTML = vHTML;
				$("#NoData_SEA").show();
				vHTML = "";
				$("#Btn_SEAScheduleMore").hide();
				//캐리어 버튼 비활성화
				$("#carrier_menu").attr("disabled", true);
				$(".switch_label_sub").addClass("disabled");
			}
        }

		$("#SEA_Schedule_AREA").eq(0).append(vHTML);
		$("#SEA_Schedule_AREA").show();

	} catch (e) {
		console.log(e.message);
    }
}

//스케줄 Nodata 그려주기
function fnMakeSEANoData() {

	$("#SEA_Schedule_AREA").eq(0).empty();

	var vHTML = " <span>데이터가 없습니다.</span> ";
	$("#NoData_SEA")[0].innerHTML = vHTML;
	$("#NoData_SEA").show();
	$("#Btn_SEAScheduleMore").hide();

}

//SEA 초기화
function fnMakeSEAInit() {

	$("#SEA_Schedule_AREA").eq(0).empty();

	var vHTML = "";

	vHTML += "   <tr class=\"row\" data-row=\"row_5\"> ";
	vHTML += "   	<td colspan=\"8\"> ";
	vHTML += "   		<ul class=\"etc_info\"> ";
	vHTML += "   			<li class=\"no_data\"> ";
	vHTML += "   				<em></em> ";
	vHTML += "   			</li> ";
	vHTML += "   		</ul> ";
	vHTML += "   	</td> ";
	vHTML += "   	<!-- mobile area --> ";
	vHTML += "   	<td class=\"mobile_layout\" colspan=\"9\"> ";
	vHTML += "   		<div class=\"layout_type3\"> ";
	vHTML += "   			<ul class=\"etc_info\"> ";
	vHTML += "   				<li class=\"no_data\"> ";
	vHTML += "   					<em></em> ";
	vHTML += "   				</li> ";
	vHTML += "   			</ul> ";
	vHTML += "   		</div>  ";
	vHTML += "		</td> ";
	vHTML += "   	<!-- //mobile area --> ";
	vHTML += "   </tr> ";

	$("#Btn_SEAScheduleMore").hide();
	$("#SEA_Schedule_AREA").eq(0).append(vHTML);
}
////////////////////////API////////////////////////////

