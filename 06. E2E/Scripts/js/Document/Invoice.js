////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var _vInvNO = ""; //현재 레이어에 있는 invoice
var _vHblNo = ""; //현재 레이어에 있는 HBL
var _vPage = 0;
var _isSearch = false;
var _OrderBy = "";
var _Sort = "";

////////////////////jquery event///////////////////////
$(function () {   

    $("#input_ETD").val(_fnPlusDate(0)); 	
    $("#input_ETA").val(_fnPlusDate(7)); 	        

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }

    //Invoice 번호가 있으면 Invoice 검색
    if (_fnToNull($("#View_INV_NO").val()) != "") {
        fnInvSingleSearch(_fnToNull($("#View_INV_NO").val()));
    }
});

//출발지 - 즐겨찾기 아이콘 클릭 시 보여주기
$(document).on("click", "#btn_QuickPolMenu", function () {
    if ($("input[name='transfer']:checked").val() == "SEA") {
        selectPopOpen('#select_SEA_pop01');
    }
    else if ($("input[name='transfer']:checked").val() == "AIR") {
        selectPopOpen('#select_AIR_pop01');
    }
});

//도착지 - 즐겨찾기 아이콘 클릭 시 보여주기
$(document).on("click", "#btn_QuickPodMenu", function () {
    if ($("input[name='transfer']:checked").val() == "SEA") {
        selectPopOpen('#select_SEA_pop02');
    }
    else if ($("input[name='transfer']:checked").val() == "AIR") {
        selectPopOpen('#select_AIR_pop02');
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_ETD", function () {
    var vValue = $("#input_ETD").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val("");
        $(this).focus();
    }

    //날짜 벨리데이션 체크$
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETD가 ETA 보다 빠를 수 없습니다. ");
        $("#input_ETD").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_ETA", function () {
    var vValue = $("#input_ETA").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val("");
        $(this).focus();
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETA가 ETD 보다 빠를 수 없습니다. ");
        $("#input_ETA").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
    }
});

//해운 , 항공 클릭 이벤트
$(document).on("click", "input[name='transfer']", function () {

    $("#input_Departure").val('');
    $("#input_POL").val('');
    $("#input_Arrival").val('');
    $("#input_POD").val('');
    $("#Select_Invoice_bound option").eq(0).prop("selected", true);
    $("#Select_Invoice_ETD_ETA option").eq(0).prop("selected", true);
    $("#input_Invoice_HouseBL").val("");
    $(".delete").hide();
    $("#input_ETD").val(_fnPlusDate(0));
    $("#input_ETA").val(_fnPlusDate(7));

    if ($(this).val() == "SEA")
    {
        $("#Table_th_BL").text("House B/L");
        _vREQ_SVC = "SEA";
    }
    else if ($(this).val() == "AIR")
    {
        $("#Table_th_BL").text("HAWB");
        _vREQ_SVC = "AIR";
    }

    //화면초기화
    $("#Invoice_Result_AREA").empty();
    $("#invoice_no_data")[0].innerHTML = "<span>원하시는 <strong>정보를 검색 해 주세요.</strong></span>";
    $("#invoice_no_data").show();
});

//수출 수입 클릭 시 변경
$(document).on("change", "#Select_Invoice_bound", function () {
    if ($(this).find("option:selected").val() == "E") {
        $("#Table_th_Bound").text("Export");
    }
    else if ($(this).find("option:selected").val() == "I") {
        $("#Table_th_Bound").text("Import");
    }
});

//Departure 클릭 이벤트
$(document).on("click", "#input_Departure", function () {

    if ($(this).val().length == 0) {

        if (_vREQ_SVC == "SEA") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop01");
        }
        else if (_vREQ_SVC == "AIR") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_AIR_pop01");
        }
    }
});

