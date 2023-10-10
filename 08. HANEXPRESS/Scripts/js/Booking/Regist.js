////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var _vPage = 0;
var _OrderBy = "";
var _Sort = "";
var _objData = new Object();
var _objFile = new Object(); //파일 object
var _CheckSch = false;

////////////////////jquery event///////////////////////
$(function () {    

    //부킹 토스트 알람 테스트
    //var messageText = "<button type='button' class='btn_go' onclick='goPushPage()'><span>자세히보기</span></button>";
    //toastr.options.closeButton = true;
    //toastr.info(messageText, "타이틀 테스트");

    _objFile.FILE_INFO = new Array();

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }

    $("#input_ETD").val(_fnPlusDate(0)); //ETD	
    $("#bk_file_upload").attr("disabled", true);

    //부킹 번호가 있으면 부킹수정
    if (_fnToNull($("#View_BKG_NO").val()) != "") {
        //부킹 데이터 수정        
        fnModifyBooking();
        _CheckSch = true;
    } else if (_fnToNull($("#View_SCH_NO").val()) != "") {
        //스케줄 번호가 있으면 스케줄만 보여주기
        fnGetSchedule();
        _CheckSch = true;
    }

    //if (_fnToNull(sessionStorage.getItem("VIEW_NAME")) == "REGIST") {
    //    $("input:radio[name='transfer_TYPE']:input[value='" + _fnToNull(sessionStorage.getItem("LINE_TYPE")) + "']").prop('checked', true);
    //    $("#select_CntrType").val(_fnToNull(sessionStorage.getItem("CNTR_TYPE"))).prop('checked', true);
    //    $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD"))); //ETD
    //    $("#input_Departure").val(_fnToNull(sessionStorage.getItem("POL_NM"))); //POL_NM
    //    $("#input_POL").val(_fnToNull(sessionStorage.getItem("POL_CD"))); //POL_CD
    //    $("#input_Arrival").val(_fnToNull(sessionStorage.getItem("POD_NM"))); //POD_NM
    //    $("#input_POD").val(_fnToNull(sessionStorage.getItem("POD_CD"))); //POD_CD
    //    // sessionStorage.setItem("VIEW_NAME", "MAIN");
    //} else {
    //    $("#input_ETD").val(_fnPlusDate(0)); //ETD	
    //}

    if (!matchMedia("screen and (max-width: 1024px)").matches) {
        $(".bk_list tr").on("click", function () {
            $(".booking_view").show();
        });
    }
    else {
        $(".bk_list .mobile_layout .btn_type1").on("click", function () {
            $(".booking_view").show();
        });
    }
    //$(".list_type1.modify tbody tr:not(.related_info) td:not(.btns_w1, .btns_w2)").on("click", function () {
    //    location.href = '/Booking/Modify';
    //});
});

//서류 마감일 이후에 스케줄을 검색 했을 경우
$(document).on("click", "#btn_NoSchedule", function () {
    window.history.back();
});



//스케줄 체크 확인
$(document).on("click", "input", function (e) {
    if ($(e.target).attr("id") == "input_bk_Item" || $(e.target).attr("id") == "input_bk_Qty" || $(e.target).attr("id") == "input_bk_GW" || $(e.target).attr("id") == "input_bk_CBM") {
        if (!_CheckSch) {
            $(':focus').blur();
            _fnAlertMsg("스케줄을 검색 후 선택 해주시기 바랍니다.");
        }
    }
});

//스케줄 체크 확인
$(document).on("click", "#input_bk_Remark", function (e) {
    if (!_CheckSch) {
        $(':focus').blur();
        _fnAlertMsg("스케줄을 검색 후 선택 해주시기 바랍니다.");
    }
});


//리스트 클릭 시 class ADD 되게
$(document).on("click", ".list_type1.bk_list tr", function () {
            
    //DocClosing 끝났는지 확인
    if ($(this).closest('tr').find("td").eq(0).text() == "Y") {
        var checkTr = $(this);
        var Tr = checkTr.closest('tr');

        if (!Tr.hasClass("hold")) {
            _CheckSch = true;
            $('.list_type1.bk_list tr').removeClass("hold");
            Tr.addClass("hold");

            $(".right_area").show();
            $(".booking_view").show();

            //0 - 데이터 삽입
            _objData.SCH_NO = _fnToNull($(this).find("input[name='List_SCH_NO']").val());
            _objData.POL_TML_NM = _fnToNull($(this).find("input[name='List_POL_TML_NM']").val());
            _objData.SCH_PIC = _fnToNull($(this).find("input[name='List_SCH_PIC']").val());
            _objData.RMK = _fnToNull($(this).find("input[name='List_RMK']").val());
            _objData.CNTR_TYPE = _fnToNull($(this).find("input[name='List_CNTR_TYPE']").val());

            //데이터 초기화 - 빼는걸로
            //$("#input_bk_Item").val("");
            //$("#input_bk_Qty").val("");
            //$("#input_bk_GW").val("");
            //$("#input_bk_CBM").val("");
            //$("#input_bk_Remark").val("");

            ////첨부파일 버튼 활성화
            $("#bk_file_upload").attr("disabled", false);

            fnMakeBookingDetail();
        }
    } else if ($(this).closest('tr').find("td").eq(0).text() == "N") {
        _fnAlertMsg("서류마감 된 스케줄입니다.");
    }
});

//라디오 버튼 이벤트 (선사 , 훼리 , 항공)
$(document).on("click", "input[name='transfer_TYPE']", function () {

    $("#Btn_BKScheduleMore").hide();
    $("#NoData_BK").show();
    $("#input_Departure").val('');
    $("#input_POL").val('');
    $("#input_Arrival").val('');
    $("#input_POD").val('');
    $(".delete").hide();

    $("#select_CntrType").closest("div").addClass("border-animation");
    $("#select_CntrType option").eq(0).prop("selected", true);
    $("#select_CntrType").prop("disabled", false);
     
    if ($(this).val() == "SEA") {
        _vREQ_SVC = "SEA";                       
    }
    else if ($(this).val() == "FERRY") {
        _vREQ_SVC = "FERRY";        
    }
    else if ($(this).val() == "AIR") {
        _vREQ_SVC = "AIR";
        $("#select_CntrType").closest("div").removeClass("border-animation");
        $("#select_CntrType option[value='L']").prop("selected", true);
        $("#select_CntrType").prop("disabled", true);
    }

    fnALLInit();
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
});

//Departure 클릭 이벤트
$(document).on("click", "#input_Departure", function () {

    if ($(this).val().length == 0) {

        if (_vREQ_SVC == "SEA") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop01");
        }
        else if (_vREQ_SVC == "FERRY") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_FERRY_pop01");
        }
        else if (_vREQ_SVC == "AIR") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
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
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop02");
        }
        else if (_vREQ_SVC == "FERRY") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_FERRY_pop02");
        }
        else if (_vREQ_SVC == "AIR") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_FERRY_pop01").hide();
            $("#select_FERRY_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_AIR_pop02");
        }

    }
});

//아이콘 클릭 시 포트 즐겨찾기 가져오기 - POL
$(document).on("click", "#btn_quick_POL", function () {
    if (_vREQ_SVC == "SEA") {
        selectPopOpen('#select_SEA_pop01');
    }
    else if (_vREQ_SVC == "AIR") {
        selectPopOpen('#select_AIR_pop01');
    }
});

//아이콘 클릭 시 포트 즐겨찾기 가져오기 - POD
$(document).on("click", "#btn_quick_POD", function () {
    if (_vREQ_SVC == "SEA") {
        selectPopOpen('#select_SEA_pop02');
    }
    else if (_vREQ_SVC == "AIR") {
        selectPopOpen('#select_AIR_pop02');
    }
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_SEA_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
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

    //split 해서 네이밍 , POL_CD 넣기
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

//FERRY
//퀵 Code 데이터 - FERRY POL
$(document).on("click", "#quick_FERRY_POLCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_FERRY_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_FERRY_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }


    selectPopOpen("#select_FERRY_pop02");
});

//퀵 Code 데이터 - FERRY POL
$(document).on("click", "#quick_FERRY_POLCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_FERRY_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_FERRY_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    selectPopOpen("#select_FERRY_pop02");
});

