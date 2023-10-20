////////////////////전역 변수//////////////////////////
var _isConfirm;
var mymap;
var _initPage = "";
var Login_Count = 0;
////////////////////jquery event///////////////////////
$(function () {           

    //로그인 아이디 저장 체크가 되어있을 시 데이터 넣는 로직
    var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_SREX");
    if (_fnToNull(userInputId) != "") {
        $("#Login_ID").val(userInputId);
        $("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' class='chk' checked>");
    }

    //파라미터가 LoginPopup Y 가 있을 경우 로그인 레이어 팝업이 뜨게 끔 하는 로직
    if (_getParameter("LoginPopup") == "Y" && _fnToNull($("#Session_USR_ID").val()) == "") {
        fnShowLoginLayer("init");
    }

    //만약 파트너로 로그인이 되어있을 경우 
    if (_fnToNull($("#Session_USR_TYPE").val()) != "")
    {
        if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
            $(".login_info").addClass("partner");
        }
    }

});

//Confrim 이벤트
$(document).on("click", "#alert02_confirm", function () {
    _isConfirm = true;
});

//Confrim 이벤트
$(document).on("click", "#alert02_cencel", function () {
    _isConfirm = false;
});

//PC - 화물추적 버튼 이벤트
$(document).on("click", "#Pc_btn_Tracking", function () {        
    if (_fnToNull($("#Pc_Input_Tracking").val()) != "") {
        $("#Pc_Input_Tracking_Layer").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
        fngetLayerTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnAlertMsg2("검색할 번호를 입력해주세요");
    }
});

//PC - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Pc_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Pc_Input_Tracking").val()) != "") {
            $("#Pc_Input_Tracking_Layer").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
            fngetLayerTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg2("검색할 번호를 입력해주세요");
        }
    }
});

//모바일 - 화물추적 버튼 이벤트
$(document).on("click", "#Mo_btn_Tracking", function () {
    if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
        $("#Pc_Input_Tracking_Layer").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
        fngetLayerTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnAlertMsg2("검색할 번호를 입력해주세요");
    }
});

//모바일 - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Mo_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
            $("#Pc_Input_Tracking_Layer").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
            fngetLayerTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg2("검색할 번호를 입력해주세요");
        }
    }
});

//레이어 팝업 내에서 검색
$(document).on("click", "#Pc_btn_Tracking_Layer", function () {
    fngetLayerTracking($("#Pc_Input_Tracking_Layer").val().toUpperCase().trim());
});

//모바일 - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Pc_Input_Tracking_Layer", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Pc_Input_Tracking_Layer").val()) != "") {            
            fngetLayerTracking($("#Pc_Input_Tracking_Layer").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg2("검색할 번호를 입력해주세요");
        }
    }
});

//로그인 버튼 클릭 이벤트
$(document).on("click", "#Login_btn", function () {
    if (Login_Count == -3) {
        _fnLayerAlertMsg("보안문자를 그려주세요");
    } else {
        _fnLogin();
    }
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_ID", function (e) {
    if (e.keyCode == 13) {
        if (Login_Count == -3) {
            _fnLayerAlertMsg("보안문자를 그려주세요");
        } else {
            if (_fnToNull($("#Login_Password").val()) != "") {
                _fnLogin();
            } else {
                $("#Login_Password").focus();
            }
        }
    }
});

$(document).on("focus", "#Login_ID", function (e) {
    $("#Password_Warning").hide();
});

$(document).on("focus", "#Login_Password", function (e) {
    $("#Email_Warning").hide();
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_Password", function (e) {
    if (e.keyCode == 13) {
        if (Login_Count == -3) {
            _fnLayerAlertMsg("보안문자를 그려주세요");
        } else {
            _fnLogin();
        }
    }
});


