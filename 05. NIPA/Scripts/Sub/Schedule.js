////////////////////전역 변수//////////////////////////
var _vPage = 0;
var _vSchDTLName = "";
var _sch_chart;
var _LineChart = new Object();
var mymap;

////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    //$("#header").addClass("close");
    $('#lnb > li.sub_sch > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(2) > a').addClass("on");

    if (matchMedia("screen and (min-width: 1025px)").matches) {
        var swiper = new Swiper(".cliSwiper", {
            slidesPerView: 4,
            spaceBetween: 20,
            //loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
    if (matchMedia("screen and (max-width: 1024px)").matches) {
        var swiper = new Swiper(".cliSwiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            //loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    $("#input_ETD").val(_fnPlusDate(0));
    $("#no_search").show();
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');
            if (parseFloat(vIndex) == 2) {                
                _vPage = 0;
                fnSearchSchMst();
            } else {
                $('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }
        }
    }
});

//해운 / 항공 클릭 시 데이터 초기화 시키기
$(document).on("click", "input[name='transfer']", function () {
    $("#Sch_ResultArea").hide();
    $("#no_data").hide();
    $("#no_search").show();
    $("#input_ETD").val(_fnPlusDate(0));
    $("#input_POL").val("");
    $("#input_POLCD").val("");
    $("#input_POD").val("");
    $("#input_PODCD").val("");
    $("#select_Service").val("");
    $(".delete").hide();
    $("#Paging_List_Area").empty();
});

//날짜 포스커 아웃 할때 벨리데이션
$(document).on("focusout", "#input_ETD", function () {
    if (!_fnisDate($(this).val())) {
        $(this).val("");
        $(this).focus();
    } else {
        var vValue = $(this).val();
        var vValue_Num = vValue.replace(/[^0-9]/g, "");
        if (vValue != "") {
            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
            $(this).val(vValue);
        }
    }
});

//조회 버튼 클릭 이벤트
$(document).on("click", "#btn_search", function () {
    _vPage = 0;
    fnSearchSchMst();
});

//POL 클릭 이벤트
$(document).on("click", "#input_POL", function () {

    if ($(this).val().length == 0) {

        var vREQ_SVC = $("input[name='transfer']:checked").val();

        if (vREQ_SVC == "SEA") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop01");
        }
        else if (vREQ_SVC == "AIR") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_AIR_pop01");
        }
    }

});

//POD 클릭 이벤트
$(document).on("click", "#input_POD", function () {

    if ($(this).val().length == 0) {

        var vREQ_SVC = $("input[name='transfer']:checked").val();

        if (vREQ_SVC == "SEA") {
            $("#select_SEA_pop01").hide();
            $("#select_SEA_pop02").hide();
            $("#select_AIR_pop01").hide();
            $("#select_AIR_pop02").hide();
            selectPopOpen("#select_SEA_pop02");
        }
        else if (vREQ_SVC == "AIR") {
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

    $("#input_POL").val(vSplit[0]);
    $("#input_POLCD").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

    selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - SEA POL
$(document).on("click", "#quick_SEA_POLCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POL").val(vSplit[0]);
    $("#input_POLCD").val(vSplit[1]);
    $("#select_SEA_pop01").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

    selectPopOpen("#select_SEA_pop02");
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POD").val(vSplit[0]);
    $("#input_PODCD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
});

//퀵 Code 데이터 - SEA POD
$(document).on("click", "#quick_SEA_PODCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POD").val(vSplit[0]);
    $("#input_PODCD").val(vSplit[1]);
    $("#select_SEA_pop02").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POL").val(vSplit[0]);
    $("#input_POLCD").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

    selectPopOpen("#select_AIR_pop02");
});

//퀵 Code 데이터 - AIR POL
$(document).on("click", "#quick_AIR_POLCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POL").val(vSplit[0]);
    $("#input_POLCD").val(vSplit[1]);
    $("#select_AIR_pop01").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));

    selectPopOpen("#select_AIR_pop02");
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POD").val(vSplit[0]);
    $("#input_PODCD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
});

//퀵 Code 데이터 - AIR POD
$(document).on("click", "#quick_AIR_PODCD2 button", function () {

    //split 해서 네이밍 , POL_CD 넣기
    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_POD").val(vSplit[0]);
    $("#input_PODCD").val(vSplit[1]);
    $("#select_AIR_pop02").hide();

    //X박스 만들기
    $(this).closest(".int_box").addClass("has_del");
    $(this).closest(".int_box").find(".delete").toggle(Boolean($(this).val()));
});

