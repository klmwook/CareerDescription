////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var _vPage = 1; //페이징
var _vHblNo = "";
var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
var _DocType_MBL = "'MANI','MBL'";
var _DocType_HBL = "'CIPL', 'CHBL' ,'HBL', 'CO', 'CC', 'IP','HDC','AN','DO'"; //INV는 따로
////////////////////jquery event///////////////////////
$(function () {
    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
    else {
        $('body').addClass('e-service--sub');
        $('.delete-btn').on('click', function () {
            $(this).siblings().val('');
        });

        $("#input_ETD").val(_fnPlusDate(0));
        $("#input_ETA").val(_fnPlusDate(14));

        //fnSetServiceType("#select_CntrType", "SEA", "");

        //이메일에서 들어왔을 경우
        if (_fnToNull($("#view_HBL_NO").val())) {
            fnMyBoardSingleSearch($("#view_HBL_NO").val());
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
        alert("ETD cannot be faster than ETA.");
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
        $(this).val(_fnPlusDate(14));
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        alert("ETA cannot be faster than ETD.");
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

//MyBoard 검색
$(document).on("click", "#btn_MyBoard_Search", function () {

    _OrderBy = "";
    _Sort = "";
    _vPage = 1;

    fnMyBoardSearch();
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

            $("#MyBoard_orderby th button").removeClass("on");
            if (vValue == "desc") {
                $(this).siblings("button").addClass('on');
            } else if (vValue == "desc") {
                $(this).siblings("button").removeClass('on');
            }

            _vPage = 1;
            _OrderBy = $(this).siblings("button").val();
            _Sort = vValue.toUpperCase();
            fnMyBoardSearch();
        }
    }
});

//파일 문서 레이어 팝업
$(document).on("click", "a[name='btn_FileList']", function () {
        
    $("#input_MyBoard_File_HBL_NO").val($(this).find("input[name='File_HBL_NO']").val()); //HBL_NO
    $("#input_MyBoard_File_BKG_NO").val($(this).find("input[name='File_BKG_NO']").val()); //HBL_NO
    $("#input_MyBoard_File_INV_NO").val($(this).find("input[name='File_INV_NO']").val()); //HBL_NO

    //레이어 팝업 열기
    magnificPopup.open({
        items: {
            src: '/Popup/MyBoard_FileDownload'
        },
        type: 'ajax',
        closeOnBgClick: false
    }, 0);

});

//Tracking 레이어 팝업 
$(document).on("click", "a[name='btn_Tracking']", function () {    

    if (isTrackingAvailable($(this).find("input[name='Tracking_HBL_NO']").val())) {

        $("#input_Tracking_HBL_NO").val($(this).find("input[name='Tracking_HBL_NO']").val());

        //레이어 팝업 열기
        magnificPopup.open({
            items: {
                src: '/Popup/Tracking'
            },
            type: 'ajax',
            closeOnBgClick: false
        }, 0);
    }
});

//BL 점 클릭 이벤트 - Web Viewer 보여주기
$(document).on("click", "span[name='layer_BLPrintData']", function () {

    var vHBL_NO = $(this).siblings("input[name='HBL_NO']").val();
    var vDOC_TYPE = $(this).siblings("input[name='DOC_TYPE']").val();

    if (vDOC_TYPE == "CHBL") {
        $("#Layer_Iframe_title").text("Check B/L");
    } else if (vDOC_TYPE == "AN") {
        $("#Layer_Iframe_title").text("Arrival Notice");
    }

    fnPrint(vHBL_NO, vDOC_TYPE);
});

//Invoice 점 클릭 이벤트 - Web Viewer 보여주기
$(document).on("click", "span[name='layer_InvPrintData']", function () {
    $("#Layer_Iframe_title").text("Invoice");
    fnPrint($(this).siblings("input[type='hidden']").val(), "INV");
});

////////////////////////function///////////////////////
function fnInitData() {
    try {
        $(".delete-btn").hide();

        //스케줄 검색 화면 초기화
        $("#input_POL").text("Departure");
        $("#input_POLCD").val("");
        $("#input_auto_POL").val("");
        $("#input_auto_POLCD").val("");
        $("#input_POD").text("Arrival");
        $("#input_PODCD").val("");
        $("#input_auto_POD").val("");
        $("#input_auto_PODCD").val("");
        $("#input_HouseBL").val("");

        //스케줄 화면 초기화
        $("#MyBoard_orderby th button").removeClass("on"); //Order By 초기화

        var vHTML = "";
        //PC
        vHTML += "   <tr> ";
        vHTML += "   	<td class=\"no_data\" colspan=\"9\"></td> ";
        vHTML += "   </tr> ";

        $("#MyBoard_Result_AREA_PC")[0].innerHTML = vHTML;

        vHTML = "";

        //MO
        vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
        vHTML += "   	<li class=\"no_data col-12 py-6\"></li> ";
        vHTML += "   </ul> ";

        $("#MyBoard_Result_AREA_MO")[0].innerHTML = vHTML;

        //부킹 전역 변수 초기화
        _isSearch = false;
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

//하나만 검색
function fnMyBoardSingleSearch(vMngt_No) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = _fnToNull(vMngt_No);
        objJsonData.ID = "";
        objJsonData.ORDER = "";
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();        
        objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.PAGE = 1;
        objJsonData.MBL_DOC_TYPE = _DocType_MBL;
        objJsonData.HBL_DOC_TYPE = _DocType_HBL;

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnGetBoradData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeMyBoardList(result);
                fnSetSearchData(result);
                $("#Paging_Area").hide();
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
    catch (err) {
        console.log("[Error - fnMyBoardSingleSearch]" + err.message);
    }
}

//MyBoard 검색
function fnMyBoardSearch() {
    try {

        var objJsonData = new Object();

        objJsonData.MNGT_NO = "";
        objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();
        objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());

        objJsonData.REQ_SVC = "SEA";
        objJsonData.CNTR_TYPE = $("#select_CntrType option:selected").val();
        objJsonData.EX_IM_TYPE = $("#Select_Bound option:selected").val();
        objJsonData.ETD_ETA = $("#Select_ETD_ETA option:selected").val();
        objJsonData.STRT_YMD = $("#input_ETD").val().substring(0, 10).replace(/-/gi, "");
        objJsonData.END_YMD = $("#input_ETA").val().substring(0, 10).replace(/-/gi, "");

        if ($("#Select_Bound").find("option:selected").val() == "E") {
            if ($("#input_POL").text() == "Departure") {
                objJsonData.POL = "";
            } else {
                objJsonData.POL = $("#input_POL").text();
            }
            objJsonData.POL_CD = $("#input_POLCD").val();            
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

        objJsonData.HBL_NO = _fnToNull($("#input_HouseBL").val());

        objJsonData.MBL_DOC_TYPE = _DocType_MBL;
        objJsonData.HBL_DOC_TYPE = _DocType_HBL;
        objJsonData.PAGE = _vPage;

        if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
            objJsonData.ID = _OrderBy;
            objJsonData.ORDER = _Sort;
        } else {
            objJsonData.ID = "";
            objJsonData.ORDER = "";
        }

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnGetBoradData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeMyBoardList(result);
                if (result != null) {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        fnMyBoardPaging(JSON.parse(result).BOARD[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                    }
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
        console.log("[Error - fnMyBoardSearch]" + err.message);
    }
}

//MyBoard 밸리데이션
function fnMyBoardSearch_Validation() {
    try {

        if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
            alert("Please enter ETD.");
            return false;
        }

        if (_fnToNull($("#input_ETA").val().replace(/-/gi, "")) == "") {
            alert("Please enter ETA.");
            return false;
        }

    }
    catch (err) {
        console.log("[Error - fnMyBoardSearch_Validation]" + err.message);
        return false;
    }
}

//이메일 검색 후 검색 조건 데이터 채우기
function fnSetSearchData(vJsonData) {
    try {
        if (_fnToNull(JSON.parse(vJsonData).Result[0]["trxCode"]) == "Y") {
            //Service 세팅
            if (_fnToNull(JSON.parse(vJsonData).BOARD[0]["CNTR_TYPE"]) == "FCL") {
                $("#select_CntrType").val("F").prop('checked', true);
            }
            else if (_fnToNull(JSON.parse(vJsonData).BOARD[0]["CNTR_TYPE"]) == "LCL" || _fnToNull(JSON.parse(vJsonData).BOARD[0]["CNTR_TYPE"]) == "CONSOL") {
                $("#select_CntrType").val("L").prop('checked', true);
            }

            if (_fnToNull(JSON.parse(vJsonData).BOARD[0]["EX_IM_TYPE"]) == "E") {
                $("#Select_Bound").val("E");
                $(".pop__export").show();
                $(".pop__import").hide();
                $('.city-text-dpt').text('Departure');
                $('.city-text-arrive').text('Arrival');
                $("#input_POL").text(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_NM"]));
                $("#input_POLCD").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_CD"]));
                $("button[name='input_auto_POD']").show();
                $("#input_auto_POD").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POD_NM"]));
                $("#input_auto_PODCD").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_CD"]));
            }
            else if (_fnToNull(JSON.parse(vJsonData).BOARD[0]["EX_IM_TYPE"]) == "I") {
                $("#Select_Bound").val("I");
                $(".pop__export").hide();
                $(".pop__import").show();
                $('.city-text-arrive').text('Departure');
                $('.city-text-dpt').text('Arrival');
                $("#input_auto_POL").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_NM"]));
                $("#input_auto_POLCD").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_CD"]));
                $("button[name='input_auto_POL']").show();
                $("#input_POD").text(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POD_NM"]));
                $("#input_PODCD").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["POL_CD"]));
            }

            $("#input_ETD").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BOARD[0]["ETD"].replace(/\./gi, "")))); //ETD
            if (_fnToNull(JSON.parse(vJsonData).BOARD[0]["ETA"]) != "") {
                $("#input_ETA").val(_fnFormatDate(_fnToNull(JSON.parse(vJsonData).BOARD[0]["ETA"].replace(/\./gi, "")))); //ETA
            }

            $("#input_HouseBL").val(_fnToNull(JSON.parse(vJsonData).BOARD[0]["HBL_NO"]));
            $("#input_HouseBL").siblings(".delete-btn").show();
        }
    }
    catch (err) {
        console.log("[Error - fnSetSearchData]" + err.message);
    }
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnMyBoardPaging(totalData, dataPerPage, pageCount, currentPage) {
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
    vHTML += "      	<a href=\"javascript:;\" class=\"prev-first\" onclick=\"fnMyBoardGoPage(1)\" ><span>To the front</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev\" onclick=\"fnMyBoardGoPage(" + prevPage + ")\"><span>Before</span></a> ";
    vHTML += "      </li> ";

    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" class=\"active\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        } else {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" onclick=\"fnMyBoardGoPage(" + i + ")\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        }
    }

    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnMyBoardGoPage(" + nextPage + ")\" class=\"next\"><span>Next</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnMyBoardGoPage(" + totalPage + ")\" class=\"next-last\"><span>At the very end</span></a> ";
    vHTML += "      </li> ";
    vHTML += "   </ul> ";

    $("#Paging_Area").append(vHTML);    // 페이지 목록 생성
}