//Departure 클릭 이벤트
$(document).on("click", "#input_Arrival", function () {

    if ($(this).val().length == 0) {

        if (_vREQ_SVC == "SEA") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop02");
        }
        else if (_vREQ_SVC == "AIR") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_AIR_pop02");
        }
    }
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_SEA_pop02");
    }
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD2 button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_SEA_pop02");
    }
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_SEA_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD2 button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_SEA_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_AIR_pop02");
    }
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD2 button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_AIR_pop02");
    }
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_AIR_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD2 button", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_AIR_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});

//자동완성 기능 - POL
$(document).on("keyup", "#input_Departure", function () {

    var vPort = "";

    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POL").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("#select_SEA_pop01").hide();
        $("#select_AIR_pop01").hide();
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop01").hide();
        $("#select_AIR_pop01").hide();
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_Departure_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetPortData($("#input_Departure").val().toUpperCase());
            if (result != undefined) {
                result = JSON.parse(result).Table
                response(
                    $.map(result, function (item) {
                        return {
                            label: item.NAME,
                            value: item.NAME,
                            code: item.CODE
                        }
                    })
                );
            }
        },
        delay: 150,
        select: function (event, ui) {
            if (ui.item.value.indexOf('데이터') == -1) {
                $("#input_Departure").val(ui.item.value);
                $("#input_POL").val(ui.item.code);
                vPort = ui.item.code;
            } else {
                ui.item.value = "";
            }
        },
        focus: function (event, ui) {
            return false;
        },
        close: function () {
            //반대로 결과값이 나와야 하기 때문에 !로 변경
            if (!_fnCheckSamePort(vPort, "", "POL", "A", "")) {
                $("#input_Departure").val("");
                $("#input_POL").val("");
            }
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//자동완성 기능 - POD
$(document).on("keyup", "#input_Arrival", function () {

    var vPort = "";

    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("#select_SEA_pop02").hide();
        $("#select_AIR_pop02").hide();
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop02").hide();
        $("#select_AIR_pop02").hide();
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_Arrival_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetPortData($("#input_Arrival").val().toUpperCase());
            if (result != undefined) {
                result = JSON.parse(result).Table
                response(
                    $.map(result, function (item) {
                        return {
                            label: item.NAME,
                            value: item.NAME,
                            code: item.CODE
                        }
                    })
                );
            }
        },
        delay: 150,
        select: function (event, ui) {
            if (ui.item.value.indexOf('데이터') == -1) {
                $("#input_Arrival").val(ui.item.value);
                $("#input_POD").val(ui.item.code);
                vPort = ui.item.code;
            } else {
                ui.item.value = "";
            }
        },
        focus: function (event, ui) {
            return false;
        },
        close: function (event, ui) {
            //반대로 결과값이 나와야 하기 때문에 !로 변경
            if (!_fnCheckSamePort(vPort, "", "POD", "A", "")) {
                $("#input_Arrival").val("");
                $("#input_POD").val("");
            }
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});


//sort 기능
$(document).on("click", "table[name='Invoice_Table_List'] th", function () {

    if ($(this).find("button").length > 0) {
        if (_isSearch) {
            var vValue = "";

            if ($(this).find("button").hasClass("asc")) {
                vValue = "desc";
            }
            else if ($(this).find("button").hasClass("desc")) {
                vValue = "asc";
            } else {
                vValue = "desc";
            }

            //초기화
            $("table[name='Invoice_Table_List'] th button").removeClass();
            $(this).find("button").addClass(vValue);

            _OrderBy = $(this).find("button").val();
            _Sort = vValue.toUpperCase();
            _vPage = 0;
            fnInvoiceSearch();
        }
    }
});

//invoice 검색 버튼 이벤트
$(document).on("click", "button[name='Search_invoice']", function () {

    _OrderBy = "";
    _Sort = "";
    _vPage = 0;
    fnInvoiceSearch();
});

//invoice 더보기 버튼 이벤트
$(document).on("click", "#Btn_InvoiceMore button", function () {
    fnInvoiceSearch();
});

//invoice 출력 버튼 이벤트
$(document).on("click", ".layer_invoice_btn", function () {

    //인보이스로 데이터를 가져와서 iframe 해두기
    _vInvNO = $(this).siblings("input[name='INV_NO']").val();
    _vHblNo = $(this).siblings("input[name='HBL_NO']").val();
    fnInvPrint($(this).siblings("input[name='HBL_NO']").val());

});

//레이어 팝업 - 수정요청사항 저장 버튼
$(document).on("click", "#layer_Request_btn", function () {

    if ($("#layer_Request_area").val().length > 0) {
        fnInvRequestConfirm("수정요청 하시겠습니까?");
    }
    else {
        _fnLayerAlertMsg("수정요청 사항 내용을 입력 해 주세요.");
    }     
});

//확인 창 확인 시 수정요청사항 저장
$(document).on("click", "#Inv_List_Confirm_confirm", function () {
    fnSaveInvRequest();
    layerClose("#Inv_List_Confirm");
});

//확인 레이어 팝업 끄기
$(document).on("click", "#Inv_List_Confirm_cencel", function () {
    layerClose("#Inv_List_Confirm");
});

////////////////////////function///////////////////////
//port 정보 가져오는 함수
function fnGetPortData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        if (_vREQ_SVC == "SEA") {
            objJsonData.LOC_TYPE = "S";
        }
        else if (_vREQ_SVC == "AIR") {
            objJsonData.LOC_TYPE = "A";
        }
        
        objJsonData.LOC_CD = vValue;

        $.ajax({
            type: "POST",
            url: "/Common/fnGetPort",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                rtnJson = result;
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

        return rtnJson;
    } catch (e) {
        console.log(e.message);
    }
}

//단일 인보이스 검색
function fnInvSingleSearch(vMngtNO) {
    try {

        var objJsonData = new Object();

        objJsonData.MNGT_NO = _fnToNull(vMngtNO);
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();
        objJsonData.USER_TYPE = $("#Session_USR_TYPE").val();
        objJsonData.AUTH_KEY = $("#Session_AUTH_KEY").val();
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.PAGE = 1;

        $.ajax({
            type: "POST",
            url: "/Document/fnGetInvData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                $("#invoice_no_data").hide();
                fnMakeInvList(result);
                fnSetSearchData(result);
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
        console.log(err)
    }
}


//인보이스 검색
function fnInvoiceSearch() {

    try {

        if (fnInvoiceValidation()) {
            var objJsonData = new Object();

            objJsonData.MNGT_NO = "";
            objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
            objJsonData.CUST_CD = $("#Session_CUST_CD").val();
            objJsonData.AUTH_KEY = $("#Session_AUTH_KEY").val();
            objJsonData.USER_TYPE = $("#Session_USR_TYPE").val();

            objJsonData.REQ_SVC = $("input[name='transfer']:checked").val();
            objJsonData.EX_IM_TYPE = $("#Select_Invoice_bound option:selected").val();
            objJsonData.ETD_ETA = $("#Select_Invoice_ETD_ETA option:selected").val();
            objJsonData.STRT_YMD = $("#input_ETD").val().substring(0, 10).replace(/-/gi, "");
            objJsonData.END_YMD = $("#input_ETA").val().substring(0, 10).replace(/-/gi, "");
            objJsonData.POL = _fnToNull($("#input_Departure").val());
            objJsonData.POL_CD = _fnToNull($("#input_POL").val());
            objJsonData.POD = _fnToNull($("#input_Arrival").val());
            objJsonData.POD_CD = _fnToNull($("#input_POD").val());
            objJsonData.HBL_NO = $("#input_Invoice_HouseBL").val();

            if (_vPage == 0) {
                objJsonData.PAGE = 1;
            } else {
                objJsonData.PAGE = _vPage;
            }

            _vPage++;

            if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
                objJsonData.ID = _OrderBy;
                objJsonData.ORDER = _Sort;
            } else {
                objJsonData.ID = "";
                objJsonData.ORDER = "";
            }

            $.ajax({
                type: "POST",
                url: "/Document/fnGetInvData",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#invoice_no_data").hide();
                    fnMakeInvList(result);
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

    }
    catch (err) {
        console.log(err)
    }
}

//Invoice 벨리데이션
function fnInvoiceValidation() {

    //ETD를 입력 해 주세요.
    if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
        $("table[name='Invoice_Table_List'] th button").removeClass();
        _fnAlertMsg("ETD를 입력 해 주세요. ","input_ETD");
        $("#input_ETD").focus();
        return false;
    }

    //ETA를 입력 해 주세요.
    if (_fnToNull($("#input_ETA").val().replace(/-/gi, "")) == "") {
        $("table[name='Invoice_Table_List'] th button").removeClass();
        _fnAlertMsg("ETA를 입력 해 주세요. ","input_ETA");
        $("#input_ETA").focus();
        return false;
    }    

    return true;
}

//Invoice 출력 함수
function fnInvPrint(vHBL) {

    try {       

        var vResult;
        vResult = fnGetInvPrintData(vHBL); //데이터 가져오기

        if (JSON.parse(vResult).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vResult).Invoice[0];

            var objJsonData = new Object();

            objJsonData.FILE_NM = vResult.FILE_NM;
            objJsonData.MNGT_NO = vResult.MNGT_NO;                //부킹 번호
            objJsonData.INS_USR = $("#Session_LOC_NM").val();     //부킹 번호
            objJsonData.DOMAIN = $("#Session_DOMAIN").val();      //접속 User
            objJsonData.SEQ = vResult.SEQ;
            
            $.ajax({
                type: "POST",
                url: "/HP_File/DownloadElvis",
                async: false,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result, status, xhr) {

                    if (result != "E") {
                        var rtnTbl = JSON.parse(result);
                        rtnTbl = rtnTbl.Path;
                        var file_nm = rtnTbl[0].FILE_NAME;
                        if (_fnToNull(rtnTbl) != "") {
                            var agent = navigator.userAgent.toLowerCase();
                            if (file_nm.substring(file_nm.length, file_nm.length - 4) == ".pdf" || file_nm.substring(file_nm.length, file_nm.length - 4) == ".PDF") {
                                if (agent.indexOf('trident') > -1) {
                                    window.location = "/HP_File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                                } else {
                                    $("#pdfIframe").attr("src", "/web/viewer.html?file=/Content/TempFiles/" + file_nm);
                                    layerPopup2('#Invoice_pop');
                                    fnGetInvRequest();                                    
                                }
                            } else {
                                window.location = "/HP_File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                            }

                        }
                    } else {
                        _fnAlertMsg("다운받을 수 없는 출력물입니다");
                    }
                },
                error: function (xhr, status, error) {
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                    return;
                }
            });
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("다운받을 수 없는 출력물입니다");
            console.log("[Fail]fnGetInvPrintData" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("다운받을 수 없는 출력물입니다");
            console.log("[Error]fnGetInvPrintData" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }

    } catch (err) {
        console.log("[Error]fnInvPrint" + err);
    }
}

//Invoice 출력 함수 데이터 가져오기
function fnGetInvPrintData(vHBL) {

    try
    {
        var vResult;

        var objJsonData = new Object();
        objJsonData.HBL_NO = vHBL;
        objJsonData.DOC_TYPE = "INV";

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Document/fnGetInvPrint",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                vResult = result;
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });

        return vResult;
    }
    catch (err)
    {
        console.log("[Error]fnGetInvPrintData" + err);
    }
}

//Invoice 출력 - 수정요청사항 데이터 가져오기
function fnGetInvRequest() {
    try {
        var vResult;

        var objJsonData = new Object();
        objJsonData.INV_NO = _vInvNO;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Document/fnSearchInvRequest",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                fnMakeInvRequest(result);
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

//Invoice 출력 - 수정요청사항 데이터  저장하기
function fnSaveInvRequest() {
    try {
        var vResult;

        var objJsonData = new Object();
        objJsonData.INV_NO = _vInvNO;
        objJsonData.HBL_NO = _vHblNo;
        //objJsonData.RMK = $("#layer_Request_disabled").val() + $("#layer_Request_area").val();
        //objJsonData.RMK = $("#layer_Request_area").val().replace(/'/gi, "`").replace(/\[/gi, "{").replace(/\]/gi, "}"); //twkim 대괄호가 JSON 형식으로 보낼때 꼬여서 됨.
        objJsonData.RMK = $("#layer_Request_disabled").val() + $("#layer_Request_area").val();
        objJsonData.RMK = objJsonData.RMK.replace(/'/gi, "`").replace(/\[/gi, "{").replace(/\]/gi, "}"); //twkim 대괄호가 JSON 형식으로 보낼때 꼬여서 됨.
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();
        objJsonData.LOC_NM = $("#Session_LOC_NM").val(); 
        objJsonData.USR_ID = $("#Session_USR_ID").val();
        objJsonData.REQ_SVC = _vREQ_SVC;
        objJsonData.EMAIL = $("#Session_EMAIL").val();

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Document/fnSaveInvRequest",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                $("#layer_Request_area").val("");
                $("#layer_Request_area").text("");
                fnMakeInvRequest(result);

                //엘비스 알림 설정 (푸쉬)
                var pushObj = new Object();
                pushObj.JOB_TYPE = "INV";
                pushObj.MSG = "수정 요청사항 확인해주세요.";
                pushObj.REF1 = _vInvNO;
                pushObj.REF2 = "";
                pushObj.REF3 = "";
                pushObj.REF4 = "";
                pushObj.REF5 = _vREQ_SVC;
                pushObj.USR_ID = $("#Session_EMAIL").val();
                
                Chathub_Push_Message(pushObj);        
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

//B/L 바로 검색 후 검색 조건 데이터 채우기
function fnSetSearchData(vJsonData) {
    if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {

        if (_fnToNull(JSON.parse(vJsonData).Invoice[0]["REQ_SVC"]) == "SEA") {
            $("input:radio[name='transfer']:input[value='SEA']").prop('checked', true);
            $("#Table_th_BL").text("House B/L");
            _vREQ_SVC = "SEA";
        } else if (_fnToNull(JSON.parse(vJsonData).Invoice[0]["REQ_SVC"]) == "AIR") {
            $("input:radio[name='transfer']:input[value='AIR']").prop('checked', true);
            $("#Table_th_BL").text("HAWB");
            _vREQ_SVC = "AIR";
        }

        if (_fnToNull(JSON.parse(vJsonData).Invoice[0]["EX_IM_TYPE"]) == "수출") {
            $("#Select_Invoice_bound").val("E").prop('checked', true);
        }
        else if (_fnToNull(JSON.parse(vJsonData).Invoice[0]["EX_IM_TYPE"]) == "수입") {
            $("#Select_Invoice_bound").val("I").prop('checked', true);
        }

        $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).Invoice[0]["ETD"].replace(/\./gi, "")))); 
        if (_fnToNull(JSON.parse(vJsonData).Invoice[0]["ETA"]) != "") {
            $("#input_ETA").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).Invoice[0]["ETA"].replace(/\./gi, "")))); //ETA
        }

        $("#input_Departure").val(_fnToNull(JSON.parse(vJsonData).Invoice[0]["POL_NM"])); 
        $("#input_POL").val(_fnToNull(JSON.parse(vJsonData).Invoice[0]["POL_CD"])); 
        $("#input_Arrival").val(_fnToNull(JSON.parse(vJsonData).Invoice[0]["POD_NM"])); 
        $("#input_POD").val(_fnToNull(JSON.parse(vJsonData).Invoice[0]["POD_CD"])); 

        $("#input_Invoice_HouseBL").val(_fnToNull(JSON.parse(vJsonData).Invoice[0]["HBL_NO"]));

        $("#AC_Departure_Width .delete").show();
        $("#AC_Arrival_Width .delete").show();
    }
}

//수정요청사항 레이어 팝업 켜기
function fnInvRequestConfirm(msg) {
    $("#Inv_List_Confirm .inner").html(msg);
    layerPopup2('#Inv_List_Confirm');
    $("#Inv_List_Confirm_confirm").focus();
}

/////////////////function MakeList/////////////////////
//Invoice 결과 리스트 데이터 그려주기
function fnMakeInvList(vJsonData) {

    try {
        var vHTML = "";

        if (_vPage == 1) {
            $("#Invoice_Result_AREA").eq(0).empty();
        }

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).Invoice;
            var vMorePage = true;

            if (vResult.length > 0) {
                $.each(vResult, function (i) {
                    vHTML += "   <tr data-row=\"row_1\"> ";

                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "수입") {
                        vHTML += "   	<td><span class=\"trade import ship\">Import</span></td> ";
                    } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "수출") {
                        vHTML += "   	<td><span class=\"trade export ship\">Export</span></td> ";
                    }

                    vHTML += "   	<td>" + _fnToNull(vResult[i]["HBL_NO"])+"</td> ";
                    vHTML += "   	<td>KRW " + _fnToNull(vResult[i]["FARE_TOT_AMT"]) + "</td> ";

                    vHTML += "   	<td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                    if (_fnToNull(vResult[i]["ETA"]) != "") {
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                    } else {
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br /> -</td> ";
                    }
                    vHTML += "   	<td>" + _fnToNull(vResult[i]["ONBD_YMD"])+"</td> ";
                    vHTML += "   	<td>" + _fnToNull(vResult[i]["INV_YMD"]) + "</td> ";
                    vHTML += "   	<td>" + _fnToNull(vResult[i]["INV_NO"]) + "</td> ";
                    vHTML += "   	<td class=\"btns_w1\"> ";
                    vHTML += "   		<div class=\"btn_padding\"> ";
                    vHTML += "   			<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue layer_invoice_btn\">Invoice 출력</a> ";
                    vHTML += "              <input type='hidden' name=\"HBL_NO\" value='" + _fnToNull(vResult[i]["HBL_NO"]) + "' />";
                    vHTML += "              <input type='hidden' name=\"INV_NO\" value='" + _fnToNull(vResult[i]["INV_NO"]) + "' />";
                    vHTML += "   		</div> ";
                    vHTML += "   	</td> ";
                    vHTML += "   	<td class=\"mobile_layout\"> ";
                    vHTML += "   		<div class=\"layout_type2\"> ";
                    vHTML += "   			<div class=\"row s4\"> ";

                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "수입") {
                        vHTML += "   				<div class=\"col\"><span class=\"trade import ship\">Import</span></div> ";
                    } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "수출") {
                        vHTML += "   				<div class=\"col\"><span class=\"trade export ship\">Export</span></div> ";
                    }

                    vHTML += "   				<div class=\"col\">" + _fnToNull(vResult[i]["HBL_NO"]) +"</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"row s3\"> ";
                    vHTML += "   				<table> ";
                    vHTML += "   					<tbody> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Total Amount</th> ";
                    vHTML += "   							<td>KRW " + _fnToNull(vResult[i]["FARE_TOT_AMT"]) + "</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Departure</th> ";
                    vHTML += "   	                        <td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Arrival</th> ";
                    if (_fnToNull(vResult[i]["ETA"]) != "") {
                        vHTML += "   	                        <td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                    }
                    else {
                        vHTML += "   	                        <td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />-</td> ";
                    }
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>On Board</th> ";
                    vHTML += "   	                        <td>" + _fnToNull(vResult[i]["ONBD_YMD"]) + "</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Invoice Date</th> ";
                    vHTML += "   	                        <td>" + _fnToNull(vResult[i]["INV_YMD"]) + "</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Invoice</th> ";
                    vHTML += "   	                        <td>" + _fnToNull(vResult[i]["INV_NO"]) + "</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<td colspan=\"2\"> ";
                    vHTML += "   								<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue layer_invoice_btn\" onclick=\"\">Invoice 출력</a> ";
                    vHTML += "                                  <input type='hidden' name=\"HBL_NO\" value='" + _fnToNull(vResult[i]["HBL_NO"]) + "' />";
                    vHTML += "                                  <input type='hidden' name=\"INV_NO\" value='" + _fnToNull(vResult[i]["INV_NO"]) + "' />";
                    vHTML += "   							</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   					</tbody> ";
                    vHTML += "   				</table> ";
                    vHTML += "   			</div> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</td> ";
                    vHTML += "   </tr> ";

                    //더보기 체크 RNUM == TOTCNT
                    if (_fnToNull(vResult[i]["RNUM"]) == _fnToNull(vResult[i]["TOTCNT"])) {
                        vMorePage = false;
                    } else {
                        vMorePage = true;
                    }
                });

                //더보기 영역
                if (vMorePage) {
                    $("#Btn_InvoiceMore").show();
                } else {
                    $("#Btn_InvoiceMore").hide();
                }
            } else {
                vHTML += " <span>데이터가 없습니다.</span> ";
                $("#invoice_no_data")[0].innerHTML = vHTML;
                vHTML = "";
                $("#invoice_no_data").show();
                $("#Btn_InvoiceMore").hide();
            }

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            vHTML += " <span>데이터가 없습니다.</span> ";
            $("#invoice_no_data")[0].innerHTML = vHTML;
            vHTML = "";
            $("#invoice_no_data").show();
            $("#Btn_InvoiceMore").hide();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            vHTML += " <span>데이터가 없습니다.</span> ";
            $("#invoice_no_data")[0].innerHTML = vHTML;
            vHTML = "";
            $("#invoice_no_data").show();
            $("#Btn_InvoiceMore").hide();
        }

        $("#Invoice_Result_AREA").eq(0).append(vHTML);
        $("#Invoice_Result_AREA").show();
    }
    catch (err) {
        console.log(err);
    }
}

