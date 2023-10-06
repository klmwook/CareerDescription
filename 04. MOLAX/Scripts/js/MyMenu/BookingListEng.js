////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var _vPage = 1;
var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
var filterChk = false;

////////////////////jquery event///////////////////////
$(function () {    

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
    else {
        $('body').addClass('e-service--sub');
        $('.more-btn').on('click', function () {
            if (!$('.more-btn').hasClass('on')) {
                $('.more-btn').addClass('on');
                $('.box2').removeClass('d-none');
            }
            else {
                $('.more-btn').removeClass('on');
                $('.box2').addClass('d-none');
            }
        });

        $('.delete-btn').on('click', function () {
            $(this).siblings().val('');
        });

        //fnSetServiceType("#select_CntrType", "SEA", "");
        fnGetBookingStatus(); //부킹 STATUS 공통 코드에서 가져오는 함수   
    }

    //뒤로가기 이벤트
    if (event.persisted || (window.performance && window.performance.navigation.type == 2) || event.originalEvent && event.originalEvent.persisted) {

        if (_fnToNull($("#Session_USR_ID").val()) == "") {
            window.location = window.location.origin;
        } else {
            if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "BOOKING_BKG") {

                $("#Select_BK_ETD_ETA").val(_fnToNull(sessionStorage.getItem("BK_ETD_ETA"))).prop('checked', true);
                $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));
                $("#input_ETA").val(_fnToNull(sessionStorage.getItem("ETA")));
                $("#select_BkgDetail_Status").val(_fnToNull(sessionStorage.getItem("STATUS"))).prop('checked', true);
                $("#Select_Bound").val(_fnToNull(sessionStorage.getItem("BOUND"))).prop('checked', true);

                if (_fnToNull(sessionStorage.getItem("BOUND")) == "E") {
                    $(".pop__export").show();
                    $(".pop__import").hide();
                    $("#input_POL").text(_fnToNull(sessionStorage.getItem("POL")));
                    $("#input_POLCD").val(_fnToNull(sessionStorage.getItem("POLCD")));
                    $("#input_auto_POD").val(_fnToNull(sessionStorage.getItem("POD")));
                    $("#input_auto_PODCD").val(_fnToNull(sessionStorage.getItem("PODCD")));
                    $("button[name='input_POL']").show();
                    $("button[name='input_auto_POD']").show();
                }
                else if (_fnToNull(sessionStorage.getItem("BOUND")) == "I") {
                    $(".pop__export").hide();
                    $(".pop__import").show();
                    $("#input_auto_POL").val(_fnToNull(sessionStorage.getItem("POL")));
                    $("#input_auto_POLCD").val(_fnToNull(sessionStorage.getItem("POLCD")));
                    $("#input_POD").text(_fnToNull(sessionStorage.getItem("POD")));
                    $("#input_PODCD").val(_fnToNull(sessionStorage.getItem("PODCD")));
                    $("button[name='input_auto_POL']").show();
                    $("button[name='input_POD']").show();
                }

                $("#select_BKDetail_BkgNo").val(_fnToNull(sessionStorage.getItem("BKG_NO")));
                sessionStorage.clear();

                //검색
                $("#btn_BkList_Search").click();
            }
        }
    } else {
        if (_fnToNull($("#Session_USR_ID").val()) == "") {
            window.location = window.location.origin;
        } else {
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
                    $("#select_CntrType").val(_fnToNull(sessionStorage.getItem("CNTR_TYPE")));
                    $("#Select_Bound").val(_fnToNull(sessionStorage.getItem("BOUND")));

                    if (_fnToNull(sessionStorage.getItem("BOUND")) == "E") {
                        $(".pop__export").show();
                        $(".pop__import").hide();
                    }
                    else if (_fnToNull(sessionStorage.getItem("BOUND")) == "I") {
                        $(".pop__export").hide();
                        $(".pop__import").show();
                    }

                    $("#Select_BK_ETD_ETA").val(_fnToNull(sessionStorage.getItem("BK_ETD_ETA"))).prop('checked', true);
                    sessionStorage.clear();
                }
                fnSearchBkgList();
            }
        }
    }
});

