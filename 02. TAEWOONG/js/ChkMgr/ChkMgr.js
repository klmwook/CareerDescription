////////////////////전역 변수//////////////////////////
var _vINV_NO = "";
var _vEmail = false; //이메일로 접속 했을 때
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#ChkMgr .inner").addClass("on");
    }

    //이메일로 들어온 데이터
    if (_fnToNull($("#View_INV_NO").val()) != "") {
        _vEmail = true;        
        fnSingleSearchData($("#View_INV_NO").val());
    }

});

//거래처 글자 길이가 길면 생기는 버튼 체크 로직
$(window).resize(function () {
    fnSetPlusBtn();
});

//더보기 버튼 클릭 이벤트
$(document).on("click", ".btns.open", function () {
    $(this).closest('.result-tbl').find('.result-tbl__hidden').slideToggle();
    $(this).toggleClass('on');
});

//일괄확인 버튼 이벤트
$(document).on("click", "button[name='btn_ALLCircle']", function () {
    _vINV_NO = $(this).siblings("input").val();    
    layerPopup2("#layer_ALLCircle");
});

$(document).on("click", "#btn_ALLCircle_Cancel", function () {
    _vINV_NO = "";
    layerClose("#layer_ALLCircle");
});

$(document).on("click", "#btn_ALLCircle_Confirm", function () {
    layerClose("#layer_ALLCircle");
    fnSetALLCircle(_vINV_NO);
    _vINV_NO = "";
});

//일괄취소 버튼 이벤트
$(document).on("click", "button[name='btn_ALLCancel']", function () {
    _vINV_NO = $(this).siblings("input").val();
    layerPopup2("#layer_ALLCancel");
});

$(document).on("click", "#btn_ALLCancel_Cancel", function () {
    _vINV_NO = "";
    layerClose("#layer_ALLCancel");
});

$(document).on("click", "#btn_ALLCancel_Confirm", function () {
    layerClose("#layer_ALLCancel");
    fnSetALLCancel(_vINV_NO);
    _vINV_NO = "";
});

//확인 버튼 이벤트
$(document).on("click", "button[name='btn_SingleCircle']", function () {
    _vINV_NO = $(this).siblings("input").val();
    layerPopup2("#layer_SingleCircle");
});

$(document).on("click", "#btn_SingleCircle_Cancel", function () {
    _vINV_NO = "";
    layerClose("#layer_SingleCircle");
});

$(document).on("click", "#btn_SingleCircle_Confirm", function () {
    layerClose("#layer_SingleCircle");
    fnSetSingleCircle(_vINV_NO);
    _vINV_NO = "";
});

//확인취소 버튼 이벤트
$(document).on("click", "button[name='btn_SingleCancel']", function () {
    _vINV_NO = $(this).siblings("input").val();
    layerPopup2("#layer_SingleCancel");
});

$(document).on("click", "#btn_SingleCancel_Cancel", function () {
    _vINV_NO = "";
    layerClose("#layer_SingleCancel");
});

$(document).on("click", "#btn_SingleCancel_Confirm", function () {
    layerClose("#layer_SingleCancel");
    fnSetSingleCancel(_vINV_NO);
    _vINV_NO = "";
});

//지불일자 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_Settle_DATE", function () {
    var vValue = $(this).val();
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

$(document).on("click", "#btn_Search", function () {
    _vEmail = false;
    fnSearchData();
});
////////////////////////function///////////////////////
//팀장확인 검색 데이터
function fnSearchData() {
    try {        
        var objJsonData = new Object();

        //정산일자 밸리데이션
        if (_fnToNull($("#input_Settle_DATE").val()) == "") {
            _fnAlertMsg("정산 일자를 입력 해 주세요.");
            return false;
        }

        if (_fnToNull($("#select_Settle_Type").find("option:selected").val()) == "") {
            _fnAlertMsg("정산서 종류를 선택 해 주세요.");
            return false;
        }

        objJsonData.MNGT_NO = "";
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.DEPT_CD = _fnToNull($("#Session_DEPT_CD").val().replace(/ /gi, ""));
        objJsonData.INV_YMD = $("#input_Settle_DATE").val().replace(/-/gi, ""); //정산일자
        objJsonData.HBL_NO = $("#input_HBL_NO").val(); //HBL_NO
        objJsonData.SETTLE_TYPE = $("#select_Settle_Type").find("option:selected").val(); //정산서 종류
        objJsonData.PL_CFRM = $("#select_ChkMgr").find("option:selected").val(); //팀장확인 여부

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSearchData",
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

    } catch (e) {
        console.log(e.message);
    }
}

