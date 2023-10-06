////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
//$(function () {
//    
//});

//인증번호 발급 버튼 이벤트
$(document).on("click", "#FindPW_GetAuthNum", function () {
    fnGetAuthNum();
});

//이름 엔터 키 이벤트
$(document).on("keyup", "#FindPW_NM", function (e) {
    if (e.keyCode == 13) {
        fnGetAuthNum();
    } 
});

//인증번호 엔터 키 이벤트
$(document).on("keyup", '#FindPW_Key', function (e) {
    if (e.keyCode == 13) {
        fnGetNewPW();
    }
});

//임시 비밀번호 발급
$(document).on("click", "#FindPW_GetNewPW", function () {
    fnGetNewPW();
});


////////////////////////function///////////////////////
//인증번호 발급 함수
function fnGetAuthNum() {
    try {
        if (fnGetAuthNum_Validation()) {

            var objJsonData = new Object();
            objJsonData.USR_ID = $("#FindPW_ID").val();
            objJsonData.LOC_NM = $("#FindPW_NM").val();

            $.ajax({
                type: "POST",
                url: "/Member/GetAuthNum",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {

                    //여기서 성공 시 메일을 보내자
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                        //메일 보내기 함수
                        fnSendMail(JSON.parse(result).AuthNum[0]["SEND_EMAIL"], JSON.parse(result).AuthNum[0]["EMAIL"], "[Molax] Get your temporary password.", "Get your temporary password.", "Get your temporary password.", JSON.parse(result).AuthNum[0]["KEY"]);
                        alert("The certification number has been sent to the email of the registered ID.");
                        $("#FindPW_GetAuthNum").val("Reissuance of certification number");
                        $(".GetAuthNum").show();

                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        $("#FindPW_GetAuthNum").val("Issuing a certification number");
                        $(".GetAuthNum").hide();
                        $("#FindPW_Key").val("");
                        alert("There is no matching ID found.");
                        console.log("[Fail - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "S") {
                        alert("This account has not been approved. Please contact the administrator.");
                        console.log("[Fail - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Please contact the person in charge.");
                        console.log("[Error - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }

                }, error: function (xhr, status, error) {
                    alert("Please contact the person in charge.");
                    console.log(error);
                }
            });
        }
    }
    catch (err) {
        alert("Please contact the person in charge.");
        console.log("[Error - fnGetAuthNum()]" + err.message);
    }
}

//인증번호 발급 밸리데이션
function fnGetAuthNum_Validation() {
    try {

        $("#FindPW_Error").hide();
        
        if (_fnToNull($("#FindPW_ID").val()) == "") {
            $("#FindPW_Error")[0].innerHTML = "Please enter your ID.";
            $("#FindPW_Error").show();
            return false;
        }

        if (_fnToNull($("#FindPW_NM").val()) == "") {
            $("#FindPW_Error")[0].innerHTML = "Please enter a name.";
            $("#FindPW_Error").show();
            return false;
        }

        return true; 
    }
    catch (err) {
        alert("Please contact the person in charge.");
        console.log("[Error - fnGetAuthNum_Validation()]" + err.message);
    }
}

//임시 비밀번호 발급
function fnGetNewPW() {
    try {

        if (fnGetAuthNum_Validation()) {
            var objJsonData = new Object();
            objJsonData.USR_ID = $("#FindPW_ID").val();
            objJsonData.LOC_NM = $("#FindPW_NM").val();
            objJsonData.KEY = $("#FindPW_Key").val();

            $.ajax({
                type: "POST",
                url: "/Member/GetNewPW",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {

                    //여기서 성공 시 메일을 보내자
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                        //메일 보내기 함수
                        fnSendMail(JSON.parse(result).NewPSWD[0]["SEND_EMAIL"], JSON.parse(result).NewPSWD[0]["EMAIL"], "[Molax]Get your temporary password.", "Get your temporary password.", "Get your temporary password", JSON.parse(result).NewPSWD[0]["PSWD"]);
                        alert("A temporary password has been sent to the email of your registered ID.");
                        location.href = window.location.origin + "?LoginPopup=Y";

                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("The ID, name, and certification number are wrong.");
                        console.log("[Fail - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Please contact the person in charge.");
                        console.log("[Error - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }

                }, error: function (xhr, status, error) {
                    alert("Please contact the person in charge.");
                    console.log(error);
                }
            });
        }
        
    }
    catch (err) {
        alert("Please contact the person in charge.");
        console.log("[Error - fnGetPW]" + err.message);
    }
}



//메일 보내기 함수
function fnSendMail(vFrom,vTo,vSubject,vTitle, vTh, vTb) {
    try {

        var objJsonData = new Object();
        objJsonData.FROM = vFrom;
        objJsonData.TO = vTo;
        objJsonData.SUBJECT = vSubject
        objJsonData.TITLE = vTitle;
        objJsonData.TH = vTh;
        objJsonData.TB = vTb;       

        //ajax로 메일 보내기
        $.ajax({
            type: "POST",
            url: "/Member/SendEmail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson_SB(objJsonData) },
            success: function (result) {      
                console.log(result);
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });

    }
    catch (err) {
        alert("Please contact the person in charge.");
        console.log("[Error - fnSendMail]" + err.message);
    }
}


/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////
