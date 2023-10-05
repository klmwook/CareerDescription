////////////////////전역 변수//////////////////////////
var _Store = "";
var _Location = "";
var _isSearch = false;
////////////////////jquery event///////////////////////
$(function () {

    $("#page_ChangeAll").addClass("on");

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        fnGetStore(); //Store 데이터 가져오기
    }
});

//Store 선택 이벤트
$(document).on("change", "#Select_Now_Store", function () {

    _Location = "";
    _isSearch = false;
    $("#Span_Total").text("0");
    $("#Input_Now_Location").val("").focus();
    $("#Input_Now_Location").siblings(".delete").hide();
});

//Location Scan 검색
$(document).on("keyup", "#Input_Now_Location", function (e) {
    if (e.keyCode == 13) {
        fnGetLocation();
    }
});

//Store 변경 버튼 이벤트
$(document).on("click", "#btn_ALL_StoreSave", function () {

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


//Store 변경 버튼 이벤트
$(document).on("click", "#btn_ALL_LocationSave", function () {

    if (_isSearch) {
        layerPopup("#ItemSave_Confirm");
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
            url: "/T_ChangeAll/fnGetStore",
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
            _fnAlertMsg("Location을 입력 해 주세요.","Input_Now_Location");
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
            url: "/T_ChangeAll/fnGetLocation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //결과 값 확인
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _Store = objJsonData.STORAGE_ID;
                    _Location = objJsonData.LOC_CD;
                    _isSearch = true;
                    $("#Span_Total").text(JSON.parse(result).Location[0]["COUNT"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("데이터가 없습니다.");
                    _isSearch = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnGetLocation]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _isSearch = false;
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

//Store 변경 함수
function fnChangeStore() {
    try {

        if (_fnToNull($("#Select_Change_Store").find("option:selected").val()) == "") {
            _fnAlertMsg("Store를 먼저 선택 해주세요.");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.CHANGE_STORAGE_ID = $("#Select_Change_Store").find("option:selected").val();
        objJsonData.NOW_STORAGE_ID = _Store;
        objJsonData.NOW_LOC_CD = _Location;

        $.ajax({
            type: "POST",
            url: "/T_ChangeAll/fnChangeStore",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //결과 값 확인
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("Store 변경이 완료 되었습니다.");
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

//상품위치 변경
function fnChangeLocation() {
    try {

        if (_fnToNull($("#Input_Change_Location").val()) == "") {
            _fnAlertMsg("Location을 입력 해 주세요.", "Input_Change_Location");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DB_TYPE = $("#Session_DB_TYPE").val();
        objJsonData.CHANGE_LOC_CD = $("#Input_Change_Location").val();
        objJsonData.NOW_STORAGE_ID = _Store;
        objJsonData.NOW_LOC_CD = _Location;

        $.ajax({
            type: "POST",
            url: "/T_ChangeAll/fnChangeLocation",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //결과 값 확인
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _fnAlertMsg("상품위치 변경이 완료 되었습니다.");
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
        console.log("[Error - fnChangeLocation]" + err.message);
    }
}

//데이터 초기화
function fnInitData() {
    try {
        $(".delete").hide();
        fnGetStore();
        _Store = "";
        _Location = "";
        _isSearch = false;
        $("#Input_Now_Location").val("");
        $("#Input_Change_Location").val("");
        $("#Span_Total").text("0");
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}
/////////////////function MakeList/////////////////////
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


////////////////////////API////////////////////////////