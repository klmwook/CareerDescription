////////////////////전역 변수//////////////////////////
var _LCLObjCheck = new Object();
////////////////////jquery event///////////////////////
$(function () {
	$("#input_LCL_ETD").val(_fnPlusDate(0));
	fnGetLCLBound();
});

//날짜 validation 체크
$(document).on("focusout", "#input_LCL_ETD", function () {

	if ($(this).val().length > 0) {
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
    }
	
});

//퀵 Code - POL
$(document).on("click", "#input_LCL_Departure", function () {
	if ($("#input_LCL_Departure").val().length == 0) {
		$("#select_LCL_pop01").hide();
		$("#select_LCL_pop02").hide();
		selectPopOpen("#select_LCL_pop01");
	}
});

//퀵 Code - POD
$(document).on("click", "#input_LCL_Arrival", function () {
	if ($("#input_LCL_Arrival").val().length == 0) {
		$("#select_LCL_pop01").hide();
		$("#select_LCL_pop02").hide();
		selectPopOpen("#select_LCL_pop02");
	}
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_LCL_POLCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_LCL_Departure").val(vSplit[0]);
	$("#input_LCL_POL").val(vSplit[1]);
	$("#select_LCL_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POL", "Q", "select_LCL_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
	selectPopOpen("#select_LCL_pop02");
});

$(document).on("click", "#quick_LCL_POLCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_LCL_Departure").val(vSplit[0]);
	$("#input_LCL_POL").val(vSplit[1]);
	$("#select_LCL_pop01").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POL", "Q", "select_LCL_pop01")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
	selectPopOpen("#select_LCL_pop02");
});

