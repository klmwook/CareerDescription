////////////////////전역 변수//////////////////////////
var _initPage = "";
var magnificPopup = $.magnificPopup;
////////////////////jquery event///////////////////////
$(function () {
    //메뉴 a Tag에 href 데이터가 없으면 on / active가 되어서 넣어둔 로직
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        $(".nav-list__item").find(".link").removeClass("on");
        $("._down").find(".link").removeClass("active");
        $(".nav-list--depth2").hide();
    }
});

//자동완성 브라우저 변경 시 보이지 않게
$(window).resize(function () {
    $(".ui-menu").hide();
});

$(document).on('click', '.mfp-close', function () {
    magnificPopup.close();
});

//로그인 버튼 클릭 이벤트
$(document).on("click", "#Login_btn", function () {    
    _fnLogin();
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_ID", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Login_Password").val()) != "") {
            _fnLogin();
        } else {
            $("#Login_Password").focus();
        }
    }
});

$(document).on("focus", "#Login_ID", function (e) {
    $("#Password_Warning").hide();
});

$(document).on("focus", "#Login_Password", function (e) {
    $("#ID_Warning").hide();
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_Password", function (e) {
    if (e.keyCode == 13) {
        _fnLogin();
    }
});

//로그인 레이어 팝업 보여주기
function fnShowLoginLayer(vValue) {

    if (vValue == "init") {
        _initPage = "";
    } 
    else {
        _initPage = vValue;
    }

    magnificPopup.open({
        items: {
            src: '/Popup/login'
        },
        type: 'ajax',
        closeOnBgClick: false
    }, 0);

    //$.magnificPopup.close();
}


////////////////////////function///////////////////////
//port 정보 가져오는 함수
function _fnGetPortData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.LOC_TYPE = "S";
        objJsonData.LOC_CD = vValue;

        $.ajax({
            type: "POST",
            url: "/Common/fnGetPort",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                rtnJson = result;
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return rtnJson;
    } catch (e) {
        console.log(e.message);
    }
}


//엘비스 공통 코드 - Service 타입 가져오기
function fnSetServiceType(vSelectID, vREQ_SVC, vPAGE) {
    try {
        var objJsonData = new Object();

        objJsonData.REQ_SVC = vREQ_SVC;

        $.ajax({
            type: "POST",
            url: "/Common/fnGetServiceType",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeServiceType(vSelectID, vPAGE, result);
            }, error: function (xhr, status, error) {
                alert("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSetServiceType]" + err.message);
    }
}

//로그인 함수
function _fnLogin() {
    try {
        //로그인 체크
        if ($("#Login_ID").val() == "") {
            $("#Password_Warning").hide();
            $("#ID_Warning").show();
            $("#Login_ID").focus();
            return false;
        }
        else {
            $("#ID_Warning").hide();
        }
        if ($("#Login_Password").val() == "") {
            $("#ID_Warning").hide();
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
                        if ($('#login_keep')[0].checked) {
                            _fnSetCookie("Prime_CK_USR_ID_REMEMBER_MOAX", JSON.parse(result).Table[0].USR_ID, "168");
                        } else {
                            _fnDelCookie("Prime_CK_USR_ID_REMEMBER_MOAX");
                        }

                        $.ajax({
                            type: "POST",
                            url: "/Home/SaveLogin",
                            async: true,
                            data: { "vJsonData": _fnMakeJson(JSON.parse(result)) },
                            success: function (result, status, xhr) {

                                if (_fnToNull(result) == "Y") {                                   
                                    if (_initPage.split(';')[0] == "goBooking") {

                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "SCHEDULE_SEA");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("BOUND", $("#Select_Bound").find("option:selected").val());

                                        if ($("#Select_Bound").find("option:selected").val() == "E") {
                                            sessionStorage.setItem("POL_NM", $("#input_POL").text());
                                            sessionStorage.setItem("POL_CD", $("#input_POLCD").val());
                                            sessionStorage.setItem("POD_NM", $("#input_auto_POD").val());
                                            sessionStorage.setItem("POD_CD", $("#input_auto_PODCD").val());
                                        }
                                        else if ($("#Select_Bound").find("option:selected").val() == "I") {
                                            sessionStorage.setItem("POL_NM", $("#input_auto_POL").val());
                                            sessionStorage.setItem("POL_CD", $("#input_auto_POLCD").val());
                                            sessionStorage.setItem("POD_NM", $("#input_POD").text());
                                            sessionStorage.setItem("POD_CD", $("#input_PODCD").val());
                                        }

                                        sessionStorage.setItem("ETD", $("#input_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", $("#select_CntrType").find("option:selected").val());

                                        controllerToLink("Regist", "MOLAX", objJsonData);
                                    } else {
                                        window.location = window.location.origin + _initPage;
                                    }
                                }
                                else if (_fnToNull(result) == "N") {
                                    console.log("[Fail : fnLogin()]");
                                    alert("관리자에게 문의 하세요");
                                }
                                else {
                                    console.log("[Error : fnLogin()]" + _fnToNull(result));
                                    alert("관리자에게 문의 하세요");
                                }
                            }
                        });
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "N") {
                        alert("승인이 되지 않았습니다. 담당자에게 문의 하세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "D") {
                        alert("가입 승인이 거절 되었습니다. 메일에서 거절 사유를 확인 해 주세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "S") {
                        alert("아이디가 정지 되었습니다. 담당자에게 문의 하세요.");
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("아이디 혹은 비밀번호가 틀렸습니다");                    
                }                
            }, error: function (xhr) {
                $("#loading-image").hide();
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }, beforeSend: function () {
                $("#loading-image").show(); //프로그래스 바

            },
            complete: function () {
                $("#loading-image").hide(); //프로그래스 바
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
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
//엘비스 공통 코드 - Service 타입 그려주기
function fnMakeServiceType(vSelectID, vPAGE, vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Service;

            if (vPAGE == "SCH") {
                vHTML += "<option value=\"\">Service</option>";
            }

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + vResult[i].CODE + "\">" + vResult[i].NAME + "</option>";
            });

            $(vSelectID)[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeServiceType]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Fail - fnMakeServiceType]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeServiceType]" + err.message);
    }
}
////////////////////////API////////////////////////////
