////////////////////전역 변수//////////////////////////
var _isSearch = false;
var _vLOC_CD = "";
////////////////////jquery event///////////////////////
$(function () {
    $("#page_ChkInventoryRack").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("#Select_Plant").val(_fnToNull($("#Session_BRANCH_CD").val()));
        $("#Input_Location").focus();
    }
});

//현재 - Store Change Event 
$(document).on("change", "#Select_Plant", function () {
    //초기화
    $("#Input_Location").val("").focus();
    $("#Input_Location").siblings(".delete").hide();
    $("#Input_Barcode").val("");
    $("#Input_Barcode").siblings(".delete").hide();
    $("#ChkInventoryRack_Result_Area").empty();
    $("#Span_Total").text("0");
    $("#Span_Count").text("0");
});

$(document).on("keyup", "#Input_Location", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        //11자리가 아닐 경우 스캔 X
        if ($(this).val().length != 11) {
            _fnAlertMsg("Location 자리수가 11자리가 아닙니다.", "Input_Location");
        }
        else {
            fnGetItemList();
        }
    }
});

//location - 조회 버튼
$(document).on("click", "#btn_Location", function () {
    if ($("#Input_Location").val().length > 0) {
        if ($("#Input_Location").val().length != 11) {
            _fnAlertMsg("Location 자리수가 11자리가 아닙니다.", "Input_Location");
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

//저장 버튼
$(document).on("click", "#btn_ChkInventoryRack_Save", function () {
    if (_isSearch) {
        layerPopup("#Save_Confirm");
    } else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Save Confirm Yes 이벤트
$(document).on("click", "#Save_Confirm_Yes", function () {
    layerClose('#Save_Confirm');
    fnSaveChkInventoryRack();
});

////////////////////////function///////////////////////
function fnGetItemList() {
    try {

        if (_fnToNull($("#Select_Plant").find("option:selected").val()) == "") {
            _fnAlertMsg("PLANT를 선택 하세요.");
            return false;
        }

        if (_fnToNull($("#Input_Location").val()) == "") {
            _fnAlertMsg("LOCATION을 입력 하세요.", "Input_Location");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.LOC_CD = $("#Input_Location").val();

        $.ajax({
            type: "POST",
            url: "/L_ChkInventoryRack/fnGetItemList",
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

        $("#ChkInventoryRack_Result_Area .Barcode").filter(function (index, selector) {
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

//재고 저장 함수
function fnSaveChkInventoryRack() {
    try {

        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/L_ChkInventoryRack/fnSaveChkInventoryRack",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnInitData();
                    //fnReSetItemList();
                    _fnAlertMsg("저장 완료 되었습니다.");
                }
                else {
                    _fnAlertMsg("저장 실패 하셨습니다.");
                    console.log("[Error - fnSavePacking]" + JSON.parse(result).Result[0]["trxMsg"]);
                }

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
        console.log("[Error - fnSaveChkInventoryRack]" + err.message);
    }
}

//Save 파라미터 만들기
function fnSetSaveParameter() {
    try {

        var array_mst = new Array();
        var array_dtl = new Array();
        var final_vJsonData = new Object();
        var vJsonData_MST = new Object;
        vJsonData_MST.DB_TYPE = $("#Session_DB_TYPE").val();
        vJsonData_MST.USR_ID = $("#Session_USR_ID").val();
        vJsonData_MST.LOC_CD = _vLOC_CD;
        vJsonData_MST.CHK_SEQ = 1;
        array_mst.push(vJsonData_MST);

        $.each($("#ChkInventoryRack_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.RCP_MNGT_NO = $(this).find("td").eq(0).text();
            vJsonData_DTL.BOX_ID = $(this).find("td").eq(1).text();
            vJsonData_DTL.ITEM_SEQ = $(this).find("td").eq(2).text();

            array_dtl.push(vJsonData_DTL);
        });

        //밸리데이션
        if (array_dtl.length == 0) {
            _fnAlertMsg("데이터를 선택 해주시기 바랍니다.");
            return false;
        }

        final_vJsonData.MST = array_mst;
        final_vJsonData.DTL = array_dtl;

        return final_vJsonData;

    }
    catch (err) {
        console.log("[Error - fnSetSaveParameter]" + err.message);
    }
}

//초기화 함수
function fnInitData() {
    try {
        _isSearch = false;
        _vLOC_CD = "";
        $(".delete").hide();
        $("#Input_Location").val("");
        $("#Input_Barcode").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#ChkInventoryRack_Result_Area").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
function fnMakeItemList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            _vLOC_CD = $("#Input_Location").val();
            var vResult = JSON.parse(vJsonData).Item;

            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_MNGT_NO"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["BOX_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_SEQ"]) + "</td> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode\">" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["PJ_ART_CD"]) + "</td> ";
                vHTML += "   </tr> ";
            });

            vResult = JSON.parse(vJsonData).Total;
            $("#Span_Total").text(_fnToZero(vResult[0]["COUNT"]));
            $("#Span_Count").text(0);

            vResult = JSON.parse(vJsonData).Count;
            if (vResult != undefined && vResult.length != 0) {
                if (_fnToNull(vResult[0]["COUNT"]) != "") {
                    _fnAlertMsg("이전에 재고 실사된 로케이션 입니다.");
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            _vLOC_CD = "";
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);
            $("#Span_Count").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            _vLOC_CD = "";
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            $("#Span_Total").text(0);
            $("#Span_Count").text(0);

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#ChkInventoryRack_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}
////////////////////////API////////////////////////////