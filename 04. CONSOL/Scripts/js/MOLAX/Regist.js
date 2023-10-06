////////////////////전역 변수//////////////////////////
var _vPage = 1;
var _OrderBy = "";
var _Sort = "";
var _isSearch = false; //검색 했는지 체크
var _isSchCheck = false; //스케줄 선택 하였는지 체크
var _objData = new Object();
var _objFile_E = new Object(); //파일 object - 수출
var _objFile_I = new Object(); //파일 object - 수입
var _objFileType = new Object(); //파일 object
var _vFileType = "'CIPL','CO','CC','IP'";
////////////////////jquery event///////////////////////
$(function () {
    
    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
    else {
        _objFile_E.FILE_INFO = new Array();
        _objFile_I.FILE_INFO = new Array();

        $('.delete-btn').on('click', function () {
            $(this).siblings().val('');
        });
        $('.btn-arrow').on('click', function () {
            $(this).toggleClass('on');
        });

        $('body').addClass('e-service--sub');
        $("#input_ETD").val(_fnPlusDate(0)); //ETD	 
        //fnSetServiceType("#select_CntrType", "SEA", "");
        fnGetFIleType();

        //스케줄 번호
        if (_fnToNull($("#View_BKG_NO").val()) != "") {             //부킹 번호 있을 시 수정 
            //_CheckSch = true;
            fnModifyBooking();
        } else if (_fnToNull($("#View_SCH_NO").val()) != "") {      //스케줄 번호만 있을 경우 스케줄 조회        
            fnSetScheduleData();
        }
    }
});

//출발지 도착지 삭제 버튼 이벤트
$(document).on("click", ".delete-btn", function () {
    if ($(this).attr("name") == "input_POL") {
        $("#input_POL").text("출발");
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
        $("#input_POD").text("도착");
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
$(document).on("keyup", "#input_auto_POD", function () {
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
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//수입 POL AutoComplete
$(document).on("keyup", "#input_auto_POL", function () {
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
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETD_Icon", function () {
    $("#input_ETD").focus();
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
});

//수출 / 수입 변경 이벤트
$(document).on("change", "#Select_Bound", function () {

    if ($(this).find("option:selected").val() == "E")
    {
        $(".pop__export").show();
        $(".pop__import").hide();
        $('.bk-form-1').removeClass('d-none');
        $('.bk-form-2').addClass('d-none');
        $('.city-text-dpt').text('출발');
        $('.city-text-arrive').text('도착');        
    }
    else if ($(this).find("option:selected").val() == "I")
    {
        $(".pop__export").hide();
        $(".pop__import").show();
        $('.bk-form-1').addClass('d-none');
        $('.bk-form-2').removeClass('d-none');
        $('.city-text-arrive').text('출발');
        $('.city-text-dpt').text('도착');
    }

    fnInitData();

});

//즐겨찾기 포트 선택
$(document).on("click", ".quick_pol_port", function () {

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

    fnShowQuickMenu();
});

//즐겨찾기 포트 선택
$(document).on("click", ".quick_pod_port", function () {

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
});

//스케줄 검색
$(document).on("click", "#btn_Schedule_Search", function () {
    _isSchCheck = false;
    _vPage = 1;
    fnGetSchData();
});

//스케줄 orderby 
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

            $("#Schedule_orderby th button").removeClass("on");
            if (vValue == "desc") {
                $(this).siblings("button").addClass('on');
            } else if (vValue == "desc") {
                $(this).siblings("button").removeClass('on');
            }

            _vPage = 1;
            _OrderBy = $(this).siblings("button").val();
            _Sort = vValue.toUpperCase();
            _isSchCheck = false;
            fnGetSchData();
        }
    }

});

//스케줄 조회 리스트 클릭 이벤트 - pc
$(document).on("click", "#Schedule_AREA_PC tr", function () {
    if (!$(this).hasClass("on")) {
        //초기화
        $("#Schedule_AREA_PC tr").removeClass("on"); //PC
        $("#Schedule_AREA_MO ul").removeClass("on"); //MO

        var vName = $(this).attr("name");
        $(this).addClass("on");
        $("ul[name='" + vName + "']").addClass("on");

        _objData.SCH_NO = _fnToNull($(this).find("input[name='List_SCH_NO']").val());
        _objData.POL_TML_NM = _fnToNull($(this).find("input[name='List_POL_TML_NM']").val());
        _objData.SCH_PIC = _fnToNull($(this).find("input[name='List_SCH_PIC']").val());
        _objData.RMK = _fnToNull($(this).find("input[name='List_RMK']").val());
        _objData.CNTR_TYPE = _fnToNull($(this).find("input[name='List_CNTR_TYPE']").val());

        _isSchCheck = true;
    }     
});

//스케줄 조회 리스트 클릭 이벤트 - mo
$(document).on("click", "#Schedule_AREA_MO ul", function () {
    if (!$(this).hasClass("on")) {
        //초기화
        $("#Schedule_AREA_PC tr").removeClass("on"); //PC
        $("#Schedule_AREA_MO ul").removeClass("on"); //MO

        var vName = $(this).attr("name");
        $(this).addClass("on");
        $("tr[name='" + vName + "']").addClass("on");

        _objData.SCH_NO = _fnToNull($(this).find("input[name='List_SCH_NO']").val());
        _objData.POL_TML_NM = _fnToNull($(this).find("input[name='List_POL_TML_NM']").val());
        _objData.SCH_PIC = _fnToNull($(this).find("input[name='List_SCH_PIC']").val());
        _objData.RMK = _fnToNull($(this).find("input[name='List_RMK']").val());
        _objData.CNTR_TYPE = _fnToNull($(this).find("input[name='List_CNTR_TYPE']").val());

        _isSchCheck = true;
    }
});

//Qty 숫자만 - 수출
$(document).on("keyup", "#input_bk_E_Qty", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);    
});

//G/W 숫자만 - 수출
$(document).on("keyup", "#input_bk_E_GW", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);
});

//CBM 숫자만 - 수출
$(document).on("keyup", "#input_bk_E_CBM", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);
});

//Qty 숫자만 - 수입
$(document).on("keyup", "#input_bk_I_Qty", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);
});

//G/W 숫자만 - 수입
$(document).on("keyup", "#input_bk_I_GW", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);
});

//CBM 숫자만 - 수입
$(document).on("keyup", "#input_bk_I_CBM", function () {
    var vValue = $(this).val();
    vValue = vValue.replace(/[^0-9\.]/gi, "");
    $(this).val(vValue);
});

//NOMI FREE 체크박스 중복 제거
$(document).on("click", "input[name='input_bk_COL18']", function () {
    if (!$(this).is(':checked')) {
        $(this).attr("checked", false);
    } else {
        $("input[name='input_bk_COL18']").attr("checked", false);
        $(this).attr("checked", true);
    }
});

