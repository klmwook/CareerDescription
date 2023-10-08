////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var _vPage = 0;
var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
var _objData = new Object();
var filterChk = false;


////////////////////jquery event///////////////////////
$(function () {

    //뒤로가기 이벤트
    if (event.persisted || (window.performance && window.performance.navigation.type == 2) || event.originalEvent && event.originalEvent.persisted) {
        if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "BOOKING_BKG") {

            $("input[name='transfer_TYPE']").val(_fnToNull(sessionStorage.getItem("REQ_SVC"))).prop('checked', true);
            $("#Select_BK_ETD_ETA").val(_fnToNull(sessionStorage.getItem("BK_ETD_ETA"))).prop('checked', true);
            $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));
            $("#input_ETA").val(_fnToNull(sessionStorage.getItem("ETA")));
            $("#select_BkgDetail_Status").val(_fnToNull(sessionStorage.getItem("STATUS"))).prop('checked', true);
            $("#input_POL").val(_fnToNull(sessionStorage.getItem("POL_CD")));
            $("#input_POD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
            $("#input_Departure").val(_fnToNull(sessionStorage.getItem("POL_NM")));
            $("#input_Arrival").val(_fnToNull(sessionStorage.getItem("POD_NM")));
            $("#select_BKDetail_BkgNo").val(_fnToNull(sessionStorage.getItem("BKG_NO")));
            sessionStorage.clear();

            //검색
            $("#btn_BkList_Search").click();
        } else if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "BOOKING_BL") {
            $("input[name='transfer_TYPE']").val(_fnToNull(sessionStorage.getItem("REQ_SVC"))).prop('checked', true);
            $("#Select_BK_ETD_ETA").val(_fnToNull(sessionStorage.getItem("BK_ETD_ETA"))).prop('checked', true);
            $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));
            $("#input_ETA").val(_fnToNull(sessionStorage.getItem("ETA")));
            $("#select_BkgDetail_Status").val(_fnToNull(sessionStorage.getItem("STATUS"))).prop('checked', true);
            $("#input_POL").val(_fnToNull(sessionStorage.getItem("POL_CD")));
            $("#input_POD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
            $("#input_Departure").val(_fnToNull(sessionStorage.getItem("POL_NM")));
            $("#input_Arrival").val(_fnToNull(sessionStorage.getItem("POD_NM")));
            $("#select_BKDetail_BkgNo").val(_fnToNull(sessionStorage.getItem("BKG_NO")));
            sessionStorage.clear();

            //검색
            $("#btn_BkList_Search").click();
        }
    }

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }

    $("#input_ETD").val(_fnPlusDate(0)); //ETD	
    $("#input_ETA").val(_fnPlusDate(7)); //ETA	
    
    //부킹 번호 있으면 조회
    if (_fnToNull($("#REG_BKG_NO").val()) != "") {
        //부킹 번호 있으면 조회
        fnSearchSingleBkg(_fnToNull($("#REG_BKG_NO").val()));
    }
    else if (_fnToNull($("#View_BKG_NO").val()) != "") {
        //부킹 번호 있으면 조회
        if (_fnToNull(sessionStorage.getItem("ETD")) != "") {
            $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));
            $("#input_ETA").val(_fnToNull(sessionStorage.getItem("ETA")));
            $("#Select_BK_ETD_ETA").val(_fnToNull(sessionStorage.getItem("BK_ETD_ETA"))).prop('checked', true);
            sessionStorage.clear();
        }
        fnSearchBkgList();
    }

    //부킹 STATUS 공통 코드에서 가져오는 함수
    fnGetBookingStatus();
});

