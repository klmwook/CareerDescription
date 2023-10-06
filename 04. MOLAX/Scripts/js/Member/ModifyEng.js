////////////////////전역 변수//////////////////////////
var _chkpwd = true;
var objLogin_Info = new Object();

////////////////////jquery event///////////////////////
$(function () {

    //$('.delete-btn').on('click', function () {
    //    $(this).siblings().val('');
    //});

    //User_ID가 없으면 빠이
    if (_fnToNull($("#Session_USR_ID").val()) == "") {        
        location.href = window.location.origin;
    }
    else {
        fnGetUserInfo();
    }
});

//input 박스 포커스 나갈 때 오류 메시지
$(document).on("focusout", "input", function (e) {
    var $this = $(e.target);
    var vValue = "";    

    if ($this.attr('id') == "RES_NOWPWD") {
        vValue = $("#RES_NOWPWD").val();

        if (vValue != "") {
            fnChkNowPSWD();
        }
    }
    else if ($this.attr('id') == "RES_NAME") {
        vValue = $("#RES_NAME").val();

        if (vValue == "") {
            fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
        }
    }
    else if ($this.attr('id') == "RES_TEL") {
        vValue = $("#RES_TEL").val();

        if (vValue == "") {
            fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
        }
    }

    //
    //
    //
    //if ($this.attr('id') == "RES_PWD") {
    //    vValue = $("#RES_PWD").val();
    //
    //    if (vValue == "") {
    //        fnShowWarning("RES_PWD", "PW1_Empty", "#f44336");else if ($this.attr('id') == "RES_PWD2") {
    //    }    vValue = $("#RES_PWD2").val();
    //}
    //    if (vValue == "") {
    //        fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336");
    //    }
    //}
    //else if ($this.attr('id') == "RES_NAME") {
    //    vValue = $("#RES_NAME").val();
    //
    //    if (vValue == "") {
    //        fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
    //    }
    //}
    //else if ($this.attr('id') == "RES_TEL") {
    //    vValue = $("#RES_TEL").val();
    //
    //    if (vValue == "") {
    //        fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
    //    }
    //}
});