//Fright Terms 체크박스 중복 제거
$(document).on("click", "input[name='input_bk_COL1']", function () {
    if (!$(this).is(':checked')) {
        $(this).attr("checked", false);        
    } else {
        $("input[name='input_bk_COL1']").attr("checked", false);
        $(this).attr("checked", true);
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_bk_COL7", function () {
    var vValue = $("#input_bk_COL7").val();

    if (vValue.length > 0) {
        var vValue_Num = vValue.replace(/[^0-9]/g, "");
        if (vValue != "") {
            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
            $(this).val(vValue);
        }

        //값 벨리데이션 체크
        if (!_fnisDate($(this).val())) {
            $(this).val("");
        }
    }
});

//Fright Terms 체크박스 중복 제거
$(document).on("click", "input[name='input_bk_COL9']", function () {
    if (!$(this).is(':checked')) {
        $(this).attr("checked", false);       

        $.each($("input[name='input_bk_COL9']"), function () {
            if ($(this).val() == "EXW") {
                if (!$(this).is("checked")) {
                    $("#input_bk_COL12").val("");
                    $("#input_bk_COL12").siblings(".delete-btn").hide();
                    $("#input_bk_COL12").attr("disabled", true);
                }
            }
        });
    } else {
        $("input[name='input_bk_COL9']").attr("checked", false);
        $(this).attr("checked", true);

        //EXT가 선택 됐을 경우 
        if ($(this).val() == "EXW") {
            $("#input_bk_COL12").attr("disabled", false);
        } else {
            $("#input_bk_COL12").val("");
            $("#input_bk_COL12").siblings(".delete-btn").hide();
            $("#input_bk_COL12").attr("disabled", true);
        }
    }
});

//파일 업로드 - 수출 (첨부파일)
$(document).on("change", "#bk_file_E_upload", function () {

    if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {

        if (_fnToNull(_objData.STATUS) == "C") {
            alert("부킹 취소 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "D") {
            alert("부킹 삭제 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "F") {
            alert("부킹 확정 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "O") {
            alert("부킹 거절 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "Y") {
            alert("부킹 승인 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }
    } else {
        fnSetFileData("bk_file_E_upload","E");
        $(this).val("");
    }
});

//파일 업로드 - 수입 (첨부파일)
$(document).on("change", "#bk_file_I_upload", function () {

    if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {

        if (_fnToNull(_objData.STATUS) == "C") {
            alert("부킹 취소 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "D") {
            alert("부킹 삭제 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "F") {
            alert("부킹 확정 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "O") {
            alert("부킹 거절 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "Y") {
            alert("부킹 승인 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }
    } else {
        fnSetFileData("bk_file_I_upload", "I");
        $(this).val("");
    }
});

//파일 리스트 삭제
//파일 삭제 (화면 상에서만 삭제 처리) - 수출
$(document).on("click", "button[name='BK_FileList_E_Delete']", function () {

    var vValue = $(this).parents("tr").find(".input_FileList_SetTime").val();

    //처음 파일 저장시 SETTIME을 주어서 취소 눌렀을 때 그걸 비교하여 li에 있는 값들을 삭제 합니다.
    for (var i = 0; i < _objFile_E.FILE_INFO.length; i++) {
        if (vValue == _fnToNull(_objFile_E.FILE_INFO[i]["SETTIME"])) {

            if (_objFile_E.FILE_INFO[i].constructor.name == "File") {
                _objFile_E.FILE_INFO[i]["FILE_YN"] = "N";
            }
            else {
                _objFile_E.FILE_INFO[i]["FILE_CRUD"] = "DELETE";
            }
        }
    }

    $(this).parents("tr").remove();
});

//파일 삭제 (화면 상에서만 삭제 처리) - 수입
$(document).on("click", "button[name='BK_FileList_I_Delete']", function () {

    var vValue = $(this).parents("tr").find(".input_FileList_SetTime").val();

    //처음 파일 저장시 SETTIME을 주어서 취소 눌렀을 때 그걸 비교하여 li에 있는 값들을 삭제 합니다.
    for (var i = 0; i < _objFile_I.FILE_INFO.length; i++) {
        if (vValue == _fnToNull(_objFile_I.FILE_INFO[i]["SETTIME"])) {

            if (_objFile_I.FILE_INFO[i].constructor.name == "File") {
                _objFile_I.FILE_INFO[i]["FILE_YN"] = "N";
            }
            else {
                _objFile_I.FILE_INFO[i]["FILE_CRUD"] = "DELETE";
            }
        }
    }

    $(this).parents("tr").remove();
});

/* 구분이 변경될 때 DOC_NO 변경 - 수출 */
$(document).on("change", "select[name='select_E_FileList']", function () {

    var vValue = $(this).parents("tr").children().children().children(".input_FileList_SetTime").val();

    for (var i = 0; i < _objFile_E.FILE_INFO.length; i++) {

        if (vValue == _objFile_E.FILE_INFO[i]["SETTIME"]) {

            _objFile_E.FILE_INFO[i]["DOC_TYPE"] = $(this).find('option:selected').val();
            _objFile_E.FILE_INFO[i]["DOC_NO"] = fnSetFileType(_objFile_E.FILE_INFO[i]["DOC_TYPE"]);
            _objFile_E.FILE_INFO[i]["FILE_CRUD"] = "UPDATE";
            _objFile_E.FILE_INFO[i]["UPD_USR"] = $("#Session_USR_ID").val();
        }
    }
});

/* 구분이 변경될 때 DOC_NO 변경 - 수입 */
$(document).on("change", "select[name='select_I_FileList']", function () {

    var vValue = $(this).parents("tr").children().children().children(".input_FileList_SetTime").val();

    for (var i = 0; i < _objFile_I.FILE_INFO.length; i++) {

        if (vValue == _objFile_I.FILE_INFO[i]["SETTIME"]) {

            _objFile_I.FILE_INFO[i]["DOC_TYPE"] = $(this).find('option:selected').val();
            _objFile_I.FILE_INFO[i]["DOC_NO"] = fnSetFileType(_objFile_I.FILE_INFO[i]["DOC_TYPE"]);
            _objFile_I.FILE_INFO[i]["FILE_CRUD"] = "UPDATE";
            _objFile_I.FILE_INFO[i]["UPD_USR"] = $("#Session_USR_ID").val();
        }
    }
});

//부킹 요청 - 수출
$(document).on("click", "#btn_E_Request", function () {
    if (confirm("부킹 요청 하시겠습니까?")) {
        fnSaveBooking_E();
    }
});

//부킹 요청 - 수입
$(document).on("click", "#btn_I_Request", function () {
    if (confirm("부킹 요청 하시겠습니까?")) {
        fnSaveBooking_I();
    }
});

//부킹 목록 버튼 이벤트 - 수출
$(document).on("click", "#btn_E_List", function () {
    fnMoveBkList($("#View_BKG_NO").val());
});

//부킹 목록 버튼 이벤트 - 수입
$(document).on("click", "#btn_I_List", function () {
    fnMoveBkList($("#View_BKG_NO").val());
});

//부킹 수정 - 수출
$(document).on("click", "#btn_E_Modify", function () {
    if (confirm("부킹 수정 하시겠습니까?")) {
        fnSaveBooking_E();
    }
});

//부킹 수정 - 수입
$(document).on("click", "#btn_I_Modify", function () {
    if (confirm("부킹 수정 하시겠습니까?")) {
        fnSaveBooking_I();
    }
});

//부킹 취소 - 수출
$(document).on("click", "#btn_E_Delete", function () {
    if (confirm("부킹 취소를 하시겠습니까?")) {
        fnSetCancelStatus();
    }
});

//부킹 취소 - 수입
$(document).on("click", "#btn_I_Delete", function () {
    if (confirm("부킹 취소를 하시겠습니까?")) {
        fnSetCancelStatus();
    }
});

//파일 다운로드 로직 
$(document).on("click", "span[name='span_FileList_FileDownload']", function () {
    fnBookingDocDown($(this).parents("div").children(".input_FileList_SEQ").val());
});

////////////////////////function///////////////////////
//데이터 초기화 (수/출입 변경 시 데이터 초기화)
function fnInitData() {
    try {

        $(".delete-btn").hide();

        //스케줄 검색 화면 초기화
        $("#input_POL").text("출발");
        $("#input_POLCD").val("");
        $("#input_auto_POL").val("");
        $("#input_auto_POLCD").val("");
        $("#input_POD").text("도착");
        $("#input_PODCD").val("");
        $("#input_auto_POD").val("");
        $("#input_auto_PODCD").val("");

        //스케줄 화면 초기화
        $("#Schedule_orderby th button").removeClass("on"); //Order By 초기화

        var vHTML = "";
        //PC
        vHTML += "   <tr> ";
        vHTML += "   	<td class=\"no_data\" colspan=\"6\"></td> ";
        vHTML += "   </tr> ";

        $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

        vHTML = "";

        //MO
        vHTML += "   <ul> ";
        vHTML += "   	<li class=\"no_data\"> ";        
        vHTML += "   	</li> ";
        vHTML += "   </ul> ";

        $("#Schedule_AREA_MO")[0].innerHTML = vHTML;

        //부킹 전역 변수 초기화
        _isSearch = false;
        _isSchCheck = false;
        _objFile_E.FILE_INFO = new Array();
        _objFile_I.FILE_INFO = new Array();

        //부킹 옵션 화면 초기화
        //수출
        $("#input_bk_E_Item").val("");
        $("#input_bk_E_Qty").val("");
        $("#input_bk_E_GW").val("");
        $("#input_bk_E_CBM").val("");
        $("input[name='input_bk_COL18']").attr("checked", false);
        $("input[name='input_bk_COL1']").attr("checked", false);        
        $("#input_bk_COL2").val("");
        $("#input_bk_COL3").attr("checked", false);
        $("#input_bk_COL4").attr("checked", false);
        $("#input_bk_COL5").attr("checked", false);
        $("#input_bk_COL6").attr("checked", false);
        $("#input_bk_COL7").val("");
        $("#input_bk_COL8").val("");
        $("#insert_E_files").empty();

        //수입
        $("#input_bk_I_Item").val("");
        $("#input_bk_I_Qty").val("");
        $("#input_bk_I_GW").val("");
        $("#input_bk_I_CBM").val("");
        $("input[name='input_bk_COL9']").attr("checked", false);
        $("#input_bk_COL10").val("");
        $("#input_bk_COL11").val("");
        $("#input_bk_COL12").val("");
        $("#input_bk_COL13").attr("checked", false);
        $("#input_bk_COL14").attr("checked", false);
        $("#input_bk_COL15").attr("checked", false);
        $("#input_bk_COL16").attr("checked", false);
        $("#input_bk_COL17").val("");
        $("#insert_I_files").empty();
    }
    catch (err) {
        console.log("[Error - fnInitData()]" + err.message);
    }
}

//즐겨찾기 메뉴 띄우기
function fnShowQuickMenu() {
    try {
        if ($("#Select_Bound").find("option:selected").val() == "E") {
            $(".sch-pop--pod--export").show();
        }
        else if ($("#Select_Bound").find("option:selected").val() == "I") {
            $(".sch-pop--pod--import").show();
        }
    }
    catch (err) {
        console.log("[Error - fnShowQuickMenu()]" + err.message);
    }
}

//스케줄 데이터 가져오는 함수
function fnGetSchData() {
    try {

        if (fnGetSchData_Validation()) {
            var objJsonData = new Object();

            objJsonData.SCH_NO = "";
            objJsonData.REQ_SVC = "SEA";
            objJsonData.CNTR_TYPE = $("#select_CntrType").find("option:selected").val();

            if ($("#Select_Bound").find("option:selected").val() == "E") {
                objJsonData.POL = $("#input_POL").text();
                objJsonData.POL_CD = $("#input_POLCD").val();
                objJsonData.POD = $("#input_auto_POD").val();
                objJsonData.POD_CD = $("#input_auto_PODCD").val();
            }
            else if ($("#Select_Bound").find("option:selected").val() == "I") {
                objJsonData.POL = $("#input_auto_POL").val();
                objJsonData.POL_CD = $("#input_auto_POLCD").val();
                objJsonData.POD = $("#input_POD").text();
                objJsonData.POD_CD = $("#input_PODCD").val();
            }
            
            objJsonData.ETD_START = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.ETD_END = "";
            objJsonData.PAGE = _vPage;

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
                url: "/MOLAX/fnGetBkgSchData",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    fnMakeSchList(result);
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnSchPaging(JSON.parse(result).Schedule[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                    }
                }, error: function (xhr, status, error) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("담당자에게 문의 하세요.");
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
        console.log("[Error - fnGetSchData()]" + err.message);
    }
}

//스케줄 조회 밸리데이션
function fnGetSchData_Validation() {
    try {

        //ETD를 입력 해 주세요.
        if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
            alert("ETD를 입력 해 주세요.");
            return false;
        }

        if ($("#Select_Bound").find("option:selected").val() == "E") {
            //POL을 입력 해 주세요.
            if (_fnToNull($("#input_POLCD").val()) == "") {
                alert("출발지를 선택해주세요.");
                return false;
            }

            if (_fnToNull($("#input_auto_POD").val()) == "") {
                alert("도착지를 선택해주세요.");
                return false;
            }
        }
        else if ($("#Select_Bound").find("option:selected").val() == "I") {
            //POL을 입력 해 주세요.
            if (_fnToNull($("#input_auto_POL").val()) == "") {
                alert("출발지를 선택해주세요.");
                return false;
            }

            if (_fnToNull($("#input_PODCD").val()) == "") {
                alert("도착지를 선택해주세요.");
                return false;
            }
        }

        return true;
    }
    catch (err) {
        console.log("[Error - fnGetSchData_Validation]" + err.message);
    }
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnSchPaging(totalData, dataPerPage, pageCount, currentPage) {
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
    vHTML += "      	<a href=\"javascript:;\" class=\"prev-first\" onclick=\"fnSchGoPage(1)\" ><span>맨앞으로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev\" onclick=\"fnSchGoPage(" + prevPage + ")\"><span>이전으로</span></a> ";
    vHTML += "      </li> ";

    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" class=\"active\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        } else {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" onclick=\"fnSchGoPage(" + i + ")\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        }
    }

    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnSchGoPage(" + nextPage + ")\" class=\"next\"><span>다음으로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnSchGoPage(" + totalPage + ")\" class=\"next-last\"><span>맨뒤로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "   </ul> ";

    $("#Paging_Area").append(vHTML);    // 페이지 목록 생성
}

//스케줄 페이징
function fnSchGoPage(vPage) {
    _vPage = vPage;
    fnGetSchData();
}

//파일 문서 타입 데이터 가져오기.
function fnGetFIleType() {
    try {

        var objJsonData = new Object();
        objJsonData.FILE_TYPE = _vFileType;

        $.ajax({
            type: "POST",
            url: "/MOLAX/fnGetFIleType",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _objFileType = JSON.parse(result).FileType;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _objFileType = null;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _objFileType = null;
                }
            }, error: function (xhr, status, error) {
                alert("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnGetFIleType]" + err.message);
    }
}

//문서 정보 추가
/* 파일 선택 시 파일 리스트 생성하는 함수 */
function fnSetFileData(vFileID, vBOUND) {

    try {
        var _arrFileValue = new Array(); //파일 정보 저장

        for (var i = 0; i < $("#" + vFileID).get(0).files.length; i++) {
            var vFileExtension = $("#" + vFileID).get(0).files[i].name.substring($("#" + vFileID).get(0).files[i].name.lastIndexOf(".") + 1, $("#" + vFileID).get(0).files[i].name.length);
            var vFileNM = $("#" + vFileID).get(0).files[i].name;
            //
            //파일명 /, \, +, :, *, &, ?, <, >, |, ", # , % , ^ 금지
            var vFileRegExp = /[\/\\+:*&?<>|\"#%^]/g;
            if (vFileRegExp.test(vFileNM)) {
                alert('파일명에 특수문자를 제거 해주시기 바랍니다. (/, \, +, :, *, &, ?, <, >, |, ", #, % , ^) 금지');
                return false;
            }

            //파일 사이즈 10MB 이상일 경우 Exception
            if (10485759 < $("#" + vFileID).get(0).files[i].size) {
                alert("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                return false;
            }

            //확장자 Validation - exe,js,asp,jsp,php,java 파일은 파일 저장 X
            if (vFileExtension == "exe" || vFileExtension == "js" || vFileExtension == "asp" || vFileExtension == "jsp" || vFileExtension == "php" || vFileExtension == "java") {
                alert(vFileExtension + " 확장자는 파일 업로드를 할 수 없습니다.");
                return false;
            }

            $("#" + vFileID).get(0).files[i].SETTIME = _fnGetNowTime();
            $("#" + vFileID).get(0).files[i].FILE_YN = "Y";
            $("#" + vFileID).get(0).files[i].FILE_CRUD = "INSERT";
            $("#" + vFileID).get(0).files[i].IS = "FILE";       //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE

            //$("#" + vFileID).get(0).files[i].DOC_NO = "C/I,P/L";
            if (_objFileType != null) {
                $("#" + vFileID).get(0).files[i].DOC_TYPE = _objFileType[0].COMN_CD;
            }
            else {
                $("#" + vFileID).get(0).files[i].DOC_TYPE = "CIPL";
            }

            $("#" + vFileID).get(0).files[i].DOC_NO = "";
            _arrFileValue.push($("#" + vFileID).get(0).files[i]);

            //SETTIME을 설정하기 위한 sleep 함수
            _fnsleep(50);
        }

        if (vBOUND == "E") {
            for (var i = 0; i < _arrFileValue.length; i++) {
                _objFile_E.FILE_INFO.push(_arrFileValue[i]);
            }
        } else if (vBOUND == "I") {
            for (var i = 0; i < _arrFileValue.length; i++) {
                _objFile_I.FILE_INFO.push(_arrFileValue[i]);
            }
        }

        var vHTML = "";

        /* 파일 이름 가져오기 */
        $.each($("#" + vFileID)[0].files, function (i) {
            vHTML += "   <tr> ";
            vHTML += "   	<td> ";

            if (vBOUND == "E") {
                vHTML += "   		<select class=\"select\" name=\"select_E_FileList\"> ";
            } else if (vBOUND == "I") {
                vHTML += "   		<select class=\"select\" name=\"select_I_FileList\"> ";
            }

            vHTML += fnMakeFileOption();
            vHTML += "   		</select> ";
            vHTML += "   	</td> ";
            vHTML += "   	<td> ";
            vHTML += "   		<div class=\"file_cover\"> ";
            vHTML += "   			<span class=\"file_name\">" + $("#" + vFileID)[0].files[i].name + "</span> ";

            if (vBOUND == "E") {
                vHTML += "   			<button type=\"button\" class=\"delete-btn\" style=\"display: inline-block;\" name=\"BK_FileList_E_Delete\"><i class=\"xi-close-thin\"></i></button> ";
            } else if (vBOUND == "I") {
                vHTML += "   			<button type=\"button\" class=\"delete-btn\" style=\"display: inline-block;\" name=\"BK_FileList_I_Delete\"><i class=\"xi-close-thin\"></i></button> ";
            }

            vHTML += "   			<input type=\"hidden\" class=\"input_FileList_SEQ\"> ";
            vHTML += "   			<input type=\"hidden\" class=\"input_FileList_SetTime\" name=\"input_FileList_SetTime\" value=\"" + $("#" + vFileID)[0].files[i].SETTIME + "\"> ";
            vHTML += "   		</div> ";
            vHTML += "   	</td> ";
            vHTML += "   </tr> ";
        });

        /* 결과값 보여주기 */
        if (vBOUND == "E") {
            $("#insert_E_files").append(vHTML);
        } else if (vBOUND == "I") {
            $("#insert_I_files").append(vHTML);
        }
    }
    catch (err) {
        console.log(err.message);
        return false;
    }
}

//부킹 저장 , 수정 - 수출
function fnSaveBooking_E() {
    try {
        if (fnBKValidation()) {
            var objJsonData = new Object();

            objJsonData.SCH_NO = _objData.SCH_NO;

            if (_fnToNull($("#View_BKG_NO").val()) == "") {
                objJsonData.BKG_NO = fnGetBKNO();
                objJsonData.BKG_STATUS = "INSERT";
            } else {
                objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());     //부킹번호
                objJsonData.BKG_STATUS = "ELSE";
            }

            objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
            objJsonData.HP_NO = _fnToNull($("#Session_HP_NO").val());
            //objJsonData.POL_CD = $("#input_POL").val();
            //objJsonData.POD_CD = $("#input_POD").val();

            objJsonData.ETD = $("#input_ETD").val().replace(/-/gi, "");

            if (_objData.CNTR_TYPE == "FCL") {
                objJsonData.LOAD_TYPE = "F";
            } else if (_objData.CNTR_TYPE == "LCL" || _objData.CNTR_TYPE == "CONSOL") {
                objJsonData.LOAD_TYPE = "L";
            }

            objJsonData.BOUND = "E";
            objJsonData.REQ_SVC = "SEA";
            objJsonData.CUST_CD = _fnToNull($("#Session_CUST_CD").val());
            objJsonData.CUST_NM = _fnToNull($("#Session_CUST_NM").val());
            objJsonData.STATUS = "Q";
            objJsonData.EMAIL = _fnToNull($("#Session_EMAIL").val());
            objJsonData.ITEM = _fnToNull($("#input_bk_E_Item").val());
            objJsonData.CNTR_TYPE = _objData.CNTR_TYPE;                       

            //운임
            objJsonData.TARRIF_FLAG = "N";
            objJsonData.UNIT_PRC = "0";
            objJsonData.PRC = "0"   //운임단가
            objJsonData.CURR_CD = "USD"  //화폐코드
            objJsonData.PKG_UNIT = "R";  //패키지 단위
            objJsonData.PKG = _fnToZero($("#input_bk_E_Qty").val());
            objJsonData.GRS_WGT = _fnToZero($("#input_bk_E_GW").val());
            objJsonData.VOL_WGT = _fnToZero($("#input_bk_E_CBM").val());

            objJsonData.COL18 = _fnToNull($("input[name='input_bk_COL18']:checked").val()); //Freight Terms
            objJsonData.COL1 = _fnToNull($("input[name='input_bk_COL1']:checked").val()); //Freight Terms
            objJsonData.COL2 = _fnToNull($("#input_bk_COL2").val()); //COMMODITY NAME
            if ($("#input_bk_COL3").is(':checked')) { //2단 금지 화물
                objJsonData.COL3 = "Y";
            } else {
                objJsonData.COL3 = "N";
            }

            if ($("#input_bk_COL4").is(':checked')) { //운송
                objJsonData.COL4 = "Y";
            } else {
                objJsonData.COL4 = "N";
            }

            if ($("#input_bk_COL5").is(':checked')) { //통관
                objJsonData.COL5 = "Y";
            } else {
                objJsonData.COL5 = "N";
            }
            
            if ($("#input_bk_COL6").is(':checked')) { //AMS 자체 신고 시 체크
                objJsonData.COL6 = "Y";
            } else {
                objJsonData.COL6 = "N";
            }

            objJsonData.COL7 = _fnToNull($("#input_bk_COL7").val().replace(/-/gi, "")); //창고반입 예정일
            objJsonData.COL8 = _fnToNull($("#input_bk_COL8").val().replace(/'/gi, "''")); //Remark (안전창고의 경우 한글 아이템명 기입)

            if (fnBKFileUpload(objJsonData.BKG_NO, _objFile_E)) {                
                $.ajax({
                    type: "POST",
                    url: "/MOLAX/fnSaveBooking",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            controllerToLink("BookingList", "MyMenu", JSON.parse(result).Table1[0]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            alert("[fnSaveBooking - Fail]부킹 저장에 실패 하였습니다.");
                            console.log("[Fail : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                            alert("[fnSaveBooking - Error]담당자에게 문의 하세요.");
                            console.log("[Error : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }
                
                    }, error: function (xhr, status, error) {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                        alert("[fnSaveBooking - Ajax Error]담당자에게 문의 하세요.");
                        console.log(error);
                    },
                    beforeSend: function () {
                        $("#ProgressBar_Loading").show(); //프로그래스 바
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                    }
                });
            } else {
                var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

                if (varUA.indexOf('android') > -1) {
                    alert("[안드로이드]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
                    alert("[아이폰]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                }
            }

        }
    }
    catch (err) {
        console.log("[Error - fnSaveBooking_E()" + err.message);
    }
}

//부킹 저장 , 수정 - 수입
function fnSaveBooking_I() {
    try {
        if (fnBKValidation()) {
            var objJsonData = new Object();

            objJsonData.SCH_NO = _objData.SCH_NO;

            if (_fnToNull($("#View_BKG_NO").val()) == "") {
                objJsonData.BKG_NO = fnGetBKNO();
                objJsonData.BKG_STATUS = "INSERT";
            } else {
                objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());     //부킹번호
                objJsonData.BKG_STATUS = "ELSE";
            }

            objJsonData.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
            objJsonData.HP_NO = _fnToNull($("#Session_HP_NO").val());
            //objJsonData.POL_CD = $("#input_POL").val();
            //objJsonData.POD_CD = $("#input_POD").val();
            objJsonData.ETD = $("#input_ETD").val().replace(/-/gi, "");
            if (_objData.CNTR_TYPE == "FCL") {
                objJsonData.LOAD_TYPE = "F";
            } else if (_objData.CNTR_TYPE == "LCL" || _objData.CNTR_TYPE == "CONSOL") {
                objJsonData.LOAD_TYPE = "L";
            }
            objJsonData.BOUND = "I";
            objJsonData.REQ_SVC = "SEA";
            objJsonData.CUST_CD = _fnToNull($("#Session_CUST_CD").val());
            objJsonData.CUST_NM = _fnToNull($("#Session_CUST_NM").val());
            objJsonData.STATUS = "Q";
            objJsonData.EMAIL = _fnToNull($("#Session_EMAIL").val());
            objJsonData.ITEM = _fnToNull($("#input_bk_I_Item").val());
            objJsonData.CNTR_TYPE = _objData.CNTR_TYPE;

            //운임
            objJsonData.TARRIF_FLAG = "N";
            objJsonData.UNIT_PRC = "0";
            objJsonData.PRC = "0"   //운임단가
            objJsonData.CURR_CD = "USD"  //화폐코드
            objJsonData.PKG_UNIT = "R";  //패키지 단위
            objJsonData.PKG = _fnToZero($("#input_bk_I_Qty").val());
            objJsonData.GRS_WGT = _fnToZero($("#input_bk_I_GW").val());
            objJsonData.VOL_WGT = _fnToZero($("#input_bk_I_CBM").val());

            objJsonData.COL9 = _fnToNull($("input[name='input_bk_COL9']:checked").val()); //Freight Terms
            objJsonData.COL10 = _fnToNull($("#input_bk_COL10").val()); //선적지 파트너 or Real shipper 정보입력
            objJsonData.COL11 = _fnToNull($("#input_bk_COL11").val()); //Real Consignee Name
            objJsonData.COL12 = _fnToNull($("#input_bk_COL12").val()); //Pick up address / Cargo dimension 정보(EXW 체크시)

            if ($("#input_bk_COL13").is(':checked')) { //위험물
                objJsonData.COL13 = "Y";
            } else {
                objJsonData.COL13 = "N";
            }

            if ($("#input_bk_COL14").is(':checked')) { //2단 금지 화물
                objJsonData.COL14 = "Y";
            } else {
                objJsonData.COL14 = "N";
            }

            if ($("#input_bk_COL15").is(':checked')) { //운송
                objJsonData.COL15 = "Y";
            } else {
                objJsonData.COL15 = "N";
            }

            if ($("#input_bk_COL16").is(':checked')) { //통관
                objJsonData.COL16 = "Y";
            } else {
                objJsonData.COL16 = "N";
            }
                        
            objJsonData.COL17 = _fnToNull($("#input_bk_COL17").val().replace(/'/gi, "''")); //Remark (안전창고의 경우 한글 아이템명 기입)

            if (fnBKFileUpload(objJsonData.BKG_NO, _objFile_I)) {
                $.ajax({
                    type: "POST",
                    url: "/MOLAX/fnSaveBooking",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            controllerToLink("BookingList", "MyMenu", JSON.parse(result).Table1[0]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            alert("[fnSaveBooking - Fail]부킹 저장에 실패 하였습니다.");
                            console.log("[Fail : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                            alert("[fnSaveBooking - Error]담당자에게 문의 하세요.");
                            console.log("[Error : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }

                    }, error: function (xhr, status, error) {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                        alert("[fnSaveBooking - Ajax Error]담당자에게 문의 하세요.");
                        console.log(error);
                    },
                    beforeSend: function () {
                        $("#ProgressBar_Loading").show(); //프로그래스 바
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                    }
                });
            } else {
                var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

                if (varUA.indexOf('android') > -1) {
                    alert("[안드로이드]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
                    alert("[아이폰]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                }
            }

        }
    }
    catch (err) {
        console.log("[Error - fnSaveBooking_I()" + err.message);
    }
}

//부킹 상태 밸리데이션
function fnBKValidation() {

    if (_fnToNull(_objData.STATUS) == "C") {
        alert("부킹 취소 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "D") {
        alert("부킹 삭제 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "F") {
        alert("부킹 확정 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "O") {
        alert("부킹 거절 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "Y") {
        alert("부킹 승인 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (!_isSchCheck) {
        alert("부킹 스케줄을 선택 해주시기 바랍니다.");
        return false;
    }

    return true;
}

//Booking 채번
function fnGetBKNO() {
    try {
        var vResult = "";

        $.ajax({
            type: "POST",
            url: "/MOLAX/fnGetBKNO",
            async: false,
            dataType: "json",
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    vResult = JSON.parse(result).BKG[0]["BKG_NO"];
                }
                if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("부킹 저장에 실패 하였습니다.");
                    console.log("[Fail : fnGetBKNO()]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log("[Error : fnGetBKNO()]" + JSON.parse(result).Result[0]["trxMsg"]);
                }

            }, error: function (xhr, status, error) {

                alert("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnGetBKNO]" + err.message);
    }
}

//파일 업로드 - 수출
function fnBKFileUpload(vMNGT_NO,vFileObj) {
    try {

        /* 파일 업로드 & 삭제 구문 */
        var vfileData;
        var vReturn = true;

        /* 파일 Upload & 파일 삭제 로직*/
        for (var i = 0; i < vFileObj.FILE_INFO.length; i++) {
            if (vFileObj.FILE_INFO[i]["IS"] == "FILE" && vFileObj.FILE_INFO[i]["FILE_YN"] == "Y") { //File 형식이면 Insert 로직 태움

                vfileData = new FormData(); //Form 초기화
                vfileData.append("fileInput", vFileObj.FILE_INFO[i]);

                //추후 세션 값으로 변경
                vfileData.append("DOMAIN", $("#Session_DOMAIN").val());   //로그인한 User의 도메인
                vfileData.append("MNGT_NO", vMNGT_NO); //화주 ID (사업자번호)  
                vfileData.append("INS_USR", $("#Session_USR_ID").val());    //User
                vfileData.append("OFFICE_CD", $("#Session_OFFICE_CD").val()); //회사 코드 
                vfileData.append("SEQ", i); 
                vfileData.append("FILE_TYPE", "BKG");
                vfileData.append("DOC_TYPE", vFileObj.FILE_INFO[i]["DOC_TYPE"]);
                vfileData.append("DOC_NO", fnSetFileType(vFileObj.FILE_INFO[i]["DOC_TYPE"]));

                $.ajax({
                    type: "POST",
                    url: "/File/Upload_Files",
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
                            } else {
                                vReturn = false;
                            }
                        } else {
                            vReturn = false;
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("[Error]관리자에게 문의 해 주세요. " + status);
                        vReturn = false;
                    }
                });
            } else if (vFileObj.FILE_INFO[i]["IS"] == "OBJECT" && vFileObj.FILE_INFO[i]["FILE_CRUD"] == "DELETE") { //Object 형식이고 UPDATE 값이면 DOC 데이터 업데이트

                ////삭제로직                    
                var objJsonData = new Object();
                objJsonData.FILE_INFO = new Array();
                objJsonData.FILE_INFO.push(vFileObj.FILE_INFO[i]);

                $.ajax({
                    type: "POST",
                    url: "/File/fnDocDeleteFile",
                    async: false,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result != null) {
                            vResult = JSON.parse(result);

                            if (vResult.Result[0].trxCode == "Y") {
                                console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                                console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                            } else {
                                vReturn = false;
                            }
                        } else {
                            vReturn = false;
                        }
                    }, error: function (xhr, status, error) {
                        alert("담당자에게 문의 하세요.");
                        console.log(error);
                        vReturn = false;
                    }
                });

                console.log("삭제");
            } else if (vFileObj.FILE_INFO[i]["IS"] == "OBJECT" && vFileObj.FILE_INFO[i]["FILE_CRUD"] == "UPDATE") { //Object 형식이고 DELETE 값이면 데이터 삭제

                //// 데이터 업데이트 로직       
                var objJsonData = new Object();
                objJsonData.FILE_INFO = new Array();
                objJsonData.FILE_INFO.push(vFileObj.FILE_INFO[i]);

                //파일 디테일 업데이트
                $.ajax({
                    type: "POST",
                    url: "/File/fnDocUpdateFile",
                    async: false,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result != null) {
                            vResult = JSON.parse(result);

                            if (vResult.Result[0].trxCode == "Y") {
                                console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                                console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                            } else {
                                vReturn = false;
                            }
                        } else {
                            vReturn = false;
                        }
                    }, error: function (xhr, status, error) {
                        alert("담당자에게 문의 하세요.");
                        console.log(error);
                        vReturn = false;
                    }
                });
            }
        }

        return vReturn;
    } catch (err) {
        console.log("[Error - fnBKFileUpload]" + err.message);
    }
}

//파일 타입 세팅
function fnSetFileType(vType) {
    try {

        var vResult = "";

        if (_objFileType != null) {
            $.each(_objFileType, function (i) {
                if (vType == _objFileType[i].COMN_CD) {
                    vResult = _objFileType[i].CD_NM;
                }
            });
        }
        else {
            //기본 세팅
            switch (vType) {
                case "CIPL":
                    vResult = "C/I, Packing List";
                    break;
                case "CC":
                    vResult = "Customs Clearance";
                    break;
                case "IP":
                    vResult = "Insurance Policy";
                    break;
                case "CO":
                    vResult = "C/O";
                    break;
            }
        }

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnSetFileType]" + err.message);
    }
}

//스케줄 번호가 있는 상태로 들어왔을 경우
function fnSetScheduleData() {
    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = _fnToNull($("#View_SCH_NO").val())
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.PAGE = "1";

        $.ajax({
            type: "POST",
            url: "/MOLAX/fnGetBkgSchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                
                fnMakeSchList(result);
                $("#Paging_Area").hide();
                //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                //    fnSchPaging(JSON.parse(result).Schedule[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                //}
                fnSetSchedule(result);
                _isSearch = false;
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("담당자에게 문의 하세요.");
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
        console.log("[Error - fnSetSchedule()]" + err.message);
    }
}

//스케줄 자동 검색 후 검색 조건 데이터 채우기
function fnSetSchedule(vJsonData) {
    if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {

        //Service 세팅
        if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "FCL") {
            $("#select_CntrType").val("F").prop('checked', true);
        }
        else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "LCL" || _fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]) == "CONSOL") {
            $("#select_CntrType").val("L").prop('checked', true);
        }

        if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["EX_IM_TYPE"]) == "E") {
            $("#Select_Bound").val("E");
            $(".pop__export").show();
            $(".pop__import").hide();
            $("#input_POL").text(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_NM"])); //POL_NM
            $("#input_POLCD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_CD"])); //POL_CD
            $("#input_auto_POD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_NM"])); //POD_NM
            $("#input_auto_PODCD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_CD"])); //POD_CD
            $("button[name='input_POL']").show();
            $("button[name='input_auto_POD']").show();
            $('.bk-form-1').removeClass('d-none');
            $('.bk-form-2').addClass('d-none');
            $('.city-text-dpt').text('출발');
            $('.city-text-arrive').text('도착');
        }
        else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["EX_IM_TYPE"]) == "I") {
            $("#Select_Bound").val("I");
            $(".pop__export").hide();
            $(".pop__import").show();
            $("#input_auto_POL").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_NM"])); //POL_NM
            $("#input_auto_POLCD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_CD"])); //POL_CD
            $("#input_POD").text(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_NM"])); //POD_NM
            $("#input_PODCD").val(_fnToNull(JSON.parse(vJsonData).Schedule[0]["POD_CD"])); //POD_CD
            $("button[name='input_auto_POL']").show();
            $("button[name='input_POD']").show();
            $('.bk-form-1').addClass('d-none');
            $('.bk-form-2').removeClass('d-none');
            $('.city-text-arrive').text('출발');
            $('.city-text-dpt').text('도착');
        }

        $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).Schedule[0]["ETD"].replace(/\./gi, "")))); //ETD        

        //스케줄 세팅
        $("#Schedule_AREA_PC tr").addClass("on"); //PC
        $("#Schedule_AREA_MO ul").addClass("on"); //MO

        _objData.SCH_NO = _fnToNull(JSON.parse(vJsonData).Schedule[0]["SCH_NO"]);
        _objData.POL_TML_NM = _fnToNull(JSON.parse(vJsonData).Schedule[0]["POL_TML_NM"]);
        _objData.SCH_PIC = _fnToNull(JSON.parse(vJsonData).Schedule[0]["SCH_PIC"]);
        _objData.RMK = _fnToNull(JSON.parse(vJsonData).Schedule[0]["RMK"]);
        _objData.CNTR_TYPE = _fnToNull(JSON.parse(vJsonData).Schedule[0]["CNTR_TYPE"]);

        _isSchCheck = true;
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
            url: "/MOLAX/fnGetModifyBooking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                
                _objData.STATUS = _fnToNull(JSON.parse(result).BK_MST[0]["STATUS"]);                
                fnMakeSchList(result);
                $("#Paging_Area").hide();
                //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                //    fnSchPaging(JSON.parse(result).Schedule[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                //}
                fnSetSchedule(result);                
                fnSetBooking(result); //부킹 데이터 그려주기
                fnSetFileList(result, JSON.parse(result).Schedule[0]["EX_IM_TYPE"]); //문서 데이터 그려주기
                $(".sch-bar").hide(); //서치 버튼 없애기
                _isSearch = false;
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("담당자에게 문의 하세요.");
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

//부킹 데이터 찍어주기
function fnSetBooking(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).BK_MST;

            $("span[name='booking_status_title']").text(_fnToNull(vResult[0]["STATUS_NM"]));

            //부킹 데이터 넣기
            if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["EX_IM_TYPE"]) == "E") {
                //세팅 - 수출
                $("#input_bk_E_Item").val(vResult[0]["MAIN_ITEM_NM"]);
                $("#input_bk_E_Qty").val(vResult[0]["PKG"]);
                $("#input_bk_E_GW").val(_fnToNull(vResult[0]["GRS_WGT"]));
                $("#input_bk_E_CBM").val(_fnToNull(vResult[0]["MSRMT"]));

                //CUSTOM_COL18
                $.each($("input[name='input_bk_COL18']"), function () {
                    if ($(this).val() == _fnToNull(vResult[0]["CUSTOM_COL18"])) {
                        $(this).attr("checked", true);
                    }
                });

                //CUSTOM_COL1
                $.each($("input[name='input_bk_COL1']"), function () {
                    if ($(this).val() == _fnToNull(vResult[0]["CUSTOM_COL1"])) {
                        $(this).attr("checked", true);
                    }
                });

                $("#input_bk_COL2").val(_fnToNull(vResult[0]["CUSTOM_COL2"])); //COMMODITY NAME
                if (_fnToNull(vResult[0]["CUSTOM_COL3"]) == "Y") { //2단 금지 화물
                    $("#input_bk_COL3").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL4"]) == "Y") { //운송
                    $("#input_bk_COL4").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL5"]) == "Y") { //통관
                    $("#input_bk_COL5").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL6"]) == "Y") { //AMS 자체 신고 시 체크
                    $("#input_bk_COL6").attr("checked", true);
                }
                $("#input_bk_COL7").val(_fnFormatDate(_fnToNull(vResult[0]["CUSTOM_COL7"]))); //창고반입 예정일
                $("#input_bk_COL8").val(_fnToNull(vResult[0]["CUSTOM_COL8"])); //Remark

                //버튼 활성화
                $("#btn_E_Request").hide();
                $("#modify_btn_E_List").show();

                if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) == "Q") {
                    $("#btn_E_Modify").show();
                    $("#btn_E_Delete").show();
                }
                else if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) == "Y") {
                    if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["HBL_NO"]) == "") {
                        $("#btn_E_Delete").show();
                    }                    
                }

                //요청 상태를 제외한 나머지는 disbled , readonly 세팅
                if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) != "Q") {
                    $("#input_bk_E_Item").attr("disabled", true);
                    $("#input_bk_E_Qty").attr("disabled", true);
                    $("#input_bk_E_GW").attr("disabled", true);
                    $("#input_bk_E_CBM").attr("disabled", true);
                    $("input[name='input_bk_COL18']").attr("disabled", true);
                    $("input[name='input_bk_COL1']").attr("disabled", true);
                    $("#input_bk_COL2").attr("disabled", true);
                    $("#input_bk_COL3").attr("disabled", true);
                    $("#input_bk_COL4").attr("disabled", true);
                    $("#input_bk_COL5").attr("disabled", true);
                    $("#input_bk_COL6").attr("disabled", true);
                    $("#input_bk_COL7").attr("disabled", true);
                    $("#input_bk_COL8").attr("disabled", true);
                    $("#bk_file_E_upload").attr("disabled", true);
                }
            }
            else if (_fnToNull(JSON.parse(vJsonData).Schedule[0]["EX_IM_TYPE"]) == "I") {
                //세팅 - 수입
                $("#input_bk_I_Item").val(vResult[0]["MAIN_ITEM_NM"]);
                $("#input_bk_I_Qty").val(vResult[0]["PKG"]);
                $("#input_bk_I_GW").val(_fnToNull(vResult[0]["GRS_WGT"]));
                $("#input_bk_I_CBM").val(_fnToNull(vResult[0]["MSRMT"]));

                //CUSTOM_COL9
                $.each($("input[name='input_bk_COL9']"), function () {
                    if ($(this).val() == _fnToNull(vResult[0]["CUSTOM_COL9"])) {
                        $(this).attr("checked", true);
                    }
                });

                $("#input_bk_COL10").val(_fnToNull(vResult[0]["CUSTOM_COL10"])); //선적지 파트너
                $("#input_bk_COL11").val(_fnToNull(vResult[0]["CUSTOM_COL11"])); //Real Consignee Name
                $("#input_bk_COL12").val(_fnToNull(vResult[0]["CUSTOM_COL12"])); //Pick up address
                if (_fnToNull(vResult[0]["CUSTOM_COL13"]) == "Y") { //위험물
                    $("#input_bk_COL13").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL14"]) == "Y") { //2단 금지 화물
                    $("#input_bk_COL14").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL15"]) == "Y") { //운송
                    $("#input_bk_COL15").attr("checked", true);
                }
                if (_fnToNull(vResult[0]["CUSTOM_COL16"]) == "Y") { //통관
                    $("#input_bk_COL16").attr("checked", true);
                }
                $("#input_bk_COL17").val(_fnToNull(vResult[0]["CUSTOM_COL17"])); //Remark

                //버튼 활성화
                $("#btn_I_Request").hide();
                $("#modify_btn_I_List").show();

                if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) == "Q") {
                    $("#btn_I_Modify").show();
                    $("#btn_I_Delete").show();
                }
                else if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) == "Y") {
                    if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["HBL_NO"]) == "") {
                        $("#btn_I_Delete").show();
                    }
                }

                //요청 상태를 제외한 나머지는 disbled , readonly 세팅
                if (_fnToNull(JSON.parse(vJsonData).BK_MST[0]["STATUS"]) != "Q") {
                    $("#input_bk_I_Item").attr("disabled", true);
                    $("#input_bk_I_Qty").attr("disabled", true);
                    $("#input_bk_I_GW").attr("disabled", true);
                    $("#input_bk_I_CBM").attr("disabled", true);
                    $("input[name='input_bk_COL9']").attr("disabled", true);
                    $("#input_bk_COL10").attr("disabled", true);
                    $("#input_bk_COL11").attr("disabled", true);
                    $("#input_bk_COL12").attr("disabled", true);
                    $("#input_bk_COL13").attr("disabled", true);
                    $("#input_bk_COL14").attr("disabled", true);
                    $("#input_bk_COL15").attr("disabled", true);
                    $("#input_bk_COL16").attr("disabled", true);
                    $("#input_bk_COL17").attr("disabled", true);
                    $("#bk_file_I_upload").attr("disabled", true);
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnSetBooking]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnSetBooking]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetBooking]" + err.message);
    }
}

