////////////////////전역 변수//////////////////////////
var _Store = "";
var _Location = "";
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {
    $("#page_ChangeEach").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        fnGetStore(); //Store 데이터 가져오기
    }
});

//현재 - Store Change Event 
$(document).on("change", "#Select_Now_Store", function () {
    //초기화
    $("#Input_Now_Location").val("").focus();
    $("#Input_Now_Location").siblings(".delete").hide();
    $("#Input_Now_Barcode").val("");
    $("#Input_Now_Barcode").siblings(".delete").hide();
    $("#LC_Each_Result_Area").empty();
});

//Location Scan 검색
$(document).on("keyup", "#Input_Now_Location", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        //12자리가 아닐 경우 스캔 X
        if ($(this).val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Now_Location");
        }
        else {
            fnGetLocation();
        }
    }
});

//location - 조회 버튼
$(document).on("click", "#btn_Location", function () {
    if ($("#Input_Now_Location").val().length > 0) {
        if ($("#Input_Now_Location").val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Now_Location");
        } else {
            fnGetLocation();
        }
    } else {
        _fnAlertMsg("Location를 입력 해 주세요.", "Input_Now_Location");
    }
});

//BARCODE Keyup Event (엔터키)
$(document).on("keyup", "#Input_Now_Barcode", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
        fnChkList($(this).val());
    }
});

//BARCODE - 조회 버튼
$(document).on("click", "#btn_Barcode", function () {
    if ($("#Input_Now_Barcode").val().length > 0) {
        fnChkList($("#Input_Now_Barcode").val());
    } else {
        _fnAlertMsg("BARCODE를 입력 해 주세요.", "Input_Barcode");
    }
});

//Location 변경 후 Sound 추가
$(document).on("keyup", "#Input_Change_Location", function (e) {
    if (e.keyCode == 13) {
        _SuccessSound.play();
    }
});

