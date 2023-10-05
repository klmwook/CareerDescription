////////////////////전역 변수//////////////////////////
//var Login_Count = 1;
//var _initPage = "/ReceiptPutAway";
////////////////////jquery event///////////////////////
$(function () {

    //alert("hi");

    if (_fnToNull($("#Session_USR_ID").val()) != "") {
        window.location = window.location.origin + "/T_ReceiptPutAway";
    } else {
        var vUSR_ID = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_DHL1");
        var vDOMAIN = _fnGetCookie("Prime_CK_USR_DOMAIN_REMEMBER_DHL1");

        if (_fnToNull(vUSR_ID) != "") {
            $("#USR_ID").val(vUSR_ID);
            $("#login_keep").attr("checked", true);
        }

        if (_fnToNull(vDOMAIN) != "") {
            $("#Domain").val(vDOMAIN);
        }
    }
});

//Input 도메인 엔터키 이벤트
$(document).on("keyup", "#Domain", function (e) {
    if (e.keyCode == 13) {
        if ($("#Domain").val() == "") {
            $("#Domain_Warning").show();
            $("#ID_Warning").hide();
            $("#Password_Warning").hide();
            $("#Domain").focus();
        }
        else {
            $("#Domain_Warning").hide();
            $("#USR_ID").focus();
        }
    }
    else {
        if ($("#Domain").val().length > 0) {
            $("#Domain_Warning").hide();
        }
    }
    
});

//Input 이메일 엔터키 이벤트
$(document).on("keyup", "#USR_ID", function (e) {
    if (e.keyCode == 13) {
        if ($("#USR_ID").val() == "") {
            $("#Domain_Warning").hide();
            $("#ID_Warning").show();
            $("#Password_Warning").hide();
            $("#USR_ID").focus();
        } else {
            $("#ID_Warning").hide();
            $("#Password").focus();
        }
    } else {
        if ($("#USR_ID").val().length > 0) {
            $("#ID_Warning").hide();
        }
    }
});

//Input 패스워드 엔터키 이벤트
$(document).on("keyup", "#Password", function (e) {
    if (e.keyCode == 13) {
        if ($("#Password").val() == "") {
            $("#Domain_Warning").hide();
            $("#ID_Warning").hide();
            $("#Password_Warning").show();
            $("#Password").focus();
        } else {
            $("#Password_Warning").hide();
            $("#Login_btn").blur();
            $("#Login_btn").click();
        }
    } else {
        if ($("#Password").val().length > 0) {
            $("#Password_Warning").hide();
        }
    }
});

//로그인 버튼 이벤트
$(document).on("click", "#Login_btn", function () {    
    fnLogin();    
});

////////////////////////function///////////////////////
///로그인 함수
function fnLogin() {
    try {

        //밸리데이션 체크
        if ($("#Domain").val() == "") {
            $("#Domain_Warning").show();
            $("#ID_Warning").hide();
            $("#Password_Warning").hide();
            $("#Domain").focus();
            return false;
        }
        else {
            $("#Domain_Warning").hide();
        }
        
        if ($("#USR_ID").val() == "") {
            $("#Password_Warning").hide();
            $("#ID_Warning").show();
            $("#USR_ID").focus();
            return false;
        }
        else {
            $("#ID_Warning").hide();
        }
        if ($("#Password").val() == "") {
            $("#ID_Warning").hide();
            $("#Password_Warning").show();
            $("#Password").focus();
            return false;
        }
        else {
            $("#Password_Warning").hide();
        }

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#USR_ID").val();
        objJsonData.PSWD = $("#Password").val();

        //도메인 세팅
        if (_fnToNull($("#Domain").val().replace(/ /gi, "")) == _TODS_Domain) {
            objJsonData.DB_TYPE = "TODS";
            objJsonData.DOMAIN = _TODS_Domain;
        } else {
            _fnAlertMsg("도메인을 잘 못 입력 하셨습니다.");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/Main/fnLogin",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {               

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                                        
                    if ($("#login_keep").is(":checked")) {
                        _fnSetCookie("Prime_CK_USR_ID_REMEMBER_DHL1", objJsonData.USR_ID, "168");
                        _fnSetCookie("Prime_CK_USR_DOMAIN_REMEMBER_DHL1", objJsonData.DOMAIN, "168");
                    }
                    else {
                        _fnDelCookie("Prime_CK_USR_ID_REMEMBER_DHL1");
                        _fnDelCookie("Prime_CK_USR_DOMAIN_REMEMBER_DHL1");
                    }

                    $.ajax({
                        type: "POST",
                        url: "/Main/SaveLogin",
                        async: true,
                        data: { "vJsonData": _fnMakeJson(JSON.parse(result)) },
                        success: function (result, status, xhr) {

                            if (_fnToNull(result) == "Y") {
                                window.location = window.location.origin + "/T_ReceiptPutAway";
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