//수정 요청사항 데이터 그려주기
function fnMakeInvRequest(vJsonData) {

    var vHTML = "";

    if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
        var vResult = JSON.parse(vJsonData).Request;

        //$.each(vResult, function (i) {
        //    //vHTML += (i+1) + "차 요청 사항입니다.\n";
        //    vHTML += "[";
        //    vHTML += _fnFormatDate(_fnToNull(vResult[i]["INS_YMD"]));
        //    vHTML += " ";
        //    vHTML += _fnFormatHHMMSSTime(_fnToNull(vResult[i]["INS_HM"]));
        //    vHTML += "]\n";
        //    vHTML += _fnToNull(vResult[i]["RMK"]);
        //    if ((i + 1) != vResult.length) {
        //        vHTML += "\n\n";
        //    }
        //});

        if (vResult.length > 0) {
            vHTML += _fnToNull(vResult[0]["RMK"]);
            vHTML += "\n===============\n" + (vResult[0]["SEQ"] + 1) + "차 요청사항입니다\n";
        } else {
            vHTML += "===============\n1차 요청사항입니다\n";
        }

        $("#layer_Request_disabled").text(vHTML);           
    }
    else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
        //vHTML += "===============\n1차 요청사항입니다\n";
        vHTML += "수정요청사항을 아래 적어주세요.\n";
        $("#layer_Request_disabled").text(vHTML); 
    }
    else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
        console.log("[Error]fnMakeInvRequest :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
    }

    //스크롤 맨 아래로 내리기 - 맨 처음은 레이어 팝업이 열리지 않아서 이동하지 않는다.
    var vScrollDown = $("#layer_Request_disabled").prop('scrollHeight');
    $("#layer_Request_disabled").scrollTop(vScrollDown);

}
////////////////////////API////////////////////////////