//퀵 Code 데이터 - FERRY POD
$(document).on("click", "#quick_FERRY_PODCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_FERRY_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_FERRY_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});

//퀵 Code 데이터 - FERRY POD
$(document).on("click", "#quick_FERRY_PODCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Arrival").val(vSplit[0]);
    $("#input_POD").val(vSplit[1]);
    $("#select_FERRY_pop02").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POD", "Q", "select_FERRY_pop02")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }
});
//FERRY

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    selectPopOpen("#select_AIR_pop02");
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_Departure").val(vSplit[0]);
    $("#input_POL").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    if (_fnCheckSamePort(vSplit[1], "", "POL", "Q", "select_AIR_pop01")) {
        //X박스 만들기
        $(this).closest(".int_box").addClass("has_del");
        $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
    }

    selectPopOpen("#select_AIR_pop02");
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
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

    //split 해서 네이밍 , POL_CD 넣기
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

    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POL").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("#select_SEA_pop01").hide();
        $("#select_FERRY_pop01").hide();
        $("#select_AIR_pop01").hide();
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop01").hide();
        $("#select_FERRY_pop01").hide();
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
            } else {
                ui.item.value = "";
            }
        },
        focus: function (event, ui) {
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//자동완성 기능 - POD
$(document).on("keyup", "#input_Arrival", function () {

    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("#select_SEA_pop02").hide();
        $("#select_FERRY_pop02").hide();
        $("#select_AIR_pop02").hide();
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop02").hide();
        $("#select_FERRY_pop02").hide();
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
            } else {
                ui.item.value = "";
            }
        },
        focus: function (event, ui) {
            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//sort 기능
$(document).on("click", "table[name='BK_Table_List'] th", function () {

    if ($(this).find("button").length > 0) {

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
        if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
            fnGetSEASchedule();
        }
        else if (_vREQ_SVC == "AIR") {
            fnGetAIRSchedule();
        }
    }
});

//Booking 검색 버튼 이벤트
$(document).on("click", "#btn_BK_Search", function () {

    _OrderBy = "";
    _Sort = "";
    _vPage = 0;

    _CheckSch = false; //스케줄 체크 확인 변수
    _vREQ_SVC = $('input[name="transfer_TYPE"]:checked').val();

    if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
        fnGetSEASchedule();
    }
    else if (_vREQ_SVC == "AIR") {
        fnGetAIRSchedule();
    }
});

//Booking 더보기 버튼 이벤트
$(document).on("click", "#Btn_BKScheduleMore button", function () {
    if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
        fnGetSEASchedule();
    }
    else if (_vREQ_SVC == "AIR") {
        fnGetAIRSchedule();
    }
});

//Qty 입력 이벤트
$(document).on("keyup", "#input_bk_Qty", function () {

    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);

    //스케줄 조회 후 스케줄 클릭을 하지 않았다면, 검색 하지 않음.
    if (_fnToNull(_objData.SCH_NO) != "") {

        if ($(this).val().length == 0) {
            $("#booking_detail_tariff").hide();
        } else {
            if (_fnToZero(fnCompareWGT()) != 0) {
                fnGetTariff();
            }
        }
    }
});

//G/W (kg) 입력 이벤트
$(document).on("keyup", "#input_bk_GW", function () {

    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);

    //스케줄 조회 후 스케줄 클릭을 하지 않았다면, 검색 하지 않음.
    if (_fnToNull(_objData.SCH_NO) != "") {

        if ($(this).val().length == 0) {
            $("#booking_detail_tariff").hide();
        } else {
            if (_fnToZero(fnCompareWGT()) != 0) {
                fnGetTariff();
            }
        }
    }
});

//CBM 입력 이벤트
$(document).on("keyup", "#input_bk_CBM", function () {

    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);

    //스케줄 조회 후 스케줄 클릭을 하지 않았다면, 검색 하지 않음.
    if (_fnToNull(_objData.SCH_NO) != "") {

        if ($(this).val().length == 0) {
            $("#booking_detail_tariff").hide();
        } else {
            if (_fnToZero(fnCompareWGT()) != 0) {
                fnGetTariff();
            }
        }
    }
});

//★부킹요청 버튼 클릭 이벤트 
$(document).on("click", "button[name='booking_request']", function () {
    fnSaveBooking();
});