//출발지 자동완성
$(document).on("keyup", "#input_POL", function () {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POLCD").val("");
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
                "width": $("#AC_POL_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetPortData($("#input_POL").val().toUpperCase());
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
                $("#input_POL").val(ui.item.value);
                $("#input_POLCD").val(ui.item.code);
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

//도착지 자동완성
$(document).on("keyup", "#input_POD", function () {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_PODCD").val("");
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
                "width": $("#AC_POD_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetPortData($("#input_POD").val().toUpperCase());
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
                $("#input_POD").val(ui.item.value);
                $("#input_PODCD").val(ui.item.code);
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

//스케줄 VSL 클릭 시 Tracking 레이어 팝업 나오게.
$(document).on("click", "p[name='Open_TrackingPop']", function () {    

    fnGetVslLocation(this);
    //layerPopup('#trackingPop');
});

//FCL 버튼 클릭 이벤트
$(document).on("click", "button[name='btn_FclCnt']", function () {
    $(".bl_count").removeClass("on");
    $(this).closest(".bl_count").addClass("on");
    fnSearchSchDtl(this, "F");
    fnShowhideDTL(this); //show hide
});

//LCL 버튼 클릭 이벤트
$(document).on("click", "button[name='btn_LclCnt']", function () {
    $(".bl_count").removeClass("on");
    $(this).closest(".bl_count").addClass("on");
    fnSearchSchDtl(this, "L");
    fnShowhideDTL(this); //show hide
});

//Consol 버튼 클릭 이벤트
$(document).on("click", "button[name='btn_ConsolCnt']", function () {
    $(".bl_count").removeClass("on");
    $(this).closest(".bl_count").addClass("on");
    fnSearchSchDtl(this, "C");
    fnShowhideDTL(this); //show hide
});

//거래처 상세 정보 레이어 팝업
$(document).on("click", "button[name='btn_LayerCustInfo']", function () {

    //alert($(this).siblings("input[type='hidden']").eq(0).val()); //OFFICE_CD
    //alert($(this).siblings("input[type='hidden']").eq(1).val()); //ETD
    //alert($(this).siblings("input[type='hidden']").eq(2).val()); //REQ_SVC
    //alert($(this).siblings("input[type='hidden']").eq(3).val()); //EX_IM_TYPE
    //alert($(this).siblings("input[type='hidden']").eq(4).val()); //POL_CD
    //alert($(this).siblings("input[type='hidden']").eq(5).val()); //POD_CD

    fnGetCustDTL(this);    

    //layerPopup('#clientPop');
});

//상세 정보 눌렀을 경우 끄기
$(document).on("click", "#layer_clientPop_Close", function () {
    fnMakeLayerPop();
    _sch_chart.destroy();
    //$("#sch_line_graph").css("visibility", "hidden");
    layerClose('#clientPop');
});

//레이어 원 차트 영역 클릭 이벤트
$(document).on("click", "#layer_CircleChart1", function () {
    _sch_chart.destroy();
    //vOFFICE_CD, vDATE_YYYY, vDATE_MM, vREQ_SVC, vDATA_TYPE, vPOL_CD, vPOD_CD, vEX_IM_TYPE
    fnSetLineChart(_LineChart.OFFICE_CD, _LineChart.DATE_YYYY, _LineChart.DATE_MM, _LineChart.REQ_SVC, _LineChart.POL_CD, _LineChart.POD_CD, _LineChart.EX_IM_TYPE, "BL");
});

//레이어 원 차트 영역 클릭 이벤트
$(document).on("click", "#layer_CircleChart2", function () {
    _sch_chart.destroy();
    //vOFFICE_CD, vDATE_YYYY, vDATE_MM, vREQ_SVC, vDATA_TYPE, vPOL_CD, vPOD_CD, vEX_IM_TYPE
    fnSetLineChart(_LineChart.OFFICE_CD, _LineChart.DATE_YYYY, _LineChart.DATE_MM, _LineChart.REQ_SVC, _LineChart.POL_CD, _LineChart.POD_CD, _LineChart.EX_IM_TYPE, "RTON");
});

/////////////////////function///////////////////////////////////
//포트 정보 가져오기 
function fnGetPortData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        //선택에 따라서 Sea S / air A 체크
        if ($("input[name='transfer']:checked").val() == "SEA") {
            objJsonData.LOC_TYPE = "SEA";
        } else if ($("input[name='transfer']:checked").val() == "AIR") {
            objJsonData.LOC_TYPE = "AIR";
        }
        
        objJsonData.LOC_CD = vValue;

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetPort",
            async: false,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                rtnJson = result;
            }, error: function (xhr, status, error) {                
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return rtnJson;
    }
    catch (err) {
        console.log("[Error - fnGetPortData]" + err.message);
    }
}

//검색 조회 함수
function fnSearchSchMst() {
    try {
        if (fnValidation()) {           

            var objJsonData = new Object();

            //TEST
            //alert(_fnSetDate($("#input_ETD").val(), 30).replace(/-/gi, ""));
            //SEA
            //objJsonData.REQ_SVC = "SEA";
            //objJsonData.POL_CD = "KRPUS";
            //objJsonData.POD_CD = "CNSHA";
            //objJsonData.ST_DATE = "20211001";
            //objJsonData.END_DATE = "20211030"; // + 30일
            ////objJsonData.PAGE = "1";
            //objJsonData.CNTR_TYPE = "";

            //AIR
            //objJsonData.REQ_SVC = "AIR";
            //objJsonData.POL_CD = "ICN";
            //objJsonData.POD_CD = "HAN";
            //objJsonData.ST_DATE = "20210830";
            //objJsonData.END_DATE = "20210901"; // + 30일
            ////objJsonData.PAGE = "1";
            //objJsonData.CNTR_TYPE = "";
            ////END TEST 
            
            if ($("input[name='transfer']:checked").val() == "SEA") {
                objJsonData.REQ_SVC = "SEA";
            } else if ($("input[name='transfer']:checked").val() == "AIR") {
                objJsonData.REQ_SVC = "AIR";
            }                  
            
            objJsonData.POL_CD = $("#input_POLCD").val(); 
            objJsonData.POD_CD = $("#input_PODCD").val();
            
            objJsonData.ST_DATE = $("#input_ETD").val().replace(/-/gi, "");
            objJsonData.END_DATE = _fnSetDate($("#input_ETD").val(), 30).replace(/-/gi, ""); // + 30일
            
            if ($("#select_Service option:selected").val() != "") {
                objJsonData.CNTR_TYPE = $("#select_Service option:selected").val();
            } else {
                objJsonData.CNTR_TYPE = "";
            }
            
            if (_vPage == 0) {
                objJsonData.PAGE = 0;
            } else {
                objJsonData.PAGE = _vPage;
            }

            //objJsonData.PAGE = "1";
            
            $.ajax({
                type: "POST",
                url: "/Schedule/fnGetSchData",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#no_data").hide();
                    fnMakeSchMST(result);
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        $("#Sch_ResultArea").show();
                        fnPaging(JSON.parse(result).Table1[0]["TOTCNT"], 10, 5, (objJsonData.PAGE + 1));
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
    } catch (err) {
        console.log("[Error - fnSearchSchMst]" + err.message);
    }
}

//search 밸리데이션
function fnValidation() {
    try {               

        if (_fnToNull($("#input_ETD").val()) == "") {
            _fnAlertMsg("날짜를 입력 해 주세요.",);
            return false;
        }
        
        if (_fnToNull($("#input_POL").val() == "")) {
            _fnAlertMsg("출발지를 입력 해 주세요.");
            return false;
        }
        
        if (_fnToNull($("#input_POD").val() == "")) {
            _fnAlertMsg("도착지를 입력 해 주세요.");
            return false;
        }

        return true;
    } catch (err) {
        console.log("[Error - fnValidation]" + err.message);
    }
}

function goPage(pageIndex) {
    _vPage = pageIndex-1;
    fnSearchSchMst();
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
// pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
function fnPaging(totalData, dataPerPage, pageCount, currentPage) {
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹            
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    //$("#paging_list").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var vHTML = "";

    vHTML += " <a href=\"javascript:void(0)\" onclick=\"goPage(1)\" class=\"page first\"><span class=\"blind\">처음페이지로 가기</span></a> ";
    vHTML += " <a href=\"javascript:void(0)\" onclick=\"goPage(" + prevPage + ")\" class=\"page prev\"><span class=\"blind\">이전페이지로 가기</span></a> ";
    
    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += " <span class=\"number\"><span class=\"on\">" + i + "</span></span> ";
        } else {
            vHTML += " <span class=\"number\" onclick='goPage(" + i + ")'><span>" + i + "</span></span> ";
        }
    }

    vHTML += " <a href=\"javascript:void(0)\" onclick=\"goPage(" + nextPage + ")\" class=\"page next\"><span class=\"blind\">다음페이지로 가기</span></a> ";
    vHTML += " <a href=\"javascript:void(0)\" onclick=\"goPage(" + totalPage + ")\" class=\"page last\"><span class=\"blind\">마지막페이지로 가기</span></a> ";
    
    $("#Paging_List_Area")[0].innerHTML = vHTML; // 페이지 목록 생성
}

//show hide 유무 체크
function fnShowhideDTL(vThis) {
    try {
        if (!$(vThis).closest(".flex_type1").siblings(".Sch_ResultDtlArea").hasClass("show")) {
            $(".client .cliSwiper").removeClass("show");
            $(".client .cliSwiper").addClass("show_n");
            $(".client .cliSwiper").slideUp();
            //$(".bl_count").removeClass("on");
            $(".btn_freight").removeClass("on");

            var $cliSwiper = $(vThis).closest(".client").children(".cliSwiper");

            if ($cliSwiper.hasClass("show_n")) {
                $cliSwiper.slideDown();
                $cliSwiper.removeClass("show_n");
                $cliSwiper.addClass("show");
                $(vThis).addClass("on");
            }
            else if ($(vThis).siblings(".bl_count").hasClass("on")) {
                if ($(vThis).hasClass("on")) {
                    $cliSwiper.removeClass("show");
                    $cliSwiper.addClass("show_n");
                    $cliSwiper.slideUp();
                    $(vThis).siblings(".bl_count").removeClass("on");
                    $(vThis).removeClass("on");
                }
                $(vThis).siblings(".bl_count").removeClass("on");
                $(vThis).addClass("on");
            }
            else {
                $cliSwiper.removeClass("show");
                $cliSwiper.addClass("show_n");
                $cliSwiper.slideUp();
                $(vThis).siblings(".bl_count").removeClass("on");
                $(vThis).removeClass("on");
            }
        }
    }
    catch (err) {
        console.log("Error - fnShowhideDTL" + err.message);
    }
}

//디테일 정보 가져오기
function fnSearchSchDtl(vThis,vCntrType) {

    try {
        var objJsonData = new Object();

        objJsonData.REQ_SVC = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(0).val();
        objJsonData.LINE_CD = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(1).val();
        objJsonData.POL_CD = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(2).val();
        objJsonData.POD_CD = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(3).val();
        objJsonData.ETD = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(4).val();
        objJsonData.ETA = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(5).val();
        objJsonData.VSL = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(6).val();
        objJsonData.VOY = $(vThis).closest(".client").find("div[name='div_SearchInfo'] input").eq(7).val();
        objJsonData.CNTR_TYPE = vCntrType;

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetSchDtlData",
            async: false,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSchDTL(result, $(vThis).closest(".client").find(".Sch_ResultDtlArea").attr("name"));
            }, error: function (xhr, status, error) {                
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("Error - fnSearchSchMst" + err.message);
    }
}

//스케줄 상세 정보 클릭 시 데이터 뿌려주기
function fnGetCustDTL(vThis) {
    try {        

        var objJsonData = new Object();

        objJsonData.DATE_YYYY_PAST = Number($(vThis).siblings("input[type='hidden']").eq(1).val().substring("0", "4")) - 1;        
        objJsonData.DATE_YYYY = $(vThis).siblings("input[type='hidden']").eq(1).val().substring("0","4");
        objJsonData.DATE_MM = $(vThis).siblings("input[type='hidden']").eq(1).val().substring("4", "6");
        objJsonData.OFFICE_CD = $(vThis).siblings("input[type='hidden']").eq(0).val();
        objJsonData.REQ_SVC = $(vThis).siblings("input[type='hidden']").eq(2).val();
        objJsonData.EX_IM_TYPE = $(vThis).siblings("input[type='hidden']").eq(3).val();
        objJsonData.POL_CD = $(vThis).siblings("input[type='hidden']").eq(4).val();
        objJsonData.POD_CD = $(vThis).siblings("input[type='hidden']").eq(5).val();

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetCustDtlData",
            async: false,
            dataType: "json",            
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //alert(result);
                layerPopup('#clientPop');

                //년/월 세팅
                $("#sch_year_month").text(objJsonData.DATE_YYYY + "년 " + objJsonData.DATE_MM+"월");
                $("#sch_year").text(objJsonData.DATE_YYYY+"년");

                fnLineChart(result, "BL", objJsonData.DATE_YYYY_PAST, objJsonData.DATE_YYYY, objJsonData.DATE_MM, objJsonData.REQ_SVC);   //Line 차트
                fnMakeCustDTL(result); //거래처 정보
                fnApexChart(result);   //상세정보
                $("#sch_line_graph").css("visibility", "visible");
                //fnMakeSchDTL(result, $(vThis).closest(".client").find(".Sch_ResultDtlArea").attr("name"));
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("Error - fnGetCustDTL" + err.message);
    }
}

//LineChart만 데이터 가져오기
function fnSetLineChart(vOFFICE_CD, vDATE_YYYY, vDATE_MM, vREQ_SVC, vPOL_CD, vPOD_CD, vEX_IM_TYPE, vDATA_TYPE) {
    try {
        var objJsonData = new Object();

        objJsonData.DATE_YYYY_PAST = Number(vDATE_YYYY) - 1;
        objJsonData.DATE_YYYY = vDATE_YYYY;
        objJsonData.DATE_MM = vDATE_MM;
        objJsonData.OFFICE_CD = vOFFICE_CD;
        objJsonData.REQ_SVC = vREQ_SVC;
        objJsonData.POL_CD = vPOL_CD;
        objJsonData.POD_CD = vPOD_CD;
        objJsonData.EX_IM_TYPE = vEX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetLineChartData",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                
                fnLineChart(result, vDATA_TYPE, objJsonData.DATE_YYYY_PAST, objJsonData.DATE_YYYY, objJsonData.DATE_MM, objJsonData.REQ_SVC);   //Line 차트
                //fnMakeSchDTL(result, $(vThis).closest(".client").find(".Sch_ResultDtlArea").attr("name"));
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("Error - fnSetLineChart" + err.message);
    }
}

//선뱍 위치 찾기 함수
function fnGetVslLocation(vThis) {
    try {

        var objJsonData = new Object();

        //1 LINE_CD , 2 POL_CD , 3 POD_CD , 6 VSL
        if (_fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(1).val()) == "") {
            _fnAlertMsg("위치를 확인 할 수 없습니다.");
            return false;
        }
        
        if (_fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(2).val()) == "") {
            _fnAlertMsg("위치를 확인 할 수 없습니다.");
            return false;
        }

        if (_fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(3).val()) == "") {
            _fnAlertMsg("위치를 확인 할 수 없습니다.");
            return false;
        }

        if (_fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(6).val()) == "") {
            _fnAlertMsg("위치를 확인 할 수 없습니다.");
            return false;
        }        

        objJsonData.reqVal1 = _fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(6).val());
        objJsonData.reqVal2 = _fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(2).val());
        objJsonData.reqVal3 = _fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(3).val());
        objJsonData.LINE_CD = _fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(1).val());
        objJsonData.VSL = _fnToNull($(vThis).closest(".client").find("div[name='div_SearchInfo'] input[type='hidden']").eq(6).val());
        
        var strurl = _ApiUrl + "api/Trk/GetTrackingVessel"; //스케줄        
        $("#ProgressBar_Loading").show(); //프로그래스 바

        $.ajax({
            url: strurl,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization-Token', _ApiKey);
            },
            type: "POST",
            async: true,
            dataType: "json",
            data: { "": _fnMakeJson(objJsonData) },
            success: function (result) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                if (_fnToNull(result) != "") {
                    var rtnData = JSON.parse(result);
                    if (_fnToNull(rtnData.Result) != "") {
                        if (rtnData.Result[0].trxCode == "N" || rtnData.Result[0].trxCode == "E") {
                            //drawingLayerNodata();
                            _fnAlertMsg("위치를 확인 할 수 없습니다.");
                            return false;
                        }
                    } else {
                        //선박 위치의 경도 위도가 없을 경우 예외처리
                        if (_fnToNull(rtnData.Master[0].MAP_LAT) != "" && _fnToNull(rtnData.Master[0].MAP_LNG) != "") {
                            layerPopup('#trackingPop');
                            fnMakeRealLocation(result, objJsonData); //데이터 넣기
                            drawingLayer(rtnData);
                        } else {
                            _fnAlertMsg("위치를 확인 할 수 없습니다.");
                            return false;
                        }
                    }
                } else {
                    _fnAlertMsg("위치를 확인 할 수 없습니다.");
                }
                //createMap()
            }, error: function (xhr) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                layerClose("#tracking_layer");
                _fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }
        });

    }
    catch (err) {
        console.log("Error - fnSetLineChart" + err.message);
    }
}

