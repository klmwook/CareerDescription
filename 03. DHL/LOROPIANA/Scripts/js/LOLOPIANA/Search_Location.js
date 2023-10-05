////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {
    $("#page_SearchL").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("#Select_Plant").val(_fnToNull($("#Session_BRANCH_CD").val()));
        $("#Input_Barcode").focus();
    }
});

//현재 - Store Change Event 
$(document).on("change", "#Select_Plant", function () {
    //초기화
    $("#Input_Barcode").val("").focus();
    $("#Input_Barcode").siblings(".delete").hide();
    $("#IS_Location_Result_Area").empty();
    $("#Span_Total").text("0");
    $("#Span_Count").text("0");
});

//BARCODE - 바코드 찍었을 경우
$(document).on("keyup", "#Input_Barcode", function (e) {        
    //PDA에서는 KeyCode 0으로 뜸
    if (e.keyCode == 13) {
        _SuccessSound.play();
        fnGetItemList();
    }
});

//BARCODE - 조회 버튼
$(document).on("click", "#btn_Barcode", function () {
    if ($("#Input_Barcode").val().length > 0) {
        fnGetItemList();
    } else {
        _fnAlertMsg("EAN+BAT 를 입력 해 주세요.", "Input_Barcode");
    }
});
////////////////////////function///////////////////////
function fnGetItemList() {
    try {

        if (_fnToNull($("#Select_Plant").find("option:selected").val()) == "") {
            _fnAlertMsg("PLANT를 선택 하세요.");
            return false;
        }

        if (_fnToNull($("#Input_Barcode").val()) == "") {
            _fnAlertMsg("EAN+BAT를 입력 하세요.","Input_Barcode");
            return false;
        }
        
        if ($("#Input_Barcode").val().length < 5) {
            _fnAlertMsg("5자리 이상 입력 하세요.", "Input_Barcode");
            return false;
        }
        
        var objJsonData = new Object();
        
        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.BARCODE = $("#Input_Barcode").val();
        
        $.ajax({
            type: "POST",
            url: "/L_SearchLocation/fnGetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeItemList(result);
                $("#Input_Barcode").val("").focus();
                $("#Input_Barcode").siblings(".delete").hide();
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
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
        console.log("[Error - fnGetItemLocation]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
function fnMakeItemList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Item;
                        
            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["LOC_CD"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["PJ_ART_CD"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["STORAGE_ID"]) + "</td> ";
                vHTML += "   </tr> ";
            });

            vResult = JSON.parse(vJsonData).Total;
            $("#Span_Total").text(_fnToZero(vResult[0]["COUNT"]));
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"5\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"5\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#IS_Location_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}
////////////////////////API////////////////////////////