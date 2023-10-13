////////////////////전역 변수//////////////////////////
var _FERRYObjCheck = new Object();
var _FERRY_OrderBy = "";
var _FERRY_Sort = "";
var _FERRY_isSearch = false;
////////////////////jquery event///////////////////////

//sort 기능
$(document).on("click", "table[name='Main_FERRYTable_List'] th", function () {

	if (_FERRY_isSearch) {
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
			$("table[name='Main_FERRYTable_List'] th button").removeClass();
			$(this).find("button").addClass(vValue);

			_FERRY_OrderBy = $(this).find("button").val();
			_FERRY_Sort = vValue.toUpperCase();
			_vPage = 0;
			fnGetFERRYScheduleData();
		}
    }
});

//날짜 validation 체크
$(document).on("focusout", "#input_FERRY_ETD", function () {
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
$(document).on("click", "#input_FERRY_Departure", function () {
	if ($("#input_FERRY_Departure").val().length == 0) {
		$("#select_FERRY_pop01").hide();
		$("#select_FERRY_pop02").hide();
		selectPopOpen("#select_FERRY_pop01");
	}
});

//퀵 Code - POD
$(document).on("click", "#input_FERRY_Arrival", function () {
	if ($("#input_FERRY_Arrival").val().length == 0) {
		$("#select_FERRY_pop01").hide();
		$("#select_FERRY_pop02").hide();
		selectPopOpen("#select_FERRY_pop02");
	}
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_FERRY_POLCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_FERRY_Departure").val(vSplit[0]);
	$("#input_FERRY_POL").val(vSplit[1]);
	$("#select_FERRY_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "FERRY", "POL", "Q", "select_FERRY_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
	selectPopOpen("#select_FERRY_pop02");
});

$(document).on("click", "#quick_FERRY_POLCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_FERRY_Departure").val(vSplit[0]);
	$("#input_FERRY_POL").val(vSplit[1]);
	$("#select_FERRY_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "FERRY", "POL", "Q", "select_FERRY_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}

	selectPopOpen("#select_FERRY_pop02");
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_FERRY_PODCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_FERRY_Arrival").val(vSplit[0]);
	$("#input_FERRY_POD").val(vSplit[1]);
	$("#select_FERRY_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "FERRY", "POD", "Q", "select_FERRY_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//퀵 Code 데이터 - POD
$(document).on("click", "#quick_FERRY_PODCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_FERRY_Arrival").val(vSplit[0]);
	$("#input_FERRY_POD").val(vSplit[1]);
	$("#select_FERRY_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "FERRY", "POD", "Q", "select_FERRY_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//자동완성 기능 - POL
$(document).on("keyup", "#input_FERRY_Departure", function () {

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_FERRY_POL").val("");
	}

	//출발 도시 바로 선택 화면 가리기
	if ($(this).val().length > 0) {
		$("#select_FERRY_pop01").hide();
	}
	else if ($(this).val().length == 0) {
		$("#select_FERRY_pop01").hide();
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_FerryDeparture_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetFERRYPortData($("#input_FERRY_Departure").val().toUpperCase());
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
				$("#input_FERRY_Departure").val(ui.item.value);
				$("#input_FERRY_POL").val(ui.item.code);
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
$(document).on("keyup", "#input_FERRY_Arrival", function (e) {

	if (e.keyCode == 13) {

	} else {
		//input_POD 초기화
		if (_fnToNull($(this).val()) == "") {
			$("#input_FERRY_POD").val("");
		}

		//출발 도시 바로 선택 화면 가리기
		if ($(this).val().length > 0) {
			$("#select_FERRY_pop02").hide();
		}
		else if ($(this).val().length == 0) {
			$("#select_FERRY_pop02").hide();
		}

		//autocomplete
		$(this).autocomplete({
			minLength: 3,
			open: function (event, ui) {
				$(this).autocomplete("widget").css({
					"width": $("#AC_FerryArrival_Width").width()
				});
			},
			source: function (request, response) {
				var result = fnGetFERRYPortData($("#input_FERRY_Arrival").val().toUpperCase());
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
					$("#input_FERRY_Arrival").val(ui.item.value);
					$("#input_FERRY_POD").val(ui.item.code);
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
$(document).on("click", "#btn_FERRYSchedule_Search", function () {

	$("table[name='Main_FERRYTable_List'] th button").removeClass();
	_FERRY_OrderBy = "";
	_FERRY_Sort = "";
	_vPage = 0;
	fnGetFERRYScheduleData();
});

//더보기 버튼 이벤트
$(document).on("click", "#Btn_FERRYScheduleMore button", function () {

	//_FERRY_OrderBy = "";
	//_FERRY_Sort = "";

	if (fnFERRYCheckCarr()) {
		fnGetFERRYScheduleData();
	} else {
		_vPage = 0;
		fnGetFERRYScheduleData();
	}
});

//부킹 버튼 - 이벤트
$(document).on("click", "a[name='btn_FERRY_Booking']", function () {
	_fnAlertMsg_point("<p class=\"margin_top20\">하기 담당자에게 연락바랍니다.</p></br><p>송유진 사원</p><p class=\"info\">TEL. 070-8666-6928</p><p class=\"info\">E-MAIL: export1@ilsimls.co.kr</p>");

	//if (_fnToNull($("#Session_USR_ID").val()) != "") {
	//	fnFREEYSetBooking($(this).siblings("input[type='hidden']").val());
	//} else {
	//	fnShowLoginLayer("goFERRYBooking;" + $(this).siblings("input[type='hidden']").val());
	//}
});

//부킹 마감
$(document).on("click", "a[name='btn_FERRY_Booking_Close']", function () {
	_fnAlertMsg_point("<p class=\"margin_top20\">하기 담당자에게 연락바랍니다.</p></br><p>송유진 사원</p><p class=\"info\">TEL. 070-8666-6928</p><p class=\"info\">E-MAIL: export1@ilsimls.co.kr</p>");
	//_fnAlertMsg("<span style=\"color:red\">마감 된 스케줄</span>입니다.");
});

////////////////////////function///////////////////////
//port 정보 가져오는 함수
function fnGetFERRYPortData(vValue) {
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
function fnVali_FERRYSchedule() {

	//ETD를 입력 해 주세요.
	if (_fnToNull($("#input_FERRY_ETD").val().replace(/-/gi, "")) == "") {
		alert("ETD를 입력 해 주세요.","input_FERRY_ETD");		
		return false;
	}

	//POL을 입력 해 주세요.
	if (_fnToNull($("#input_FERRY_Departure").val()) == "") {
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_FERRY_Departure");
		return false;
	}

	if (_fnToNull($("#input_FERRY_Arrival").val()) == "") {
		_fnAlertMsg("출발 · 도착지를 선택해주세요.","input_FERRY_Arrival");
		return false;
	}

	return true;
}

//스케줄 데이터 가져오는 함수
function fnGetFERRYScheduleData() {

	try {

		if (fnVali_FERRYSchedule()) {

			var rtnJson;
			var objJsonData = new Object();

			//실제 데이터 전송
			objJsonData.REQ_SVC = "SEA";
			objJsonData.LINE_TYPE = "F"; //Line(L) : 선사 , Ferry(F) : 훼리
			objJsonData.CNTR_TYPE = $("#select_FERRY_CntrType").find("option:selected").val();

			objJsonData.POL = $("#input_FERRY_Departure").val();
			objJsonData.POL_CD = $("#input_FERRY_POL").val();
			objJsonData.POD = $("#input_FERRY_Arrival").val();
			objJsonData.POD_CD = $("#input_FERRY_POD").val();
			objJsonData.ETD_START = $("#input_FERRY_ETD").val().replace(/-/gi, "");
			objJsonData.ETD_END = "";
			objJsonData.ID = "";
			objJsonData.ORDER = "";

			if (_vPage == 0) {
				_FERRYObjCheck.POL = $("#input_FERRY_Departure").val();
				_FERRYObjCheck.POL_CD = $("#input_FERRY_POL").val();
				_FERRYObjCheck.POD = $("#input_FERRY_Arrival").val();
				_FERRYObjCheck.POD_CD = $("#input_FERRY_POD").val();
				_FERRYObjCheck.ETD_START = $("#input_FERRY_ETD").val().replace(/-/gi, "");
				_FERRYObjCheck.CNTR_TYPE = $("#select_FERRY_CntrType").find("option:selected").val();

				objJsonData.PAGE = 1;
				_vPage = 1;
			} else {
				_vPage++;
				objJsonData.PAGE = _vPage;
			}

			//Sort
			if (_fnToNull(_FERRY_OrderBy) != "" || _fnToNull(_FERRY_Sort) != "") {
				objJsonData.ID = _FERRY_OrderBy;
				objJsonData.ORDER = _FERRY_Sort;
			} else {
				objJsonData.ID = "";
				objJsonData.ORDER = "";
			}

			$.ajax({
				type: "POST",
				url: "/Home/fnGetSEASchedule",
				async: true,
				dataType: "json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					//alert(result);
					$("#NoData_FERRY").hide();
					fnMakeFERRYSchedule(result);
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
			$("table[name='Main_FERRYTable_List'] th button").removeClass();
		}

	} catch (e) {
		console.log(e.message);
	}
}

//훼리 스케줄 Booking 클릭 시
function fnFREEYSetBooking(vSCH_NO) {
	try {

		var objJsonData = new Object();
		objJsonData.SCH_NO = vSCH_NO;

		sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_FERRY");
		sessionStorage.setItem("VIEW_NAME", "REGIST");
		sessionStorage.setItem("POL_CD", $("#input_FERRY_POL").val());
		sessionStorage.setItem("POD_CD", $("#input_FERRY_POD").val());
		sessionStorage.setItem("POL_NM", $("#input_FERRY_Departure").val());
		sessionStorage.setItem("POD_NM", $("#input_FERRY_Arrival").val());
		sessionStorage.setItem("ETD", $("#input_FERRY_ETD").val());
		sessionStorage.setItem("CNTR_TYPE", $("#select_FERRY_CntrType").find("option:selected").val());
		sessionStorage.setItem("LINE_TYPE", 'FERRY');

		controllerToLink("Regist", "Booking", objJsonData);

	}
	catch (err) {
		console.log("[Error - fnFREEYSetBooking]" + err.message);
	}
}

//더보기 눌렀을 시 처음 검색조건과 상이할 경우 재 검색
function fnFERRYCheckCarr() {
	var vCheck = true;

	if (_FERRYObjCheck.POL_CD != $("#input_FERRY_POL").val()) {
		vCheck = false;
	}
	else if (_FERRYObjCheck.POD_CD != $("#input_FERRY_POD").val()) {
		vCheck = false;
	}
	else if (_FERRYObjCheck.ETD_START != $("#input_FERRY_ETD").val().replace(/-/gi, "")) {
		vCheck = false;
	}
	else if (_FERRYObjCheck.CNTR_TYPE != $("#select_FERRY_CntrType").find("option:selected").val()) {
		vCheck = false;
	}

	return vCheck;
}
/////////////////function MakeList/////////////////////
//FERRY 스케줄 만들기
function fnMakeFERRYSchedule(vJsonData) {
	var vHTML = "";

	try {
		//스케줄 데이터 만들기
		var vResult = JSON.parse(vJsonData).Schedule;
		var vMorePage = true;

		//초기화
		if (_vPage == 1) {
			$("#FERRY_Schedule_AREA").eq(0).empty();
		}
		if (vResult == undefined) {
			_FERRY_isSearch = false;
			$("#Btn_FERRYScheduleMore").hide();
			vHTML += " <span>데이터가 없습니다.</span> ";
			$("#NoData_FERRY")[0].innerHTML = vHTML;
			vHTML = "";
			$("#NoData_FERRY").show();
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
				_FERRY_isSearch = true;
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
					vHTML += "   	<td> ";

					//Service
					vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);

					//if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
					//	vHTML += "";
					//} else {
					//	vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
					//	vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
					//}

					vHTML += "   	</td> ";

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
						if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
							vHTML += "			<a href=\"javascript:void(0)\"  class=\"btn_type1 gray\" style='cursor:default'>BOOKING</a>";
						} else {
							if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_FERRY_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
							} else {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_FERRY_Booking\" class=\"btn_type1\">BOOKING</a>";
							}
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
					vHTML += "   						<th>Service</th> ";

					vHTML += " <td> ";
					vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
					vHTML += " </td> ";

					//if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
					//	vHTML += "   						<td></td> ";
					//} else {
					//	vHTML += "   						<td>" + String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ") " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"])) + "</td> ";
					//}

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
						if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
							vHTML += "			<a href=\"javascript:void(0)\"  class=\"btn_type1 gray\" style='cursor:default'>BOOKING</a>";
						} else {
							if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_FERRY_Booking_Close\" class=\"btn_type1 btnClose\">BOOKING</a>";
							} else {
								vHTML += "			<a href=\"javascript:void(0)\" name=\"btn_FERRY_Booking\" class=\"btn_type1\">BOOKING</a>";
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
					$("#Btn_FERRYScheduleMore").show();
				} else {
					$("#Btn_FERRYScheduleMore").hide();
				}
			}
			else {
				_FERRY_isSearch = false;
				$("#Btn_FERRYScheduleMore").hide();
				vHTML += " <span>데이터가 없습니다.</span> ";
				$("#NoData_FERRY")[0].innerHTML = vHTML;
				$("#NoData_FERRY").show();
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

		$("#FERRY_Schedule_AREA").eq(0).append(vHTML);
		$("#FERRY_Schedule_AREA").show();
	} catch (e) {
		console.log(e.message);
	}
}
////////////////////////API////////////////////////////