//엔터키 이벤트
$(document).on("keydown", "input", function (e) {
    if (e.which == 13) {
        if ($(e.target).attr('data-index').indexOf("Modify") > -1) {
            var vIndex = $(e.target).attr('data-index').replace("Modify", "");
            $('[data-index="Modify' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
        }
    }
});

//input 실시간 - Validation
$(document).on("keyup", "input", function (e) {
    var $this = $(e.target);
    var vValue = "";
    var vCompare = "";

    if ($this.attr('id') == "RES_NOWPWD") {

        vValue = $("#RES_NOWPWD").val();

        //데이터 없을 때
        if (vValue == "") {
            fnShowWarning("RES_NOWPWD", "NOWPWD_Empty", "#f44336");
            fnOnOffWarning("NOWPWD_Wrong", "false");
        } else {
            $("#RES_NOWPWD").css("border-color", "");
            fnOnOffWarning("NOWPWD_Empty", "false");
            fnOnOffWarning("NOWPWD_Wrong", "false");
        }
    }
    else if ($this.attr('id') == "RES_PWD") {

        vValue = $("#RES_PWD").val();
        vCompare = $("#RES_PWD2").val();

        //값이 없을 경우
        if (_fnToNull($("#RES_PWD").val()) == "") {
            $("#RES_PWD").css("border-color", "");
            fnOnOffWarning("PW1_OverSix", "false");
            fnOnOffWarning("PW1_Regular", "false");
            return false;
        }

        var vBoolean_LessSix = "false";
        var vBoolean_Regular = "false";
        var vBoolean_Different = "false";

        if (vValue.length < 6) {
            vBoolean_LessSix = "false";
            fnOnOffWarning("PW1_OverSix", "true");
        } else {
            vBoolean_LessSix = "true";
            fnOnOffWarning("PW1_OverSix", "false");
        }

        //대문자 소문자 체크
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/;
        if (!vCheck.test(vValue)) {
            vBoolean_Regular = "false";
            fnOnOffWarning("PW1_Regular", "true");
        } else {
            vBoolean_Regular = "true";
            fnOnOffWarning("PW1_Regular", "false");
        }
        //비교문 체크
        vBoolean_Different = fnPwCompare(vValue, vCompare);

        //마지막 체크
        if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
            fnWarningBorder("RES_PWD", "#f44336");
            if (vBoolean_Different == "false" && $("#RES_PWD2").val() != "") {
                fnWarningBorder("RES_PWD2", "#f44336");
            }
        } else {
            fnWarningBorder("RES_PWD", "#4caf50");
            //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
            if ($("#RES_PWD2").css("border-top-color") == "rgb(244, 67, 54)") {
                if ($("#PW2_Empty").css("display") != "inline-block" && $("#PW2_Compare").css("display") != "inline-block") {
                    $("#RES_PWD2").css("border-color", "#4caf50");
                }
            }
        }               
    } //RES_PWD end
    //RES_PWD2 start 
    else if ($this.attr('id') == "RES_PWD2") {

        vValue = $("#RES_PWD2").val();
        vCompare = $("#RES_PWD").val();

        //값이 없을 경우
        if (_fnToNull($("#RES_PWD2").val()) == "") {
            $("#RES_PWD2").css("border-color", "");
            fnOnOffWarning("PW2_OverSix", "false");
            fnOnOffWarning("PW2_Regular", "false");
            fnOnOffWarning("PW2_Compare", "false");
            return false;
        }

        var vBoolean_LessSix = "false";
        var vBoolean_Regular = "false";
        var vBoolean_Different = "false";

        fnOnOffWarning("PW2_Empty", "false");

        if (vValue.length < 6) {
            vBoolean_LessSix = "false";
            fnOnOffWarning("PW2_OverSix", "true");
        } else {
            vBoolean_LessSix = "true";
            fnOnOffWarning("PW2_OverSix", "false");
        }

        //대문자 소문자 체크
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/;
        if (!vCheck.test(vValue)) {
            vBoolean_Regular = "false";
            fnOnOffWarning("PW2_Regular", "true");
        } else {
            vBoolean_Regular = "true";
            fnOnOffWarning("PW2_Regular", "false");
        }
        //비교문 체크
        vBoolean_Different = fnPwCompare(vValue, vCompare);

        //마지막 체크
        if (vBoolean_LessSix == "false" || vBoolean_Regular == "false" || vBoolean_Different == "false") {
            fnWarningBorder("RES_PWD2", "#f44336");
            if (vBoolean_Different == "false" && $("#RES_PWD").val() != "") {
                fnWarningBorder("RES_PWD", "#f44336");
            }
        } else {
            fnWarningBorder("RES_PWD2", "#4caf50");
            //만약 비밀번호 확인이 오류면 변경 해주는 로직. (확인이 필요함)
            if ($("#RES_PWD").css("border-top-color") == "rgb(244, 67, 54)") {
                if ($("#PW1_Empty").css("display") != "inline-block") {
                    $("#RES_PWD").css("border-color", "#4caf50");
                }
            }
        }

    } //RES_PWD2 end
    else if ($this.attr('id') == "RES_NAME") {
        vValue = $("#RES_NAME").val();
        //var check = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        if (regExp.test(vValue)) {
            $("#RES_NAME").val(vValue.replace(regExp, ""));
        }
        //데이터 없을 때
        if (vValue == "") {
            fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
            fnOnOffWarning("NAME_OverTwo", "false");
        } else {
            fnShowWarning("RES_NAME", "NAME_Empty", "#4caf50");
        }

        //2개 이상
        if (vValue != "") {
            if (vValue.length < 2) {
                fnShowWarning("RES_NAME", "NAME_OverTwo", "#f44336");
            } else {
                fnShowWarning("RES_NAME", "NAME_OverTwo", "#4caf50");
            }
        }
    }
    //RES_NAME end
    //RES_TEL Strat
    else if ($this.attr('id') == "RES_TEL") {

        vValue = $("#RES_TEL").val().trim();
        var vKorCheck = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
        var vEngCheck = /[a-z | A-Z]/;

        //Phone 하이픈 넣기
        if (vValue != "") {
            $(this).val(_fnMakePhoneForm(vValue));
        }

        //값이 없을 때
        if (vValue == "") {
            fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
            fnOnOffWarning("TEL_NotNumber", "false");
        } else {
            fnShowWarning("RES_TEL", "TEL_Empty", "#4caf50");
        }

        //숫자가 아닐 때
        if (vKorCheck.test(vValue) || vEngCheck.test(vValue)) {
            fnShowWarning("RES_TEL", "TEL_NotNumber", "#f44336");
        } else {
            fnOnOffWarning("TEL_NotNumber", "false");
        }
    }
});

