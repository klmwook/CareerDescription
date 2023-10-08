////////////////////////전역 변수//////////////////////////
////var _vPage = 0;
var _objData = new Object(); //전역 변수

////////////////////////jquery event///////////////////////
////$(function () {	

////	//수정이 아닌 경우 select 태그 세팅
////	if (_fnToNull($("#View_USR_ID").val()) != "") {
////		$("#select_status").val($("#View_APV_YN").val()).prop('checked', true);
////		$("#select_UserType").val($("#View_USR_TYPE").val()).prop('checked', true);
////		$("#select_Auth").val($("#View_AUTH_TYPE").val()).prop('checked', true);
////    }

////	//$("._btn_write").on("click", function (e) {
////	//	location.href = "/Admin/MemberWrite";
////	//});
////	//$("._btn_list").on("click", function (e) {
////	//	location.href = "/Admin/Member";
////	//});
////});

//////아이디 입력 시 중복 체크 초기화
////$(document).on("keyup", "#input_ID", function () {
////	_objData.CheckID = false;
////});

//////이메일 입력 시 중복 체크 초기화
////$(document).on("keyup", "#input_Email", function () {
////	_objData.CheckEmail = false;
////});

//////핸드폰 하이픈 넣기
////$(document).on("keyup", "#input_HP", function () {
////	if (_fnToNull($(this).val()) != "") {
////		$(this).val(_fnMakePhoneForm($(this).val()));
////	};
////});

//////이메일 입력 시 중복 체크 초기화
////$(document).on("keyup", "#input_CRN", function () {

////	var vValue = $(this).val().trim();

////	//숫자만 10자리 일 경우
////	if (vValue.replace(/[^0-9]/gi, '').length == 10) {
////		fnCheckCRNMember();
////	}
	
////});

////
////
////
///

//관리자 관리 등록 클릭 이벤트
$(document).on("click", "#Insert_Member", function () {
	fnInsertMember();
});

//관리자 관리 저장 완료 후 페이지 이동
$(document).on("click", "#btn_save_complete", function () {
	location.href = "/Admin/Member";
});

//관리자 관리 수정 버튼 이벤트
$(document).on("click", "#Modify_Member", function () {
	fnModifyMember();
});

//아이디 중복 체크
$(document).on("click", "#id_check", function () {
	fnCheckIDMember();
});

//삭제 버튼
$(document).on("click", "#Member_Delete", function () {
	fnMember_Confirm("삭제 하시겠습니까?");
});

//관리자 삭제 Confirm 취소 이벤트
$(document).on("click", "#Layer_Confirm_Cencel", function () {
	layerClose("#Member_Confirm");
});

