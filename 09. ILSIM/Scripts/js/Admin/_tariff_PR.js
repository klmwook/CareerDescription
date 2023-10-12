////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vTariffPR_MngtNo = ""; //Delete 할 때 관리번호
var _vTariffPR_SEQ = ""; //Delete 할 때 SEQ
////////////////////jquery event///////////////////////
$(function () {
	fnSetPRYearQuarter();
});

//신규 클릭 시 이동
$(document).on("click", "#btn_Insert_TariffPR", function () {
	location.href = "/Admin/TariffPremiumWrite";
});

//검색 버튼
$(document).on("click", "#Tariff_PR_Search", function () {
	_vPage = 0;
	fnSearchTariffPR();
});

//적용 기간 변경 시 초기화
$(document).on("change", "#select_YearQuarter", function () {
	fnInitResult();
});

//수정 클릭 버튼 이벤트
$(document).on("click", "a[name='TariffPR_Modify']", function () {

	var vMngtNo = $(this).closest("tr").find("td").eq(0).text();
	var vSEQ = $(this).closest("tr").find("td").eq(1).text();

	location.href = "/Admin/TariffPremiumWrite?MngtNo=" + vMngtNo + "&SEQ=" + vSEQ;
});

//삭제 클릭 버튼 이벤트
$(document).on("click", "a[name='TariffPR_Delete']", function () {

	_vTariffPR_MngtNo = $(this).closest("tr").find("td").eq(0).text();
	_vTariffPR_SEQ = $(this).closest("tr").find("td").eq(1).text();

	fnTariffPR_Confirm("삭제 하시겠습니까?");
});

//관리자 삭제 Confirm 취소 이벤트
$(document).on("click", "#Layer_Confirm_Cencel", function () {
	layerClose("#TariffPR_Confirm");
});

//관리자 삭제 Confirm 삭제 이벤트
$(document).on("click", "#Layer_Confirm", function () {
	fnDeleteTariffPR(); //파일 다운로드
	layerClose("#TariffPR_Confirm");
});

