////////////////////전역 변수//////////////////////////
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_SearchR").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("#Input_Location").focus();
    }
});

$(document).on("keyup", "#Input_Location", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        //12자리가 아닐 경우 스캔 X
        if ($(this).val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Location");
        }
        else {
            fnGetItemList();
        }
    }
});

//location - 조회 버튼
$(document).on("click", "#btn_Location", function () {
    if ($("#Input_Location").val().length > 0) {
        if ($("#Input_Location").val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Location");
        } else {
            fnGetItemList();
        }
    } else {
        _fnAlertMsg("Location를 입력 해 주세요.", "Input_Location");
    }
});

//BARCODE - 바코드 찍었을 경우
$(document).on("keyup", "#Input_Barcode", function (e) {    
    if (e.keyCode == 13) {
        if (_isSearch) {
            fnChkList($(this).val());
        } else {
            _SuccessSound.play();
            $("#Input_Barcode").val("");
            $("#Input_Barcode").siblings(".delete").hide();
            _fnAlertMsg("검색을 먼저 해주시기 바랍니다.", "Input_Location");
        }
    }
});

//BARCODE - 조회 버튼
$(document).on("click", "#btn_Barcode", function () {
    if ($("#Input_Barcode").val().length > 0) {
        fnChkList($("#Input_Barcode").val());
    } else {
        _fnAlertMsg("BARCODE를 입력 해 주세요.", "Input_Barcode");
    }
});

////////////////////////function///////////////////////
function fnGetItemList() {
    try {

        if (_fnToNull($("#Input_Location").val()) == "") {
            _fnAlertMsg("LOCATION을 입력 하세요.", "Input_Location");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.LOC_CD = $("#Input_Location").val();

        $.ajax({
            type: "POST",
            url: "/T_SearchRack/fnGetItemList",
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

//바코드 리스트에서 바코드 체크
function fnChkList(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#IS_Rack_Result_Area .Barcode").filter(function (index, selector) {
            if (selector.innerText == vBarCode) {
                if (!vBoolean) {
                    if (!$(this).parents("tr").hasClass("on")) {
                        $(this).parents("tr").addClass("on");

                        if (windowWidth < 1025) {
                            vOffset_Top = (Number($(this).siblings(".No").text()) - 1) * 31;
                        } else {
                            vOffset_Top = (Number($(this).siblings(".No").text()) - 1) * 30.3;
                        }

                        vBoolean = true;
                    }
                }
            }
        });

        //Count 1칸 늘려주기
        if (vBoolean) {
            _SuccessSound.play();
            var vCount = $("#Span_Count").text();
            vCount = Number(vCount) + 1;
            $("#Span_Count").text(vCount);

            //페이지 이동
            //if (windowWidth < 1025) {
            //    $("#IS_Rack_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#IS_Rack_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
        }
        else {
            _FailSound.play();
        }

        $("#Input_Barcode").val("").focus();
        $("#Input_Barcode").siblings(".delete").hide();
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
function fnMakeItemList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).Item;

            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode\">" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["ART_ID"]) + "</td> ";                
                vHTML += "   </tr> ";
            });

            vResult = JSON.parse(vJsonData).Total;
            $("#Span_Total").text(_fnToZero(vResult[0]["COUNT"]));
            $("#Span_Count").text(0);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);
            $("#Span_Count").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);
            $("#Span_Count").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#IS_Rack_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}
////////////////////////API////////////////////////////