//VSL 데이터 가져오기
function fnGetVslData(vObj) {
    try {
        var objJsonData = new Object();
        objJsonData = vObj;

        var vResult;

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetVslData",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                vResult = result;
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("Error - fnGetVslData" + err.message);
    }
}

//선사 로고 있는지 체크
function fnGetLineImgPath(vLine) {
    try {
        var objJsonData = new Object();
        objJsonData.LINE_CD = vLine;

        var vResult;

        $.ajax({
            type: "POST",
            url: "/Schedule/fnGetLineImgPath",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                vResult = result;
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("Error - fnGetVslData" + err.message);
    }
}

//////////////////////function makelist////////////////////////
//스케줄 Row 만들기
function fnMakeSchMST(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Table1;

            //반복문
            $.each(vResult, function (i) {
                vHTML += "   <div class=\"client\"> ";
                vHTML += "       <div style=\"display:none\" name=\"div_SearchInfo\"> ";
                vHTML += "            <input type=\"hidden\" name=\"input_REQ_SVC\" value=\"" + vResult[i]["REQ_SVC"]+"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_LINE_CD\" value=\"" + vResult[i]["LINE_CD"] +"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_POL_CD\" value=\"" + vResult[i]["POL_CD"] +"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_POD_CD\" value=\"" + vResult[i]["POD_CD"] +"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_ETD\" value=\"" + vResult[i]["ETD"] +"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_ETA\" value=\"" + vResult[i]["ETA"]+"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_VSL\" value=\"" + vResult[i]["VSL"]+"\" > ";
                vHTML += "            <input type=\"hidden\" name=\"input_VOY\" value=\"" + vResult[i]["VOY"] +"\" > ";
                vHTML += "       </div> ";
                vHTML += "   	<div class=\"flex_type1 pd_15\"> ";
                vHTML += "   		<div class=\"flex_box img\"> ";
                vHTML += "   			<div class=\"sch_cell\"> ";                

                if (fnImgChk("/Images/logo/" + _fnToNull(vResult[i]["LINE_CD"]) + ".png")) {
                    vHTML += "   						<img src=\"/Images/logo/" + _fnToNull(vResult[i]["LINE_CD"]) + ".png\" /> ";
                } else {
                    vHTML += "   						<img src=\"/Images/no_data_bg04.png\" /> ";
                }

                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"flex_box sch\"> ";
                vHTML += "   			<div class=\"sch_cell\"> ";
                vHTML += "   				<p class=\"title\">" + _fnToNull(vResult[i]["POL_NM"]) + "</p> ";
                vHTML += "   				<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["ETD"])) + " (" + _fnGetWhatDay_Eng(_fnToNull(vResult[i]["ETD"]))+")</p> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"sch_cell vsl\"> ";
                vHTML += "   				<div class=\"vsl_cover\"> ";

                if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                    vHTML += "   					<p class=\"title\" name=\"Open_TrackingPop\"><button type=\"button\" class=\"vessel\">" + _fnToNull(vResult[i]["VSL"]) + "</button></p>					 ";
                    vHTML += "   					<p>" + _fnToNull(vResult[i]["VOY"]) + "</p> ";
                }
                else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                    vHTML += "   					<p class=\"title\"><button type=\"button\" class=\"vessel air\" >" + _fnToNull(vResult[i]["VSL"]) + "</button></p>					 ";
                }

                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"sch_cell\"> ";
                vHTML += "   				<p class=\"title\">" + _fnToNull(vResult[i]["POD_NM"]) + "</p> ";
                vHTML += "   				<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["ETA"])) + " (" + _fnGetWhatDay_Eng(_fnToNull(vResult[i]["ETA"])) + ")</p> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"flex_box stat\"> ";
                vHTML += "   			<div class=\"sch_cell\"> ";
                vHTML += "   				<div class=\"doc_alert\"> ";
                vHTML += "   					<div class=\"doc_title\"><span>Doc Closing</span></div> ";

                if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                    vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["DOC_CLOS_YMD"]))+ "</p> ";
                }
                else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                    //6개로 들어올 때가 있어서
                    if (_fnToNull(vResult[i]["DOC_CLOS_HM"]).length == 6) {
                        vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["DOC_CLOS_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOS_HM"]).substring("0", "4")) + "</p> ";
                    } else {
                        vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["DOC_CLOS_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOS_HM"]).substring("0", "4")) + "</p> ";
                    }
                }
                
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"doc_alert\"> ";
                vHTML += "   					<div class=\"doc_title\"><span>Inland Cut off</span></div> ";

                if (_fnToNull(vResult[i]["REQ_SVC"]) == "SEA") {
                    vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["CARGO_CLOS_YMD"])) + "</p> ";
                }
                else if (_fnToNull(vResult[i]["REQ_SVC"]) == "AIR") {
                    //6개로 들어올 때가 있어서
                    if (_fnToNull(vResult[i]["CARGO_CLOS_HM"]).length == 6) {
                        vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["CARGO_CLOS_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOS_HM"]).substring("0", "4")) + "</p> ";
                    } else {
                        vHTML += "   					<p>" + _fnFormatDotDate(_fnToNull(vResult[i]["CARGO_CLOS_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOS_HM"]).substring("0", "4")) + "</p> ";
                    }
                }
                
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"flex_box bl\"> ";
                vHTML += "   			<div class=\"sch_cell\"> ";
                vHTML += "   				<div class=\"bl_list\"> ";
                vHTML += "   					<div class=\"bl_count\"> ";

                if (_fnToZero(vResult[i]["FCL_CNT"]) == 0) {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" disabled=\"disabled\">FCL : <br class=\"s_mo\"> 0 건</button></p> ";
                } else {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" name=\"btn_FclCnt\" value=\"FclCnt\">FCL : <br class=\"s_mo\">" + _fnToZero(vResult[i]["FCL_CNT"]) + " 건</button></p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"bl_count\"> ";

                if (_fnToZero(vResult[i]["LCL_CNT"]) == 0) {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" disabled=\"disabled\">LCL : <br class=\"s_mo\">0 건</button></p> ";
                } else {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" name=\"btn_LclCnt\" value=\"LclCnt\">LCL : <br class=\"s_mo\">" + _fnToZero(vResult[i]["LCL_CNT"]) + " 건</button></p> ";
                }
                
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"bl_count\"> ";

                if (_fnToZero(vResult[i]["CONSOL_CNT"]) == 0) {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" disabled=\"disabled\">Consol : <br class=\"s_mo\">0 건</button></p> ";
                } else {
                    vHTML += "   						<p><button type=\"button\" class=\"btn_freight\" name=\"btn_ConsolCnt\" value=\"ConsolCnt\">Consol : <br class=\"s_mo\">" + _fnToZero(vResult[i]["CONSOL_CNT"]) + " 건</button></p> ";
                }                

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";

                //여기 사이에 detail 들어가야 됨
                vHTML += " <div class=\"swiper cliSwiper show_n Sch_ResultDtlArea\" name=\"Sch_ResultDtlArea"+i+"\"> ";
                vHTML += " </div>";
                vHTML += "   </div> ";
            });

            $("#no_search").hide(); //원하시는 정보 검색 숨기기
            $("#Sch_ResultArea")[0].innerHTML = vHTML;

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $("#no_search").hide();
            $("#no_data").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요");
            console.log("[Error - fnMakeSchMST] :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSchMST]" + err.message);
    }
}