//저장 버튼 이벤트
$(document).on("click", "#Modify_Save", function () {
    fnModifySave();
});

////////////////////////function///////////////////////
function fnGetUserInfo() {
    try {

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            url: "/Member/GetModifyInfo",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnSetUserInfo(result);
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("There is no membership information. Please contact the person in charge.");
                    location.href = window.location.origin;
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("Please contact the person in charge.");
                    location.href = window.location.origin;
                }
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });
    }
    catch (err) {
        alert("Please contact the person in charge.");
        console.log("[Error - fnGetUserInfo()]" + err.message);
    }
}

//회원정보 데이터 값 넣어주기
function fnSetUserInfo(vJsonData) {
    try {
        vResult = JSON.parse(vJsonData).UserInfo;

        objLogin_Info.USR_ID = _fnToNull(vResult[0].USR_ID);
        objLogin_Info.EMAIL = _fnToNull(vResult[0].EMAIL);
        objLogin_Info.CRN = _fnToNull(vResult[0].CRN);
        objLogin_Info.LOC_NM = _fnToNull(vResult[0].LOC_NM);
        objLogin_Info.HP_NO = _fnToNull(vResult[0].HP_NO);
        objLogin_Info.CUST_NM = _fnToNull(vResult[0].CUST_NM);
        objLogin_Info.CUST_CD = _fnToNull(vResult[0].CUST_CD);

        $("#RES_ID").text(_fnToNull(vResult[0].USR_ID));
        $("#RES_EMAIL").text(_fnToNull(vResult[0].EMAIL));                
        $("#RES_NAME").val(_fnToNull(vResult[0].LOC_NM));
        if (_fnToNull(vResult[0].LOC_NM) != "") {
            $("#RES_NAME").siblings(".delete-btn").show();
        }
        $("#RES_TEL").val(_fnToNull(vResult[0].HP_NO));
        if (_fnToNull(vResult[0].HP_NO) != "") {
            $("#RES_TEL").siblings(".delete-btn").show();
        }

    }
    catch (err) {
        console.log("[Error - fnSetUserInfo()]" + err.message);
    }
}

//Warning 메시지 보여주는 부분
function fnShowWarning(InputID, SpanID, Color) {
    var vColor = Color;

    $("#" + InputID).css("border-color", Color);

    if (vColor == "#f44336") {
        $("#" + SpanID).show();
    }
    else if (vColor == "#4caf50") {
        $("#" + SpanID).hide();
    }
}

//Border를 초록 혹은 빨강으로 변경 시켜주는 함수
function fnWarningBorder(InputID, Color) {
    $("#" + InputID).css("border-color", Color);
}

//true => show / false => hide
function fnOnOffWarning(SpanID, IsCheck) {
    var vIsCheck = IsCheck;

    if (vIsCheck == "true") {
        $("#" + SpanID).show();
    }
    else if (vIsCheck == "false") {
        $("#" + SpanID).hide();
    }
}

