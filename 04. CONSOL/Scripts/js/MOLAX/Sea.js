////////////////////전역 변수//////////////////////////
var _vPage = 1;
var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
 
////////////////////jquery event///////////////////////
$(function () {

    //TWKIM - 20220901 비로그인 서비스로 전환
    //로그인 세션 확인 
    //if (_fnToNull($("#Session_USR_ID").val()) == "") {
    //    window.location = window.location.origin;
    //} else {
    //    $('#start_region, #arrive_region').val('');
    //    $('#start_txt').text('출발');
    //    $('#arrive_txt').text('도착');
    //
    //    //fnSetServiceType("#select_CntrType", "SEA", "");
    //    $("#input_ETD").val(_fnPlusDate(0)); //ETD	    
    //}

    $('#start_region, #arrive_region').val('');
    $('#start_txt').text('출발');
    $('#arrive_txt').text('도착');

    //fnSetServiceType("#select_CntrType", "SEA", "");
    $("#input_ETD").val(_fnPlusDate(0)); //ETD

    //뒤로가기 이벤트로 왔을 경우 이벤트
    if (event.persisted || (window.performance && window.performance.navigation.type == 2) || event.originalEvent && event.originalEvent.persisted) {

        if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "SCHEDULE_SEA") {
            $("#select_CntrType").val(_fnToNull(sessionStorage.getItem("CNTR_TYPE")));
            $("#Select_Bound").val(_fnToNull(sessionStorage.getItem("BOUND")));
            $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));

            if (_fnToNull(sessionStorage.getItem("BOUND")) == "E") {
                $(".pop__export").show();
                $(".pop__import").hide();
                $("#input_POL").text(_fnToNull(sessionStorage.getItem("POL_NM")));
                $("#input_POLCD").val(_fnToNull(sessionStorage.getItem("POL_CD")));
                $("#input_auto_POD").val(_fnToNull(sessionStorage.getItem("POD_NM")));
                $("#input_auto_PODCD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
                $("button[name='input_POL']").show();
                $("button[name='input_auto_POD']").show();
            }
            else if (_fnToNull(sessionStorage.getItem("BOUND")) == "I") {
                $(".pop__export").hide();
                $(".pop__import").show();
                $("#input_auto_POL").val(_fnToNull(sessionStorage.getItem("POL_NM")));
                $("#input_auto_POLCD").val(_fnToNull(sessionStorage.getItem("POL_CD")));
                $("#input_POD").text(_fnToNull(sessionStorage.getItem("POD_NM")));
                $("#input_PODCD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
                $("button[name='input_auto_POL']").show();
                $("button[name='input_POD']").show();
            }

            sessionStorage.clear();

            $("#btn_Schedule_Search").click();
        }

        //TWKIM - 20220901 비로그인 서비스 전환
        //if (_fnToNull($("#Session_USR_ID").val()) == "") {
        //    window.location = window.location.origin;
        //} else {
        //    if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "SCHEDULE_SEA") {
        //        $("#select_CntrType").val(_fnToNull(sessionStorage.getItem("CNTR_TYPE")));
        //        $("#Select_Bound").val(_fnToNull(sessionStorage.getItem("BOUND")));
        //        $("#input_ETD").val(_fnToNull(sessionStorage.getItem("ETD")));
        //
        //        if (_fnToNull(sessionStorage.getItem("BOUND")) == "E") {
        //            $(".pop__export").show();
        //            $(".pop__import").hide();
        //            $("#input_POL").text(_fnToNull(sessionStorage.getItem("POL_NM")));
        //            $("#input_POLCD").val(_fnToNull(sessionStorage.getItem("POL_CD")));
        //            $("#input_auto_POD").val(_fnToNull(sessionStorage.getItem("POD_NM")));
        //            $("#input_auto_PODCD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
        //            $("button[name='input_POL']").show();
        //            $("button[name='input_auto_POD']").show();
        //        }
        //        else if (_fnToNull(sessionStorage.getItem("BOUND")) == "I") {
        //            $(".pop__export").hide();
        //            $(".pop__import").show();
        //            $("#input_auto_POL").val(_fnToNull(sessionStorage.getItem("POL_NM")));
        //            $("#input_auto_POLCD").val(_fnToNull(sessionStorage.getItem("POL_CD")));
        //            $("#input_POD").text(_fnToNull(sessionStorage.getItem("POD_NM")));
        //            $("#input_PODCD").val(_fnToNull(sessionStorage.getItem("POD_CD")));
        //            $("button[name='input_auto_POL']").show();
        //            $("button[name='input_POD']").show();
        //        }
        //        
        //        sessionStorage.clear();
        //
        //        $("#btn_Schedule_Search").click();
        //    }
        //}
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

$(document).on("change", "#Select_Bound", function () {

    if ($(this).find("option:selected").val() == "E")
    {
        $(".pop__export").show();
        $(".pop__import").hide();        
        $('.city-text-dpt').text('출발');
        $('.city-text-arrive').text('도착');
    }
    else if ($(this).find("option:selected").val() == "I")
    {
        $(".pop__export").hide();
        $(".pop__import").show();
        $('.city-text-arrive').text('출발');
        $('.city-text-dpt').text('도착');
    }

    fnInitData();
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETD_Icon", function () {
    $("#input_ETD").focus();
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_ETD", function () {
    var vValue = $("#input_ETD").val();

    if (vValue.length > 0)
    {
        var vValue_Num = vValue.replace(/[^0-9]/g, "");
        if (vValue != "") {
            vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
            $(this).val(vValue);
        }

        //값 벨리데이션 체크
        if (!_fnisDate($(this).val())) {
            $(this).val(_fnPlusDate(0));
        }
    }
    
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
    _vPage = 1;
    fnGetSchData();
});

//수출 - Close 부킹 버튼 이벤트
$(document).on("click", "a[name='btn_Booking_E_Close']", function () {
    layerPopup2("#layer_E_ScheduleInfo");
    //alert("수출 서류마감 된 스케줄입니다.");
});

//수입 - Close 부킹 버튼 이벤트
$(document).on("click", "a[name='btn_Booking_I_Close']", function () {
    layerPopup2("#layer_I_ScheduleInfo");
    //alert("수입 서류마감 된 스케줄입니다.");
});

//부킹 버튼 이벤트
$(document).on("click", "a[name='btn_Booking']", function () {

    if (_fnToNull($("#Session_USR_ID").val()) != "") {
        fnSetBooking($(this).siblings("input").val());        
    } else {
        fnShowLoginLayer("goBooking;" + $(this).siblings("input").val());
    }
    
});

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
            fnGetSchData();
        }
    }

});
////////////////////////function///////////////////////
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
        vHTML += "   	<td class=\"no_data\" colspan=\"10\"></td> ";
        vHTML += "   </tr> ";

        $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

        vHTML = "";

        //MO
        vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
        vHTML += "   	<li class=\"no_data col-12 py-6\"></li> ";
        vHTML += "   </ul> ";

        $("#Schedule_AREA_MO")[0].innerHTML = vHTML;

        //부킹 전역 변수 초기화
        _isSearch = false;
    }
    catch (err) {
        console.log("[Error - fnInitData()]" + err.message);
    }
}