//출발지 도착지 삭제 버튼 이벤트
$(document).on("click", ".delete-btn", function () {
    if ($(this).attr("name") == "input_POL") {
        $("#input_POL").text("Departure");
        $("#input_POLCD").val("");
    }
    else if ($(this).attr("name") == "input_auto_POL") {
        $("#input_auto_POL").val("");
        $("#input_auto_POLCD").val("");
    }
    else if ($(this).attr("name") == "input_auto_POD") {
        $("#input_auto_POD").val("");
        $("#input_auto_PODCD").val("");
    }
    else if ($(this).attr("name") == "input_POD") {
        $("#input_POD").text("Arrival");
        $("#input_PODCD").val("");
    }

    $(this).hide();
});

//수출 - POL 클릭 (AutoComplete X)
$(document).on("click", ".pop__export a", function () {
    $(".sch-pop--pol--export").show();
});

//수출 - POD 클릭 (AutoComplete O)
$(document).on("click", "#input_auto_POD", function () {
    if ($(this).val().length == 0) {
        $(".sch-pop--pod--export").show();
    } else {
        $(".sch-pop--pod--export").hide();
    }
});

//수입 - POD 클릭 (AutoComplete O)
$(document).on("click", "#input_auto_POL", function () {

    if ($(this).val().length == 0) {
        $(".sch-pop--pol--import").show();
    } else {
        $(".sch-pop--pol--import").hide();
    }

});

//수입 - POL 클릭 (AutoComplete O)
$(document).on("click", ".pop__import a", function () {
    $(".sch-pop--pod--import").show();
});

//수출 POD AutoComplete
$(document).on("keyup", "#input_auto_POD", function (e) {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_auto_PODCD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("button[name='input_auto_POD']").show();
        $(".sch-pop--pod--export").hide();
    }
    else if ($(this).val().length == 0) {
        $("button[name='input_auto_POD']").hide();
        $(".sch-pop--pod--export").hide();
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_POD_Width").width()
            });
        },
        source: function (request, response) {
            var result = _fnGetPortData($("#input_auto_POD").val().toUpperCase());
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
        select: function (event, ui) {
            if (ui.item.value.indexOf('데이터') == -1) {
                $("#input_auto_POD").val(ui.item.value);
                $("#input_auto_PODCD").val(ui.item.code);
                vPort = ui.item.code;
            } else {
                ui.item.value = "";
            }

            filterChk = true;
            _vPage = 1;
            fnSearchBkgList();
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };

    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 1;
        fnSearchBkgList();
    }
});

//수입 POL AutoComplete
$(document).on("keyup", "#input_auto_POL", function (e) {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_auto_POLCD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("button[name='input_auto_POL']").show();
        $(".sch-pop--pol--import").hide();
    }
    else if ($(this).val().length == 0) {
        $("button[name='input_auto_POL']").hide();
        $(".sch-pop--pol--import").hide();
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_POL_Width").width()
            });
        },
        source: function (request, response) {
            var result = _fnGetPortData($("#input_auto_POL").val().toUpperCase());
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
        select: function (event, ui) {
            if (ui.item.value.indexOf('데이터') == -1) {
                $("#input_auto_POL").val(ui.item.value);
                $("#input_auto_POLCD").val(ui.item.code);
                vPort = ui.item.code;
            } else {
                ui.item.value = "";
            }

            filterChk = true;
            _vPage = 1;
            fnSearchBkgList();
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
        };

    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 1;
        fnSearchBkgList();
    }
});

//필터 - 부킹 상태 클릭 시 조회
$("#select_BkgDetail_Status").change(function (e) {
    filterChk = true;
    _vPage = 1;
    fnSearchBkgList();
});


$("#select_BKDetail_BkgNo").keyup(function (e) {
    if (e.keyCode == 13) {
        filterChk = true;
        _vPage = 1;
        fnSearchBkgList();
    }
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETD_Icon", function () {
    $("#input_ETD").focus();
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETA_Icon", function () {
    $("#input_ETA").focus();
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
        $(this).val(_fnPlusDate(0));
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        alert("ETD cannot be faster than ETA. ");
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
        $(this).val(_fnPlusDate(7));
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        alert("ETA cannot be faster than ETD. ");
        $("#input_ETA").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
    }
});