//이미지 여부 체크
function fnImgChk(url) {

    var vResult;

    $.ajax({
        url: url,
        type: 'HEAD',
        async: false,
        success: function () {
            vResult = true;
        },
        error: function () {
            vResult = false;
        }
    });

    return vResult;
}


//디테일 데이터 만들기
function fnMakeSchDTL(vJsonData,vInnerHTML)
{
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Table1;

            var vRoof = false;
            vHTML += "<div class=\"swiper-wrapper\">";

            $.each(vResult, function (i) {
                if (vResult.length > 4) {
                    //for문 돌리기
                    vHTML += "   <div class=\"swiper-slide\"> ";
                    vHTML += "   	<div class=\"swiper_card\"> ";
                    vHTML += "   		<div class=\"card_logo\"> ";

                    if (_fnToNull(vResult[i]["LINE_PATH"]) == "") {
                        vHTML += "   						<img src=\"/images/no_data_bg04.png\" /> ";
                    } else {
                        vHTML += "   						<img src=\"" + _fnToNull(vResult[i]["LINE_PATH"]) + "\" /> ";                        
                    }

                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"card_info\"> ";
                    vHTML += "   			<p>상호명 : " + _fnToNull(vResult[i]["OFFICE_KOR_NM"]) +"</p> ";
                    vHTML += "   			<p>서류마감일 : " + _fnFormatDotDate(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])) +"</p> ";
                    vHTML += "   			<p>화물마감일 : " + _fnFormatDotDate(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"])) + "</p> ";
                    vHTML += "   			<p>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"card_btn\"> ";
                    vHTML += "   			<button type=\"button\" class=\"btn_card\" name=\"btn_LayerCustInfo\" >상세정보</button> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["OFFICE_CD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["ETD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["REQ_SVC"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["EX_IM_TYPE"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["POL_CD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["POD_CD"] + "\" /> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                    
                } else {

                    vHTML += "   <div class=\"swiper-slide\"> ";
                    vHTML += "   	<div class=\"swiper_card\"> ";
                    vHTML += "   		<div class=\"card_logo\"> ";                    

                    if (_fnToNull(vResult[i]["LINE_PATH"]) == "") {
                        vHTML += "   						<img src=\"/images/no_data_bg04.png\" /> ";
                    } else {
                        vHTML += "   						<img src=\"" + _fnToNull(vResult[i]["LINE_PATH"]) + "\" /> ";
                    }

                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"card_info\"> ";
                    vHTML += "   			<p>상호명 : " + _fnToNull(vResult[i]["OFFICE_KOR_NM"]) + "</p> ";
                    vHTML += "   			<p>서류마감일 : " + _fnFormatDotDate(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])) + "</p> ";
                    vHTML += "   			<p>화물마감일 : " + _fnFormatDotDate(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])) + " " + _fnFormatTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"])) + "</p> ";
                    vHTML += "   			<p>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   		<div class=\"card_btn\"> ";
                    //onclick=\"layerPopup('#clientPop')\"
                    vHTML += "   			<button type=\"button\" class=\"btn_card\" name=\"btn_LayerCustInfo\" >상세정보</button> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["OFFICE_CD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["ETD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["REQ_SVC"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["EX_IM_TYPE"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["POL_CD"] + "\" /> ";
                    vHTML += "   			<input type=\"hidden\" value=\"" + vResult[i]["POD_CD"] + "\" /> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
            });

            if(vResult.length < 4) {
                for (var j = vResult.length; j < 4; j++) {
                    vHTML += "   <div class=\"swiper-slide\"> ";
                    vHTML += "   	<div class=\"swiper_card no_client\"> ";
                    vHTML += "   		<div class=\"blank\"> ";
                    vHTML += "   			<img src=\"/Images/no_data_bg03.png\" /> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
            }

            vHTML += " </div> ";

            if (matchMedia("screen and (min-width: 1025px)").matches) {
                if (vResult.length > 4) {
                    vRoof = true;
                    vHTML += " <div class=\"swiper-button-next\"></div> ";
                    vHTML += " <div class=\"swiper-button-prev\"></div> ";
                }
            } else {
                vRoof = true;
                vHTML += " <div class=\"swiper-button-next\"></div> ";
                vHTML += " <div class=\"swiper-button-prev\"></div> ";
            }

            $("div[name='" + vInnerHTML + "']")[0].innerHTML = vHTML;

            if (matchMedia("screen and (min-width: 1025px)").matches) {
                var swiper = new Swiper(".cliSwiper", {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    loop: vRoof,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                });
            }
            if (matchMedia("screen and (max-width: 1024px)").matches) {
                var swiper = new Swiper(".cliSwiper", {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    loop: true,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                });
            }

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

            vHTML += "<div class=\"swiper-wrapper logos\">";

            for (var j = 0; j < 4; j++) {
                vHTML += "   <div class=\"swiper-slide\"> ";
                vHTML += "   	<div class=\"swiper_card no_client\"> ";
                vHTML += "   		<div class=\"blank\"> ";
                vHTML += "   			<img src=\"/Images/no_data_bg03.png\" /> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            }

            $("div[name='" + vInnerHTML + "']")[0].innerHTML = vHTML;

            if (matchMedia("screen and (min-width: 1025px)").matches) {
                var swiper = new Swiper(".cliSwiper", {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                });
            }
            if (matchMedia("screen and (max-width: 1024px)").matches) {
                var swiper = new Swiper(".cliSwiper", {
                    slidesPerView: 1,
                    spaceBetween: 20,                    
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                });
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요");
            console.log("[Error - fnMakeSchMST] :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSchDTL]" + err.message);
    }
}

//거래처 상세 정보 데이터 그리기
function fnMakeCustDTL(vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Cust;

            vHTML += "   <div class=\"flex_box\"> ";
            vHTML += "   	<div class=\"client_logo no_bg\"> ";

            if (_fnToNull(vResult[0]["LINE_PATH"]) == "") {
                vHTML += "   	<img src=\"/images/no_data_bg04.png\" /> ";
            } else {
                vHTML += "   	<img src=\"" + _fnToNull(vResult[0]["LINE_PATH"]) + "\" /> ";
            }            

            vHTML += "   	</div> ";
            vHTML += "   </div> ";
            vHTML += "   <div class=\"flex_box wrap\"> ";
            vHTML += "   	<div class=\"flex_line\"> ";
            vHTML += "   		<p class=\"client_title\">" + _fnToNull(vResult[0]["OFFICE_KOR_NM"]) +"</p> ";
            vHTML += "   		<p class=\"desc\">Addr. " + _fnToNull(vResult[0]["LOC_ADDR"]) +"</p> ";
            vHTML += "   		<p class=\"desc\">Tel. " + _fnToNull(vResult[0]["HP_NO"]) +"</p> ";
            vHTML += "   		<p class=\"desc\">Email. " + _fnToNull(vResult[0]["EMAIL"]) +"</p> ";
            vHTML += "   	</div> ";
            vHTML += "   </div> ";

            $("#layer_clientPop_CustArea")[0].innerHTML = vHTML; 

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("상세정보 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요.");
            console.log("[Error - fnMakeCustDTL]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }


    } catch (err) {
        console.log("Error - fnMakeCustDTL" + err.message);
    }
}

//선박 위치 데이터 그려주기
function fnMakeRealLocation(vJsonData,vObj) {
    try {

        var vHTML = "";
        var vResult = "";
        var vVslData = fnGetVslData(vObj);        
        var vImgPath = fnGetLineImgPath(vObj.LINE_CD);

        vHTML += "";

        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"client_logo\"> ";

        if (JSON.parse(vImgPath).Result[0]["trxCode"] == "Y") {
            vHTML += "   		<img src=\"" + JSON.parse(vImgPath).LinePath[0]["LINE_PATH"]+"\" /> ";
        } else if (JSON.parse(vImgPath).Result[0]["trxCode"] == "N") {
            vHTML += "   	    <img src=\"/images/no_data_bg04.png\" /> ";
        }

        vHTML += "   	</div> ";
        vHTML += "   </div> ";
        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"flex_line\"> ";
        vHTML += "   		<p><span>Carrier</span>" + _fnToNull(JSON.parse(vVslData).CARR[0]["CARR_NM"]) + "</p> ";
        vHTML += "   		<p><span>Vessel</span>" + _fnToNull(JSON.parse(vVslData).VSL[0]["VSL_ORG_NM"]) + "</p> ";
        vHTML += "   		<p><span>IMO</span>" + _fnToNull(JSON.parse(vVslData).VSL[0]["VSL_IMO"]) + "</p> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";
        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"flex_line\"> ";
        vHTML += "   		<p><span>MMSI</span>" + _fnToNull(JSON.parse(vVslData).VSL[0]["VSL_MMSI"]) + "</p> ";
        vHTML += "   		<p><span>LAT</span>" + _fnToNull(JSON.parse(vJsonData).Master[0].MAP_LAT) + "</p> ";
        vHTML += "   		<p><span>LNG</span>" + _fnToNull(JSON.parse(vJsonData).Master[0].MAP_LNG)  + "</p> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";

        $("#layerTrkInfoArea")[0].innerHTML = vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeRealLocation]" + err.message);
    }
}

