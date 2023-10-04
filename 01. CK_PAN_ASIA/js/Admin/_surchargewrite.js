////////////////////전역 변수//////////////////////////
var _vDataIndex = 0; 
var _vDel_MngtNo = ""; //삭제 시 관리번호 저장
var _vDel_Seq = "";    //삭제 시 시퀀스 저장
var _vSetPort = "";    //수입 /수출 저장

////////////////////jquery event///////////////////////
$(function () {	

	//신규 , 수정 or 삭제 인지
	if (_fnToNull($("#global_Shipping").val()) == "")
	{
		//선사 인지 체크 후 변경
		fnSetSurchargePort(); //포트 데이터 가져오기
		fnMakeAddRow();	
	}
	else
	{	
		//데이터 검색
		fnSetModifySearch();	

		//select박스 설정
		$("#select_shipping option[value='" + $("#global_Shipping").val() + "']").attr("selected", true);
		$("#select_Surcharge_Bound option[value='" + $("#global_Bound").val() + "']").attr("selected", true);		
		$("#select_Surcharge_CntrType option[value='" + $("#global_CntrType").val() + "']").attr("selected", true);
		$("#select_Surcharge_CntrSize option[value='" + $("#global_CntrSize").val() + "']").attr("selected", true);

		//포트 검색 부터
		fnSetSurchargePort();
		$("#select_surcharge_port option[value='" + $("#global_Port").val() + "']").attr("selected", true);

		//select 박스 disabled
		$("#select_shipping").attr("disabled", true);
		$("#select_Surcharge_Bound").attr("disabled", true);
		$("#select_surcharge_port").attr("disabled", true);
		$("#select_Surcharge_CntrType").attr("disabled", true);
		$("#select_Surcharge_CntrSize").attr("disabled", true);
    }	
});

//Bound 수입 / 수출 변경 시
$(document).on("change", "#select_Surcharge_Bound", function () {
	fnMakeCountryOption();
});

//저장 클릭 이벤트
$(document).on("click", "#Surchage_Save_btn", function () {	
	fnInsertSurcharge();
});

//목록 클릭 이벤트
$(document).on("click", "._btn_list", function () {
	location.href = "/Admin/SurchargeAdmin";
});

////선사 변경 시 이벤트
$(document).on("change", "select[name='select_shipping']", function () {

	if ($(this).find("option:selected").val() == "S") {
		fnSetSurchargePort(); //포트 데이터 가져오기
		//fnSetSurchargeCountry("O");
		//$("#Country_Option_Area").show();
	}
	else if ($(this).find("option:selected").val() == "F") {
		fnSetSurchargePort(); //포트 데이터 가져오기
		//$("#Country_Option_Area").hide();
    }
});

//행추가 Add 버튼
$(document).on("click", "#surcharge_AddRowbtn", function () {
	fnMakeAddRow();	
});

//행삭제 del 버튼
$(document).on("click", "a[name='surcharge_DelRowbtn']", function () {
	$(this).closest("tr").remove();
});

$(document).on("click", "a[name='surcharge_Modifybtn']", function () {
	fnSurchargeModify($(this).closest("tr"));

	//수정 함수
});

//삭제 버튼 이벤트
$(document).on("click", "a[name='surcharge_Delbtn']", function () {

	_vDel_MngtNo = $(this).closest("tr").find("input[name='surcharge_MngtNo']").val();
	_vDel_Seq = $(this).closest("tr").find("input[name='surcharge_Seq']").val();
	_fnConfirmMsg("삭제 하시겠습니까?");
	$("#Layer_Confirm").addClass("surcharge_Delbtn");
	$(".surcharge_Delbtn").focus();
});

//부대비용 삭제 버튼 - Confirm 
$(document).on("click", ".surcharge_Delbtn", function () {
	fnSurchargeDelete();
});


