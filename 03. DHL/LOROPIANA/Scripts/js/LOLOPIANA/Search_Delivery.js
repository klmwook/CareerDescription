////////////////////전역 변수//////////////////////////
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_SearchD").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("#Input_BoxID").focus();
    }
});

//Delivery List 가져오기
$(document).on("keyup", "#Input_BoxID", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        fnGetStoreList();
    }
});

//BARCODE - 조회 버튼
$(document).on("click", "#btn_BoxID", function () {
    if ($("#Input_BoxID").val().length > 0) {
        fnGetStoreList();
    } else {
        _fnAlertMsg("BOX ID를 입력 해 주세요.", "Input_BoxID");
    }
});

////////////////////////function///////////////////////
//Store List 검색
function fnGetStoreList() {
    try {

        if (_fnToNull($("#Input_BoxID").val()) == "") {
            _fnAlertMsg("Box ID를 입력 하세요.", "Input_BoxID");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.PACK_BOX_ID = $("#Input_BoxID").val();

        $.ajax({
            type: "POST",
            url: "/SearchDelivery/fnGetStoreList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeStoreList(result);
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
        console.log("[Error - fnGetStoreList]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//Store 그리기
function fnMakeStoreList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;

            var vResult = JSON.parse(vJsonData).Store;
        
            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td class=\"No\">" + (i+1)+"</td> ";    //쿼리에서 ROWNUM을 할수가 없어서 해당 페이지만 이렇게 작업 함.
                vHTML += "   	<td>" + _fnToNull(vResult[i]["STORE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["QTY"]) + "</td> ";
                vHTML += "   </tr> ";
            });

            vResult = JSON.parse(vJsonData).Total;
            $("#Span_Total").text(_fnToZero(vResult[0]["COUNT"]));

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);
        
            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Delivery_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeStoreList]" + err.message);
    }
}
////////////////////////API////////////////////////////