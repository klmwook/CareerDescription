////////////////////전역 변수//////////////////////////
var _AIRObjCheck = new Object();
var _AIR_OrderBy = "";
var _AIR_Sort = "";
var _AIR_isSearch = false;

////////////////////jquery event///////////////////////
//$(function () {
//	_fnAlertMsg("되냐");
//});

//sort 기능
$(document).on("click", "table[name='Main_AIRTable_List'] th", function () {

	if (_AIR_isSearch) {
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
			$("table[name='Main_AIRTable_List'] th button").removeClass();
			$(this).find("button").addClass(vValue);

			_AIR_OrderBy = $(this).find("button").val();
			_AIR_Sort = vValue.toUpperCase();
			_vPage = 0;
			fnGetAIRScheduleData();
		}
    }
	
});

//날짜 validation 체크
$(document).on("focusout", "#input_AIR_ETD", function () {

	if (!_fnisDate($(this).val())) {
		$(this).val("");
		$(this).focus();
	} else {
		var vValue = $(this).val();
		var vValue_Num = vValue.replace(/[^0-9]/g, "");
		if (vValue != "") {
			vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
			$(this).val(vValue);
		}
	}

});

//퀵 Code - POL
$(document).on("click", "#input_AIR_Departure", function () {
	if ($("#input_AIR_Departure").val().length == 0) {
		$("#select_AIR_pop01").hide();
		$("#select_AIR_pop02").hide();
		selectPopOpen("#select_AIR_pop01");
	}
});

