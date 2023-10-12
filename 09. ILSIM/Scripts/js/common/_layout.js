////////////////////전역 변수//////////////////////////
var _isConfirm;
var mymap;
var _initPage = "";
var Login_Count = 0;
////////////////////jquery event///////////////////////
$(function () {           

    //로그인 아이디 저장 체크가 되어있을 시 데이터 넣는 로직
    var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_ISLS");
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
        $("#P_HBL_NO").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
        getTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnLayerAlertMsg("검색할 번호를 입력해주세요");
    }
});

//PC - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Pc_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Pc_Input_Tracking").val()) != "") {
            $("#P_HBL_NO").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
            getTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnLayerAlertMsg("검색할 번호를 입력해주세요");
        }
    }
});

//모바일 - 화물추적 버튼 이벤트
$(document).on("click", "#Mo_btn_Tracking", function () {
    if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
        $("#P_HBL_NO").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
        getTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnLayerAlertMsg("검색할 번호를 입력해주세요");
    }
});

//모바일 - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Mo_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
            $("#P_HBL_NO").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
            getTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnLayerAlertMsg("검색할 번호를 입력해주세요");
        }
    }
});

//레이어 팝업 내에서 검색
$(document).on("click", "#btnSearchTracking", function () {
    getTracking($("#P_HBL_NO").val().toUpperCase().trim(), $("#P_CNTR_NO").val().toUpperCase().trim());
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

////////////////////////function///////////////////////
function getTracking(vHBL,vCntrNo) {
    try {

        layerPopup2("#tracking_layer");
        var rtnJson;
        var objJsonData = new Object();
        var vBool = false;
        
        objJsonData.BL_NO = _fnToNull(vHBL);
        objJsonData.CNTR_NO = _fnToNull(vCntrNo);
        
        $.ajax({
            type: "POST",
            url: "/Home/GetTrackingList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
        
                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //데이터 그려주기
                    vBool = true;
                    fnMakeTrackingList(result);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    $(".delivery_status").hide();
                    //_fnAlertMsg("엑셀 업로드 실패하였습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    $(".delivery_status").hide();
                    console.log("[Error : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요.");
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });

        var objRPAJsonData = new Object();

        objRPAJsonData.reqVal1 = _fnToNull(vHBL);
        objRPAJsonData.reqVal2 = _fnToNull(vCntrNo);

        var strurl = "http://api2.elvisprime.com/api/Trk/GetTrackingAIS";
        //var AppKey = _RPA_MngtNo + "^" + _RPA_Key;
        var AppKey = "20210322151646087070" + "^" + "uBW7FGEIHScRz84cCp4jEVyAqjMCEgeS+qpK5Prxq/mgc6owaTyAv89b3O5KlXlq";
        $.ajax({
            url: strurl,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization-Token', AppKey);
            },
            type: "POST",
            async: false,
            dataType: "json",
            data: { "": _fnMakeJson(objRPAJsonData) },
            success: function (result) {
                if (_fnToNull(result) != "") {
                    var rtnData = JSON.parse(result);
                    if (_fnToNull(rtnData.Result) != "") {
                        if (rtnData.Result[0].trxCode == "N" || rtnData.Result[0].trxCode == "E") {
                            if (vBool) {
                                //빈값
                                drawingLayerNodata();
                            } else {
                                layerClose('#tracking_layer');
                                _fnAlertMsg("추적이 되지않는 데이터입니다.");
                            }
                            return false;
                        }
                    } else {
                        drawingLayer(rtnData);
                        //데이터 그려주기
                        $("#P_HBL_NO").val(vHBL);
                        $("#P_CNTR_NO").val(vCntrNo);
                    }

                } else {
                    if (vBool) {
                        drawingLayerNodata();
                    } else {
                        layerClose("#tracking_layer");
                        _fnAlertMsg("추적이 되지않는 데이터입니다.");
                    }
                }
                //createMap()
            }, error: function (xhr) {
                layerClose("#tracking_layer");
                _fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }
        });

    } catch (e) {
        console.log(e.message);
    }

    //데이터와 상관없이 그려주기
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
                            _fnSetCookie("Prime_CK_USR_ID_REMEMBER_ISLS", JSON.parse(result).Table[0].USR_ID, "168");
                        } else {
                            _fnDelCookie("Prime_CK_USR_ID_REMEMBER_ISLS");
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
                                    } else if (_initPage.split(';')[0] == "goFERRYBooking") {
                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_FERRY");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("POL_CD", $("#input_FERRY_POL").val());
                                        sessionStorage.setItem("POD_CD", $("#input_FERRY_POD").val());
                                        sessionStorage.setItem("POL_NM", $("#input_FERRY_Departure").val());
                                        sessionStorage.setItem("POD_NM", $("#input_FERRY_Arrival").val());
                                        sessionStorage.setItem("ETD", $("#input_FERRY_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", $("#select_FERRY_CntrType").find("option:selected").val());
                                        sessionStorage.setItem("LINE_TYPE", 'FERRY');

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
                                            //문서 관리 - B/L 조회 일때는 바로 보내주기
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
//트레킹 리스트 데이터 그리기
function fnMakeTrackingList(vJsonData) {

    var vHTML = "";
    var vResult = "";

    if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

        vResult = JSON.parse(vJsonData).TrackingList;        

        if (_fnToNull(vResult) != "") {
            $("#trackAppend").empty();
            $("#L_MBL_NO").empty();
            $("#L_HBL_NO").empty();
            $("#L_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));
            if (_fnToNull(vResult[0].COLD_TYPE) != "N") {
                $("#L_MBL_NO").append(_fnToNull(vResult[0].LINE_BKG_NO));
            } else {
                $("#L_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
            }

            $(vResult).each(function (i) {

                if (_fnToNull(vResult[i].ACT_EVT_CD) == "Y") {
                    vHTML += "	<li class='now'>	";
                    vHTML += "        <div class='inner'>	";
                    vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                    vHTML += "            <div class='cont'>	";
                    vHTML += "                <div class='info_box'>	";
                    vHTML += "                    <div class='col'>	";
                    if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
                        vHTML += _fnToNull(vResult[i].ACT_LOC_CD);
                    } else {
                        vHTML += _fnToNull(vResult[i].EST_LOC_CD);
                    }
                    vHTML += "                    </div>	";
                    vHTML += "                    <div class='col right'>	";
                    vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                    vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                    vHTML += "                    </div>	";
                    vHTML += "                </div>	";
                    vHTML += "            </div>	";
                    vHTML += "        </div>	";
                    vHTML += "    </li>	";
                } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "E") {
                    vHTML += "	<li class='complete'>	";
                    vHTML += "        <div class='inner'>	";
                    vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                    vHTML += "            <div class='cont'>	";
                    vHTML += "                <div class='info_box'>	";
                    vHTML += "                    <div class='col'>	";
                    if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
                        vHTML += _fnToNull(vResult[i].ACT_LOC_CD);
                    } else {
                        vHTML += _fnToNull(vResult[i].EST_LOC_CD);
                    }
                    vHTML += "                    </div>	";
                    vHTML += "                    <div class='col right'>	";
                    vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                    vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                    vHTML += "                    </div>	";
                    vHTML += "                </div>	";
                    vHTML += "            </div>	";
                    vHTML += "        </div>	";
                    vHTML += "    </li>	";
                } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "N") {
                    vHTML += "	<li>	";
                    vHTML += "        <div class='inner'>	";
                    vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                    vHTML += "            <div class='cont'>	";
                    vHTML += "                <div class='info_box'>	";
                    vHTML += "                    <div class='col'>	";
                    if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
                        vHTML += _fnToNull(vResult[i].ACT_LOC_CD);
                    } else {
                        vHTML += _fnToNull(vResult[i].EST_LOC_CD);
                    }
                    vHTML += "                    </div>	";
                    vHTML += "                    <div class='col right'>	";
                    vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                    vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                    vHTML += "                    </div>	";
                    vHTML += "                </div>	";
                    vHTML += "            </div>	";
                    vHTML += "        </div>	";
                    vHTML += "    </li>	";
                }
            });
            $("#trackAppend").append(vHTML);
            $(".delivery_status").show();
        } else {
            $(".delivery_status").hide();
        }
    }
}