//문서 데이터 찍어주기
function fnSetFileList(vJsonData,vBOUND) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).DOC_MST;

            //DOC_TYPE - PC
            if (vResult != undefined) {
                if (vResult.length > 0) {
                    $.each(vResult, function (i) {

                        //문서 파일 수정
                        vResult[i]["SETTIME"] = _fnGetNowTime(); //파일 구분을 위한 값 "년월일시분초밀리초"
                        vResult[i]["FILE_YN"] = "Y";
                        vResult[i]["FILE_CRUD"] = "SELECT";
                        vResult[i]["IS"] = "OBJECT";             //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE

                        if (vBOUND == "E") {
                            _objFile_E.FILE_INFO.push(vResult[i]);
                        } else if (vBOUND == "I"){
                            _objFile_I.FILE_INFO.push(vResult[i]);
                        }

                        vHTML += "	<tr>";
                        vHTML += "		<td>";
                        
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                            if (vBOUND == "E") {
                                vHTML += "<select class='select' name=\"select_E_FileList\" disabled>";
                            } else if (vBOUND == "I") {
                                vHTML += "<select class='select' name=\"select_I_FileList\" disabled>";
                            }
                        }
                        else {
                            if (vBOUND == "E") {
                                vHTML += "<select class='select' name=\"select_E_FileList\">";
                            } else if (vBOUND == "I") {
                                vHTML += "<select class='select' name=\"select_I_FileList\">";
                            }                            
                        }

                        vHTML += fnMakeFileOption_Modify(vResult[i].DOC_TYPE);
                        vHTML += "			</select>";
                        vHTML += "		</td>";
                        vHTML += "		<td>";

                        //여기서 부터 다시 시작하는거다
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                            vHTML += "               <div class='file_cover no_del'>	";
                        } else {
                            vHTML += "               <div class='file_cover'>	";
                        }

                        vHTML += "                  <span class='file_name' name='span_FileList_FileDownload'>" + vResult[i].FILE_NM + "</span>";
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                        } else {
                            if (vBOUND == "E") {
                                vHTML += "   			<button type=\"button\" class=\"delete-btn\" style=\"display: inline-block;\" name=\"BK_FileList_E_Delete\"><i class=\"xi-close-thin\"></i></button> ";
                            } else if (vBOUND == "I") {
                                vHTML += "   			<button type=\"button\" class=\"delete-btn\" style=\"display: inline-block;\" name=\"BK_FileList_I_Delete\"><i class=\"xi-close-thin\"></i></button> ";
                            }
                        }
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SEQ\" value=\"" + vResult[i].SEQ + "\" />";
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SetTime\" id=\"input_FileList_SetTime\" value=\"" + vResult[i].SETTIME + "\"/>";
                        vHTML += "		</td>";
                        vHTML += "	</tr>";

                        _fnsleep(50);
                    });

                    /* 결과값 보여주기 */
                    if (vBOUND == "E") {
                        $("#insert_E_files").append(vHTML);
                    } else if (vBOUND == "I") {
                        $("#insert_I_files").append(vHTML);
                    }
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

