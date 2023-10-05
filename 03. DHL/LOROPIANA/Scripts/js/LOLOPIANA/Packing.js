////////////////////전역 변수//////////////////////////
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_Packing").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("#Select_Plant").val(_fnToNull($("#Session_BRANCH_CD").val()));
        if (_fnToNull($("#Session_BRANCH_CD").val()) != "") {
            fnGetOrderID();
        }
    }
});

//PLANT 선택 시 ORDER ID 가져오기
$(document).on("change", "#Select_Plant", function () {
    if ($(this).find("option:selected").val() != "") {
        fnGetOrderID();
    } else {
        fnInitData();
    }
});

//ORDER ID 선택 시 레이어 팝업 , 초기화
$(document).on("change", "#Select_OrderID", function () {
    if ($(this).find("option:selected").val() != "") {
        layerPopup("#Packing_Confirm");
    }

    _isSearch = false;
    $(".delete").hide();
    $("#Input_Item_Barcode").val("");
    $("#Input_Price_Barcode").val("");
    $("#Span_Total").text("0");
    $("#Span_Count").text("0");
    $("#Packing_Result_Area").empty();
    $("#Select_BoxType").val("");
    $("#Input_BOXID").val("");
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

//상품라벨 BARCODE 스캔 이벤트
$(document).on("keyup", "#Input_Item_Barcode", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            if ($(this).val().length != 24) {
                _fnAlertMsg("BARCODE 자리수가 24자리가 아닙니다.", "Input_Item_Barcode");
            } else {
                fnSetSelected($(this).val());
            }
        }
    }
});

//상품라벨 BARCODE - 조회 버튼
$(document).on("click", "#btn_Item_Barcode", function () {
    if ($("#Input_Item_Barcode").val().length > 0) {
        fnSetSelected($("#Input_Item_Barcode").val());
    } else {
        _fnAlertMsg("상품라벨을 입력 해 주세요.", "Input_Item_Barcode");
    }
});

//PRICE 라벨 BARCODE 스캔 이벤트
$(document).on("keyup", "#Input_Price_Barcode", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            if ($(this).val().length != 24) {
                _fnAlertMsg("BARCODE 자리수가 24자리가 아닙니다.", "Input_Price_Barcode");
            } else {
                fnSetBarCode($(this).val());
            }
        }
    }
});