//첨부파일 - 클릭 시 세팅
$(document).on("change", "#bk_file_upload", function () {

    if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {

        if (_fnToNull(_objData.STATUS) == "C") {
            _fnAlertMsg("부킹 취소 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "D") {
            _fnAlertMsg("부킹 삭제 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "F") {
            _fnAlertMsg("부킹 확정 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "O") {
            _fnAlertMsg("부킹 거절 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "Y") {
            _fnAlertMsg("부킹 승인 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }
    } else {
        fnSetFileData("bk_file_upload");
        $(this).val("");
    }
});

//문서 정보 추가
/* 파일 선택 시 파일 리스트 생성하는 함수 */
function fnSetFileData(vFileID) {
    var _arrFileValue = new Array(); //파일 정보 저장

    /* 파일 정보 Array에 저장 */
    for (var i = 0; i < $("#" + vFileID).get(0).files.length; i++) {
        //추후 DB에 제외 확장자 목록 테이블을 넣고 거기서 변경 할 수 있게 조절.
        var vFileExtension = $("#" + vFileID).get(0).files[i].name.substring($("#" + vFileID).get(0).files[i].name.lastIndexOf(".") + 1, $("#" + vFileID).get(0).files[i].name.length);


        //파일 사이즈 10MB 이상일 경우 Exception
        if (10485759 < $("#" + vFileID).get(0).files[i].size) {
            _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
            return false;
        }
        //확장자 Validation - exe,js,asp,jsp,php,java 파일은 파일 저장 X
        if (vFileExtension == "exe" || vFileExtension == "js" || vFileExtension == "asp" || vFileExtension == "jsp" || vFileExtension == "php" || vFileExtension == "java") {
            _fnAlertMsg(vFileExtension + " 확장자는 파일 업로드를 할 수 없습니다.");
            return false;
        }

        $("#" + vFileID).get(0).files[i].SETTIME = _fnGetNowTime();
        $("#" + vFileID).get(0).files[i].FILE_YN = "Y";
        $("#" + vFileID).get(0).files[i].FILE_CRUD = "INSERT";
        $("#" + vFileID).get(0).files[i].IS = "FILE";       //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE
        $("#" + vFileID).get(0).files[i].DOC_NO = "C/I,P/L";
        _arrFileValue.push($("#" + vFileID).get(0).files[i]);

        //SETTIME을 설정하기 위한 sleep 함수
        _fnsleep(50);
    }

    for (var i = 0; i < _arrFileValue.length; i++) {
        _objFile.FILE_INFO.push(_arrFileValue[i]);
    }

    var vHTML = "";
        
    /* 파일 이름 가져오기 */
    $.each($("#" + vFileID)[0].files, function (i) {
        vHTML += "   <tr> ";
        vHTML += "   	<td> ";
        vHTML += "   		<select class=\"select\" name=\"select_FileList_FileSeparation\"> ";
        vHTML += "   			<option value=\"C/I,P/L\" selected=\"\">C/I,P/L</option> ";
        vHTML += "   			<option value=\"Export Contract\">원산지 증명서</option> ";
        vHTML += "   			<option value=\"Customs Clearance\">면장(필증)</option> ";
        vHTML += "   			<option value=\"Insurance InVoice\">보험증권</option> ";
        //vHTML += "   			<option value=\"C/I , P/L\" selected=\"\">C/I , P/L</option> ";
        //vHTML += "   			<option value=\"Export Contract\">원산지 증명서</option> ";
        //vHTML += "   			<option value=\"Customs Clearance\">수출 면장</option> ";
        //vHTML += "   			<option value=\"Certificate of Origin\">수출계약서</option> ";
        //vHTML += "   			<option value=\"기타\">기타</option> ";
        vHTML += "   		</select> ";
        vHTML += "   	</td> ";
        vHTML += "   	<td> ";
        vHTML += "   		<div class=\"file_cover\"> ";
        vHTML += "   			<span class=\"file_name\">" + $("#" + vFileID)[0].files[i].name + "</span> ";
        vHTML += "   			<button type=\"button\" class=\"del\" name=\"BK_FileList_FileDelete\"><span class=\"blind\">삭제</span></button> ";
        vHTML += "   			<input type=\"hidden\" class=\"input_FileList_SEQ\"> ";
        vHTML += "   			<input type=\"hidden\" class=\"input_FileList_SetTime\" name=\"input_FileList_SetTime\" value=\"" + $("#" + vFileID)[0].files[i].SETTIME + "\"> ";
        vHTML += "   		</div> ";
        vHTML += "   	</td> ";
        vHTML += "   </tr> ";
    });
    
    /* 결과값 보여주기 */
    $("#BK_FileList").append(vHTML);

}

//파일 삭제 (화면 상에서만 삭제 처리)
$(document).on("click", "button[name='BK_FileList_FileDelete']", function () {

    var vValue = $(this).parents("tr").find(".input_FileList_SetTime").val();

    //처음 파일 저장시 SETTIME을 주어서 취소 눌렀을 때 그걸 비교하여 li에 있는 값들을 삭제 합니다.
    for (var i = 0; i < _objFile.FILE_INFO.length; i++) {
        if (vValue == _fnToNull(_objFile.FILE_INFO[i]["SETTIME"])) {

            if (_objFile.FILE_INFO[i].constructor.name == "File") {
                _objFile.FILE_INFO[i]["FILE_YN"] = "N";
            }
            else {
                _objFile.FILE_INFO[i]["FILE_CRUD"] = "DELETE";
            }
        }
    }

    $(this).parents("tr").remove();
});

/* 구분이 변경될 때 DOC_NO 변경 */
$(document).on("change", "select[name='select_FileList_FileSeparation']", function () {

    var vValue = $(this).parents("tr").children().children().children(".input_FileList_SetTime").val();

    for (var i = 0; i < _objFile.FILE_INFO.length; i++) { 

        if (vValue == _objFile.FILE_INFO[i]["SETTIME"]) {
            _objFile.FILE_INFO[i]["DOC_NO"] = $(this).find('option:selected').val();
            _objFile.FILE_INFO[i]["FILE_CRUD"] = "UPDATE";

            switch (_objFile.FILE_INFO[i]["DOC_NO"]) {
                case "C/I,P/L":
                    _objFile.FILE_INFO[i]["DOC_TYPE"] = "CIPL";
                case "Export Contract":
                    _objFile.FILE_INFO[i]["DOC_TYPE"] = "CO";
                    break;
                case "Customs Clearance":
                    _objFile.FILE_INFO[i]["DOC_TYPE"] = "CC";
                    break;
                case "Insurance InVoice":
                    _objFile.FILE_INFO[i]["DOC_TYPE"] = "IP";
                    break;
            }

            _objFile.FILE_INFO[i]["UPD_USR"] = $("#Session_USR_ID").val();
        }
    }    
});

//파일 다운로드 로직 
$(document).on("click", "span[name='span_FileList_FileDownload']", function () {
    fnBookingDocDown($(this).parents("div").children(".input_FileList_SEQ").val());
});

//부킹 수정 상태 일 시 리스트로 넘어가는 로직
$(document).on("click", "button[name='booking_list']", function () {

    //TWKIM 20200826 - 목록 눌렀을때 세션 데이터
    //if (_fnToNull(sessionStorage.getItem("DETAIL_TO_BKG_PAGE")) == "BKG_DETAIL") {
    //    sessionStorage.setItem("DETAIL_TO_BKG_PAGE", "BKG_DETAIL_LIST");
    //}

    var vBKG_NO = $(this).siblings("input[type='hidden']").val();
    var objJsonData = new Object();
    objJsonData.BKG_NO = vBKG_NO;
    controllerToLink("Inquiry", "Booking", objJsonData);
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
            //data: callObj,
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

//해상 - 스케줄 리스트 데이터 가져오기
function fnGetSEASchedule() {
    try {

        if (fnVali_Schedule()) {

            var rtnJson;
            var objJsonData = new Object();

            if (_vPage == 0) {
                fnSearchInit();
                objJsonData.PAGE = 1;
                _vPage = 1;
            } else {
                _vPage++;
                objJsonData.PAGE = _vPage;
            }
            
            objJsonData.SCH_NO = "";

            //실제 데이터 전송
            if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
                objJsonData.REQ_SVC = "SEA";
            } else if (_vREQ_SVC == "AIR") {
                objJsonData.REQ_SVC = "AIR";
            }

            if (_vREQ_SVC == "SEA") {
                objJsonData.LINE_TYPE = "L"; //Line(L) : 선사 , Ferry(F) : 훼리
            }
            else if (_vREQ_SVC == "FERRY") {
                objJsonData.LINE_TYPE = "F"; //Line(L) : 선사 , Ferry(F) : 훼리
            }

            objJsonData.CNTR_TYPE = $("#select_CntrType").find("option:selected").val();
            objJsonData.POL = $("#input_Departure").val();
            objJsonData.POL_CD = $("#input_POL").val();
            objJsonData.POD = $("#input_Arrival").val();
            objJsonData.POD_CD = $("#input_POD").val();
            objJsonData.ETD_START = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.ID = "";
            objJsonData.ORDER = "";

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
                url: "/Booking/fnGetSEASchedule",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    //alert(result);
                    $("#NoData_BK").hide();
                    fnMakeSchedule(result);
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
    } catch (e) {
        console.log(e.message);
    }
}

//항공 - 스케줄 리스트 데이터 가져오기
function fnGetAIRSchedule()
{
    try {

        if (fnVali_Schedule()) {
                        
            var objJsonData = new Object();

            if (_vPage == 0) {
                fnSearchInit();
                objJsonData.PAGE = 1;
                _vPage = 1;
            } else {
                _vPage++;
                objJsonData.PAGE = _vPage;
            }

            objJsonData.SCH_NO = "";

            //실제 데이터 전송
            objJsonData.REQ_SVC = "AIR";
            objJsonData.POL = $("#input_Departure").val();
            objJsonData.POL_CD = $("#input_POL").val();
            objJsonData.POD = $("#input_Arrival").val();
            objJsonData.POD_CD = $("#input_POD").val();
            objJsonData.ETD_START = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.ID = "";
            objJsonData.ORDER = "";

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
                url: "/Booking/fnGetAIRSchedule",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    //alert(result);
                    $("#NoData_BK").hide();
                    fnMakeSchedule(result);
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
    } catch (e) {
        console.log(e.message);
    }
}

//스케줄 벨리데이션
function fnVali_Schedule() {

    //ETD를 입력 해 주세요.
    if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
        $("#BK_Table_List th button").removeClass();
        _fnAlertMsg("ETD를 입력 해 주세요. ","input_ETD");
        return false;
    }

    //POL을 입력 해 주세요.
    if (_fnToNull($("#input_Departure").val()) == "") {
        $("#BK_Table_List th button").removeClass();
        _fnAlertMsg("출발 · 도착지를 선택해주세요.","input_Departure");
        return false;
    }

    //POD을 입력 해 주세요. 
    if (_fnToNull($("#input_Arrival").val()) == "") {
        $("#BK_Table_List th button").removeClass();
        _fnAlertMsg("출발 · 도착지를 선택해주세요.","input_Arrival");
        return false;
    }

    return true;
}

//스케줄 번호가 있을 경우 바로 세팅
function fnGetSchedule() {

    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = _fnToNull($("#View_SCH_NO").val())
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.PAGE = "1";

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetSEASchedule",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //alert(result);
                if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    layerPopup2("#layer_NoSchedule");
                } else {
                    $("#NoData_BK").hide();
                    fnSetSearchData(result);
                    fnMakeSchedule(result);
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
        console.log("[Error - fnGetSchedule]" + err.message);
    }
}

//부킹 번호 있을 경우 - 스케줄 수정 데이터 , 부킹 수정 데이터
function fnModifyBooking() {
    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = _fnToNull($("#View_SCH_NO").val())
        objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());        
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.PAGE = "1";

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetModifyBooking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                $("#NoData_BK").hide();
                //alert(result);
                _objData.STATUS = _fnToNull(JSON.parse(result).BK_MST[0]["STATUS"]);
                $("#booking_status_title").text("부킹 상태 : " + _fnToNull(JSON.parse(result).BK_MST[0]["STATUS_NM"]));
                fnSetSearchData(result);
                fnMakeSchedule(result); //스케줄 데이터 그려주기
                fnSetBookingData(result); //부킹 데이터 그려주기
                fnSetFileList(result); //문서 데이터 그려주기        

                //twkim 20210907 데이터 값을 다시 가져오는게 아니라 적힌 운임 데이터를 보여주지
                //if (_fnToZero($("#input_bk_Qty").val()) != 0 && _fnToZero($("#input_bk_GW").val()) != 0 && _fnToZero($("#input_bk_CBM").val()) != 0) {
                //    fnGetTariff(); //타리프 검색
                //}

                $(".right_area").show();
                $(".booking_view").show();

                //서치 버튼 없애기
                $(".search_bar").hide();
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
        console.log("[Error - fnGetSchedule]" + err.message);
    }
}

//클릭 하면 저장 하는거
function fnSaveBooking() {

    try {
        if (fnBKValidation()) {
            //부킹이 있는지 없는지 확인.
            var objJsonData = new Object();

            objJsonData.SCH_NO = _objData.SCH_NO;
            objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());     //부킹번호
            objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
            objJsonData.HP_NO = _fnToNull($("#Session_HP_NO").val());

            if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
                objJsonData.REQ_SVC = "SEA";
            }
            else if (_vREQ_SVC == "AIR") {
                objJsonData.REQ_SVC = "AIR";
            }

            objJsonData.CUST_CD = _fnToNull($("#Session_CUST_CD").val());            
            objJsonData.CUST_NM = _fnToNull($("#Session_CUST_NM").val());            
            objJsonData.STATUS = "Q";
            objJsonData.EMAIL = _fnToNull($("#Session_EMAIL").val());
            objJsonData.RMK = _fnToNull($("#input_bk_Remark").val());
            objJsonData.RMK = objJsonData.RMK.replace(/'/gi, "`").replace(/\[/gi, "{").replace(/\]/gi, "}"); //twkim 대괄호가 JSON 형식으로 보낼때 꼬여서 됨.
            objJsonData.ITEM = _fnToNull($("#input_bk_Item").val());

            if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
                objJsonData.CNTR_TYPE = _objData.CNTR_TYPE;
            }
            else if (_vREQ_SVC == "AIR") {
                objJsonData.CNTR_TYPE = "LCL";
            }           

            //항공 일떄는 무조건 L로 체크            
            if (_objData.CNTR_TYPE == "FCL") {
                objJsonData.LOAD_TYPE = "F";
            }
            else if (_objData.CNTR_TYPE == "LCL") {
                objJsonData.LOAD_TYPE = "L";
            } else {
                if (_vREQ_SVC == "AIR") {
                    objJsonData.LOAD_TYPE = "L";
                } else {
                    objJsonData.LOAD_TYPE = "C";
                }
            }

            //운임
            if (_fnToNull($("#booking_detail_tariff").text()) == "별도문의") {
                objJsonData.PRC = 0;   //운임단가
                objJsonData.CURR_CD = "USD";                                       //화폐코드
            } else {
                objJsonData.PRC = _fnToNull($("#booking_detail_tariff").text().replace(/USD/gi, "").trim());   //운임단가
                objJsonData.CURR_CD = "USD";                                       //화폐코드
            }
            objJsonData.PKG_UNIT = "R";                                        //패키지 단위
            objJsonData.PKG = _fnToZero($("#input_bk_Qty").val());
            objJsonData.GRS_WGT = _fnToZero($("#input_bk_GW").val());
            objJsonData.VOL_WGT = _fnToZero($("#input_bk_CBM").val());

            $.ajax({
                type: "POST",
                url: "/Booking/fnSaveBooking",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    //결과가 괜찮으면
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                        //엘비스 알림 설정 (푸쉬)
                        var pushObj = new Object();
                        pushObj.JOB_TYPE = "BKG";
                        if (objJsonData.STATUS == "Q") {
                            if (_fnToNull($('#View_BKG_NO').val().trim()) != "") {
                                pushObj.MSG = "예약수정 확인해주세요.";
                            } else {
                                pushObj.MSG = "예약요청 확인해주세요.";
                            }
                        } else if (objJsonData.STATUS == "C") {
                            pushObj.MSG = "예약취소 확인해주세요.";
                        }
                        pushObj.REF1 = JSON.parse(result).Table1[0]["BKG_NO"];
                        pushObj.REF2 = "";
                        pushObj.REF3 = "";
                        pushObj.REF4 = "";
                        pushObj.REF5 = JSON.parse(result).Table1[0]["REQ_SVC"];
                        //pushObj.USR_ID = $("#Session_USR_ID").val();
                        pushObj.USR_ID = $("#Session_EMAIL").val();

                        Chathub_Push_Message(pushObj);

                        //메일 전송
                        //smtp.js로 설정하여 보내기
                        //_fnSendEmail("twkim@yjit.co.kr", $("#Session_EMAIL").val(), " [일심]" + JSON.parse(result).Table1[0]["BKG_NO"] + " 부킹요청 안내드립니다.", fnSetEmail_FindPW("부킹 요청 안내 드립니다."));
                        //_fnSendEmail("twkim@yjit.co.kr", "twkim@yjit.co.kr", " [일심]" + JSON.parse(result).Table1[0]["BKG_NO"] + " 부킹요청 안내드립니다.", fnSetEmail_FindPW("부킹 요청 안내 드립니다."));

                        //파일 업로드 함수
                        fnBKFileUpload(JSON.parse(result).Table1[0]["BKG_NO"]);
                        controllerToLink("Inquiry", "Booking", JSON.parse(result).Table1[0]);
                    }
                    if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnAlertMsg("부킹 저장에 실패 하였습니다.");
                        console.log("[Fail : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }
                    if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        _fnAlertMsg("담당자에게 문의 하세요.");
                        console.log("[Error : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
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
    }
    catch (err) {
        $("#ProgressBar_Loading").hide();
        console.log("[Error - fnSaveBooking()]" + err);
    }
}

//부킹 상태 밸리데이션 (수정 할 수 없음)
function fnBKValidation() {

    if (_fnToNull(_objData.STATUS) == "C") {
        _fnAlertMsg("부킹 취소 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }
    
    if (_fnToNull(_objData.STATUS) == "D") {
        _fnAlertMsg("부킹 삭제 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }
    
    if (_fnToNull(_objData.STATUS) == "F") {
        _fnAlertMsg("부킹 확정 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }
    
    if (_fnToNull(_objData.STATUS) == "O") {
        _fnAlertMsg("부킹 거절 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }
    
    if (_fnToNull(_objData.STATUS) == "Y") {
        _fnAlertMsg("부킹 승인 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    return true;
}

function fnBKFileUpload(vMNGT_NO) {
    /* twkim - 파일 업로드 & 삭제 구문 */
    var objSendInfo, vfileData;  //objSendInfo => 삭제하는 로우 값 정렬(Object 형식) / vfileData => Insert 파일 값 정렬(FormData 형식)

    /* 파일 Upload & 파일 삭제 로직*/
    for (var i = 0; i < _objFile.FILE_INFO.length; i++) {
        //FILE_YN이 Y가 아닌 경우는 업로드 / 삭제 불가능
        //                      if (_objFile.FILE_INFO[i]["FILE_YN"] == "Y") {
        //IS FILE(INSERT) => 업로드 / OBJECT(DELETE) => 삭제 로직 
        if (_objFile.FILE_INFO[i]["IS"] == "FILE" && _objFile.FILE_INFO[i]["FILE_YN"] == "Y") { //File 형식이면 Insert 로직 태움            

            vfileData = new FormData(); //Form 초기화
            vfileData.append("fileInput", _objFile.FILE_INFO[i]);

            //추후 세션 값으로 변경
            vfileData.append("DOMAIN", $("#Session_DOMAIN").val());   //로그인한 User의 도메인
            vfileData.append("MNGT_NO", vMNGT_NO); //화주 ID (사업자번호)  
            vfileData.append("INS_USR", $("#Session_USR_ID").val());    //User
            vfileData.append("OFFICE_CD", $("#Session_OFFICE_CD").val()); //회사 코드 
            vfileData.append("SEQ", i); //회사 코드 
            vfileData.append("DOC_NO", _objFile.FILE_INFO[i]["DOC_NO"]);
            vfileData.append("FILE_TYPE", "BKG");

            switch (_objFile.FILE_INFO[i]["DOC_NO"]) {
                case "C/I,P/L":
                    vfileData.append("DOC_TYPE", "CIPL");
                    break;
                case "Export Contract":
                    vfileData.append("DOC_TYPE", "CO");
                    break;
                case "Customs Clearance":
                    vfileData.append("DOC_TYPE", "CC");
                    break;
                case "Insurance InVoice":
                    vfileData.append("DOC_TYPE", "IP");
                    break;
            }

            $.ajax({
                type: "POST",
                url: "/HP_File/Upload_Files",
                dataType: "json",
                async: false,
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: vfileData,
                success: function (result, status, xhr) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        }
                    }
                },
                error: function (xhr, status, error) {
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                    return false;
                }
            });
        } else if (_objFile.FILE_INFO[i]["IS"] == "OBJECT" && _objFile.FILE_INFO[i]["FILE_CRUD"] == "DELETE") { //Object 형식이고 UPDATE 값이면 DOC 데이터 업데이트

            ////삭제로직                    
            var objJsonData = new Object();

            //objJsonData = new Object(); //파일 한개만 보내기 위해서 DB_Info와 FILE_INFO를 재정의                            
            objJsonData.FILE_INFO = new Array();
            objJsonData.FILE_INFO.push(_objFile.FILE_INFO[i]);
            
            $.ajax({
                type: "POST",
                url: "/HP_File/fnDocDeleteFile",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        }
                    }
                }, error: function (xhr, status, error) {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(error);
                }
            });

            console.log("삭제");
        } else if (_objFile.FILE_INFO[i]["IS"] == "OBJECT" && _objFile.FILE_INFO[i]["FILE_CRUD"] == "UPDATE") { //Object 형식이고 DELETE 값이면 데이터 삭제

            //// 데이터 업데이트 로직       
            var objJsonData = new Object();

            //objJsonData = new Object(); //파일 한개만 보내기 위해서 DB_Info와 FILE_INFO를 재정의                            
            objJsonData.FILE_INFO = new Array();
            objJsonData.FILE_INFO.push(_objFile.FILE_INFO[i]);

            //파일 디테일 업데이트
            $.ajax({
                type: "POST",
                url: "/HP_File/fnDocUpdateFile",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        }
                    }
                }, error: function (xhr, status, error) {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(error);
                }
            });
        }
    }
}

//부킹 G/W , CBM R/Ton 계산기
function fnCompareWGT() {

    var vQTY = _fnToNull($("#input_bk_Qty").val());
    var vGW = _fnToNull($("#input_bk_GW").val());    
    var vCBM = _fnToNull($("#input_bk_CBM").val());

    var vGW_KG = 0;
    var vCBM_KG = 0;

    //비교 후
    if (vQTY == "") {
        return 0;
    }

    if (vGW == "") {
        return 0;
    }

    if (vCBM == "") {
        return 0;
    }

    vGW_KG = Number(vGW);
    vCBM_KG = vCBM * 1000;

    //문자가 들어왔을 경우.
    if (vGW_KG == "NaN" || vCBM_KG == "NaN") {
        return 0;
    }

    if (vGW_KG < vCBM_KG) {
        return vCBM_KG / 1000;
    }
    else if (vGW_KG > vCBM_KG) {
        return vGW_KG / 1000;
    }
    else {
        return vGW_KG / 1000;
    }
}

//타리프 데이터 가져오기
function fnGetTariff() {

    try {

        vHTML = "별도문의";

        $("#booking_detail_tariff").text(vHTML);
        $("#booking_detail_tariff2").text(vHTML);
        $("#booking_detail_tariff").show();

        //잠시 웨이팅 
        //부킹이 있는지 없는지 확인.
        //var objJsonData = new Object();
        //
        //objJsonData.OFFICE_CD = _fnToNull($("#Session_OFFICE_CD").val()); 
        //
        //if (_vREQ_SVC == "SEA" || _vREQ_SVC == "FERRY") {
        //    objJsonData.REQ_SVC = "SEA";
        //} else if (_vREQ_SVC == "AIR") {
        //    objJsonData.REQ_SVC = "AIR";
        //}
        //
        //objJsonData.FARE_CD = "OCF";
        //
        //objJsonData.POL = $("#input_Departure").val();
        //objJsonData.POL_CD = $("#input_POL").val();
        //objJsonData.POD = $("#input_Arrival").val();
        //objJsonData.POD_CD = $("#input_POD").val(); 
        //
        //objJsonData.CNTR_TYPE = $("#select_CntrType option:selected").val();
        //objJsonData.ETD = $("#input_ETD").val().replace(/-/gi, "");
        //
        //$.ajax({
        //    type: "POST",
        //    url: "/Booking/fnGetTariff",
        //    async: false,
        //    dataType: "json",
        //    data: { "vJsonData": _fnMakeJson(objJsonData) },
        //    success: function (result) {   
        //        fnMakeTariff(result);
        //    }, error: function (xhr, status, error) {                
        //        _fnAlertMsg("담당자에게 문의 하세요.");
        //        console.log(error);
        //    }            
        //});
    }
    catch (err) {
        console.log("[Error - fnGetTariff()]" + err);
    }
}

//부킹 첨부파일 다운로드
//Pre-alert 다운로드
function fnBookingDocDown(vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = $("#View_BKG_NO").val();              //부킹 번호
        objJsonData.INS_USR = $("#Session_LOC_NM").val();   //부킹 번호
        objJsonData.DOMAIN = $("#Session_DOMAIN").val();    //접속 User
        objJsonData.SEQ = vSEQ;

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
                        window.location = "/HP_File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                    }
                } else {
                    _fnAlertMsg("다운 받을 수 없습니다.");
                }
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnPreAlertDown]" + err.message);
    }
}

//검색 조건 초기화
function fnSearchInit() {
    //초기화
    _objData = new Object();

    $("#View_SCH_NO").val("");
    $("#View_BKG_NO").val("");

    $("#input_bk_Item").val("");
    $("#input_bk_Qty").val("");
    $("#input_bk_GW").val("");
    $("#input_bk_CBM").val("");
    $("#input_bk_Remark").val("");

    $("#BK_FileList").empty(); //파일 리스트 삭제
    $("#BK_Result_AREA").empty();
    $(".booking_view").hide();
}

//선사,훼리,항공 클릭 시 전체 초기화
function fnALLInit() {
    _objData = new Object();
    _objFile = new Object();
    _objFile.FILE_INFO = new Array();

    $("#input_ETD").val(_fnPlusDate(0));
    $("#select_CntrType").eq(0).attr("selected", true);
    $("#input_Departure").val();
    $("#input_POL").val();
    $("#input_Arrival").val();
    $("#input_POD").val();

    $("#BK_FileList").empty(); //파일 리스트 삭제
    $("#BK_Result_AREA").empty();
    $(".booking_view").hide();
    $("#bk_file_upload").attr("disabled", true);
}

//스케줄 자동 검색 후 검색 조건 데이터 채우기
function fnSetSearchData(vJsonData) {
    if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {

        if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "FCL") {
            $("#select_CntrType").val("F").prop('checked', true);
        }
        else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "LCL") {
            $("#select_CntrType").val("L").prop('checked', true);
        }
        else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "CONSOL") {
            $("#select_CntrType").val("C").prop('checked', true);
        }

        if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["REQ_SVC"]) == "AIR") {
            _vREQ_SVC = "AIR";
            $("input:radio[name='transfer_TYPE']:input[value='AIR']").prop('checked', true);
            $("#select_CntrType").val("L").prop('checked', true); //항공은 무조건 LCL로 체크
            $("#select_CntrType").closest("div").removeClass("border-animation");
            $("#select_CntrType").prop("disabled", true);
        } else {
            if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["LINE_TYPE"]) == "L") {
                _vREQ_SVC = "SEA";
                $("input:radio[name='transfer_TYPE']:input[value='SEA']").prop('checked', true);
            } else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["LINE_TYPE"]) == "F") {
                _vREQ_SVC = "FERRY";
                $("input:radio[name='transfer_TYPE']:input[value='FERRY']").prop('checked', true);
            }
        }

        

        $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).Schedule[0]["ETD"].replace(/\./gi, "")))); //ETD
        $("#input_Departure").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_NM"])); //POL_NM
        $("#input_POL").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_CD"])); //POL_CD
        $("#input_Arrival").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_NM"])); //POD_NM
        $("#input_POD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_CD"])); //POD_CD

        $("#AC_Departure_Width .delete").show();
        $("#AC_Arrival_Width .delete").show();
    }
}

