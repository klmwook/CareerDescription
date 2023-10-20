////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {

	//관리번호가 있을 경우
	if (_fnToNull($("#View_MNGT_NO").val()) != "") {
		$("#select_YearQuarter").val($("#View_PERIOD_YEAR").val() + "_" + $("#View_PERIOD_QUARTER").val()).prop('selected', true); //기간_분기
		//%/원 
		if (_fnToZero($("#View_P_RATE_PRICE").val()) != 0) {
			$("#select_RATE").val("P_RATE_PRICE").prop("selected", true);
		} 
		else if (_fnToZero($("#View_P_RATE_WON").val()) != 0) {
			$("#select_RATE").val("P_RATE_WON").prop("selected", true);
		}
		$("#select_EXCEPTION").val($("#View_EXCEPTION").val()).prop('selected', true); //예외처리
    }
});

//신규 클릭 시 이동
$(document).on("click", "#List_btn_TariffPR", function () {
	location.href = "/Admin/TariffPremium";
});

//등록 버튼 이벤트
$(document).on("click", "#Insert_btn_TariffPR", function () {
	fnInsertTariffPR();
});

//수정 버튼 이벤트
$(document).on("click", "#Update_btn_TariffPR", function () {
	fnUpdateTariffPR();
});

//저장 , 수정 후 이동
$(document).on("click", "#btn_save_complete", function () {
	location.href = "/Admin/TariffPremium";
});

////////////////////////function///////////////////////
//저장
function fnInsertTariffPR() {
	try {
		var objJsonData = new Object();

		var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

		objJsonData.YEAR = vYear_Quarter[0]; //년
		objJsonData.QUARTER = vYear_Quarter[1]; //분기		
		objJsonData.P_RATE_NAME = _fnToNull($("#input_Name").val());

		if ($("#select_RATE option:selected").val() == "P_RATE_PRICE") {
			objJsonData.P_RATE_PRICE = $("#input_PRICE").val();
			objJsonData.P_RATE_WON = "0";
		}
		else if ($("#select_RATE option:selected").val() == "P_RATE_WON") {
			objJsonData.P_RATE_PRICE = "0";
			objJsonData.P_RATE_WON = $("#input_PRICE").val();
		}

		objJsonData.EXCEPTION = $("#select_EXCEPTION option:selected").val();
		objJsonData.USR_ID = $("#Session_USR_ID").val();

		$.ajax({
			type: "POST",
			url: "/Admin/fnInsertTariffPR",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {				
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnCompleteAlert("저장이 완료 되었습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					console.log("[Fail : fnInsertSurcharge()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("저장을 실패 하였습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					console.log("[Error : fnInsertSurcharge()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("관리자에게 문의하세요.");
				}
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error - fnSetPRYearQuarter]" + err.message);
	}
}

//수정 
function fnUpdateTariffPR() {
	try {
		var objJsonData = new Object();

		var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

		objJsonData.MNGT_NO = $("#View_MNGT_NO").val();
		objJsonData.SEQ = $("#View_SEQ").val();

		objJsonData.YEAR = vYear_Quarter[0]; //년
		objJsonData.QUARTER = vYear_Quarter[1]; //분기		
		objJsonData.P_RATE_NAME = _fnToNull($("#input_Name").val());

		if ($("#select_RATE option:selected").val() == "P_RATE_PRICE") {
			objJsonData.P_RATE_PRICE = $("#input_PRICE").val();
			objJsonData.P_RATE_WON = "0";
		}
		else if ($("#select_RATE option:selected").val() == "P_RATE_WON") {
			objJsonData.P_RATE_PRICE = "0";
			objJsonData.P_RATE_WON = $("#input_PRICE").val();
		}

		objJsonData.EXCEPTION = $("#select_EXCEPTION option:selected").val();
		objJsonData.USR_ID = $("#Session_USR_ID").val();

		$.ajax({
			type: "POST",
			url: "/Admin/fnUpdateTariffPR",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnCompleteAlert("수정이 완료 되었습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					console.log("[Fail : fnUpdateTariffPR()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("수정을 실패 하였습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					console.log("[Error : fnUpdateTariffPR()]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("관리자에게 문의하세요.");
				}
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error - fnUpdateTariffPR]" + err.message);
	}
}

//완료 후 alert창
function fnCompleteAlert(msg) {
	$("#layer_complete_alert .inner").html(msg);
	layerPopup2('#layer_complete_alert');
	$("#btn_save_complete").focus();
}


/////////////////function MakeList/////////////////////


////////////////////////API////////////////////////////

