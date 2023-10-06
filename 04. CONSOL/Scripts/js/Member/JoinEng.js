////////////////////전역 변수//////////////////////////
var _vEmail_Check = "false";
var vObj_User = new Object();

if (_fnToNull(_Domain) == "") {
    var _vDOMAIN = $("#Session_DOMAIN").val();
} else {
    var _vDOMAIN = _Domain;
}
////////////////////jquery event///////////////////////
$(function () {
    $('.clause-btn').on('click', function () {
        $(this).toggleClass('on');
        $('.clause_list').stop(false, true).slideToggle(300);
    });

    if (_fnToNull($("#Session_USR_ID").val()) != "") {
        window.location = vLocation_AutoLogin;
    }

    //$("#RES_ID").focus();

    //input 박스 포커스 나갈 때 오류 메시지
    $("input").focusout(function (e) {

        var $this = $(e.target);
        var vValue = "";

        if ($this.attr('id') == "RES_ID") {
            vValue = $("#RES_ID").val();

            if (vValue == "") {
                fnShowWarning("RES_ID", "ID_Empty", "#f44336");
            } else {
                if (vValue.length > 4 || vValue.length < 11) {
                    fnCheckID_RealTime($("#RES_ID").val().trim());
                } else {
                    fnShowWarning("RES_ID", "ID_LENGTH", "#f44336");
                }
            }
        }
        else if ($this.attr('id') == "RES_PWD") {
            vValue = $("#RES_PWD").val();

            if (vValue == "") {
                fnShowWarning("RES_PWD", "PW1_Empty", "#f44336");
            }
        }
        else if ($this.attr('id') == "RES_PWD2") {
            vValue = $("#RES_PWD2").val();

            if (vValue == "") {
                fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336");
            }
        }
        else if ($this.attr('id') == "RES_NAME") {
            vValue = $("#RES_NAME").val();

            if (vValue == "") {
                fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
            }
        }
        else if ($this.attr('id') == "RES_EMAIL") {
            vValue = $("#RES_EMAIL").val();

            if (vValue == "") {
                fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
            } else if (_vEmail_Check == "true") {
                fnCheckEmail_RealTime($("#RES_EMAIL").val().trim());
            }
        }
        else if ($this.attr('id') == "RES_TEL") {
            vValue = $("#RES_TEL").val();

            if (vValue == "") {
                fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
            }
        }
        else if ($this.attr('id') == "RES_CRN") {
            vValue = $("#RES_CRN").val();

            if (vValue == "") {
                fnShowWarning("RES_CRN", "CRN_Empty", "#f44336");
            }
        }
        else if ($this.attr('id') == "CUST_NM") {
            vValue = $("#CUST_NM").val();

            if (vValue == "") {
                fnShowWarning("CUST_NM", "CustNAME_Empty", "#f44336");
            }
        }
    });

    //input 실시간 - Validation
    $("input").keyup(function (e) {
        try {
            var $this = $(e.target);
            var vValue = "";
            var vCompare = "";

            if ($this.attr('id') == "RES_ID") {
                vValue = $("#RES_ID").val().trim();
                //Color Error => #f44336 / Success => #4caf50

                //공백 값 체크
                if (vValue == "") {
                    fnShowWarning("RES_ID", "ID_Empty", "#f44336");
                    fnOnOffWarning("ID_LENGTH", "false");
                    fnOnOffWarning("ID_Refuser", "false");
                    fnOnOffWarning("ID_CheckID", "false");
                }
                else {
                    //fnShowWarning("RES_EMAIL", "Email_Empty", "#4caf50");
                    fnShowWarning("RES_ID", "ID_Empty", "#4caf50");
                    fnOnOffWarning("ID_Empty", "false");
                    fnOnOffWarning("ID_CheckID", "false");
                }

                //5자리 이상 입력 체크
                if (vValue.length < 5 || 10 < vValue.length) {
                    if (vValue.length != 0) {
                        fnShowWarning("RES_ID", "ID_LENGTH", "#f44336");
                    }
                } else {                    
                    fnShowWarning("RES_ID", "ID_LENGTH", "#4caf50");
                }

                //Check Warning - true false
                if ($("#ID_Empty").css("display") == "inline-block" || $("#ID_LENGTH").css("display") == "inline-block" || $("#ID_SCWarning").css("display") == "inline-block" || $("#ID_CheckID").css("display") == "inline-block" || $("#ID_Refuser").css("display") == "inline-block" ) {
                    $("#ID_Hidden").val("false");
                } else {
                    $("#ID_Hidden").val("true");
                }

            }
            //Input => E-mail
            else if ($this.attr('id') == "RES_EMAIL") {

                vValue = $("#RES_EMAIL").val().trim();
                //Color Error => #f44336 / Success => #4caf50

                //특수문자 체크
                if (fnCheckSC(vValue)) {
                    fnShowWarning("RES_EMAIL", "Email_Warning", "#4caf50");
                    fnOnOffWarning("Email_SCWarning", "false");
                } else {
                    fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
                }

                //공백 값 체크
                if (vValue == "") {
                    fnShowWarning("RES_EMAIL", "Email_Empty", "#f44336");
                    fnOnOffWarning("Email_Warning", "false");
                    fnOnOffWarning("Email_CheckID", "false");
                    fnOnOffWarning("Email_SCWarning", "false");
                }
                else {
                    //fnShowWarning("RES_EMAIL", "Email_Empty", "#4caf50");
                    fnOnOffWarning("Email_Empty", "false");
                    fnOnOffWarning("Email_CheckID", "false");
                    fnOnOffWarning("Email_SCWarning", "false");
                }

                var regExp = /^[!$^()-_0-9a-zA-Z!$^()-_]([-_.]?[!$^()-_0-9a-zA-Z!$^()-_])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*/i;
                if (vValue != "") {

                    var vMatch = "true";
                    var vSC = "true";

                    //null이면 경고 , null이 아니면 가능
                    if (vValue.match(regExp) == null) {
                        fnShowWarning("RES_EMAIL", "Email_Warn#ng", "#f44336");
                        vMatch = "false";
                        _vEmail_Check = "false";
                    } else {
                        fnShowWarning("RES_EMAIL", "Email_Warning", "#4caf50");
                        _vEmail_Check = "true";
                    }

                    //true면 경고 false면 가능
                    if (fnCheckSC(vValue)) {
                        fnShowWarning("RES_EMAIL", "Email_SCWarning", "#f44336");
                        vSC = "false";
                    } else {
                        fnShowWarning("RES_EMAIL", "Email_SCWarning", "#4caf50");
                    }

                    if (vMatch == "false" || vSC == "false") {
                        fnShowWarning("RES_EMAIL", "Email_Warning", "#f44336");
                    } else {
                        fnShowWarning("RES_EMAIL", "Email_SCWarning", "#4caf50");
                    }
                }

                //Check Warning - true false
                if ($("#Email_Empty").css("display") == "inline-block" || $("#Email_Warning").css("display") == "inline-block" || $("#Email_CheckID").css("display") == "inline-block") {
                    $("#Email_Hidden").val("false");
                } else {
                    $("#Email_Hidden").val("true");
                }

                //if (e.keyCode == 13) {
                //    $("#RES_PWD").focus();
                //}

            } //Res_Email End
            //RES_PWD start
            else if ($this.attr('id') == "RES_PWD") {

                vValue = $("#RES_PWD").val();
                vCompare = $("#RES_PWD2").val();

                var vBoolean_LessSix = "false";
                var vBoolean_Regular = "false";
                var vBoolean_Different = "false";

                //값 없을 시 경고메시지
                if (vValue == "") {
                    fnShowWarning("RES_PWD", "PW1_Empty", "#f44336");
                    fnOnOffWarning("PW1_OverSix", "false");
                }
                else {
                    fnOnOffWarning("PW1_Empty", "false");

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
                }

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

                //Check Warning - true false
                if ($("#PW1_Empty").css("display") == "inline-block" || $("#PW1_OverSix").css("display") == "inline-block" || $("#PW1_Regular").css("display") == "inline-block") {
                    if ($("#PW2_Empty").css("display") == "inline-block" || $("#PW2_OverSix").css("display") == "inline-block" || $("#PW2_Compare").css("display") == "inline-block" || $("#PW2_Regular").css("display") == "inline-block") {
                        $("#PW1_Hidden").val("true");
                    } else {
                        $("#PW1_Hidden").val("false");
                    }
                } else {
                    $("#PW1_Hidden").val("true");
                    $("#PW2_Hidden").val("true");
                }
                //if (e.keyCode == 13) {
                //    $("#RES_PWD2").focus();
                //}
            } //RES_PWD end
            //RES_PWD2 start 
            else if ($this.attr('id') == "RES_PWD2") {

                vValue = $("#RES_PWD2").val();
                vCompare = $("#RES_PWD").val();

                var vBoolean_LessSix = "false";
                var vBoolean_Regular = "false";
                var vBoolean_Different = "false";

                //값 없을 시 경고메시지
                if (vValue == "") {
                    fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336");
                    fnOnOffWarning("PW2_OverSix", "false");
                }
                else {
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
                }

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

                //Check Warning - true false
                if ($("#PW2_Empty").css("display") == "inline-block" || $("#PW2_OverSix").css("display") == "inline-block" || $("#PW2_Compare").css("display") == "inline-block" || $("#PW2_Regular").css("display") == "inline-block") {
                    $("#PW2_Hidden").val("false");
                } else {
                    $("#PW2_Hidden").val("true");
                }
                //if (e.keyCode == 13) {
                //    $("#RES_NAME").focus();
                //}
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

                //Check Warning - true false
                if ($("#NAME_Empty").css("display") == "inline-block" || $("#NAME_OverTwo").css("display") == "inline-block" || $("#NAME_CheckKorean").css("display") == "inline-block") {
                    $("#NAME_Hidden").val("false");
                } else {
                    $("#NAME_Hidden").val("true");
                }
                //if (e.keyCode == 13) {
                //    $("#RES_TEL").focus();
                //}
            } else if ($this.attr('id') == "CUST_NM") {
                vValue = $("#CUST_NM").val();
                //var check = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
                //                var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                //                if (regExp.test(vValue)) {
                //                    $("#CUST_NM").val(vValue.replace(regExp, ""));
                //                }
                //데이터 없을 때
                if (vValue == "") {
                    fnShowWarning("CUST_NM", "CustNAME_Empty", "#f44336");
                } else {
                    fnShowWarning("CUST_NM", "CustNAME_Empty", "#4caf50");
                }


                //Check Warning - true false
                if ($("#CustNAME_Empty").css("display") == "inline-block") {
                    $("#CustNAME_Hidden").val("false");
                } else {
                    $("#CustNAME_Hidden").val("true");
                }

            } //RES_NAME end
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

                //Check Warning - true false
                if ($("#TEL_Empty").css("display") == "inline-block" || $("#TEL_NotNumber").css("display") == "inline-block") {
                    $("#TEL_Hidden").val("false");
                } else {
                    $("#TEL_Hidden").val("true");
                }
                //if (e.keyCode == 13) {
                //    $("#RES_CRN").focus();
                //}
            } //RES_TEL end
            //RES_CRN Start
            else if ($this.attr('id') == "RES_CRN") {

                vValue = $("#RES_CRN").val().trim();

                var vKorCheck = /[ㄱ-ㅎ|ㅏ-ㅣ]/; //한글 자음 체크
                var vEngCheck = /[a-z | A-Z]/;

                //값이 없을 때
                if (vValue == "") {
                    fnShowWarning("RES_CRN", "CRN_Empty", "#f44336");
                    fnOnOffWarning("CRN_NotNumber", "false");
                    fnOnOffWarning("CRN_Ten", "false");
                } else {
                    fnShowWarning("RES_CRN", "CRN_Empty", "#4caf50");
                }

                //숫자가 아닐 때
                if (vKorCheck.test(vValue) || vEngCheck.test(vValue)) {
                    fnShowWarning("RES_CRN", "CRN_NotNumber", "#f44336");
                } else {
                    fnOnOffWarning("CRN_NotNumber", "false");
                }

                //사업자 번호가 맞는지 체크
                if (vValue.replace(/[^0-9]/gi, '').length == 10 && vValue.length == 10) {
                    fnShowWarning("RES_CRN", "CRN_Ten", "#4caf50");
                    if (fnCheckCRN(vValue)) {
                        //20190729 DB 사업자 번호 체크
                        //if (vResult) {
                        if (fnGetComCodeInfo(vValue)) {
                            fnShowWarning("RES_CRN", "CRN_Ten", "#4caf50");
                        } else {
                            //fnShowWarning("RES_CRN", "CRN_Nothing", "#f44336");                            
                        }
                    } else {                        
                        fnOnOffWarning("CRN_NO", "false");
                        $("#CUST_CD").val("");
                        $("#CUST_NM").val("");
                    }
                } else {
                    if (vValue.length  > 0) {
                        fnShowWarning("RES_CRN", "CRN_Ten", "#f44336");
                    }
                    $("#CUST_CD").val("");
                    $("#CUST_NM").val("");
                    $("#CUST_NM").attr("disabled", false);
                }

                //Check Warning - true false
                if ($("#CRN_Empty").css("display") == "inline-block" || $("#CRN_NotNumber").css("display") == "inline-block" || vValue.length != 10) {
                    $("#CRN_Hidden").val("false");
                } else {
                    $("#CRN_Hidden").val("true");
                }

            } //RES_CRN end        

        } catch (err) {
            console.log(err.message);
        }

    });

    //회원가입 btn
    $("#btnJoin").click(function () {

        if (!fnCheckData(vObj_User)) return false;

        if (!fnIsWarningMSG()) return false;
        //code 가져오기   //20221213 sihong - 개인정보 수집 및 동의 없어서 주석처리
        //if (!$("#agreeBox01").is(":checked")) {
        //    alert("개인정보 수집 및 이용에 대한 동의를 해주세요.");
        //    return false;
        //}
        vObj_User.cust_cd = $("#CUST_CD").val();
        vObj_User.cust_nm = $("#CUST_NM").val();

        if (vObj_User != false) {
            //_fnConfirmMsg("회원가입을 하겠습니까?");
            if (confirm("Would you like to join?")) {
                fnUser_Register(vObj_User);
            }
        }
    });

    $("#RES_TEL").keyup(function (event) {
        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^0-9 | -]/gi, ''));
        }
    });

    $("#RES_CRN").keyup(function (event) {
        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^0-9]/gi, ''));
        }
    });
});
////////////////////////function///////////////////////
//실시간 ID 중복 체크
function fnCheckID_RealTime(value) {
    try {

        var objJsonData = new Object();
        objJsonData.USR_ID = value;

        if (value.lastIndexOf(".") + 1 == value.length) {
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Member/IsCheckID",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        return;
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        if (JSON.parse(result).ID[0].APV_YN == "D") {
                            $("#ID_CheckID").hide();
                            fnShowWarning("RES_ID", "ID_CheckID", "#f44336");
                            $("#ID_Hidden").val("false");
                        } else {
                            $("#ID_CheckID").hide();
                            fnShowWarning("RES_ID", "ID_CheckID", "#f44336");
                            $("#ID_Hidden").val("false");
                        }
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Unable to fetch membership information.");
                        $("#ID_Hidden").val("false");
                        return;
                    }
                }, error: function (xhr, status, error) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("Please contact the person in charge.");
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
    } catch (err) {
        console.log(err.message);
    }
}