//수출 / 수입 변경 이벤트
$(document).on("change", "#Select_Bound", function () {

    if ($(this).find("option:selected").val() == "E") {
        $(".pop__export").show();
        $(".pop__import").hide();
        $('.city-text-dpt').text('Departure');
        $('.city-text-arrive').text('Arrival');
    }
    else if ($(this).find("option:selected").val() == "I") {
        $(".pop__export").hide();
        $(".pop__import").show();        
        $('.city-text-arrive').text('Departure');
        $('.city-text-dpt').text('Arrival');
    }

    fnInitData();

});

//즐겨찾기 포트 선택
$(document).on("click", ".quick_pol_port", function () {

    filterChk = true;
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    if ($("#Select_Bound").find("option:selected").val() == "E") {
        $("#input_POL").text(vSplit[0]);
        $("#input_POLCD").val(vSplit[1]);
        $("button[name='input_POL']").show();
    }
    else if ($("#Select_Bound").find("option:selected").val() == "I") {
        $("#input_auto_POL").val(vSplit[0]);
        $("#input_auto_POLCD").val(vSplit[1]);
        $("button[name='input_auto_POL']").show();
    }

    fnSearchBkgList();
});

//즐겨찾기 포트 선택
$(document).on("click", ".quick_pod_port", function () {

    filterChk = true;
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    if ($("#Select_Bound").find("option:selected").val() == "E") {
        $("#input_auto_POD").val(vSplit[0]);
        $("#input_auto_PODCD").val(vSplit[1]);
        $("button[name='input_auto_POD']").show();
    }
    else if ($("#Select_Bound").find("option:selected").val() == "I") {
        $("#input_POD").text(vSplit[0]);
        $("#input_PODCD").val(vSplit[1]);
        $("button[name='input_POD']").show();
    }

    fnSearchBkgList();
});

//검색 버튼 이벤트
$(document).on("click", "#btn_BkList_Search", function () {
    _isSearch = false;
    _vPage = 1;
    fnSearchBkgList();
});