//목록 버튼 이벤트
function fnMoveBkList(vBKG_NO) {
    try {
        var objJsonData = new Object();
        objJsonData.BKG_NO = vBKG_NO;
        controllerToLink("BookingList", "MyMenu", objJsonData);
    }
    catch (err) {
        console.log("[Error - fnMoveBkList()]" + err.message);
    }
}

//부킹 취소 함수
function fnSetCancelStatus() {
    try {
        var objJsonData = new Object();

        objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());
        objJsonData.REG_BKG_NO = _fnToNull($("#View_BKG_NO").val());

        $.ajax({
            type: "POST",
            url: "/MOLAX/fnSetCancelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {         
                    controllerToLink("BookingList", "MyMenu", objJsonData);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    alert("부킹 취소가 실패하였습니다.");
                    console.log("[Fail - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    alert("담당자에게 문의 하세요.");
                    console.log("[Error - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                alert("담당자에게 문의 하세요.");
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

//부킹 첨부파일 다운로드
function fnBookingDocDown(vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = $("#View_BKG_NO").val();      //부킹 번호
        objJsonData.INS_USR = $("#Session_LOC_NM").val();   //부킹 번호
        objJsonData.DOMAIN = $("#Session_DOMAIN").val();    //접속 User
        objJsonData.SEQ = vSEQ;

        $.ajax({
            type: "POST",
            url: "/File/DownloadElvis",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                if (result != "E") {
                    var rtnTbl = JSON.parse(result);
                    rtnTbl = rtnTbl.Path;
                    var file_nm = rtnTbl[0].FILE_NAME;
                    if (_fnToNull(rtnTbl) != "") {
                        window.location = "/File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                    }
                } else {
                    alert("다운 받을 수 없습니다.");
                }
            },
            error: function (xhr, status, error) {
                alert("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnPreAlertDown]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
function fnMakeSchList(vJsonData) {

    try {

        var vHTML = "";

        //2개 (PC하고 모바일하고 따로 만들어야 됨..)
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).Schedule;

            //" + _fnToNull(vResult[i]["LINE_CD"]) + "

            //PC 세팅
            $.each(vResult, function (i) {

                //부킹 스케줄 만들기. 
                vHTML += "   <tr class=\"BkSchList\" name=\"schdule" + i + "_list\"> ";
                vHTML += "   	<td style=\"display:none\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_NO\"value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_POL_TML_NM\"value=\"" + _fnToNull(vResult[i]["POL_TML_NM"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_PIC\"value=\"" + _fnToNull(vResult[i]["SCH_PIC"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_RMK\"value=\"" + _fnToNull(vResult[i]["RMK"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_CNTR_TYPE\"value=\"" + _fnToNull(vResult[i]["CNTR_TYPE"]) + "\"> ";
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"des\"> ";
                vHTML += "   		<div class=\"logo-img\"> ";
                vHTML += "   			<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   		</div> ";
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"des\"> ";
                //TWKIM - 20221102 김미연 담당자 요청으로 선사 LINE은 삭제
                vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                vHTML += "   	</td > ";
                vHTML += "   	<td class=\"des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]);
                vHTML += "   	</td > ";
                vHTML += "   	<td class=\"des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "   	</td > ";
               
                //서류마감일 color_red / color_orange
                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    vHTML += "   	<td class=\"des\"> ";
                    vHTML += "";
                }
                else {
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        vHTML += "   	<td class=\"des color_red\"> ";
                    }
                    else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                        vHTML += "   	<td class=\"des color_orange\"> ";
                    }
                    else {
                        vHTML += "   	<td class=\"txt pr-3\">";
                    }
                    vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";

                    if (_fnToZero(vResult[i]["DOC_CLOSE_HM"]) == 0) {
                        vHTML += "00:00";
                    } else {
                        vHTML += _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                    }
                }

                vHTML += "   	</td > ";
                vHTML += "   	<td class=\"des\"> ";
                if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
                    vHTML += "";
                }
                else {

                    vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";

                    if (_fnToZero(vResult[i]["CARGO_CLOSE_HM"]) == 0) {
                        vHTML += "00:00";
                    } else {
                        vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
                    }
                }
                vHTML += "   	</td > ";                
                vHTML += "   </tr> ";
                //부킹 스케줄 만들기 끝
            });

            $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

            //모바일 화면 작업
            vHTML = "";

            $.each(vResult, function (i) {
                vHTML += "   <ul class=\"info-box py-2 px-1 BkSchList\" name=\"schdule" + i + "_list\"> ";
                vHTML += "   	<li style=\"display:none\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_NO\"value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_POL_TML_NM\"value=\"" + _fnToNull(vResult[i]["POL_TML_NM"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_SCH_PIC\"value=\"" + _fnToNull(vResult[i]["SCH_PIC"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_RMK\"value=\"" + _fnToNull(vResult[i]["RMK"]) + "\"> ";
                vHTML += "   	    <input type=\"hidden\" name=\"List_CNTR_TYPE\"value=\"" + _fnToNull(vResult[i]["CNTR_TYPE"]) + "\"> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Carrier</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += _fnToNull(vResult[i]["VSL_VOY"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Departure</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Arrival</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">D/Closing</p> ";
                

                //서류마감일 color_red / color_orange
                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    vHTML += "   		<p class=\"des\"> ";
                    vHTML += "";
                }
                else {
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        vHTML += "   		<p class=\"des color_red \"> ";
                    }
                    else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                        vHTML += "   		<p class=\"des color_orange \"> ";
                    }
                    else {
                        vHTML += "   		<p class=\"des\"> ";
                    }
                    vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";

                    if (_fnToZero(vResult[i]["DOC_CLOSE_HM"]) == 0) {
                        vHTML += "00:00";
                    } else {
                        vHTML += _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"]));
                    }
                }
                
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">C/Closing</p> ";
                vHTML += "   		<p class=\"des\"> ";
                if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
                    vHTML += "";
                }
                else {

                    vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";

                    if (_fnToZero(vResult[i]["CARGO_CLOSE_HM"]) == 0) {
                        vHTML += "00:00";
                    } else {
                        vHTML += _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"]));
                    }
                }
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   </ul> ";
            });

            $("#Schedule_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"6\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></td> ";
            vHTML += "   </tr> ";

            $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul> ";
            vHTML += "   	<li class=\"no_data\"> ";
            vHTML += "   		<span class=\"font-weight-medium\">데이터가 없습니다.</span> ";
            vHTML += "   	</li> ";
            vHTML += "   </ul> ";

            $("#Schedule_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").hide();
            console.log("[Fail - fnMakeSchList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"10\"><span class=\"font-weight-medium\">관리자에게 문의하세요.</span></td> ";
            vHTML += "   </tr> ";

            $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul> ";
            vHTML += "   	<li class=\"no_data\"> ";
            vHTML += "   		<span class=\"font-weight-medium\">관리자에게 문의하세요.</span> ";
            vHTML += "   	</li> ";
            vHTML += "   </ul> ";

            $("#Schedule_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").hide();
            console.log("[Error - fnMakeSchList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSchList(vJsonData)]" + err.message);
    }
}

//첨부파일 문서 타입 option
function fnMakeFileOption() {
    try {

        var vHTML = "";

        if (_objFileType != null) {
            //그려주기
            $.each(_objFileType, function (i) {
                if (i == 0) {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\" selected>" + _objFileType[i].CD_NM + "</option> ";
                } else {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\">" + _objFileType[i].CD_NM + "</option> ";
                }
            });
        }
        else {
            //기본 타입 세팅
            vHTML += "   			<option value=\"CIPL\" selected>C/I, Packing List</option> ";
            vHTML += "   			<option value=\"CC\">Customs Clearance</option> ";
            vHTML += "   			<option value=\"IP\">Insurance Policy</option> ";
            vHTML += "   			<option value=\"CO\">C/O</option> ";
        }

        return vHTML;

    }
    catch (err) {
        console.log("[Error - fnSetFileSelect]" + err.message);
    }
}

//수정 이후 문서 타입 세팅
function fnMakeFileOption_Modify(vType) {
    try {

        var vHTML = "";

        if (_objFileType != null) {
            //그려주기
            $.each(_objFileType, function (i) {
                if (vType == _objFileType[i].COMN_CD) {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\" selected>" + _objFileType[i].CD_NM + "</option> ";
                } else {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\">" + _objFileType[i].CD_NM + "</option> ";
                }
            });
        }
        else {
            //기본타입
            switch (vType) {
                case "CIPL":
                    vHTML = "<option value=\"CIPL\" selected>C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "CC":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\" selected>Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "IP":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\" selected>Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "CO":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\" selected>C/O</option>";
                    break;
            }
        }

        return vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeFileOption_Modify]" + err.message);
    }
}