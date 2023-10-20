////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vVehicle_MngtNo = ""; //Delete 할 때 관리번호
var _vVehicle_SEQ = ""; //Delete 할 때 SEQ

////////////////////jquery event///////////////////////
$(function () {

	fnSetVehicleDiv();
	fnSearchVehicle();

	$("._btn_write").on("click", function (e) {
		location.href = "/Admin/VehicleWrite";
	});	
});

//리스트 검색 버튼
$(document).on("click", "#Search_vehicle", function () {
	_vPage = 0;
	fnSearchVehicle();
});

//파일 다운로드 기능
$(document).on("click", "a[name='Vehicle_ImageDown']", function () {

	var vMNGT_NO = $(this).closest("tr").find("td").eq(0).text()
	var vSEQ = $(this).closest("tr").find("td").eq(1).text()

	fnImageDown(vMNGT_NO, vSEQ); //파일 다운로드
});

//파일 수정 - 이동
$(document).on("click", "a[name='Vehicle_Modify']", function () {

	var vMNGT_NO = $(this).closest("tr").find("td").eq(0).text()
	var vSEQ = $(this).closest("tr").find("td").eq(1).text()

	location.href = "/Admin/VehicleWrite?MngtNo=" + vMNGT_NO + "&SEQ=" + vSEQ;	
});

//파일 삭제 Confirm 세팅 이벤트
$(document).on("click", "a[name='Vehicle_Delete']", function () {

	var vMNGT_NO = $(this).closest("tr").find("td").eq(0).text()
	var vSEQ = $(this).closest("tr").find("td").eq(1).text()

	_vVehicle_MngtNo = vMNGT_NO;
	_vVehicle_SEQ = vSEQ;

	//_fnConfirmMsg("삭제 하시겠습니까?");
	fnVehicle_Confirm("삭제 하시겠습니까?");
});

//파일 삭제 취소 이벤트 
$(document).on("click", "#Layer_Confirm_Cencel", function () {
	layerClose("#Vehicle_Confirm");
});

//파일 삭제 취소 이벤트 
$(document).on("click", "#Layer_Confirm", function () {
	fnDeleteVehicle(); //파일 다운로드
	layerClose("#Vehicle_Confirm");
});

//이미지 미리보기 - 해당 이미지를 계속 다운로드 받고 있어야된다는 단점이 있어서 뺐음.
//this.imagePreview = function () {
//	xOffset = 150;
//	yOffset = 300;

//	$('a.preview').hover(function (e) {
//		this.t = this.title;
//		this.title = "";
//		var c = (this.t != "") ? "<br/>" + this.t : "";
//		$("body").append("<p id='preview'><img src='/Images/1t_cargo.jpg'" + /*$(this).children("#pics" + this.id).val()*/ + " alt='Image preview' width='499px' />" + c + "</p>");
//		$("#preview").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX - yOffset) + "px").fadeIn("fast");
//	},
//		function () {
//			this.title = this.t;
//			$("#preview").remove();
//		}
//	);
//	$("a.preview").mousemove(function (e) {
//		$("#preview").css("top", (e.pageY - xOffset) + "px").css("left", (e.pageX - yOffset) + "px");
//	});
//};
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

