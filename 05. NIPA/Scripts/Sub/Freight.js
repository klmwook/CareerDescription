////////////////////전역 변수//////////////////////////
var _FreMainChart = "";
var _layer_line_chart;
var _LineChart = new Object();
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    //$("#header").addClass("close");
    $('#lnb > li.sub_fre > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(4) > a').addClass("on");

    //현재 년도 셋팅
    $("#span_Year").text(new Date().getFullYear());
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');
            if (parseFloat(vIndex) == 2) {
                $("#btn_search").click();
            } else {
                $('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }
        }
    }
});

//이전 년도 클릭 이벤트
$(document).on("click", "#btn_cal_left", function () {
    var vValue = Number($("#span_Year").text()) - 1;
    $("#span_Year").text(vValue);
    if (_FreMainChart != "") {
        _FreMainChart.destroy();
    }
    fnSearchFre();
});

//다음 년도 클릭 이벤트
$(document).on("click", "#btn_cal_right", function () {
    var vValue = Number($("#span_Year").text()) + 1;
    $("#span_Year").text(vValue);
    if (_FreMainChart != "") {
        _FreMainChart.destroy();
    }
    fnSearchFre();
});

//POL 클릭 이벤트
$(document).on("click", "#input_POL", function () {
    if ($(this).val().length == 0) {
        $("#select_SEA_pop01").hide();
        $("#select_SEA_pop02").hide();
        selectPopOpen("#select_SEA_pop01");
    }
});

