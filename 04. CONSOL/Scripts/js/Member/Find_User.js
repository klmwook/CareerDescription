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
                        var vHTML = "귀하의 아이디는 " + fnSetIDHidden(JSON.parse(result).FindID[0]["USR_ID"]) + " 입니다.";
                        $("#FindID_Result")[0].innerHTML = vHTML;
                        $("#FindID_Area").show();
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        alert("아이디가 없습니다.");
                        console.log("[Fail - fnGetFindID()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        alert("담당자에게 문의 하세요.");
                        console.log("[Error - fnGetFindID()]"+JSON.parse(result).Result[0]["trxMsg"]);
                    }
                }, error: function (xhr, status, error) {
                    alert("담당자에게 문의 하세요.");
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
            $("#FindUser_Error")[0].innerHTML = "이름을 입력 해 주세요. (최소 2자 이상)";
            $("#FindUser_Error").show();
            return false;
        }
        
        if (_fnToNull($("#FindUser_NM").val()) == "") {
            $("#FindUser_Error")[0].innerHTML = "이름을 입력 해 주세요. (최소 2자 이상)";
            $("#FindUser_Error").show();
            return false;
        }

        if (_fnToNull($("#FindUser_HP").val()) == "") {
            $("#FindUser_Error")[0].innerHTML = "휴대폰 번호를 입력 해 주세요.";
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