/////////////////function MakeList/////////////////////
//SEA 스케줄 만들기
function fnMakeSchedule(vJsonData) {
    var vHTML = "";

    try {
        //스케줄 데이터 만들기
        vResult = JSON.parse(vJsonData).Schedule;
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
            $("#Btn_BKScheduleMore").hide();

            //첨부파일 버튼 비활성화
            $("#bk_file_upload").attr("disabled", true);
        } else {
            if (vResult.length > 0) {
                $.each(vResult, function (i) {

                    if (_fnToNull($("#View_SCH_NO").val()) != "" || _fnToNull($("#View_BKG_NO").val()) != "") {
                        vHTML += "   <tr class=\"hold\"> ";

                        _objData.SCH_NO = _fnToNull(vResult[i]["SCH_NO"]);
                        _objData.POL_TML_NM = _fnToNull(vResult[i]["POL_TML_NM"]);
                        _objData.SCH_PIC = _fnToNull(vResult[i]["SCH_PIC"]);
                        _objData.RMK = _fnToNull(vResult[i]["RMK"]);
                        _objData.CNTR_TYPE = _fnToNull(vResult[i]["CNTR_TYPE"]);

                        $(".right_area").show();
                        $(".booking_view").show();

                        fnMakeBookingDetail();
                    }                    
                    else {
                        vHTML += "   <tr> ";
                    }

                    //스케줄 Doc Closing Time이 넘었는지 확인하는 로직
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "") {
                        vHTML += "   	<td style=\"display:none\">Y</td> ";
                    }
                    else if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        vHTML += "   	<td style=\"display:none\">N</td> ";
                    }
                    else {
                        vHTML += "   	<td style=\"display:none\">Y</td> ";
                    }

                    //twkim 20210713 - Logo가 없을 경우 일심 로고가 찍히게 수정
                    if (_fnToNull(vResult[i]["IMG_PATH"]) == "") {
                        vHTML += "   	<td><img src=\"/Images/logo.png\" alt=\"\"></td> ";
                    } else {
                        vHTML += "   	<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
                    }
                    //vHTML += "   	<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
                    vHTML += "   	<td> ";
                    vHTML += _fnToNull(vResult[i]["LINE_CD"]) + " ";
                    vHTML += _fnToNull(vResult[i]["VSL_VOY"]) + "<br />";

                    //T/S 날짜
                    if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
                        if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
                            vHTML += "" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days";
                        } else {
                            vHTML += "" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day";
                        }
                    } else {
                        vHTML += "0 Day";
                    }

                    //직항 확인
                    if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {
                        vHTML += ", T/S ";
                    } else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {
                        vHTML += ", Direct ";
                    } 
                    vHTML += "   	</td> ";

                    vHTML += "   	<td> ";
                    vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
                    if (_fnToNull(vResult[i]["ETD_HM"]) != "") {
                        vHTML += "<br />" + _fnFormatTime(_fnToNull(vResult[i]["ETD_HM"]));
                    }
                    vHTML += "   	</td> ";
                    vHTML += "   	<td> ";
                    vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');

                    if (_fnToNull(vResult[i]["ETA_HM"]) != "") {
                        vHTML += "<br />" + _fnFormatTime(_fnToNull(vResult[i]["ETA_HM"]));
                    }
                    vHTML += "   	</td> ";

                    //vHTML += "   	<td> ";

                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                        vHTML += "   	<td> ";
                        vHTML += "";
                    } else {
                        if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                            vHTML += "   	<td style='color:red'> ";
                        }
                        else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                            vHTML += "   	<td style='color:orange'> ";
                        } else {
                            vHTML += "   	<td> ";
                        }
                        vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');

                        if (_fnToNull(vResult[i]["DOC_CLOSE_HM"]) != "") {
                            vHTML += "<br />" + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                        }
                    }

                    vHTML += "   	</td> ";
                    //if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    //    vHTML += "";
                    //} else {
                    //    vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
                    //
                    //    if (_fnToNull(vResult[i]["DOC_CLOSE_HM"]) != "") {
                    //        vHTML += "<br />" +_fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                    //    }
                    //}
                    //vHTML += "   	</td> ";

                    
                    vHTML += "   	<td class=\"mobile_layout\" colspan=\"7\"> ";
                    vHTML += "   		<div class=\"layout_type2\"> ";
                    vHTML += "   			<div class=\"row s2\">" + _fnToNull(vResult[i]["LINE_CD"]) + ", " + _fnToNull(vResult[i]["VSL_VOY"])+"</div> ";
                    vHTML += "   			<div class=\"row s3\"> ";
                    vHTML += "   				<table> ";
                    vHTML += "   					<tbody> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Carrier</th> ";
                    //twkim 20210713 - Logo가 없을 경우 일심 로고가 찍히게 수정
                    if (_fnToNull(vResult[i]["IMG_PATH"]) == "") {
                        vHTML += "  					<td><img src=\"/Images/logo.png\" alt=\"\"></td> ";
                    } else {
                        vHTML += "  					<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
                    }
                    //vHTML += "  					<td><img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"\"></td> ";
                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Departure</th> ";

                    vHTML += "   	<td> ";
                    vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")";
                    if (_fnToNull(vResult[i]["ETD_HM"]) != "") {
                        vHTML += "<br />" + _fnToNull(vResult[i]["ETD_HM"]) + "";
                    }
                    vHTML += "   	</td> ";

                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Arrival</th> ";

                    vHTML += "   	<td> ";
                    vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")";

                    if (_fnToNull(vResult[i]["ETA_HM"]) != "") {
                        vHTML += "<br />" + _fnToNull(vResult[i]["ETA_HM"]) + "";
                    }
                    vHTML += "   	</td> ";

                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>Doc Closing</th> ";

                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                        vHTML += "   						<td> ";
                        vHTML += "   						</td> ";
                    } else {

                        if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                            vHTML += "   	<td style='color:red'> ";
                        }
                        else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                            vHTML += "   	<td style='color:orange'> ";
                        } else {
                            vHTML += "   	<td> ";
                        }

                        vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                        vHTML += "   						</td> ";
                    }


                    //vHTML += "   	<td> ";
                    //if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    //    vHTML += "";
                    //} else {
                    //    vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
                    //    vHTML += _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                    //}
                    //vHTML += "   	</td> ";

                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>T/time</th> ";

                    if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
                        if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
                            vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</td> ";
                        } else {
                            vHTML += "   	<td>" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</td> ";
                        }
                    } else {
                        vHTML += "   	<td></td> ";
                    }

                    vHTML += "   						</tr> ";
                    vHTML += "   						<tr> ";
                    vHTML += "   							<th>T/S</th> ";

                    if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {
                        vHTML += "   	<td>T/S</td> ";
                    } else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {
                        vHTML += "   	<td>Direct</td> ";
                    } else {
                        vHTML += "   	<td></td> ";
                    }
                    vHTML += "   						</tr> ";
                    vHTML += "   					</tbody> ";
                    vHTML += "   				</table> ";
                    vHTML += "   			</div> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</td> ";

                    //스케줄 관련 데이터들 모아서 적어두자
                    vHTML += "   	<td style=\"display:none\"> ";
                    vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_NO\"value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\"> ";
                    vHTML += "   	    <input type=\"hidden\" name=\"List_POL_TML_NM\"value=\"" + _fnToNull(vResult[i]["POL_TML_NM"]) + "\"> ";
                    vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_PIC\"value=\"" + _fnToNull(vResult[i]["SCH_PIC"]) + "\"> ";
                    vHTML += "   	    <input type=\"hidden\" name=\"List_RMK\"value=\"" + _fnToNull(vResult[i]["RMK"]) + "\"> ";
                    vHTML += "   	    <input type=\"hidden\" name=\"List_CNTR_TYPE\"value=\"" + _fnToNull(vResult[i]["CNTR_TYPE"]) + "\"> ";
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
                    $("#Btn_BKScheduleMore").show();
                } else {
                    $("#Btn_BKScheduleMore").hide();
                }
            }
            else {
                vHTML += " <span>데이터가 없습니다.</span> ";
                $("#NoData_BK")[0].innerHTML = vHTML;
                $("#NoData_BK").show();
                vHTML = "";
                $("#Btn_BKScheduleMore").hide();
                //첨부파일 버튼 비활성화
                $("#bk_file_upload").attr("disabled", true);
            }
        }

        $("#BK_Result_AREA").eq(0).append(vHTML);
        $("#BK_Result_AREA").show();

    } catch (e) {
        console.log(e.message);
    }
}