//실시간 Email 중복 체크
function fnCheckEmail_RealTime(value) {
    try {

        var objJsonData = new Object();
        objJsonData.EMAIL = value;

        if (value.lastIndexOf(".") + 1 == value.length) {
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Member/IsCheckEmail",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        return;
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {                        
                        $("#EMAIL_CheckID").hide();                        
                        fnShowWarning("RES_EMAIL", "Email_CheckID", "#f44336");
                        $("#EMAIL_Hidden").val("false");
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Unable to fetch membership information.");
                        $("#EMAIL_Hidden").val("false");
                        return;
                    }
                }, error: function (xhr, status, error) {                    
                    alert("Please contact the person in charge.");
                    console.log(error);
                }
            });
        }
    } catch (err) {
        console.log(err.message);
    }
}

//사업자 번호가 DB에 있는 것인지 여부 체크
function fnGetComCodeInfo(CRN) {
    try {
        var vResult = ""; //결과값

        //Json 데이터 한번 감싸기

        var objJsonData = new Object();
        objJsonData.CRN = CRN;

        $.ajax({
            type: "POST",
            url: "/Member/IsCheckCRN",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    $("#CUST_CD").val(JSON.parse(result).CRN[0].CUST_CD);
                    $("#CUST_NM").val(JSON.parse(result).CRN[0].CUST_NM);
                    $("#CUST_NM").attr("disabled", true);
                    fnShowWarning("CUST_NM", "CustNAME_Empty", "#4caf50");

                    vResult = true;
                } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    vResult = false;
                }
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });

        return vResult;
    } catch (err) {
        console.log(err.message);
    }
}