//POD 클릭 이벤트
$(document).on("click", "#input_POD", function () {
    if ($(this).val().length == 0) {
        $("#select_SEA_pop01").hide();
        $("#select_SEA_pop02").hide();
        selectPopOpen("#select_SEA_pop02");
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

//출발지 자동완성
$(document).on("keyup", "#input_POL", function () {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_POLCD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("#select_SEA_pop01").hide();
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop01").hide();
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
    } else if ($(this).val().length == 0) {
        $("#select_SEA_pop02").hide();
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

//해상운임 추이 검색 버튼
$(document).on("click", "#btn_search", function () {

    $("#span_Year").text(new Date().getFullYear());
    if (_FreMainChart != "") {
        _FreMainChart.destroy();
    }

    fnSearchFre();
});

//추천 포워더 비용 / 시간 change 이벤트
$(document).on("change", "#select_forwarder", function () {
    fnGetRecomendCust();
});

//거래처 상세정보 클릭 이벤트
$(document).on("click", "button[name='btn_LayerCustInfo']", function () {

    //_fnAlertMsg("준비 중 입니다.");
    fnGetCustDTLData($(this).siblings("input[type='hidden']").eq(0).val());
    //_fnAlertMsg("버튼 이벤트" + $(this).siblings("input[type='hidden']").eq(0).val());
    
});

//상세 정보 레이어 팝업 닫기 이벤트
$(document).on("click", "#layer_freclientPop_Close", function () {

    //아예 삭제하고 다시 올리기
    fnMakeLayerPop();

    //기존에 있었던 친구들
    //$("#fre_line_graph").remove();
    //$("#fre_line_graph_area").removeAttr("style");    
    _layer_line_chart.destroy();
    _layer_line_chart ="";
    layerClose('#freclientPop');
});

//레이어 원 차트 영역 클릭 이벤트
$(document).on("click", "#layer_FreCircleChart1", function () {
    _layer_line_chart.destroy();
    fnSetLayerLineChart(_LineChart.OFFICE_CD, "BL");
});

//레이어 원 차트 영역 클릭 이벤트
$(document).on("click", "#layer_FreCircleChart2", function () {
    _layer_line_chart.destroy();
    fnSetLayerLineChart(_LineChart.OFFICE_CD, "RTON");
});

/////////////////////function///////////////////////////////////
//포트 정보 가져오기 
function fnGetPortData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.LOC_TYPE = "SEA";
        objJsonData.LOC_CD = vValue;

        $.ajax({
            type: "POST",
            url: "/Freight/fnGetPort",
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
        console.log("[Error - fnGetPortData]" + err.message);0
    }
}

//연도별 해상 운임 추이 & 추천 포워더 데이터 가져오기 (조회 버튼 이벤트)
//function fnSearchFre() {
//    try {
//
//        if (fnValidation()) {
//            var objJsonData = new Object();
//
//            //TEST
//            //objJsonData.DATE_YYYY = "2021";
//            //objJsonData.DATE_YYYY_PAST = "2020";
//            //objJsonData.POL_CD = "";
//            //objJsonData.POD_CD = "";
//            //objJsonData.CNTR_TYPE = "";
//            //objJsonData.RECOMEND = "PRICE";
//
//            objJsonData.DATE_YYYY = $("#span_Year").text();
//            objJsonData.DATE_YYYY_PAST = Number($("#span_Year").text()) - 1;
//            objJsonData.POL_CD = _fnToNull($("#input_POLCD").val());
//            objJsonData.POD_CD = _fnToNull($("#input_PODCD").val());
//            objJsonData.CNTR_TYPE = _fnToNull($("#select_CNTR_TYPE option:selected").val());
//            objJsonData.RECOMEND = "PRICE";
//
//            $.ajax({
//                type: "POST",
//                url: "/Freight/GetFreData",
//                async: true,
//                dataType: "json",
//                //data: callObj,
//                data: { "vJsonData": _fnMakeJson(objJsonData) },
//                success: function (result) {
//                    $("#no_search").hide();
//                    $("#no_data").hide();
//                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
//                        fnMakeChart(result);
//                        fnMakeCustData(result);
//                        $("#div_FreightArea").show()
//                        $("#div_RecommendArea").show();
//                    }
//                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
//                        $("#div_FreightArea").hide();
//                        $("#div_RecommendArea").hide();
//                        $("#no_data").show();
//                    }
//                }, error: function (xhr, status, error) {
//                    $("#ProgressBar_Loading").hide(); //프로그래스 바
//                    _fnAlertMsg("담당자에게 문의 하세요.");
//                    console.log(error);
//                },
//                beforeSend: function () {
//                    $("#ProgressBar_Loading").show(); //프로그래스 바
//                },
//                complete: function () {
//                    $("#ProgressBar_Loading").hide(); //프로그래스 바
//                }
//            });
//        }
//        
//    }
//    catch (err) {
//        console.log("[Error - fnSearchFre]" + err.message);
//    }
//}

//API로 데이터 가져오기
function fnSearchFre() {
    try {

        if (fnValidation()) {

            $("#div_FreightArea").hide();
            $("#div_RecommendArea").hide();

            var objJsonData = new Object();

            //TEST
            //objJsonData.DATE_YYYY = "2021";
            //objJsonData.DATE_YYYY_PAST = "2020";
            //objJsonData.POL_CD = "";
            //objJsonData.POD_CD = "";
            //objJsonData.CNTR_TYPE = "";
            //objJsonData.RECOMEND = "PRICE";

            //DB 전용 
            objJsonData.DATE_YYYY = $("#span_Year").text();
            objJsonData.DATE_YYYY_PAST = Number($("#span_Year").text()) - 1;
            objJsonData.POL_CD = _fnToNull($("#input_POLCD").val());
            objJsonData.POD_CD = _fnToNull($("#input_PODCD").val());
            objJsonData.CNTR_TYPE = _fnToNull($("#select_CNTR_TYPE option:selected").val());
            objJsonData.RECOMEND = "PRICE";

            //API 전용
            objJsonData.PAST_YMD = Number($("#span_Year").text()) - 1;
            objJsonData.APPLY_YMD = $("#span_Year").text();
            objJsonData.POL = _fnToNull($("#input_POLCD").val());
            objJsonData.POD = _fnToNull($("#input_PODCD").val());
            objJsonData.CNTR_NO = _fnToNull($("#select_CNTR_TYPE option:selected").val());

            $("#ProgressBar_Loading").show(); //프로그래스 바

            var strurl = _ApiUrl + "api/freight/GetFreight";

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
                    $("#no_search").hide();
                    $("#no_data").hide();
                    if (result != null) {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                            var CustResult = fnApiTried(objJsonData);
                            //objJsonData.APPLY_YMD = Number($("#span_Year").text()) - 1;
                            //var result2 = fnApiSecond(objJsonData);

                            //fnMakeChart(result, result2);
                            fnMakeChart(result);
                            fnMakeCustData(CustResult);
                            $("#div_FreightArea").show()
                            $("#div_RecommendArea").show();
                        } else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            $("#div_FreightArea").hide();
                            $("#div_RecommendArea").hide();
                            $("#no_data").show();
                        } else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                            _fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                            console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        }
                    } else {
                        _fnAlertMsg("데이터가 없습니다.");
                    }
                    $("#ProgressBar_Loading").hide(); //프로그래스 바

                }, error: function (xhr) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                    console.log(xhr);
                    return;
                }
            });

            //objJsonData.APPLY_YMD = Number($("#span_Year").text()) - 1;
            //
            //$.ajax({
            //    url: strurl,
            //    beforeSend: function (xhr) {
            //        xhr.setRequestHeader('Authorization-Token', _ApiKey);
            //    },
            //    type: "POST",
            //    async: false,
            //    dataType: "json",
            //    data: { "": _fnMakeJson(obj) },
            //    success: function (result) {
            //        $("#ProgressBar_Loading").hide(); //프로그래스 바
            //        if (result != null) {
            //            _fnMakeList(JSON.parse(result), pageIndex);
            //        } else {
            //            _fnAlertMsg("no data");
            //        }
            //    }, error: function (xhr) {
            //        $("#ProgressBar_Loading").hide(); //프로그래스 바
            //        alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            //        console.log(xhr);
            //        return;
            //    }
            //});            
        }

    }
    catch (err) {
        console.log("[Error - fnSearchFre]" + err.message);
    }
}