//스케줄 클릭 시 디테일 그려주는 로직
function fnMakeBookingDetail() {

    try
    {
        var vHTML = "";

        vHTML += "   <tr> ";
        vHTML += "   	<td colspan=\"2\"> ";
        vHTML += "   		반입지 : " + _objData.POL_TML_NM+" ";
        vHTML += "   	</td> ";
        vHTML += "   </tr> ";
        vHTML += "   <tr> ";
        vHTML += "   	<td colspan=\"2\"> ";
        //vHTML += "   		담당자: 홍길동 대리 <br class=\"mo\" />(XXX-XXXX-XXXX) ";
        vHTML += "   		담당자: " + _objData.SCH_PIC +" ";
        vHTML += "   	</td> ";
        vHTML += "   </tr> ";
        vHTML += "   <tr> ";
        vHTML += "   	<td colspan=\"2\">비고 : " + _objData.RMK +"</td> ";
        vHTML += "   </tr> ";
        vHTML += "   <tr class='pc'> ";
        vHTML += "   	<td>예상견적가 <h1><strong id=\"booking_detail_tariff\" style=\"display:none\">USD 0</strong></h1></td> ";
        vHTML += "   	<td>";

        if (_fnToNull($("#View_BKG_NO").val()) != "") {

            if (_objData.STATUS == "Q") {
                vHTML += "          <button type=\"submit\" name=\"booking_list\" class=\"btn_type1 reverse three\">목록</button> ";
                vHTML += "          <button type=\"submit\" name=\"booking_request\" class=\"btn_type1 reverse three\">수정</button> ";
                vHTML += "          <button type=\"submit\" name=\"booking_cancel\" class=\"btn_type1 reverse three\">취소</button> ";
            } else {
                vHTML += "          <button type=\"submit\" name=\"booking_list\" class=\"btn_type1 reverse\">목록</button> ";
            }

            vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull($("#View_BKG_NO").val()) + "\"> ";
        }
        else {
            vHTML += "          <button type=\"submit\" name=\"booking_request\" class=\"btn_type1 reverse\">부킹요청</button> ";
        }

        vHTML += "      </td> ";
        vHTML += "   </tr> ";
        vHTML += "   <tr class='mo'> ";
        vHTML += "   	<td colspan=\"2\">예상견적가<h1><strong id='booking_detail_tariff2'>별도문의</strong></h1></td> ";
        vHTML += "   </tr> ";
        vHTML += "   <tr class='mo'> ";
        vHTML += "   	<td colspan='2'>";
        vHTML += "   	<div class='btn_flex'>";

        if (_fnToNull($("#View_BKG_NO").val()) != "") {

            if (_objData.STATUS == "Q") {
                vHTML += "          <button type=\"submit\" name=\"booking_list\" class=\"btn_type1 reverse three\">목록</button> ";
                vHTML += "          <button type=\"submit\" name=\"booking_request\" class=\"btn_type1 reverse three\">수정</button> ";
                vHTML += "          <button type=\"submit\" name=\"booking_cancel\" class=\"btn_type1 reverse three\">취소</button> ";
            } else {
                vHTML += "          <button type=\"submit\" name=\"booking_list\" class=\"btn_type1 reverse\">목록</button> ";
            }

            vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull($("#View_BKG_NO").val()) + "\"> ";
        }
        else {
            vHTML += "          <button type=\"submit\" name=\"booking_request\" class=\"btn_type1 reverse\">부킹요청</button> ";
        }

        vHTML += "      </div> ";
        vHTML += "      </td> ";
        vHTML += "   </tr> ";

        $("#booking_detail")[0].innerHTML = vHTML;
    }
    catch (err)
    {
        console.log("[Error : fnMakeBookingDetail]" + err.message);
    }
        
} 


