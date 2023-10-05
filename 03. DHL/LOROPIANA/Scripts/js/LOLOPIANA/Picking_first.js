////////////////////전역 변수//////////////////////////
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_Picking").addClass("on");

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

//ORDER ID 선택 시 창고구역 데이터 가져오기
$(document).on("change", "#Select_OrderID", function () {
    if ($(this).find("option:selected").val() != "") {
        fnGetWareHouse($(this).find("option:selected").val(), "select");

        _isSearch = false;
        $(".delete").hide();
        $("#Input_Barcode").val("");
        $("#Input_Location").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Picking_Result_Area").empty();
    } else {        
        $("#Select_WareHouse")[0].innerHTML = "<option value=\"\">창고구역</option>";
    }
});

//내 작업 설정 
$(document).on("change", "#Select_WareHouse", function () {
    if ($(this).find("option:selected").val() != "") {
        layerPopup("#Picking_Confirm");
    } else {
        _isSearch = false;
        $(".delete").hide();
        $("#Input_Barcode").val("");
        $("#Input_Location").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Picking_Result_Area").empty();
    }
});

//내 작업으로 설정 Yes 이벤트
$(document).on("click", "#Picking_Confirm_Yes", function () {
    layerClose('#Picking_Confirm');
    fnSetItemList();
});

//내 작업으로 설정 No 이벤트
$(document).on("click", "#Picking_Confirm_No", function () {
    //초기화
    $("#Select_WareHouse").val("");
    _isSearch = false;
    $(".delete").hide();
    $("#Input_Barcode").val("");
    $("#Input_Location").val("");
    $("#Span_Total").text("0");
    $("#Span_Count").text("0");
    $("#Picking_Result_Area").empty();
    layerClose('#Picking_Confirm');
});

//LOCATION 스캔 이벤트
$(document).on("keyup", "#Input_Location", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            //12자리가 아닐 경우 스캔 X
            if ($(this).val().length != 11) {
                _fnAlertMsg("Location 자리수가 11자리가 아닙니다.", "Input_Location");
            }
            else {
                fnSetSelected($(this).val());
                //fnSetLocation($(this).val());
            }
        }
    }
});

//바코드 스캔 이벤트
$(document).on("keyup", "#Input_Barcode", function (e) {
    if (e.keyCode == 13) {
        if ($(this).val().length > 0) {
            if ($(this).val().length != 24) {
                _fnAlertMsg("BARCODE 자리수가 24자리가 아닙니다.", "Input_Barcode");
            } else {
                fnSetBarcode($(this).val());
            }
        }
    }
});

