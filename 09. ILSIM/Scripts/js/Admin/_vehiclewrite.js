////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vVehicle_MngtNo = ""; //Delete 할 때 관리번호
var _vVehicle_SEQ = ""; //Delete 할 때 SEQ

////////////////////jquery event///////////////////////
$(function () {
	fnSetVehicleDiv();		
});


//수정 버튼 클릭 이벤트
$(document).on("click", "#Modify_Vehicle", function () {
	fnInsertVehicle("UPDATE");
});

//저장 버튼 클릭 이벤트
$(document).on("click", "#Insert_Vehicle", function () {
	fnInsertVehicle("INSERT");
});

//차량 제원 리스트로 이동
$(document).on("click", "#Move_VehicleList", function () {
	location.href = "/Admin/VehicleAdmin";
});

//차량 제원 저장 완료 후 페이지 이동
$(document).on("click", "#btn_save_complete", function () {
	location.href = "/Admin/VehicleAdmin";
});


////////////////////////function///////////////////////
//차량 제원 - Select 구분 데이터 가져오기
function fnSetVehicleDiv() {

	try {
		$.ajax({
			type: "POST",
			url: "/Admin/fnSetVehicleDiv",
			async: true,
			cache: false,
			dataType: "Json",
			success: function (result) {
				fnMakeVehicleDiv(result);
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[error - fnSetVehicleDiv]" + err.message);
	}
}

//차량제원 신규 저장
function fnInsertVehicle(vCRUD) {
	try {
		if (fnValidation()) {
			//var objJsonData = new Object();
			//objJsonData.CAR_DIV_CODE = $("#select_vehicle_div").find('option:selected').val();
						
			vfileData = new FormData(); //Form 초기화

			//파일을 선택 했는지 체크
			if ($("#input_file_upload").get(0).files[0] != undefined) {
				vfileData.append("IS_FILE", "Y");
				vfileData.append("fileInput", $("#input_file_upload").get(0).files[0]);
			} else {
				vfileData.append("IS_FILE", "N");
			}
			vfileData.append("MNGT_NO", $("#View_MNGT_NO").val());   
			vfileData.append("SEQ", $("#View_SEQ").val());   
			vfileData.append("USR_ID", $("#Session_USR_ID").val());   
			vfileData.append("CAR_DIV", $("#select_vehicle_div option:selected").text());   
			vfileData.append("CAR_DIV_CODE", $("#select_vehicle_div option:selected").val());   
			vfileData.append("CAR_NAME", $("#input_CAR_NAME").val());   
			vfileData.append("SHORTHAND", $("#input_SHORTHAND").val()); 
			vfileData.append("CAR_WIDTH", $("#input_CAR_WIDTH").val()); 
			vfileData.append("TOP_HEIGHT", $("#input_TOP_HEIGHT").val());   
			vfileData.append("BOTTOM_HEIGHT", $("#input_BOTTOM_HEIGHT").val());   
			vfileData.append("CAR_AREA", $("#input_CAR_AREA").val());   
			vfileData.append("CAR_WEIGHT", $("#input_CAR_WEIGHT").val());   
			vfileData.append("CAR_CBM", $("#input_CAR_CBM").val());  
			vfileData.append("TOTAL_HEIGHT", $("#input_TOTAL_HEIGHT").val());  
			vfileData.append("RMK", $("#textarea_RMK").val()); 
			vfileData.append("DB_CRUD", vCRUD);   

			$.ajax({
				type: "POST",
				url: "/Admin/fnInsertVehicle",
				async: true,
				cache: false,
				dataType: "Json",
				data: vfileData,
				contentType: false, // Not to set any content header
				processData: false, // Not to process data
				success: function (result) {
					if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
						if (vCRUD == "INSERT") {
							fnCompleteAlert("저장 완료 하였습니다.");
						}
						else if (vCRUD == "UPDATE") {
							fnCompleteAlert("수정 완료 하였습니다.");
                        }
					}
					else if (JSON.parse(result).Result[0]["trxCode"] == "N") {

						if (vCRUD == "INSERT") {							
							_fnAlertMsg("저장을 실패 하였습니다.");
						}
						else if (vCRUD == "UPDATE") {
							_fnAlertMsg("수정을 실패 하였습니다.");
						}
						console.log("[Fail - fnInsertVehicle]" + JSON.parse(result).Result[0]["trxMsg"]);
					}
					else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
						_fnAlertMsg("담당자에게 문의 하세요.");
						console.log("[Error - fnInsertVehicle]" + JSON.parse(result).Result[0]["trxMsg"]);
					}
				}, error: function (xhr) {
					$("#ProgressBar_Loading").hide(); //프로그래스 바
					alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
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

	} catch (err) {
		console.log("[Error - fnInsertVehicle]" + err.message);
    }

}

//밸리데이션
function fnValidation() {

	//명칭 밸리데이션
	if (_fnToNull($("#input_CAR_NAME").val() == "")) {
		_fnAlertMsg("명칭을 입력 해 주세요.", "input_CAR_NAME");
		return false;
	}
	
	//약칭 밸리데이션
	if (_fnToNull($("#input_SHORTHAND").val() == "")) {
		_fnAlertMsg("약칭을 입력 해 주세요.", "input_SHORTHAND");
		return false;
	}
	
	//적재함 길이 밸리데이션
	if (_fnToNull($("#input_CAR_WIDTH").val() == "")) {
		_fnAlertMsg("적재함 길이을 입력 해 주세요.", "input_CAR_WIDTH");
		return false;
	}
	
	//탑높이 밸리데이션
	if (_fnToNull($("#input_TOP_HEIGHT").val() == "")) {
		_fnAlertMsg("탑높이를 입력 해 주세요.", "input_TOP_HEIGHT");
		return false;
	}
	
	//바닥높이 밸리데이션
	if (_fnToNull($("#input_BOTTOM_HEIGHT").val() == "")) {
		_fnAlertMsg("바닥높이을 입력 해 주세요.", "input_BOTTOM_HEIGHT");
		return false;
	}
	
	//적재함 넓이 밸리데이션
	if (_fnToNull($("#input_CAR_AREA").val() == "")) {
		_fnAlertMsg("적재함을 입력 해 주세요.", "input_CAR_AREA");
		return false;
	}
	
	//적재중량 밸리데이션
	if (_fnToNull($("#input_CAR_WEIGHT").val() == "")) {
		_fnAlertMsg("적재중량을 입력 해 주세요.", "input_CAR_WEIGHT");
		return false;
	}
	
	//적재부피 밸리데이션
	if (_fnToNull($("#input_CAR_CBM").val() == "")) {
		_fnAlertMsg("적재부피을 입력 해 주세요.", "input_CAR_CBM");
		return false;
	}
	
	//차량 총 높이 밸리데이션
	if (_fnToNull($("#input_TOTAL_HEIGHT").val() == "")) {
		_fnAlertMsg("차량 총 높이을 입력 해 주세요.", "input_TOTAL_HEIGHT");
		return false;
	}

	return true;
}

//완료 후 alert창
function fnCompleteAlert(msg) {
	$("#layer_complete_alert .inner").html(msg);
	layerPopup2('#layer_complete_alert');
	$("#btn_save_complete").focus();
}


/////////////////function MakeList/////////////////////
//차량 제원 - Select 구분 만들기
function fnMakeVehicleDiv(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		//vHTML += "<option value=\"\" selected>전체</option>";
		
		$.each(vResult, function (i) {

			if (_fnToNull($("#View_CAR_DIV_CODE").val()) != "" && _fnToNull($("#View_CAR_DIV_CODE").val()) == _fnToNull(vResult[i]["CAR_DIV_CODE"])) {
				vHTML += "<option value=\"" + _fnToNull(vResult[i]["CAR_DIV_CODE"]) + "\" selected>" + _fnToNull(vResult[i]["CAR_DIV"]) + "</option>";			
			}
			else {
				vHTML += "<option value=\"" + _fnToNull(vResult[i]["CAR_DIV_CODE"]) + "\">" + _fnToNull(vResult[i]["CAR_DIV"]) + "</option>";			
			}

		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"\">Select</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		console.log("[fnMakeVehicleDiv]Error : " + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_vehicle_div")[0].innerHTML = vHTML;
}
////////////////////////API////////////////////////////