////////////////////////function///////////////////////
//년 / 분기 세팅
function fnSetPRYearQuarter() {
	try {
		var objJsonData = new Object();

		$.ajax({
			type: "POST",
			url: "/Admin/fnSetPRYearQuarter",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				//alert(result);
				fnMakePRYearQuarter(result);
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

//안전운임제 할증 관리 검색
function fnSearchTariffPR() {
	try {
		var objJsonData = new Object();

		//년_분기
		var vYear_Quarter = $("#select_YearQuarter option:selected").val().split("_");

		objJsonData.YEAR = vYear_Quarter[0]; //년
		objJsonData.QUARTER = vYear_Quarter[1]; //분기

		if (_vPage == 0) {
			objJsonData.PAGE = 1;
		} else {
			objJsonData.PAGE = _vPage;
		}

		_vPage++;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSearchTariffPR",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeTariffPRList(result);
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnPaging(JSON.parse(result).TariffPR[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
				}
				//fnMakePRYearQuarter(result);
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

//안전운임제 할증 관리 데이터 삭제
function fnDeleteTariffPR() {
	try {
		var objJsonData = new Object();
		objJsonData.MNGT_NO = _vTariffPR_MngtNo;
		objJsonData.SEQ = _vTariffPR_SEQ;

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteTariffPR",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					_fnAlertMsg("삭제 되었습니다.");
					_vPage = 0;
					fnSearchTariffPR();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("삭제 되지 않았습니다.");
					console.log("[Fail - fnDeleteTariffPR]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteTariffPR]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[Error - fnDeleteTariffPR]" + err.message);
	}
}

//페이징 검색
function goPage(vPage) {
	_vPage = vPage;
	fnSearchTariffPR();
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

//confirm 레이어 팝업 띄우기
function fnTariffPR_Confirm(msg) {
	$("#TariffPR_Confirm .inner").html(msg);
	layerPopup2('#TariffPR_Confirm');
	$("#Layer_Confirm").focus();
}

/////////////////function MakeList/////////////////////
//분기 / 년
function fnMakePRYearQuarter(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		$.each(vResult, function (i) {
			//vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_YEAR"] + "년 " + vResult[i]["PERIOD_QUARTER"] + "분기</option>";
			vHTML += "<option value=\"" + vResult[i]["PERIOD_YEAR"] + "_" + vResult[i]["PERIOD_QUARTER"] + "\">" + vResult[i]["PERIOD_NAME"] + "</option>";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		vHTML += "<option value=\"\">데이터가 없습니다.</option>";
		console.log("[Fail - fnMakePRYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		_fnAlertMsg("담당자에게 문의하세요.");
		console.log("[Error - fnMakePRYearQuarter]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_YearQuarter")[0].innerHTML = vHTML;
}

//안전운임제 할증 관리 리스트 만들기
function fnMakeTariffPRList(vJsonData) {

	try {
		var vHTML = "";

		var vResult = JSON.parse(vJsonData).TariffPR;

		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

			$.each(vResult, function (i) {

				vHTML += " <tr> ";
				vHTML += " 	<td style=\"display:none\">" + _fnToNull(vResult[i]["MNGT_NO"]) + "</td> ";
				vHTML += " 	<td style=\"display:none\">" + _fnToNull(vResult[i]["SEQ"]) + "</td> ";
				//vHTML += " 	<td>" + _fnToNull(vResult[i]["PERIOD_YEAR"]) + "년 " + _fnToNull(vResult[i]["PERIOD_QUARTER"]) + "분기</td> ";
				vHTML += " 	<td>" + _fnToNull(vResult[i]["PERIOD_NAME"]) + "</td> ";
				vHTML += " 	<td>" + _fnToNull(vResult[i]["P_RATE_NAME"]) + "</td> ";

				if (_fnToZero(vResult[i]["P_RATE_PRICE"]) != 0) {
					vHTML += " 	<td>" + _fnToZero(vResult[i]["P_RATE_PRICE"]) + "%</td> ";
				}
				else if (_fnToZero(vResult[i]["P_RATE_WON"]) != 0) {
					vHTML += " 	<td>" + _fnToZero(vResult[i]["P_RATE_WON"]) + "원</td> ";
				}
				else {
					vHTML += " 	<td>" + _fnToZero(vResult[i]["P_RATE_PRICE"]) + "%</td> ";
                }

				vHTML += " 	<td>" + _fnToNull(vResult[i]["EXCEPTION"]) + "</td> "; //예외처리

				vHTML += " 	<td> ";
				vHTML += " 		<div class=\"btn-group btn_padding\" role=\"group\" aria-label=\"버튼\"> ";
				vHTML += " 			<a href=\"javascript:void(0);\" type=\"button\" name=\"TariffPR_Modify\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정</a> ";
				vHTML += " 		</div> ";
				vHTML += " 		<div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
				vHTML += " 			<a href=\"javascript:void(0);\" type=\"button\" name=\"TariffPR_Delete\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;삭제</a> ";
				vHTML += " 		</div> ";
				vHTML += " 	</td> ";
				vHTML += " </tr> ";
			});
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
			vHTML += "   <tr> ";
			vHTML += "   	<td colspan=\"5\">데이터가 없습니다.</td> ";
			vHTML += "   </tr> ";
			console.log("[Fail - fnMakeTariffPRList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
			vHTML += "   <tr> ";
			vHTML += "   	<td colspan=\"5\">관리자에게 문의하세요.</td> ";
			vHTML += "   </tr> ";
			console.log("[Error - fnMakeTariffPRList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}

		$("#TariffPR_Result")[0].innerHTML = vHTML;
	}
	catch (err) {
		console.log("[Error - fnMakeTariffPRList]" + err.message);
	}
}

//결과 데이터 초기화
function fnInitResult() {
	$("#TariffPR_Result").empty();

	var vHTML = "";

	vHTML += "   <tr> ";
	vHTML += "   	<td colspan=\"5\">확인 원하시는 정보를 검색해보세요.</td> ";
	vHTML += "   </tr> ";

	$("#TariffPR_Result")[0].innerHTML = vHTML;

	vHTML = "";

	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-double-left\"></i><span class=\"sr-only\">처음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-left\"></i><span class=\"sr-only\">이전페이지로 가기</span></a></li> ";
	vHTML += " <li class=\"active\"><a href=\"javascript:void(0);\">1</a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-right\"></i><span class=\"sr-only\">다음페이지로 가기</span></a></li> ";
	vHTML += " <li><a href=\"javascript:void(0);\"><i class=\"fa fa-angle-double-right\"></i><span class=\"sr-only\">마지막페이지로 가기</span></a></li> ";

	$("#paging_Area")[0].innerHTML = vHTML;
}
////////////////////////API////////////////////////////