//부킹 취소 버튼 이벤트
$(document).on("click", "button[name='booking_cancel']", function () {
    fnStatusConfirm("부킹 취소를 하시겠습니까?");
});

//부킹 취소 Confirm 확인 버튼 이벤트
$(document).on("click", "#BkgList_Confirm_confirm", function () {
    fnSetCancelStatus();
    layerClose('#Booking_Confirm');
});


//부킹 취소 함수
function fnSetCancelStatus() {
    try {
        var objJsonData = new Object();

        objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());

        $.ajax({
            type: "POST",
            url: "/Booking/fnSetCancelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var pushObj = new Object();
                    pushObj.JOB_TYPE = "BKG";
                    pushObj.MSG = "부킹취소 확인해주세요.";
                    pushObj.REF1 = objJsonData.BKG_NO;
                    pushObj.REF2 = "";
                    pushObj.REF3 = "";
                    pushObj.REF4 = "";
                    pushObj.REF5 = "";
                    pushObj.USR_ID = $("#Session_USR_ID").val();
                    //pushObj.USR_ID = $("#Session_EMAIL").val();

                    Chathub_Push_Message(pushObj);

                    controllerToLink("Inquiry", "Booking", objJsonData.BKG_NO);
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


//부킹 취소 레이어 팝업 켜기
function fnStatusConfirm(msg) {
    $("#BkgList_Confirm .inner").html(msg);
    layerPopup2('#BkgList_Confirm');
    $("#BkgList_Confirm_confirm").focus();
}

//타리프 금액 찍어주기 
function fnMakeTariff(vJsonData) {

    var vHTML = "";

    try {

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            //스케줄 데이터 만들기
            vResult = JSON.parse(vJsonData).Tariff;            

            //토탈 결과
            var vTotal = Number(_fnToNull(vResult[0]["UNIT_PRC"])) * fnCompareWGT() * Number($("#input_bk_Qty").val()); 

            vHTML = _fnToNull(vResult[0]["BILG_CURR_CD"]) + " " + vTotal.toFixed(2);

            $("#booking_detail_tariff").text(vHTML);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML = "별도문의";

            $("#booking_detail_tariff").text(vHTML);
        }

        $("#booking_detail_tariff").show();

    } catch (e) {
        console.log(e.message);
    }
}

//부킹 데이터 찍어주기
function fnSetBookingData(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            //스케줄 데이터 만들기
            vResult = JSON.parse(vJsonData).BK_MST;

            $("#input_bk_Item").val(_fnToNull(vResult[0]["MAIN_ITEM_NM"]));
            $("#input_bk_Qty").val(_fnToNull(vResult[0]["PKG"]));
            $("#input_bk_GW").val(_fnToNull(vResult[0]["GRS_WGT"]));
            $("#input_bk_CBM").val(_fnToNull(vResult[0]["MSRMT"]));
            $("#input_bk_Remark").val(_fnToNull(vResult[0]["RMK"]));          

            _vREQ_SVC = _fnToNull(vResult[0]["REQ_SVC"]);            

            if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                $("#input_bk_Item").attr("disabled", true);
                $("#input_bk_Qty").attr("disabled", true);
                $("#input_bk_GW").attr("disabled", true);
                $("#input_bk_CBM").attr("disabled", true);
                $("#input_bk_Remark").attr("disabled", true);

                $("#input_bk_Item").addClass("disabled");
                $("#input_bk_Qty").addClass("disabled");
                $("#input_bk_GW").addClass("disabled");
                $("#input_bk_CBM").addClass("disabled");
                $("#input_bk_Remark").addClass("disabled");
            }

            var vHTML = "";

            //운임 데이터 보여주기
            if (_fnToZero(vResult[0]["PRC"]) != 0) {
                vHTML = _fnToNull(vResult[0]["CURR_CD"]) + " " + _fnToZero(vResult[0]["PRC"]);
            }
            else {
                vHTML = "별도문의";
            }

            $("#booking_detail_tariff").text(vHTML);
            $("#booking_detail_tariff").show();

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnSetBookingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnSetBookingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetBookingData]" + err.message);
    }
}