//location - 조회 버튼
$(document).on("click", "#btn_Location", function () {
    if ($("#Input_Location").val().length > 0) {
        if ($("#Input_Location").val().length != 11) {
            _fnAlertMsg("Location 자리수가 11자리가 아닙니다.", "Input_Location");
        } else {
            fnSetSelected($("#Input_Location").val());
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
function fnGetOrderID() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();

        $.ajax({
            type: "POST",
            url: "/L_Picking/fnGetOrderID",
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

//ORDER ID로 창고구역 데이터 가져오기 vType : select , save (선택 , 저장후 로직)
function fnGetWareHouse(vTRA_MNGT_NO,vType) {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.TRA_MNGT_NO = vTRA_MNGT_NO;

        $.ajax({
            type: "POST",
            url: "/L_Picking/fnGetWareHouse",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeWareHouse(result, vType);
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
        console.log("[Error - fnGetWareHouse]" + err.message);
    }
}

//내 박스로 설정 , Total Item , Item List 가져오기 
function fnSetItemList() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();
        objJsonData.WH_CODE = $("#Select_WareHouse").find("option:selected").val();
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.TRA_MNGT_NO = $("#Select_OrderID").find("option:selected").val();
        //앞 2자리 뺴고 뒷자리 2개만 해서 가져오기
        //objJsonData.ORD_ID = $("#Input_OrderID").val();
        //objJsonData.ORD_ID = $("#Input_OrderID").val().substr(2, $("#Input_OrderID").val().length);

        $.ajax({
            type: "POST",
            url: "/L_Picking/fnSetItemList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _isSearch = true;

                    fnSetItemTotal(result);
                    fnMakeItemList(result);

                    $("#Input_Location").focus().val("");
                    $("#Input_Location").siblings(".delete").hide();
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

//Picking 전용 Location 선 스캔 이후 Barcode 스캔
function fnSetSelected(vLocation) {
    try {
        var vBoolean = false;
        var vOffset_Top = 0;
        var windowWidth = $(window).width();

        $("#Picking_Result_Area .location").filter(function (index, selector) {
            if (selector.innerText == vLocation) {
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

            $("#Input_Location").val("");
            $("#Input_Location").siblings(".delete").hide();
            $("#Input_Barcode").focus();
        } else {
            _FailSound.play();

            $("#Input_Location").val("").focus();
            $("#Input_Location").siblings(".delete").hide();
        }

    } catch (err) {
        console.log("[Error - fnSetSelected]" + err.message);
    }
}


//바코드 리스트에서 바코드 체크
function fnSetBarcode(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        //스플릿 데이터를 만들자. 14 / 10
        var vEAN_CD = vBarCode.substring(0, 14);
        var vBATCH_ID = vBarCode.substring(14, 24);

        $("#Picking_Result_Area .selected").filter(function (index, selector) {
            if (!vBoolean) {
                if ($(this).hasClass("selected")) {
                    if ($(this).find(".EAN").text() == vEAN_CD) {

                        $(this).find(".BAT").text(vBATCH_ID);

                        //여기서 한번 데이터 확인하는 로직 들어가면 될듯
                        if (fnChkInventory(this)) {
                            $("#Picking_Result_Area .selected").removeClass("selected"); //전체 삭제
                            $(this).addClass("on");

                            if (windowWidth < 1025) {
                                vOffset_Top = (Number($(this).find(".No").text()) - 1) * 31;
                            } else {
                                vOffset_Top = (Number($(this).find(".No").text()) - 1) * 30.3;
                            }

                            vBoolean = true;
                        } else {
                            //_fnAlertMsg("재고 데이터가 없습니다.");
                            $(this).find(".BAT").text("");
                            $(this).removeClass("selected");
                        }
                    } else {
                        $(this).removeClass("selected");
                    }
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

        $("#Input_Barcode").val("");
        $("#Input_Barcode").siblings(".delete").hide();
        $("#Input_Location").focus();
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

//실제 재고 테이블에 해당 데이터가 있는지 확인하는 함수
function fnChkInventory(vThis) {
    try {
        var vResult = false;
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.BRANCH_CD = $("#Select_Plant").find("option:selected").val();        
        objJsonData.EAN_CD = $(vThis).find(".EAN").text();
        objJsonData.BATCH_ID = $(vThis).find(".BAT").text();
        objJsonData.PJ_ART_CD = $(vThis).find(".PJ_ART_CD").text();
        objJsonData.LOC_CD = $(vThis).find(".location").eq(0).text();
        objJsonData.ART_ID = $(vThis).find("td").eq(4).text();
        objJsonData.STORAGE_ID = $(vThis).find("td").eq(5).text();

        $.ajax({
            type: "POST",
            url: "/L_Picking/fnChkInventory",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y")
                {
                    //RCP_MNGT_NO , BOX_ID , ITEM_SEQ를 넣어준다.
                    $(vThis).find("td").eq(1).text(JSON.parse(result).Inventory[0]["RCP_MNGT_NO"]);
                    $(vThis).find("td").eq(2).text(JSON.parse(result).Inventory[0]["BOX_ID"]);
                    $(vThis).find("td").eq(3).text(JSON.parse(result).Inventory[0]["ITEM_SEQ"]);
                    vResult = true;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N")
                {
                    vResult = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E")
                {
                    console.log("[Error - fnChkInventory]" + JSON.parse(result).Result[0]["trxMsg"]);
                    vResult = false;
                }

            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnChkInventory]" + err.message);
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
            url: "/L_Picking/fnSavePicking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnAfterSaveInit();
                    _fnAlertMsg("저장 완료 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    fnAfterSaveInit();
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
        vJsonData_MST.USR_ID = $("#Session_USR_ID").val();
        array_mst.push(vJsonData_MST);

        $.each($("#Picking_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.TRA_MNGT_NO = $(this).find("td").eq(0).text();
            vJsonData_DTL.RCP_MNGT_NO = $(this).find("td").eq(1).text();
            vJsonData_DTL.RCP_BOX_ID = $(this).find("td").eq(2).text();
            vJsonData_DTL.RCP_ITEM_SEQ = $(this).find("td").eq(3).text();
            vJsonData_DTL.ITEM_ID = $(this).find("td").eq(6).text();

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

//초기화
function fnInitData() {
    try {
        _isSearch = false;
        $(".delete").hide();
        $("#Select_Plant").val("");
        $("#Select_OrderID")[0].innerHTML = "<option value=\"\">ORDER ID</option>";
        $("#Select_WareHouse")[0].innerHTML = "<option value=\"\">창고구역</option>";
        $("#Input_Barcode").val("");
        $("#Input_Location").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Picking_Result_Area").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

//저장 후 재 설정
function fnAfterSaveInit() {
    try {
        _isSearch = false;
        $(".delete").hide();
        $("#Input_Barcode").val("");
        $("#Input_Location").val("");
        $("#Span_Total").text("0");
        $("#Span_Count").text("0");
        $("#Picking_Result_Area").empty();

        //창고구역 세팅
        fnGetWareHouse($("#Select_OrderID").find("option:selected").val(), "save");
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

//창고구역 데이터 그려주기
function fnMakeWareHouse(vJsonData,vType) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).WareHouse;

            vHTML += "<option value=\"\">창고구역</option>";

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + _fnToNull(vResult[i]["WH_CODE"]) + "\">" + _fnToNull(vResult[i]["WH_CODE"]) + " (QTY : " + _fnToNull(vResult[i]["ITEM_QTY"])+")</option>";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

            //저장 후 데이터가 없는 경우
            if (vType == "save") {
                fnGetOrderID();
            }

            vHTML += "<option value=\"\">창고구역</option>";

            console.log("[Fail - fnMakeWareHouse] 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "<option value=\"\">창고구역</option>";

            console.log("[Error - fnMakeWareHouse" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Select_WareHouse")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeWareHouse]" + err.message);
    }
}

//Item Total 세팅
function fnSetItemTotal(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).ItemTotal;

            $("#Span_Total").text(_fnToNull(vResult[0]["CNT"]));
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
                vHTML += "   	<td style=\"display:none\"></td> "; //" + _fnToNull(vResult[i]["RCP_MNGT_NO"]) + "
                vHTML += "   	<td style=\"display:none\"></td> "; //" + _fnToNull(vResult[i]["RCP_BOX_ID"]) + "
                vHTML += "   	<td style=\"display:none\"></td> "; //" + _fnToNull(vResult[i]["RCP_ITEM_SEQ"]) + "
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ART_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["STORAGE_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_ID"]) + "</td> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"EAN\">" + _fnToNull(vResult[i]["EAN_CD"]) + "</td> ";
                vHTML += "   	<td class=\"BAT\"></td> ";
                vHTML += "   	<td class=\"location\">" + _fnToNull(vResult[i]["LOC_CD"]) + "</td> ";
                vHTML += "   	<td class=\"PJ_ART_CD\">" + _fnToNull(vResult[i]["PJ_ART_CD"]) + "</td> ";
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