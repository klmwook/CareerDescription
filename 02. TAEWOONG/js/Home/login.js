////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {
    if (_fnToNull($("#Session_USR_ID").val()) != "") {
        window.location = window.location.origin + "/Home/Login";
    } else {
        var vUSR_ID = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_TWSC");
        var vPW = _fnGetCookie("Prime_CK_USR_PW_REMEMBER_TWSC");

        if (_fnToNull(vUSR_ID) != "") {
            $("#Input_ID").val(vUSR_ID);
            $("#login_keep").attr("checked", true);
        }

        if (_fnToNull(vPW) != "") {
            $("#Input_Password").val(vPW);
        }

    }
});

//Input_ID 엔터키 이벤트
$(document).on("keyup", "#Input_ID", function (e) {
    if (e.keyCode == 13) {
        if ($("#Input_ID").val() == "") {
            $("#ID_Warning").show();
            $("#Input_ID").focus();
        }
        else {
            $("#ID_Warning").hide();
            $("#Input_Password").focus();
        }
    }
    else {
        if ($("#Input_ID").val().length > 0) {
            $("#ID_Warning").hide();
        }
    }
});

//Input_ID 엔터키 이벤트
$(document).on("keyup", "#Input_Password", function (e) {
    if (e.keyCode == 13) {
        if ($("#Input_Password").val() == "") {
            $("#Password_Warning").show();
            $("#Input_Password").focus();
        }
        else {
            $("#Password_Warning").hide();
            $("#btn_login").click();
        }
    }
    else {
        if ($("#Input_Password").val().length > 0) {
            $("#Password_Warning").hide();
        }
    }
});

//로그인 버튼 이벤트
$(document).on("click", "#btn_login", function () {
    fnLogin();
});

////////////////////////function///////////////////////
///로그인 함수
function fnLogin() {
    try {

        if ($("#Input_ID").val() == "") {
            $("#Password_Warning").hide();
            $("#ID_Warning").show();
            $("#Input_ID").focus();
            return false;
        }
        else {
            $("#ID_Warning").hide();
        }
        if ($("#Input_Password").val() == "") {
            $("#ID_Warning").hide();
            $("#Password_Warning").show();
            $("#Input_Password").focus();
            return false;
        }
        else {
            $("#Password_Warning").hide();
        }

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#Input_ID").val();
        objJsonData.PSWD = $("#Input_Password").val();
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Home/fnLogin",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                
                    if ($("#login_keep").is(":checked")) {
                        _fnSetCookie("Prime_CK_USR_ID_REMEMBER_TWSC", objJsonData.USR_ID, "168");
                        _fnSetCookie("Prime_CK_USR_PW_REMEMBER_TWSC", objJsonData.PSWD, "168");
                    }
                    else {
                        _fnDelCookie("Prime_CK_USR_ID_REMEMBER_TWSC");
                        _fnDelCookie("Prime_CK_USR_PW_REMEMBER_TWSC");
                    }
                
                    $.ajax({
                        type: "POST",
                        url: "/Home/SaveLogin",
                        async: true,
                        data: { "vJsonData": _fnMakeJson(JSON.parse(result)) },
                        success: function (result, status, xhr) {
                    
                            if (_fnToNull(result) == "Y") {
                                window.location = window.location.origin + "/Home/Login";
                            }
                            else if (_fnToNull(result) == "N") {
                                console.log("[Fail : fnLogin()]");
                                _fnAlertMsg("관리자에게 문의 하세요");
                            }
                            else {
                                console.log("[Error : fnLogin()]" + _fnToNull(result));
                                _fnAlertMsg("관리자에게 문의 하세요");
                            }
                        }
                    });
                
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("아이디 혹은 비밀번호가 틀렸습니다");
                }

            }, error: function (xhr) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
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


/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

