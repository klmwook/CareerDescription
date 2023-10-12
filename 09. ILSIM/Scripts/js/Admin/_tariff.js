////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vTariff_MngtNo = ""; //Delete 할 때 관리번호
var _vTariff_SEQ = ""; //Delete 할 때 SEQ
////////////////////jquery event///////////////////////
$(function () {
	fnSetYearQuarter();
	fnSetAddrState();
	fnSetSection();
});

//신규 클릭 시 이동
$(document).on("click", "#btn_Insert_Tariff", function () {
	location.href = "/Admin/TariffWrite";
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

//행선지 전체(시.도)
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

//기점 변경
$(document).on("change", "#select_YearQuarter", function () {
	fnSetSection();
});


//엑셀 양식 다운로드 
$(document).on("click", "#ExcelForm_Download", function () {
	fnExcelFormDown();
});

//엑셀 업로드 클릭 이벤트
$(document).on("change", "#tariff_excel_register", function () {
	//fnSaveExcel();
	if (fnFileValidation()) {
		fnExcelLayerOpen();
	} else {
		$(this).val("");
    }
});

//엑셀 레이어 취소 버튼 이벤트
$(document).on("click", "#layer_excel_cancel", function () {
	$("#tariff_excel_register").val("");
	layerClose("#layer_ExcelUpload");
});

//엑셀 레이어 확인 버튼 이벤트
$(document).on("click", "#layer_btn_ExcelUpload", function () {

	//엑셀 업로드 테스트
	fnCheckTariffExcel();

	//fnCheckTariffExcel();
	//fnExcelConfirm("이미 데이터가 있습니다. <br /> 업로드 하시겠습니까?");
});

//엑셀 업로드 재확인 취소 버튼 이벤트
$(document).on("click", "#Excel_Confirm_Cencel", function () {
	layerClose("#Excel_Tariff_Confirm");
});

//엑셀 업로드 재확인 버튼 이벤트
$(document).on("click", "#Excel_Confirm_Upload", function () {
	fnDeleteTariffExcel();
});

//안전운임제 관리 검색
$(document).on("click", "#Tariff_Search_btn", function () {
	_vPage = 0;
	fnSearchTariff();
});

//수정 클릭 버튼 이벤트
$(document).on("click", "a[name='Tariff_Modify']", function () {

	var vMngtNo = $(this).closest("tr").find("td").eq(0).text();
	var vSEQ = $(this).closest("tr").find("td").eq(1).text();
	var vType = $("#select_Type").find('option:selected').val();

	location.href = "/Admin/TariffWrite?MngtNo=" + vMngtNo + "&SEQ=" + vSEQ + "&TYPE=" + vType;
});

//리스트에서 삭제 버튼 클릭 이벤트
//삭제 클릭 버튼 이벤트
$(document).on("click", "a[name='Tariff_Delete']", function () {

	_vTariff_MngtNo = $(this).closest("tr").find("td").eq(0).text();
	_vTariff_SEQ = $(this).closest("tr").find("td").eq(1).text();

	fnTariff_Confirm("삭제 하시겠습니까?");
});

//관리자 삭제 Confirm 취소 이벤트
$(document).on("click", "#Layer_Confirm_Cencel", function () {
	layerClose("#Tariff_Confirm");
});

//관리자 삭제 Confirm 삭제 이벤트
$(document).on("click", "#Layer_Confirm", function () {
	fnDeleteTariff(); //파일 다운로드
	layerClose("#Tariff_Confirm");
});



////////////////////////function///////////////////////
function fnSetYearQuarter() {
	try {
		var objJsonData = new Object();

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetYearQuarter",
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
	catch (err) {
		console.log("[Error -fnSetYearQuarter]" + err.message);
    }
}


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

//전체(시.군.구) 데이터 가져오기
function fnSetAddrCity(vITEM1) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;

	$.ajax({
		type: "POST",
		url: "/Admin/fnSetAddrCity",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeAddrCity(result);
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

//전체(읍,면,동) - 행정동 데이터 가져오기
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

//전체(읍,면,동) - 법정동 데이터 가져오기
function fnSetAddrTownship2(vITEM1, vITEM2) {

	var objJsonData = new Object();
	objJsonData.OPT_ITEM1 = vITEM1;
	objJsonData.OPT_ITEM2 = vITEM2;

	$.ajax({
		type: "POST",
		url: "/Admin/fnSetAddrTownship2",
		async: false,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeAddrTownship2(result);
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

//기점 데이터 가져오기
function fnSetSection() {

	try {
		var objJsonData = new Object();

		var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

		objJsonData.PERIOD_YEAR = vYear_Quarter[0]; //년
		objJsonData.PERIOD_QUARTER = vYear_Quarter[1]; //분기		

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetSection",
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
	catch (err) {
		console.log("[Error - fnSetSection]" + err.message);
    }
}


function fnSelectReset(vID, vText) {
	$("#" + vID).empty();

	var vHTML = "";
	vHTML = "<option value=\"\">" + vText + "</option>";

	$("#" + vID)[0].innerHTML = vHTML;
}

function fnFileValidation() {

	for (var i = 0; i < $("#tariff_excel_register").get(0).files.length; i++) {

		var vFileExtension = $("#tariff_excel_register").get(0).files[i].name.substring($("#tariff_excel_register").get(0).files[i].name.lastIndexOf(".") + 1, $("#tariff_excel_register").get(0).files[i].name.length);
		var vFileNM = $("#tariff_excel_register").get(0).files[i].name;

		//파일 사이즈 10MB 이상일 경우 Exception
		if (10485759 < $("#tariff_excel_register").get(0).files[i].size) {
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

//안전운임제 관리 검색
function fnSearchTariff() {
	try {
		//필수 값 설정
		var objJsonData = new Object();

		//년_분기
		var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

		objJsonData.YEAR = vYear_Quarter[0]; //년
		objJsonData.QUARTER = vYear_Quarter[1]; //분기
		objJsonData.TYPE = $("#select_Type").find('option:selected').val();

		var vSECTION = $("#select_Section option:selected").val().split("_");

		if (_fnToNull(vSECTION) != "") {
			//TWKIM - 변경
			objJsonData.PORT = vSECTION[0]; //PORT
			objJsonData.SECTION = vSECTION[1]; //편도 , 왕복
		} else {
			//TWKIM - 변경
			objJsonData.PORT = ""; //PORT
			objJsonData.SECTION = ""; //편도 , 왕복
        }

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

		if (_vPage == 0) {
			objJsonData.PAGE = 1;
		} else {
			objJsonData.PAGE = _vPage;
		}

		_vPage++;

		$.ajax({
			type: "POST",
			url: "/Admin/fnTariffSerach",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {		
				fnMakeTariffData(result);
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnPaging(JSON.parse(result).Tariff[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
				}
				//페이징
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	} catch (err) {
		console.log("[Error - fnSearchTariff]"+err.message);
    }
}

//안전운임제 할증 관리 데이터 삭제
function fnDeleteTariff() {
	try {
		var objJsonData = new Object();
		objJsonData.MNGT_NO = _vTariff_MngtNo;
		objJsonData.SEQ = _vTariff_SEQ;

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteTariff",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					_fnAlertMsg("삭제 되었습니다.");
					_vPage = 0;
					fnSearchTariff();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("삭제 되지 않았습니다.");
					console.log("[Fail - fnDeleteTariff]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteTariff]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[Error - fnDeleteTariff]" + err.message);
	}
}

//confirm 레이어 팝업 띄우기
function fnTariff_Confirm(msg) {
	$("#Tariff_Confirm .inner").html(msg);
	layerPopup2('#Tariff_Confirm');
}

//엑셀 레이어 함수
function fnExcelLayerOpen() {
	layerPopup2('#layer_ExcelUpload');
}

//페이징 검색
function goPage(vPage) {
	_vPage = vPage;
	fnSearchTariff();
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnPaging(totalData, dataPerPage, pageCount, currentPage) {

	try {
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
	} catch (err) {
		console.log("[Error - fnPaging]" + err.message);
	}
}

//엑셀 폼 다운로드 함수
function fnExcelFormDown() {

	var vFormFileNM = "안전운임_양식";
	var vFormPath = "/Files/ExcelForm/";

	window.location.href = window.location.origin + "/HP_File/Down_FormFile?strFILENM=" + vFormFileNM + "&strPATH=" + vFormPath;
}

//기존에 타리프 데이터가 있는지 없는지 확인
function fnCheckTariffExcel() {
	try {

		var objJsonData = new Object();

		var vYear_Quarter = $("#layer_select_YearQuarter option:selected").val().split("_");

		objJsonData.PERIOD_YEAR = vYear_Quarter[0]; //년
		objJsonData.PERIOD_QUARTER = vYear_Quarter[1]; //분기		

		$.ajax({
			type: "POST",
			url: "/Admin/fnCheckTariffExcel",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnSaveExcel();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					fnExcelConfirm("이미 해당 분기의 데이터가 있습니다. <br /> 삭제 후 다시 업로드 하시겠습니까?");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnCheckTariffExcel]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error] - fnCheckTariffExcel()" + err.message);
    }
}

//엑셀 업로드 전 기존 데이터 삭제
function fnDeleteTariffExcel() {
	try {

		var objJsonData = new Object();

		var vYear_Quarter = $("#layer_select_YearQuarter option:selected").val().split("_");

		objJsonData.PERIOD_YEAR = vYear_Quarter[0]; //년
		objJsonData.PERIOD_QUARTER = vYear_Quarter[1]; //분기		

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteExcelTariff",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					layerClose("#Excel_Tariff_Confirm");
					fnSaveExcel();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("데이터를 삭제 하지 못 하였습니다.");
					console.log("[Fail - fnDeleteTariffExcel]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteTariffExcel]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {				
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});
	}
	catch (err) {
		console.log("[Error] - fnDeleteTariffExcel()" + err.message);
	}
}

//폼 양식으로 file 데이터 보내기
function fnSaveExcel() {

	try {
		//파일 데이터 저장
		var vfileData = new FormData(); //Form 초기화

		for (var i = 0; i < $("#tariff_excel_register").get(0).files.length; i++) {
			vfileData.append("Files", $("#tariff_excel_register").get(0).files[i]);
		}

		var vYear_Quarter = $("#layer_select_YearQuarter option:selected").val().split("_");

		vfileData.append("PERIOD_YEAR", vYear_Quarter[0]);
		vfileData.append("PERIOD_QUARTER", vYear_Quarter[1]);
		vfileData.append("USR_ID", $("#Session_USR_ID").val());

		$.ajax({
			type: "POST",
			url: "/Admin/fnSaveExcel_SaveFre",
			dataType: "json",
			async: true,
			contentType: false, // Not to set any content header
			processData: false, // Not to process data
			data: vfileData,
			success: function (result, status, xhr) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					$("#tariff_excel_register").val("");
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
				_fnAlertMsg("[Error  - fnSaveExcel]관리자에게 문의 해 주세요. " + status);
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
	catch (err) {
		console.log("[Error - fnSaveExcel]" + err.message);
    }
}

//확인 버튼
function fnExcelConfirm(msg) {
	$("#Excel_Tariff_Confirm .inner").html(msg);
	layerPopup2('#Excel_Tariff_Confirm');
	$("#Excel_Confirm_Upload").focus();
}

/////////////////function MakeList/////////////////////
//분기 / 년
function fnMakeYearQuarter(vJsonData) {

	//var vHTML = "";
	//vResult = JSON.parse(vJsonData).Table1;
	//
	//if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
	//	//vHTML += "<option value=\"\">전체(시,도)</option>";
	//
	//	$.each(vResult, function (i) {
	//		vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_YEAR"] + "년 " + vResult[i]["PERIOD_QUARTER"] + "분기</option>";
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
			vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_NAME"] + "</option>";
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

//행선지 - 전체(읍,면,동) - 행정동
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

//행선지 - 전체(읍,면,동) - 법정동
function fnMakeAddrTownship2(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\">전체(읍,면,동 - 법정동)</option>";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + vResult[i]["OPT_ITEM3"] + "\">" + vResult[i]["OPT_ITEM4"] + " (" + vResult[i]["OPT_ITEM3"]+")</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

		console.log("[Fail - fnMakeAddrTownship2]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		//데이터가 없습니다.
		//vHTML += "<option value=\"" + vResult[i]["OPT_ITEM1"] + "\">" + vResult[i]["OPT_ITEM1"] + "</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		//오류 사항 발생
		console.log("[Error - fnMakeAddrTownship2]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
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

//안전운임제 관리 그리기
function fnMakeTariffData(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Tariff;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		$.each(vResult, function (i) {
			vHTML += "   <tr> ";
			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["MNGT_NO"])+"</td> ";
			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["SEQ"])+"</td> ";
			//vHTML += "   	<td>" + _fnToNull(vResult[i]["PERIOD_YEAR"]) + "년 " + _fnToNull(vResult[i]["PERIOD_QUARTER"]) + "분기</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["PERIOD_NAME"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["ADDR_STATE"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["ADDR_CITY"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["ADDR_TOWNSHIP"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["DISTANCE"]) + "</td> ";

			if ($("#select_Type").find('option:selected').val() == "TF") {
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["TF_20FT"])) + "</td> ";
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["TF_40FT"])) + "</td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "CF") {
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["CF_20FT"])) + "</td> ";
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["CF_40FT"])) + "</td> ";
			}

			if ($("#select_Type").find('option:selected').val() == "IF") {
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["IF_20FT"])) + "</td> ";
				vHTML += "   	<td>" + fnSetComma(_fnToZero(vResult[i]["IF_40FT"])) + "</td> ";
			}

			vHTML += "   	<td> ";
			vHTML += "   		<div class=\"btn-group btn_padding\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Tariff_Modify\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정</a> ";
			vHTML += "   		</div> ";
			vHTML += "   		<div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Tariff_Delete\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;삭제</a> ";
			vHTML += "   		</div> ";
			vHTML += "   	</td> ";
			vHTML += "   </tr> ";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

		vHTML += "   <tr> ";
		vHTML += "   	<td colspan=\"8\">데이터가 없습니다.</td> ";
		vHTML += "   </tr> ";
		
		console.log("[Fail - fnMakeTariffData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {

		vHTML += "   <tr> ";
		vHTML += "   	<td colspan=\"8\">관리자에게 문의하세요.</td> ";
		vHTML += "   </tr> ";

		console.log("[Error - fnMakeTariffData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#Tarrff_Result")[0].innerHTML = vHTML;
}




////////////////////////API////////////////////////////