//업체 상세정보 레이어 팝업 재 생성
function fnMakeLayerPop() {

    try {
        var vHTML = "";

        $("#clientPop").empty();

        vHTML += "   <div class=\"layer_wrap\"> ";
        vHTML += "   	<div class=\"layer_inwrap\"> ";
        vHTML += "   		<article class=\"layer_cont\"> ";
        vHTML += "   			<div class=\"flex_type2\" id=\"layer_clientPop_CustArea\"> ";
        vHTML += "   				<div class=\"flex_box\"> ";
        vHTML += "   					<div class=\"client_logo no_bg\"> ";
        vHTML += "   					</div> ";
        vHTML += "   				</div> ";
        vHTML += "   				<div class=\"flex_box\"> ";
        vHTML += "   					<div class=\"flex_line\"> ";
        vHTML += "   						<p class=\"client_title\"></p> ";
        vHTML += "   						<p class=\"desc\"></p> ";
        vHTML += "   						<p class=\"desc\"></p> ";
        vHTML += "   						<p class=\"desc\"></p> ";
        vHTML += "   					</div> ";
        vHTML += "   				</div> ";
        vHTML += "   			</div> ";
        vHTML += "   			<div class=\"layer_info\"> ";
        vHTML += "   				<div class=\"flex_layer\"> ";
        vHTML += "   					<div class=\"flex_inner\"> ";
        vHTML += "   						<p class=\"title\" id=\"sch_year_month\">Title</p> ";
        vHTML += "   						<div class=\"flex_box\" id=\"layer_CircleChart1\"> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div id=\"sch_sheet_graph1\"></div> ";
        vHTML += "   							</div> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div class=\"inner\"> ";
        vHTML += "   									<p id=\"sch_sheet_graph1_title\">해운 B/L</p> ";
        vHTML += "   									<p class=\"count\" id=\"sch_sheet_graph1_data\"></p> ";
        vHTML += "   								</div> ";
        vHTML += "   							</div> ";
        vHTML += "   						</div> ";
        vHTML += "   						<div class=\"flex_box\" id=\"layer_CircleChart2\"> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div id=\"sch_sheet_graph2\"></div> ";
        vHTML += "   							</div> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div class=\"inner\"> ";
        vHTML += "   									<p id=\"sch_sheet_graph2_title\">해운 물동량</p> ";
        vHTML += "   									<p class=\"count\" id=\"sch_sheet_graph2_data\"></p> ";
        vHTML += "   								</div> ";
        vHTML += "   							</div> ";
        vHTML += "   						</div> ";
        vHTML += "   					</div> ";
        vHTML += "   					<div class=\"ex_swiper\"> ";
        vHTML += "   						<p class=\"year\" id=\"sch_year\"></p> ";
        vHTML += "   						<div id=\"sch_line_graph\"></div> ";
        vHTML += "   					</div> ";
        vHTML += "   				</div> ";
        vHTML += "   			</div> ";
        vHTML += "   			<button type=\"button\" class=\"btns close\" id=\"layer_clientPop_Close\"><span class=\"blind\">닫기</span></button> ";
        vHTML += "   		</article> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";

        $("#clientPop")[0].innerHTML = vHTML;

    } catch (err) {
        console.log("Error - fnMakeCustDTL" + err.message);
    }

}