function fnMyBoardGoPage(vPage) {
    _vPage = vPage;
    fnMyBoardSearch();
}

//Tracking 가능한지 체크 로직
function isTrackingAvailable(vHBL_NO) {
    try {

        var objJsonData = new Object();
        var vResult = false;

        objJsonData.HBL_NO = vHBL_NO;

        $.ajax({
            type: "POST",
            url: "/MyMenu/isTrackingAvailable",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    if (JSON.parse(result).Available[0]["CHKBL_YN"] == "Y") {
                        vResult = true;
                    } else {
                        vResult = false;
                        alert("Please submit the B/L first.");
                    }
                } else {
                    alert("There is no tracking information.");
                    vResult = false;
                }
            }, error: function (xhr, status, error) {                
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });

        return vResult;

    } catch (err) {
        console.log("[Error - isTrackingAvailable]");
    }
}

//BL 출력 함수
function fnPrint(vHBL, vDocType) {

    try {

        var vResult;
        vResult = fnGetPrintData(vHBL, vDocType); //BL 데이터 가져오기

        if (JSON.parse(vResult).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vResult).Print[0];

            var objJsonData = new Object();

            objJsonData.FILE_NM = vResult.FILE_NM;
            objJsonData.MNGT_NO = vResult.MNGT_NO;              //부킹 번호
            objJsonData.INS_USR = $("#Session_LOC_NM").val();   //부킹 번호
            objJsonData.DOMAIN = $("#Session_DOMAIN").val();    //접속 User
            objJsonData.SEQ = vResult.SEQ;

            $.ajax({
                type: "POST",
                url: "/File/DownloadElvis",
                async: false,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result, status, xhr) {
                    //alert(result);
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
                                    $("#Only_Iframe").attr("src", "/web/viewer.html?file=/Content/TempFiles/" + file_nm);
                                    layerPopup2('#Only_Iframe_pop');
                                }
                            } else {
                                window.location = "/HP_File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                            }
                    
                        }
                    } else {
                        alert("Unable to download.");
                    }
                },
                error: function (xhr, status, error) {
                    alert("[Error]Please contact the administrator. " + status);
                    return;
                }
            });
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "N") {
            alert("This printout cannot be downloaded");
            console.log("[Fail]fnPrint" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "E") {
            alert("This printout cannot be downloaded");
            console.log("[Error]fnPrint" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }

    } catch (err) {
        console.log("[Error]fnPrint" + err);
    }
}

