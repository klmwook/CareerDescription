////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {	

	if ($("#View_MNGT_NO").val() != "") {
		fnSetAddrState();
		fnSetAddrCity($("#View_ADDR_STATE").val());
		fnSetAddrTownship($("#View_ADDR_STATE").val(), $("#View_ADDR_CITY").val());

		//세팅
		$("#select_YearQuarter").val($("#View_PERIOD_YEAR").val() + "_" + $("#View_PERIOD_QUARTER").val()).prop("selected", true);
		$("#select_Section").val($("#View_SECTION").val()).prop("selected", true);
		$("#select_AddrState").val($("#View_ADDR_STATE").val()).prop("selected", true);
		$("#select_AddrCity").val($("#View_ADDR_CITY").val()).prop("selected", true);
		$("#select_AddrTownship").val($("#View_ADDR_TOWNSHIP").val()).prop("selected", true);
	} else {
		fnSetAddrState();
    }
});

//구분 변경 시 가격 변경
$(document).on("change", "#select_Type", function () {
	fnGetCntrPrice($(this).find("option:selected").val());
});

//행선지 전체(시.도)
$(document).on("change", "#select_AddrState", function () {

	fnSelectReset("select_AddrCity", "전체(시,군.구)");
	fnSelectReset("select_AddrTownship", "전체(읍,면,동)");

	if ($(this).find('option:selected').val() != "") {
		fnSetAddrCity($(this).find('option:selected').val());
	}
});

//행선지 전체(시.도)
$(document).on("change", "#select_AddrCity", function () {

	fnSelectReset("select_AddrTownship", "전체(읍,면,동)");

	if ($(this).find('option:selected').val() != "") {
		fnSetAddrTownship($("#select_AddrState").find('option:selected').val(), $(this).find('option:selected').val());
	}
});

//수정 버튼
$(document).on("click", "#btn_Tariff_Modify", function () {
	fnUpdateTariff();
});

//목록 클릭 시 이동
$(document).on("click", "#btn_Tariff_List", function () {
	location.href = "/Admin/TariffAdmin";
});

//저장 , 수정 후 이동
$(document).on("click", "#btn_save_complete", function () {
	location.href = "/Admin/TariffAdmin";
});

////////////////////////function///////////////////////
//전체(시.도) 데이터 가져오기
function fnSetAddrState() {

	var objJsonData = new Object();

	$.ajax({
		type: "POST",
		url: "/Admin/fnSetAddrState",
		async: false,
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
		url: "/Admin/fnSetAddrCity",
		async: false,
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

//전체(읍,면,동) 데이터 가져오기
function fnSetAddrTownship(vITEM1, vITEM2) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;
	objJsonData.OPT_ITEM2 = vITEM2;

	$.ajax({
		type: "POST",
		url: "/Admin/fnSetAddrTownship",
		async: false,
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

function fnSelectReset(vID, vText) {
	$("#" + vID).empty();

	var vHTML = "";
	vHTML = "<option value=\"\">" + vText + "</option>";

	$("#" + vID)[0].innerHTML = vHTML;
}

//구분 고르고 20FT , 40FT 가격 변경하기
function fnGetCntrPrice(vType) {
	try {
		var objJsonData = new Object();
		objJsonData.MNGT_NO = $("#View_MNGT_NO").val();
		objJsonData.SEQ = $("#View_SEQ").val();
		objJsonData.TYPE = vType

		$.ajax({
			type: "POST",
			url: "/Admin/fnGetCntrPrice",
			async: false,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnSetCntrPrice(result);
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	}
	catch (err) {
		console.log("[Error - fnGetPrice]"+err.message);
    }
}

//20FT , 40FT 세팅
function fnSetCntrPrice(vJsonData) {
	try {
		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
			$("#input_CNTR_20FT").val(_fnToZero(JSON.parse(vJsonData).Tariff[0]["CNTR_20FT"]));
			$("#input_CNTR_40FT").val(_fnToZero(JSON.parse(vJsonData).Tariff[0]["CNTR_40FT"]));
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
			_fnAlertMsg("데이터가 없습니다.");
			console.log("[Fail - fnSetPrice]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
			_fnAlertMsg("담당자에게 문의하세요.");
			console.log("[Error - fnSetPrice]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}
	}
	catch (err) {
		console.log("[Error - fnSetPrice]" + err.message);
    }
}

//수정 버튼 클릭
function fnUpdateTariff() {
	try {
		var objJsonData = new Object();

		objJsonData.MNGT_NO = $("#View_MNGT_NO").val();
		objJsonData.SEQ = $("#View_SEQ").val();
		objJsonData.TYPE = $("#select_Type option:selected").val();
		//objJsonData.PORT = $("#select_Port").val();
		objJsonData.ADDR_STATE = $("#select_AddrState option:selected").val();
		objJsonData.ADDR_CITY = $("#select_AddrCity option:selected").val();
		objJsonData.ADDR_TOWNSHIP = $("#select_AddrTownship option:selected").val();
		objJsonData.CNTR_20FT = $("#input_CNTR_20FT").val();
		objJsonData.CNTR_40FT = $("#input_CNTR_40FT").val();
		objJsonData.DISTANCE = $("#input_DISTANCE").val();
		objJsonData.USR_ID = $("#Session_USR_ID").val();

		$.ajax({
			type: "POST",
			url: "/Admin/fnUpdateTariff",
			async: false,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnCompleteAlert("수정이 완료 되었습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					console.log("[Fail : fnUpdateTariff()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("수정을 실패 하였습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					console.log("[Error : fnUpdateTariff()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("관리자에게 문의하세요.");
				}
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	}
	catch (err) {
		console.log("[Error - fnUpdateTariff]" + err.message);
	}
}

//완료 후 alert창
function fnCompleteAlert(msg) {
	$("#layer_complete_alert .inner").html(msg);
	layerPopup2('#layer_complete_alert');
	$("#btn_save_complete").focus();
}

/////////////////function MakeList/////////////////////
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

		console.log("[Fail - fnMakeAddrState]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
		console.log("[Error - fnMakeAddrState]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
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

		console.log("[Fail - fnMakeAddrCity]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
		console.log("[Error - fnMakeAddrCity]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_AddrCity")[0].innerHTML = vHTML;
}

//행선지 - 전체(읍,면,동)
function fnMakeAddrTownship(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM3"] + "\">" + vResult[i]["OPT_ITEM3"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

		console.log("[Fail - fnMakeAddrTownship]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
		console.log("[Error - fnMakeAddrTownship]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_AddrTownship")[0].innerHTML = vHTML;
}


////////////////////////API////////////////////////////