//퀵 Code - POD
$(document).on("click", "#input_AIR_Arrival", function () {
	if ($("#input_AIR_Arrival").val().length == 0) {
		$("#select_AIR_pop01").hide();
		$("#select_AIR_pop02").hide();
		selectPopOpen("#select_AIR_pop02");
	}
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_AIR_POLCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_AIR_Departure").val(vSplit[0]);
	$("#input_AIR_POL").val(vSplit[1]);
	$("#select_AIR_pop01").hide();


	if (_fnCheckSamePort(vSplit[1], "AIR", "POL", "Q", "select_AIR_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}

	selectPopOpen("#select_AIR_pop02");
});

$(document).on("click", "#quick_AIR_POLCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_AIR_Departure").val(vSplit[0]);
	$("#input_AIR_POL").val(vSplit[1]);
	$("#select_AIR_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "AIR", "POL", "Q", "select_AIR_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}

	selectPopOpen("#select_AIR_pop02");
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_AIR_PODCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_AIR_Arrival").val(vSplit[0]);
	$("#input_AIR_POD").val(vSplit[1]);
	$("#select_AIR_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "AIR", "POD", "Q", "select_AIR_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//퀵 Code 데이터 - POD
$(document).on("click", "#quick_AIR_PODCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_AIR_Arrival").val(vSplit[0]);
	$("#input_AIR_POD").val(vSplit[1]);
	$("#select_AIR_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "AIR", "POD", "Q", "select_AIR_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//자동완성 기능 - POL
$(document).on("keyup", "#input_AIR_Departure", function () {

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_AIR_POL").val("");
	}

	//출발 도시 바로 선택 화면 가리기
	if ($(this).val().length > 0) {
		$("#select_AIR_pop01").hide();
	}
	else if ($(this).val().length == 0) {
		$("#select_AIR_pop01").hide();
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_AirDeparture_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetAIRPortData($("#input_AIR_Departure").val().toUpperCase());
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
		select: function (event, ui) {
			if (ui.item.value.indexOf('데이터') == -1) {
				$("#input_AIR_Departure").val(ui.item.value);
				$("#input_AIR_POL").val(ui.item.code);
			} else {
				ui.item.value = "";
			}
		},
	}).autocomplete("instance")._renderItem = function (ul, item) {
		return $("<li>")
			.append("<div>" + item.value + "<br>" + item.code + "</div>")
			.appendTo(ul);
	};

});

//자동완성 기능 - POD
$(document).on("keyup", "#input_AIR_Arrival", function (e) {

	if (e.keyCode == 13) {

	} else {
		//input_POD 초기화
		if (_fnToNull($(this).val()) == "") {
			$("#input_AIR_POD").val("");
		}

		//출발 도시 바로 선택 화면 가리기
		if ($(this).val().length > 0) {
			$("#select_AIR_pop02").hide();
		}
		else if ($(this).val().length == 0) {
			$("#select_AIR_pop02").hide();
		}

		//autocomplete
		$(this).autocomplete({
			minLength: 3,
			open: function (event, ui) {
				$(this).autocomplete("widget").css({
					"width": $("#AC_AirArrival_Width").width()
				});
			},
			source: function (request, response) {
				var result = fnGetAIRPortData($("#input_AIR_Arrival").val().toUpperCase());
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
			select: function (event, ui) {
				if (ui.item.value.indexOf('데이터') == -1) {
					$("#input_AIR_Arrival").val(ui.item.value);
					$("#input_AIR_POD").val(ui.item.code);
				} else {
					ui.item.value = "";
				}
			},
		}).autocomplete("instance")._renderItem = function (ul, item) {
			return $("<li>")
				.append("<div>" + item.value + "<br>" + item.code + "</div>")
				.appendTo(ul);
		};
	}
});

//스케줄 검색
$(document).on("click", "#btn_AIRSchedule_Search", function () {

	$("table[name='Main_AIRTable_List'] th button").removeClass();
	_AIR_OrderBy = "";
	_AIR_Sort = "";
	_vPage = 0;
	fnGetAIRScheduleData();
});

//더보기 버튼 이벤트
$(document).on("click", "#Btn_AIRScheduleMore button", function () {

	//_AIR_OrderBy = "";
	//_AIR_Sort = "";

	if (fnAIRCheckCarr()) {
		fnGetAIRScheduleData();
	} else {
		_vPage = 0;
		fnGetAIRScheduleData();
	}
});

//부킹 버튼 - 이벤트
$(document).on("click", "a[name='btn_AIR_Booking']", function () {
	_fnAlertMsg_point("<p class=\"margin_top20\">하기 담당자에게 연락바랍니다.</p></br><p>김철진 부팀장</p><p class=\"info\">TEL. 070-8666-6187</p><p class=\"info\">E-MAIL: import@ilsimls.co.kr</p><p></br>이정원 대리</p><p class=\"info\">TEL. 070-8666-8145</p><p class=\"info\">E-MAIL: export5@ilsimls.co.kr</p>");

	//if (_fnToNull($("#Session_USR_ID").val()) != "") {
	//	fnAIRSetBooking($(this).siblings("input[type='hidden']").val());
	//} else {
	//	fnShowLoginLayer("goAIRBooking;" + $(this).siblings("input[type='hidden']").val());
	//}
});

//부킹 마감
$(document).on("click", "a[name='btn_AIR_Booking_Close']", function () {
	_fnAlertMsg_point("<p class=\"margin_top20\">하기 담당자에게 연락바랍니다.</p></br><p>김철진 부팀장</p><p class=\"info\">TEL. 070-8666-6187</p><p class=\"info\">E-MAIL: import@ilsimls.co.kr</p><p></br>이정원 대리</p><p class=\"info\">TEL. 070-8666-8145</p><p class=\"info\">E-MAIL: export5@ilsimls.co.kr</p>");
	//_fnAlertMsg("<span style=\"color:red\">마감 된 스케줄</span>입니다.");
});
////////////////////////function///////////////////////
//port 정보 가져오는 함수
function fnGetAIRPortData(vValue) {
	try {
		var rtnJson;
		var objJsonData = new Object();

		objJsonData.LOC_TYPE = "A";
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
				alert("담당자에게 문의 하세요.");
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

//스케줄 벨리데이션
function fnVali_AIRSchedule() {

	//ETD를 입력 해 주세요.
	if (_fnToNull($("#input_AIR_ETD").val().replace(/-/gi, "")) == "") {
		alert("ETD를 입력 해 주세요.","input_AIR_ETD");		
		return false;
	}

	//POL을 입력 해 주세요.
	if (_fnToNull($("#input_AIR_Departure").val()) == "") {
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_AIR_Departure");
		return false;
	}

	if (_fnToNull($("#input_AIR_Arrival").val()) == "") {
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_AIR_Arrival");
		return false;
	}

	return true;
}

//스케줄 데이터 가져오는 함수
function fnGetAIRScheduleData() {

	try {

		if (fnVali_AIRSchedule()) {

			var rtnJson;
			var objJsonData = new Object();

			//실제 데이터 전송
			objJsonData.REQ_SVC = "AIR";

			objJsonData.POL = $("#input_AIR_Departure").val();
			objJsonData.POL_CD = $("#input_AIR_POL").val();
			objJsonData.POD = $("#input_AIR_Arrival").val();
			objJsonData.POD_CD = $("#input_AIR_POD").val();
			objJsonData.ETD_START = $("#input_AIR_ETD").val().replace(/-/gi, "");
			objJsonData.ETD_END = "";
			objJsonData.ID = "";
			objJsonData.ORDER = "";

			if (_vPage == 0) {
				_AIRObjCheck.POL = $("#input_AIR_Departure").val();
				_AIRObjCheck.POL_CD = $("#input_AIR_POL").val();
				_AIRObjCheck.POD = $("#input_AIR_Arrival").val();
				_AIRObjCheck.POD_CD = $("#input_AIR_POD").val();
				_AIRObjCheck.ETD_START = $("#input_AIR_ETD").val().replace(/-/gi, "");

				objJsonData.PAGE = 1;
				_vPage = 1;
			} else {
				_vPage++;
				objJsonData.PAGE = _vPage;
			}

			//Sort
			if (_fnToNull(_AIR_OrderBy) != "" || _fnToNull(_AIR_Sort) != "") {
				objJsonData.ID = _AIR_OrderBy;
				objJsonData.ORDER = _AIR_Sort;
			} else {
				objJsonData.ID = "";
				objJsonData.ORDER = "";
			}

			$.ajax({
				type: "POST",
				url: "/Home/fnGetAIRSchedule",
				async: true,
				dataType: "json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					$("#NoData_AIR").hide();
					fnMakeAIRSchedule(result);
				}, error: function (xhr, status, error) {
					$("#ProgressBar_Loading").hide(); //프로그래스 바
					alert("담당자에게 문의 하세요.");
					console.log(error);
				},
				beforeSend: function () {
					$("#ProgressBar_Loading").show(); //프로그래스 바
				},
				complete: function () {
					$("#ProgressBar_Loading").hide(); //프로그래스 바
				}
			});

		} else {
			$("table[name='Main_AIRTable_List'] th button").removeClass();
		}

	} catch (e) {
		console.log(e.message);
	}
}

//선사 스케줄 Booking 클릭 시
function fnAIRSetBooking(vSCH_NO) {
	try {

		var objJsonData = new Object();
		objJsonData.SCH_NO = vSCH_NO;

		sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_AIR");
		sessionStorage.setItem("VIEW_NAME", "REGIST");
		sessionStorage.setItem("POL_CD", $("#input_AIR_POL").val());
		sessionStorage.setItem("POD_CD", $("#input_AIR_POD").val());
		sessionStorage.setItem("POL_NM", $("#input_AIR_Departure").val());
		sessionStorage.setItem("POD_NM", $("#input_AIR_Arrival").val());
		sessionStorage.setItem("ETD", $("#input_AIR_ETD").val());
		sessionStorage.setItem("CNTR_TYPE", 'L');
		sessionStorage.setItem("LINE_TYPE", 'AIR');

		controllerToLink("Regist", "Booking", objJsonData);

	}
	catch (err) {
		console.log("[Error - fnFREEYSetBooking]" + err.message);
	}
}

//더보기 눌렀을 시 처음 검색조건과 상이할 경우 재 검색
function fnAIRCheckCarr() {
	var vCheck = true;

	if (_AIRObjCheck.POL_CD != $("#input_AIR_POL").val()) {
		vCheck = false;
	}
	else if (_AIRObjCheck.POD_CD != $("#input_AIR_POD").val()) {
		vCheck = false;
	}
	else if (_AIRObjCheck.ETD_START != $("#input_AIR_ETD").val().replace(/-/gi, "")) {
		vCheck = false;
	}	

	return vCheck;
}

/////////////////function MakeList/////////////////////
//AIR 스케줄 만들기
function fnMakeAIRSchedule(vJsonData) {
	var vHTML = "";

	try {
		//스케줄 데이터 만들기
		var vResult = JSON.parse(vJsonData).Schedule;
		var vMorePage = true;

		//초기화
		if (_vPage == 1) {
			$("#AIR_Schedule_AREA").eq(0).empty();
		}
		if (vResult == undefined) {
			_AIR_isSearch = false;
			$("#Btn_AIRScheduleMore").hide();
			vHTML += " <span>데이터가 없습니다.</span> ";
			$("#NoData_AIR")[0].innerHTML = vHTML;
			vHTML = "";
			$("#NoData_AIR").show();
			//vHTML += "   <tr class=\"row\" data-row=\"row_5\"> ";
			//vHTML += "   	<td colspan=\"10\"> ";
			//vHTML += "   		<ul class=\"etc_info\"> ";
			//vHTML += "   			<li class=\"no_data\"> ";
			//vHTML += "   				<em>데이터가 없습니다.</em> ";
			//vHTML += "   			</li> ";
			//vHTML += "   		</ul> ";
			//vHTML += "   	</td> ";
			//vHTML += "   	<!-- mobile area --> ";
			//vHTML += "   	<td class=\"mobile_layout\" colspan=\"9\"> ";
			//vHTML += "   		<div class=\"layout_type3\"> ";
			//vHTML += "   			<ul class=\"etc_info\"> ";
			//vHTML += "   				<li class=\"no_data\"> ";
			//vHTML += "   					<em>데이터가 없습니다.</em> ";
			//vHTML += "   				</li> ";
			//vHTML += "   			</ul> ";
			//vHTML += "   		</div>  ";
			//vHTML += "		</td> ";
			//vHTML += "   	<!-- //mobile area --> ";
			//vHTML += "   </tr> ";
		} else {
			if (vResult.length > 0) {
				_AIR_isSearch = true;
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
					vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
					vHTML += "   	</td> ";
					vHTML += "   	<td> ";					
					vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETD_HM"]))+"<br /> ";
					vHTML += _fnToNull(vResult[i]["POL_CD"]) + "";
					vHTML += "   	</td> ";
					vHTML += "   	<td> ";

					if (_fnToNull(vResult[i]["ETA"]) != "") {
						vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETA_HM"])) + "<br /> ";
					}
					else {
						vHTML += "-<br/>";
                    }

					vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
					vHTML += "   	</td> ";

					if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
						vHTML += "   	<td> ";
					} else {
						vHTML += "";

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
					//vHTML += "   	<td> ";

					////Service
					//vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);

					////if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
					////	vHTML += "";
					////} else {
					////	vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
					////	vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
					////}
					//vHTML += "   	</td> ";

					if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
						//if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
						//	vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</td> ";
						//} else {
						//	vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</td> ";
						//}
						vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME_NM"]) + "</td> ";
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
						if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
							vHTML += "			<a href=\"javascript:void(0)\"  class=\"btn_type1 gray\" style='cursor:default'>BOOKING</a>";
						} else {
							if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_AIR_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
							} else {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_AIR_Booking\" class=\"btn_type1\">BOOKING</a>";
							}
						}
					}
					vHTML += "			<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\" /> 		";
					vHTML += "		</td>";

					vHTML += "		<td class=\"btns_w2\"> ";
					vHTML += "			<a class=\"plus\" id=\"plus\" href=\"javascript:void(0)\"><span class=\"btn_minus\"></span><span class=\"btn_plus\"></span></a> ";
					vHTML += "		</td> ";

					/* mobile_layout  */
					vHTML += "   <td class=\"mobile_layout\" colspan=\"7\"> ";
					vHTML += "   	<div class=\"layout_type2\"> ";
					//vHTML += "   		<div class=\"row s1\"> ";
					//vHTML += "   			<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"> ";
					//vHTML += "   		</div> ";
					//vHTML += "   		<div class=\"row s2\"> ";
					//vHTML += "   			" + _fnToNull(vResult[i]["LINE_CD"]) + " " + _fnToNull(vResult[i]["VSL_VOY"]);
					//vHTML += "   		</div> ";
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
					vHTML += "   						<th>Flight No</th> ";
					vHTML += "   						<td>" + _fnToNull(vResult[i]["VSL_VOY"]) + "</td> ";
					vHTML += "   					</tr> ";

					vHTML += "   					<tr> ";
					vHTML += "   						<th>Departure</th> ";
					vHTML += "   						<td>" + String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETD_HM"])) + " " + _fnToNull(vResult[i]["POL_TRMN"]) + "</td> ";
					vHTML += "   					</tr> ";
					vHTML += "   					<tr> ";
					vHTML += "   						<th>Arrival</th> ";

					if (_fnToNull(vResult[i]["ETA"]) != "") {
						vHTML += "   						<td>" + String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETA_HM"])) + " " + _fnToNull(vResult[i]["POD_TRMN"]) + "</td> ";
					}
					else {
						vHTML += "<td>-</td> ";
                    }

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
					//vHTML += "   					<tr> ";
					//vHTML += "   						<th>Service</th> ";

					//vHTML += " <td> ";
					//vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
					//vHTML += " </td> ";

					//if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
					//	vHTML += "   						<td></td> ";
					//} else {
					//	vHTML += "   						<td>" + String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ") " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"])) + "</td> ";
					//}

					/*vHTML += "   					</tr> ";*/
					vHTML += "   					<tr> ";
					vHTML += "   						<th>T/time</th> ";

					if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
						if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME_NM"]) + "</td> ";
						} else {
							vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME_NM"]) + "</td> ";
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
						if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
							vHTML += "			<a href=\"javascript:void(0)\"  class=\"btn_type1 gray\" style='cursor:default'>BOOKING</a>";
						} else {
							if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								vHTML += "		<a href=\"javascript:void(0)\" name=\"btn_AIR_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
							} else {
								vHTML += "		<a href=\"javascript:void(0)\" name=\"btn_AIR_Booking\" class=\"btn_type1\">BOOKING</a>";
							}
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
					vHTML += "   	<td colspan=\"9\"> ";
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
					$("#Btn_AIRScheduleMore").show();
				} else {
					$("#Btn_AIRScheduleMore").hide();
				}
			}
			else {
				_AIR_isSearch = false;
				$("#Btn_AIRScheduleMore").hide();
				vHTML += " <span>데이터가 없습니다.</span> ";
				$("#NoData_AIR")[0].innerHTML = vHTML;
				$("#NoData_AIR").show();
				vHTML = "";
				//vHTML += "   <tr class=\"row\" data-row=\"row_5\"> ";
				//vHTML += "   	<td colspan=\"10\"> ";
				//vHTML += "   		<ul class=\"etc_info\"> ";
				//vHTML += "   			<li class=\"no_data\"> ";
				//vHTML += "   				<em>데이터가 없습니다.</em> ";
				//vHTML += "   			</li> ";
				//vHTML += "   		</ul> ";
				//vHTML += "   	</td> ";
				//vHTML += "   	<!-- mobile area --> ";
				//vHTML += "   	<td class=\"mobile_layout\" colspan=\"9\"> ";
				//vHTML += "   		<div class=\"layout_type3\"> ";
				//vHTML += "   			<ul class=\"etc_info\"> ";
				//vHTML += "   				<li class=\"no_data\"> ";
				//vHTML += "   					<em>데이터가 없습니다.</em> ";
				//vHTML += "   				</li> ";
				//vHTML += "   			</ul> ";
				//vHTML += "   		</div>  ";
				//vHTML += "		</td> ";
				//vHTML += "   	<!-- //mobile area --> ";
				//vHTML += "   </tr> ";
			}
		}

		$("#AIR_Schedule_AREA").eq(0).append(vHTML);
		$("#AIR_Schedule_AREA").show();
	} catch (e) {
		console.log(e.message);
	}
}
////////////////////////API////////////////////////////