//2번째 API 가져오기
function fnApiSecond(obj) {
    try {
        if (fnValidation()) {
            var vResult = "";
            var objJsonData = new Object();

            objJsonData = obj;
            var strurl = _ApiUrl + "api/freight/GetFreight";

            $.ajax({
                url: strurl,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization-Token', _ApiKey);
                },
                type: "POST",
                async: false,
                dataType: "json",
                data: { "": _fnMakeJson(objJsonData) },
                success: function (result) {
                    vResult = result;
                   
                }, error: function (xhr) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                    console.log(xhr);
                    return;
                }
            });

            return vResult;
        }
    }
    catch (err) {
        console.log("[Error - fnApiSecond]" + err.message);
    }
}

//3번째 API 가져오기
function fnApiTried(obj) {
    try {
        var objJsonData = new Object();
        var vResult = "";

        objJsonData = obj;

        $.ajax({
            type: "POST",
            url: "/Freight/fnGetRecomendCust",
            async: false,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                vResult = result;
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

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnGetRecomendCust]" + err.message);
    }
}

//search 밸리데이션
function fnValidation() {
    try {

        if (_fnToNull($("#input_POL").val() == "")) {
            _fnAlertMsg("출발지를 입력 해 주세요.");
            return false;
        }
        
        if (_fnToNull($("#input_POD").val() == "")) {
            _fnAlertMsg("도착지를 입력 해 주세요.");
            return false;
        }

        //코드가 없으면 어떻게 할깜

        return true;
    } catch (err) {
        console.log("[Error - fnValidation]" + err.message);
    }
}

//추천 포워더 비용 , 시간 데이터 가져오기
function fnGetRecomendCust() {
    try {
        var objJsonData = new Object();

        objJsonData.DATE_YYYY = $("#span_Year").text();        
        objJsonData.POL_CD = _fnToNull($("#input_POLCD").val());
        objJsonData.POD_CD = _fnToNull($("#input_PODCD").val());
        objJsonData.CNTR_TYPE = _fnToNull($("#select_CNTR_TYPE option:selected").val());
        objJsonData.RECOMEND = _fnToNull($("#select_forwarder option:selected").val());

        $.ajax({
            type: "POST",
            url: "/Freight/fnGetRecomendCust",
            async: true,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    $("#div_SwiperArea").empty();
                    fnMakeCustData(result);
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
        console.log("[Error - fnGetRecomendCust]" + err.message);
    }
}

//추천 포워더 '상세정보' 클릭 함수
function fnGetCustDTLData(vOFFICE_CD) {
    try {
        var objJsonData = new Object();

        objJsonData.OFFICE_CD = vOFFICE_CD;
        objJsonData.REQ_SVC = "SEA";
        objJsonData.DATE_YYYY = $("#span_Year").text();
        objJsonData.DATE_YYYY_PAST = Number($("#span_Year").text()) - 1;
        objJsonData.POL_CD = _fnToNull($("#input_POLCD").val());
        objJsonData.POD_CD = _fnToNull($("#input_PODCD").val());                

        $.ajax({
            type: "POST",
            url: "/Freight/fnGetCustDTLData",
            async: true,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                layerPopup('#freclientPop');
                fnLayerLineChart(result, "BL");
                _fnsleep();
                fnMakeCustDTL(result);
                fnLayerApexChart(result);
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
        console.log("[Error - fnGetCustDTLData]" + err.message);
    }
}

//Layer Line 차트 다시 그리기
function fnSetLayerLineChart(vOFFICE_CD, vDATA_TYPE) {
    try {
        var objJsonData = new Object();

        objJsonData.DATE_YYYY_PAST = Number($("#span_Year").text()) - 1;
        objJsonData.DATE_YYYY = $("#span_Year").text();
        objJsonData.OFFICE_CD = vOFFICE_CD;
        objJsonData.REQ_SVC = "SEA";
        objJsonData.POL_CD = _fnToNull($("#input_POLCD").val());
        objJsonData.POD_CD = _fnToNull($("#input_PODCD").val());

        $.ajax({
            type: "POST",
            url: "/Freight/fnGetLineChartData",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnLayerLineChart(result, vDATA_TYPE);                
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {

    }
}

//////////////////////function makelist////////////////////////
//차트 그려주기
//function fnMakeChart(vJsonData_Now, vJsonData_Before) {
//    try {
//        fnSetMainLineChart(vJsonData_Now, vJsonData_Before);
//    }
//    catch (err) {
//        console.log("[Error - fnMakeChart]" + err.message);
//    }
//}

function fnMakeChart(vJsonData) {
    try {
        fnSetMainLineChart(vJsonData);
    }
    catch (err) {
        console.log("[Error - fnMakeChart]" + err.message);
    }
}

//거래처 정보들 그려주기
function fnMakeCustData(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Cust;

            var vRoof = false;
            vHTML += "   <div class=\"swiper-wrapper\"> ";

            //반복문
            $.each(vResult, function (i) {
                vHTML += "   	<div class=\"swiper-slide\"> ";
                vHTML += "   		<div class=\"swiper_card\"> ";
                vHTML += "   			<div class=\"card_logo\"> ";

                if (_fnToNull(vResult[i]["LINE_PATH"]) == "") {
                    vHTML += "   						<img src=\"/images/no_data_bg04.png\" /> ";
                } else {
                    vHTML += "   						<img src=\"" + _fnToNull(vResult[i]["LINE_PATH"]) + "\" /> ";
                }

                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"card_info\"> ";
                vHTML += "   				<p>상호명 : " + _fnToNull(vResult[i]["CUST_NM"]) + "</p> ";
                vHTML += "   				<p>해상 B/L : " + fnSetComma(Math.ceil(_fnToZero(vResult[i]["DATA_CNT"]))) + " 건</p> ";
                vHTML += "   				<p>해상 물동량 : " + fnSetComma(Math.ceil(_fnToZero(vResult[i]["DATA_RTON"]))) + " Rton</p> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"card_btn\"> ";
                vHTML += "   				<button type=\"button\" class=\"btn_card\" name=\"btn_LayerCustInfo\">상세정보</button> ";
                vHTML += "   			    <input type=\"hidden\" value=\"" + vResult[i]["OFFICE_CD"] + "\" /> ";                
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
            });

            if (vResult.length < 4) {
                for (var j = vResult.length; j < 4; j++) {
                    vHTML += "   <div class=\"swiper-slide\"> ";
                    vHTML += "   	<div class=\"swiper_card no_client\"> ";
                    vHTML += "   		<div class=\"blank\"> ";
                    vHTML += "   			<img src=\"/Images/no_data_bg03.png\" /> ";
                    vHTML += "   			<p>No - data</p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
            }

            vHTML += "   </div> ";

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

            $("#div_SwiperArea")[0].innerHTML = vHTML;

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

            vHTML += "   <div class=\"swiper-wrapper\"> ";

            for (var j = 0; j < 4; j++) {
                vHTML += "   <div class=\"swiper-slide\"> ";
                vHTML += "   	<div class=\"swiper_card no_client\"> ";
                vHTML += "   		<div class=\"blank\"> ";
                vHTML += "   			<img src=\"/Images/no_data_bg03.png\" /> ";
                vHTML += "   			<p>No - data</p> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            }

            vHTML += "   </div> ";

            $("#div_SwiperArea")[0].innerHTML = vHTML;

            if (matchMedia("screen and (min-width: 1025px)").matches) {
                var swiper = new Swiper(".cliSwiper", {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    //loop: vRoof,
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

            console.log("[Fail - fnMakeSchMST] :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요");
            console.log("[Error - fnMakeSchMST] :" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeChart]" + err.message);
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
                vHTML += "   						<img src=\"/images/no_data_bg04.png\" /> ";
            } else {
                vHTML += "   						<img src=\"" + _fnToNull(vResult[0]["LINE_PATH"]) + "\" /> ";
            }            

            vHTML += "   	</div> ";
            vHTML += "   </div> ";
            vHTML += "   <div class=\"flex_box wrap\"> ";
            vHTML += "   	<div class=\"flex_line\"> ";
            vHTML += "   		<p class=\"client_title\">" + _fnToNull(vResult[0]["OFFICE_KOR_NM"]) + "</p> ";
            vHTML += "   		<p class=\"desc\">Addr. " + _fnToNull(vResult[0]["LOC_ADDR"]) + "</p> ";
            vHTML += "   		<p class=\"desc\">Tel. " + _fnToNull(vResult[0]["HP_NO"]) + "</p> ";
            vHTML += "   		<p class=\"desc\">Email. " + _fnToNull(vResult[0]["EMAIL"]) + "</p> ";
            vHTML += "   	</div> ";
            vHTML += "   </div> ";

            $("#layer_FreclientPop_CustArea")[0].innerHTML = vHTML;

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

//업체 상세정보 레이어 팝업 재 생성
function fnMakeLayerPop() {

    try {
        var vHTML = "";

        $("#freclientPop").empty();

        vHTML += "   <div class=\"layer_wrap\"> ";
        vHTML += "   	<div class=\"layer_inwrap\"> ";
        vHTML += "   		<article class=\"layer_cont\"> ";
        vHTML += "   			<div class=\"flex_type2\" id=\"layer_FreclientPop_CustArea\"> ";
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
        vHTML += "   						<div class=\"flex_box\" id=\"layer_FreCircleChart1\"> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div id=\"fre_sheet_graph1\"></div> ";
        vHTML += "   							</div> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div class=\"inner\"> ";
        vHTML += "   									<p id=\"fre_sheet_graph1_title\">해운 B/L</p> ";
        vHTML += "   									<p class=\"count\" id=\"fre_sheet_graph1_data\"></p> ";
        vHTML += "   								</div> ";
        vHTML += "   							</div> ";
        vHTML += "   						</div> ";
        vHTML += "   						<div class=\"flex_box\" id=\"layer_FreCircleChart2\"> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div id=\"fre_sheet_graph2\"></div> ";
        vHTML += "   							</div> ";
        vHTML += "   							<div class=\"inner_cover\"> ";
        vHTML += "   								<div class=\"inner\"> ";
        vHTML += "   									<p id=\"fre_sheet_graph2_title\">해운 물동량</p> ";
        vHTML += "   									<p class=\"count\" id=\"fre_sheet_graph2_data\"></p> ";
        vHTML += "   								</div> ";
        vHTML += "   							</div> ";
        vHTML += "   						</div> ";
        vHTML += "   					</div> ";
        vHTML += "   					<div class=\"ex_swiper\" id=\"fre_line_graph_area\"> ";
        vHTML += "   						<div id=\"fre_line_graph\"></div> ";
        vHTML += "   					</div> ";
        vHTML += "   				</div> ";
        vHTML += "   			</div> ";
        vHTML += "   			<button type=\"button\" class=\"btns close\" id=\"layer_freclientPop_Close\"><span class=\"blind\">닫기</span></button> ";
        vHTML += "   		</article> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";

        $("#freclientPop")[0].innerHTML = vHTML;

    } catch (err) {
        console.log("Error - fnMakeCustDTL" + err.message);
    }

}

/////////////////////API///////////////////////////////////////
//메인 화면에 차트 그려주기
//function fnSetMainLineChart(vJsonData_Now, vJsonData_Before) {
//    try {
//        var vCol;
//        var vTitle = "";
//
//        //before가 없으면 예외처리 필요
//
//        var vResult_Before = JSON.parse(vJsonData_Before).Table1;
//        var vResult_Now = JSON.parse(vJsonData_Now).Table1;
//
//        //1월 ~ 12월 기준
//        var vData_Before = [];
//        var vData_Now = [];
//        var j = 0;
//
//        //API 데이터에서 이전 년도 데이터가 없을 경우 예외처리 
//        if (_fnToNull(vResult_Before) == "") {
//            for (var i = 0; i < 12; i++) {
//                vData_Before.push(0);
//            }
//        } else {
//            //데이터가 없을 경우
//            if (vResult_Before.length == 0) {
//                for (var i = 0; i < 12; i++) {
//                    vData_Before.push(0);
//                }
//            }
//            else {
//                //데이터 만들기 1월~12월 Before
//                for (var i = 0; i < 12; i++) {
//                    if (vResult_Before[j]["DATE_MM"] == _pad((i + 1), '2')) {
//
//                        vData_Before.push(Math.ceil(Number(vResult_Before[j]["UNIT_AVG"])));
//
//                        if ((j + 1) != vResult_Before.length) {
//                            j++;
//                        }
//                    } else {
//                        vData_Before.push(0);
//                    }
//                }
//            }
//        }
//
//        j = 0;
//
//        if (vResult_Now.length == 0) {
//            for (var i = 0; i < 12; i++) {
//                vData_Now.push(0);
//            }
//        }
//        else {
//            //데이터 만들기 1월~12월 Now
//            for (var i = 0; i < 12; i++) {
//                if (vResult_Now[j]["DATE_MM"] == _pad((i + 1), '2')) {
//
//                    vData_Now.push(Math.ceil(Number(vResult_Now[j]["UNIT_AVG"])));
//
//                    if ((j + 1) != vResult_Now.length) {
//                        j++;
//                    }
//                } else {
//                    vData_Now.push(0);
//                }
//            }
//        }
//
//        var options = {
//            series: [
//                {
//                    name: "이전년도 해상운임 추이",
//                    data: vData_Before
//                },
//                {
//                    name: "당일년도 해상운임 추이",
//                    data: vData_Now
//                }
//            ],
//            chart: {
//                height: 270,
//                type: 'line',
//                toolbar: {
//                    show: false //chart에 toolbar를 없애야 될 듯
//                },
//                background: '#fff',//,
//                zoom: {
//                    enabled: false
//                }
//            },
//            stroke: {
//                width: 5,
//                curve: 'smooth'
//            },
//            legend: { //하단의 그래프 수정
//                show: true
//            },
//            xaxis: {
//                type: 'category',
//                categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//                tickAmount: 12
//            },
//            colors: ['#25d2a1', '#7f88ef'],
//            //title: {
//            //    text: "USD",
//            //    align: "left",
//            //    offsetY: 15,
//            //    style: {
//            //        fontSize: '12px',
//            //        fontweight: 'normal',
//            //        fontFamily: 'Noto Sans KR'
//            //    }
//            //},
//            yaxis: {
//                min: 0,
//                labels: {
//                    formatter: function (val, index) {
//                        return fnSetComma(parseInt(val)) + " USD";
//                    }
//                }
//            }
//        };
//
//        _FreMainChart = new ApexCharts(document.querySelector("#trend_graph"), options);
//        _FreMainChart.render();
//    }
//    catch (err) {
//        console.log("[Error - fnSetMainLineChart()]");
//    }
//}

function fnSetMainLineChart(vJsonData) {
    try {
        var vCol;
        var vTitle = "";

        //before가 없으면 예외처리 필요

        var vResult_Before = JSON.parse(vJsonData).Line_Before;
        var vResult_Now = JSON.parse(vJsonData).Line_Now;

        //1월 ~ 12월 기준
        var vData_Before = [];
        var vData_Now = [];
        var j = 0;

        //API 데이터에서 이전 년도 데이터가 없을 경우 예외처리 
        if (_fnToNull(vResult_Before) == "") {
            for (var i = 0; i < 12; i++) {
                vData_Before.push(0);
            }
        } else {
            //데이터가 없을 경우
            if (vResult_Before.length == 0) {
                for (var i = 0; i < 12; i++) {
                    vData_Before.push(0);
                }
            }
            else {
                //데이터 만들기 1월~12월 Before
                for (var i = 0; i < 12; i++) {
                    if (vResult_Before[j]["DATE_MM"] == _pad((i + 1), '2')) {

                        vData_Before.push(Math.ceil(Number(vResult_Before[j]["UNIT_AVG"])));

                        if ((j + 1) != vResult_Before.length) {
                            j++;
                        }
                    } else {
                        vData_Before.push(0);
                    }
                }
            }
        }

        j = 0;

        if (vResult_Now.length == 0) {
            for (var i = 0; i < 12; i++) {
                vData_Now.push(0);
            }
        }
        else {
            //데이터 만들기 1월~12월 Now
            for (var i = 0; i < 12; i++) {
                if (vResult_Now[j]["DATE_MM"] == _pad((i + 1), '2')) {

                    vData_Now.push(Math.ceil(Number(vResult_Now[j]["UNIT_AVG"])));

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
                    name: "이전년도 해상운임 추이",
                    data: vData_Before
                },
                {
                    name: "당일년도 해상운임 추이",
                    data: vData_Now
                }
            ],
            chart: {
                height: 270,
                type: 'line',
                toolbar: {
                    show: false //chart에 toolbar를 없애야 될 듯
                },
                background: '#fff',//,
                zoom: {
                    enabled: false
                }
            },
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
                tickAmount: 12
            },
            colors: ['#25d2a1', '#7f88ef'],
            //title: {
            //    text: "USD",
            //    align: "left",
            //    offsetY: 15,
            //    style: {
            //        fontSize: '12px',
            //        fontweight: 'normal',
            //        fontFamily: 'Noto Sans KR'
            //    }
            //},
            yaxis: {
                min: 0,
                labels: {
                    formatter: function (val, index) {
                        return fnSetComma(parseInt(val)) + " USD";
                    }
                }
            }
        };

        _FreMainChart = new ApexCharts(document.querySelector("#trend_graph"), options);
        _FreMainChart.render();
    }
    catch (err) {
        console.log("[Error - fnSetMainLineChart()]");
    }
}

//레이어 원형 차트 만들기
function fnLayerApexChart(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Circle;

            if (_fnToNull(vResult) == "") {
                //id 삭제
                $("#layer_FreCircleChart1").attr("id", "");
                $("#layer_FreCircleChart2").attr("id", "");

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

                var chart1 = new ApexCharts(document.querySelector("#fre_sheet_graph1"), options);
                chart1.render();

                var chart2 = new ApexCharts(document.querySelector("#fre_sheet_graph2"), options);
                chart2.render();
            } else {
                var AvgBLCnt = Math.ceil(vResult[0].TOT_DATA_CNT / vResult[0].YEAR_DATA_CNT * 100);
                var AvgRtonCnt = Math.ceil(vResult[0].TOT_DATA_RTON / vResult[0].YEAR_DATA_RTON * 100);

                $("#fre_sheet_graph1_data").text(fnSetComma(vResult[0].TOT_DATA_CNT) + " / " + fnSetComma(vResult[0].YEAR_DATA_CNT));
                $("#fre_sheet_graph2_data").text(fnSetComma(Math.ceil(vResult[0].TOT_DATA_RTON)) + " / " + fnSetComma(Math.ceil(vResult[0].YEAR_DATA_RTON)));

                $("#fre_sheet_graph1_title").text("해운 B/L");
                $("#fre_sheet_graph2_title").text("해운 물동량");

                //전역 Object
                _LineChart.OFFICE_CD = vResult[0].OFFICE_CD;

                var options = {
                    series: [AvgBLCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
                    chart: {
                        width: 110,
                        height: 140,
                        type: 'radialBar'
                        //events: {
                        //    click: function () {
                        //        _layer_line_chart.destroy();
                        //        fnSetLayerLineChart(vResult[0].OFFICE_CD ,"BL");
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

                var chart1 = new ApexCharts(document.querySelector("#fre_sheet_graph1"), options);
                chart1.render();

                options = {
                    series: [AvgRtonCnt], //퍼센트로 잡히니 정수로 넣어야될듯.
                    chart: {
                        width: 110,
                        height: 140,
                        type: 'radialBar'
                        //events: {
                        //    click: function () {
                        //        _layer_line_chart.destroy();
                        //        fnSetLayerLineChart(vResult[0].OFFICE_CD, "RTON");
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

                var chart2 = new ApexCharts(document.querySelector("#fre_sheet_graph2"), options);
                chart2.render();
            }

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            layerClose('#freclientPop');
            $("#layer_freclientPop_Close").click();
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
function fnLayerLineChart(vJsonData, vDATA_TYPE) {
    try {
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            //초기화 한번 하고 해보자
            $("#fre_line_graph_area")[0].innerHTML = "<div id=\"fre_line_graph\"></div>";

            var vCol;
            var vTitle = "";

            if (vDATA_TYPE == "BL") {
                vTitle = "해운 B/L";
                vCol = "TOT_DATA_CNT";
            } else if (vDATA_TYPE == "RTON") {
                vTitle = "해운 물동량";
                vCol = "TOT_DATA_RTON";
            }

            var vResult_Before = JSON.parse(vJsonData).Line_Before;
            var vResult_Now = JSON.parse(vJsonData).Line_Now;            

            //1월 ~ 12월 기준
            var vData_Before = [];
            var vData_Now = [];
            var j = 0;

            //데이터가 없을 경우
            if (vResult_Before.length == 0) {
                for (var i = 0; i < 12; i++) {
                    vData_Before.push(0);
                }
            } else {
                //데이터 만들기 1월~12월 Before
                for (var i = 0; i < 12; i++) {
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

            //데이터가 없을 경우
            if (vResult_Now.length == 0) {
                //데이터 만들기 1월~12월 Now
                for (var i = 0; i < 12; i++) {
                    vData_Now.push(0);
                }
            } else {
                //데이터 만들기 1월~12월 Now
                for (var i = 0; i < 12; i++) {
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
                    width: '100%',
                    height: 270,
                    type: 'line',
                    toolbar: {
                        show: false //chart에 toolbar를 없애야 될 듯
                    },
                    background: '#fff',//,
                    zoom: {
                        enabled: false
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
                        formatter: function (val, index) {
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
            _layer_line_chart = new ApexCharts(document.querySelector("#fre_line_graph"), options);
            _layer_line_chart.render();
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

//function fnSetLineChart() {
//    var options = {
//        series: [
//            {
//                name: "이전년도 해상운임 추이",
//                data: [1,2,3,4,5,6,7,8,9]
//            },
//            {
//                name: "당일년도 해상운임 추이",
//                data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
//            }
//        ],
//        //dataLabels: {
//        //    enabled: true,
//        //    textAnchor: 'start',
//        //    formatter: function (value, { seriesIndex, dataPointIndex, w }) {
//        //        return w.config.series[seriesIndex].name + ":  " + value
//        //        //return value + " USD";
//        //    }
//        //},
//        chart: {
//            width: 670,
//            height: 270,
//            type: 'line',
//            toolbar: {
//                show: false //chart에 toolbar를 없애야 될 듯
//            },
//            background: '#fff',//,
//            zoom: {
//                enabled: false
//            }
//        },
//        stroke: {
//            width: 5,
//            curve: 'smooth'
//        },
//        legend: { //하단의 그래프 수정
//            show: true
//        },
//        xaxis: {
//            type: 'category',
//            categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
//            tickAmount: 12
//        },
//        colors: ['#25d2a1', '#7f88ef'],
//        //title: {
//        //    text: vTitle,
//        //    align: "left",
//        //    offsetY: 15,
//        //    style: {
//        //        fontSize: '12px',
//        //        fontweight: 'normal',
//        //        fontFamily: 'Noto Sans KR'
//        //    }
//        //},
//        yaxis: {
//            min: 0
//        }
//    };
//
//    var chart = new ApexCharts(document.querySelector("#trend_graph"), options);
//    chart.render();
//}