//관리자 삭제 Confirm 삭제 이벤트
$(document).on("click", "#Layer_Confirm", function () {
	fnDeleteMember(); //파일 다운로드
	layerClose("#Member_Confirm");
});
////////////////////////////function///////////////////////
//////관리자 관리 - 아이디 중복 체크 로직
function fnCheckIDMember() {
	try {
		var objJsonData = new Object();

		//아이디가 없으면
		if (_fnToNull($("#m_id").val()) == "") {
			_fnAlertMsg("아이디를 입력 해 주세요.", "m_id");
			return false;
        }

		objJsonData.USR_ID = $("#m_id").val(); //검색 어떤걸로 하는지.

		$.ajax({
			type: "POST",
			url: "/Admin/fnCheckIDMember",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y")
				{
					_fnAlertMsg("사용 가능한 아이디 입니다.");
					_objData.CheckID = true;
                }
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("이미 사용중인 아이디 입니다.");
				} else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요");
					console.log("[Error - fnCheckIDMember]" + JSON.parse(result).Result[0]["trxMsg"]);
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
		console.log("[Error - fnCheckIDMember]" + err.message);
	}
}
//관리자 관리 - 관리자 등록
function fnInsertMember() {
	try {
		if (fnInsertValidation()) {
			var objJsonData = new Object();
		
			objJsonData.M_ID = _fnToNull($("#m_id").val());						//아이디
			objJsonData.PASSWORD = _fnToNull($("#password").val());				//비밀번호
			objJsonData.NAME = _fnToNull($("#name").val());
			objJsonData.MOBILE1 = _fnToNull($("#mobile1").val());
			objJsonData.MOBILE2 = _fnToNull($("#mobile2").val());
			objJsonData.MOBILE3 = _fnToNull($("#mobile3").val());			
		
			$.ajax({
				type: "POST",
				url: "/Admin/fnInsertMember",
				async: true,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
						fnCompleteAlert("등록 되었습니다.");
					}
					else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
						_fnAlertMsg("등록 되지 않았습니다.");
						console.log("[Fail - fnInsertMember]" + JSON.parse(result).Result[0]["trxMsg"]);
					}
					else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
						_fnAlertMsg("담당자에게 문의하세요.");
						console.log("[Error - fnInsertMember]" + JSON.parse(result).Result[0]["trxMsg"]);
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
        }
	
	} catch (err) {
		console.log("[Error - fnCheckEmailMember]" + err.message);
	}
}

//////관리자 관리 - 관리자 등록
function fnModifyMember() {
	try {
		var objJsonData = new Object();

		objJsonData.MEMB_NO = _fnToNull($("#memb_no").val());
		objJsonData.NAME = _fnToNull($("#name").val());
		objJsonData.PASSWORD = _fnToNull($("#password").val());				//비밀번호
		objJsonData.MOBILE1 = _fnToNull($("#mobile1").val());
		objJsonData.MOBILE2 = _fnToNull($("#mobile2").val());
		objJsonData.MOBILE3 = _fnToNull($("#mobile3").val());

		$.ajax({
			type: "POST",
			url: "/Admin/fnModifyMember",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnCompleteAlert("수정 되었습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("수정 되지 않았습니다.");
					console.log("[Fail - fnCheckEmailMember]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnCheckEmailMember]" + JSON.parse(result).Result[0]["trxMsg"]);
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
		console.log("[Error - fnCheckEmailMember]" + err.message);
	}
}

//관리자 삭제 함수
function fnDeleteMember() {
	try {

		var objJsonData = new Object();
		objJsonData.MEMB_NO = _fnToNull($("#memb_no").val());

		$.ajax({
			type: "POST",
			url: "/Admin/fnDeleteMember",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
					fnCompleteAlert("삭제 되었습니다.");
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
					_fnAlertMsg("삭제 되지 않았습니다.");
					console.log("[Fail - fnDeleteMember]" + JSON.parse(result).Result[0]["trxMsg"]);
				}
				else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
					_fnAlertMsg("담당자에게 문의하세요.");
					console.log("[Error - fnDeleteMember]" + JSON.parse(result).Result[0]["trxMsg"]);
				}

			}, error: function (xhr) {
				_fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	}
	catch (err) {
		console.log("[Error - fnDeleteMember]" + err.message);
	}
}

//완료 후 alert창
function fnCompleteAlert(msg) {
	$("#layer_complete_alert .inner").html(msg);
	layerPopup2('#layer_complete_alert');
	$("#btn_save_complete").focus();
}

//confirm 레이어 팝업 띄우기
function fnMember_Confirm(msg) {
	$("#Member_Confirm .inner").html(msg);
	layerPopup2('#Member_Confirm');
	$("#Layer_Confirm").focus();
}

//////관리자 관리 - 관리자 수정
//////function fnUpdateMember() {
//////	try {
//////		var objJsonData = new Object();
//////		objJsonData.EMAIL = $("#input_Email").val(); //검색 어떤걸로 하는지.		

//////		$.ajax({
//////			type: "POST",
//////			url: "/Admin/fnCheckEmailMember",
//////			async: true,
//////			cache: false,
//////			dataType: "Json",
//////			data: { "vJsonData": _fnMakeJson(objJsonData) },
//////			success: function (result) {
//////				fnMakeMember(result);
//////				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
//////					fnPaging(JSON.parse(result).Member[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
//////				}
//////			}, error: function (xhr) {
//////				$("#ProgressBar_Loading").hide(); //프로그래스 바
//////				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
//////				console.log(xhr);
//////			},
//////			beforeSend: function () {
//////				$("#ProgressBar_Loading").show(); //프로그래스 바
//////			},
//////			complete: function () {
//////				$("#ProgressBar_Loading").hide(); //프로그래스 바
//////			}
//////		});
//////	} catch (err) {
//////		console.log("[Error - fnCheckEmailMember]" + err.message);
//////	}
//////}

//등록 밸리데이션
function fnInsertValidation() {

	//아이디 밸리데이션
	if (_fnToNull($("#m_id").val()) == "") {
		_fnAlertMsg("아이디를 입력 해 주세요.", "m_id");
		return false;
	}	

	//비밀번호 밸리데이션
	if (_fnToNull($("#password").val()) == "") {
		_fnAlertMsg("비밀번호를 입력 해 주세요.", "password");
		return false;
	}

	//비밀번호 밸리데이션
		if ($('#password').val().length < 4 || $('#password').val().length > 26) {
		_fnAlertMsg("패스워드가 4자 이상 26자 이하 이어야 합니다.", "password");
		return false;
	}

	//아이디 중복 확인 체크
	if (!_objData.CheckID) {
		_fnAlertMsg("아이디 중복체크를 해 주세요.", "input_ID");
		return false;
	}

	return true;
}

////////검색
//////function fnMemberSearch() {
//////
//////	try {
//////
//////		var objJsonData = new Object();
//////		objJsonData.MEMBER_DIV = $("#select_Member_div").find('option:selected').val(); //검색 어떤걸로 하는지.
//////		objJsonData.INPUT_SEARCH = _fnToNull($("#input_Search").val());
//////
//////		if (_vPage == 0) {
//////			objJsonData.PAGE = 1;
//////		} else {
//////			objJsonData.PAGE = _vPage;
//////		}
//////
//////		_vPage++;
//////
//////		$.ajax({
//////			type: "POST",
//////			url: "/Admin/fnSearchMember",
//////			async: true,
//////			cache: false,
//////			dataType: "Json",
//////			data: { "vJsonData": _fnMakeJson(objJsonData) },
//////			success: function (result) {
//////				fnMakeMember(result);
//////				if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
//////					fnPaging(JSON.parse(result).Member[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
//////				}
//////			}, error: function (xhr) {
//////				$("#ProgressBar_Loading").hide(); //프로그래스 바
//////				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
//////				console.log(xhr);
//////			},
//////			beforeSend: function () {
//////				$("#ProgressBar_Loading").show(); //프로그래스 바
//////			},
//////			complete: function () {
//////				$("#ProgressBar_Loading").hide(); //프로그래스 바
//////			}
//////		});
//////	} catch (err) {
//////		console.log("[Error - fnMemberSearch]" + err.message);
//////    }
//////}



/////////////////////function MakeList/////////////////////
////////관리자 검색 데이터 그리기
//////function fnMakeMember(vJsonData) {
//////	var vHTML = "";
//////	vResult = JSON.parse(vJsonData).Member;
//////
//////	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
//////
//////		$.each(vResult, function (i) {
//////
//////			vHTML += "   <tr> ";
//////			vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["USR_ID"]) + "</td> ";			
//////
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["USR_ID"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["LOC_NM"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["HP_NO"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["CUST_NM"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["USR_TYPE"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnToNull(vResult[i]["AUTH_TYPE"]) + "</td> ";
//////			vHTML += "   	<td>" + _fnFormatDate(_fnToNull(vResult[i]["INS_YMD"])) + "</td> ";
//////			vHTML += "   	<td> ";
//////			vHTML += "   		<div class=\"btn-group btn_padding\" role=\"group\"> ";
//////			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Member_Modify\" class=\"btn btn-primary pull-right _btn_modify\"><i class=\"fa fa-pencil-square-o\"></i>&nbsp;수정</a>			 ";
//////			vHTML += "   		</div> ";
//////			vHTML += "   		<div class=\"btn-group\" role=\"group\" aria-label=\"버튼\"> ";
//////			vHTML += "   			<a href=\"javascript:void(0);\" type=\"button\" name=\"Member_Delete\" class=\"btn btn-primary pull-right _btn_delete\"><i class=\"fa fa-th-list\"></i>&nbsp;삭제</a> ";
//////			vHTML += "   		</div> ";
//////			vHTML += "   	</td> ";
//////			vHTML += "   </tr> ";
//////		});
//////	}
//////	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
//////		vHTML += "   <tr> ";
//////		vHTML += "   	<td colspan=\"8\">데이터가 없습니다.</td> ";
//////		vHTML += "   </tr> ";
//////		console.log("[Fail - fnMakeMember] : " + JSON.parse(vJsonData).Result[0]["trxMsg"]);
//////	}
//////	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
//////		console.log("[Error - fnMakeMember] : " + JSON.parse(vJsonData).Result[0]["trxMsg"]);
//////	}
//////
//////	$("#Member_Result")[0].innerHTML = vHTML;
//////} 


////////////////////////////API////////////////////////////