//문서 데이터 찍어주기
function fnSetFileList(vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            //스케줄 데이터 만들기
            vResult = JSON.parse(vJsonData).DOC_MST;

            //DOC_TYPE 
            if (vResult != undefined) {
                if (vResult.length > 0) {
                    $.each(vResult, function (i) {

                        //문서 파일 수정
                        vResult[i]["SETTIME"] = _fnGetNowTime(); //파일 구분을 위한 값 "년월일시분초밀리초"
                        vResult[i]["FILE_YN"] = "Y";
                        vResult[i]["FILE_CRUD"] = "SELECT";
                        vResult[i]["IS"] = "OBJECT";             //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE

                        _objFile.FILE_INFO.push(vResult[i]);

                        vHTML += "	<tr>";
                        vHTML += "		<td>";
                        //                  vHTML += "<span class=\"span_FileList_Checkbox\"></span>";
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                            vHTML += "<select class='select' name=\"select_FileList_FileSeparation\" disabled>";
                        }
                        else {
                            vHTML += "<select class='select' name=\"select_FileList_FileSeparation\">";
                        }
                        switch (vResult[i].DOC_TYPE) {
                            case "CIPL":
                                vHTML += "<option value=\"C/I,P/L\" selected>C/I,P/L</option><option value=\"Export Contract\" >원산지 증명서</option><option value=\"Customs Clearance\" >면장(필증)</option><option value=\"Insurance InVoice\">보험증권</option>";
                                break;
                            case "CO":
                                vHTML += "<option value=\"C/I,P/L\">C/I,P/L</option><option value=\"Export Contract\" selected>원산지 증명서</option><option value=\"Customs Clearance\" >면장(필증)</option><option value=\"Insurance InVoice\">보험증권</option>";
                                break;
                            case "CC":
                                vHTML += "<option value=\"C/I,P/L\">C/I,P/L</option><option value=\"Export Contract\">원산지 증명서</option><option value=\"Customs Clearance\" selected>면장(필증)</option><option value=\"Insurance InVoice\">보험증권</option>";
                                break;
                            case "IP":
                                vHTML += "<option value=\"C/I,P/L\">C/I,P/L</option><option value=\"Export Contract\">원산지 증명서</option><option value=\"Customs Clearance\">면장(필증)</option><option value=\"Insurance InVoice\" selected>보험증권</option>";
                                break;
                        }
                        vHTML += "			</select>";
                        vHTML += "		</td>";
                        vHTML += "		<td>";

                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                            vHTML += "               <div class='file_cover no_del'>	";
                        } else {
                            vHTML += "               <div class='file_cover'>	";
                        }

                        vHTML += "                  <span class='file_name' name='span_FileList_FileDownload'>" + vResult[i].FILE_NM + "</span>";
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                        } else {
                            vHTML += "      <button type='button' class='del' name='BK_FileList_FileDelete'><span class='blind'>삭제</span></button>	";
                        }
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SEQ\" value=\"" + vResult[i].SEQ + "\" />";
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SetTime\" id=\"input_FileList_SetTime\" value=\"" + vResult[i].SETTIME + "\"/>";
                        vHTML += "		</td>";
                        vHTML += "	</tr>";

                        _fnsleep(50);
                    });

                    /* 결과값 보여주기 */
                    $("#BK_FileList").append(vHTML);
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetFileList]" + err.message);
    }
}

