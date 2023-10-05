////////////////////전역 변수//////////////////////////
var _vAPV_NO = "";
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#Sign .inner").addClass("on");

        //이메일로 자동 로그인 해서 들어왔을 때 검색 되게.
        if (_fnToNull($("#View_APV_NO").val()) != "") {
            //싱글 검색
            fnSingleSearchData($("#View_APV_NO").val());
        }
        else {
            $("#input_DATE_START").val(fnSetPrevNextDate(_fnPlusDate(0), "Prev"));
            $("#input_DATE_END").val(fnSetPrevNextDate(_fnPlusDate(0), "Next"));
        }
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_DATE_START", function () {
    var vValue = $("#input_DATE_START").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val($("#input_DATE_END").val());
        $(this).focus();
    }

    //날짜 벨리데이션 체크$
    var vETD = $("#input_DATE_START").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_DATE_END").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETD가 ETA 보다 빠를 수 없습니다. ");
        $("#input_DATE_START").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_DATE_END", function () {
    var vValue = $("#input_DATE_END").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val($("#input_DATE_START").val());
        $(this).focus();
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_DATE_START").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_DATE_END").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETA가 ETD 보다 빠를 수 없습니다. ");
        $("#input_DATE_END").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
    }
});

//지불일자 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_DATE_SUBMIT", function () {
    var vValue = $("#input_DATE_SUBMIT").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val(_fnPlusDate(0));
        $(this).focus();
    }    
});

//거래처 글자 길이가 길면 생기는 버튼 체크 로직
$(window).resize(function () {
    fnSetPlusBtn();
});

//조회 버튼 이벤트
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
});

//일괄 결재 레이어 팝업 버튼 클릭
$(document).on("click", "#btn_ALLSign", function () {
    _vAPV_NO = $(this).siblings("input[type='hidden']").val();
    layerPopup2("#layer_ALLSign");
});

//레이어 팝업 - 일괄 결재 확인 버튼 이벤트
$(document).on("click", "#btn_ALLSign_Confirm", function () {
    fnSetALLSign(_vAPV_NO);
    _vAPV_NO = "";
});

//레이어 팝업 - 일괄 결재 취소 버튼 이벤트
$(document).on("click", "#btn_ALLSign_Cancel", function () {    
    _vAPV_NO = "";
    layerClose("#layer_ALLSign");
});


//결재 버튼 레이어 팝업 버튼 클릭
$(document).on("click", "#btn_SingleSign", function () {
    _vAPV_NO = $(this).siblings("input[type='hidden']").val();
    layerPopup2("#layer_SingleSign");
});

//레이어 팝업 - 결재 확인 버튼 이벤트
$(document).on("click", "#btn_SingleSign_Confirm", function () {
    fnSetSingleSign(_vAPV_NO);
    _vAPV_NO = "";
});

//레이어 팝업 - 결재 취소 버튼 이벤트
$(document).on("click", "#btn_SingleSign_Cancel", function () {
    _vAPV_NO = "";
    layerClose("#layer_SingleSign");
});


//결재 취소 레이어 팝업 버튼 클릭
$(document).on("click", "#btn_SingleCancel", function () {
    _vAPV_NO = $(this).siblings("input[type='hidden']").val();
    layerPopup2("#layer_SingleCancel");
});

//레이어 팝업 - 결재 취소 버튼 이벤트
$(document).on("click", "#btn_SingleCancel_Confirm", function () {
    fnSetCancelSign(_vAPV_NO);
    _vAPV_NO = "";
});

//레이어 팝업 - 결재 취소의 취소 버튼 이벤트
$(document).on("click", "#btn_SingleCancel_Cancel", function () {
    _vAPV_NO = "";
    layerClose("#layer_SingleCancel");
});

//더보기 버튼 클릭 이벤트
$(document).on("click", ".btns.open", function () {
    $(this).closest('.result-tbl').find('.result-tbl__hidden').slideToggle();
    $(this).toggleClass('on');
});

