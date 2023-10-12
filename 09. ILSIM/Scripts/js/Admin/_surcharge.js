////////////////////전역 변수//////////////////////////
var _vPage = 0;
////////////////////jquery event///////////////////////
$(function () {
	$("._btn_write").on("click", function (e) {
		location.href = "/Admin/SurchargeWrite";
	});
	//$("._btn_modify").on("click", function (e) {
	//	location.href = "/Admin/SurchargeWrite";
	//});
	$("._btn_list").on("click", function (e) {
		location.href = "/Admin/SurchargeAdmin";
	});

	if ($('.scrollbar_list').length > 0) {
		$('.scrollbar_list').slimScroll({
			height: '306px',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		})
	}

	fnSetSurchargePort(); //포트 데이터 가져오기
	fnSetSurchargeCountry("O");
});

//BOUND 선틱 시 - 검색 이벤트
$(document).on("change", "select[name='select_Surcharge_Bound']", function () {
	$("select[name='select_Surcharge_Bound']").val($(this).find("option:selected").val()).prop("selected", true);

	//선사 클릭
	if ($("#select_shipping option:selected").val() == "unit_shipping") {
		fnSetSurchargeCountry($(this).find("option:selected").val());
	}
});


//선사 변경 시 이벤트
$(document).on("change", "select[name='select_shipping']", function () {

	if ($(this).find("option:selected").val() == "S") {
		$("#select_CountryList_Area").show();
	}
	else if ($(this).find("option:selected").val() == "F") {
		$("#select_CountryList_Area").hide();
	}

	fnInitResult();
	fnSetSurchargePort(); //포트 데이터 가져오기
});

//엑셀 양식 다운로드 
$(document).on("click", "#ExcelForm_Download", function () {
	fnExcelFormDown();
});

//엑셀 업로드 이벤트
$(document).on("change", "#Surcharge_excel_register", function () {

	//벨리데이션 체크	
	if (fnFileValidation()) {
		fnExcelLayerOpen();
	}
	else {
		//벨리데이션 실패 시 초기화
		$(this).val("");
    }
});

///////////////////////

//엑셀 레이어 취소 버튼 이벤트
$(document).on("click", "#layer_excel_cancel", function () {
	$("#Surcharge_excel_register").val("");
	layerClose("#layer_ExcelUpload");
});

//엑셀 레이어 확인 버튼 이벤트
$(document).on("click", "#layer_btn_ExcelUpload", function () {
	//엑셀 업로드 테스트
	fnCheckSurchargeExcel();	
});

//엑셀 업로드 재확인 취소 버튼 이벤트
$(document).on("click", "#Excel_Confirm_Cencel", function () {
	$("#Surcharge_excel_register").val("");
	layerClose("#layer_ExcelUpload");
	layerClose("#Excel_Surcharge_Confirm");
});

//엑셀 업로드 재확인 버튼 이벤트
$(document).on("click", "#Excel_Confirm_Upload", function () {
	fnDeleteExcelSurcharge();
});

//검색 버튼 이벤트
$(document).on("click", "#Surcharge_Search", function () {
	_vPage = 0;
	fnSurchargeAdmin();
});

$(document).on("click", "._btn_modify", function () {

	var vTr = $(this).closest("tr");
	var vShipping = ""; //선사 구분
	var vBound = ""; //수출입
	
	if ($(this).closest("tr").find("td").eq(0).text() == "선사") {
		vShipping = "S";
	} else if ($(this).closest("tr").find("td").eq(0).text() == "훼리") {
		vShipping = "F";
    }

	if ($(this).closest("tr").find("td").eq(1).text() == "수출") {
		vBound = "O";
	} else if ($(this).closest("tr").find("td").eq(1).text() == "수입") {
		vBound = "I";
	}

	var vPort = $(this).closest("tr").find("td").eq(2).text() //PORT
	var vCntrType = $(this).closest("tr").find("td").eq(6).text() //컨테이너 타입
	var vCntrSize = $(this).closest("tr").find("td").eq(4).text() //컨테이너 사이즈
	var vCountry = $(this).closest("tr").find("td").eq(5).text() //국가 옵션

	//URL 보내기
	location.href = "/Admin/SurchargeWrite?Ship=" + vShipping + "&Bound=" + vBound + "&Port=" + vPort + "&CntrType=" + vCntrType + "&CntrSize=" + vCntrSize + "&Country=" + vCountry;
});

