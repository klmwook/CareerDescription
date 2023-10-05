////////////////////전역 변수//////////////////////////
var _ASN_MNGT_NO = "";
var _BOX_ID = "";
var _isSearch = false;

////////////////////jquery event///////////////////////
$(function () {
    $("#page_Receipt").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {        
        fnGetDN(); //Delivery Note 데이터 가져오기
    }

});

//Delivery Note 선택 이벤트
$(document).on("change", "#Select_Delivery_Note", function () {    
    $("#Input_HuId").val("").focus();
    $("#Input_HuId").siblings(".delete").hide();
    
    //결과값 초기화
    $("#Receipt_Result_Area").empty();
    $("#Input_Barcode").val("");
    $("#Input_Barcode").siblings(".delete").hide();
    $("#Span_Total").text("0");
    $("#Span_Count").text("0");
});

//HU ID - 바코드 찍었을 경우
$(document).on("keyup", "#Input_HuId", function (e) {
    //PDA에서는 KeyCode 0으로 뜸
    if (e.keyCode == 13) {
        _SuccessSound.play();
        layerPopup("#Receipt_Confirm");
    }    
});

//HU ID - Confirm 창 확인 버튼 이벤트 
$(document).on("click", "#Receipt_Confirm_Yes", function () {
    layerClose('#Receipt_Confirm');
    fnSetBoxItem();
});

//BARCODE - 바코드 찍었을 경우
$(document).on("keyup", "#Input_Barcode", function (e) {
    //PDA에서는 KeyCode 0으로 뜸
    if (e.keyCode == 13) {
        _SuccessSound.play();
        fnChkList($(this).val());
    }
});

//저장 버튼 이벤트
$(document).on("click", "#btn_Recepit_Save", function () {

    if (_isSearch) {
        layerPopup("#Save_Confirm");
    } else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Save Confirm Yes 이벤트
$(document).on("click", "#Save_Confirm_Yes", function () {
    layerClose('#Save_Confirm');
    fnSaveReceipt();
});

////////////////////////function///////////////////////
//Delivery Note 리스트 가져오기
function fnGetDN() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();

        $.ajax({
            type: "POST",
            url: "/T_Receipt/fnGetDN",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeDN(result);
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

//ID 바코드 읽을 경우 ()
function fnSetBoxItem() {
    try {
        var objJsonData = new Object();
        $
        if ($("#Select_Delivery_Note").find("option:selected").val() == "") {
            _fnAlertMsg("DELIVERY NOTE를 선택 하세요.");
            $("#Input_HuId").val("");
            $("#Input_HuId").siblings(".delete").hide();
            $("#Select_Delivery_Note").focus();
            return false;
        }

        if (_fnToNull($("#Input_HuId").val()) == "") {
            _fnAlertMsg("HU ID를 입력 하세요.");
            return false;
        }

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.ASN_MNGT_NO = $("#Select_Delivery_Note").find("option:selected").val();
        objJsonData.BOX_ID = $("#Input_HuId").val();

        $.ajax({
            type: "POST",
            url: "/T_Receipt/fnSetBoxItem",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    //전역변수로 가지고 있는다.
                    _ASN_MNGT_NO = $("#Select_Delivery_Note").find("option:selected").val();
                    _BOX_ID = $("#Input_HuId").val();
                    _isSearch = true;

                    fnSetItemTotal(result);
                    fnMakeItemList(result);
                    $("#Input_Barcode").focus().val("");
                    $("#Input_Barcode").siblings(".delete").hide();
                } else {
                    _isSearch = false;
                    $("#Input_HuId").val("");
                    $("#Input_HuId").siblings(".delete").hide();
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"],"Input_HuId");
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
        console.log("[Error - fnSetBoxItem]" + err.message);
    }
}

//바코드 리스트에서 바코드 체크
function fnChkList(vBarCode) {
    try {
        
        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#Receipt_Result_Area .Barcode").filter(function (index, selector) {
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
            var vCount = $("#Span_Count").text();
            vCount = Number(vCount) + 1;
            $("#Span_Count").text(vCount);

            //페이지 이동
            if (windowWidth < 1025) {                                
                $("#Receipt_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            }
            else {                
                $("#Receipt_Scroll").animate({ scrollTop: vOffset_Top }, 350);
            }
        }

        $("#Input_Barcode").val("").focus();
        $("#Input_Barcode").siblings(".delete").hide();
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

//Item Total 세팅
function fnSetItemTotal(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).BoxTotal;

            $("#Span_Total").text(_fnToNull(vResult[0]["ITEM_QTY"]));
            $("#Span_Count").text(_fnToNull(vResult[0]["RCP_QTY"]));
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

//저장 로직
function fnSaveReceipt() {
    try {       

        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/T_Receipt/fnSaveReceipt",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {
        
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("저장 완료 되었습니다.");
                    fnInitData();
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
        console.log("[Error - fnSaveReceipt]" + err.message);
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
        vJsonData_MST.ASN_MNGT_NO = _ASN_MNGT_NO;
        vJsonData_MST.BOX_ID = _BOX_ID;
        array_mst.push(vJsonData_MST);

        $.each($("#Receipt_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.ASN_MNGT_NO = $(this).find("td").eq(0).text();
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

//데이터 초기화
function fnInitData() {
    try {

        $(".delete").hide();
        fnGetDN();
        _ASN_MNGT_NO = "";
        _BOX_ID = "";
        _isSearch = false;
        $("#Input_HuId").val("");
        $("#Input_Barcode").val("");        
        $("#Receipt_Result_Area").empty();

        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//Delivery Note Select 만들기
function fnMakeDN(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).DeilveryNote;

            vHTML += "<option value=\"\">DELIVERY NOTE</option>";

            $.each(vResult, function (i) {
                if (_fnToNull(vResult[i]["SHP_CD"]) == "") {
                    vHTML += "<option value=\"" + _fnToNull(vResult[i]["ASN_MNGT_NO"]) + "\">" + _fnToNull(vResult[i]["DLV_ID"]) + "</option>";
                } else {
                    vHTML += "<option value=\"" + _fnToNull(vResult[i]["ASN_MNGT_NO"]) + "\">" + _fnToNull(vResult[i]["SHP_CD"]) + " " + _fnToNull(vResult[i]["DLV_ID"])+"</option>";
                }
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "<option value=\"\">DELIVERY NOTE</option>";

            console.log("[Fail - fnMakeDN] 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "<option value=\"\">DELIVERY NOTE</option>";

            console.log("[Error - fnMakeDN" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Select_Delivery_Note")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeDN]" + err.message);
    }
}

//ITEM LIST 만드는 함수
function fnMakeItemList(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).BoxList;
            
            $.each(vResult, function (i) {

                if (_fnToNull(vResult[i]["RCP_YN"]) == "Y") {
                    vHTML += "   <tr class=\"on\"> ";
                } else if (_fnToNull(vResult[i]["RCP_YN"]) == "N") {
                    vHTML += "   <tr> ";
                }

                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ASN_MNGT_NO"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["BOX_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_SEQ"]) + "</td> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode\">" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["ART_ID"]) + "</td> ";
                vHTML += "   </tr> ";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Receipt_Result_Area")[0].innerHTML = vHTML;        
    }
    catch (err) {
        console.log("[Error - fnMakeItemList]" + err.message);
    }
}

////////////////////////API////////////////////////////