////////////////////////function///////////////////////
//조회 버튼 이벤트
function fnSearchData() {
    try {       

        if (_fnToNull($("#input_DATE_SUBMIT").val()) == "") {
            _fnAlertMsg("지불 일자를 선택 해 주세요.");
            return false;
        }
        
        var objJsonData = new Object();

        objJsonData.MNGT_NO = "";
        objJsonData.DATE_START = _fnToNull($("#input_DATE_START").val().replace(/-/gi, ""));
        objJsonData.DATE_END = _fnToNull($("#input_DATE_END").val().replace(/-/gi, ""));
        objJsonData.DATE_SUBMIT = _fnToNull($("#input_DATE_SUBMIT").val().replace(/-/gi, "")); // Y : 미결재 , C : 진행중 , A : 완료 , R : 결재완료
        objJsonData.APV_STATUS = $("#select_SignStatus").find("option:selected").val();
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.USR_AUTH = _fnToNull($("#Session_AUTH_TYPE").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;
        
        $.ajax({
            type: "POST",
            url: "/Sign/fnSearchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSearchData(result);
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
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
        console.log("[Error - fnSearchData]" + err.message);
    }
}

//이메일로 넘어온 데이터 검색
function fnSingleSearchData(vValue) {
    try {

        var objJsonData = new Object();

        objJsonData.MNGT_NO = vValue;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));        
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Sign/fnSearchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //데이터 가져온거 세팅
                fnSetSingleData(result);
                fnMakeSearchData(result);
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
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
        console.log("[Error - fnSearchData]" + err.message);
    }
}

//거래처 네이밍 버튼 세팅
function fnSetPlusBtn() {
    try {
        var vDataLength = $("#Sign_Result .result-box").length;

        for (i = 0; i < vDataLength+1; i++) {
            if ($("#Sign_Result .result-box").eq(i).find(".result-type1").prop('scrollHeight') < 64) {
                $("#Sign_Result .result-box").eq(i).find(".result-type1").addClass('no_button');
                $("#Sign_Result .result-box").eq(i).find(".result-type1").removeClass('on');
                $("#Sign_Result .result-box").eq(i).find(".btns.plus").hide();
                $("#Sign_Result .result-box").eq(i).find(".btns.plus").removeClass("on");
            } else {
                $("#Sign_Result .result-box").eq(i).find(".result-type1").removeClass('no_button');
                $("#Sign_Result .result-box").eq(i).find(".btns.plus").show();
            }
        }

    }
    catch (err) {
        console.log("[Error - fnSetPlusBtn]" + err.message);
    }
}

//단건 결재
function fnSetSingleSign(vValue) {
    try {

        layerClose("#layer_SingleSign");

        //실제 함수
        var objJsonData = new Object();
        objJsonData.APV_NO = vValue;
        objJsonData.STATUS = "Y";
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val().replace(/ /gi, ""));
        objJsonData.DEPT_NM = _fnToNull($("#Session_DEPT_NM").val().replace(/ /gi, ""));
        
        $.ajax({
            type: "POST",
            url: "/Sign/fnSetSingleSign",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("결재가 완료 되었습니다.");
                    fnSearchData(); //결재 완료 후 재 검색

                    //Web Push가 Y인 경우에만
                    if (_fnToNull(_Push_Setting) == "Y") 
                    {
                        //푸쉬 알림 Y인 사람만 보내주기
                        if (JSON.parse(result).Sign[0]["EAP_MSG_RCV_YN"] == "Y") {
                            var vTitle = "";
                            if (JSON.parse(result).Sign[0]["APV_STAT"] == "A") {
                                vTitle = "[승인완료] " + JSON.parse(result).Sign[0]["TITLE"];
                            } else if (JSON.parse(result).Sign[0]["SUBMIT_STAT"] == "C") {
                                vTitle = "[결재취소] " + JSON.parse(result).Sign[0]["TITLE"];
                            } else {
                                vTitle = "[결재요청] " + JSON.parse(result).Sign[0]["TITLE"];
                            }

                            //Push Message 세팅
                            var pushObj = new Object();
                            pushObj.JOB_TYPE = "";
                            pushObj.MSG = vTitle;
                            pushObj.REF1 = "EapApprovalMgt";
                            pushObj.REF2 = JSON.parse(result).Sign[0]["APV_NO"];
                            pushObj.REF3 = JSON.parse(result).Sign[0]["APV_YMD"];
                            pushObj.REF4 = "";
                            pushObj.REF5 = "";
                            pushObj.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
                            pushObj.RCV = JSON.parse(result).Sign[0]["USR_ID"];

                            Chathub_Push_Message(pushObj);
                        }
                    }       
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                    fnSearchData(); //결재 실패 후 재 검색
                    console.log("[Fail - fnSetSingleSign Code]" + JSON.parse(result).Result[0]["trxCode"]);
                    console.log("[Fail - fnSetSingleSign Message]" + JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Fail - fnSetSingleSign APV_NO]" + vValue);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnSetSingleSign Code]" + JSON.parse(result).Result[0]["trxCode"]);
                    console.log("[Error - fnSetSingleSign Message]" + JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Error - fnSetSingleSign APV_NO]" + vValue);
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                console.log(error);
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
        console.log("[Error - fnSetSingleSign]" + err.message);
    }
}

//단건 조회 시 데이터 세팅
function fnSetSingleData(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Sign;

            $("#input_DATE_START").val(_fnFormatDate(vResult[0]["APV_YMD"]));
            $("#input_DATE_END").val(_fnFormatDate(vResult[0]["APV_YMD"]));
            $("#input_DATE_SUBMIT").val(_fnFormatDate(vResult[0]["SUBMIT_YMD"]));

            //미결재일 경우에는 Y
            //if (vResult[0]["MY_APV_YN"] == "Y") {
            //    $("#select_SignStatus").val("Y");
            //} else {
            //    $("#select_SignStatus").val(vResult[0]["APV_STAT"]);
            //}
        }
        else {
            //데이터 검색이 되지 않을 경우에는 기본 세팅
            $("#input_DATE_START").val(fnSetPrevNextDate(_fnPlusDate(0), "Prev"));
            $("#input_DATE_END").val(fnSetPrevNextDate(_fnPlusDate(0), "Next"));
        }
    }
    catch (err) {
        console.log("[Error - fnSetSingleData]" + err.message);
    }
}