function fnSetEmail_FindPW(vTitle) {

    var vHTML = "";
    vHTML += "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
    vHTML += "<html xmlns=\"http://www.w3.org/1999/xhtml\">";
    vHTML += "<head>";
    vHTML += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />"
    vHTML += "    <!--[if !mso]><!-->";
    vHTML += "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />";
    vHTML += "    <!--<![endif]-->";
    vHTML += "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    vHTML += "    <title></title>";
    vHTML += "</head>";
    vHTML += "<body style=\"margin: 0; padding: 0;\">";
    vHTML += "   ";
    vHTML += "   <!-- 메일시작 -->";
    vHTML += "   <div style=\"max-width: 700px;margin: 0 auto;width: 100%;\" align=\"center\">";
    vHTML += "      <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" align=\"center\" style=\"margin: 0 auto;\">";
    vHTML += "         <tr>";
    vHTML += "            <td valign=\"middle\" style=\"padding:0 13px;background-color: #04c096;color: #ffffff;font-size: 20px;height:70px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;\">";
    vHTML += "                    <div style='max-width: 610px;margin: 0 auto'> 안녕하세요.일심 로지스타 입니다.</div>";
    vHTML += "            </td>";
    vHTML += "         </tr>";
    vHTML += "         <tr>";
    vHTML += "            <td valign=\"top\" align=\"center\" style=\"padding:80px 0 50px;background-color: #ffffff;color: #666666;font-size: 20px;letter-spacing:-1px;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
    vHTML += "               <span style=\"font-weight: 600;color: #111111;\">" + vTitle + " ";
    vHTML += "            </td>";
    vHTML += "         </tr>";

    //vHTML += "         <tr>";
    //vHTML += "            <td valign=\"top\" style=\"padding:0 13px;\">";
    //vHTML += "               <div style=\"max-width: 610px;margin: 0 auto\">";
    //vHTML += "                  <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"border-top: 2px solid #222222;width: 100%;\">";
    //vHTML += "                <tr>";
    //vHTML += "                        <td valign=\"middle\" align=\"center\" width=\"28%\" style=\"width:28%;padding:0;height:43px;font-size: 14px;color: #333333;background-color: #f8f8f8;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 600;\">";
    //vHTML += "                              <strong>" + vTr + "</strong>";
    //vHTML += "                        </td>  ";
    //vHTML += "                        <td valign=\"middle\" align=\"left\" style=\"padding:0 0 0 20px;height:43px;font-size: 14px;color: #888888;border-bottom: 1px solid #eaeaea;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;\">";
    //vHTML += "                           <Pre>" + vTd + "</Pre> ";
    //vHTML += "                        </td> ";
    //vHTML += "               </tr>";
    //vHTML += "                   </table> ";
    //vHTML += "                 </div> ";
    //vHTML += "             </td>"
    //vHTML += "         </tr>"
    vHTML += "         <tr>"
    vHTML += "            <td valign=\"middle\" align=\"center\" style=\"padding:0 13px;background-color: #f2f2f2;height: 89px;\">"
    vHTML += "               <div style=\"max-width: 610px;margin: 0 auto;\">"
    vHTML += "                  <p style=\"font-size: 13px;color: #999999;font-family:'Noto Sans KR', 'Noto Sans', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;font-weight: 300;margin: 6px 0 0;\">본 메일은 발신 전용이므로 회신할 수 없습니다.</p>"
    vHTML += "               </div>"
    vHTML += "            </td>"
    vHTML += "         </tr>   "
    vHTML += "      </table>"
    vHTML += "   </div>"
    vHTML += "   <!-- //메일시작 -->"
    vHTML += "   "
    vHTML += "   "
    vHTML += "</body>"
    vHTML += "</html>"


    return vHTML;
}
////////////////////////API////////////////////////////