////////////////////////function///////////////////////
//포트 데이터 가져오기
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

//부대비용 관리 검색
function fnSurchargeAdmin() {

	try {
		var objJsonData = new Object();

		if (fnSurchargeValidation()) {

			objJsonData.PORT_TYPE = $("select[name='select_shipping']").val();

			if ($("#select_shipping option:selected").val() == "S")
			{
				objJsonData.COUNTRY_OPTION = $("#select_CountryList option:selected").val();
			}
			else if ($("#select_shipping option:selected").val() == "F")
			{
				objJsonData.COUNTRY_OPTION = "";
			}

			objJsonData.BOUND = $("select[name='select_Surcharge_Bound']").val();
			objJsonData.PORT = $("select[name='select_surcharge_port']").val();
			objJsonData.CNTR_TYPE = $("select[name='select_Surcharge_CntrType']").val();

			if (_vPage == 0) {
				objJsonData.PAGE = 1;
			} else {
				objJsonData.PAGE = _vPage;				
			}

			_vPage++;

			$.ajax({
				type: "POST",
				url: "/Admin/fnSearchSurcharge",
				async: true,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					//fnMakeSurchargeData(result);
					//alert(result);	
					fnMakeSetSerach(result);
					if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
						fnPaging(JSON.parse(result).SurchargeData[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                    }
				}, error: function (xhr) {
					$("#ProgressBar_Loading").hide(); //프로그래스 바 
					_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
					console.log(xhr);
				}, beforeSend: function () {
					$("#ProgressBar_Loading").show(); //프로그래스 바 

				},
				complete: function () {
					$("#ProgressBar_Loading").hide(); //프로그래스 바 
				}
			});
        }

	} catch (err) {
		console.log("[Error : fnSurchargeAdmin]"+err)
    }
}

//검색 벨리데이션
function fnSurchargeValidation() {

	if ($("#select_surcharge_port option:selected").val() == "") {
		_fnAlertMsg("PORT를 선택 해 주세요.");
		return false;
	}

	return true;
}

//엑셀 폼 다운로드 함수
function fnExcelFormDown() {

	var vFormFileNM = "부대비용_양식";
	var vFormPath = "/Files/ExcelForm/";

	window.location.href = window.location.origin + "/HP_File/Down_FormFile?strFILENM=" + vFormFileNM + "&strPATH=" + vFormPath;
}

//엑셀파일 벨리데이션
function fnFileValidation() {

	for (var i = 0; i < $("#Surcharge_excel_register").get(0).files.length; i++) {

		var vFileExtension = $("#Surcharge_excel_register").get(0).files[i].name.substring($("#Surcharge_excel_register").get(0).files[i].name.lastIndexOf(".") + 1, $("#Surcharge_excel_register").get(0).files[i].name.length);
		var vFileNM = $("#Surcharge_excel_register").get(0).files[i].name;

		//파일 사이즈 10MB 이상일 경우 Exception
		if (10485759 < $("#Surcharge_excel_register").get(0).files[i].size) {
			_fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
			return false;
		}

		//확장자 Validation - xlsx , xls 파일 제외하고는 예외처리
		if (vFileExtension != "xls" && vFileExtension != "xlsx") {
			_fnAlertMsg("엑셀 확장자만 검색 가능 합니다. (xlsx,xls)");
			return false;
		}

		//양식으로만 할 수 있게 하자
		//if (vFileNM != "부대비용_양식.xlsx") {
		//	_fnAlertMsg("부대비용 관리 양식으로 업로드 해주시기 바랍니다.");
		//	return false;
		//}
	}

	return true;
}