//차량제원 검색
function fnSearchVehicle() {

	try {
		var objJsonData = new Object();
		objJsonData.CAR_DIV_CODE = $("#select_vehicle_div").find('option:selected').val();

		if (_vPage == 0) {
			objJsonData.PAGE = 1;
		} else {
			objJsonData.PAGE = _vPage;
		}

		_vPage++;

		$.ajax({
			type: "POST",
			url: "/Admin/fnSearchVehicle",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				//alert(result);
				fnMakeVehicle(result);
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnPaging(JSON.parse(result).Table1[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
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
	} catch (err) {
		console.log("[Error - fnSearchVehicle]" + err.message)
    }
}

//페이징 검색
function goPage(vPage) {
	_vPage = vPage;
	fnSearchVehicle();
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

//이미지 파일 다운로드
function fnImageDown(vMngtNo, vSEQ) {

	try {
		var objJsonData = new Object();
		objJsonData.MNGT_NO = vMngtNo;
		objJsonData.SEQ = vSEQ;		

		$.ajax({
			type: "POST",
			url: "/Admin/fnVehicleImgDown",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					window.location = "/HP_File/Vehicle_DownloadFile?FILE_NM=" + JSON.parse(result).Download[0]["IMG_NAME"] + "&FILE_PATH=" + JSON.parse(result).Download[0]["IMG_PATH"] + "&REPLACE_FILE_NM=" + JSON.parse(result).Download[0]["REPLACE_IMG_NAME"];
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("파일이 존재하지 않습니다.");
					console.log("[Fail - fnImageDown]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnImageDown]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[Error - fnImageDown]"+err.message);
    }
}

//차량 제원 삭제
function fnDeleteVehicle(vMngtNo, vSEQ) {
	try {
		var objJsonData = new Object();
		objJsonData.MNGT_NO = _vVehicle_MngtNo;
		objJsonData.SEQ = _vVehicle_SEQ;

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteVehicle",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					_fnAlertMsg("삭제 되었습니다.");
					_vPage = 0;
					fnSearchVehicle();
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("삭제 되지 않았습니다.");
					console.log("[Fail - fnDeleteVehicle]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteVehicle]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[Error - fnDeleteVehicle]" + err.message);
	}
}

//confirm 레이어 팝업 띄우기
function fnVehicle_Confirm(msg) {
	$("#Vehicle_Confirm .inner").html(msg);
	layerPopup2('#Vehicle_Confirm');
	$("#Layer_Confirm").focus();
}
/////////////////function MakeList/////////////////////
//차량 제원 - Select 구분 만들기
function fnMakeVehicleDiv(vJsonData) {

	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vHTML += "<option value=\"\" selected>전체</option>";

		var vCAR_DIV = "";

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["CAR_DIV_CODE"]) + "\">" + _fnToNull(vResult[i]["CAR_DIV"]) + "</option>";
			vCAR_DIV = "";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"\">전체</option>";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		console.log("[fnMakeVehicleDiv]Error : " + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#select_vehicle_div")[0].innerHTML = vHTML;
}

//차량 제원 - 결과 만들기
function fnMakeVehicle(vJsonData) {
	var vHTML = "";
	vResult = JSON.parse(vJsonData).Table1;

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

		$.each(vResult, function (i) {

			vHTML += "   <tr> ";
			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["MNGT_NO"]) + "</td> ";
			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["SEQ"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["CAR_DIV"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["CAR_NAME"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["SHORTHAND"]) + "</td> ";
			vHTML += "   	<td>" + _fnToNull(vResult[i]["CAR_WIDTH"]) + "</td> ";
			//이미지가 있는지 없는지 확인
			if (_fnToNull(vResult[i]["IMG_PATH"]) != "") {
				vHTML += "   	<td><a href=\"javascript:void(0)\" name=\"Vehicle_ImageDown\" class=\"preview\">image.png</a></td> ";
			} else {
				vHTML += "   	<td>No Image</td> ";
			}

			vHTML += "   	<td> ";
			vHTML += "   		<div class=\"btn-group btn_padding\" role=\"group\"> ";
			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Vehicle_Modify\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정</a>			 ";
			vHTML += "   		</div> ";
			vHTML += "   		<div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Vehicle_Delete\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;삭제</a> ";
			vHTML += "   		</div> ";
			vHTML += "   	</td> ";
			vHTML += "   </tr> ";
		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		vHTML += "   <tr> ";
		vHTML += "   	<td colspan=\"6\">데이터가 없습니다.</td> ";
		vHTML += "   </tr> ";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
		console.log("[fnMakeVehicle]Error : " + JSON.parse(vJsonData).Result[0]["trxMsg"]);
	}

	$("#Vehicle_Result")[0].innerHTML = vHTML;
} 
////////////////////////API////////////////////////////