//Store 변경 버튼 이벤트
$(document).on("click", "#btn_Each_StoreSave", function () {
    if (_isSearch) {
        layerPopup("#StoreSave_Confirm");
    } else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Store 변경 버튼 Yes 이벤트
$(document).on("click", "#StoreSave_Confirm_Yes", function () {
    layerClose('#StoreSave_Confirm');
    fnChangeStore();
});

//저장 버튼 이벤트
$(document).on("click", "#btn_Each_LocationSave", function () {
    if (_isSearch) {

        if ($("#Input_Change_Location").val().length != 8) {
            _fnAlertMsg("Location 자리수가 8자리가 아닙니다.", "Input_Change_Location");
        } else {
            layerPopup("#ItemSave_Confirm");
        }
        
    } else {
        _fnAlertMsg("검색 먼저 해주시기 바랍니다.");
    }
});

//Store 변경 버튼 Yes 이벤트
$(document).on("click", "#ItemSave_Confirm_Yes", function () {
    layerClose('#ItemSave_Confirm');
    fnChangeLocation();    
});
////////////////////////function///////////////////////
//Store 검색
function fnGetStore() {
    try {
        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();

        $.ajax({
            type: "POST",
            url: "/T_ChangeEach/fnGetStore",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeNowStore(result);
                fnMakeAllStore(result);
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
        console.log("[Error - fnGetStore()]" + err.message);
    }
}

//Location 검색
function fnGetLocation() {
    try {

        //Stroe 선택 밸리데이션
        if (_fnToNull($("#Select_Now_Store").find("option:selected").val()) == "") {
            _fnAlertMsg("Store를 먼저 선택 해주세요.");
            return false;
        }

        if (_fnToNull($("#Input_Now_Location").val()) == "") {
            _fnAlertMsg("Location을 입력 해 주세요.", "Input_Now_Location");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.BRANCH_CD = $("#Session_BRANCH_CD").val();
        objJsonData.STORAGE_ID = $("#Select_Now_Store").find("option:selected").val();
        objJsonData.LOC_CD = $("#Input_Now_Location").val();

        $.ajax({
            type: "POST",
            url: "/T_ChangeEach/fnGetLocation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeLocationData(result);
                $("#Input_Now_Barcode").val("").focus();
                $("#Input_Now_Barcode").siblings(".delete").hide();

                //모바일일 경우 조회 후 조회가 제일 상단으로 보여지게 화면 이동
                if ($(window).width() < 1025) {
                    $('html, body').animate({ scrollTop: $("#LC_Each_Scroll").offset().top - 51 }, 350);
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
        console.log("[Error - fnGetLocation]" + err.message);
    }
}

//Barcode 세팅
function fnChkList(vBarCode) {
    try {

        var vOffset_Top = 0;
        var windowWidth = $(window).width();
        var vBoolean = false;

        $("#LC_Each_Result_Area .Barcode").filter(function (index, selector) {
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
        //if (vBoolean) {
        //    //페이지 이동
        //    if (windowWidth < 1025) {
        //        $("#LC_Each_Scroll").animate({ scrollTop: vOffset_Top }, 350);
        //    }
        //    else {
        //        $("#LC_Each_Scroll").animate({ scrollTop: vOffset_Top }, 350);
        //    }
        //}

        $("#Input_Now_Barcode").val("").focus();
        $("#Input_Now_Barcode").siblings(".delete").hide();
    }
    catch (err) {
        console.log("[Error - fnChkList]" + err.message);
    }
}

//Store 저장
function fnChangeStore() {
    try {

        if (_fnToNull($("#Select_Change_Store").find("option:selected").val()) == "") {
            _fnAlertMsg("변경 될 Store를 선택 해주세요.");
            return false;
        }

        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/T_ChangeEach/fnChangeStore",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("Store 변경이 완료 되었습니다.");

                    //모바일일 경우 조회 후 조회가 제일 상단으로 보여지게 화면 이동
                    if ($(window).width() < 1025) {
                        $('html, body').animate({ scrollTop: 0 }, 350);
                    }

                    fnInitData();
                }
                else {
                    _fnAlertMsg("Store 변경에 실패 하셨습니다.");
                    console.log("[Error - fnChangeStore]" + JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnChangeStore]" + err.message);
    }
}

//Store 저장
function fnChangeLocation() {
    try {

        if (_fnToNull($("#Input_Change_Location").val()) == "") {
            _fnAlertMsg("변경 될 Location을 입력 해주세요.");
            return false;
        }

        var vData = fnSetSaveParameter();
        if (vData == false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/T_ChangeEach/fnChangeLocation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(vData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("상품위치 변경이 완료 되었습니다.");

                    //모바일일 경우 조회 후 조회가 제일 상단으로 보여지게 화면 이동
                    if ($(window).width() < 1025) {
                        $('html, body').animate({ scrollTop: 0 }, 350);
                    }

                    fnInitData();
                }
                else {
                    _fnAlertMsg("상품위치 변경을 실패 하였습니다.");
                    console.log("[Error - fnChangeLocation]" + JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnChangeStore]" + err.message);
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
        vJsonData_MST.NOW_STORAGE_ID = _Store;
        vJsonData_MST.NOW_LOC_CD = _Location;        
        vJsonData_MST.CHANGE_STORAGE_ID = $("#Select_Change_Store").find("option:selected").val();
        vJsonData_MST.CHANGE_LOC_CD = $("#Input_Change_Location").val();
        array_mst.push(vJsonData_MST);

        $.each($("#LC_Each_Result_Area .on"), function (i) {

            var vJsonData_DTL = new Object;

            vJsonData_DTL.RCP_MNGT_NO = $(this).find("td").eq(0).text();
            vJsonData_DTL.BOX_ID = $(this).find("td").eq(1).text();
            vJsonData_DTL.ITEM_ID = $(this).find("td").eq(2).text();
            vJsonData_DTL.ITEM_SEQ = $(this).find("td").eq(3).text();            

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
        $(".delete").hide();
        fnGetStore();
        _Store = "";
        _Location = "";
        _isSearch = false;
        $("#Input_Now_Location").val("");
        $("#Input_Now_Barcode").val("");
        $("#Input_Change_Location").val("");
        $("#LC_Each_Result_Area").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//가지고 있는 Store Select List 만들기
function fnMakeNowStore(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            if (JSON.parse(vJsonData).Now_Store != undefined) {
                var vResult = JSON.parse(vJsonData).Now_Store;

                vHTML += "<option value=\"\">STORE</option>";

                $.each(vResult, function (i) {
                    vHTML += "<option value=\"" + _fnToNull(vResult[i]["CODE"]) + "\">" + _fnToNull(vResult[i]["NAME"]) + "</option>";
                });
            } else {
                vHTML += "<option value=\"\">STORE</option>";

                console.log("[Fail - fnMakeNowStore] 데이터가 없습니다.");
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "<option value=\"\">STORE</option>";

            console.log("[Fail - fnMakeNowStore] 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "<option value=\"\">STORE</option>";

            console.log("[Error - fnMakeNowStore" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Select_Now_Store")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeNowStore]" + err.message);
    }
}

//모든 Store Select List 만들기
function fnMakeAllStore(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Total_Store;

            vHTML += "<option value=\"\">STORE</option>";

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + _fnToNull(vResult[i]["CODE"]) + "\">" + _fnToNull(vResult[i]["NAME"]) + "</option>";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "<option value=\"\">STORE</option>";

            console.log("[Fail - fnMakeAllStore] 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "<option value=\"\">STORE</option>";

            console.log("[Error - fnMakeAllStore" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Select_Change_Store")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeAllStore]" + err.message);
    }
}

//Location Search Data 보여주기
function fnMakeLocationData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
                        
            var vResult = JSON.parse(vJsonData).Location;
            _Store = $("#Select_Now_Store").find("option:selected").val();
            _Location = $("#Input_Now_Location").val();
            _isSearch = true;

            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["RCP_MNGT_NO"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["BOX_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_ID"]) + "</td> ";
                vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["ITEM_SEQ"]) + "</td> ";
                vHTML += "   	<td class=\"No\">" + _fnToNull(vResult[i]["ROWNUM"]) + "</td> ";
                vHTML += "   	<td class=\"Barcode\">" + _fnToNull(vResult[i]["BARCODE"]) + "</td> ";
                vHTML += "   	<td>" + _fnToNull(vResult[i]["ART_ID"]) + "</td> ";
                vHTML += "   </tr> ";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _Store = "";
            _Location = "";
            _isSearch = false;

            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _Store = "";
            _Location = "";
            _isSearch = false;

            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"3\" style=\"text-align:center;\">관리자에게 문의하세요.</td> ";
            vHTML += "   </tr> ";

            console.log(JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#LC_Each_Result_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        _Store = "";
        _Location = "";
        _isSearch = false;
        console.log("[Error - fnMakeLocationData]" + err.message);
    }
}
////////////////////////API////////////////////////////