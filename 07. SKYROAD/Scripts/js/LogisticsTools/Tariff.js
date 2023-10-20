////////////////////전역 변수//////////////////////////
var _Sort_Order = "";
var _Sort_ID = "";

////////////////////jquery event///////////////////////
$(function () {

	//분기 세팅
	fnSetYearQuarter();
	fnSetSection();
	fnSetAddrState();
	fnSetPremiumRate(); //할증 데이터 가져오기
	
});

//input 체크박스 선택 1개만 가능하게 하는 이벤트
//function fnSelectOnlyOne(vClass,vName) {
//	$("." + vClass).prop("checked", false);
//
//	$("input[name='"+vName+"']").prop("checked", true);
//}

//
//$(document).on("click", "input[name='chk_cntr_type']", function () {
//	$(this).prop("")
//});

//분기 변경
$(document).on("change", "#select_YearQuarter", function () {
	$(".tariff_add_option").removeClass("on");
	fnSetSection();
	fnSetPremiumRate(); //할증 데이터 가져오기



});

$(document).on("click", "#thead_Tariff_Result th", function () {
	//hasClass로 Desc가 있는지 없는지 확인 후
	//전역 변수에 데이터 넣기
	//그리고 검색 함수 불러오기

	if (_fnToNull($(this).find("button").attr("id")) != "") {	
		if ($(this).find("button").hasClass("desc")) {
			$(this).find("button").removeClass("desc");
			_Sort_Order = "ASC";
			_Sort_ID = _fnToNull($(this).find("button").attr("id"));
		} else {
			$(this).find("button").addClass("desc");
			_Sort_Order = "DESC";
			_Sort_ID = _fnToNull($(this).find("button").attr("id"));
		}

		fnTariffSerach();
    }
});

//타리프 검색
$(document).on("click", "#Tariff_Search", function () {
	_Sort_Order = "";
	_Sort_ID = "";
	fninitSort();
	fnTariffSerach();
});

//체크박스 Only one
$(document).on("click", "input[name='chk_cntr_type']", function () {
	if ($(this).prop("checked") == true) {
		$("input[name='chk_cntr_type']").prop("checked", false);
		$(this).prop("checked", true);
	} else {
		$(this).prop("checked", false);
	}
});

//체크박스 Only one
$(document).on("click", "input[name='chk_BabTail']", function () {
	if ($(this).prop("checked") == true) {
		$("input[name='chk_BabTail']").prop("checked", false);
		$(this).prop("checked", true);		
	} else {
		$(this).prop("checked", false);
	}
});

//체크박스 Only one
$(document).on("click", "input[name='chk_DC']", function () {
	if ($(this).prop("checked") == true) {
		$("input[name='chk_DC']").prop("checked", false);
		$(this).prop("checked", true);
	} else {
		$(this).prop("checked", false);
	}
});

//계산 버튼 클릭
$(document).on("click", "#Cal_btn", function () {	
	alert(fnCal_PR(698700, _vPR) + fnCal_EP());
});

//행선지 전체(시.도)
$(document).on("change", "#select_AddrState", function () {

	fnSelectReset("select_AddrCity", "전체(시,군.구)");
	fnSelectReset("select_AddrTownship", "전체(읍,면,동 - 행정동)");
	fnSelectReset("select_AddrTownship2", "전체(읍,면,동 - 법정동)");

	if ($(this).find('option:selected').val() != "") {		
		fnSetAddrCity($(this).find('option:selected').val());
	} 
});

//행선지 전체(시,군,구)
$(document).on("change", "#select_AddrCity", function () {

	fnSelectReset("select_AddrTownship", "전체(읍,면,동 - 행정동)");
	fnSelectReset("select_AddrTownship2", "전체(읍,면,동 - 법정동)");

	if ($(this).find('option:selected').val() != "") {		
		fnSetAddrTownship($("#select_AddrState").find('option:selected').val(), $(this).find('option:selected').val());
		fnSetAddrTownship2($("#select_AddrState").find('option:selected').val(), $(this).find('option:selected').val());
	}
});

//행정동 클릭 시 - 법정동 클리어
$(document).on("change", "#select_AddrTownship", function () {
	$("#select_AddrTownship2").val("");
});

