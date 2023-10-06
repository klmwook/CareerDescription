////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
//$(function () {
//    
//});

//아이디 찾기 버튼 검색
$(document).on("click", "#FindUser_Search", function () {
    fnGetFindID();
});

//휴대폰 번호 , 엔터 키 이벤트
$(document).on("keyup", "#FindUser_HP", function (e) {
    if (e.keyCode == 13) {
        fnGetFindID();
    } else {
        if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
            var inputVal = $(this).val();
            $(this).val(inputVal.replace(/[^0-9 | -]/gi, ''));

            vValue = $(this).val().trim();
            $(this).val(_fnMakePhoneForm(vValue));
        }
    }
});
////////////////////////function///////////////////////
//아이디 찾기 함수
function fnGetFindID() {
    try {
        if (fnFindID_Validation()) {

            var objJsonData = new Object();
            objJsonData.LOC_NM = $("#FindUser_NM").val();
            objJsonData.HP_NO = $("#FindUser_HP").val();

            $.ajax({
                type: "POST",
                url: "/Member/FindID",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        var vHTML = "Your ID is " + fnSetIDHidden(JSON.parse(result).FindID[0]["USR_ID"]) + ".";
                        $("#FindID_Result")[0].innerHTML = vHTML;
                        $("#FindID_Area").show();
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("There is no ID.");
                        console.log("[Fail - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("Please contact the person in charge.");
                        console.log("[Error - fnGetFindID()]"+JSON.parse(result).Result[0]["trxMsg"]);
                    }
                }, error: function (xhr, status, error) {
                    alert("Please contact the person in charge.");
                    console.log(error);
                }
            });
        }
    }
    catch (err) {
        console.log("[Error - fnGetFindID()]" + err.meessage);
    }
}

//아이디 찾기 밸리데이션 체크
function fnFindID_Validation() {
    try {

        $("#FindUser_Error").hide();

        if ($("#FindUser_NM").val().length < 2) {
            $("#FindUser_Error")[0].innerHTML = "Please enter a name. (At least 2 characters)";
            $("#FindUser_Error").show();
            return false;
        }
        
        if (_fnToNull($("#FindUser_NM").val()) == "") {
            $("#FindUser_Error")[0].innerHTML = "Please enter a name. (At least 2 characters)";
            $("#FindUser_Error").show();
            return false;
        }

        if (_fnToNull($("#FindUser_HP").val()) == "") {
            $("#FindUser_Error")[0].innerHTML = "Please enter your cell phone number.";
            $("#FindUser_Error").show();
            return false;
        }

        return true;
    }
    catch (err) {
        console.log("[Error - fnFindID_Validation]" + err.meessage);
    }
}

//아이디 가리기
function fnSetIDHidden(vValue) {

    var vResult = "";
    vResult += vValue.substring(0, 3);

    var vStar = "";
    

    for (var i = 0; i < vValue.length - 3;i++) {
        vStar += "＊";
    }

    vResult += vStar;
    return vResult;

    //if (vValue.length < 3) {
    //
    //    var vResult = "*";
    //    vResult += vValue.substring(1, vValue.length);
    //
    //    return vResult;
    //}
    //else {
    //
    //    var vResult = "＊＊";
    //    vResult += vValue.substring(2, vValue.length);
    //
    //    return vResult;
    //}
}
/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////
