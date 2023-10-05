////////////////////전역 변수//////////////////////////
var _isSearch = false;
var _OrderID = "";
////////////////////jquery event///////////////////////
$(function () {
    $("#page_Picking").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
});

//ORDER ID 스캔 이벤트
$(document).on("keyup", "#Input_OrderID", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        layerPopup("#Picking_Confirm");
    }
});

//ORDER ID - 조회 버튼
$(document).on("click", "#btn_OrderID", function () {
    if ($("#Input_OrderID").val().length > 0) {
        layerPopup("#Picking_Confirm");
    } else {
        _fnAlertMsg("Order ID를 입력 해 주세요.", "Input_OrderID");
    }
});

//내 작업으로 설정 Yes 이벤트
$(document).on("click", "#Picking_Confirm_Yes", function () {
    layerClose('#Picking_Confirm');
    fnSetItemList();
});

//내 작업으로 설정 No 이벤트
$(document).on("click", "#Picking_Confirm_No", function () {
    layerClose('#Picking_Confirm');
});

//바코드 스캔 이벤트
$(document).on("keyup", "#Input_Barcode", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            fnSetSelected($(this).val());
        }
    }
});

//BARCODE - 조회 버튼
$(document).on("click", "#btn_Barcode", function () {
    if ($("#Input_Barcode").val().length > 0) {
        fnSetSelected($("#Input_Barcode").val());
    } else {
        _fnAlertMsg("BARCODE를 입력 해 주세요.", "Input_Barcode");
    }
});

//LOCATION 스캔 이벤트
$(document).on("keyup", "#Input_Location", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            //12자리가 아닐 경우 스캔 X
            if ($(this).val().length != 8) {
                _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Location");
            }
            else {
                fnSetLocation($(this).val());
            }
        }
    }
});

//location - 조회 버튼
$(document).on("click", "#btn_Location", function () {
    if ($("#Input_Location").val().length > 0) {
        if ($("#Input_Location").val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Location");
        } else {
            fnSetLocation($("#Input_Location").val());
        }
    } else {
        _fnAlertMsg("Location를 입력 해 주세요.", "Input_Location");
    }
});