//엔터 키 이벤트
$(document).on("keypress", "input[name='input_Sur_AddRow']", function (e) {
	if (e.keyCode == 13) {
		var vIndex = $(this).attr("data-index");
		$('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
    }
});

//숫자만 입력 되게.
$(document).on("keyup", "._only_num", function () {
	var vValue = $(this).val();
	//var position = this.selectionStart; //현재 포커스 되어있는 곳에 포지션을 둔다. 
	vValue = vValue.replace(/[^0-9]/g, "");
	$(this).val(fnSetComma(vValue));
	//this.setSelectionRange(position, position); //포커스 되어있는 곳에 포지션으로 이동한다.
});

//저장 , 수정 후 이동
$(document).on("click", "#btn_save_complete", function () {
	location.href = "/Admin/SurchargeAdmin";
});

//////////////////////////function///////////////////////
////포트 데이터 가져오기
function fnSetSurchargePort() {

	var objJsonData = new Object();

	//선사인지 훼리인지 체크
	objJsonData.PORT_TYPE = $("select[name='select_shipping']").val();

	$.ajax({
		type: "POST",
		url: "/Admin/fnSetSurchargePort",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeSetSurchargePort(result);
		}, error: function (xhr) {
			_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//국가 옵션 가지고 오기 (수출,수입)
function fnSetSurchargeCountry(vValue) {
	try {
		var objJsonData = new Object();

		objJsonData.BOUND = vValue;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetSurchargeCountry",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeSetSurchargeCountry(result);
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[fnSetSurchargeCountry]" + err);
	}
}

//국가 옵션 가지고 오기 (수출,수입) - 데이터 그려주기 위해 
function fnReturnCountry(vValue) {
	try {
		var objJsonData = new Object();

		var vResult = "";

		objJsonData.BOUND = vValue;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetSurchargeCountry",
			async: false,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				vResult = result;
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

		return vResult;

	} catch (err) {
		console.log("[fnSetSurchargeCountry]" + err);
	}
}

//부대비용 신규 저장 함수
function fnInsertSurcharge() {

	try {
		var arrData = new Array();

		$.each($("tr[name='Sur_AddRow']"), function (i) {

			var JsonData = new Object();

			JsonData.SHIPPING = $("#select_shipping").find("option:selected").val();
			JsonData.BOUND = $("#select_Surcharge_Bound").find("option:selected").val();
			JsonData.PORT = $("#select_surcharge_port").find("option:selected").val();
			JsonData.CNTR_TYPE = $("#select_Surcharge_CntrType").find("option:selected").val();
			JsonData.CNTR_SIZE = $("#select_Surcharge_CntrSize").find("option:selected").val();			
			JsonData.CONTENTS = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(0).find("input").val()
			JsonData.CODE = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(1).find("input").val()
			JsonData.UNIT = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(2).find("input").val()
			JsonData.CURRENCY = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(3).find("input").val()
			JsonData.PRICE = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(4).find("input").val().replace(/,/gi, "");
			JsonData.COUNTRY_OPTION = $("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select").find("option:selected").val();
			JsonData.INS_USR = _UserID;

			arrData.push(JsonData);
		});

		var objJsonData = JSON.parse(JSON.stringify(arrData));

		//ajax로 보내기
		$.ajax({
			type: "POST",
			url: "/Admin/fnInsertSurcharge",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {

				//성공 시 새로고침? 뭐 해야되지..?
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
				$("#ProgressBar_Loading").hide(); //프로그래스 바 
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}, beforeSend: function () {
				$("#ProgressBar_Loading").show(); //프로그래스 바 
			}, complete: function () {
				$("#ProgressBar_Loading").hide(); //프로그래스 바 
			}
		});
	}
	catch (err) {
		console.log("[fnSetSurchargeCountry]" + err);
	}
}

//수정 및 삭제 세팅
function fnSetModifySearch()
{
	try {
		var objJsonData = new Object();

		objJsonData.PORT_TYPE = $("#global_Shipping").val();
		objJsonData.BOUND = $("#global_Bound").val();
		objJsonData.PORT = $("#global_Port").val();
		objJsonData.CNTR_TYPE = $("#global_CntrType").val();
		objJsonData.CNTR_SIZE = $("#global_CntrSize").val();
		objJsonData.COUNTRY_OPTION = $("#global_Country").val();

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetModifySearch",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeModifyRow(result);				
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[fnSetSurchargeCountry]" + err);
	}
}

//부대비용 데이터 수정 함수
function fnSurchargeModify(vTr) {
	//데이터 전부 체크해서 수정하는것으로 변경

	try {
		var objJsonData = new Object();

		//objJsonData.CONTENTS = vTr.find("td").eq(0).find("input").val()
		objJsonData.CODE = vTr.find("td").eq(1).find("input").val()
		objJsonData.UNIT = vTr.find("td").eq(2).find("input").val()
		objJsonData.CURRENCY = vTr.find("td").eq(3).find("input").val()
		objJsonData.PRICE = vTr.find("td").eq(4).find("input").val().replace(/,/gi, "");
		objJsonData.COUNTRY_OPTION = vTr.find("td").eq(5).find("select").find("option:selected").val();
		objJsonData.MNGT_NO = vTr.find("input[name='surcharge_MngtNo']").val();
		objJsonData.SEQ = vTr.find("input[name='surcharge_Seq']").val();
		objJsonData.UPD_USR = _UserID;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSurchargeModify",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					//fnCompleteAlert("수정 완료 되었습니다.");
					_fnAlertMsg("수정 완료 되었습니다.");
					fnSetModifySearch();					
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					console.log("[Fail : fnSurchargeModify]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("수정 실패 하였습니다.\n관리자에게 문의 하세요.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					console.log("[Error : fnSurchargeModify]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("관리자에게 문의 하세요.");
				}
			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		_fnAlertMsg("관리자에게 문의하세요");
		console.log("[Error : fnSurchargeModify]" + err);
	}
}

//부대비용 데이터 삭제 함수
function fnSurchargeDelete() {

	try {
		var objJsonData = new Object();

		objJsonData.MNGT_NO = _vDel_MngtNo;
		objJsonData.SEQ = _vDel_Seq;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSurchargeDelete",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					_fnAlertMsg("삭제 완료 되었습니다.");
					fnSetModifySearch();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					console.log("[Fail : fnSurchargeDelete]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("삭제 실패 하였습니다.\n관리자에게 문의 하세요.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					console.log("[Error : fnSurchargeDelete]" + JSON.parse(result).Result[0]["trxMsg"]);
					_fnAlertMsg("관리자에게 문의 하세요.");
				}
			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		_fnAlertMsg("관리자에게 문의하세요");
		console.log("[Error : fnSurchargeDelete]" + err);
	}
	//관리번호와 시퀀스만 가지고 가서 삭제 시켜주기
}

//완료 후 alert창
function fnCompleteAlert(msg) {
	$("#layer_complete_alert .inner").html(msg);
	layerPopup2('#layer_complete_alert');
	$("#btn_save_complete").focus();
}



///////////////////function MakeList/////////////////////
////포트 정보 Select 데이터 그려주기
function fnMakeSetSurchargePort(vJsonData) {
	var vHTML = "";
	var vResult = "";

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vResult = JSON.parse(vJsonData).Table1;

		//vHTML += "<option value=\"\">PORT</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["PORT"]) + "\">" + _fnToNull(vResult[i]["PORT"]) + "</option>";
		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"기본\">기본</option>";
	}

	$("select[name='select_surcharge_port'")[0].innerHTML = vHTML;	
}

//국가 옵션 Select 데이터 그려주기
function fnMakeSetSurchargeCountry(vJsonData) {
	var vHTML = "";
	var vResult = "";

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vResult = JSON.parse(vJsonData).Table1;

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "\">" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "</option>";
		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"기본\">기본</option>";
	}

	$("select[name='select_Surcharge_Country_Option']")[0].innerHTML = vHTML;
}

//행 추가 그려주기 - 신규 버튼 저장 클릭 시
function fnMakeAddRow() {

	var vHTML = "";

	vHTML += "   <tr name=\"Sur_AddRow\"> ";
	vHTML += "   	<td> ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\"> ";
	vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"\" maxlength=\"140\" data-index=\"" + _vDataIndex+++"\" > ";
	vHTML += "   		</div>                                                           ";
	vHTML += "   	</td>                                                                ";
	vHTML += "   	<td>                                                                 ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
	vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"\" maxlength=\"7\" data-index=\"" + _vDataIndex++ +"\"> ";
	vHTML += "   		</div>                                                           ";
	vHTML += "   	</td>                                                                ";
	vHTML += "   	<td>                                                                 ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
	vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"\" maxlength=\"5\" data-index=\"" + _vDataIndex++ +"\"> ";
	vHTML += "   		</div>                                                           ";
	vHTML += "   	</td>                                                                ";
	vHTML += "   	<td>                                                                 ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
	vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"\" maxlength=\"5\" data-index=\"" + _vDataIndex++ +"\"> ";
	vHTML += "   		</div>                                                           ";
	vHTML += "   	</td>                                                                ";
	vHTML += "   	<td>                                                                 ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
	vHTML += "   			<input type=\"text\" class=\"form-control _only_num\" name=\"input_Sur_AddRow\" value=\"\" maxlength=\"14\" data-index=\"" + _vDataIndex++ +"\"> ";
	vHTML += "   		</div>                                                           ";
	vHTML += "   	</td>                                                                ";
	vHTML += "   	<td>  ";
	vHTML += "   		<div class=\"col-md-12 col-sm-12\">  ";
	vHTML += "   			<select class=\"form-control select\" name=\"select_Surcharge_Country_Option\"> ";
	vHTML += "					<option value=\"기본\">기본</option>";
	vHTML += "   			</select> ";
	vHTML += "   		</div> ";
	vHTML += "   	</td> ";
	vHTML += "   	<td>                                                                 ";
	vHTML += "   		<div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
	vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"surcharge_DelRowbtn\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;행삭제</a> ";
	vHTML += "   		</div> ";
	vHTML += "   	</td> ";
	vHTML += "   </tr> ";

	//$("#tbody_surchargeWrite_Result").prepend(vHTML);
	$("#tbody_surchargeWrite_Result").append(vHTML);

	fnMakeCountryOption();
}

function fnMakeCountryOption() {
	//국가 옵션을 위한 Select 변경
	var vHTML = "";

	var vResult = fnReturnCountry($("#select_Surcharge_Bound").find("option:selected").val());
	vResult = JSON.parse(vResult).Table1;

	//vHTML += "<option value=\"\">기본선택</option>";

	//vHTML 그려주기
	$.each(vResult, function (i) {
		vHTML += "<option value=\"" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "\">" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "</option>";
	});

	//데이터 변경시켜주기
	$.each($("tr[name='Sur_AddRow']"), function (i) {

		if ($("#select_Surcharge_Bound").attr("disabled") == "disabled") {
			if ($("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select").find("option:selected").val() == "") {
				$("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select")[0].innerHTML = vHTML;
			}
		} else {

			if (_vSetPort == $("#select_Surcharge_Bound").find("option:selected").val()) {
				if ($("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select").find("option:selected").val() == "") {
					$("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select")[0].innerHTML = vHTML;
				}
			} else {
				$("tr[name='Sur_AddRow']").eq(i).find("td").eq(5).find("select")[0].innerHTML = vHTML;
			}
		}
	});

	//비교를 위해 세팅
	_vSetPort = $("#select_Surcharge_Bound").find("option:selected").val();
}


//수정 및 삭제 시 데이터 Row 그려주는 함수
function fnMakeModifyRow(vJsonData) {

	var vHTML = "";

	$("#tbody_surchargeWrite_Result").empty();

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vResult = JSON.parse(vJsonData).SurchargeData;

		//데이터 그려주기
		$.each(vResult, function (i) {
			vHTML += "   <tr name=\"Sur_Modify\"> ";
			vHTML += "   	<td> ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\"> ";
			vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"" + _fnToNull(vResult[i]["CONTENTS"]) + "\" maxlength=\"140\" data-index=\"" + _vDataIndex++ + "\" readonly disabled=\"disabled\"> ";
			vHTML += "   		</div>                                                           ";
			vHTML += "   	</td>                                                                ";
			vHTML += "   	<td>                                                                 ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
			vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"" + _fnToNull(vResult[i]["CODE"]) +"\" maxlength=\"7\" data-index=\"" + _vDataIndex++ + "\"> ";
			vHTML += "   		</div>                                                           ";
			vHTML += "   	</td>                                                                ";
			vHTML += "   	<td>                                                                 ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
			vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"" + _fnToNull(vResult[i]["UNIT"]) +"\" maxlength=\"5\" data-index=\"" + _vDataIndex++ + "\"> ";
			vHTML += "   		</div>                                                           ";
			vHTML += "   	</td>                                                                ";
			vHTML += "   	<td>                                                                 ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
			vHTML += "   			<input type=\"text\" class=\"form-control\" name=\"input_Sur_AddRow\" value=\"" + _fnToNull(vResult[i]["CURRENCY"]) +"\" maxlength=\"5\" data-index=\"" + _vDataIndex++ + "\"> ";
			vHTML += "   		</div>                                                           ";
			vHTML += "   	</td>                                                                ";
			vHTML += "   	<td>                                                                 ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\">                                ";
			vHTML += "   			<input type=\"text\" class=\"form-control _only_num\" name=\"input_Sur_AddRow\" value=\"" + fnSetComma(_fnToNull(vResult[i]["PRICE"])) + "\" maxlength=\"14\" data-index=\"" + _vDataIndex++ + "\"> ";
			vHTML += "   		</div>                                                           ";
			vHTML += "   	</td>                                                                ";
			vHTML += "   	<td>  ";
			vHTML += "   		<div class=\"col-md-12 col-sm-12\">  ";
			vHTML += "   			<select class=\"form-control select\" name=\"select_Surcharge_Country_Option\"> ";
			vHTML += "					<option value=\"기본\">기본</option>";
			vHTML += "   			</select> ";
			vHTML += "   		</div> ";
			vHTML += "   	</td> ";

			vHTML += "   	<td style=\"display:none\">  ";
			vHTML += "			 <input type=\"hidden\" name=\"surcharge_MngtNo\" value=\"" + _fnToNull(vResult[i]["MNGT_NO"])+"\" /> ";
			vHTML += "			 <input type=\"hidden\" name=\"surcharge_Seq\" value=\"" + _fnToNull(vResult[i]["SEQ"]) +"\" /> ";
			vHTML += "   	</td> ";

			vHTML += "   	<td>                                                                 ";
			vHTML += "			 <div class=\"btn-group btn_padding\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "			 	<a href=\"javascript:void(0);\" type=\"button\" name=\"surcharge_Modifybtn\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정</a> ";
			vHTML += "			 </div> ";
			vHTML += "			 <div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "			 	<a href=\"javascript:void(0);\" type=\"button\" name=\"surcharge_Delbtn\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;삭제</a> ";
			vHTML += "			 </div> ";
			vHTML += "   	</td> ";
			vHTML += "   </tr> ";
		});

		$("#tbody_surchargeWrite_Result").append(vHTML);

		///////////////////////////////////////////국가 옵션 그려주기		////////////////////////////////////////////////////
		var vCounResult = fnReturnCountry($("#global_Bound").val());
		vCounResult = JSON.parse(vCounResult).Table1;

		vHTML = "";

		//vHTML 그려주기
		$.each(vCounResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vCounResult[i]["COUNTRY_OPTION"]) + "\">" + _fnToNull(vCounResult[i]["COUNTRY_OPTION"]) + "</option>";
		});

		//데이터 변경시켜주기
		$.each($("tr[name='Sur_Modify']"), function (i) {
			$("tr[name='Sur_Modify']").eq(i).find("td").eq(5).find("select")[0].innerHTML = vHTML;
			$("tr[name='Sur_Modify']").eq(i).find("td").eq(5).find("select").find("option[value='" + vResult[i]["COUNTRY_OPTION"] + "']").attr("selected", true);
		});	
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없을 경우
		console.log();
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//데이터 검색 오류
	}
}

////////////////////////API////////////////////////////