$("#select_BkgDetail_Status").change(function (e) {
    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

$("#select_BKDetail_BkgNo").keyup(function (e) {
    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 0;
        fnSearchBkgList();
    }
});


//라디오 버튼 이벤트 (선사 , 항공)
$(document).on("click", "input[name='transfer_TYPE']", function () {

    $("#input_Departure").val("");
    $("#input_POL").val("");
    $("#input_Arrival").val("");
    $("#input_POD").val("");
    $("#input_ETD").val(_fnPlusDate(0));
    $("#input_ETA").val(_fnPlusDate(7));
    $("#Select_BK_ETD_ETA option").eq(0).prop("selected", true);
    $("#select_BkgDetail_Status option").eq(0).prop("selected", true);
    $("#select_BKDetail_BkgNo").val("");
    $(".delete").hide();

    if ($(this).val() == "SEA") {
        _vREQ_SVC = "SEA";
        $("#Table_th_VSL").text("Vessel");
    }    
    else if ($(this).val() == "AIR") {
        _vREQ_SVC = "AIR";
        $("#Table_th_VSL").text("Flight No");
    }

    //화면 초기화
    $("#BK_Result_AREA").empty();
    $("#NoData_BK")[0].innerHTML = "<span>원하시는 <strong>정보를 검색 해 주세요.</strong></span>";
    $("#NoData_BK").show();

    $("#BK_Search_detail").hide();
    $("#carrier_menu").prop("checked", false);
});

//출발지 - 즐겨찾기 아이콘 클릭 시 보여주기
$(document).on("click", "#btn_QuickPolMenu", function () {
    if ($("input[name='transfer_TYPE']:checked").val() == "SEA") {
        selectPopOpen('#select_SEA_pop01');
    }
    else if ($("input[name='transfer_TYPE']:checked").val() == "AIR") {
        selectPopOpen('#select_AIR_pop01');
    }
});

//도착지 - 즐겨찾기 아이콘 클릭 시 보여주기
$(document).on("click", "#btn_QuickPodMenu", function () {
    if ($("input[name='transfer_TYPE']:checked").val() == "SEA") {
        selectPopOpen('#select_SEA_pop02');
    }
    else if ($("input[name='transfer_TYPE']:checked").val() == "AIR") {
        selectPopOpen('#select_AIR_pop02');
    }
});

//부킹 상세조회 show hide 확인
$(document).on("click", "#carrier_menu", function () {
    if ($(this).prop("checked") == true) {
        $("#BK_Search_detail").hide();
        $("#BK_Search_detail").eq(0).show();
    }
    else {
        $("#BK_Search_detail").hide();
    };
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

    //날짜 벨리데이션 체크
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

//Arrival 클릭 이벤트
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
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_SEA_pop02");
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD2 button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_SEA_pop01").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_SEA_pop02");
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_SEA_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD2 button", function () {
        
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_SEA_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD button", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_AIR_pop02");
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();

});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD2 button", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

        selectPopOpen("#select_AIR_pop02");
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD button", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_AIR_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD2 button", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();
    filterChk = true;

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_AIR_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    filterChk = true;
    _vPage = 0;
    fnSearchBkgList();
});

//자동완성 기능 - POL
$(document).on("keyup", "#input_Departure", function (e) {

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
    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 0;
        fnSearchBkgList();
    }

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

    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 0;
        fnSearchBkgList();
    }


});

//검색 버튼 이벤트
$(document).on("click", "#btn_BkList_Search", function () {
    _vPage = 0;
    fnSearchBkgList();
});

//더보기 버튼 클릭 이벤트
$(document).on("click", "#Btn_BKMore button", function () {
    fnSearchBkgList();
});

//sort 기능
$(document).on("click", "table[name='BK_Table_List'] th", function () {

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
            $("table[name='BK_Table_List'] th button").removeClass();
            $(this).find("button").addClass(vValue);

            _OrderBy = $(this).find("button").val();
            _Sort = vValue.toUpperCase();
            _vPage = 0;
            fnSearchBkgList();
        }
    }
});

//부킹 리스트 - 상세 리스트 클릭 시 BKG_NO 이동
$(document).on("click", "a[name='btn_BkgDetail_Search']", function () {

    try {
        //세션 저장
        sessionStorage.setItem("BEFORE_VIEW_NAME", "BOOKING_BKG");
        sessionStorage.setItem("VIEW_NAME", "REGIST");
        sessionStorage.setItem("REQ_SVC", $("input[name='transfer_TYPE']:checked").val());
        sessionStorage.setItem("BK_ETD_ETA", $("#Select_BK_ETD_ETA").find("option:selected").val());
        sessionStorage.setItem("ETD", $("#input_ETD").val());
        sessionStorage.setItem("ETA", $("#input_ETA").val());
        sessionStorage.setItem("STATUS", $("#select_BkgDetail_Status").find("option:selected").val());
        sessionStorage.setItem("POL_CD", $("#input_POL").val());
        sessionStorage.setItem("POD_CD", $("#input_POD").val());
        sessionStorage.setItem("POL_NM", $("#input_Departure").val());
        sessionStorage.setItem("POD_NM", $("#input_Arrival").val());
        sessionStorage.setItem("BKG_NO", $("#select_BKDetail_BkgNo").val());

        var vBKG_NO = $(this).siblings("input[name='BK_BkgNo']").val();
        var objJsonData = new Object();
        objJsonData.BKG_NO = vBKG_NO;
        controllerToLink("Regist", "Booking", objJsonData);
    }
    catch (err) {
        console.log("[Error - a[name='btn_BkgDetail_Search']]" + err.message);
    }
});