//이메일로 넘겨온 단일건 조회
function fnSingleSearchData(vMNGT_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMNGT_NO;
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.DEPT_CD = _fnToNull($("#Session_DEPT_CD").val().replace(/ /gi, ""));

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSearchData",
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
        console.log("[Error - fnSingleSearchData]");
    }
}

//거래처 네이밍 버튼 세팅
function fnSetPlusBtn() {
    try {
        var vDataLength = $("#ChkMgr_Result .result-box").length;

        for (i = 0; i < vDataLength; i++) {
            if ($("#ChkMgr_Result .result-box").eq(i).find(".result-type1").prop('scrollHeight') < 64) {
                $("#ChkMgr_Result .result-box").eq(i).find(".result-type1").addClass('no_button');
                $("#ChkMgr_Result .result-box").eq(i).find(".result-type1").removeClass('on');
                $("#ChkMgr_Result .result-box").eq(i).find(".btns.plus").hide();
                $("#ChkMgr_Result .result-box").eq(i).find(".btns.plus").removeClass("on");
            } else {
                $("#ChkMgr_Result .result-box").eq(i).find(".result-type1").removeClass('no_button');
                $("#ChkMgr_Result .result-box").eq(i).find(".btns.plus").show();
            }
        }

    }
    catch (err) {
        console.log("[Error - fnSetPlusBtn]" + err.message);
    }
}

//단일 건 팀장 확인
function fnSetSingleCircle(vINV_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.INV_NO = vINV_NO

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSetCircle",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("확인 되었습니다.");

                    //이메일로 들어왔을 경우.
                    if (_vEmail) {
                        fnSingleSearchData($("#View_INV_NO").val());
                    } else {
                        fnSearchData();
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("확인 실패 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("확인 실패 되었습니다.<br/>Error - " + JSON.parse(result).Result[0]["trxMsg"]);
                }

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
        console.log("[Error - fnSetSingleCircle]" + err.message);
    }
}