//회원가입 DB 통신
function fnUser_Register(vObj_User) {
    try {
        //var rtnVal = _fnGetAjaxData("POST", url, "PostRegist", vObj_User);

        $.ajax({
            type: "POST",
            url: "/Member/SetRegister",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vObj_User) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    alert("The application for membership has been completed. \nAvailable after approval by the person in charge.");
                    location.href = window.location.origin;

                    //var pushObj = new Object();
                    //pushObj.JOB_TYPE = "USR";
                    //pushObj.MSG = "회원가입 승인 해 주세요.";
                    //pushObj.REF1 = JSON.parse(result).Table1[0].USR_ID;
                    //pushObj.REF2 = "";
                    //pushObj.REF3 = "";
                    //pushObj.REF4 = "";
                    //pushObj.REF5 = "";
                    //pushObj.USR_ID = JSON.parse(result).Table1[0].USR_ID;
                    //
                    //Chathub_Push_Message(pushObj);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("You are not registered as a member. Please contact the administrator.");
                } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert(JSON.parse(result).Result[0]["trxMsg"]);
                }
                
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

//Validation
//회원가입 폼 공백 확인
function fnCheckData(vObj_User) {
    try {

        //Pw Check 

        var vID = $("#RES_ID").val();
        var vPW = $("#RES_PWD").val();
        var vPW2 = $("#RES_PWD2").val();
        //value
        var vEmail = $('#RES_EMAIL').val().trim();
        //    var vEmail_yn = $('input[name=email_yn]')[0].checked;
        var vPwd = $('#RES_PWD').val();
        var vName = $('#RES_NAME').val();
        var vTel = $('#RES_TEL').val();
        var vCustNm = $('#CUST_NM').val();
        var vCrn = $('#RES_CRN').val();

        if (vID == "") {
            fnShowWarning("RES_ID", "ID_Empty", "#f44336");
        }

        if (vEmail == "") {
            fnShowWarning("RES_EMAIL", "Email_Empty", "#f44336");
        }

        if (vPW == "") {
            fnShowWarning("RES_PWD", "PW1_Empty", "#f44336");
        }

        if (vPW2 == "") {
            fnShowWarning("RES_PWD2", "PW2_Empty", "#f44336");
        }

        if (vName == "") {
            fnShowWarning("RES_NAME", "NAME_Empty", "#f44336");
        }
        if (vTel == "") {
            fnShowWarning("RES_TEL", "TEL_Empty", "#f44336");
        }
        if (vCustNm == "") {
            fnShowWarning("CUST_NM", "CustNAME_Empty", "#f44336");
        }
        if (vCrn == "") {
            fnShowWarning("RES_CRN", "CRN_Empty", "#f44336");
        }

        if (vEmail == "" || vPW == "" || vPW2 == "" || vName == "" || vTel == "" || vCustNm == "" || vCrn == "") {
            return false;
        }
        vObj_User.USR_ID = vID;
        vObj_User.CRN = vCrn;
        vObj_User.EMAIL = vEmail;
        vObj_User.EMAIL_YN = "Y";
        vObj_User.PSWD = vPwd;
        vObj_User.CHAR_PSWD = fnSetPwdHidden(vPwd);
        vObj_User.LOC_NM = vName;
        vObj_User.HP_NO = vTel;
        vObj_User.CUST_CD = $("#CUST_CD").val();
        vObj_User.CUST_NM = $("#CUST_NM").val();
        vObj_User.DOMAIN = _vDOMAIN;

        fnGetOfficeCode();
        //vObj_User.OFFICE_CD = "YJLITE"; //하드코딩
        //var rtnVal = _fnGetAjaxData("POST", url, "GetOfficeCode", vObj_User);
        
        //하드코딩
        vObj_User.USE_YN = "Y";
        vObj_User.USR_TYPE = "S"; //화주

        return vObj_User;
    } catch (err) {
        console.log(err.message);
    }
}

//Office 코드 가져오기
function fnGetOfficeCode() {

    try {
        $.ajax({
            type: "POST",
            url: "/Member/GetOfficeCode",
            async: false,
            dataType: "json",            
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    vObj_User.OFFICE_CD = JSON.parse(result).OFFICE[0].OFFICE_CD;
                } else {
                    vObj_User.OFFICE_CD = "";
                }
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetOfficeCode]" + err.message);
    }

}


//사업자 등록 번호 체크
function fnCheckCRN(value) {
    try {
        var vCrnCode = value;
        if (vCrnCode.length == 10) {
            return true;            
        } else {
            alert("The number of business numbers is not correct.");
            return false;
        }
    } catch (err) {
        console.log(err.message);
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

//사업자등록번호 체크
function fnCheckBizID(bizID) {
    try {
        // bizID는 숫자만 10자리로 해서 문자열로 넘긴다.
        var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
        var tmpBizID, i, chkSum = 0, c2, remander;
        var result;

        bizID = bizID.replace(/-/gi, '');

        for (i = 0; i <= 7; i++) {
            chkSum += checkID[i] * bizID.charAt(i);
        }

        c2 = "0" + (checkID[8] * bizID.charAt(8));
        c2 = c2.substring(c2.length - 2, c2.length);
        chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
        remander = (10 - (chkSum % 10)) % 10;

        if (Math.floor(bizID.charAt(9)) == remander) {
            result = true; // OK!

        } else {
            result = false;
        }
        return result;
    } catch (err) {
        console.log(err.message);
    }
}

//Check 경고 메시지가 있는지 없는지 검증
function fnIsWarningMSG() {
    var vID_Hidden = $("#ID_Hidden").val();
    var vEmail_Hidden = $("#Email_Hidden").val();
    var vPW1_Hidden = $("#PW1_Hidden").val();
    var vPW2_Hidden = $("#PW2_Hidden").val();
    var NAME_Hidden = $("#NAME_Hidden").val();
    var TEL_Hidden = $("#TEL_Hidden").val();
    var CustName_Hidden = $("#CustNAME_Hidden").val();
    var Crn_Hidden = $("#CRN_Hidden").val();


    if ($("#CUST_NM").val() != "") {
        CustName_Hidden = "true";
    }
    //    var CRN_Hidden = $("#CRN_Hidden").val();
    //    var vCheck = $('input[name=iden_yn]')[0].checked;
    //    var vEmailCheck = $('input[name=email_yn]')[0].checked;
    //var COMPANY_Hidden = $("#COMPANY_Hidden").val();

    //    if (vEmail_Hidden == "true" && vPW1_Hidden == "true" && vPW2_Hidden == "true" && NAME_Hidden == "true" && TEL_Hidden == "true" && CRN_Hidden == "true") {
    if (vID_Hidden == "true" && vEmail_Hidden == "true" && vPW1_Hidden == "true" && vPW2_Hidden == "true" && NAME_Hidden == "true" && TEL_Hidden == "true" && CustName_Hidden == "true" && Crn_Hidden == "true") {
        return true;
    } else {
        return false;
    }
}

//특수 문자가 있는지 확인
function fnCheckSC(value) {

    var vValue = value;
    var vObj_SC = new Object();

    //특수문자 아스키 코드

    vObj_SC.Asterisk = String.fromCharCode("42"); // *
    vObj_SC.PercentSign = String.fromCharCode("37"); //%
    vObj_SC.Ampersand = String.fromCharCode("38"); //&
    vObj_SC.Plus = String.fromCharCode("43"); // +
    vObj_SC.BackSlash = String.fromCharCode("92");  //\
    vObj_SC.Colon = String.fromCharCode("58"); // :
    vObj_SC.Grave = String.fromCharCode("96"); // '
    vObj_SC.LAngle = String.fromCharCode("60"); // <
    vObj_SC.RAngle = String.fromCharCode("62"); // >
    vObj_SC.Slash = String.fromCharCode("47"); // /

    if (vValue.indexOf(vObj_SC.Asterisk) != -1 || vValue.indexOf(vObj_SC.PercentSign) != -1 || vValue.indexOf(vObj_SC.Ampersand) != -1 || vValue.indexOf(vObj_SC.Plus) != -1 || vValue.indexOf(vObj_SC.BackSlash) != -1 || vValue.indexOf(vObj_SC.Colon) != -1 || vValue.indexOf(vObj_SC.Grave) != -1 || vValue.indexOf(vObj_SC.LAngle) != -1 || vValue.indexOf(vObj_SC.RAngle) != -1 || vValue.indexOf(vObj_SC.Slash) != -1) {
        return true;
    } else {
        return false;
    }
}

/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////
