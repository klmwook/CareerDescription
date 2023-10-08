////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//$(function () {
//	
//});

//number 클릭 시 이벤트
$(document).on("click", "input[type='number']", function () {
	fnSetCBM();
});

//CBM 라디오 버튼 단위 
$(document).on("change", "input[name='cbm_unit_value']", function () {
	fnSetCBM();
});

$(document).on("keyup", "#cbm_length", function (e) {
	$(this).val(fnSetOnlyNum($(this).val()));
	fnSetCBM();

	if (e.keyCode == 13) {
		$("#cbm_width").focus();
    }
});

$(document).on("keyup", "#cbm_width", function (e) {
	$(this).val(fnSetOnlyNum($(this).val()));
	fnSetCBM();

	if (e.keyCode == 13) {
		$("#cbm_height").focus();
	}
});

$(document).on("keyup", "#cbm_height", function (e) {
	$(this).val(fnSetOnlyNum($(this).val()));
	fnSetCBM();

	if (e.keyCode == 13) {
		$("#cbm_quantity").focus();
	}
});

$(document).on("keyup", "#cbm_quantity", function () {
	fnSetCBM();
});

//버튼 클릭 이벤트
$(document).on("click", "#cbm_search", function () {
	fnSetCBM();
});

////////////////////////function///////////////////////
//숫자를 제외한 나머지 replace
function fnSetOnlyNum(vValue) {
	var vValue_Num = vValue.replace(/[^0-9]/g, "");
	return vValue_Num;
}

function fnSetCBM() {

	var vCheckUnit = $("input[name='cbm_unit_value']:checked").val();
	var vUnit_Curr = 0;

	//단위 체크
	$("span[name='cbm_unit_text']").text(vCheckUnit);

	if (vCheckUnit == "mm") {
		vUnit_Curr = 1
	}
	else if (vCheckUnit == "cm") {
		vUnit_Curr = 10
	}
	else if (vCheckUnit == "m") {
		vUnit_Curr = 1000
	}

	var vCBM_length = $("#cbm_length").val();
	var vCBM_width = $("#cbm_width").val();
	var vCBM_height = $("#cbm_height").val(); 
	var vCBM_quantity = $("#cbm_quantity").val();

	//가로 , 세로 , 길이 변환
	if (_fnToNull(vCBM_width) != "") {
		vCBM_width = Number(vCBM_width) * vUnit_Curr;
	} else {
		vCBM_width = 0;
	}

	if (_fnToNull(vCBM_height) != "") {
		vCBM_height = Number(vCBM_height) * vUnit_Curr;
	} else {
		vCBM_height = 0;
	}		

	if (_fnToNull(vCBM_length) != "") {
		vCBM_length = Number(vCBM_length) * vUnit_Curr;
	} else {
		vCBM_length = 0;
	}

	//폭 체크
	if (vCBM_width > 2350) {
		alert("폭이 2미터 35센티를 넘을 경우 계산이 제한됩니다.\n(※ HC, RF, FR, OT 등 스페셜 컨테이너는 별도 확인필요)");
		$("#cbm_width").val("").focus();
		return false;
	}
	//폭체크

	//높이 체크
	if (vCBM_height > 2280) {
		alert("높이는 2미터 28센티를 넘을 경우 계산이 제한됩니다.\n(※ HC, RF, FR, OT 등 스페셜 컨테이너는 별도 확인필요)");
		$("#cbm_height").val("").focus();
		return false;
	}
	//높이체크

	var vCBM = Number(vCBM_width) * Number(vCBM_height) * Number(vCBM_length) / 1000000000
	var vCBM_SUM = vCBM * Number(vCBM_quantity);
	var vKG_SUM = (vCBM / 0.006) * Number(vCBM_quantity);

	if (vCBM_width != "" && vCBM_height != "" && vCBM_length != "") {
		$("#cbm_result").val(vCBM_SUM.toFixed(3));
		$("#cbm_air_result").val(vKG_SUM.toFixed(2));

		//var v20FT = (33 / Number(vCBM.toFixed(3))).toFixed(0);

		//$("#cbm_20FT_result").val(fnSetComma((33 / Number(vCBM.toFixed(3))).toFixed(0))); //FT20
		//$("#cbm_40FT_result").val(fnSetComma((66 / Number(vCBM.toFixed(3))).toFixed(0))); //FT40
		//$("#cbm_40HC_result").val(fnSetComma((77 / Number(vCBM.toFixed(3))).toFixed(0))); //HQ40

		//무한대 값 나올 경우 빈값
		if ($("#cbm_result").val() == "Infinity") {
			$("#cbm_result").val("");
		}

		if ($("#cbm_air_result").val() == "Infinity") {
			$("#cbm_air_result").val("");
		}

		//if ($("#cbm_20FT_result").val() == "Infinity") {
		//	$("#cbm_20FT_result").val("");
		//}
		//
		//if ($("#cbm_40FT_result").val() == "Infinity") {
		//	$("#cbm_40FT_result").val("");
		//}
		//
		//if ($("#cbm_40HC_result").val() == "Infinity") {
		//	$("#cbm_40HC_result").val("");
		//}

	}
	else {
		$("#cbm_result").val("");
		$("#cbm_air_result").val("");
		//$("#cbm_20FT_result").val("");
		//$("#cbm_40FT_result").val("");
		//$("#cbm_40HC_result").val("");
	}
}

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