//결재 취소 로직
function fnSetCancelSign(vValue) {
    try {
        layerClose("#layer_SingleCancel");

        //실제 함수
        var objJsonData = new Object();
        objJsonData.APV_NO = vValue;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val().replace(/ /gi, ""));
        objJsonData.DEPT_NM = _fnToNull($("#Session_DEPT_NM").val().replace(/ /gi, ""));

        $.ajax({
            type: "POST",
            url: "/Sign/fnSetCancelSign",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("결재 취소가 완료 되었습니다.");
                    fnSearchData(); //결재 완료 후 재 검색

                    //Web Push가 Y인 경우에만
                    if (_fnToNull(_Push_Setting) == "Y") {
                        //푸쉬 알림 Y인 사람만 보내주기
                        if (JSON.parse(result).Sign[0]["EAP_MSG_RCV_YN"] == "Y") {
                            var vTitle = "";
                            if (JSON.parse(result).Sign[0]["APV_STAT"] == "A") {
                                vTitle = "[승인완료] " + JSON.parse(result).Sign[0]["TITLE"];
                            } else if (JSON.parse(result).Sign[0]["SUBMIT_STAT"] == "C") {
                                vTitle = "[결재취소] " + JSON.parse(result).Sign[0]["TITLE"];
                            } else {
                                vTitle = "[결재요청] " + JSON.parse(result).Sign[0]["TITLE"];
                            }
                    
                            //Push Message 세팅
                            var pushObj = new Object();
                            pushObj.JOB_TYPE = "";
                            pushObj.MSG = vTitle;
                            pushObj.REF1 = "EapApprovalMgt";
                            pushObj.REF2 = JSON.parse(result).Sign[0]["APV_NO"];
                            pushObj.REF3 = JSON.parse(result).Sign[0]["APV_YMD"];
                            pushObj.REF4 = "";
                            pushObj.REF5 = "";
                            pushObj.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
                            pushObj.RCV = JSON.parse(result).Sign[0]["USR_ID"];
                    
                            Chathub_Push_Message(pushObj);
                        }
                    }

                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Fail - fnSetCancelSign Code]" + JSON.parse(result).Result[0]["trxCode"]);
                    console.log("[Fail - fnSetCancelSign Message]" + JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Fail - fnSetCancelSign APV_NO]" + vValue);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnSetCancelSign Code]" + JSON.parse(result).Result[0]["trxCode"]);
                    console.log("[Error - fnSetCancelSign Message]" + JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Error - fnSetCancelSign APV_NO]" + vValue);
                }

            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                console.log(error);
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
        console.log("[Error - fnSetCancelSign]" + err.message);
    }
}