////////////////////////API////////////////////////////

//화물 추적 AIS - 데이터가 없을 경우.
function drawingLayerNodata() {

    if (_fnToNull(mymap) != "") {
        mymap.remove();
    }
    mymap = L.map('map', {
        //center: [lat, lng],
        center: [32.896531, 124.402956],
        zoom: 5,
        zoomControl: false
    });

    L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=kr&x={x}&y={y}&z={z}', {
        attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
    }).addTo(mymap);
}

//화물 추적 AIS 그림 그려주기
function drawingLayer(json_data) {
    var spiral = {
        type: "FeatureCollection",
        features: []
    };
    var master = json_data.Master[0];//헤더 테이블 조회
    var result = [];
    for (var i in master)
        result.push([master[i]]);

    var POD = result[4].concat(result[5]);
    var POL = result[8].concat(result[9]);
    var lastRoute;
    var rotate;
    var detail = json_data.Detail;//디테일 테이블 조회

    //예외처리 - Port 정보가 마스터 데이터에 없을 경우 
    if (_fnToNull(POD[0]) == "" || _fnToNull(POD[1]) == "" || _fnToNull(POL[0]) == "" || _fnToNull(POL[1]) == "")
    {
        drawingLayerNodata();
        return false;
    }

    var result2 = [];

    for (var i = 0; i < detail.length; i++) {
        var arrayDt = [];
        arrayDt.push(detail[i]["MAP_LAT"]);
        arrayDt.push(detail[i]["MAP_LNG"]);
        lastRoute = arrayDt;    // 배 아이콘 위치
        rotate = detail[i]["MAP_COURSE"]; // 배 방향
        result2.push(arrayDt);
        var g = {
            "color" : "red",
            "type": "Point",
            "coordinates": [detail[i]["MAP_LNG"], detail[i]["MAP_LAT"]]
        };
        var p = {
            "id": i,
            "speed": detail[i]["MAP_SPEED"],
            "course": detail[i]["MAP_COURSE"]
        };
        spiral.features.push({
            "geometry": g,
            "type": "Feature",
            "properties": p
        });
    }
    var zoom = 5; //줌 레벨

    if (_fnToNull(mymap) != "") {
        mymap.remove();
    }

    mymap = L.map('map', {
        //center: [lat, lng],
        center: [32.896531, 124.402956],
        zoom: zoom,
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(mymap);

    /*
    lyrs=m : Standard Road Map
    lyrs=p : Terrain
    lyrs=r : Somehow Altered Road Map
    lyrs=s : Satellite Only
    lyrs=t : Terrain Only
    lyrs=y : Hybrid
    lyrs=h : Roads Only
    */
    L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=kr&x={x}&y={y}&z={z}', {
        attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
    }).addTo(mymap);
    // Creating a poly line


    //화물추적 dot(점) 색상 변경 (이미지로 색상 변경 해야됨)
    var circleIcon = L.icon({
        iconUrl: "../Images/circle_red.png",
        iconSize: [4, 4]  // size of the icon
    });

    var polyline = L.geoJson(spiral, {         
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: circleIcon
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<table><tbody><tr><td><div><b>speed:</b></div></td><td><div>' + feature.properties.speed + '</div></td></tr><tr><td><div><b>course:</b></div></td><td><div>' + feature.properties.course + '</div></td></tr></tbody></table>');
            layer.on('mouseover', function () { layer.openPopup(); });
            layer.on('mouseout', function () { layer.closePopup(); });
        }
    });

    //spiralBounds = polyline.getBounds();
    //mymap.fitBounds(spiralBounds);
    polyline.addTo(mymap);

    spiralCoords = connectTheDots(polyline);
    var spiralLine = L.polyline(spiralCoords, { color: '#ff2600' }).addTo(mymap); //color 변경 
    //var spiralLine = L.polyline(spiralCoords).addTo(mymap)

    var shipIconBig = L.icon({
        iconUrl: "../Images/map_ship@73x87.png",
        iconSize: [24, 30]  // size of the icon
    });

    var shipIcon = L.icon({
        iconUrl: "../Images/map_ship@73x87.png",
        iconSize: [30, 42]
    });

    var makerIcon = L.icon({
        iconUrl: '../Images/map_marker@64x79.png',
        iconSize: [30, 42]
    });
    var portIcon = L.icon({
        iconUrl: '../Images/map_port@69x79.png',
        iconSize: [30, 42]
    });

    var makerIconBig = L.icon({
        iconUrl: '../Images/map_marker@64x79.png',
        iconSize: [24, 30]
    });
    var portIconBig = L.icon({
        iconUrl: '../Images/map_port@69x79.png',
        iconSize: [24, 30] // size of the icon
    });


    var maker_POD = L.marker(POD, { icon: makerIconBig }).addTo(mymap);
    var maker_POL = L.marker(POL, { icon: portIconBig }).addTo(mymap);
    var LastMarker = L.marker(lastRoute, { icon: shipIcon, rotationOrigin: 'center center', rotationAngle: rotate }).addTo(mymap);


    mymap.on('zoomend', function () {
        var currentZoom = mymap.getZoom();
        if (currentZoom <= 5) {
            maker_POD.setIcon(makerIconBig);
            maker_POL.setIcon(portIconBig);
            LastMarker.setIcon(shipIconBig);
        }
        else {
            maker_POD.setIcon(makerIcon);
            maker_POL.setIcon(portIcon);
            LastMarker.setIcon(shipIcon);
        }
    });
}