//PRICE 라벨 BARCODE - 조회 버튼
$(document).on("click", "#btn_Price_Barcode", function () {
    if ($("#Input_Price_Barcode").val().length > 0) {
        fnSetBarCode($("#Input_Price_Barcode").val());
    } else {
        _fnAlertMsg("상품라벨을 입력 해 주세요.", "Input_Price_Barcode");
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
//Order ID 가져오기
function fnGetOrderID() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();

        $.ajax({
            type: "POST",
            url: "/L_Packing/fnGetOrderID",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeOrderID(result);
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
        console.log("[Error - fnGetDeliveryNote]" + err.message);
    }
}


//내 박스로 설정 , Total Item , Item List 가져오기 
function fnSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.TRA_MNGT_NO = $("#Select_OrderID").find("option:selected").val();
        //objJsonData.TRA_MNGT_NO = "";
        //앞 2자리 뺴고 뒷자리 2개만 해서 가져오기
        //objJsonData.ORD_ID = $("#Input_OrderID").val();
        //objJsonData.ORD_ID = $("#Input_OrderID").val().substr(2, $("#Input_OrderID").val().length);

        $.ajax({
            type: "POST",
            url: "/L_Packing/fnSetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _isSearch = true;

                    fnSetItemTotal(result);
                    fnMakeItemList(result);

                    $("#Input_Item_Barcode").focus().val("");
                    $("#Input_Item_Barcode").siblings(".delete").hide();
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

        $("#Packing_Result_Area .Barcode_Item").filter(function (index, selector) {
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
            //    $("#PutAway_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#PutAway_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            $("#Input_Item_Barcode").val("");
            $("#Input_Item_Barcode").siblings(".delete").hide();
            $("#Input_Price_Barcode").focus();
        }
        else {
            _FailSound.play();

            $("#Input_Item_Barcode").val("").focus();
            $("#Input_Item_Barcode").siblings(".delete").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

//선택된 바코드에서 동일 한 바코드인지 더블 체크
function fnSetBarCode(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#Packing_Result_Area .selected").filter(function (index, selector) {

            if (!vBoolean) {
                if ($(this).hasClass("selected")) {
                    if ($(this).find(".Barcode_Price").text() == vBarCode) {
                        $("#Packing_Result_Area .selected").removeClass("selected"); //전체 삭제
                        $(this).addClass("on");

                        if (windowWidth < 1025) {
                            vOffset_Top = (Number($(this).find(".No").text()) - 1) * 31;
                        } else {
                            vOffset_Top = (Number($(this).find(".No").text()) - 1) * 30.3;
                        }

                        vBoolean = true;
                    }
                }
            }
        });

        //페이지 이동
        if (vBoolean) {

            var vCount = $("#Span_Count").text();
            vCount = Number(vCount) + 1;
            $("#Span_Count").text(vCount);

            _SuccessSound.play();

            $("#Input_Price_Barcode").val("");
            $("#Input_Price_Barcode").siblings(".delete").hide();
            $("#Input_Item_Barcode").focus();
            //페이지 이동
            //if (windowWidth < 1025) {
            //    $("#PutAway_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
            //else {
            //    $("#PutAway_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            //}
        }
        else {
            _FailSound.play();

            $("#Input_Price_Barcode").val("").focus();
            $("#Input_Price_Barcode").siblings(".delete").hide();
        }
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
        vJsonData_MST.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        vJsonData_MST.OFFICE_CD = $("#Session_OFFICE_CD").val();
        vJsonData_MST.PACK_USRID = $("#Session_USR_ID").val();
        vJsonData_MST.PACK_BOX_TYPE = _fnToNull($("#Select_BoxType").find("option:selected").val());
        vJsonData_MST.PACK_BOX_ID = "";
        vJsonData_MST.SEND_DLV_ID = "";
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
            url: "/L_Packing/fnSavePacking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {
        
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    //20221213 데이터 저장 이후에 PACK_BOX_ID 보여주기
                    $("#Input_BOXID").val(JSON.parse(result).Result[0]["trxMsg"]);
                    //fnInitData();
                    fnReSetItemList();
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
        console.log("[Error - fnSavePacking]" + err.message);
    }
}

//Total / List 재 검색
function fnReSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.TRA_MNGT_NO = $("#Select_OrderID").find("option:selected").val();

        $.ajax({
            type: "POST",
            url: "/L_Packing/fnReSetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnSetItemTotal(result);
                    fnMakeItemList(result);

                    $("#Input_Item_Barcode").focus().val("");
                    $("#Input_Item_Barcode").siblings(".delete").hide();
                    
                    $("#Input_Price_Barcode").focus().val("");
                    $("#Input_Price_Barcode").siblings(".delete").hide();

                    $("#Select_BoxType").val("");
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
        _isSearch = false;
        fnGetOrderID();
        $(".delete").hide();
        $("#Input_OrderID").val("");
        $("#Input_Item_Barcode").val("");
        $("#Input_BOXID").val("");
        $("#Select_BoxType").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Input_BOXID").val("");
        $("#Packing_Result_Area").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//ORDER ID 그려주기
function fnMakeOrderID(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).OrderID;

            vHTML += "<option value=\"\">ORDER ID</option>";

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + _fnToNull(vResult[i]["TRA_MNGT_NO"]) + "\">" + _fnToNull(vResult[i]["ORD_ID"]) + "</option>";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "<option value=\"\">ORDER ID</option>";

            console.log("[Fail - fnMakeOrderID] 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "<option value=\"\">ORDER ID</option>";

            console.log("[Error - fnMakeOrderID" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Select_OrderID")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeOrderID]" + err.message);
    }
}

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
                vHTML += "   	<td class=\"Barcode_Item\">" + _fnToNull(vResult[i]["ITEM_LABEL"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode_Price\">" + _fnToNull(vResult[i]["PRICE_LABEL"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["PICK_QTY"]) + "</td> ";
                vHTML += "   	<td class=\"location\">" + _fnToNull(vResult[i]["LOC_CD"]) + "</td> ";
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