//법정동 클릭 시 행정동 클릭 되게 수정
$(document).on("change", "#select_AddrTownship2", function () {
	$("#select_AddrTownship").val($(this).find("option:selected").val());
});

//할증 체크박스
$(document).on("click", ".PR_Check", function () {
	fnSetPR(); //1.할증 세팅
	fnTariffSerach(); //2. 검색
});

// 할증 테이블 on/off
$(document).on("click", "#Tariff_Premium", function () {
	if ($("#tariff_PrimiumRate_Area").html() == "") {
		$("#tariff_menu").attr("disabled", true);
		$(".tariff_add_option").removeClass("on");
	} else {
		$('.tariff_add_option').toggleClass("on");
    }
});

//기점 변경 시 장소 초기화
$(document).on("change", "#select_Section", function () {
	$("#select_AddrState").val("");
	fnSelectReset("select_AddrCity", "전체(시,군.구)");
	fnSelectReset("select_AddrTownship", "전체(읍,면,동 - 행정동)");
	fnSelectReset("select_AddrTownship2", "전체(읍,면,동 - 법정동)");
});


////////////////////////function///////////////////////
//년 / 분기 세팅
function fnSetYearQuarter() {
	try {
		var objJsonData = new Object();

		$.ajax({
			type: "POST",
			url: "/LogisticsTools/fnSetYearQuarter",
			async: false,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				//alert(result);
				fnMakeYearQuarter(result);
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err)
	{
		console.log("[Error - fnSetYearQuarter]" + err.message);
    }
}

//전체(시.도) 데이터 가져오기
function fnSetAddrState() {
		
	var objJsonData = new Object();

	$.ajax({
		type: "POST",
		url: "/LogisticsTools/fnSetAddrState",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			//alert(result);
			fnMakeAddrState(result);
		}, error: function (xhr) {
			alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//전체(시.군.구) 데이터 가져오기
function fnSetAddrCity(vITEM1) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;

	$.ajax({
		type: "POST",
		url: "/LogisticsTools/fnSetAddrCity",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeAddrCity(result);
		}, error: function (xhr) {
			alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//전체(읍,면,동 - 행정동) 데이터 가져오기
function fnSetAddrTownship(vITEM1, vITEM2) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;
	objJsonData.OPT_ITEM2 = vITEM2;

	$.ajax({
		type: "POST",
		url: "/LogisticsTools/fnSetAddrTownship",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeAddrTownship(result);
		}, error: function (xhr) {
			alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//전체(읍,면,동 - 법정동) 데이터 가져오기
function fnSetAddrTownship2(vITEM1, vITEM2) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;
	objJsonData.OPT_ITEM2 = vITEM2;

	$.ajax({
		type: "POST",
		url: "/LogisticsTools/fnSetAddrTownship2",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeAddrTownship2(result);
		}, error: function (xhr) {
			alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//기점 데이터 가져오기
function fnSetSection() {

	try {
		var objJsonData = new Object();	

		if (fnCheckData()) {
			var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

			objJsonData.PERIOD_YEAR = vYear_Quarter[0]; //년
			objJsonData.PERIOD_QUARTER = vYear_Quarter[1]; //분기		

			$.ajax({
				type: "POST",
				url: "/LogisticsTools/fnSetSection",
				async: false,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					fnMakeSetSection(result);
				}, error: function (xhr) {
					$("#ProgressBar_Loading").hide(); //프로그래스 바
					_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
					console.log(xhr);
				},
				beforeSend: function () {
					$("#ProgressBar_Loading").show(); //프로그래스 바
				},
				complete: function () {
					$("#ProgressBar_Loading").hide(); //프로그래스 바
				}
			});
        }

		
	}
	catch (err) {
		console.log("[Error - fnSetSection]" + err.message);
	}
}

//안전운임제 데이터 있는지 체크
function fnCheckData() {
	try {
		if (_fnToNull($("#select_YearQuarter option:selected").val()) == "") {
			var vHTML = "";
			vHTML += "<option value=\"\">구간</option>";
			$("#select_Section")[0].innerHTML = vHTML;

			return false;
		}
		else {
			return true;
        }
	}
	catch (err) {
		console.log("[Error - fnCheckData()]" + err.message);
    }
}

//할증 데이터 가져오기
function fnSetPremiumRate() {

	try {
		if (fnCheckRate()) {
			var objJsonData = new Object();
			var vSplit = $("#select_YearQuarter option:selected").val().split("_");

			objJsonData.PERIOD_YEAR = vSplit[0];
			objJsonData.PERIOD_QUARTER = vSplit[1];

			$.ajax({
				type: "POST",
				url: "/LogisticsTools/fnSetPremiumRate",
				async: true,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					fnMakePrimiumRate(result);
					//alert(result);
				}, error: function (xhr) {
					alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
					console.log(xhr);
				}
			});
        }
	}
	catch (err) {
		console.log("[Error - fnSetPremiumRate]" + err.message);
    }

	
}

//할증 데이터 있는지 체크
function fnCheckRate() {
	try {
		if (_fnToNull($("#select_YearQuarter option:selected").val()) == "") {
			return false;
		}
		else {
			return true;
		}
	}
	catch (err) {
		console.log("[Error - fnCheckData()]" + err.message);
	}
}

//안전운임 검색
function fnTariffSerach() {

	try {
		if (fnSearchCheck()) {
			//필수 값 설정
			var objJsonData = new Object();

			//년_분기
			var vYear_Quarter = $("#select_YearQuarter").val().split("_");

			objJsonData.YEAR = vYear_Quarter[0]; //년
			objJsonData.QUARTER = vYear_Quarter[1]; //분기
			objJsonData.TYPE = $("#select_Type").find('option:selected').val();

			//편도 , 왕복 찾기
			//if ($("#select_Section").find('option:selected').val().indexOf("왕복") > -1) {
			//	objJsonData.SECTION_TYPE = "왕복";
			//}
			//else if ($("#select_Section").find('option:selected').val().indexOf("편도") > -1) {
			//	objJsonData.SECTION_TYPE = "편도";
			//}
			//else {
			//	objJsonData.SECTION_TYPE = "";
			//}

			//objJsonData.SECTION = $("#select_Section").find('option:selected').val();

			var vSECTION = $("#select_Section option:selected").val().split("_");

			//TWKIM - 변경
			objJsonData.PORT = vSECTION[0]; //PORT
			objJsonData.SECTION = vSECTION[1]; //편도 , 왕복

			if (_fnToNull($("#select_AddrState").find('option:selected').val()) != "") {
				objJsonData.ADDRSTATE = $("#select_AddrState").find('option:selected').val();
			} else {
				objJsonData.ADDRSTATE = "";
			}

			if (_fnToNull($("#select_AddrCity").find('option:selected').val()) != "") {
				objJsonData.ADDRCITY = $("#select_AddrCity").find('option:selected').val();
			} else {
				objJsonData.ADDRCITY = "";
			}

			if (_fnToNull($("#select_AddrTownship").find('option:selected').val()) != "") {
				objJsonData.ADDRTOWNSHIP = $("#select_AddrTownship").find('option:selected').val();
			} else {
				objJsonData.ADDRTOWNSHIP = "";
			}

			//Sort
			if (_fnToNull(_Sort_Order) != "") {
				objJsonData.ORDER = _Sort_Order
			} else {
				objJsonData.ORDER = "";
			}

			if (_fnToNull(_Sort_ID) != "") {
				if (_Sort_ID == "20FT" || _Sort_ID == "40FT") {
					objJsonData.ID = "TO_NUMBER(" + $("#select_Type").find('option:selected').val() + "_" + _Sort_ID + ")";
				} else {
					objJsonData.ID = _Sort_ID;
				}
			} else {
				objJsonData.ID = "";
			}

			$.ajax({
				type: "POST",
				url: "/LogisticsTools/fnTariffSerach",
				async: true,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					$("#Tariff_Nodata").hide();
					fnMakeTariffData(result);
				}, error: function (xhr) {
					alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
					console.log(xhr);
				}
			});
		}
	}
	catch (err) {
		console.log("[Error - fnTariffSerach]" + err.message);
    }
}

//안전운임제 검색 시 밸리데이션 체크
function fnSearchCheck() {
	try {
		if (_fnToNull($("#select_YearQuarter option:selected").val()) == "") {
			var vHTML = "";
			vHTML += " <span>데이터가 없습니다.</span>"

			$("#Tariff_Nodata")[0].innerHTML = vHTML;
			$("#Tariff_Nodata").show();

			return false;
		}
		else {
			return true;
		}
	}
	catch (err) {
		console.log("[Error - fnSearchCheck()]" + err.message);
    }
}

//Sort Desc 클래스 있는거 전부 초기화
function fninitSort() {
	$("#thead_Tariff_Result th button").removeClass("desc");
}
/////////////////function MakeList/////////////////////
function fnMakeSelectBox() {

	var vHTML = "";

	var i = 0;
	var j = 0;
	var k = 0;
	var l = 0; 

	vHTML += "   <tr> ";
	vHTML += "   	<th rowspan=\"10\">할증</th> ";
	vHTML += "   </tr> ";
	vHTML += "   <tr> ";
	vHTML += "   	<td> ";
	vHTML += "   		<div class=\"select_cover\"> ";
	vHTML += "   			<input type=\"checkbox\" class=\"chk_discount_CntrType\" name=\"chk_cntr_type" + i++ + "\" id=\"input_discount" + j++ + "\" onclick=\"fnSelectOnlyOne('chk_discount_CntrType','chk_cntr_type" + k++ +"')\" value=\"30\"/> ";
	vHTML += "   			<label id=\"input_discount" + l++ +"\">탱크 컨테이너(비위험물) 30%</label> ";
	vHTML += "   		</div> ";
	vHTML += "   	</td> ";
	vHTML += "   </tr> ";
	vHTML += "   <tr> ";
	vHTML += "   	<td> ";
	vHTML += "   		<div class=\"select_cover\"> ";
	vHTML += "   			<input type=\"checkbox\" class=\"chk_discount_CntrType\" name=\"chk_cntr_type" + i++ + "\" id=\"input_discount" + j++ + "\" onclick=\"fnSelectOnlyOne('chk_discount_CntrType','chk_cntr_type" + k++ +"')\" value=\"30\"/> ";
	vHTML += "   			<label id=\"input_discount" + l++ +"\">플렉시백 컨테이너 20%</label> ";
	vHTML += "   		</div> ";
	vHTML += "   	</td> ";
	vHTML += "   </tr> ";
	vHTML += "   <tr> ";
	vHTML += "   	<td> ";
	vHTML += "   		<div class=\"select_cover\"> ";
	vHTML += "   			<input type=\"checkbox\" class=\"chk_discount_CntrType\" name=\"chk_cntr_type" + i++ + "\" id=\"input_discount" + j++ + "\" onclick=\"fnSelectOnlyOne('chk_discount_CntrType','chk_cntr_type" + k++ +"')\" value=\"30\"/> ";
	vHTML += "   			<label id=\"input_discount" + l++ +"\">탱크 컨테이너(비위험물) 30%</label> ";
	vHTML += "   		</div> ";
	vHTML += "   	</td> ";
	vHTML += "   </tr> ";

	$("#discount_area")[0].innerHTML = vHTML;
}

//분기 / 년
function fnMakeYearQuarter(vJsonData) {

	//var vHTML = "";
	//vResult = JSON.parse(vJsonData).Table1;
	//
	//if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
	//	//vHTML += "<option value=\"\">전체(시,도)</option>";
	//
	//	$.each(vResult, function (i) {
	//		vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_YEAR"] + "년 " + vResult[i]["PERIOD_QUARTER"] +"분기</option>";
	//	});
	//}
	//else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
	//	vHTML += "<option value=\"\">데이터가 없습니다.</option>";
	//	console.log("[Fail - fnMakeYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	//	//데이터가 없습니다.
	//	//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	//}
	//else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
	//	_fnAlertMsg("담당자에게 문의하세요.");
	//	console.log("[Error - fnMakeYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	//}
	//
	//$("#select_YearQuarter")[0].innerHTML = vHTML;

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		//vHTML += "<option value=\"\">전체(시,도)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_NAME"]+"</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		vHTML += "<option value=\"\">데이터가 없습니다.</option>";
		console.log("[Fail - fnMakeYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		_fnAlertMsg("담당자에게 문의하세요.");
		console.log("[Error - fnMakeYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_YearQuarter")[0].innerHTML = vHTML;

}


//행선지 - 전체(시.도)
function fnMakeAddrState(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\">전체(시,도)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
	}

	$("#select_AddrState")[0].innerHTML = vHTML;
}

//행선지 - 전체(시.군.구)
function fnMakeAddrCity(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\">전체(시,군.구)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM2"] + "\">" + vResult[i]["OPT_ITEM2"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
	}

	$("#select_AddrCity")[0].innerHTML = vHTML;
}

//행선지 - 전체(읍,면,동 - 행정동)
function fnMakeAddrTownship(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\">전체(읍,면,동 - 행정동)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM3"] + "\">" + vResult[i]["OPT_ITEM3"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
	}

	$("#select_AddrTownship")[0].innerHTML = vHTML;
}

//행선지 - 전체(읍,면,동 - 법정동)
function fnMakeAddrTownship2(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\">전체(읍,면,동 - 법정동)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM3"] + "\">" + vResult[i]["OPT_ITEM4"] + "(" + vResult[i]["OPT_ITEM3"]+")</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
	}

	$("#select_AddrTownship2")[0].innerHTML = vHTML;
}

//기점 만들기
function fnMakeSetSection(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["PORT"] + "_" + vResult[i]["SECTION"] + "\">" + vResult[i]["PORT_NM"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		vHTML += "<option value=\"\">구간</option>";
		console.log("[Fail - fnMakeSetSection]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
		console.log("[Error - fnMakeSetSection]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_Section")[0].innerHTML = vHTML;
}

//할증 데이터 만들기
function fnMakePrimiumRate(vJsonData) {

	var vHTML = "";
	var vCount = 0;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		var vResult = JSON.parse(vJsonData).Table1;

		vHTML += "   <tr> ";
		vHTML += "   	<th class=\"mo\">할증</th> ";
		vHTML += "   </tr> ";
		vHTML += "   <tr> ";
		vHTML += " 		<th rowspan=\"2\" class=\"pc\">할증</th> ";
		vHTML += "   </tr> ";

		vHTML += "   <tr> ";
		vHTML += "		<td> ";
		//데이터가 없는 것 부터 만들기.. (공통 X)
		$.each(vResult, function (i) {		
			vHTML += "   <div class=\"select_cover\"> ";

			//원화 인지 아닌지 체크
			if (_fnToZero(vResult[i]["P_RATE_PRICE"]) != 0) {
				vHTML += "   	<input type=\"checkbox\" class=\"PR_Check input_checkbox_" + _fnToNull(vResult[i]["EXCEPTION"]) + "\" name=\"cntr_type\" id=\"PR_Check" + vCount + "\" value=\"" + _fnToZero(vResult[i]["P_RATE_PRICE"])+"\"/> ";
				vHTML += "   	<label for=\"PR_Check" + vCount + "\" class=\"\">" + _fnToNull(vResult[i]["P_RATE_NAME"])+" " + _fnToZero(vResult[i]["P_RATE_PRICE"])+"%</label> ";
			}
			else if (_fnToZero(vResult[i]["P_RATE_WON"]) != 0) {
				vHTML += "   	<input type=\"checkbox\" class=\"PR_Check input_checkbox_" + _fnToNull(vResult[i]["EXCEPTION"]) + "\" name=\"cntr_type\" id=\"PR_Check" + vCount + "\" value=\"" + _fnToZero(vResult[i]["P_RATE_WON"]) +"\"/> ";
				vHTML += "   	<label for=\"PR_Check" + vCount + "\" class=\"\">" + _fnToNull(vResult[i]["P_RATE_NAME"]) + " " + _fnToZero(vResult[i]["P_RATE_WON"]) + "원</label> ";
			}
			vHTML += "   </div> ";
			vCount++;
		});
		vHTML += "		</td> ";
		vHTML += "   </tr> ";
	}

	$("#tariff_PrimiumRate_Area")[0].innerHTML = vHTML;
}

function fnSelectReset(vID, vText) {
	$("#" + vID).empty();

	var vHTML = "";
	vHTML = "<option value=\"\">" + vText + "</option>";

	$("#" + vID)[0].innerHTML = vHTML;
}

//타리프 검색 결과 데이터 그리기
function fnMakeTariffData(vJsonData) {

	var vHTML = "";

	$("#tbody_Tariff_Result").empty();

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		var vResult = JSON.parse(vJsonData).Table1;

		$.each(vResult, function (i) {
			vHTML += "<tr> ";
			vHTML += "	<td><span class=\"data\">" + _fnToNull(vResult[i]["PORT"]) + "</span></td> ";
			vHTML += "	<td><span class=\"data\">" + _fnToNull(vResult[i]["ADDR_STATE"]) + "</span></td> ";
			vHTML += "	<td><span class=\"data\">" + _fnToNull(vResult[i]["ADDR_CITY"]) + "</span></td> ";
			vHTML += "	<td><span class=\"data\">" + _fnToNull(vResult[i]["ADDR_TOWNSHIP"]) + "</span></td> ";
			vHTML += "	<td><span class=\"data\">" + _fnToZero(vResult[i]["DISTANCE"]) + "</span></td> ";

			if ($("#select_Type").find('option:selected').val() == "TF") {
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["TF_20FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["TF_40FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "CF") {
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["CF_20FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["CF_40FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "IF") {
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["IF_20FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
				vHTML += "	<td><span class=\"data\">" + fnSetComma(fnCal_PR(Number(vResult[i]["IF_40FT"]), _vPR) + fnCal_EP()) + "</span></td> ";
			}

			vHTML += " <td class=\"mobile_layout\" colspan=\"7\"> ";
			vHTML += "     <div class=\"layout_type2\"> ";
			vHTML += "         <div class=\"row s1\"> ";
			vHTML += "             <span>" + vResult[i]["PORT"] + "</span> ";
			vHTML += "         </div> ";
			vHTML += "         <div class=\"row s3\"> ";
			vHTML += "             <table> ";
			vHTML += "                 <tbody> ";
			vHTML += "                     <tr> ";
			vHTML += "                         <th>행선지(시, 도)</th> ";
			vHTML += "                         <th>행선지(시, 군, 구)</th> ";
			vHTML += "                         <th>행선지 (읍, 면, 동)</th> ";
			vHTML += "                     </tr> ";
			vHTML += "                     <tr class=\"has_border_bt\"> ";
			vHTML += "                         <td>" + _fnToNull(vResult[i]["ADDR_STATE"]) + "</td> ";
			vHTML += "                         <td>" + _fnToNull(vResult[i]["ADDR_CITY"]) + "</td> ";
			vHTML += "                         <td>" + _fnToNull(vResult[i]["ADDR_TOWNSHIP"]) + "</td> ";
			vHTML += "                     </tr> ";
			vHTML += "                     <tr> ";
			vHTML += "                         <th>거리 (km)</th> ";
			vHTML += "                         <th>20ft (원)</th> ";
			vHTML += "                         <th>40ft (원)</th> ";
			vHTML += "                     </tr> ";
			vHTML += "                     <tr> ";
			vHTML += "                         <td>" + _fnToZero(vResult[i]["DISTANCE"]) + "</td> ";

			if ($("#select_Type").find('option:selected').val() == "TF") {
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["TF_20FT"]), _vPR) + fnCal_EP()) + "</td> ";
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["TF_40FT"]), _vPR) + fnCal_EP()) + "</td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "CF") {
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["CF_20FT"]), _vPR) + fnCal_EP()) + "</td> ";
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["CF_40FT"]), _vPR) + fnCal_EP()) + "</td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "IF") {
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["IF_20FT"]), _vPR) + fnCal_EP()) + "</td> ";
				vHTML += "	<td>" + fnSetComma(fnCal_PR(Number(vResult[i]["IF_40FT"]), _vPR) + fnCal_EP()) + "</td> ";
			}

			vHTML += "                     </tr> ";
			vHTML += "                 </tbody> ";
			vHTML += "             </table> ";
			vHTML += "         </div> ";
			vHTML += "     </div> ";
			vHTML += " </td> ";

			vHTML += "</tr> ";
		});

		$("#tbody_Tariff_Result")[0].innerHTML = vHTML;

	} else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

		vHTML += " <span>데이터가 없습니다.</span>"

		$("#Tariff_Nodata")[0].innerHTML = vHTML;
		$("#Tariff_Nodata").show();
	} else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {

		vHTML += " <span>관리자에게 문의하세요.</span>"

		$("#Tariff_Nodata")[0].innerHTML = vHTML;
		$("#Tariff_Nodata").show();
    }
}

////////////////////////API////////////////////////////