//정렬
$(document).on("click", ".orderby", function () {

    if ($(this).siblings("button").val().length > 0) {
        if (_isSearch) {
            var vValue = "";

            if ($(this).siblings("button").hasClass("on")) {
                vValue = "asc"
            }
            else {
                vValue = "desc"
            }

            $("#BookingList_orderby th button").removeClass("on");
            if (vValue == "desc") {
                $(this).siblings("button").addClass('on');
            } else if (vValue == "desc") {
                $(this).siblings("button").removeClass('on');
            }

            _vPage = 1;
            _OrderBy = $(this).siblings("button").val();
            _Sort = vValue.toUpperCase();
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
        sessionStorage.setItem("BK_ETD_ETA", $("#Select_BK_ETD_ETA").find("option:selected").val());
        sessionStorage.setItem("CNTR_TYPE", $("#select_CntrType").find("option:selected").val());
        sessionStorage.setItem("BOUND", $("#Select_Bound").find("option:selected").val());
        sessionStorage.setItem("ETD", $("#input_ETD").val());
        sessionStorage.setItem("ETA", $("#input_ETA").val());
        sessionStorage.setItem("STATUS", $("#select_BkgDetail_Status").find("option:selected").val());

        if ($("#Select_Bound").find("option:selected").val() == "") {
            sessionStorage.setItem("POL", $("#input_POL").text());
            sessionStorage.setItem("POLCD", $("#input_POLCD").val());
            sessionStorage.setItem("POD", $("#input_auto_POD").val());
            sessionStorage.setItem("PODCD", $("#input_auto_PODCD").val());
        }
        else if ($("#Select_Bound").find("option:selected").val() == "") {
            sessionStorage.setItem("POL", $("#input_auto_POL").val());
            sessionStorage.setItem("POLCD", $("#input_auto_POLCD").val());
            sessionStorage.setItem("POD", $("#input_POD").text());
            sessionStorage.setItem("PODCD", $("#input_PODCD").val());
        }

        sessionStorage.setItem("BKG_NO", $("#select_BKDetail_BkgNo").val());

        var vBKG_NO = $(this).siblings("input[name='BK_BkgNo']").val();
        var objJsonData = new Object();
        objJsonData.BKG_NO = vBKG_NO;
        controllerToLink("Regist", "MOLAX", objJsonData);
    }
    catch (err) {
        console.log("[Error - a[name='btn_BkgDetail_Search']]" + err.message);
    }
});

//부킹 취소 버튼 이벤트
$(document).on("click", "a[name='btn_StatusCancel']", function () {
    if (confirm("Are you sure you want to cancel the booking?")) {        
        fnSetCancelStatus($(this).siblings("input[name='BK_BkgNo']").val());
    }    
});
////////////////////////function///////////////////////
//수출 / 수입 변경 시 Input 초기화
function fnInitData() {
    try {

        $('.more-btn').removeClass('on');
        $('.box2').addClass('d-none');
        $("#select_BkgDetail_Status").val("ALL").prop('checked', true);
        $("#input_POL").text("Departure");
        $("#input_POLCD").val("");
        $("#input_auto_POL").val("");
        $("#input_auto_POLCD").val("");
        $("#input_POD").text("Arrival");
        $("#input_PODCD").val("");
        $("#input_auto_POD").val("");
        $("#input_auto_PODCD").val("");
        $("#select_BKDetail_BkgNo").val("");
        $(".delete-btn").hide();

        var vHTML = "";

        //PC
        vHTML += "   <tr> ";
        vHTML += "   	<td class=\"no_data\" colspan=\"9\"></td> ";
        vHTML += "   </tr> ";

        $("#BK_Result_AREA_PC")[0].innerHTML = vHTML;

        vHTML = "";

        //MO
        vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
        vHTML += "   	<li class=\"no_data col-12 py-6\"></li> ";
        vHTML += "   </ul> ";

        $("#BK_Result_AREA_MO")[0].innerHTML = vHTML;

        _isSearch = false;
        filterChk = false;
    }
    catch (err) {
        console.log("[Error - fnInitData]" + err.message);
    }
}

//부킹 STATUS 공통 코드에서 가져오는 함수
function fnGetBookingStatus() {
    try {
        var rtnJson;

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnGetBookingStatus",
            async: false,
            dataType: "json",
            success: function (result) {
                fnMakeBookingStatus(result);
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("Please contact the person in charge.");
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
        objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnGetBkgData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                
                fnMakeBkgList(result);
                fnSetSearchData(result);
                $("#Paging_Area").hide();
                //관리 번호가 처음 들어올 때만 입력 되게.
                //if (_fnToNull($("#View_BKG_NO").val()) != "") {
                //    $("#View_BKG_NO").val("");
                //    fnSetSearchData(result);
                //}
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("Please contact the person in charge.");
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
        console.log("[Error - fnSearchSingleBkg]" + err.message);
    }
}

//부킹 검색 함수
function fnSearchBkgList() {
    
    try {
        if (fnVali_Booking()) {

            var objJsonData = new Object();

            objJsonData.PAGE = _vPage;
            objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());
            objJsonData.REQ_SVC = "SEA";
            objJsonData.DATE_TYPE = $("#Select_BK_ETD_ETA").find("option:selected").val();
            objJsonData.ETD = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.ETA = $("#input_ETA").val().replace(/-/gi, "");
            objJsonData.CUST_CD = $("#Session_CUST_CD").val();
            objJsonData.CNTR_TYPE = $("#select_CntrType").find("option:selected").val();
            objJsonData.EX_IM_TYPE = $("#Select_Bound").find("option:selected").val();

            //필터조회 후 클리어
            if (!filterChk) {                                
                $('.more-btn').removeClass('on');
                $('.box2').addClass('d-none');
                $("#select_BkgDetail_Status").val("ALL").prop('checked', true);

                $("#input_POL").text("Departure");
                $("#input_POLCD").val("");
                $("#input_auto_POL").val("");
                $("#input_auto_POLCD").val("");
                $("#input_POD").text("Arrival");
                $("#input_PODCD").val("");
                $("#input_auto_POD").val("");
                $("#input_auto_PODCD").val("");

                $("#select_BKDetail_BkgNo").val("");
                $(".delete-btn").hide();
            } else {
                filterChk = false;
            }

            //디테일 상세 조회가 on이라면
            if (!$(".item7").hasClass("d-none")) {
                objJsonData.DETAIL = "Y";

                if ($("#Select_Bound").find("option:selected").val() == "E") {
                    if ($("#input_POL").text() == "Departure") {
                        objJsonData.POL = "";
                    } else {
                        objJsonData.POL = $("#input_POL").text();
                    }
                    objJsonData.POL_CD = $("#input_POLCD").val();

                    //AutoComplete
                    objJsonData.POD = $("#input_auto_POD").val();
                    objJsonData.POD_CD = $("#input_auto_PODCD").val();
                }
                else if ($("#Select_Bound").find("option:selected").val() == "I") {

                    objJsonData.POL = $("#input_auto_POL").val();
                    objJsonData.POL_CD = $("#input_auto_POLCD").val();

                    if ($("#input_POD").text() == "Arrival") {
                        objJsonData.POD = "";
                    } else {
                        objJsonData.POD = $("#input_POD").text();
                    }
                    objJsonData.POD_CD = $("#input_PODCD").val();
                }                

                objJsonData.STATUS = $("#select_BkgDetail_Status").find("option:selected").val();
                objJsonData.BKG_NO = _fnToNull($("#select_BKDetail_BkgNo").val());
            } else if ($(".item7").hasClass("d-none")) {
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
                url: "/MyMenu/fnGetBkgData",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {                    
                    fnMakeBkgList(result);
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnBKPaging(JSON.parse(result).BKG[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                    }
                }, error: function (xhr, status, error) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("Please contact the person in charge.");
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
            alert("Please enter ETD. ", "input_ETD");
            return false;
        }

        //ETA를 입력 해 주세요.
        if (_fnToNull($("#input_ETA").val().replace(/-/gi, "")) == "") {
            $("#BK_Table_List th button").removeClass();
            alert("Please enter ETA. ", "input_ETA");
            return false;
        }

        return true;

    } catch (err) {
        console.log("[Error - fnVali_SearchBK]" + err.message);
    }
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnBKPaging(totalData, dataPerPage, pageCount, currentPage) {
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    $("#Paging_Area").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    //if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }
    if (currentPage == last) {
        if (last == totalPage) {
            nextPage = last
        } else {
            nextPage = currentPage + 1;
        }
    } else {
        nextPage = currentPage + 1;
    }

    var vHTML = "";

    vHTML += "   <ul> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev-first\" onclick=\"fnBKGoPage(1)\" ><span>To the front</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev\" onclick=\"fnBKGoPage(" + prevPage + ")\"><span>Before</span></a> ";
    vHTML += "      </li> ";

    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" class=\"active\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        } else {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" onclick=\"fnBKGoPage(" + i + ")\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        }
    }

    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnBKGoPage(" + nextPage + ")\" class=\"next\"><span>Next</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnBKGoPage(" + totalPage + ")\" class=\"next-last\"><span>At the very end</span></a> ";
    vHTML += "      </li> ";
    vHTML += "   </ul> ";

    $("#Paging_Area").append(vHTML);    // 페이지 목록 생성
}

function fnBKGoPage(vPage) {
    _vPage = vPage;
    fnSearchBkgList();
}

//검색 데이터 세팅
function fnSetSearchData(vJsonData) {
    if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {

        //Service 세팅
        if (_fnToNull(JSON.parse(vJsonData).BKG[0]["CNTR_TYPE"]) == "FCL") {
            $("#select_CntrType").val("F").prop('checked', true);
        }
        else if (_fnToNull(JSON.parse(vJsonData).BKG[0]["CNTR_TYPE"]) == "LCL" || _fnToNull(JSON.parse(vJsonData).BKG[0]["CNTR_TYPE"]) == "CONSOL" ) {
            $("#select_CntrType").val("L").prop('checked', true);
        }        

        if (_fnToNull(JSON.parse(vJsonData).BKG[0]["EX_IM_TYPE"]) == "E") {
            $("#Select_Bound").val("E");
            $(".pop__export").show();
            $(".pop__import").hide();
            $('.city-text-dpt').text('Departure');
            $('.city-text-arrive').text('Arrival');
        }
        else if (_fnToNull(JSON.parse(vJsonData).BKG[0]["EX_IM_TYPE"]) == "I") {
            $("#Select_Bound").val("I");
            $(".pop__export").hide();
            $(".pop__import").show();
            $('.city-text-arrive').text('Departure');
            $('.city-text-dpt').text('Arrival');
        }

        $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BKG[0]["ETD"].replace(/\./gi, "")))); //ETD
        if (_fnToNull(JSON.parse(vJsonData).BKG[0]["ETA"]) != "") {
            $("#input_ETA").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BKG[0]["ETA"].replace(/\./gi, "")))); //ETA
        }

    }
}