//일괄 결재
function fnSetALLSign(vValue) {
    try {

        layerClose("#layer_ALLSign");

        //실제 함수
        var objJsonData = new Object();
        objJsonData.APV_NO = vValue;
        objJsonData.STATUS = "Y";
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val().replace(/ /gi, ""));
        objJsonData.DEPT_NM = _fnToNull($("#Session_DEPT_NM").val().replace(/ /gi, ""));
        objJsonData.ERROR = "";

        $.ajax({
            type: "POST",
            url: "/Sign/fnSetALLSign",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    if (_fnToNull(JSON.parse(result).Parameter[0]["ERROR"]) != "") {
                        _fnAlertMsg("일부 결재오류건이 발생되었습니다.");
                        fnSearchData(); //결재 완료 후 재 검색
                        console.log("[Fail - fnSetALLSign Code]" + JSON.parse(result).Parameter[0]["ERROR"]);
                    } else {
                        _fnAlertMsg("일괄 결재가 완료 되었습니다.");
                        fnSearchData(); //결재 완료 후 재 검색

                        //Web Push가 Y인 경우에만
                        if (_fnToNull(_Push_Setting) == "Y") {
                            //for문 돌려야 됨. (일괄이기 때문)
                            var vResult = JSON.parse(result).Sign;
                            if (vResult != undefined) {
                                $.each(vResult, function (i) {
                                    //푸쉬 알림 Y인 사람만 보내주기
                                    if (vResult[i]["EAP_MSG_RCV_YN"] == "Y") {
                                        var vTitle = "";
                                        if (vResult[i]["APV_STAT"] == "A") {
                                            vTitle = "[승인완료] " + vResult[i]["TITLE"];
                                        } else if (vResult[i]["SUBMIT_STAT"] == "C") {
                                            vTitle = "[결재취소] " + vResult[i]["TITLE"];
                                        } else {
                                            vTitle = "[결재요청] " + vResult[i]["TITLE"];
                                        }
                        
                                        //Push Message 세팅
                                        var pushObj = new Object();
                                        pushObj.JOB_TYPE = "";
                                        pushObj.MSG = vTitle;
                                        pushObj.REF1 = "EapApprovalMgt";
                                        pushObj.REF2 = vResult[i]["APV_NO"];
                                        pushObj.REF3 = vResult[i]["APV_YMD"];
                                        pushObj.REF4 = "";
                                        pushObj.REF5 = "";
                                        pushObj.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
                                        pushObj.RCV = vResult[i]["USR_ID"];
                        
                                        Chathub_Push_Message(pushObj);
                                    }
                                });
                            }
                        }
                    }

                } else {
                    _fnAlertMsg("결재가 되지 않았습니다.");
                    console.log("[Fail - fnSetALLSign Code]" + JSON.parse(result).Result[0]["trxCode"]);
                    console.log("[Fail - fnSetALLSign Message]" + JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Fail - fnSetALLSign APV_NO]" + vValue);
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                console.log(error);
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
        console.log("[Error - fnSetALLSign]" + err.message);
    }
}


/////////////////function MakeList/////////////////////
//검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Sign;
                        
            //미결재로 조회했을 경우에만 보여지게 수정
            if ($("#select_SignStatus").find("option:selected").val() == "Y") {
                if (_fnToNull(vResult[0]["MY_APV_YN"]) == "Y") {
                    var vTotalPrice = 0;
                    var vAPV_NO = "";

                    //Total 계산 
                    $.each(vResult, function (i) {
                        vTotalPrice += Number(vResult[i]["TOT_LOC_AMT"]);

                        if (vAPV_NO == "") {
                            vAPV_NO += vResult[i]["APV_NO"];
                        } else {
                            vAPV_NO += "," + vResult[i]["APV_NO"];
                        }
                    });

                    vHTML += "   	<div class=\"sign-once__bg\"> ";
                    vHTML += "   		<div class=\"sign-once__flex\"> ";
                    vHTML += "   			<div class=\"sign-once__detail\"> ";
                    vHTML += "   				<div class=\"sign-once__title\">지출일자</div> ";
                    vHTML += "   				<div class=\"sign-once__desc\">" + _fnFormatDate(_fnToNull(vResult[0]["SUBMIT_YMD"])) + "</div> ";
                    vHTML += "   				<div class=\"sign-once__title\">결재총액(KRW)</div> ";
                    vHTML += "   				<div class=\"sign-once__desc\">KRW " + fnPriceComma(vTotalPrice) + "</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<button type=\"button\" class=\"btns all\" id=\"btn_ALLSign\"><img src=\"/Images/Sign/icn_stamp.png\" />일괄결재</button> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vAPV_NO + "\" /> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
            }

            $.each(vResult, function (i) {                                     

                //미결재 , 완료 , 반려 , 하위결재자 진행중 건이 아닌 경우에는 나오지 않게 수정
                if (_fnToNull(vResult[i]["MY_APV_YN"] == "Y") || _fnToNull(vResult[i]["MY_APV_YN"] == "C") || (vResult[i]["NOW_LINE_SEQ"] >= vResult[i]["MY_LINE_SEQ"]) || _fnToNull(vResult[i]["APV_STAT"]) == "A" || _fnToNull(vResult[i]["APV_STAT"]) == "R") {
                    vHTML += "   <div class=\"result-box\"> ";
                    vHTML += "   	<div class=\"result-title2\"> ";
                    vHTML += "   		<h3 class=\"result-type1\">" + _fnToNull(vResult[i]["CUST_NM"]) + "</h3> ";
                    vHTML += "   		<button type=\"button\" class=\"btns plus\"></button> ";
                    vHTML += "   	</div> ";

                    //상태 값으로 버튼
                    if (_fnToNull(vResult[i]["MY_APV_YN"] == "Y")) {
                        vHTML += "   	<div class=\"sign-info pend\"> ";
                    }
                    else if (_fnToNull(vResult[i]["APV_STAT"]) == "C" || _fnToNull(vResult[i]["APV_STAT"]) == "S") {
                        vHTML += "   	<div class=\"sign-info ongoing\"> ";
                    }
                    else if (_fnToNull(vResult[i]["APV_STAT"]) == "A") {
                        vHTML += "   	<div class=\"sign-info complete\"> ";
                    }
                    else if (_fnToNull(vResult[i]["APV_STAT"]) == "R") {
                        vHTML += "   	<div class=\"sign-info cancel\"> ";
                    }

                    vHTML += "   		<div class=\"sign-info__cont\"> ";
                    vHTML += "   			<p>결재번호 : <span>" + _fnToNull(vResult[i]["APV_NO"]) + "</span></p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"sign-info__cont\"> ";
                    vHTML += "   			<p>지출일자 : <span>" + _fnFormatDate(_fnToNull(vResult[i]["SUBMIT_YMD"])) + "</span></p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"sign-info__cont\"> ";
                    vHTML += "   			<p>청구(KRW) : <span class=\"red\">KRW " + fnPriceComma(_fnToNull(vResult[i]["TOT_LOC_AMT"])) + "</span></p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"result-customer__detail\"> ";
                    vHTML += "   		<div class=\"result-tbl\"> ";
                    vHTML += "   			<div class=\"result-tbl__button\"> ";
                    vHTML += "   				<button type=\"button\" class=\"btns open\"><span class=\"hidden\">펼치기</span></button> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"result-tbl__hidden\"> ";
                    vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>정산처코드</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["CUST_CD"]) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>HBL건수</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["HBL_CNT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>매입증빙여부</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["BEV_YN"]) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   				</div> ";
                    vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>청구(KRW)</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["TOT_LOC_AMT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>청구(USD)</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["TOT_USD_AMT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>운임(KRW)</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["FARE_LOC_AMT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   				</div> ";
                    vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>운임(USD)</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["FARE_USD_AMT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>VAT</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["VAT"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>청구환종</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + fnPriceComma(_fnToNull(vResult[i]["CURR_CD"])) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   				</div> ";
                    vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>은행명</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["BACK_NAME"]) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>계좌번호</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["ACNT_NO"]) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                    vHTML += "   						<div class=\"result-tbl__title2\"><p>예금주</p></div> ";
                    vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["ACNT_HOLD"]) + "</p></div> ";
                    vHTML += "   					</div> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";

                    if (_fnToNull(vResult[i]["MY_APV_YN"] == "Y")) {
                        vHTML += "   			<div class=\"result-tbl__button2\"> ";
                        vHTML += "   				<button type=\"button\" class=\"btns sign-in\" id=\"btn_SingleSign\">결재</button> ";
                        vHTML += "   			    <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["APV_NO"]) + "\" /> ";
                        vHTML += "   			</div> ";
                    }
                    else if (_fnToNull(vResult[i]["MY_APV_YN"]) == "C" && (_fnToNull(vResult[i]["APV_STAT"]) == "C" || _fnToNull(vResult[i]["APV_STAT"]) == "S")) {
                        vHTML += "   			<div class=\"result-tbl__button2\"> ";
                        vHTML += "   				<button type=\"button\" class=\"btns sign-in type2\" id=\"btn_SingleCancel\">결재취소</button> ";
                        vHTML += "   			    <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["APV_NO"]) + "\" /> ";
                        vHTML += "   			</div> ";
                    }

                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }

                //데이터가 없을 경우
                if (_fnToNull(vHTML) == "") {
                    vHTML += "   <div class=\"result-box no-data\"> ";
                    vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
                    vHTML += "   	<span>검색 결과가 없습니다.</span>	 ";
                    vHTML += "   </div> ";
                }

            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>검색 결과가 없습니다.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>관리자에게 문의 하세요.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Sign_Result")[0].innerHTML = vHTML;
        fnSetPlusBtn();
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}
////////////////////////API////////////////////////////