/////////////////////API///////////////////////////////////////
//원형 차트 만들기
function fnApexChart(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Circle;

            //만약 데이터가 없으면?
            if (_fnToNull(vResult) == "") {

                //id 삭제
                $("#layer_CircleChart1").attr("id", "");
                $("#layer_CircleChart2").attr("id", "");

                var options = {
                    series: [0], //퍼센트로 잡히니 정수로 넣어야될듯.
                    chart: {
                        width: 110,
                        height: 140,
                        type: 'radialBar'
                        //events: {
                        //    click: function () {
                        //        _sch_chart.destroy();
                        //        //vOFFICE_CD, vDATE_YYYY, vDATE_MM, vREQ_SVC, vDATA_TYPE, vPOL_CD, vPOD_CD, vEX_IM_TYPE
                        //        fnSetLineChart(vResult[0].OFFICE_CD, vResult[0].DATE_YYYY, vResult[0].DATE_MM, vResult[0].REQ_SVC, vResult[0].POL_CD, vResult[0].POD_CD, vResult[0].EX_IM_TYPE , "BL");
                        //    }
                        //}
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                            endAngle: 360,//차트 끝 지점
                            hollow: {
                                margin: 0,
                                size: '75%',
                                background: '#fff',
                            },
                            track: { //안채워진 영역 색상
                                background: '#fff',
                                strokeWidth: '100%',
                                margin: 0, // margin is in pixels
                                dropShadow: {
                                    enabled: true,
                                    top: -3,
                                    left: 0,
                                    blur: 4,
                                    opacity: 0.35
                                }
                            },
                            dataLabels: {
                                show: true,
                                textAnchor: 'start',
                                value: {
                                    //formatter: function(val) { //값 형변환
                                    //  return parseInt(val);
                                    //},
                                    offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                                    color: '#111',
                                    fontSize: '15px',
                                    show: true,
                                }
                            }
                        }
                    },
                    //colors: ['#7878dc'],
                    fill: { //차트 색상 속성
                        type: 'gradient',
                        gradient: {
                            gradientToColors: ['#7878dc'],
                            stops: [0, 100]
                            //shade: 'dark',
                            //type: 'horizontal',
                            //shadeIntensity: 0.5,
                            //inverseColors: true,
                            //opacityFrom: 1,
                            //opacityTo: 1,
                        }
                    },
                    //stroke: {
                    //  lineCap: 'round'
                    //},
                    labels: [''],
                };

                var chart1 = new ApexCharts(document.querySelector("#sch_sheet_graph1"), options);
                chart1.render();

                var chart2 = new ApexCharts(document.querySelector("#sch_sheet_graph2"), options);
                chart2.render();

            } else {
                var AvgBLCnt = Math.ceil(vResult[0].TOT_DATA_CNT / vResult[0].YEAR_DATA_CNT * 100);
                var AvgRtonCnt = Math.ceil(vResult[0].TOT_DATA_RTON / vResult[0].YEAR_DATA_RTON * 100);

                $("#sch_sheet_graph1_data").text(fnSetComma(vResult[0].TOT_DATA_CNT) + " / " + fnSetComma(vResult[0].YEAR_DATA_CNT));
                $("#sch_sheet_graph2_data").text(fnSetComma(Math.ceil(vResult[0].TOT_DATA_RTON)) + " / " + fnSetComma(Math.ceil(vResult[0].YEAR_DATA_RTON)));

                if (vResult[0].REQ_SVC == "SEA") {
                    $("#sch_sheet_graph1_title").text("해운 B/L");
                    $("#sch_sheet_graph2_title").text("해운 물동량");
                }
                else if (vResult[0].REQ_SVC == "AIR") {
                    $("#sch_sheet_graph1_title").text("항공 AWB");
                    $("#sch_sheet_graph2_title").text("항공 물동량");
                }

                //공통 잡기
                _LineChart.OFFICE_CD = vResult[0].OFFICE_CD
                _LineChart.DATE_YYYY = vResult[0].DATE_YYYY
                _LineChart.DATE_MM = vResult[0].DATE_MM
                _LineChart.REQ_SVC = vResult[0].REQ_SVC
                _LineChart.POL_CD = vResult[0].POL_CD
                _LineChart.POD_CD = vResult[0].POD_CD
                _LineChart.EX_IM_TYPE = vResult[0].EX_IM_TYPE

                var options = {
                    series: [AvgBLCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
                    chart: {
                        width: 110,
                        height: 140,
                        type: 'radialBar'
                        //events: {
                        //    click: function () {
                        //        _sch_chart.destroy();
                        //        //vOFFICE_CD, vDATE_YYYY, vDATE_MM, vREQ_SVC, vDATA_TYPE, vPOL_CD, vPOD_CD, vEX_IM_TYPE
                        //        fnSetLineChart(vResult[0].OFFICE_CD, vResult[0].DATE_YYYY, vResult[0].DATE_MM, vResult[0].REQ_SVC, vResult[0].POL_CD, vResult[0].POD_CD, vResult[0].EX_IM_TYPE , "BL");
                        //    }
                        //}
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                            endAngle: 360,//차트 끝 지점
                            hollow: {
                                margin: 0,
                                size: '75%',
                                background: '#fff',
                            },
                            track: { //안채워진 영역 색상
                                background: '#fff',
                                strokeWidth: '100%',
                                margin: 0, // margin is in pixels
                                dropShadow: {
                                    enabled: true,
                                    top: -3,
                                    left: 0,
                                    blur: 4,
                                    opacity: 0.35
                                }
                            },
                            dataLabels: {
                                show: true,
                                textAnchor: 'start',
                                value: {
                                    //formatter: function(val) { //값 형변환
                                    //  return parseInt(val);
                                    //},
                                    offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                                    color: '#111',
                                    fontSize: '15px',
                                    show: true,
                                }
                            }
                        }
                    },
                    //colors: ['#7878dc'],
                    fill: { //차트 색상 속성
                        type: 'gradient',
                        gradient: {
                            gradientToColors: ['#7878dc'],
                            stops: [0, 100]
                            //shade: 'dark',
                            //type: 'horizontal',
                            //shadeIntensity: 0.5,
                            //inverseColors: true,
                            //opacityFrom: 1,
                            //opacityTo: 1,
                        }
                    },
                    //stroke: {
                    //  lineCap: 'round'
                    //},
                    labels: [''],
                };

                var chart1 = new ApexCharts(document.querySelector("#sch_sheet_graph1"), options);
                chart1.render();

                options = {
                    series: [AvgRtonCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
                    chart: {
                        width: 110,
                        height: 140,
                        type: 'radialBar'
                        //events: {
                        //    click: function () {
                        //        _sch_chart.destroy();
                        //        fnSetLineChart(vResult[0].OFFICE_CD, vResult[0].DATE_YYYY, vResult[0].DATE_MM, vResult[0].REQ_SVC, vResult[0].POL_CD, vResult[0].POD_CD, vResult[0].EX_IM_TYPE, "RTON");
                        //    }
                        //}
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: 0,//차트 시작 지점 총 360으로 시작과 끝을 해야된다.
                            endAngle: 360,//차트 끝 지점
                            hollow: {
                                margin: 0,
                                size: '75%',
                                background: '#fff',
                            },
                            track: { //안채워진 영역 색상
                                background: '#fff',
                                strokeWidth: '100%',
                                margin: 0, // margin is in pixels
                                dropShadow: {
                                    enabled: true,
                                    top: -3,
                                    left: 0,
                                    blur: 4,
                                    opacity: 0.35
                                }
                            },
                            dataLabels: {
                                show: true,
                                textAnchor: 'start',
                                value: {
                                    //formatter: function(val) { //값 형변환
                                    //  return parseInt(val);
                                    //},
                                    offsetY: -10, //y좌표 영역을 수정 할 수 있음. (이걸로 중앙 정렬 만들었음)
                                    color: '#111',
                                    fontSize: '15px',
                                    show: true,
                                }
                            }
                        }
                    },
                    //colors: ['#7878dc'],
                    fill: { //차트 색상 속성
                        type: 'gradient',
                        gradient: {
                            gradientToColors: ['#7878dc'],
                            stops: [0, 100]
                            //shade: 'dark',
                            //type: 'horizontal',
                            //shadeIntensity: 0.5,
                            //inverseColors: true,
                            //opacityFrom: 1,
                            //opacityTo: 1,
                        }
                    },
                    //stroke: {
                    //  lineCap: 'round'
                    //},
                    labels: [''],
                };

                var chart2 = new ApexCharts(document.querySelector("#sch_sheet_graph2"), options);
                chart2.render();
            }


            
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("상세정보 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요.");
            console.log("[Error - fnApexChart]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnApexChart]" + err.message);
    }
}