//로그인 모션캡처 '새로고침' 버튼 이벤트 
$(document).on("click", ".refresh", function (e) {
    var vHTML = "";
    vHTML += "<div id=\"mc\">";
    vHTML += "<canvas id=\"mc-canvas\"  width=\"220\" height=\"200\"  class=\"mc-valid\"></canvas>";
    vHTML += "</div> ";

    $("#Captcha_Area").empty();
    $("#Captcha_Area").append(vHTML);

    //mc-form => Captcha_Area
    $('#Captcha_Area').motionCaptcha({
        action: '#fairly-unique-id',
        shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail']
    });
});

//로그인 레이어 팝업 보여주기
function fnShowLoginLayer(vValue) {

	if (vValue == "init") {
		//_LoginPageUrl = "/Schedule/SchList";
        _initPage = "";
    } else if (vValue.split(';')[0] == "goSEABooking" || vValue.split(';')[0] == "goFERRYBooking" || vValue.split(';')[0] == "goAIRBooking") {
        //_LoginPageUrl = "/Schedule/SchList";
        _initPage = vValue;
    } else {
        _initPage = vValue;
	}

    layerPopup2("#login_pop", false);
    $("#Login_Password").val("");
    $("#Login_ID").focus();    
}

//화물추적 레이어팝업 리스트 클릭 시 데이터 가져오기
$(document).on("click", ".pc_layer_trk_list", function () {

    if ($(this).css('background-color') != "rgb(245, 245, 245)") {
        $('.pc_layer_trk_list').css('background-color', "#fff");
        $('.mo_layer_trk_list').css('background-color', "#fff");
        $(this).css('background-color', "#f5f5f5");
        $(this).find('.mo_layer_trk_list').css('background-color', "#f5f5f5");

        var tr = $(this).children();

        fnGetLayerTrackingDetail(tr.eq(0).text(), tr.eq(1).text(), tr.eq(2).text(), tr.eq(3).text());
    }

});
////////////////////////function///////////////////////
function fngetLayerTracking(vMngtNo) {
    try {

        var rtnJson;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vMngtNo;
        objJsonData.OFFICE_CD = _Office_CD;

        if (isLayerChkBL(vMngtNo)) {
            $.ajax({
                type: "POST",
                url: "/Home/fnGetTrackingList",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
            
                    //받은 데이터 Y / N 체크
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnMakeLayerTrackingData(result);
                        fnMakeLayerTrackingList(result);
                        layerPopup2('#delivery_pop');
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        console.log("[Fail : fnGetTrackingList()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        layerClose('#delivery_pop');
                        _fnAlertMsg2("Tracking 정보가 없습니다");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        layerClose('#delivery_pop');
                        console.log("[Error : fnGetTrackingList()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        _fnAlertMsg2("[Error]관리자에게 문의 해 주세요.");
                    }
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                }, error: function (xhr, status, error) {
                    _fnAlertMsg2("담당자에게 문의 하세요.");
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
    }
    catch (err) {
        console.log("[Error - fnfngetLayerTracking()]" + err.message);
    }
}

//화물추적 B/L 제출 되었는지 확인
function isLayerChkBL(vMngtNo) {
    try {
        var isBoolean = true;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vMngtNo;

        $.ajax({
            type: "POST",
            url: "/Home/fnIsCheckBL",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //엘비스 - 제출 여부 확인
                    if (JSON.parse(result).Check[0]["CHKBL_YN"] == "N") {
                        _fnAlertMsg2("B/L 제출을 먼저 해주시기 바랍니다.");
                        isBoolean = false;
                    } else {
                        isBoolean = true;
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {                    
                    _fnAlertMsg2("B/L Tracking 정보가 없습니다");
                    isBoolean = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg2("B/L Tracking 정보가 없습니다"); 
                    isBoolean = false;
                }                
            }, error: function (xhr, status, error) {
                _fnAlertMsg2("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return isBoolean;
    }
    catch (err) {
        console.log("[Error - isLayerChkBL()]" + err.message);
    }

}

//화물추적 데이터 - Detail 부분만 데이터 가져오기
function fnGetLayerTrackingDetail(vHBL, vCntr, vREQ_SVC, vEX_IM_TYPE) {
    try {

        var rtnJson;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vHBL;
        objJsonData.CNTR_NO = vCntr;
        objJsonData.REQ_SVC = vREQ_SVC;
        objJsonData.EX_IM_TYPE = vEX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Home/GetTrackingDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //데이터 그려주기
                    fnMakeLayerTrackingData(result);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg2("Tracking 정보가 없습니다");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    $(".delivery_status").hide();
                    console.log("[Error : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg2("[Error]관리자에게 문의 해 주세요.");
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg2("담당자에게 문의 하세요.");
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
        console.log("[Error - fnGetTracking()]" + err.message);
    }
}


//점 찍는거라는데 뭘까
function connectTheDots(data) {
    var c = [];
    for (i in data._layers) {
        var x = data._layers[i]._latlng.lat;
        var y = data._layers[i]._latlng.lng;
        c.push([x, y]);
    }
    return c;
}

//로그인 함수
function _fnLogin() {
    try {
        //로그인 체크
        if ($("#Login_ID").val() == "") {
            $("#Password_Warning").hide();
            $("#Email_Warning").show();
            $("#Login_ID").focus();
            return false;
        }
        else {
            $("#Email_Warning").hide();
        }
        if ($("#Login_Password").val() == "") {
            $("#Email_Warning").hide();
            $("#Password_Warning").show();
            $("#Login_Password").focus();
            return false;
        }
        else {
            $("#Password_Warning").hide();
        }

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#Login_ID").val();
        objJsonData.PSWD = $("#Login_Password").val();

        $.ajax({
            type: "POST",
            url: "/Home/fnLogin",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    if (JSON.parse(result).Table[0].APV_YN == "Y") {
                        //아이디 저장 체크 일 경우 쿠키에 저장
                        if ($('input[name=login_keep]')[0].checked) {
                            _fnSetCookie("Prime_CK_USR_ID_REMEMBER_SREX", JSON.parse(result).Table[0].USR_ID, "168");
                        } else {
                            _fnDelCookie("Prime_CK_USR_ID_REMEMBER_SREX");
                        }

                        var vUserType = JSON.parse(result).Table; 

                        $.ajax({
                            type: "POST",
                            url: "/Home/SaveLogin",
                            async: true,
                            data: { "vJsonData": _fnMakeJson(JSON.parse(result)) },
                            success: function (result, status, xhr) {

                                if (_fnToNull(result) == "Y") {
                                    if (_initPage.split(';')[0] == "goSEABooking") {
                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_SEA");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("POL_CD", $("#input_SEA_POL").val());
                                        sessionStorage.setItem("POD_CD", $("#input_SEA_POD").val());
                                        sessionStorage.setItem("POL_NM", $("#input_SEA_Departure").val());
                                        sessionStorage.setItem("POD_NM", $("#input_SEA_Arrival").val());
                                        sessionStorage.setItem("ETD", $("#input_SEA_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", $("#select_SEA_CntrType").find("option:selected").val());
                                        sessionStorage.setItem("LINE_TYPE", 'SEA');

                                        //여기서 유저 타입이 P면 B/L로 보내기                                         
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            controllerToLink("BL", "Document", objJsonData);
                                        } else {
                                            controllerToLink("Regist", "Booking", objJsonData);
                                        }
                                    } else if (_initPage.split(';')[0] == "goAIRBooking") {
                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_AIR");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("POL_CD", $("#input_AIR_POL").val());
                                        sessionStorage.setItem("POD_CD", $("#input_AIR_POD").val());
                                        sessionStorage.setItem("POL_NM", $("#input_AIR_Departure").val());
                                        sessionStorage.setItem("POD_NM", $("#input_AIR_Arrival").val());
                                        sessionStorage.setItem("ETD", $("#input_AIR_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", 'L');
                                        sessionStorage.setItem("LINE_TYPE", 'AIR');

                                        //여기서 유저 타입이 P면 B/L로 보내기                                         
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            controllerToLink("BL", "Document", objJsonData);
                                        } else {
                                            controllerToLink("Regist", "Booking", objJsonData);
                                        }
                                    } else {
                                        //여기서 유저 타입이 P면 메인으로 보내기
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            //문서 관리 - B/L 조회 , 청구서 관리 일때는 바로 보내주기
                                            if (_initPage == "/Document/BL") {
                                                window.location = window.location.origin + _initPage;
                                            } else {
                                                window.location = window.location.origin
                                            }
                                        } else {
                                            window.location = window.location.origin + _initPage;
                                        }
                                    }
                                }
                                else if (_fnToNull(result) == "N") {
                                    console.log("[Fail : fnLogin()]");
                                    _fnLayerAlertMsg("관리자에게 문의 하세요");
                                }
                                else {
                                    console.log("[Error : fnLogin()]" + _fnToNull(result));
                                    _fnLayerAlertMsg("관리자에게 문의 하세요");
                                }

                                //if (_fnToNull(JSON.parse(result).Table[0].APP_KEY) != "") {
                                //    //window.location = urlpath + "/Schedule/SchList";
                                //    window.location = window.location.origin + _initPage;
                                //} else {
                                //    if (_fnToNull(sessionStorage.getItem('finalUrl')) == '') {
                                //        //window.location = vLocation_Login;
                                //        window.location = window.location.origin + _initPage;
                                //    } else {
                                //        location.replace(sessionStorage.getItem('finalUrl'));
                                //    }
                                //}
                            }
                        });
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "N") {
                        _fnLayerAlertMsg("승인이 되지 않았습니다. 담당자에게 문의 하세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "D") {
                        _fnLayerAlertMsg("가입 승인이 거절 되었습니다. 메일에서 거절 사유를 확인 해 주세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "S") {
                        _fnLayerAlertMsg("아이디가 정지 되었습니다. 담당자에게 문의 하세요.");
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnLayerAlertMsg("아이디 혹은 비밀번호가 틀렸습니다");
                    //_fnAlertMsg("아이디 혹은 비밀번호가 틀렸습니다");
                    if (Login_Count >= 0) {
                        Login_Count++;  //로그인 횟수 체크
                    }
                }

                //5번 로그인 틀렸을 시 보안문자 생성
                if (Login_Count > 5 || Login_Count == -1) {
                    Login_Count = -3;
                    $(".security_char").show(); //로그인 버튼 비활성화
                    var vHTML = "";
                    vHTML += "<div id=\"mc\">";
                    vHTML += "<canvas id=\"mc-canvas\"  width=\"220\" height=\"200\"  class=\"mc-valid\"></canvas>";
                    vHTML += "</div> ";

                    $("#Captcha_Area").empty();
                    $("#Captcha_Area").append(vHTML);

                    //mc-form => Captcha_Area
                    $('#Captcha_Area').motionCaptcha({
                        action: '#fairly-unique-id',
                        shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail']
                    });                    
                }
            }, error: function (xhr) {
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }, beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바 

            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바 
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
    ////로그아웃 (세션 , 쿠키 삭제)
    $.ajax({
        type: "POST",
        url: "/Home/LogOut",
        async: false,
        success: function (result, status, xhr) {

            $("#Session_USR_ID ").val("");
            $("#Session_LOC_NM ").val("");
            $("#Session_EMAIL").val("");
            $("#Session_CUST_CD").val("");
            $("#Session_HP_NO").val("");
            $("#Session_DOMAIN").val("");
            $("#Session_OFFICE_CD").val("");
            $("#Session_AUTH_KEY").val("");
            $("#Session_USR_TYPE").val("");

            location.href = window.location.origin;
        }
    });
}

/////////////////function MakeList/////////////////////
//레이어 화물 추적 마일스톤 데이터 그리기
function fnMakeLayerTrackingData(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            //스케줄 데이터 만들기
            var vResult = JSON.parse(vJsonData).DTL;

            $("#Layer_MileStronArea").empty();

            $.each(vResult, function (i) {

                if (_fnToNull(vResult[i].EVENT_STATUS) == "N") {
                    vHTML += "		<li class='on'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding02.png' /></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                } else if (_fnToNull(vResult[i].EVENT_STATUS) == "E") {
                    vHTML += "		<li class='on'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding02.png' /></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                } else {
                    vHTML += "		<li class='on now' id='now_track'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding_blue02.png' class='blinkcss'/></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                }

            });

            $("#Layer_MileStronArea").append(vHTML);
            if ($('#Layer_MileStronArea .step').text().length > 10) {
                $('#Layer_MileStronArea .step').addClass("long_name");
            }
            if (document.getElementById("now_track")) {
                var location = document.querySelector("#now_track").offsetLeft;
                $(".layer_delivery_mo").scrollLeft(location);
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

            $(".layer_delivery_mo").empty();
            $(".layer_delivery_mo").hide();

            console.log("[Fail - fnMakeLayerTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg2("관리자에게 문의 하세요.");
            console.log("[Error - fnMakeLayerTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerTrackingData]" + err.message);
    }
}

//레이어 화물 추적 데이터 리스트
function fnMakeLayerTrackingList(vJsonData) {

    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vJsonData).Main;

            $.each(vResult, function (i) {

                if (i == 0) {
                    vHTML += "   <tr class=\"row pc_layer_trk_list\" data-row=\"row_1\" style=\"background-color:#f5f5f5\"> ";
                } else {
                    vHTML += "   <tr class=\"row\ pc_layer_trk_list\" data-row=\"row_1\"> ";
                }

                vHTML += "            <td>" + _fnToNull(vResult[i].HBL_NO) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].CNTR_NO) + "</td>	";
                vHTML += "            <td style=\"display:none\">" + _fnToNull(vResult[i].REQ_SVC) + "</td>	";
                vHTML += "            <td style=\"display:none\">" + _fnToNull(vResult[i].EX_IM_TYPE) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].MBL_NO) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</td>	";
                vHTML += "            <td>	";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "            </td>	";
                vHTML += "            <td class='mobile_layout' colspan='6'>	";

                if (i == 0) {
                    vHTML += "                <div class='layout_type5 mo_layer_trk_list' style=\"background-color:#f5f5f5\">	";
                } else {
                    vHTML += "                <div class='layout_type5 mo_layer_trk_list'>	";
                }

                vHTML += "                    <div class='row s1'>	";
                vHTML += "                        <div class='col w1'>House B/L :</div>	";
                vHTML += "                        <div class='col'>" + _fnToNull(vResult[i].HBL_NO) + "</div>	";
                vHTML += "                    </div>	";
                vHTML += "                    <div class='row s2'>	";
                vHTML += "                        <table>	";
                vHTML += "                            <tbody>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Container No :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].CNTR_NO) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Master No :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].MBL_NO) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Status :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Location :</th>	";
                vHTML += "                                    <td>	";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "                                    </td>	";
                vHTML += "                                </tr>	";
                vHTML += "                            </tbody>	";
                vHTML += "                        </table>	";
                vHTML += "                    </div>	";
                //vHTML += "                    <button type='button' class='btn_type1'>상세</button>	";
                vHTML += "                </div>	";
                vHTML += "            </td>	";
                vHTML += "        </tr>	";
            });

            $(".layer_delivery_mo").show();
            $("#layer_tracking_List").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg2("Tracking 정보가 없습니다.");
        }

        $("#layer_delivery_list")[0].innerHTML = vHTML;

        if (vResult.length > 6) {
            $('.layer_tracking_scrollbar').slimScroll({
                height: '215px'
            });
        }
    }
    catch (err) {
        console.log("[Error - fnMakeTrackingList]" + err.message);
    }
}
////////////////////////API////////////////////////////