//부킹 취소 버튼 이벤트
$(document).on("click", "a[name='btn_StatusCancel']", function () {
    _objData.CanCel_BkgNo = $(this).siblings("input[name='BK_BkgNo']").val();    

    fnStatusConfirm("부킹 취소를 하시겠습니까?");    
});

//부킹 취소 Confirm 확인 버튼 이벤트
$(document).on("click", "#BkgList_Confirm_confirm", function () {
    fnSetCancelStatus();
    layerClose('#BkgList_Confirm');
});

//부킹 취소 Confirm 취소 버튼 이벤트
$(document).on("click", "#BkgList_Confirm_cencel", function () {
    layerClose('#BkgList_Confirm');
});

//B/L , AWB 이동 이벤트
$(document).on("click", "a[name='btn_MoveHBL']", function () {
    
    try {
        //세션 저장
        sessionStorage.setItem("BEFORE_VIEW_NAME", "BOOKING_BL");
        sessionStorage.setItem("VIEW_NAME", "BL");
        sessionStorage.setItem("REQ_SVC", $("input[name='transfer_TYPE']:checked").val());
        sessionStorage.setItem("BK_ETD_ETA", $("#Select_BK_ETD_ETA").find("option:selected").val());
        sessionStorage.setItem("ETD", $("#input_ETD").val());
        sessionStorage.setItem("ETA", $("#input_ETA").val());
        sessionStorage.setItem("STATUS", $("#select_BkgDetail_Status").find("option:selected").val());
        sessionStorage.setItem("POL_CD", $("#input_POL").val());
        sessionStorage.setItem("POD_CD", $("#input_POD").val());
        sessionStorage.setItem("POL_NM", $("#input_Departure").val());
        sessionStorage.setItem("POD_NM", $("#input_Arrival").val());
        sessionStorage.setItem("BKG_NO", $("#select_BKDetail_BkgNo").val());

        var objJsonData = new Object();
        objJsonData.HBL_NO = $(this).siblings("input[type='hidden']").val();
        controllerToLink("BL", "Document", objJsonData);
    }
    catch (err) {
        console.log("[Error - a[name='btn_MoveHBL']]" + err.message);
    }

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

//부킹 STATUS 공통 코드에서 가져오는 함수
function fnGetBookingStatus() {
    try {
        var rtnJson;

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetBookingStatus",
            async: false,
            dataType: "json",
            success: function (result) {
                fnMakeBookingStatus(result);
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

//부킹 검색 한줄만 나오게
function fnSearchSingleBkg(vMNGT_NO) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMNGT_NO;
        objJsonData.PAGE = 1;
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.AUTH_KEY = _fnToNull($("#Session_AUTH_KEY").val());
        objJsonData.USER_TYPE = $("#Session_USR_TYPE").val();
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetBkgData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                $("#NoData_BK").hide();
                fnMakeBkgList(result);

                //관리 번호가 처음 들어올 때만 입력 되게.
                if (_fnToNull($("#View_BKG_NO").val()) != "") {
                    $("#View_BKG_NO").val("");
                    fnSetSearchData(result);
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

    } catch (err) {
        console.log("[Error - fnSearchBkgList]" + err.message);
    }
}

//부킹 검색 함수
function fnSearchBkgList() {
    checkSearch = true;
    try {

        if (fnVali_Booking()) {

            var rtnJson;
            var objJsonData = new Object();

            if (_vPage == 0) {
                objJsonData.PAGE = 1;
                _vPage = 1;
            } else {
                _vPage++;
                objJsonData.PAGE = _vPage;
            }

            objJsonData.AUTH_KEY = _fnToNull($("#Session_AUTH_KEY").val());

            if (_vREQ_SVC == "SEA") {
                objJsonData.REQ_SVC = "SEA";
            } else if (_vREQ_SVC == "AIR") {
                objJsonData.REQ_SVC = "AIR";
            }

            if (_vREQ_SVC != "AIR") {
                objJsonData.LINE_TYPE = "L";
            } else {
                objJsonData.LINE_TYPE = "";
            }

            objJsonData.DATE_TYPE = $("#Select_BK_ETD_ETA").find("option:selected").val();
            objJsonData.ETD = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.ETA = $("#input_ETA").val().replace(/-/gi, "");
            objJsonData.CUST_CD = $("#Session_CUST_CD").val();
            objJsonData.USER_TYPE = $("#Session_USR_TYPE").val();
            //필터조회 후 클리어
            if (!filterChk) {
                $("#BK_Search_detail").hide();
                $("#carrier_menu").prop("checked", false);
                $("#select_BkgDetail_Status").val("ALL").prop('checked', true);
                $("#input_POL").val("");
                $("#input_POD").val("");
                $("#input_Departure").val("");
                $("#input_Arrival").val("");
                $("#select_BKDetail_BkgNo").val("");
                $(".delete").hide();
            } else {
                filterChk = false;
            }

            //디테일 상세 조회가 on이라면
            if ($("#BK_Search_detail").css("display") == "block") {
                objJsonData.DETAIL = "Y";
                objJsonData.POL = $("#input_Departure").val();
                objJsonData.POL_CD = $("#input_POL").val();
                objJsonData.POD = $("#input_Arrival").val();
                objJsonData.POD_CD = $("#input_POD").val();
                objJsonData.STATUS = $("#select_BkgDetail_Status").find("option:selected").val();
                objJsonData.BKG_NO = _fnToNull($("#select_BKDetail_BkgNo").val());
            } else if ($("#BK_Search_detail").css("display") == "none") {
                objJsonData.DETAIL = "N";
            } else {
                objJsonData.DETAIL = "N";
            }

            //Sort
            if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
                objJsonData.ID = _OrderBy;
                objJsonData.ORDER = _Sort;
            } else {
                objJsonData.ID = "";
                objJsonData.ORDER = "";
            }

            $.ajax({
                type: "POST",
                url: "/Booking/fnGetBkgData",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#NoData_BK").hide();
                    fnMakeBkgList(result);                    
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

    } catch (err) {
        console.log("[Error - fnSearchBK]" + err.message);
    }
}

//부킹 검색 밸리데이션
function fnVali_Booking() {

    try {

        //ETD를 입력 해 주세요.
        if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
            $("#BK_Table_List th button").removeClass();
            _fnAlertMsg("ETD를 입력 해 주세요. ", "input_ETD");
            return false;
        }

        //ETA를 입력 해 주세요.
        if (_fnToNull($("#input_ETA").val().replace(/-/gi, "")) == "") {
            $("#BK_Table_List th button").removeClass();
            _fnAlertMsg("ETA를 입력 해 주세요. ", "input_ETA");
            return false;
        }

        return true;

    } catch (err) {
        console.log("[Error - fnVali_SearchBK]" + err.message);
    }
}

//부킹 취소 레이어 팝업 켜기
function fnStatusConfirm(msg) {
    $("#BkgList_Confirm .inner").html(msg);
    layerPopup2('#BkgList_Confirm');
    $("#BkgList_Confirm_confirm").focus();
}

//부킹 취소 함수
function fnSetCancelStatus() {
    try {
        var objJsonData = new Object();       

        objJsonData.BKG_NO = _objData.CanCel_BkgNo;  

        $.ajax({
            type: "POST",
            url: "/Booking/fnSetCancelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    $("#BK_Result_AREA").eq(0).empty();
                    fnSearchSingleBkg(_objData.CanCel_BkgNo);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("부킹 취소가 실패하였습니다.");
                    console.log("[Fail - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
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

    } catch (err) {
        console.log("[Error - fnSearchBK]" + err.message);
    }
}

//스케줄 자동 검색 후 검색 조건 데이터 채우기
function fnSetSearchData(vJsonData) {
    if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {

        if (_fnToNull(JSON.parse(vJsonData).BKG[0]["REQ_SVC"]) == "AIR") {
            _vREQ_SVC = "AIR";
            $("input:radio[name='transfer_TYPE']:input[value='AIR']").prop('checked', true);
        } else {
            _vREQ_SVC = "SEA";
            $("input:radio[name='transfer_TYPE']:input[value='SEA']").prop('checked', true);
        }

        $("#select_BkgDetail_Status").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["STATUS"])).prop('checked', true);
        $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BKG[0]["ETD"].replace(/\./gi, "")))); //ETD
        if (_fnToNull(JSON.parse(vJsonData).BKG[0]["ETA"]) != "") {
            $("#input_ETA").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BKG[0]["ETA"].replace(/\./gi, "")))); //ETA
        }
        $("#input_Departure").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["POL_TRMN"])); //POL_NM
        $("#input_POL").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["POL_CD"])); //POL_CD
        $("#input_Arrival").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["POD_TRMN"])); //POD_NM
        $("#input_POD").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["POL_CD"])); //POD_CD
        $("#select_BKDetail_BkgNo").val(_fnToNull(JSON.parse(vJsonData).BKG[0]["BKG_NO"]));

        $("#AC_Departure_Width .delete").show();
        $("#AC_Arrival_Width .delete").show();
    }
}
/////////////////function MakeList/////////////////////
//부킹 STATUS 세팅
function fnMakeBookingStatus(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).STATUS;

            vHTML += "<option value=\"ALL\">부킹상태(전체)</option>";

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + vResult[i].CODE + "\">" + vResult[i].NAME + "</option>";
            });

            $("#select_BkgDetail_Status")[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeBookingStatus]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Fail - fnMakeBookingStatus]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeBookingStatus]" + err.message);
    }
}