//BL 출력 함수 데이터 가져오기
function fnGetPrintData(vHBL, vDocType) {

    try {
        var vResult;

        var objJsonData = new Object();
        objJsonData.HBL_NO = vHBL;
        objJsonData.DOC_TYPE = vDocType;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/MyMenu/fnGetPrintData",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                vResult = result;
            },
            error: function (xhr, status, error) {
                alert("[Error]Please contact the administrator. " + status);
                return;
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error]fnGetBLPrintData" + err);
    }
}


/////////////////function MakeList/////////////////////
function fnMakeMyBoardList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).BOARD;

            
            //데이터 반복문 - //PC
            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td> ";
                vHTML += "   		<div> ";
                if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                    vHTML += "   			<img class=\"td-icon td-icon--1\" src=\"/Images/Masstige/e-service/export-icon.png\" alt=\"export\" /> ";
                }
                else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                    vHTML += "   			<img class=\"td-icon td-icon--2\" src=\"/Images/Masstige/e-service/import-icon.png\" alt=\"import\" /> ";
                }
                vHTML += "   		</div> ";
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt font-sub pr-4 font-weight-medium\">";
                vHTML += _fnToNull(vResult[i]["HBL_NO"]);
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"txt\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POL_NM"]);
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"txt\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POD_NM"]) + "";
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt doc\"> ";
                if (_fnToNull(vResult[i].FILE_CNT) == "0") {
                    vHTML += "   		<a href=\"javascript:void(0)\"> ";
                    vHTML += "   			<span class=\"count\">0</span> ";
                    vHTML += "   		</a> ";
                } else {
                    vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_FileList\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                    vHTML += "   			<span class=\"count\">" + _fnToNull(vResult[i].FILE_CNT) + "</span> ";
                    vHTML += "   		</a> ";
                }                
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   		<span class=\"success-btn btn1 icn_state3\"></span> ";
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"txt\"> ";

                if (_fnToNull(vResult[i]["IS_CHKBL_YN"]) == "Y") {
                    vHTML += "   		<span class=\"success-btn btn2 icn_state3\" name=\"layer_BLPrintData\"></span> ";
                    vHTML += "          <input type=\"hidden\" name=\"HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";

                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                        vHTML += "          <input type=\"hidden\" name=\"DOC_TYPE\" value=\"CHBL\"> ";
                    }
                    else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                        vHTML += "          <input type=\"hidden\" name=\"DOC_TYPE\" value=\"AN\"> ";
                    }
                }
                else if (_fnToNull(vResult[i]["IS_CHKBL_YN"]) == "N") {
                    vHTML += "   		<span class=\"success-btn btn2 icn_state3\" onclick=\"alert('There is no CheckB/L.')\"></span> ";
                }
                
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt\"> ";
                if (_fnToNull(vResult[i].INV_NO) != "") {
                    if (_fnToNull(vResult[i].INV_YN) == "Y") {
                        vHTML += "   		<span class=\"success-btn btn3 icn_state3\" name=\"layer_InvPrintData\"></span> ";
                        vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    } else {
                        vHTML += "   		<span class=\"success-btn btn3 icn_state2\"></span> ";
                    }
                } else {
                    vHTML += "   		<span class=\"success-btn btn3 icn_state1\"></span> ";
                }
                vHTML += "   	</td> ";

                //화물추적
                vHTML += "   	<td class=\"txt\"> ";                
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Tracking\">";
                vHTML += "              Tracking";
                vHTML += "              <input type=\"hidden\" name=\"Tracking_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                vHTML += "          </a > ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
            });

            $("#MyBoard_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //데이터 반복문 - MO
            $.each(vResult, function (i) {

                vHTML += "   <ul class=\"info-box py-2 px-1\"> ";                
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                    vHTML += "   		<p class=\"title tit-type--1\">Export</p> ";
                    vHTML += "   		<div class=\"logo-img\"> ";
                    vHTML += "   			<img class=\"td-icon td-icon--1\" src=\"/Images/Masstige/e-service/export-icon.png\" alt=\"export\" /> ";                    
                    vHTML += "   		</div> ";
                }
                else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                    vHTML += "   		<p class=\"title tit-type--2\">Import</p> ";
                    vHTML += "   		<div class=\"logo-img\"> ";                    
                    vHTML += "   			<img class=\"td-icon td-icon--2\" src=\"/Images/Masstige/e-service/import-icon.png\" alt=\"import\" /> ";
                    vHTML += "   		</div> ";
                }
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">House B/L</p> ";
                vHTML += "   		<p class=\"des des--bl des\"> ";
                vHTML += _fnToNull(vResult[i]["HBL_NO"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Departure</p> ";
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\">		 ";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POL_NM"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Arrival</p> ";
                vHTML += "   		<p class=\"text-gray-6 common-text--14 des\"> ";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POD_NM"]) + "";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt doc info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Document</p> ";
                vHTML += "   		<p class=\"des\"> ";
                if (_fnToNull(vResult[i].FILE_CNT) == "0") {
                    vHTML += "   	<a href=\"javascript:void(0)\"> ";
                    vHTML += "   		<span class=\"count\">0</span> ";
                    vHTML += "   	</a> ";
                } else {
                    vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_FileList\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                    vHTML += "   			<span class=\"count\">" + _fnToNull(vResult[i].FILE_CNT) + "</span> ";
                    vHTML += "   		</a> ";
                }
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Booking</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += "   		<span class=\"success-btn btn1 icn_state3\"></span> ";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">B/L</p> ";
                vHTML += "   		<p class=\"des\"> ";

                if (_fnToNull(vResult[i]["IS_CHKBL_YN"]) == "Y") {
                    vHTML += "   		<span class=\"success-btn btn1 icn_state3\" name=\"layer_BLPrintData\"></span> ";
                    vHTML += "          <input type=\"hidden\" name=\"HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";

                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                        vHTML += "          <input type=\"hidden\" name=\"DOC_TYPE\" value=\"CHBL\"> ";
                    }
                    else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                        vHTML += "          <input type=\"hidden\" name=\"DOC_TYPE\" value=\"AN\"> ";
                    }
                }
                else if (_fnToNull(vResult[i]["IS_CHKBL_YN"]) == "N") {
                    vHTML += "   		<span class=\"success-btn btn1 icn_state3\" onclick=\"alert('There is no CheckB/L.')\"></span> ";
                }

                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Invoice</p> ";
                vHTML += "   		<p class=\"des\"> ";
                if (_fnToNull(vResult[i].INV_NO) != "") {
                    if (_fnToNull(vResult[i].INV_YN) == "Y") {
                        vHTML += "   		<span class=\"success-btn btn3 icn_state3\" name=\"layer_InvPrintData\"></span> ";
                        vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    } else {
                        vHTML += "   		<span class=\"success-btn btn3 icn_state2\"></span> ";
                    }
                } else {
                    vHTML += "   		<span class=\"success-btn btn3 icn_state1\"></span> ";
                }
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\">		 ";
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Tracking\"> ";
                vHTML += "   			Tracking ";
                vHTML += "              <input type=\"hidden\" name=\"Tracking_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                vHTML += "   		</a> ";
                vHTML += "   	</li> ";
                vHTML += "   </ul> ";
            });

            $("#MyBoard_Result_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;

            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"9\"><span class=\"font-weight-medium\">Please check the information you request.</span></td> ";
            vHTML += "   </tr> ";

            $("#MyBoard_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">Please check the information you request.</span></li> ";
            vHTML += "   </ul> ";

            $("#MyBoard_Result_AREA_MO")[0].innerHTML = vHTML;

            $("#Paging_Area").hide();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;

            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td class=\"no_data\" colspan=\"9\"><span class=\"font-weight-medium\">Please contact the administrator.</span></td> ";
            vHTML += "   </tr> ";

            $("#MyBoard_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">Please contact the administrator.</span></li> ";
            vHTML += "   </ul> ";

            $("#MyBoard_Result_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeMyBoardList()]" + err.message);
    }
}