//저장 버튼 이벤트
$(document).on("click", "#btn_Picking_Save", function () {
    if (_isSearch) {
        layerPopup("#Save_Confirm");
    }
    else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Save Confirm Yes 이벤트
$(document).on("click", "#Save_Confirm_Yes", function () {
    layerClose('#Save_Confirm');
    fnSavePicking();
});

////////////////////////function///////////////////////
//Order ID 가져오기
//function fnGetOrderID() {
//    try {
//        var objJsonData = new Object();
//
//        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
//        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
//        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
//        objJsonData.USR_ID = $("#Session_USR_ID").val();
//
//        $.ajax({
//            type: "POST",
//            url: "/Picking/fnGetOrderID",
//            async: true,
//            dataType: "json",
//            data: { "vJsonData": _fnMakeJson(objJsonData) },
//            success: function (result) {
//                fnMakeOrderID(result);
//            }, error: function (xhr, status, error) {
//                $("#ProgressBar_Loading").hide(); //프로그래스 바
//                _fnAlertMsg("담당자에게 문의 하세요.");
//                console.log(error);
//            },
//            beforeSend: function () {
//                $("#ProgressBar_Loading").show(); //프로그래스 바
//            },
//            complete: function () {
//                $("#ProgressBar_Loading").hide(); //프로그래스 바
//            }
//        });
//
//    }
//    catch (err) {
//        console.log("[Error - fnGetDeliveryNote]" + err.message);
//    }
//}

//내 박스로 설정 , Total Item , Item List 가져오기 
function fnSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.TRA_MNGT_NO = "";
        //앞 2자리 뺴고 뒷자리 2개만 해서 가져오기
        //objJsonData.ORD_ID = $("#Input_OrderID").val();
        objJsonData.ORD_ID = $("#Input_OrderID").val().substr(2, $("#Input_OrderID").val().length);

        $.ajax({
            type: "POST",
            url: "/T_Picking/fnSetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _isSearch = true;

                    fnSetItemTotal(result);
                    fnMakeItemList(result);

                    $("#Input_Barcode").focus().val("");
                    $("#Input_Barcode").siblings(".delete").hide();
                }
                else {
                    _isSearch = false;
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnSetItemList]" + err.message);
    }
}

//바코드 리스트에서 바코드 체크
function fnSetSelected(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#Picking_Result_Area .Barcode").filter(function (index, selector) {
            if (selector.innerText == vBarCode) {
                if (!vBoolean) {
                    if (!$(this).parents("tr").hasClass("on")) {
                        $(this).parents("tr").addClass("selected");

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

        //페이지 이동
        if (vBoolean) {
            _SuccessSound.play();
            //페이지 이동
            //if (windowWidth < 1025) {
            //    $("#Picking_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#Picking_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}

            $("#Input_Barcode").val("");
            $("#Input_Barcode").siblings(".delete").hide();
            $("#Input_Location").focus();
        } else {            
            _FailSound.play();

            $("#Input_Barcode").val("").focus();
            $("#Input_Barcode").siblings(".delete").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

//Location 입력 함수
function fnSetLocation(vLocation) {
    try {
        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        //Location 저장 및 on 클래스 넣어주기
        $("#Picking_Result_Area .selected").filter(function (index, selector) {
            if (!vBoolean) {
                if ($(this).hasClass("selected")) {
                    if ($(this).find(".location").text() == vLocation) {
                        $(this).addClass("on");
                        $(this).find(".location").text(vLocation);

                        if (windowWidth < 1025) {
                            vOffset_Top = (Number($(this).find(".No").text()) - 1) * 31;
                        } else {
                            vOffset_Top = (Number($(this).find(".No").text()) - 1) * 30.3;
                        }

                        vBoolean = true;
                    } 
                    $(this).removeClass("selected");
                }
            }
        });

        //페이지 이동
        if (vBoolean) {
            _SuccessSound.play();
            var vCount = $("#Span_Count").text();
            vCount = Number(vCount) + 1;
            $("#Span_Count").text(vCount);

            //페이지 이동
            //if (windowWidth < 1025) {
            //    $("#Picking_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#Picking_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
        } else {
            _FailSound.play();
        }

        $("#Input_Location").val("");
        $("#Input_Location").siblings(".delete").hide();
        $("#Input_Barcode").focus();
    }
    catch (err) {
        console.log("[Error - fnSetLocation]" + err.message);
    }
}

//Picking 저장
function fnSavePicking() {
    try {

        //var objJsonData = new Object();
        //
        //objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        //objJsonData.TRA_MNGT_NO = _OrderID;

        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/T_Picking/fnSavePicking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnInitData();
                    _fnAlertMsg("저장 완료 되었습니다.","Input_OrderID");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[fail - fnSaveReceipt]" + _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]));
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                    console.log("[Error - fnSaveReceipt]" + _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]));
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
        console.log("[Error - fnSavePicking]" + err.message);
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
        array_mst.push(vJsonData_MST);

        $.each($("#Picking_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.TRA_MNGT_NO = $(this).find("td").eq(0).text();
            vJsonData_DTL.ITEM_ID = $(this).find("td").eq(1).text();
            vJsonData_DTL.RCP_MNGT_NO = $(this).find("td").eq(2).text();
            vJsonData_DTL.RCP_BOX_ID = $(this).find("td").eq(3).text();
            vJsonData_DTL.RCP_ITEM_SEQ = $(this).find("td").eq(4).text();

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

//저장 밸리데이션 
//function fnSavePicking_Validation() {
//    try {
//
//        //물품 선택이 전체 되지 않았을 때
//        if (Number($("#Span_Total").text()) != Number($("#Span_Count").text())) {
//            _fnAlertMsg("선택되지 않은 Item이 있습니다.", "Input_Barcode");
//            return false;
//        }
//
//        return true;
//    }
//    catch (err) {
//        console.log("[Error - fnSavePicking_Validation]" + err.message);
//        return false;
//    }
//}

//초기화
function fnInitData() {
    try {
        //fnGetOrderID();
        _isSearch = false;
        $(".delete").hide();
        $("#Input_Barcode").val("");
        $("#Input_Location").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Picking_Result_Area").empty();
        $("#Input_OrderID").val("");
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//ORDER ID 그려주기
//function fnMakeOrderID(vJsonData) {
//    try {
//        var vHTML = "";
//
//        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
//            var vResult = JSON.parse(vJsonData).OrderID;
//
//            vHTML += "<option value=\"\">ORDER ID</option>";
//
//            $.each(vResult, function (i) {
//                vHTML += "<option value=\"" + _fnToNull(vResult[i]["TRA_MNGT_NO"]) + "\">" + _fnToNull(vResult[i]["ORD_ID"]) + "</option>";
//            });
//        }
//        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
//            vHTML += "<option value=\"\">ORDER ID</option>";
//
//            console.log("[Fail - fnMakeOrderID] 데이터가 없습니다.");
//        }
//        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
//            vHTML += "<option value=\"\"> ID</option>";
//
//            console.log("[Error - fnMakeOrderID" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
//        }
//
//        $("#Select_OrderID")[0].innerHTML = vHTML;
//    }
//    catch (err) {
//        console.log("[Error - fnMakeOrderID]" + err.message);
//    }
//}

//Item Total 세팅
function fnSetItemTotal(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).ItemTotal;

            $("#Span_Total").text(_fnToNull(vResult[0]["CNT"]));
            //$("#Span_Count").text(_fnToNull(vResult[0]["PUTAWAY_QTY"]));
            $("#Span_Count").text("0");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $("#Span_Total").text("0");
            $("#Span_Count").text("0");
            console.log("[Fail - fnSetItemTotal]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            $("#Span_Total").text("0");
            $("#Span_Count").text("0");
            console.log("[Error - fnSetItemTotal]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetItemTotal]" + err.message);
    }
}

//ITEM LIST 만드는 함수
function fnMakeItemList(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).ItemList;

            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["TRA_MNGT_NO"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_MNGT_NO"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_BOX_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_ITEM_SEQ"]) + "</td> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode\">" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td class=\"location\">" + _fnToNull(vResult[i]["LOC_CD"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["ART_ID"]) + "</td> ";
                vHTML += "   </tr> ";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"4\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"4\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Picking_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}

////////////////////////API////////////////////////////