//폼 양식으로 file 데이터 보내기
function fnSaveExcel() {

	//파일 데이터 저장
	var vfileData = new FormData(); //Form 초기화

	for (var i = 0; i < $("#Surcharge_excel_register").get(0).files.length;i++) {
		vfileData.append("Files", $("#Surcharge_excel_register").get(0).files[i]);
	}

	//현재 로그인 한 아이디
	vfileData.append("USR_ID", $("#Session_USR_ID").val());

	$.ajax({
		type: "POST",
		url: "/Admin/fnSaveExcel_SaveSur",
		dataType: "json",
		async: true,
		contentType: false, // Not to set any content header
		processData: false, // Not to process data
		data: vfileData,
		success: function (result, status, xhr) {
			if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
				$("#Surcharge_excel_register").val("");
				layerClose("#layer_ExcelUpload");				
				_fnAlertMsg("엑셀 업로드가 완료 되었습니다.");
			}
			else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
				layerClose("#layer_ExcelUpload");
				_fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
			}
			else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
				_fnAlertMsg("담당자에게 문의하세요.");
				console.log("[Error - fnSaveExcel]" + JSON.parse(result).Result[0]["trxMsg"]);
			}
		},
		error: function (xhr, status, error) {
			$("#ProgressBar_Loading").hide(); //프로그래스 바
			_fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
			return false;
		},
		beforeSend: function () {
			$("#ProgressBar_Loading").show(); //프로그래스 바
		},
		complete: function () {
			$("#ProgressBar_Loading").hide(); //프로그래스 바
		}
	});
}

//페이징 검색
function goPage(vPage) {
	_vPage = vPage;
	fnSurchargeAdmin();
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnPaging(totalData, dataPerPage, pageCount, currentPage) {
	var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
	var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
	if (pageCount > totalPage) pageCount = totalPage;
	var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
	if (last > totalPage) last = totalPage;
	var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
	var next = last + 1;
	var prev = first - 1;

	$("#paging_Area").empty();

	var prevPage;
	var nextPage;
	if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
	if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

	var vHTML = "";

	vHTML += " <li><a href=\"javascript:void(0);\" onclick=\"goPage(1)\"><i class=\"fa fa-angle-double-left\"></i><span class=\"sr-only\">처음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\" onclick=\"goPage(" + prevPage + ")\"><i class=\"fa fa-angle-left\"></i><span class=\"sr-only\">이전페이지로 가기</span></a></li> ";

	for (var i = first; i <= last; i++) {
		if (i == currentPage) {
			vHTML += " <li class=\"active\"><a href=\"javascript:void(0);\"onclick=\"goPage(" + i + ")\" >" + i + "</a></li> ";
		} else {			
			vHTML += " <li><a href=\"javascript:void(0);\"onclick=\"goPage(" + i + ")\" >" + i + "</a></li> ";
		}
	}

	vHTML += " <li><a href=\"javascript:void(0);\" onclick=\"goPage(" + nextPage + ")\"><i class=\"fa fa-angle-right\"></i><span class=\"sr-only\">다음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\" onclick=\"goPage(" + totalPage + ")\"><i class=\"fa fa-angle-double-right\"></i><span class=\"sr-only\">마지막페이지로 가기</span></a></li> ";

	$("#paging_Area").append(vHTML);    // 페이지 목록 생성		
}

//엑셀 레이어 함수
function fnExcelLayerOpen() {
	//$("#layer_Excel_Upload .inner").html(msg);
	layerPopup2('#layer_ExcelUpload');
}

//결과 데이터 초기화
function fnInitResult() {
	$("#tbody_Surcharge_Result").empty();

	var vHTML = "";

	vHTML += "   <tr> ";
	vHTML += "   	<td colspan=\"7\">확인 원하시는 정보를 검색해보세요.</td> ";
	vHTML += "   </tr> ";

	$("#tbody_Surcharge_Result")[0].innerHTML = vHTML;

	vHTML = "";

	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-double-left\"></i><span class=\"sr-only\">처음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-left\"></i><span class=\"sr-only\">이전페이지로 가기</span></a></li> ";
	vHTML += " <li class=\"active\"><a href=\"javascript:void(0);\">1</a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-right\"></i><span class=\"sr-only\">다음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-double-right\"></i><span class=\"sr-only\">마지막페이지로 가기</span></a></li> ";

	$("#paging_Area")[0].innerHTML = vHTML;
}

//확인 버튼
function fnExcelConfirm(msg) {
	$("#Excel_Surcharge_Confirm .inner").html(msg);
	layerPopup2('#Excel_Surcharge_Confirm');
}

//기존에 부대비용 데이터가 있는지 확인 하는 함수
function fnCheckSurchargeExcel() {
	try {

		var objJsonData = new Object();

		$.ajax({
			type: "POST",
			url: "/Admin/fnCheckSurchargeExcel",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {					
					fnSaveExcel();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					fnExcelConfirm("이미 데이터가 있습니다. <br /> 삭제 후 다시 업로드 하시겠습니까?");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnCheckSurchargeExcel]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error] - fnCheckSurchargeExcel()" + err.message);
	}
}

//엑셀 업로드 전 기존 데이터 삭제
function fnDeleteExcelSurcharge() {
	try {

		var objJsonData = new Object();

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteExcelSurcharge",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					layerClose("#Excel_Surcharge_Confirm");
					fnSaveExcel();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("데이터를 삭제 하지 못 하였습니다.");
					console.log("[Fail - fnDeleteExcelSurcharge]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteExcelSurcharge]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error] - fnDeleteExcelSurcharge()" + err.message);
	}
}

/////////////////function MakeList/////////////////////
//포트 정보 Select 데이터 그려주기
function fnMakeSetSurchargePort(vJsonData) {
	var vHTML = "";
	var vResult = "";

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vResult = JSON.parse(vJsonData).Table1;

		if ($("#select_shipping option:selected").val() == "S") {
			vHTML += "<option value=\"\">PORT</option>";
		} else if ($("#select_shipping option:selected").val() == "F") {
			vHTML += "<option value=\"\">CARR</option>";
        }

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["PORT"]) + "\">" + _fnToNull(vResult[i]["PORT"]) + "</option>";
		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"\">기본선택</option>";
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
		vHTML += "<option value=\"\">국가 옵션</option>";
	}

	$("select[name='select_CountryList']")[0].innerHTML = vHTML;
	//$("select[name='select_CountryList']")[1].innerHTML = vHTML;
}