//부킹 취소 함수
function fnSetCancelStatus(vBKG_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.BKG_NO = vBKG_NO;

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnSetCancelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    $("#BK_Result_AREA").eq(0).empty();
                    fnSearchSingleBkg(vBKG_NO);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("Booking cancellation failed.");
                    console.log("[Fail - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("Please contact the person in charge.");
                    console.log("[Error - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("Please contact the person in charge.");
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
/////////////////function MakeList/////////////////////
//부킹 STATUS 세팅
function fnMakeBookingStatus(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).STATUS;

            vHTML += "<option value=\"ALL\">Booking Status (All)</option>";
            //20221226 sihong - 엘비스에 영문 표기가 없어서 하드코딩으로 넣음
            vHTML += "<option value=\"C\">Booking Cancel</option>";
            vHTML += "<option value=\"O\">Booking Rejection</option>";
            vHTML += "<option value=\"Q\">Booking Request</option>";
            vHTML += "<option value=\"Y\">Booking Approval</option>";

            //$.each(vResult, function (i) {
            //    vHTML += "<option value=\"" + vResult[i].CODE + "\">" + vResult[i].NAME + "</option>";
            //});

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
            
            //데이터 반복문 - //PC
            $.each(vResult, function (i) {
                
                vHTML += "   <tr class=\"sch_row\"> ";

                if (_fnToNull(vResult[i]["STATUS"]) == "Q") {
                    vHTML += "   	<td class=\"txt txt--g\">Request</td> ";
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "Y") {
                    vHTML += "   	<td class=\"txt txt--b\">Approval</td> ";
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "F") {
                    vHTML += "   	<td class=\"txt txt--b\">Comfirm</td> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "C") {
                    vHTML += "   	<td class=\"txt txt--r\">Cancel</td> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "D") {
                    vHTML += "   	<td class=\"txt txt--r\">Delete</td> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "O") {
                    vHTML += "   	<td class=\"txt txt--r\">Reject</td> ";                    
                }                

                vHTML += "   	<td class=\"txt font-sub font-weight-medium\"> ";
                vHTML += "      	<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt font-sub font-weight-medium\"> ";
                vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt font-weight-medium\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]);
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt font-weight-medium\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "   	</td> ";
                                
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\"> ";
                vHTML += _fnToNull(vResult[i]["CBM"]) + "";
                vHTML += "   	</td> ";

                //Terms
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\"> ";
                if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                    vHTML += _fnToNull(vResult[i]["TERMS_E"]) + "";
                }
                else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                    vHTML += _fnToNull(vResult[i]["TERMS_I"]) + "";
                }
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   	<a href=\"javascript:void(0)\" name=\"btn_BkgDetail_Search\" class=\"bk-sch mb-1 detail\">Detail</a> ";
                if (_fnToNull(vResult[i]["STATUS"]) == "Q" || _fnToNull(vResult[i]["STATUS"]) == "Y") {
                    if (_fnToNull(vResult[i]["HBL_NO"]) == "") {
                        vHTML += "   	<a href=\"javascript:void(0)\" name=\"btn_StatusCancel\" class=\"text-gray-6 bk-sch cancel\">Cancel</a> ";
                    }
                }

                vHTML += "   		<input type=\"hidden\" name=\"BK_BkgNo\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"btn_rel\"><i class=\"xi-plus\"></i></a> ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
                vHTML += "   <tr class=\"related_info\"> ";
                vHTML += "   	<td colspan=\"9\"> ";
                vHTML += "   		<ul class=\"etc_info\"> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>Carry-in place : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>The person in charge : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>Remark : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
            });

            $("#BK_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            $.each(vResult, function (i) {

                vHTML += "   <ul class=\"info-box py-2 px-1\">	 ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Status</p> ";
                if (_fnToNull(vResult[i]["STATUS"]) == "Q") {
                    vHTML += "   	<p class=\"txt--g des\">Request</p> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "Y") {
                    vHTML += "   	<p class=\"txt--b des\">Approval</p> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "F") {
                    vHTML += "   	<p class=\"txt--b des\">Confirm</p> ";
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "C") {
                    vHTML += "   	<p class=\"txt--r des\">Cancel</p> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "D") {
                    vHTML += "   	<p class=\"txt--r des\">Delete</p> ";                    
                }
                else if (_fnToNull(vResult[i]["STATUS"]) == "O") {
                    vHTML += "   	<p class=\"txt--r des\">Reject</p> ";
                }
                vHTML += "   	</li> ";

                //CARRIER
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Carrier</p> ";
                vHTML += "   		<div class=\"logo-img\"> ";
                vHTML += "   			<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   		</div> ";
                vHTML += "   	</li> ";

                //VSL
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Vessel</p> ";
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\"> ";
                vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                //ETD
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Departure</p> ";
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                //ETA
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Arrival</p> ";
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                //CBM
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">CBM</p> ";                
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\"> ";
                vHTML += _fnToNull(vResult[i]["CBM"]) + "";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                //Terms
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Terms</p> ";
                vHTML += "      <p class=\"text-gray-6 common-text--14 des\"> ";
                if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                    vHTML += _fnToNull(vResult[i]["TERMS_E"]) + "";
                }
                else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                    vHTML += _fnToNull(vResult[i]["TERMS_I"]) + "";
                }
                vHTML += "      </p> ";

                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                //vHTML += "   		<p class=\"title\">Info</p> ";
                vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_BkgDetail_Search\" class=\"bk-sch detail\">Detail</a> ";
                if (_fnToNull(vResult[i]["STATUS"]) == "Q" || _fnToNull(vResult[i]["STATUS"]) == "Y") {
                    if (_fnToNull(vResult[i]["HBL_NO"]) == "") {
                        vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_StatusCancel\" class=\"bk-sch cancel\">Cancel</a> ";
                    }
                }
                //if (_fnToNull(vResult[i]["HBL_NO"]) != "" && _fnToNull(vResult[i]["HBL_YN"]) == "Y") {
                //    vHTML += "   	<a href=\"javascript:void(0)\" name=\"btn_MoveHBL\" class=\"bk-sch\">B/L</a> ";
                //    vHTML += "   	<input type=\"hidden\" name=\"BK_HblNo\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                //}
                vHTML += "   		<input type=\"hidden\" name=\"BK_BkgNo\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                vHTML += "   	</li> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full related_info\"> ";
                vHTML += "   		<ul class=\"etc_info\"> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>Carry-in place : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>The person in charge : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>Remark : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
                vHTML += "   	</li> ";

                vHTML += "   </ul> ";
            });

            $("#BK_Result_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"9\"><span class=\"font-weight-medium\">Please check the information you request.</span></td> ";
            vHTML += "   </tr> ";

            $("#BK_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">Please check the information you request.</span></li> ";
            vHTML += "   </ul> ";

            $("#BK_Result_AREA_MO")[0].innerHTML = vHTML;

            console.log("[Fail - fnMakeBkgList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
            $("#Paging_Area").hide();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"9\"><span class=\"font-weight-medium\">Please contact the administrator.</span></td> ";
            vHTML += "   </tr> ";

            $("#BK_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">Please contact the administrator.</span></li> ";
            vHTML += "   </ul> ";

            $("#BK_Result_AREA_MO")[0].innerHTML = vHTML;

            console.log("[Error - fnMakeBkgList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
            $("#Paging_Area").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeBkgList]" + err.message);
    }
}


////////////////////////API////////////////////////////