//라인 차트 만들기
function fnLineChart(vJsonData,vDATA_TYPE,vPAST_YYYY,vYYYY,vMM,vREQ_SVC) {
    try {        
        var vResult = "";
        
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {         

            var vCol;
            var vTitle = "";

            if (vDATA_TYPE == "BL") {
                if (vREQ_SVC == "SEA") {
                    vTitle = "해운 B/L";
                } else if (vREQ_SVC == "AIR") {
                    vTitle = "항공 AWB";
                }
                vCol = "TOT_DATA_CNT";
            } else if (vDATA_TYPE == "RTON") {

                if (vREQ_SVC == "SEA") {
                    vTitle = "해운 물동량";
                } else if (vREQ_SVC == "AIR") {
                    vTitle = "항공 물동량";
                }
                
                vCol = "TOT_DATA_RTON";
            }

            var vResult_Before = JSON.parse(vJsonData).Line_Before;
            var vResult_Now = JSON.parse(vJsonData).Line_Now;

            //전달년도 비교
            //var vData_Before = [];
            //var vData_Now = [];
            //
            //var vBeforeYYYY = Number(vPAST_YYYY)-1;
            //var vBeforeMM = Number(vMM)+1;
            //var vNowYYYY = Number(vYYYY)-1;
            //var vNowMM = Number(vMM)+1;
            //
            ////비교는 +1월달 부터 시작해야됨.
            //if (Number(vBeforeMM) == 13) {
            //    vBeforeYYYY = Number(vBeforeYYYY) + 1;
            //    vBeforeMM = 1;
            //}
            //
            ////비교는 +1월달 부터 시작해야됨.
            //if (Number(vNowMM) == 13) {
            //    vNowYYYY = Number(vNowYYYY) + 1;
            //    vNowMM = 1;
            //}
            //
            ////스케줄 데이터에서 데이터 가져오기
            //var vMonth = [];
            //var vData_Before = [];
            //var vData_Now = [];            
            //
            ////작년달 데이터 가공
            //for (var i = 0; i < 12; i++) {
            //
            //    var vValue = "";
            //
            //    for (var k = 0; k < vResult_Before.length; k++) {
            //        if (String(vBeforeYYYY) + String(_pad(vBeforeMM, 2)) == vResult_Before[k]["DATE_YYYYMM"]) {
            //            vValue = Math.ceil(vResult_Before[k][vCol]);
            //        }
            //    }
            //
            //    //데이터 넣기
            //    if (_fnToNull(vValue) == "") {
            //        vMonth.push(String(vBeforeMM) + '월');
            //        vData_Before.push(0);
            //    } else {
            //        vMonth.push(String(vBeforeMM) + '월');                    
            //        vData_Before.push(vValue);
            //    }
            //
            //    //월 +1씩 하기
            //    vBeforeMM = Number(vBeforeMM) + 1;
            //
            //    if (Number(vBeforeMM) == 13) {
            //        vBeforeYYYY = Number(vBeforeYYYY) + 1;
            //        vBeforeMM = 1;
            //    }
            //
            //}
            //
            ////현재달 데이터 가공
            //for (var i = 0; i < 12; i++) {
            //
            //    var vValue = "";
            //
            //    for (var k = 0; k < vResult_Now.length; k++) {
            //        if (String(vNowYYYY) + String(_pad(vNowMM, 2)) == vResult_Now[k]["DATE_YYYYMM"]) {
            //            vValue = Math.ceil(vResult_Now[k][vCol]);
            //        }
            //    }
            //
            //    //데이터 넣기
            //    if (_fnToNull(vValue) == "") {
            //        vData_Now.push(0);
            //    } else {
            //        vData_Now.push(vValue);
            //    }
            //
            //    //월 +1씩 하기
            //    vNowMM = Number(vNowMM) + 1;
            //
            //    if (Number(vNowMM) == 13) {
            //        vNowYYYY = Number(vNowYYYY) + 1;
            //        vNowMM = 1;
            //    }
            //}            

            //1월 ~ 12월 기준
            var vData_Before = [];
            var vData_Now = [];
            var j = 0;
            //데이터 만들기 1월~12월 Before
            for (var i = 0; i < 12; i++) {
                if (vResult_Before.length == 0) {
                    vData_Before.push(0);
                } else {
                    if (vResult_Before[j]["DATE_MM"] == _pad((i + 1), '2')) {

                        vData_Before.push(Math.ceil(Number(vResult_Before[j][vCol])));

                        if ((j + 1) != vResult_Before.length) {
                            j++;
                        }
                    } else {
                        vData_Before.push(0);
                    }
                }
            }
            
            j = 0;
            
            //데이터 만들기 1월~12월 Now
            for (var i = 0; i < 12; i++) {
                if (vResult_Now.length == 0) {
                    vData_Now.push(0);
                } else {
                    if (vResult_Now[j]["DATE_MM"] == _pad((i + 1), '2')) {

                        vData_Now.push(Math.ceil(Number(vResult_Now[j][vCol])));

                        if ((j + 1) != vResult_Now.length) {
                            j++;
                        }
                    } else {
                        vData_Now.push(0);
                    }
                }
            }

            var options = {
                series: [
                    {
                        name: "이전년도 " + vTitle,
                        data: vData_Before
                    },
                    {
                        name: "당일년도 " + vTitle,
                        data: vData_Now
                    }
                ],
                chart: {
                    //width : 670,
                    width: '100%',
                    height: 270,
                    type: 'line',
                    toolbar: {
                        show: false //chart에 toolbar를 없애야 될 듯
                    },
                    background: '#fff',//,
                    zoom: {
                        enabled : false
                    }
                    //,id: 'CanvasModify'
                },
                //forecastDataPoints: { Series 몇개 이상일 때 부터는 점선으로 나오게 설정
                //    count: 7
                //},
                stroke: {
                    width: 5,
                    curve: 'smooth'
                },
                legend: { //하단의 그래프 수정
                    show: true
                },
                xaxis: {
                    type: 'category',
                    categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    //categories: vMonth,
                    tickAmount: 12                    
                    //labels: {
                    //    formatter: function (value, timestamp, opts) {
                    //        return opts.dateFormatter(new Date(timestamp), 'yyyymm')
                    //    },
                    //    //style: { //Label에 클래스 넣기
                    //    //    cssClass : 'TESTTEST'
                    //    //}
                    //}
                },
                //title: {
                //    text: 'Forecast',
                //    align: 'left',
                //    style: {
                //        fontSize: "16px",
                //        color: '#666'
                //    }
                //},
                colors: ['#25d2a1', '#7f88ef'],
                fill: {
                    //type: 'gradient',
                    //gradient: { 그라데이션 세팅
                    //    shade: 'dark',
                    //    //gradientToColors: ['#FDD835'],
                    //    gradientToColors: ['#0000FF','#FF0000'],
                    //    shadeIntensity: 1,
                    //    type: 'horizontal',
                    //    opacityFrom: 1,
                    //    opacityTo: 1,
                    //    stops: [0, 100, 100, 100]
                    //},
                },
                title: {
                    text: vTitle,
                    align: "left",
                    offsetY: 15,
                    style: {
                        fontSize: '12px',
                        fontweight: 'normal',
                        fontFamily: 'Noto Sans KR'
                    }
                },
                yaxis: {
                    min: 0,                    
                    labels: {
                        formatter: function (val , index) {
                            return parseInt(val);
                        }
                    }
                    //labels: {
                    //    style: {
                    //        cssClass: 'TESTTEST22'
                    //    }
                    //}
                }
            };
            _sch_chart = new ApexCharts(document.querySelector("#sch_line_graph"), options);
            _sch_chart.render();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("상세정보 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요.");
            console.log("[Error - fnApexChart]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnLineChart]" + err.message);
    }
}

function connectTheDots(data) {
    var c = [];
    for (i in data._layers) {
        var x = data._layers[i]._latlng.lat;
        var y = data._layers[i]._latlng.lng;
        c.push([x, y]);
    }
    return c;
}

function drawingLayer(json_data) {
    var spiral = {
        type: "FeatureCollection",
        features: []
    };
    var master = json_data.Master[0];//헤더 테이블 조회

    var vlat = json_data.Master[0].MAP_LAT;
    var vlng = json_data.Master[0].MAP_LNG;

    //예외처리
    if (_fnToZero(json_data.Master[0].MAP_LAT) == 0 || _fnToZero(json_data.Master[0].MAP_LAT) == 0) {
        vlat = 32.896531;
        vlng = 124.402956;
    }

    var result = [];
    for (var i in master)
        result.push([master[i]]);

    //var POL = result[4].concat(result[5]);
    var POL = result[3].concat(result[4]);

    var lastRoute;
    var rotate;
    var detail = json_data.Detail;//디테일 테이블 조회

    //디테일이 없을 경우
    if (detail.length > 0) {
        var result2 = [];

        for (var i = 0; i < detail.length; i++) {
            var arrayDt = [];
            arrayDt.push(detail[i]["MAP_LAT"]);
            arrayDt.push(detail[i]["MAP_LNG"]);
            lastRoute = arrayDt;    // 배 아이콘 위치
            rotate = detail[i]["MAP_COURSE"]; // 배 방향
            result2.push(arrayDt);
            var g = {
                "type": "Point",
                "coordinates": [detail[i]["MAP_LNG"], detail[i]["MAP_LAT"]]
            };
            var p = {
                "id": i,
                "speed": detail[i]["MAP_SPEED"],
                "course": detail[i]["MAP_COURSE"]
            };
            spiral.features.push({
                "geometry": g,                
                "type": "Feature",
                "properties": p
            });
        }
    }
    
    var zoom = 5; //줌 레벨

    if (_fnToNull(mymap) != "") {
        mymap.remove();
    }

    mymap = L.map('map', {
        center: [vlat, vlng],
        //center: [32.896531, 124.402956],
        zoom: zoom,
        zoomControl: false
    });

    L.control.zoom({
        position: 'bottomright'
    }).addTo(mymap);

    /*
    lyrs=m : Standard Road Map
    lyrs=p : Terrain
    lyrs=r : Somehow Altered Road Map
    lyrs=s : Satellite Only
    lyrs=t : Terrain Only
    lyrs=y : Hybrid
    lyrs=h : Roads Only
    */

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
    }).addTo(mymap);

    // Creating a poly line

    var circleIcon = L.icon({
        iconUrl: "../Images/circle.png",
        //iconUrl: "../Images/icn_delete.png",
        iconSize: [4, 4]  // size of the icon
    });

    //디테일 예외처리
    if (detail.length > 0) {

        //var polyline = L.geoJson(spiral, {
        //    pointToLayer: function (feature, latlng) {
        //        return L.marker(latlng, {
        //            icon: circleIcon
        //        });
        //    },
        //    dashArray: '2,2',
        //    dashOffset: '2'
        //    //onEachFeature: function (feature, layer) {
        //    //    layer.bindPopup('<table><tbody><tr><td><div><b>speed:</b></div></td><td><div>' + feature.properties.speed + '</div></td></tr><tr><td><div><b>course:</b></div></td><td><div>' + feature.properties.course + '</div></td></tr></tbody></table>');
        //    //    layer.on('mouseover', function () { layer.openPopup(); });
        //    //    layer.on('mouseout', function () { layer.closePopup(); });
        //    //}
        //});       
        //        
        //polyline.addTo(mymap);
        //
        //spiralCoords = connectTheDots(polyline);
        //var spiralLine = L.polyline(spiralCoords).addTo(mymap);

        var polyline = L.geoJson(spiral, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: circleIcon
                });
            },
            //onEachFeature: function (feature, layer) {
            //    layer.bindPopup('<table><tbody><tr><td><div><b>speed:</b></div></td><td><div>' + feature.properties.speed + '</div></td></tr><tr><td><div><b>course:</b></div></td><td><div>' + feature.properties.course + '</div></td></tr></tbody></table>');
            //    layer.on('mouseover', function () { layer.openPopup(); });
            //    layer.on('mouseout', function () { layer.closePopup(); });
            //}
        });

        polyline.addTo(mymap);
        spiralCoords = connectTheDots(polyline);
        //var spiralLine = L.polyline(spiralCoords).addTo(mymap);

        //점선으로 라인 변경하기 위해 추가
        var pathPattern = L.polylineDecorator(
            [spiralCoords],
            {
                patterns: [
                    { offset: 0, repeat: 10, symbol: L.Symbol.dash({ pixelSize: 5, pathOptions: { color: '#24429c', weight: 2, opacity: 0.8 } }) },
                ]
            }
        ).addTo(mymap);
    }

    var shipIconBig = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [24, 30]  // size of the icon
    });

    var shipIcon = L.icon({
        iconUrl: "../Images/icn_ship.png"
    });

    var makerIcon = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [30, 42]
    });
    var portIcon = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [30, 42]
    });

    var makerIconBig = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [24, 30]
    });
    var portIconBig = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [24, 30] // size of the icon
    });


    var maker_POL = L.marker(POL, { icon: portIconBig }).addTo(mymap);
    //var LastMarker = L.marker(lastRoute, { icon: shipIcon, rotationOrigin: 'center center' }).addTo(mymap);

    mymap.on('zoomend', function () {
        if (currentZoom <= 5) {
        var currentZoom = mymap.getZoom();
            maker_POL.setIcon(portIconBig);
            //LastMarker.setIcon(shipIconBig);
        }
        else {
            maker_POL.setIcon(portIcon);
            //LastMarker.setIcon(shipIcon);
        }
    });

    mymap.options.maxZoom = 8;
    mymap.options.minZoom = 2;
}