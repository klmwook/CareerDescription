////////////////////전역 변수//////////////////////////
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_Packing").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }    
});

//ORDER ID 스캔 이벤트
$(document).on("keyup", "#Input_OrderID", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        layerPopup("#Packing_Confirm");
    }
});

//ORDER ID - 조회 버튼
$(document).on("click", "#btn_OrderID", function () {
    if ($("#Input_OrderID").val().length > 0) {
        layerPopup("#Packing_Confirm");
    } else {
        _fnAlertMsg("Order ID를 입력 해 주세요.", "Input_OrderID");
    }
});

//내 작업으로 설정 Yes 이벤트
$(document).on("click", "#Packing_Confirm_Yes", function () {
    layerClose('#Packing_Confirm');
    fnSetItemList();
});

//내 작업으로 설정 No 이벤트
$(document).on("click", "#Packing_Confirm_No", function () {
    layerClose('#Packing_Confirm');    
});

//바코드 스캔 이벤트
$(document).on("keyup", "#Input_Barcode", function (e) {
    if (e.keyCode == 13) {
        fnChkList($(this).val());
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

//저장 버튼 이벤트
$(document).on("click", "#btn_Packing_Save", function () {
    if (_isSearch) {
        layerPopup("#Save_Confirm");
    } else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Save Confirm Yes 이벤트
$(document).on("click", "#Save_Confirm_Yes", function () {
    layerClose('#Save_Confirm');    
    fnSavePacking();
});

////////////////////////function/////////////////////////}
//내 박스로 설정 , Total Item , Item List 가져오기 
function fnSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        //objJsonData.TRA_MNGT_NO = $("#Select_OrderID").find("option:selected").val();
        objJsonData.TRA_MNGT_NO = "";
        //앞 2자리 뺴고 뒷자리 2개만 해서 가져오기
        //objJsonData.ORD_ID = $("#Input_OrderID").val();
        objJsonData.ORD_ID = $("#Input_OrderID").val().substr(2, $("#Input_OrderID").val().length);

        $.ajax({
            type: "POST",
            url: "/T_Packing/fnSetItemList",
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
function fnChkList(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#Packing_Result_Area .Barcode").filter(function (index, selector) {
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
            //    $("#Packing_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#Packing_Scroll").animate({ scrollTop: vOffset_Top }, 350);
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

//Save 파라미터 만들기
function fnSetSaveParameter() {
    try {

        var array_mst = new Array();
        var array_dtl = new Array();
        var final_vJsonData = new Object();
        var vJsonData_MST = new Object;
        vJsonData_MST.DB_TYPE = $("#Session_DB_TYPE").val();
        vJsonData_MST.PACK_USRID = $("#Session_USR_ID").val();
        vJsonData_MST.PACK_BOX_ID = _fnToNull($("#Input_BOXID").val());
        array_mst.push(vJsonData_MST);

        $.each($("#Packing_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.TRA_MNGT_NO = $(this).find("td").eq(0).text();
            vJsonData_DTL.ITEM_ID = $(this).find("td").eq(1).text();
            vJsonData_DTL.RCP_MNGT_NO = $(this).find("td").eq(2).text();
            vJsonData_DTL.RCP_ITEM_SEQ = $(this).find("td").eq(3).text();
            vJsonData_DTL.RCP_BOX_ID = $(this).find("td").eq(4).text();
            vJsonData_DTL.PICK_QTY = $(this).find("td").eq(5).text();

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

//저장 하는 로직 만들어두기.
function fnSavePacking() {
    try {
        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }        

        $.ajax({
            type: "POST",
            url: "/T_Packing/fnSavePacking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {
        
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnReSetItemList();
                    _fnAlertMsg("저장 완료 되었습니다.","Input_OrderID");
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
        console.log("[Error - fnSavePacking]" + err.message);
    }
}

//Total / List 재 검색
function fnReSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();

        $.ajax({
            type: "POST",
            url: "/T_Packing/fnReSetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnSetItemTotal(result);
                    fnMakeItemList(result);

                    $("#Input_Barcode").focus().val("");
                    $("#Input_Barcode").siblings(".delete").hide();

                    $("#Input_BOXID").focus().val("");
                    $("#Input_BOXID").siblings(".delete").hide();
                }
                else {
                    fnInitData();
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

//데이터 초기화
function fnInitData() {
    try {
        //fnGetOrderID();
        _isSearch = false;
        $(".delete").hide();
        $("#Input_OrderID").val("");
        $("#Input_Barcode").val("");
        $("#Input_BOXID").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Packing_Result_Area").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
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
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_ITEM_SEQ"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_BOX_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["PICK_QTY"]) + "</td> ";
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

        $("#Packing_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}
////////////////////////API////////////////////////////