//단일 건 팀장 확인 취소
function fnSetSingleCancel(vINV_NO) {
    try {
        var objJsonData = new Object();
                
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.INV_NO = vINV_NO

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSetCancel",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y")
                {
                    _fnAlertMsg("확인 취소 되었습니다.");

                    //이메일로 들어왔을 경우.
                    if (_vEmail) {                        
                        fnSingleSearchData($("#View_INV_NO").val());
                    } else {
                        fnSearchData();
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N")
                {
                    _fnAlertMsg("확인 취소가 실패 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("확인 취소가 실패 되었습니다.<br/>Error - " + JSON.parse(result).Result[0]["trxMsg"]);
                }

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
        console.log("[Error - fnSetSingleCancel]" + err.message);
    }
}

//일괄 팀장 확인
function fnSetALLCircle(vINV_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.INV_NO = vINV_NO
        objJsonData.ERROR = "";

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSetALLCircle",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //Error건이 있는지 체크
                    if (_fnToNull(JSON.parse(result).Parameter[0]["ERROR"]) != "") {
                        _fnAlertMsg("일부 결재오류 건이 발생되었습니다.");
                        console.log("[Fail - fnSetALLCircle Code]" + JSON.parse(result).Parameter[0]["ERROR"]);
                    } else {
                        _fnAlertMsg("일괄 확인 되었습니다.");
                        fninit();
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("일괄 확인이 실패 되었습니다.<br/>Error - " + JSON.parse(result).Result[0]["trxMsg"]);
                }

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
        console.log("[Error - fnSetALLCircle]" + err.message);
    }
}

//일괄 확인 취소 함수
function fnSetALLCancel(vINV_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.INV_NO = vINV_NO
        objJsonData.ERROR = "";

        $.ajax({
            type: "POST",
            url: "/ChkMgr/fnSetALLCancel",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //Error건이 있는지 체크
                    if (_fnToNull(JSON.parse(result).Parameter[0]["ERROR"]) != "") {
                        _fnAlertMsg("일부 결재오류 건이 발생되었습니다.");
                        console.log("[Fail - fnSetALLCancel Code]" + JSON.parse(result).Parameter[0]["ERROR"]);
                    } else {
                        _fnAlertMsg("일괄 확인 취소 되었습니다.");
                        fninit();
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("일괄 확인 취소가 실패 되었습니다.<br/>Error - " + JSON.parse(result).Result[0]["trxMsg"]);
                }

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
        console.log("[Error - fnSetALLCancel]" + err.message);
    }
}

//일괄 조회 및 이메일 조회 했을 경우 초기화
function fninit() {
    try {
        $("#input_Settle_DATE").val("");
        $("#input_HBL_NO").val();
        $("#select_Settle_Type").val("");
        $("#select_ChkMgr").val("");

        //초기화
        var vHTML = "";

        vHTML += "   <div class=\"result-box no-data\"> ";
        vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
        vHTML += "   	<span id=\"no_data_text\"></span> ";
        vHTML += "   </div> ";

        $("#ChkMgr_Result")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fninit]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).ChkMgr;

            vHTML += "  ";            

            //일괄처리 - 이메일로 넘어왔을 경우 예외 처리 추가
            if (_fnToNull($("#select_ChkMgr").find("option:selected").val()) != "" || _vEmail == true) {

                var vBoolean = true; 

                //이메일로 넘어온 데이터가 각자 다른 경우 체크
                if (_vEmail) {
                    $.each(vResult, function (i) {
                        if (vResult.length > 1) {
                            if (i != 0) {
                                if (vResult[0]["PL_CFRM"] != vResult[i]["PL_CFRM"]) {
                                    vBoolean = false;
                                }
                            }
                        }
                    });

                    if (vBoolean) {
                        if (vResult[0]["PL_CFRM"] == "Y") {
                            $("#select_ChkMgr").val("Y");
                        }
                        else if (vResult[0]["PL_CFRM"] == "N") {
                            $("#select_ChkMgr").val("N");
                        }
                    }
                    else {
                        $("#select_ChkMgr").val("");
                    }
                } 

                if (vBoolean) {
                    var vTotalPrice = 0;
                    var vINV_NO = "";

                    //Total 계산 
                    $.each(vResult, function (i) {
                        vTotalPrice += Number(vResult[i]["TOT_LOC_AMT"]);

                        if (vINV_NO == "") {
                            vINV_NO += vResult[i]["INV_NO"];
                        } else {
                            vINV_NO += "," + vResult[i]["INV_NO"];
                        }
                    });

                    if (_fnToNull($("#select_ChkMgr").find("option:selected").val()) == "Y") //일괄 확인
                    {
                        vHTML += "   <div class=\"cancel-once\"> ";
                        vHTML += "   	<div class=\"cancel-once__bg\"> ";
                        vHTML += "   		<div class=\"cancel-once__flex\"> ";
                        vHTML += "   			<div class=\"cancel-once__detail\"> ";
                        vHTML += "   				<div class=\"cancel-once__title\">정산일자</div> ";
                        vHTML += "   				<div class=\"cancel-once__desc\">" + _fnFormatDate(_fnToNull(vResult[0]["INV_YMD"])) + "</div> ";
                        vHTML += "   				<div class=\"cancel-once__title\">금액(KRW)</div> ";
                        vHTML += "   				<div class=\"cancel-once__desc\">" + fnPriceComma(vTotalPrice) + "</div> ";
                        vHTML += "   			</div> ";
                        vHTML += "   			<button type=\"button\" class=\"btns cancle\" name=\"btn_ALLCancel\"><img src=\"/Images/ChkMgr/Cancel.png\" />일괄취소</button> ";
                        vHTML += "   			<input type=\"hidden\" value=\"" + vINV_NO + "\" /> ";
                        vHTML += "   		</div> ";
                        vHTML += "   	</div> ";
                        vHTML += "   </div> ";
                    }
                    else if (_fnToNull($("#select_ChkMgr").find("option:selected").val()) == "N") //일괄 확인취소
                    {
                        vHTML += "   <div class=\"circle-once\"> ";
                        vHTML += "   	<div class=\"circle-once__bg\"> ";
                        vHTML += "   		<div class=\"circle-once__flex\"> ";
                        vHTML += "   			<div class=\"circle-once__detail\"> ";
                        vHTML += "   				<div class=\"circle-once__title\">정산일자</div> ";
                        vHTML += "   				<div class=\"circle-once__desc\">" + _fnFormatDate(_fnToNull(vResult[0]["INV_YMD"])) + "</div> ";
                        vHTML += "   				<div class=\"circle-once__title\">금액(KRW)</div> ";
                        vHTML += "   				<div class=\"circle-once__desc\">" + fnPriceComma(vTotalPrice) + "</div> ";
                        vHTML += "   			</div> ";
                        vHTML += "   			<button type=\"button\" class=\"btns cancle\" name=\"btn_ALLCircle\"><img src=\"/Images/ChkMgr/Circle.png\" />일괄확인</button> ";
                        vHTML += "   			<input type=\"hidden\" value=\"" + vINV_NO + "\" /> ";
                        vHTML += "   		</div> ";
                        vHTML += "   	</div> ";
                        vHTML += "   </div> ";
                    }
                }

                
            }

            $.each(vResult, function (i) {

                vHTML += "   <div class=\"result-box\"> ";
                vHTML += "   	<div class=\"result-title2\"> ";
                vHTML += "   		<h3 class=\"result-type1\">" + _fnToNull(vResult[i]["CUST_NM"]) + "</h3> ";
                vHTML += "   		<button type=\"button\" class=\"btns plus\"></button> ";
                vHTML += "   	</div> ";

                //확인 / 확인취소
                if (_fnToNull(vResult[i]["PL_CFRM"]) == "Y") {
                    vHTML += "   	<div class=\"chkmgr-info circle\"> ";
                }
                else if (_fnToNull(vResult[i]["PL_CFRM"]) == "N") {
                    vHTML += "   	<div class=\"chkmgr-info cancel\"> ";
                }

                vHTML += "   		<div class=\"chkmgr-info__cont\"> ";
                vHTML += "   			<p>정산처명 : <span>" + _fnToNull(vResult[i]["CUST_NM"]) + "</span></p> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"chkmgr-info__cont\"> ";
                vHTML += "   			<p>HBL 번호 : <span></span>" + _fnToNull(vResult[i]["HBL_NO"]) + "</p> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"chkmgr-info__cont\"> ";
                vHTML += "   			<p>정산서 번호 : <span></span>" + _fnToNull(vResult[i]["INV_NO"]) + "</p> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"chkmgr-info__cont\"> ";
                vHTML += "   			<p>정산일자 : <span></span>" + _fnFormatDate(_fnToNull(vResult[i]["INV_YMD"])) + "</p> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"chkmgr-info__cont\"> ";

                if (_fnToNull(vResult[i]["CURR_CD"]) == "KRW") {
                    vHTML += "   			<p>금액(환종) : <span class=\"red\">" + _fnToNull(vResult[i]["CURR_CD"]) + " " + fnPriceComma(_fnToNull(vResult[i]["TOT_LOC_AMT"])) + "</span></p> ";
                } else {
                    vHTML += "   			<p>금액(환종) : <span class=\"red\">" + _fnToNull(vResult[i]["CURR_CD"]) + " " + fnPriceComma(_fnToNull(vResult[i]["TOT_USD_AMT"])) + "</span></p> ";
                }
                
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
                vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["HBL_CNT"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont2\"> ";
                vHTML += "   						<div class=\"result-tbl__title2\"><p>증빙여부</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["DOC_YN"]) + "</p></div> ";
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
                vHTML += "   						<div class=\"result-tbl__desc2\"><p>" + _fnToNull(vResult[i]["CURR_CD"]) + "</p></div> ";
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

                //확인 / 확인취소
                if (_fnToNull(vResult[i]["PL_CFRM"]) == "Y") {
                    vHTML += "   			<div class=\"result-tbl__button2\"> ";
                    vHTML += "   				<button type=\"button\" class=\"btns cancle-in\" name=\"btn_SingleCancel\">확인취소</button> ";
                    vHTML += "   			    <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\" /> ";
                    vHTML += "   			</div> ";
                }
                else if (_fnToNull(vResult[i]["PL_CFRM"]) == "N") {
                    vHTML += "              <div class=\"result-tbl__button2\"> ";
                    vHTML += "              	<button type=\"button\" class=\"btns circle-in\" name=\"btn_SingleCircle\">확인</button> ";
                    vHTML += "   			    <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\" /> ";
                    vHTML += "              </div> ";
                }
                
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";

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

        $("#ChkMgr_Result")[0].innerHTML = vHTML;
        fnSetPlusBtn();
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}
////////////////////////API////////////////////////////


