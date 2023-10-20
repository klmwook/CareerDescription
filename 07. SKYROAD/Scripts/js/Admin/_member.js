////////////////////////전역 변수//////////////////////////
var _vPage = 0;
////////////////////////jquery event///////////////////////
$(function () {
	fnSearchMember();
});

//관리자 등록 버튼
$(document).on("click", "#btn_MemberWrite", function () {
	location.href = "/Admin/MemberWrite";
});

//검색 버튼
$(document).on("click", "#Member_Search", function () {
	_vPage = 0;
	fnSearchMember();
});


////////////////////////////function///////////////////////
//관리자 검색
function fnSearchMember() {

	try {
		var objJsonData = new Object();

		objJsonData.SEARCH_TYPE = $("#select_Member option:selected").val(); //검색 어떤걸로 하는지.
		objJsonData.SEARCH_DATA = $("#input_Member").val(); //검색 어떤걸로 하는지.

		if (_vPage == 0) {
			objJsonData.PAGE = 1;
		} else {
			objJsonData.PAGE = _vPage;
		}

		_vPage++;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSearchMember",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeMemberList(result);
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnPaging(JSON.parse(result).Member[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
				}
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
		//SelectBox
		//검색

	}
	catch (err) {
		console.log("[Error - fnSearchMember]" + err.message);
	}

}

//페이징 검색
function goPage(vPage) {
	_vPage = vPage;
	fnSearchMember();
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

function goView(usrID) {
	location.href = "/Admin/MemberWrite?UserID=" + usrID;
}

/////////////////////function MakeList/////////////////////
//관리자 리스트 만들기
function fnMakeMemberList(vJsonData) {

	try {
		var vHTML = "";

		var vResult = JSON.parse(vJsonData).Member;

		if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

			$.each(vResult, function (i) {
				vHTML += "   <tr> ";
				vHTML += "   	<td>" + _fnToNull(vResult[i]["MEMB_NO"]) + "</td> ";
				vHTML += "   	<td><a href=\"javascript:void (0);\" onclick=\"goView(" + _fnToNull(vResult[i]["MEMB_NO"]) + ")\" class=\"_btn_edit\">" + _fnToNull(vResult[i]["M_ID"]) + "</a></td> ";
				vHTML += "   	<td>" + _fnToNull(vResult[i]["M_NAME"]) + "</td> ";
				vHTML += "   	<td>" + _fnToNull(vResult[i]["MOBILE"]) + "</td> ";
				vHTML += "   	<td>" + _fnToNull(vResult[i]["REGDT"]) + "</td> ";
				vHTML += "   </tr> ";
			});
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
			vHTML += "   <tr> ";
			vHTML += "   	<td colspan=\"5\">데이터가 없습니다.</td> ";
			vHTML += "   </tr> ";
			console.log("[Fail - fnMakeMemberList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}
		else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
			vHTML += "   <tr> ";
			vHTML += "   	<td colspan=\"5\">관리자에게 문의하세요.</td> ";
			vHTML += "   </tr> ";
			console.log("[Error - fnMakeMemberList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
		}

		$("#Member_Result")[0].innerHTML = vHTML;
	}
	catch (err) {
		console.log("[Error - fnMakeMemberList]" + err.message);
	}
}


////////////////////////////API////////////////////////////