//부대비용 관리 - 결과 그려주기
function fnMakeSetSerach(vJsonData) {
	var vHTML = "";
	var vResult = "";

	$("#tbody_Surcharge_Result").empty();

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		vResult = JSON.parse(vJsonData).SurchargeData;

		$.each(vResult, function (i) {

			vHTML += "   <tr> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["SHIPPING"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["BOUND"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["PORT"]) + "</td> ";			
			vHTML += "   	<td>" + _fnToNull(vResult[i]["CNTR_TYPE_NM"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["CNTR_SIZE"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "</td> ";
			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["CNTR_TYPE"]) + "</td> ";
			vHTML += "   	<td> ";
			vHTML += "   		<div class=\"btn-group btn_padding no_right_padding\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "   			<a href=\"javascript:void(0);\" id=\"\" type=\"button\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정 및 삭제</a> ";
			vHTML += "   		</div> ";
			vHTML += "   	</td> ";
			vHTML += "   </tr> ";

		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		vHTML += "   <tr> ";
		vHTML += "   	<td colspan=\"7\">데이터가 없습니다.</td> ";
		vHTML += "   </tr> ";

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {

		console.log("[Error : fnMakeSetSerach]" + JSON.parse(vJsonData).Result[0]["trxMsg"])

		vHTML += "   <tr> ";
		vHTML += "   	<td colspan=\"7\">관리자에게 문의하세요.</td> ";
		vHTML += "   </tr> ";
	}

	$("#tbody_Surcharge_Result")[0].innerHTML = vHTML;

}


////////////////////////API////////////////////////////