//즐겨찾기 메뉴 띄우기
function fnShowQuickMenu() {
    try {if ($("#Select_Bound").find("option:selected").val() == "E") {
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
                url: "/MOLAX/fnGetSchData",
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
        console.log("[Error - fnGetScheduleData()]" + err.message);
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

function fnSchGoPage(vPage) {
    _vPage = vPage;
    fnGetSchData();
}

function fnSetBooking(vSCH_NO) {
    try {
        var objJsonData = new Object();
        objJsonData.SCH_NO = vSCH_NO;

        sessionStorage.setItem("BEFORE_VIEW_NAME", "SCHEDULE_SEA");
        sessionStorage.setItem("VIEW_NAME", "REGIST");
        sessionStorage.setItem("BOUND", $("#Select_Bound").find("option:selected").val());

        if ($("#Select_Bound").find("option:selected").val() == "E") {
            sessionStorage.setItem("POL_NM", $("#input_POL").text());
            sessionStorage.setItem("POL_CD", $("#input_POLCD").val());
            sessionStorage.setItem("POD_NM", $("#input_auto_POD").val());
            sessionStorage.setItem("POD_CD", $("#input_auto_PODCD").val());
        }
        else if ($("#Select_Bound").find("option:selected").val() == "I") {
            sessionStorage.setItem("POL_NM", $("#input_auto_POL").val());
            sessionStorage.setItem("POL_CD", $("#input_auto_POLCD").val());
            sessionStorage.setItem("POD_NM", $("#input_POD").text());
            sessionStorage.setItem("POD_CD", $("#input_PODCD").val());
        }

        sessionStorage.setItem("ETD", $("#input_ETD").val());
        sessionStorage.setItem("CNTR_TYPE", $("#select_CntrType").find("option:selected").val());

        controllerToLink("Regist", "MOLAX", objJsonData);
    }
    catch (err) {
        console.log("[Error - fnSetBooking()]" + err.message);
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
                vHTML += "   <tr class=\"sch_row\"> ";                
                vHTML += "   	<td class=\"logo-box\"> ";
                vHTML += "   		<div class=\"logo-img\"> ";
                vHTML += "   			<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   		</div> ";
                vHTML += "   	</td> ";
                //TWKIM - 20221102 김미연 담당자 요청으로 선사 LINE은 삭제
                vHTML += "   	<td class=\"txt font-sub pr-4 font-weight-medium\">" + _fnToNull(vResult[i]["VSL_VOY"]) + "</td> ";

                //ETD
                vHTML += "   	<td class=\"txt\">";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]) + "";
                vHTML += "      </td > ";

                //ETA
                vHTML += "   	<td class=\"txt\">";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ")<br /> ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "      </td > ";

                //서류마감일 txt-doc / on 
                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    vHTML += "   	<td class=\"txt pr-3\">";
                    vHTML += "";
                }
                else {
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        vHTML += "   	<td class=\"txt txt-doc on pr-3\">";
                    }
                    else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                        vHTML += "   	<td class=\"txt txt-doc pr-3\">";
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
                vHTML += "      </td > ";

                //카고마감일
                vHTML += "   	<td class=\"txt pr-3\">";
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
                vHTML += "      </td > ";

                //T/Time
                if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
                    if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
                        vHTML += "   	<td class=\"txt\">" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</td> ";
                    } else {
                        vHTML += "   	<td class=\"txt\">" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</td> ";
                    }
                } else {
                    vHTML += "   	<td class=\"txt\"></td> ";
                }

                //TS
                if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {
                    vHTML += "   	<td class=\"txt\">T/S</td> ";
                } else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {
                    vHTML += "   	<td class=\"txt\">Direct</td> ";
                } else {
                    vHTML += "   	<td class=\"txt\"></td> ";
                }

                vHTML += "   	<td class=\"txt\"> ";
                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking_E_Close\">BOOKING</a> ";
                    } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking_I_Close\">BOOKING</a> ";
                    }
                } else {

                    vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking\">BOOKING</a> ";

                    vHTML += "			<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\" /> 		";
                }
                vHTML += "   	</td> ";

                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"btn_rel\"><i class=\"xi-plus\"></i></a> ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
                vHTML += "   <tr class=\"related_info\"> ";
                vHTML += "   	<td colspan=\"10\"> ";
                vHTML += "   		<ul class=\"etc_info\"> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>반입지 : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>비고 : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
            });

            $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

            //모바일 화면 작업
            vHTML = "";

            $.each(vResult, function (i) {
                vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Carrier</p> ";
                vHTML += "   		<div class=\"logo-img\"> ";
                vHTML += "   			<img src=\"" + _fnToNull(vResult[i]["IMG_PATH"]) + "\" alt=\"logo\" /> ";
                vHTML += "   		</div> ";
                vHTML += "   	</li> ";
                //VSL
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Vessel</p> ";
                //TWKIM - 20221102 김미연 담당자 요청으로 선사 LINE은 삭제
                vHTML += "   		<p class=\"des des-sch\">" + _fnToNull(vResult[i]["VSL_VOY"]) + "</p> ";
                vHTML += "   	</li> ";
                //ETD
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Departure</p> ";
                vHTML += "   		<p class=\"des\">";
                vHTML += String(_fnToNull(vResult[i]["ETD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETD"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POL_CD"]);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                //ETA
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Arrival</p> ";
                vHTML += "   		<p class=\"tit\">";
                vHTML += String(_fnToNull(vResult[i]["ETA"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["ETA"]).replace(/\./gi, ""))) + ") ";
                vHTML += _fnToNull(vResult[i]["POD_CD"]) + "";
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";

                //DOC CLOSE
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Doc Closing</p> ";
                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["DOC_CLOSE_YMD"]) == "0") {
                    vHTML += "   	<p class=\"des\"></p> ";
                } else {
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        vHTML += "   	<p class=\"des\" style=\"color:#e12832\">";
                    }
                    else if (_fnToNull(vResult[i]["PREV_CLOSE"]) <= _fnGetTodayStamp()) {
                        vHTML += "   	<p class=\"des\" style=\"color:#fc6f20\">";
                    }
                    else {
                        vHTML += "   	<p class=\"des\">";
                    }
                    vHTML += String(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["DOC_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
                    vHTML += "      </p>";
                }      
                vHTML += "   	</li> ";

                //CARGO CLOSE
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Cargo Closing</p> ";
                if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "" || _fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) == "0") {
                    vHTML += "   	<p class=\"des\"></p> ";
                } else {
                    vHTML += "   	<p class=\"des\">";
                    vHTML += String(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + " (" + (_fnGetWhatDay(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]).replace(/\./gi, ""))) + ")<br /> ";
                    vHTML += "      </p>";
                }                
                vHTML += "   	</li> ";

                //T/Time
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">T&#47;time</p> ";
                if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"])) > 0) {
                    if (Number(_fnToNull(vResult[i]["TRANSIT_TIME"]) > 1)) {
                        vHTML += "   		<p class=\"des\">" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Days</p> ";                        
                    } else {
                        vHTML += "   		<p class=\"des\">" + _fnToNull(vResult[i]["TRANSIT_TIME"]) + " Day</p> ";                       
                    }
                } else {
                    vHTML += "   		<p class=\"des\"></p> ";
                }
                vHTML += "   	</li> ";

                //TS
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">T&#47;S</p> ";
                if (_fnToNull(vResult[i]["TS_CNT"]) == "0") {                    
                    vHTML += "   	<p class=\"des\">T/S</p> ";
                } else if (_fnToNull(vResult[i]["TS_CNT"]) == "1") {                    
                    vHTML += "   	<p class=\"des\">Direct</p> ";
                } else {
                    vHTML += "   	<p class=\"des\"></p> ";
                }
                vHTML += "   	</li> ";

                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";

                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) + _fnFormatTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                    if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "E") {
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking_E_Close\">BOOKING</a> ";
                    } else if (_fnToNull(vResult[i]["EX_IM_TYPE"]) == "I") {
                        vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking_I_Close\">BOOKING</a> ";
                    }
                } else {
                    vHTML += "   		<a href=\"javascript:void(0)\" class=\"bk-td\" name=\"btn_Booking\">BOOKING</a> ";
                    vHTML += "			<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["SCH_NO"]) + "\" /> 		";
                }

                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full related_info\"> ";
                vHTML += "   		<ul class=\"etc_info\"> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>반입지 : " + _fnToNull(vResult[i]["POL_TML_NM"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>담당자 : " + _fnToNull(vResult[i]["SCH_PIC"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   			<li class=\"item\"> ";
                vHTML += "   				<em>비고 : " + _fnToNull(vResult[i]["RMK"]) + "</em> ";
                vHTML += "   			</li> ";
                vHTML += "   		</ul> ";
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
            vHTML += "   	<td class=\"no_data\" colspan=\"10\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></td> ";
            vHTML += "   </tr> ";

            $("#Schedule_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></li> ";
            vHTML += "   </ul> ";

            $("#Schedule_AREA_MO")[0].innerHTML = vHTML;

            console.log("[Fail - fnMakeSchList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
            $("#Paging_Area").hide();
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
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">관리자에게 문의하세요.</span></li> ";
            vHTML += "   </ul> ";

            $("#Schedule_AREA_MO")[0].innerHTML = vHTML;

            console.log("[Error - fnMakeSchList(vJsonData)]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
            $("#Paging_Area").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSchList(vJsonData)]" + err.message);
    }
}
