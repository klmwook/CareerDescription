////////////////////전역 변수//////////////////////////
var _vREQ_SVC = "SEA";
var apiUrl = "Document";
var _vPage = 0; //페이징
var _vHblNo = "";

var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
var _DocType_S = "'CIPL', 'HBL', 'CO', 'INV', 'CC', 'IP','NRA'";
////////////////////jquery event///////////////////////
$(function () {
    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }

    $("#input_ETD").val(_fnPlusDate(0)); //ETD	
    $("#input_ETA").val(_fnPlusDate(7)); //ETD	        
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

//수출 수입 클릭 시 변경
$(document).on("change", "#Select_BL_bound", function () {
    if ($(this).find("option:selected").val() == "E") {
        $("#Table_th_Bound").text("Export");
        $("#Table_th_CS_Type").text("Consignee");
        $("#Table_th_CS_Type button").val("CNE_ADDR");
    }
    else if ($(this).find("option:selected").val() == "I") {
        $("#Table_th_Bound").text("Import");
        $("#Table_th_CS_Type").text("Shipper");
        $("#Table_th_CS_Type button").val("SHP_ADDR");
    }
});

//해운 , 항공 클릭 이벤트
$(document).on("click", "input[name='transfer']", function () {

    $("#input_Departure").val("");
    $("#input_POL").val("");
    $("#input_Arrival").val("");
    $("#input_POD").val("");
    $("#input_MB_HouseBL").val("");
    $(".delete").hide();

    if ($(this).val() == "SEA") {
        $("#Table_th_BL").text("House B/L");
        _vREQ_SVC = "SEA";
    }
    else if ($(this).val() == "AIR") {
        $("#Table_th_BL").text("HAWB");
        _vREQ_SVC = "AIR";
    }
});

//수출 수입 클릭 시 변경
$(document).on("change", "#Select_MB_bound", function () {
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


//검색 버튼 이벤트
$(document).on("click", "#Btn_BoardMore", function () {

    _OrderBy = "";
    _Sort = "";
    //_vPage = 0;

    fnBORADSearch();
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

//첨부파일 문서 클릭 시 데이터 나오는 로직
$(document).on('click', '.file_view .file', function (e) {
    var apdVal = "";
    var tr = $(this).closest('tr');
    var td = tr.children();

    var vSeq = $(this).find("input[name='File_SEQ']").val();

    var objJsonData = new Object();
    //objJsonData.MNGT_NO = _fnToNull(td.eq(0).text());
    objJsonData.MNGT_NO = _fnToNull($(this).find("input[name='File_HBL_NO']").val());
    objJsonData.BKG_NO = _fnToNull($(this).find("input[name='File_BKG_NO']").val());
    objJsonData.INV_NO = _fnToNull($(this).find("input[name='File_INV_NO']").val());
    objJsonData.DOC_TYPE = _DocType_S

    $.ajax({
        type: "POST",
        url: "/Document/SelectFile",
        async: false,
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result, status, xhr) {
            var rtnVal = JSON.parse(result);
            if (rtnVal.Result[0].trxCode == 'Y') {
                var vTable1 = rtnVal.Table1;
                if (_fnToNull(vTable1) != "") {
                    //$(".file_list" + td.eq(1).text()).empty();
                    $(".file_list" + vSeq).empty();
                    $(vTable1).each(function (i) {
                        apdVal += "<li>";
                        apdVal += "   	<div class=\"file_sort\"><p>" + vTable1[i].DOC_NM + "</p></div> ";
                        apdVal += "      <div class=\"file_nm\"> ";
                        apdVal += "      	<a href=\"javascript:void(0)\" class=\"file_name btnDownFile\">" + vTable1[i].MNGT_NO + "</a> ";
                        apdVal += "         <input type=\"hidden\" name=\"File_MNGT_NO\" value=\"" + vTable1[i].MNGT_NO + "\" /> ";
                        apdVal += "         <input type=\"hidden\" name=\"File_SEQ\" value=\"" + vTable1[i].SEQ + "\" /> ";
                        apdVal += "         <input type=\"hidden\" name=\"File_FILE_PATH\" value=\"" + vTable1[i].FILE_PATH + "\" /> ";
                        apdVal += "         <input type=\"hidden\" name=\"File_REPLACE_FILE_NM\" value=\"" + vTable1[i].REPLACE_FILE_NM + "\" /> ";
                        apdVal += "      </div> ";
                        //apdVal += "	<div class='file_box'>";                        
                        //apdVal += "		<a href='javascript:void(0)' class='file_name btnDownFile'>[" + vTable1[i].DOC_NM + "] " + vTable1[i].MNGT_NM + "</a>";
                        //apdVal += "	</div>";
                        apdVal += "</li>";
                    });

                    //$(".file_list" + td.eq(1).text()).append(apdVal);                    
                    $(".file_list" + vSeq).append(apdVal);  
                    open = true;

                    //스크롤 되는지 확인
                    $('.MB_scrollbar').slimScroll({
                        height: '150px',
                        width: 'auto',
                        alwaysVisible: true,
                        railVisible: true,
                    });
                } else {
                    $(".file_layer_new").hide();
                }
            } else {
                $(".file_layer_new").hide();
            }
        },
        error: function (xhr, status, error) {
            _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
            return;
        }
    });
});



//Tracking 레이어 팝업
$(document).on("click", ".btnDownFile", function () {

    var vMNGT_NO = $(this).siblings("input[name='File_MNGT_NO']").val();
    var vSEQ = $(this).siblings("input[name='File_SEQ']").val();

    fnFileDown(vMNGT_NO, vSEQ);
});

//Tracking 레이어 팝업
$(document).on("click", "a[name='layer_Tracking_btn']", function () {
    _vHblNo = $(this).siblings("input").val();

    //_layout.js 
    getTracking(_vHblNo,"");
    //fnGetTrackLocation($(this).siblings("input").val());
});

//검색 버튼 이벤트
$(document).on("click", "button[name='Search_Board']", function () {

    $("table[name='MB_Table_List'] th button").removeClass();
    _OrderBy = "";
    _Sort = "";
    _vPage = 0;

    fnBORADSearch();
});

//sort 기능
$(document).on("click", "table[name='MB_Table_List'] th", function () {

    if (_isSearch) {
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
            $("table[name='MB_Table_List'] th button").removeClass();
            $(this).find("button").addClass(vValue);

            _OrderBy = $(this).find("button").val();
            _Sort = vValue.toUpperCase();
            _vPage = 0;
            fnBORADSearch();
        }
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

//BL 검색
function fnBORADSearch() {

    try {

        if (fnBORADValidation()) {
            var objJsonData = new Object();

            objJsonData.OFFICE_CD = $("#Session_OFFICE_CD").val();
            objJsonData.CUST_CD = $("#Session_CUST_CD").val();
            objJsonData.AUTH_KEY = $("#Session_AUTH_KEY").val();
            objJsonData.USER_TYPE = $("#Session_USR_TYPE").val();
            objJsonData.REQ_SVC = $("input[name='transfer']:checked").val();
            objJsonData.EX_IM_TYPE = $("#Select_MB_bound option:selected").val();
            objJsonData.ETD_ETA = $("#Select_MB_ETD_ETA option:selected").val();
            objJsonData.STRT_YMD = $("#input_ETD").val().substring(0, 10).replace(/-/gi, "");
            objJsonData.END_YMD = $("#input_ETA").val().substring(0, 10).replace(/-/gi, "");
            objJsonData.POL = $("#input_Departure").val();
            objJsonData.POL_CD = $("#input_POL").val();
            objJsonData.POD = $("#input_Arrival").val();
            objJsonData.POD_CD = $("#input_POD").val();
            objJsonData.HBL_NO = $("#input_MB_HouseBL").val();

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
                url: "/MyBoard/fnGetBoradData",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#BL_no_data").hide();
                    fnMakeBDList(result);
                    //alert(result);
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

//BL  벨리데이션
function fnBORADValidation() {

    //ETD를 입력 해 주세요.
    if (_fnToNull($("#input_ETD").val().replace(/-/gi, "")) == "") {
        $("table[name='BL_Table_List'] th button").removeClass();
        _fnAlertMsg("ETD를 입력 해 주세요. ","input_ETD");
        $("#input_ETD").focus();
        return false;
    }

    //ETA를 입력 해 주세요.
    if (_fnToNull($("#input_ETA").val().replace(/-/gi, "")) == "") {
        $("table[name='BL_Table_List'] th button").removeClass();
        _fnAlertMsg("ETA를 입력 해 주세요. ","input_ETA");
        $("#input_ETA").focus();
        return false;
    }

    return true;
}

//화물 추적 - Pier2Pier
function fnGetTrackLocation(vslName) {

    if (_vREQ_SVC == "SEA") {
        //var vUrl = "https://www.pier2pier.com/links/trackingvessel.php?VesselName=" + vslName;//+ "&Client=YJIT";
        var vUrl = "http://demo.elvisprime.com/moveMap.html?type=Vessel&SearchText=" + vslName;
        //var vUrl = "https://www.pier2pier.com/links/trackingvessel.php?VesselName=LANA&Client=YJIT";	
        $("#Tracking_pdfIframe").attr("src", "");
        layerPopup("#Tracking_pop");
        $("#ProgressBar_Loading").show();
        $("#Tracking_pdfIframe").attr("src", vUrl).load(function () {
            $("#ProgressBar_Loading").hide();
        });
    }
    else if (_vREQ_SVC == "AIR") {
        var vUrl = "https://www.radarbox.com/data/flights/" + vslName + " #map-container";
        //$("#Tracking_pdfIframe").attr("src", "");

        //iframe 초기화
        $('#Tracking_pdfIframe').attr('src', function (i, val) { return val; });

        $("#Tracking_pdfIframe").attr("src", vUrl);
        layerPopup("#Tracking_pop");


        //$("#Tracking_pdfIframe").attr("src", "about:blank").load(function () {
        //    $("#Tracking_pdfIframe").attr("src", vUrl);
        //    layerPopup("#Tracking_pop");
        //});


        //$("#ProgressBar_Loading").show();
        //$("#Tracking_pdfIframe").attr("src", vUrl).load(function () {
        //    $("#ProgressBar_Loading").hide();
        //});
    }

}

//Pre-alert 다운로드
function fnFileDown(vMNGT, vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMNGT;              //부킹 번호
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

/////////////////function MakeList/////////////////////
function fnMakeBDList(vJsonData) {

    try {
        var vHTML = "";
        var vHTML_DocList = "";

        if (_vPage == 1) {
            $("#BOARD_Result_AREA").eq(0).empty();
        }

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).BOARD;
            var vMorePage = true;
            _isSearch = true;
            if (vResult.length > 0) {
                $.each(vResult, function (i) {
                    if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                        vHTML += "		<tr class='row'>	";
                        vHTML += "                <td style='display:none'>" + _fnToNull(vResult[i]["HBL_NO"]) + "</td>	";
                        vHTML += "                  <td style='display:none'>" + i + "</td>";
                        if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                            vHTML += "                <td><span class='trade import ship'>Import</span></td>	";
                        } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                            vHTML += "                <td><span class='trade export ship'>Export</span></td>	";
                        }
                        vHTML += "                <td>" + _fnToNull(vResult[i]["HBL_NO"]) + "</td>	";
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "       <td>";
                        if (_fnToNull(vResult[i].FILE_CNT) != "") {
                            vHTML += "      <div class='file_view'><i class='file'><span class='blind'>첨부파일</span>";
                            vHTML += "          <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                            vHTML += "       <span class='num'>" + _fnToNull(vResult[i].FILE_CNT) + "</span></i >";
                            vHTML += "       <div class='file_layer_new'> ";
                            vHTML += "          <div class=\"file_title\"> ";
                            vHTML += "              <div class=\"file_tit1\">구분</div> ";
                            vHTML += "              <div class=\"file_tit2\">파일명</div> ";
                            vHTML += "          </div> ";
                            vHTML += "       <div class='MB_scrollbar'>";
                            vHTML += "              <ul class='file_list file_list" + i + "'>";
                            vHTML += "              <ul>";
                            vHTML += "       </div> ";
                            vHTML += "       </div> ";
                            vHTML += "       </div>";
                        }
                        vHTML += " </td > ";
                        vHTML += "       <td class='col_3'><i class='icn_state3'></i></td>";
                        vHTML += "       <td class='col_3'><i class='icn_state3'></i></td>";

                        if (_fnToNull(vResult[i].INV_NO) != "") {
                            if (_fnToNull(vResult[i].INV_YN) == "Y") {
                                vHTML += "       <td><i class='icn_state3'></i></td>";
                            } else {
                                vHTML += "       <td><i class='icn_state2'></i></td>";
                            }
                        } else {
                            vHTML += "       <td><i class='icn_state1'></i></td>";
                        }

                        vHTML += "       <td class='t_state clear'>";
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue\" name=\"layer_Tracking_btn\">Tracking</a> ";
                        vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\" /> ";
                        vHTML += "       </td>";

                         /*모바일*/
                        vHTML += "   <td class=\"mobile_layout\"> ";
                        vHTML += "   	<div class=\"layout_type2\"> ";
                        vHTML += "   		<div class=\"row s4\"> ";

                        if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                            vHTML += "                <div class=\"col\"><span class=\"trade import ship\">Import</span></div>	";
                        } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                            vHTML += "                <div class=\"col\"><span class=\"trade export ship\">Export</span></div>	";                            
                        }

                        vHTML += "   			<div class=\"col\">" + _fnToNull(vResult[i]["HBL_NO"]) + "</div> ";
                        vHTML += "   		</div> ";
                        vHTML += "   		<div class=\"row s3\"> ";
                        vHTML += "   			<table> ";
                        vHTML += "   				<tbody> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Departure</th> ";
                        vHTML += "   	                    <td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Arrival</th> ";
                        vHTML += "   	                    <td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>문서</th> ";

                        if (_fnToNull(vResult[i].FILE_CNT) != "") {
                            vHTML += " <td class=\"ta_center\"> ";
                            vHTML += "      <div class='file_view'><i class='file'><span class='blind'>첨부파일</span>";
                            vHTML += "      <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                            vHTML += "      <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                            vHTML += "      <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                            vHTML += "       <span class='num'>" + _fnToNull(vResult[i].FILE_CNT) + "</span></i >";
                            vHTML += "       <div class='file_layer_new'> ";
                            vHTML += "          <div class=\"file_title\"> ";
                            vHTML += "              <div class=\"file_tit1\">구분</div> ";
                            vHTML += "              <div class=\"file_tit2\">파일명</div> ";
                            vHTML += "          </div> ";
                            vHTML += "       <div class='MB_scrollbar'>";
                            vHTML += "              <ul class='file_list file_list" + i + "'>";
                            vHTML += "              <ul>";
                            vHTML += "       </div> ";
                            vHTML += "       </div> ";
                            vHTML += "       </div>";
                            vHTML += " </td> ";

                        }
                        //vHTML += "   						<td class=\"ta_center\"><i class=\"file\"><span class=\"blind\">첨부파일</span><span class=\"num\">2</span></i></td> ";

                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>부킹</th> ";
                        vHTML += "   						<td class=\"ta_center\"><i class=\"icn_state3\">완료</i></td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>B/L</th> ";
                        vHTML += "   						<td class=\"ta_center\"><i class=\"icn_state3\">완료</i></td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Invoice</th> ";

                        if (_fnToNull(vResult[i].INV_NO) != "") {
                            if (_fnToNull(vResult[i].INV_YN) == "Y") {
                                vHTML += "       <td class='ta_center'><i class='icn_state3'>완료</i></td>";
                            } else {
                                vHTML += "       <td class='ta_center'><i class='icn_state2'>진행중</i></td>";
                            }
                        } else {
                            vHTML += "       <td class='ta_center'><i class='icn_state1'>진행예정</i></td>";
                        }
                        
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<td colspan=\"2\"> ";
                        vHTML += "   							<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue\" name=\"layer_Tracking_btn\">Tracking</a> ";
                        vHTML += "          					<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\" /> ";
                        vHTML += "   						</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   				</tbody> ";
                        vHTML += "   			</table> ";
                        vHTML += "   		</div> ";
                        vHTML += "   	</div> ";
                        vHTML += "   </td> ";

                        vHTML += "            </tr>	";

                    } else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                        vHTML += "		<tr class='row'>	";
                        if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                            vHTML += "                <td><span class='trade import airline'>Import</span></td>	";
                        } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                            vHTML += "                <td><span class='trade export airline'>Export</span></td>	";
                        }
                        vHTML += "                <td>" + _fnToNull(vResult[i]["HBL_NO"]) + "</td>	";
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   	<td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "       <td>";
                        if (_fnToNull(vResult[i].FILE_CNT) != "") {
                            vHTML += "      <div class='file_view'><i class='file'><span class='blind'>첨부파일</span>";
                            vHTML += "      <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                            vHTML += "          <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                            vHTML += "       <span class='num'>" + _fnToNull(vResult[i].FILE_CNT) + "</span></i >";
                            vHTML += "       <div class='file_layer_new'> ";
                            vHTML += "          <div class=\"file_title\"> ";
                            vHTML += "              <div class=\"file_tit1\">구분</div> ";
                            vHTML += "              <div class=\"file_tit2\">파일명</div> ";
                            vHTML += "          </div> ";
                            vHTML += "       <div class='MB_scrollbar'>";
                            vHTML += "              <ul class='file_list file_list" + i + "'>";
                            vHTML += "              <ul>";
                            vHTML += "       </div> ";
                            vHTML += "       </div> ";
                            vHTML += "       </div>";
                        }
                        vHTML += " </td > ";
                        vHTML += "       <td class='col_3'><i class='icn_state3'></i></td>";
                        vHTML += "       <td class='col_3'><i class='icn_state3'></i></td>";
                        if (_fnToNull(vResult[i].INV_NO) != "") {
                            if (_fnToNull(vResult[i].INV_YN) == "Y") {
                                vHTML += "       <td class='col_3'><i class='icn_state3'></i></td>";
                            } else {
                                vHTML += "       <td class='col_3'><i class='icn_state2'></i></td>";
                            }
                        } else {
                            vHTML += "       <td class='col_3'><i class='icn_state1'></i></td>";
                        }

                        //vHTML += "       <td class='t_state clear'><a href='javascript:void(0)' class='btns type3 turquoise btnBoardTracking'><span class='marker'>화물추적</span></a></td>";
                        vHTML += "       <td class='t_state clear'>";
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue\" name=\"layer_Tracking_btn\">Tracking</a> ";
                        vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\" /> ";
                        vHTML += "       </td>";

                        /*모바일*/
                        vHTML += "   <td class=\"mobile_layout\"> ";
                        vHTML += "   	<div class=\"layout_type2\"> ";
                        vHTML += "   		<div class=\"row s4\"> ";

                        if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                            vHTML += "                <div class=\"col\"><span class=\"trade import ship\">Import</span></div>	";
                        } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                            vHTML += "                <div class=\"col\"><span class=\"trade export ship\">Export</span></div>	";
                        }

                        vHTML += "   			<div class=\"col\">" + _fnToNull(vResult[i]["HBL_NO"]) + "</div> ";
                        vHTML += "   		</div> ";
                        vHTML += "   		<div class=\"row s3\"> ";
                        vHTML += "   			<table> ";
                        vHTML += "   				<tbody> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Departure</th> ";
                        vHTML += "   	                    <td>" + _fnToNull(vResult[i]["POL_NM"]) + "<br />" + _fnToNull(vResult[i]["ETD"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Arrival</th> ";
                        vHTML += "   	                    <td>" + _fnToNull(vResult[i]["POD_NM"]) + "<br />" + _fnToNull(vResult[i]["ETA"]) + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>문서</th> ";

                        if (_fnToNull(vResult[i].FILE_CNT) != "") {
                            vHTML += " <td class=\"ta_center\"> ";
                            vHTML += "      <div class='file_view'><i class='file'><span class='blind'>첨부파일</span>";
                            vHTML += "      <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                            vHTML += "      <input type=\"hidden\" name=\"File_BKG_NO\" value=\"" + _fnToNull(vResult[i]["BKG_NO"]) + "\"> ";
                            vHTML += "      <input type=\"hidden\" name=\"File_INV_NO\" value=\"" + _fnToNull(vResult[i]["INV_NO"]) + "\"> ";
                            vHTML += "      <input type=\"hidden\" name=\"File_SEQ\" value=\"" + i + "\"> ";
                            vHTML += "       <span class='num'>" + _fnToNull(vResult[i].FILE_CNT) + "</span></i >";
                            vHTML += "       <div class='file_layer_new'> ";
                            vHTML += "          <div class=\"file_title\"> ";
                            vHTML += "              <div class=\"file_tit1\">구분</div> ";
                            vHTML += "              <div class=\"file_tit2\">파일명</div> ";
                            vHTML += "          </div> ";
                            vHTML += "       <div class='MB_scrollbar'>";
                            vHTML += "              <ul class='file_list file_list" + i + "'>";
                            vHTML += "              <ul>";
                            vHTML += "       </div> ";
                            vHTML += "       </div> ";
                            vHTML += "       </div>";
                            vHTML += " </td> ";

                        }
                        //vHTML += "   						<td class=\"ta_center\"><i class=\"file\"><span class=\"blind\">첨부파일</span><span class=\"num\">2</span></i></td> ";

                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>부킹</th> ";
                        vHTML += "   						<td class=\"ta_center\"><i class=\"icn_state3\">완료</i></td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";

                        vHTML += "   						<th>B/L</th> ";
                        vHTML += "   						<td class=\"ta_center\"><i class=\"icn_state3\">완료</i></td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<th>Invoice</th> ";

                        if (_fnToNull(vResult[i].INV_NO) != "") {
                            if (_fnToNull(vResult[i].INV_YN) == "Y") {
                                vHTML += "       <td class='ta_center'><i class='icn_state3'>완료</i></td>";
                            } else {
                                vHTML += "       <td class='ta_center'><i class='icn_state2'>진행중</i></td>";
                            }
                        } else {
                            vHTML += "       <td class='ta_center'><i class='icn_state1'>진행예정</i></td>";
                        }

                        vHTML += "   					</tr> ";
                        vHTML += "   					<tr> ";
                        vHTML += "   						<td colspan=\"2\"> ";
                        vHTML += "   							<a href=\"javascript:void(0)\" class=\"btn_type1 skyblue\" name=\"layer_Tracking_btn\">Tracking</a> ";
                        vHTML += "          					<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\" /> ";
                        vHTML += "   						</td> ";
                        vHTML += "   					</tr> ";
                        vHTML += "   				</tbody> ";
                        vHTML += "   			</table> ";
                        vHTML += "   		</div> ";
                        vHTML += "   	</div> ";
                        vHTML += "   </td> ";

                        vHTML += "            </tr>	";
                    }

                    //더보기 체크 RNUM == TOTCNT
                    if (_fnToNull(vResult[i]["RNUM"]) == _fnToNull(vResult[i]["TOTCNT"])) {
                        vMorePage = false;
                    } else {
                        vMorePage = true;
                    }
                });

                //더보기 영역
                if (vMorePage) {
                    $("#Btn_BoardMore").show();
                } else {
                    $("#Btn_BoardMore").hide();
                }
            } else {
                vHTML += " <span>데이터가 없습니다.</span> ";
                $("#BL_no_data")[0].innerHTML = vHTML;
                vHTML = "";
                $("#BL_no_data").show();
                $("#Btn_BoardMore").hide();
            }

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;
            vHTML += " <span>데이터가 없습니다.</span> ";
            $("#BL_no_data")[0].innerHTML = vHTML;
            vHTML = "";
            $("#BL_no_data").show();
            $("#Btn_BoardMore").hide();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;
            vHTML += " <span>데이터가 없습니다.</span> ";
            $("#BL_no_data")[0].innerHTML = vHTML;
            vHTML = "";
            $("#BL_no_data").show();
            $("#Btn_BoardMore").hide();
        }

        //여기서 데이터 넣기
        $("#BOARD_Result_AREA").eq(0).append(vHTML);
    }
    catch (err) {
        console.log(err);
    }
}