//퀵 Code 데이터 - POL
$(document).on("click", "#quick_LCL_PODCD button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_LCL_Arrival").val(vSplit[0]);
	$("#input_LCL_POD").val(vSplit[1]);
	$("#select_LCL_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POD", "Q", "select_LCL_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});

//퀵 Code 데이터 - POD
$(document).on("click", "#quick_LCL_PODCD2 button", function () {

	//split 해서 네이밍 , POL_CD 넣기
	var vValue = $(this).val();
	var vSplit = vValue.split(";");

	$("#input_LCL_Arrival").val(vSplit[0]);
	$("#input_LCL_POD").val(vSplit[1]);
	$("#select_LCL_pop02").hide();

	if (_fnCheckSamePort(vSplit[1], "SEA", "POD", "Q", "select_LCL_pop02")) {
		//X박스 만들기
		$(this).closest(".int_box").addClass("has_del");
		$(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
	}
});


//자동완성 기능 - POL
$(document).on("keyup", "#input_LCL_Departure", function () {

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_LCL_POL").val("");
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_LCLDeparture_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetLCLPortData($("#input_LCL_Departure").val().toUpperCase());
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
				$("#input_LCL_Departure").val(ui.item.value);
				$("#input_LCL_POL").val(ui.item.code);
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
$(document).on("keyup", "#input_LCL_Arrival", function (e) {

	if (e.keyCode == 13) {

	} else {
		//input_POD 초기화
		if (_fnToNull($(this).val()) == "") {
			$("#input_LCL_POD").val("");
		}

		//autocomplete
		$(this).autocomplete({
			minLength: 3,
			open: function (event, ui) {
				$(this).autocomplete("widget").css({
					"width": $("#AC_LCLArrival_Width").width()
				});
			},
			source: function (request, response) {
				var result = fnGetLCLPortData($("#input_LCL_Arrival").val().toUpperCase());
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
					$("#input_LCL_Arrival").val(ui.item.value);
					$("#input_LCL_POD").val(ui.item.code);
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
$(document).on("click", "#btn_LCLSchedule_Search", function () {
	fnGetLCLScheduleData();
});

//부킹 버튼 - 이벤트
$(document).on("click", "button[name='btn_LCL_Booking']", function () {	

	if (_fnToNull($("#Session_USR_ID").val()) != "") {		
		fnLCLSetBooking(this);
	} else {
		fnShowLoginLayer("goLCLBooking;" + $(this).siblings("input[name='input_SCH_NO']").val() + ";" + $(this).siblings("input[name='input_SEQ']").val());
	}
});

//부킹 마감
$(document).on("click", "button[name='btn_LCL_Booking_Close']", function () {
	_fnAlertMsg("서류마감 된 스케줄입니다.");
});
////////////////////////function///////////////////////
//LCL 대륙 BOUND 데이터 공통코드에서 가져오기
function fnGetLCLBound() {
	try
	{
		$.ajax({
			type: "POST",
			url: "/Common/fnGetLCLBound",
			async: false,
			dataType: "json",
			success: function (result) {
				fnMakeLCLBound(result);
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
	}
	catch (err)
	{
		console.log("[Error - fnGetLCLBound]" + err.message);
    }
}


//port 정보 가져오는 함수
function fnGetLCLPortData(vValue) {
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
function fnVali_LCLSchedule() {

	//if (_fnToNull($("#select_LCL_Bound").find("option:selected").val()) == "") {
	//	_fnAlertMsg("BOUND를 선택 해 주세요.");
	//	return false;
    //}

	//ETD를 입력 해 주세요.
	//if (_fnToNull($("#input_LCL_ETD").val().replace(/-/gi, "")) == "") {
	//	_fnAlertMsg("ETD를 입력 해 주세요.", "input_LCL_ETD");
	//	return false;
	//}

	//POL을 입력 해 주세요.
	//if (_fnToNull($("#input_LCL_Departure").val()) == "") {
	//	_fnAlertMsg("출발 · 도착지를 선택해주세요.", "input_LCL_Departure");
	//	return false;
	//}
	//
	//if (_fnToNull($("#input_LCL_Arrival").val()) == "") {
	//	_fnAlertMsg("출발 · 도착지를 선택해주세요.", "input_LCL_Arrival");
	//	return false;
	//}

	return true;
}

//스케줄 데이터 가져오기
function fnGetLCLScheduleData() {

	try {

		if (fnVali_LCLSchedule()) {

			var rtnJson;
			var objJsonData = new Object();			

			objJsonData.AREA_CD = $("#select_LCL_Bound").find("option:selected").val();
			objJsonData.POL = _fnToNull($("#input_LCL_Departure").val());
			objJsonData.POL_CD = _fnToNull($("#input_LCL_POL").val());
			objJsonData.POD = _fnToNull($("#input_LCL_Arrival").val());
			objJsonData.POD_CD = _fnToNull($("#input_LCL_POD").val());
			objJsonData.ETD_START = $("#input_LCL_ETD").val().replace(/-/gi, "");			

			$.ajax({
				type: "POST",
				url: "/Home/fnGetLCLSchedule",
				async: true,
				dataType: "json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					$("#NoData_LCL").hide();
					fnMakeLCLSchedule(result);
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
		}

	} catch (e) {
		console.log(e.message);
	}
}

//선사 스케줄 Booking 클릭 시
function fnLCLSetBooking(vThis) {
	try {

		var objJsonData = new Object();
		objJsonData.SCH_NO = $(vThis).siblings("input[name='input_SCH_NO']").val();
		objJsonData.SEQ = $(vThis).siblings("input[name='input_SEQ']").val();

		sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_LCL");
		sessionStorage.setItem("VIEW_NAME", "REGIST");
		sessionStorage.setItem("LCL_BOUND", $("#select_LCL_Bound").find("option:selected").val());
		sessionStorage.setItem("POL_CD", $("#input_LCL_POL").val());
		sessionStorage.setItem("POD_CD", $("#input_LCL_POD").val());
		sessionStorage.setItem("POL_NM", $("#input_LCL_Departure").val());
		sessionStorage.setItem("POD_NM", $("#input_LCL_Arrival").val());
		sessionStorage.setItem("ETD", $("#input_LCL_ETD").val());
		sessionStorage.setItem("LINE_TYPE", 'SEA');
		sessionStorage.setItem("CNTR_TYPE", 'LCL');

		controllerToLink("Regist", "Booking", objJsonData);
	}
	catch (err) {
		console.log("[Error - fnLCLSetBooking]" + err.message);
	}
}
/////////////////function MakeList/////////////////////
//LCL 대륙 BOUND 데이터 공통코드 그려주기 
function fnMakeLCLBound(vJsonData) {
	try {
		var vHTML = "";
		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
		{
			var vResult = JSON.parse(vJsonData).Bound;

			vHTML += " <option value=\"\">ALL</option> ";

			$.each(vResult, function (i) {
				vHTML += " <option value=\"" + vResult[i]["CODE"] + "\">" + vResult[i]["NAME"]+"</option> ";
			});

		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
		{
			var vResult = JSON.parse(vJsonData).Bound;

			vHTML += " <option value=\"\">ALL</option> ";
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E")
		{
			var vResult = JSON.parse(vJsonData).Bound;

			vHTML += " <option value=\"\">담당자에게 문의하세요.</option> ";
		}

		$("#select_LCL_Bound")[0].innerHTML = vHTML;
	}
	catch (err) {
		console.log(err.message);
    }
}

//SEA 스케줄 만들기
function fnMakeLCLSchedule(vJsonData) {
	var vHTML = "";

	try {
				
		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
			var vResult = JSON.parse(vJsonData).Schedule;

			for (var i = 0; i < vResult.length; i++) {

				//MST
				vHTML += "   <div class=\"lcl-continent\"> ";
				vHTML += "   	<h4 class=\"lcl-area__title\">" + vResult[i]["AREA_NM"] +"</h4> ";
				vHTML += "   	<div class=\"lcl-area__box\"> ";
				vHTML += "   		<div class=\"lcl-area__desc\"> ";
				vHTML += "   			<div class=\"lcl-desc\"> ";
				vHTML += "   				<div class=\"lcl-desc__line polpod\"> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">POL</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\">" + vResult[i]["POL_NM"]+"</div> ";
				vHTML += "   					</div> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">POD</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\">" + vResult[i]["POD_NM"] +"</div> ";
				vHTML += "   					</div> ";
				vHTML += "   				</div> ";
				vHTML += "   				<div class=\"lcl-desc__line\"> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">담당자</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\"> ";
				vHTML += "   							<p>" + vResult[i]["SCH_PIC"] +"</p> ";
				vHTML += "   						</div> ";
				vHTML += "   					</div> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">이메일</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\"> ";
				vHTML += "   							<p>" + vResult[i]["EMAIL"] +"</p> ";
				vHTML += "   						</div> ";
				vHTML += "   					</div> ";
				vHTML += "   				</div> ";
				vHTML += "   				<div class=\"lcl-desc__line\"> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">반입지</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\"> ";
				vHTML += "   							<p>" + vResult[i]["POL_TML_NM"] +"</p> ";
				vHTML += "   						</div> ";
				vHTML += "   					</div> ";
				vHTML += "   					<div class=\"lcl-desc__inner\"> ";
				vHTML += "   						<div class=\"lcl-desc__title\">비고</div> ";
				vHTML += "   						<div class=\"lcl-desc__cont\"> ";
				if (_fnToNull(vResult[i]["RMK"]) != "") {
					vHTML += "   							<p>" + vResult[i]["RMK"].replace(/\n/gi, "<br/>") + "</p> ";
				} else {
					vHTML += "   							<p></p> ";
                }
				vHTML += "   						</div> ";
				vHTML += "   					</div> ";
				vHTML += "   				</div> ";
				vHTML += "   			</div> ";
				vHTML += "   		</div> ";
				vHTML += "   		<p class=\"lcl-notice\">※ 안내된 스케줄은 기상 및 PORT 상황에 따라 변경될 수 있습니다. 선적 진행시, 다시 안내 드리겠습니다.</p> ";
				vHTML += "   		<div class=\"lcl-tbl\"> ";
				vHTML += "   			<div class=\"lcl-tbl__head\"> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>VESSLE</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>VOYAGE</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>DOC CLS</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>CARGO CLS</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>ETD</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>ETA</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"><p>LINE</p></div> ";
				vHTML += "   				<div class=\"lcl-tbl__cont\"></div> ";
				vHTML += "   			</div> ";
				vHTML += "   			<div class=\"lcl-tbl__body\"> ";

				//DTL
				for (var j = 0; j < vResult[i]["DTL_ROW"]; j++) {					
					vHTML += "   				<div class=\"lcl-tbl__line\"> ";
					//vHTML += "   					<div class=\"lcl-tbl__cont\"><span>VESSEL</span><p>" + vResult[(j+i)]["VSL"] +"</p></div> ";
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>VESSEL</span><a href=\"https://www.marinetraffic.com/\" target=\"_blank\">" + vResult[(j + i)]["VSL"] + "</a></div> ";
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>VOYAGE</span><p>" + vResult[(j + i)]["VOY"] +"</p></div> ";

					//DOC CLOSE 공백으로 데이터가 들어올 경우는 공백 처리
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>DOC CLS</span>";					
					if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) != "") {
						var vPREV_CLOSE = _fnSetDate(vResult[j + i]["DOC_CLOSE_YMD"], '-1').replace(/-/gi, "");
						if (_fnToNull(vResult[j + i]["DOC_CLOSE_HM"]) != "") {
							if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) + _fnFormatHHMMTime(_fnToNull(vResult[j + i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								vHTML += "   					<p style='color:red'>";
							}
							else if (vPREV_CLOSE <= _fnGetTodayStamp()) {
								vHTML += "   					<p style='color:orange'>";
							} else {
								vHTML += "   					<p>";
							}
						}
						else {
							if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) < _fnGetTodayStamp()) {
								vHTML += "   					<p style='color:red'>";
							}
							else if (vPREV_CLOSE == _fnGetTodayStamp()) {
								vHTML += "   					<p style='color:orange'>";
							} else {
								vHTML += "   					<p>";
							}
						}

						vHTML += _fnCK_DateFormat(_fnToNull(vResult[(j + i)]["DOC_CLOSE_YMD"])) + " ";
						if (_fnToNull(vResult[(j + i)]["DOC_CLOSE_HM"]) != "") {
							vHTML += _fnFormatHHMMTime(_fnToNull(vResult[(j + i)]["DOC_CLOSE_HM"]));
						}
					} else {
						vHTML += "   					<p>-";						
                    }					
					vHTML += "   					</p></div>";

					//CARGO
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>CARGO CLS</span><p>";					
					if (_fnToNull(vResult[(j + i)]["CARGO_CLOSE_YMD"]) != "") {
						vHTML += _fnCK_DateFormat(_fnToNull(vResult[(j + i)]["CARGO_CLOSE_YMD"])) + " ";
						if (_fnToNull(vResult[(j + i)]["CARGO_CLOSE_HM"]) != "") {
							vHTML += _fnFormatHHMMTime(_fnToNull(vResult[(j + i)]["CARGO_CLOSE_HM"]));
						}
					}
					else {
						vHTML += "   					<p>-";
					}
					vHTML += "   					</p></div>";
					
					//ETD
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>ETD</span><p>";
					if (_fnToNull(vResult[(j + i)]["ETD"]) != "") {
						vHTML += _fnCK_DateFormat(_fnToNull(vResult[(j + i)]["ETD"])) + " ";
						if (_fnToNull(vResult[(j + i)]["ETD_HM"]) != "") {
							vHTML += _fnFormatHHMMTime(_fnToNull(vResult[(j + i)]["ETD_HM"]));
						}
					} else {
						vHTML += "   					<p>-";
                    }
					vHTML += "   					</p></div>";

					//ETA
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>ETA</span><p>";
					if (_fnToNull(vResult[(j + i)]["ETA"]) != "") {
						vHTML += _fnCK_DateFormat(_fnToNull(vResult[(j + i)]["ETA"])) + " ";
						if (_fnToNull(vResult[(j + i)]["ETA_HM"]) != "") {
							vHTML += _fnFormatHHMMTime(_fnToNull(vResult[(j + i)]["ETA_HM"]));
						}
					} else {
						vHTML += "   					<p>-";
                    }

					vHTML += "   					</p></div>";
					vHTML += "   					<div class=\"lcl-tbl__cont\"><span>LINE</span><p>" + _fnToNull(vResult[(j + i)]["LINE_NM"]) + "</p></div> ";
					vHTML += "   					<div class=\"lcl-tbl__cont\"> ";

					//DOC_CLOSE_YMD가 없을 경우에는 버튼이 숨겨져서 나오게 표기
					if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
						vHTML += "   						<button type=\"button\" class=\"btns quot_confirm gray\" style='cursor:default'>견적 확인</button> ";
					} else {
						if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) != "") {
							vHTML += "							<input type=\"hidden\" name=\"input_SCH_NO\" value=\"" + _fnToNull(vResult[(j + i)]["SCH_NO"]) + "\" /> ";
							vHTML += "							<input type=\"hidden\" name=\"input_SEQ\" value=\"" + _fnToNull(vResult[(j + i)]["SEQ"]) + "\" /> ";
							if (_fnToNull(vResult[j + i]["DOC_CLOSE_HM"]) != "") {
								vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking\">견적 확인</button> ";
								//if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) + _fnFormatHHMMTime(_fnToNull(vResult[j + i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
								//	vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking_Close\">견적 확인</button> ";
								//} else {
								//	vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking\">견적 확인</button> ";
								//}
							}
							else {
								vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking\">견적 확인</button> ";
								//if (_fnToNull(vResult[j + i]["DOC_CLOSE_YMD"]) < _fnGetTodayStamp()) {
								//	vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking_Close\">견적 확인</button> ";
								//} else {
								//	vHTML += "   						<button type=\"button\" class=\"btns quot_confirm\" name=\"btn_LCL_Booking\">견적 확인</button> ";
								//}
							}
						}
                    }

					vHTML += "   					</div> ";
					vHTML += "   				</div> ";
				}

				//END MST
				vHTML += "   			</div> ";
				vHTML += "   			<p>위 선명을 클릭하시면 선박 위치를 안내하는 사이트로 연결됩니다.</p> "; //sihong - 문구 추가
				vHTML += "   		</div> ";
				vHTML += "   	</div> ";
				vHTML += "   </div> ";

				//DTL 카운트 만큼 i 플러스 시켜주기
				i = i + vResult[i]["DTL_ROW"] -1;
			}

			$("#LCL_Schedule_AREA")[0].innerHTML = vHTML;
			$("#LCL_Schedule_AREA").show();
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

			vHTML += " <span>별도로 안내를 드려야 하는 운송 구간 입니다. <br/> ";
			vHTML += " 아래 담당자를 찾아주시면 안내 드리겠습니다.  <br/> <br/> ";
			vHTML += " TEL : 02-712-7200 <br> ";
			vHTML += " E-MAIL : SEOUL@CKPANASIA.COM<br> ";
			vHTML += " LCL 담당자 : 웰컴 매니저 임   춘<br> ";
			//vHTML += " FCL 담당자 : 웰컴 매니저 최 락명</span> ";
			//vHTML += " 항공 담당자 : 웰컴 매니저 방 기문</span> ";

			$("#NoData_LCL")[0].innerHTML = vHTML;
			$("#NoData_LCL").show();
			$("#LCL_Schedule_AREA").hide();
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
			vHTML += " <span>관리자에게 문의하세요.</span> ";
			$("#NoData_LCL")[0].innerHTML = vHTML;
			$("#NoData_LCL").show();
			$("#LCL_Schedule_AREA").hide();
		}
		
	} catch (err) {
		console.log("[Error - fnMakeLCLSchedule]"+err.message);
	}
}
////////////////////////API////////////////////////////