//패스워드 & 패스워드 확인 비교
function fnPwCompare(value1, value2) {
    var vPw1 = value1;
    var vPw2 = value2;

    //1번 값이 둘다 다를 경우.
    //2번 값이 똑같을 경우.    

    if (vPw1 != "" && vPw2 != "") {
        if (vPw1 != vPw2) {
            fnOnOffWarning("PW2_Compare", "true");

            return "false";
        } else if (vPw1 == vPw2 && 5 < vPw2.length) {
            fnOnOffWarning("PW2_Compare", "false");
            return "true";
        }
    }
    return false;
}

function fnChkNowPSWD() {
    try {

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#RES_ID").text();
        objJsonData.EMAIL = $("#RES_EMAIL").text();
        objJsonData.NOW_PSWD = $("#RES_NOWPWD").val();

        $.ajax({
            type: "POST",
            url: "/Member/ChkNowPSWD",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _chkpwd = false;
                    fnShowWarning("RES_NOWPWD", "NOWPWD_Wrong", "#4caf50");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _chkpwd = true;
                    fnShowWarning("RES_NOWPWD", "NOWPWD_Wrong", "#f44336");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("Please contact the person in charge.");
                }
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnChkNowPSWD]" + err.message);
    }
}

//회원정보 수정
function fnModifySave() {
    try {

        if (fnModifySave_Validation()) {
            
            var objJsonData = new Object();
            objJsonData.USR_ID = $("#RES_ID").text();
            objJsonData.EMAIL = $("#RES_EMAIL").text();
            objJsonData.NOW_PSWD = $("#RES_NOWPWD").val();
            objJsonData.NEW_PSWD = _fnToNull($("#RES_PWD").val());
            objJsonData.LOC_NM = $("#RES_NAME").val();
            objJsonData.HP_NO = $("#RES_TEL").val();

            $.ajax({
                type: "POST",
                url: "/Member/ModifySave",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        alert("Member information has been modified.");
                        location.href = window.location.origin;
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("Member information has not been modified. Please contact the person in charge.");
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Please contact the person in charge.");                        
                    }
                }, error: function (xhr, status, error) {
                    alert("Please contact the person in charge.");
                    console.log(error);
                }
            });

        }
    }
    catch (err) {
        alert('Please contact the person in charge.');
        console.log("[Error - fnModifySave]" + err.message);
    }
}

//회원 정보 수정 밸리데이션 추가
function fnModifySave_Validation() {
    try {        
        var vNowPwd = $("#RES_NOWPWD").val();
        var vNewPwd = $("#RES_PWD").val();
        var vCheckNewPwd = $("#RES_PWD2").val();
        var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/; //비밀번호 유효성 검사

        //필수값 - 비밀번호 
        if (_fnToNull(vNowPwd) == "") {
            alert("Please enter your current password.");
            $("#RES_NOWPWD").focus();
            return false;
        }

        if (_chkpwd) {
            alert("The current password is incorrect. Please check again.");
            $("#RES_NOWPWD").focus();
            return false;
        }

        //필수값 - 이름
        if (_fnToNull($("#RES_NAME").val()) == "") {
            alert("Please enter a name.");
            $("#RES_NAME").focus();
            return false;
        }

        if (_fnToNull($("#RES_TEL").val()) == "") {
            alert("Please enter your cell phone number.");
            $("#RES_TEL").focus();
            return false;
        }

        //비밀번호 관련 벨리데이션 체크
        if (_fnToNull(vNewPwd) != "" || _fnToNull(vCheckNewPwd) != "") {
            //벨리데이션 
            if (vNewPwd != vCheckNewPwd) {
                alert("The new password and the confirmation password are not the same.");
                return false;
            }
            if (vNewPwd.length < 6) {
                alert("Please enter more than 6 digits and less than 16 digits in the password.");
                return false;
            }
            if (!vCheck.test(vNewPwd)) {
                alert("Please enter the password including English, numbers, and special characters.");
                return false;
            }
        }

        return true;

    }
    catch (err) {
        console.log("[Error - fnModifySave_Validation]" + err.message);
    }
}


/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////