function fnMakeBkgList(vJsonData) {

    var vHTML = "";

    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).BKG;
            var vMorePage = true;

            //초기화
            if (_vPage == 1) {
                $("#BK_Result_AREA").eq(0).empty();
            }

            if (vResult == undefined) {
                vHTML += " <span>데이터가 없습니다.</span> ";
                $("#NoData_BK")[0].innerHTML = vHTML;
                $("#NoData_BK").show();
                vHTML = "";
                $("#Btn_BKMore").hide();
            }
            else {
                //데이터 반복문
                $.each(vResult, function (i) {
                    vHTML += "   <tr class=\"row\"> ";
                    vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["BKG_NO"]) + "</td> ";
                    vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["SCH_NO"]) + "</td> ";
                    vHTML += "   	<td style=\"display:none\">" + _fnToNull(vResult[i]["HBL_NO"]) + "</td> ";

                    if (_fnToNull(vResult[i]["STATUS"]) == "Q") {
                        vHTML += "   	<td class=\"request\">요청</td> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "Y") {
                        vHTML += "   	<td class=\"approve\">승인</td> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "F") {
                        vHTML += "   	<td class=\"approve\">확정</td> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "C") {
                        vHTML += "   	<td class=\"cancel\">취소</td> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "D") {
                        vHTML += "   	<td class=\"cancel\">삭제</td> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "O") {
                        vHTML += "   	<td class=\"cancel\">거절</td> ";
                    }                   

                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
                    vHTML += "   	</td> ";

                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["LINE_CD"]) + "<br />";
                    vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                    vHTML += "   	</td> ";

                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["POL_CD"]) + "<br />";
                    vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") ";
                    vHTML += "   	</td> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["POD_CD"]) + "<br />";
                    if (_fnToNull(vResult[i]["ETA"]) != "") {
                        vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") ";
                    } else {
                        vHTML += "-";
                    }

                    vHTML += "   	</td> ";

                    if (_fnToZero(vResult[i]["PRC"]) != 0) {
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["CURR_CD"]) + " " + fnSetComma(_fnToZero(vResult[i]["PRC"])) + "</td> ";
                    } else {
                        vHTML += "   	<td>별도문의</td> ";
                    }

                    vHTML += "   	<td class=\"btns_w1\"> ";
                    vHTML += "   		<div class=\"btn_padding\"> ";
                    vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_BkgDetail_Search\" class=\"btn_type1 skyblue\">상세</a> ";
                    vHTML += "   			<input type=\"hidden\" name=\"BK_BkgNo\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                    vHTML += "   		</div> ";
                    if (_fnToNull(vResult[i]["STATUS"]) == "Q" || _fnToNull(vResult[i]["STATUS"]) == "Y") {
                        if (_fnToNull(vResult[i]["HBL_NO"]) == "") {
                            vHTML += "   		<div class=\"btn_padding\"> ";
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_StatusCancel\" class=\"btn_type1 red\">Cancel</a> ";
                            vHTML += "   			<input type=\"hidden\" name=\"BK_BkgNo\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                            vHTML += "   		</div> ";
                        }
                    }
                    if (_fnToNull(vResult[i]["HBL_NO"]) != "" && _fnToNull(vResult[i]["HBL_YN"]) == "Y") {
                        if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                            vHTML += "   		<div class=\"btn_padding\"> ";
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_MoveHBL\" class=\"btn_type1 orange\">B/L</a>	 ";
                            vHTML += "   			<input type=\"hidden\" name=\"BK_HblNo\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "   		</div> ";
                        }
                        else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                            vHTML += "   		<div class=\"btn_padding\"> ";
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_MoveHBL\" class=\"btn_type1 orange\">AWB</a>				 ";
                            vHTML += "   			<input type=\"hidden\" name=\"BK_HblNo\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "   		</div> ";
                        }
                    }
                    
                    vHTML += "   	</td> ";
                    vHTML += "   	<td class=\"btns_w2\"> ";
                    vHTML += "   		<a class=\"plus\" id=\"plus\" href=\"javascript:void(0)\"><span class=\"btn_minus\"></span><span class=\"btn_plus\"></span></a> ";
                    vHTML += "   	</td> ";

                    //모바일
                    vHTML += "   	<td class=\"mobile_layout\" colspan=\"9\"> ";
                    vHTML += "   		<div class=\"layout_type2\">			 ";

                    if (_fnToNull(vResult[i]["STATUS"]) == "Q") {
                        vHTML += "   			<div class=\"row s2 request\">요청</div> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "Y") {
                        vHTML += "   			<div class=\"row s2 approve\">승인</div> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "F") {
                        vHTML += "   			<div class=\"row s2 approve\">확정</div> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "C") {
                        vHTML += "   			<div class=\"row s2 cancel\">취소</div> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "D") {
                        vHTML += "   			<div class=\"row s2 cancel\">삭제</div> ";
                    }
                    else if (_fnToNull(vResult[i]["STATUS"]) == "O") {
                        vHTML += "   			<div class=\"row s2 cancel\">거절</div> ";
                    }

                    vHTML += "   			<div class=\"row s3\"> ";
                    vHTML += "   				<table> ";
                    vHTML += "   					<tbody>	";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Service</th> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["CNTR_TYPE"]);
                    vHTML += "   	</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Vessel</th> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["LINE_CD"]) + "<br />";
                    vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                    vHTML += "   	</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Departure</th> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["POL_CD"]) + "<br />";
                    vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") ";
                    vHTML += "   	</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Arrival</th> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["POD_CD"]) + "<br />";
                    if (_fnToNull(vResult[i]["ETA"]) != "") {
                        vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") ";
                    } else {
                        vHTML += "-";
                    }
                    vHTML += "   	</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Price</th> ";

                    if (_fnToZero(vResult[i]["PRC"]) != 0) {
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["CURR_CD"]) + " " + fnSetComma(_fnToZero(vResult[i]["PRC"])) + "</td> ";
                    } else {
                        vHTML += "   	<td>별도문의</td> ";
                    }

                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr class=\"sch_comment\"> ";
                    vHTML += "   							<td colspan=\"2\"> ";
                    vHTML += "   								<ul class=\"etc_info\"> ";
                    vHTML += "   									<li class=\"item\"> ";
                    vHTML += "   										<em>반입지 : <span>" + _fnToNull(vResult[i]["POL_TML_NM"]) + "</span></em> ";
                    vHTML += "   									</li> ";
                    vHTML += "   									<li class=\"item\"> ";
                    vHTML += "   										<em>담당자 : <span>" + _fnToNull(vResult[i]["SCH_PIC"]) + "</span></em> ";
                    vHTML += "   									</li> ";
                    vHTML += "   									<li class=\"item\"> ";
                    vHTML += "   										<em>Item : <span>" + _fnToNull(vResult[i]["RMK"]) + "</span></em> ";
                    vHTML += "   									</li> ";
                    vHTML += "   								</ul> ";
                    vHTML += "   							</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<td colspan=\"2\"> ";

                    vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_BkgDetail_Search\" class=\"btn_type1 skyblue\">상세</a> ";
                    

                    if (_fnToNull(vResult[i]["STATUS"]) == "Q" || _fnToNull(vResult[i]["STATUS"]) == "Y") {
                        if (_fnToNull(vResult[i]["HBL_NO"]) == "") {
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_StatusCancel\" class=\"btn_type1 red\">Cancel</a> ";
                        } 
                    }
                    if (_fnToNull(vResult[i]["HBL_NO"]) != "" && _fnToNull(vResult[i]["HBL_YN"]) == "Y") {
                        if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_MoveHBL\" class=\"btn_type1 orange\">B/L</a>	 ";
                            
                        }
                        else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                            vHTML += "   			<a href=\"javascript:void(0)\" name=\"btn_MoveHBL\" class=\"btn_type1 orange\">AWB</a>				 ";
                            
                        }
                    }
                    vHTML += "   			<input type=\"hidden\" name=\"BK_BkgNo\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                    vHTML += "   			<input type=\"hidden\" name=\"BK_HblNo\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";

                    vHTML += "   							</td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   					</tbody> ";
                    vHTML += "   				</table> ";
                    vHTML += "   			</div> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</td> ";
                    vHTML += "   </tr> ";
                    vHTML += "   <tr class=\"related_info\" id=\"row_1\" style=\"display: none;\"> ";
                    vHTML += "   	<td colspan=\"8\"> ";
                    vHTML += "   		<ul class=\"etc_info\"> ";
                    vHTML += "   			<li class=\"item\"> ";
                    vHTML += "   				<em>반입지 : <span>" + _fnToNull(vResult[i]["POL_TML_NM"]) + "</span></em> ";
                    vHTML += "   			</li> ";
                    vHTML += "   			<li class=\"item\"> ";
                    vHTML += "   				<em>담당자 : <span>" + _fnToNull(vResult[i]["SCH_PIC"]) + "</span></em> ";
                    vHTML += "   			</li> ";
                    vHTML += "   			<li class=\"item\"> ";
                    vHTML += "   				<em>Item : <span>" + _fnToNull(vResult[i]["RMK"]) + "</span></em> ";
                    vHTML += "   			</li> ";
                    vHTML += "   		</ul> ";
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
                    $("#Btn_BKMore").show();
                } else {
                    $("#Btn_BKMore").hide();
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            $("#BK_Result_AREA").eq(0).empty();

            vHTML += " <span>데이터가 없습니다.</span> ";
            $("#NoData_BK")[0].innerHTML = vHTML;
            $("#NoData_BK").show();
            vHTML = "";
            $("#Btn_BKMore").hide();
            console.log("[Error]fnMakeBkgList :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            $("#BK_Result_AREA").eq(0).empty();

            vHTML += " <span>담당자에게 문의하세요.</span> ";
            $("#NoData_BK")[0].innerHTML = vHTML;
            $("#NoData_BK").show();
            vHTML = "";
            $("#Btn_BKMore").hide();
            console.log("[Error]fnMakeBkgList :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
       
        $("#BK_Result_AREA").eq(0).append(vHTML);
        $("#BK_Result_AREA").show();
    }
    catch (err) {
        console.log("[Error - fnMakeBkgList]" + err.message);
    }
}

//부킹 상세 레이어 
function fnMakeBkgLayer(vJsonData)
{
    var vHTML = "";

    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).BKG;                        

            if (vResult == undefined) {
                _fnAlertMsg("데이터를 가져올 수 없습니다.");
                console.log("[Fail]fnMakeBkgLayer :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
            }
            else {
                vHTML += "   <h2 class=\"booking_no\">Booking No : <em>" + _fnToNull(vResult[0]["BKG_NO"]) + "</em></h2> ";
                vHTML += "   <div class=\"booking_cont\"> ";
                vHTML += "   	<div class=\"left_area\"> ";
                vHTML += "   		<div class=\"booking_info\"> ";
                vHTML += "   			<div class=\"row\"> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">Port of Loading :</em> ";
                vHTML += "   					" + _fnToNull(vResult[0]["POL_TRMN"]) + " (" + _fnToNull(vResult[0]["POL_CD"]) + ") <br> ";
                vHTML += "   					" + String(_fnToNull(vResult[0]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"col arrow\"><img src=\"/Images/icn_arrow2.png\" alt=\"\" class=\"pc\"><img src=\"/Images/icn_arrow3.png\" alt=\"\" class=\"mo\"></div> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">Port of Discharging :</em> ";
                vHTML += "   					" + _fnToNull(vResult[0]["POD_TRMN"]) + " (" + _fnToNull(vResult[0]["POD_CD"]) + ") <br> ";
                vHTML += "   					" + String(_fnToNull(vResult[0]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"row\"> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">Vessel / Voyage :</em> ";
                vHTML += "   					" + _fnToNull(vResult[0]["VSL_VOY"]) + " ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"col empty\"></div> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">T/time / T/S : </em> ";

                if (Number(_fnToNull(vResult[0]["TRANSIT_TIME"])) > 0) {
                    if (Number(_fnToNull(vResult[0]["TRANSIT_TIME"]) > 1)) {
                        vHTML += _fnToNull(vResult[0]["TRANSIT_TIME"]) + " Days ";
                    } else {
                        vHTML += _fnToNull(vResult[0]["TRANSIT_TIME"]) + " Day ";
                    }
                } 

                vHTML += " / ";

                if (_fnToNull(vResult[0]["TS_CNT"]) == "0") {
                    vHTML += "T/S";
                } else if (_fnToNull(vResult[0]["TS_CNT"]) == "1") {
                    vHTML += "Direct";
                }

                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"row\"> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">Doc Closing : </em> ";
                vHTML += "   					" + String(_fnToNull(vResult[0]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') + " " + _fnFormatTime(_fnToNull(vResult[0]["DOC_CLOSE_HM"]))+" ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"col empty\"></div> ";
                vHTML += "   				<div class=\"col\"> ";
                vHTML += "   					<em class=\"tit\">Cargo Closing : </em> ";
                vHTML += "   					2020-10-20 18:00 ";
                vHTML += "   					" + String(_fnToNull(vResult[0]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') + " " + _fnFormatTime(_fnToNull(vResult[0]["CARGO_CLOSE_HM"])) + " ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<ul class=\"booking_info\"> ";
                vHTML += "   			<li> ";
                vHTML += "   				<em class=\"tit\">반입지 : </em> ";
                vHTML += "   				" + _fnToNull(vResult[0]["POL_TML_NM"]) + " ";
                vHTML += "   			</li> ";
                vHTML += "   			<li> ";
                vHTML += "   				<em class=\"tit\">담당자 : </em> ";
                vHTML += "   				" + _fnToNull(vResult[0]["SCH_PIC"]) + " ";
                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"right_area\"> ";
                vHTML += "   		<ul class=\"booking_info\"> ";
                vHTML += "   			<li> ";
                vHTML += "   				<em class=\"tit\">Item :</em> ";
                vHTML += "   				" + _fnToNull(vResult[0]["MAIN_ITEM_NM"]) + "<br> ";

                var vHTML_WEGIHT = "";

                if (_fnToNull(vResult[0]["PKG"]) != "") {
                    vHTML_WEGIHT += _fnToNull(vResult[0]["PKG"])+" Qty";
                }

                if (_fnToNull(vResult[0]["GRS_WGT"]) != "") {
                    if (_fnToNull(vHTML_WEGIHT) == "") {
                        vHTML_WEGIHT += _fnToNull(vResult[0]["GRS_WGT"]) + " kg";
                    }
                    else {
                        vHTML_WEGIHT += ", "+_fnToNull(vResult[0]["GRS_WGT"]) + " kg";
                    }
                }

                if (_fnToNull(vResult[0]["MSRMT"]) != "") {
                    if (_fnToNull(vHTML_WEGIHT) == "") {
                        vHTML_WEGIHT += _fnToNull(vResult[0]["MSRMT"]) + " CBM";
                    }
                    else {
                        vHTML_WEGIHT += ", " + _fnToNull(vResult[0]["MSRMT"]) + " CBM";
                    }
                }
                vHTML += vHTML_WEGIHT;

                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
                vHTML += "   		<div class=\"quotation\"> ";
                vHTML += "   			<em class=\"tit\">Quotation</em> ";

                if (_fnToZero(vResult[0]["PRC"]) != 0) {
                    vHTML += _fnToNull(vResult[0]["CURR_CD"]) + " " + _fnToZero(vResult[0]["PRC"]);
                } else {
                    vHTML += "별도문의";
                }                

                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"bot_btn\"><a href=\"javascript:void(0)\" class=\"btn_type7 orange\" onclick=\"layerClose('#booking_pop')\">Cancel</a></div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
                vHTML += "   <button type=\"button\" class=\"btns icon close type2\" onclick=\"layerClose('#booking_pop');\"><span class=\"blind\">검색 닫기</span></button> ";

                $("#booking_pop_Cont")[0].innerHTML = vHTML;
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("데이터를 가져올 수 없습니다.");
            console.log("[Fail]fnMakeBkgLayer :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요.");
            console.log("[Error]fnMakeBkgLayer :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeBkgLayer]" + err.message);
    }
}
////////////////////////API////////////////////////////

