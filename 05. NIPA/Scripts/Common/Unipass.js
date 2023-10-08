var obj = new Object();
var url = "Main";
var pageNum = 1;
var ChkPage = false;
var sort = true;
var UserAgent = navigator.userAgent;
$(function () {
    var $schDate = $(".sch_date");
    calendarStart($schDate, $schDate.find(".date").val());
    $(window).resize(function (e) {
        calendarStart($schDate, $schDate.find(".date").val());
    });


    $("#NOW_DT").val(_fnMinusDate(0));
    $("#DATE_RST").append(_fnMinusDate(0));

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        $("#POL_POP").hide();
        $("#POD_POP").hide();
    }
});

function calendarStart(obj, date) {
    if (matchMedia("screen and (max-width: 1024px)").matches) {
        // 모바일화면 달력플러그인
        obj.datetimepicker({
            timepicker: false,
            format: 'Y-m-d',
            startDate: date,
            language: "en",
            onSelectDate: function (dp, $input) {
                var str = $input.val();
                var m = str.substr(0, 10);
                var d = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

                obj.find(".date").val(m);
                $("#DATE_RST").text(m);
                if ($('.calendar .xdsoft_datetimepicker').length) {
                    $('#datetimepicker').datetimepicker('destroy');
                }
            }
        });
    } else {
        // PC화면 달력플러그인
        $('#datetimepicker').datetimepicker({
            timepicker: false,
            format: 'Y-m-d',
            inline: true,
            todayButton: false,
            i18n: {
                kr: {
                    months: [
                        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]
                }
            },
            startDate: date,
            onSelectDate: function (dp, $input) {
                var str = $input.val();
                var m = str.substr(0, 10);
                var d = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

                $("#DATE_RST").text(m);
                obj.find(".date").val(m + ' ' + d[dp.getDay()]);
            }
        });
    }
}

$(document).on("click", "input[name='rd01']", function () {
    $("#input_UniCargoMtno").val("");
    $("#input_UniCargoMBL").val("");
    $("#input_UniCargoHBL").val("");
    $("#select_UniCargoYear option:eq(0)").prop("selected", true);
});


$(document).on("click", "#main_tab_1", function () {
    $("#input_UniCargoMtno").val("");
    $("#input_UniCargoMBL").val("");
    $("#input_UniCargoHBL").val("");
    $("#input_UniOBnum").val("");
    $("#input_UniOBbl").val("");
    $("#div_UniCargoArea").hide(); 
    $("#div_UniOB_NumArea").hide();
    $("#div_UniOB_BLArea").hide();
})

$(document).on("click", "input[name='rd02']", function () {
    $("#input_UniOBnum").val("");
    $("#input_UniOBbl").val("");
});

$(document).on("click", "#btn_Cargo_Search", function () {
    fnGetXml_Cargo();
});

//수출입화물정보 - 수출신고번호 검색 버튼
$(document).on("click", "#btn_Outbound_Search", function () {
    fnGetXml_OutBound();
});

var chkLength = false;
$(document).on("click", ".Searchmngt", function () {

    //$("input:radio[name='rd01']:input[ value ='MTNO']").prop('checked', true);
    //showRadioPanel('.rd1_2', '.rd1_1');
    //$("#input_UniCargoMtno").val(_fnToNull($(this).text().trim()));
    fnXmlParsing_Cargo(_fnGetAjaxData2("GET", urlpath + "/Main", "GetCargoInfo?crkyCn=i220k129u161i054w030p040s2&cargMtNo=" + _fnToNull($(this).text().trim()), false, "xml", ""));

});
function fnGetXml_Cargo() {
    try {
        //다른 input 초기화
        $("#input_UniOBnum").val("");
        $("#input_UniOBbl").val("");
        chkLength = false;

        var objJsonData = new Object();

        if ($("input[name='rd01']:checked").val() == "BL") {
            fnXmlParsing_Cargo(_fnGetAjaxData2("GET", urlpath + "/Main", "GetCargoInfo?crkyCn=i220k129u161i054w030p040s2&mblNo=" + _fnToNull($("#input_UniCargoMBL").val().toUpperCase().trim()) + "&hblNo=" + _fnToNull($("#input_UniCargoHBL").val().toUpperCase().trim()) + "&blYy=" + $("#select_UniCargoYear option:selected").val(), false, "xml", ""));
            $(".tn3").show();
        }
        else if ($("input[name='rd01']:checked").val() == "MTNO") {
            fnXmlParsing_Cargo(_fnGetAjaxData2("GET", urlpath + "/Main", "GetCargoInfo?crkyCn=i220k129u161i054w030p040s2&cargMtNo=" + _fnToNull($("#input_UniCargoMtno").val().toUpperCase().trim()), false, "xml", ""));
            $(".tn3").hide();
        }

        $("#div_UniCargoArea").show();
    }
    catch (e) {
        console.log(e.message);
    }
}

function fnGetXml_OutBound() {

    try {
        //input 화물진행정보 초기화
        $("#input_UniCargoMBL").val("");
        $("#input_UniCargoHBL").val("");
        $("#select_UniCargoYear option:eq(0)").prop("selected", true);

        $("#div_UniCargoArea").hide();

        var objJsonData = new Object();

        if ($("input:radio[name='rd02']:checked").val() == "OUTBOUND") {
            objJsonData.crkyCn = "u270b149n161k024l060s050u1";
            objJsonData.expDclrNo = $("#input_UniOBnum").val();

            $.ajax({
                type: "POST",
                url: "/Main/GetOBNumInfo",
                async: true,
                dataType: "xml",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    fnXmlParsing_OBnum(result);
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
            $("#div_UniOB_NumArea").show();
            $("#div_UniOB_BLArea").hide();
        } else if ($("input:radio[name='rd02']:checked").val() == "BL") {
            objJsonData.crkyCn = "u270b149n161k024l060s050u1";
            objJsonData.blNo = $("#input_UniOBbl").val();

            $.ajax({
                type: "POST",
                url: "/Main/GetOBBLInfo",
                async: true,
                dataType: "xml",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    fnXmlParsing_OBbl(result);
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
            $("#div_UniOB_NumArea").hide();
            //$("#div_UniOB_BLArea").show();
        }


        //$('#exportUnipass').css('padding-bottom', '0px');
        //fnMovePage('tab_area');
        //if ($("input:radio[name=export01]:checked").val() == "OUTBOUND") {
        //    //수출신고번호 
        //    fnXmlParsing_OBnum(_fnGetAjaxData("GET", _HomeUrl + "/HP_Unipass", "GetOBNumInfo?crkyCn=u270b149n161k024l060s050u1&expDclrNo=" + $("#input_UniOBnum").val(), false, "xml", ""));
        //    $("#div_UniOB_NumArea").show();
        //}
        //else if ($("input:radio[name=export02]:checked").val() == "BL") {
        //    fnXmlParsing_OBbl(_fnGetAjaxData("GET", _HomeUrl + "/HP_Unipass", "GetOBBLInfo?crkyCn=u270b149n161k024l060s050u1&blNo=" + $("#input_UniOBbl").val(), false, "xml", ""));
        //    $("#div_UniOB_BLArea").show();
        //}
    }
    catch (e) {
        console.log(e.message);
    }
}

//화물진행정보 - xml 파싱 
function fnXmlParsing_Cargo(vXML) {

    var vHTML = "";

    $("#div_UniCargoFirst1").empty();
    $("#div_UniCargoSecond").empty();

    if ($(vXML).find('tCnt').text() == "0") {

        //데이터 없을 경우	
        $(".notice_box2").hide();
        $("#tn2_head").hide();
        $(".cnt_box").hide();
        $("#tn3").hide();
        $("#tn4").hide();

        _fnAlertMsg("데이터가 존재하지 않습니다");


    }
    else if ($(vXML).find('tCnt').text() == "-1") {

        _fnAlertMsg("[화물관리번호(cargMtNo)], [Master B/L번호와 BL년도], [House B/L번호과 BL년도] 중 한가지는 필수입력입니다. 또는 화물관리번호는 15자리 이상 자리로 입력하셔야 합니다.");

        $(".notice_box2").hide();
        $("#tn2_head").hide();
        $(".cnt_box").hide();
    }
    else {
        //데이터가 있을 경우expDclrNoPrExpFfmnBrkdQryRsltVo
        if ($(vXML).find('cargCsclPrgsInfoQryVo').length > 1) {
            chkLength = true;

            var vLength = $(vXML).find('cargCsclPrgsInfoDtlQryVo').length;

            $("#div_UniCargoList").empty();
            $(vXML).find('cargCsclPrgsInfoQryVo').each(function (i) {
                vHTML += "  <tr>	";
                vHTML += "       <td class='pc'>" + (i + 1) + "</td>";
                vHTML += "       <td><a href='javascript:void(0)' class='Searchmngt'>" + $(this).find('cargMtNo').text() + "</a></td>";
                vHTML += "       <td>" + $(this).find('mblNo').text() + "-" + $(this).find('hblNo').text() + "</td>";
                vHTML += "       <td>" + $(this).find('etprDt').text() + "</td>";
                vHTML += "       <td>" + $(this).find('dsprNm').text() + "</td>";
                vHTML += "       <td>" + $(this).find('shcoFlco').text() + "</td>";
                vHTML += "   </tr>";
            });


            $("#div_UniCargoList").append(vHTML);
            $("#tn2_head").hide();
            $(".notice_box2").hide();
            if (chkLength) {
                $("#UniCargoList").show();
            }
            //$("#UniCargoList").show();
            //$("#div_UniCargoArea").show();
            //$("#tn2").hide();
            ////$("#tn3").show();
            //$("#tn4").show();


            //$("#span_UniCount")[0].innerHTML = "전체 <em>" + $(vXML).find('cargCsclPrgsInfoDtlQryVo').length + "</em>건";

            vHTML = "";
        } else {

            $(vXML).find('cargCsclPrgsInfoQryVo').each(function () {
                vHTML += "   <tr>	";
                vHTML += "       <th>화물관리번호</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('cargMtNo').text() + "</span></td>	";
                vHTML += "       <th>진행상태</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('prgsStts').text() + "</span></td>	";
                vHTML += "       <th>선사/항공사</th>	";
                vHTML += "       <td colspan='3'><span class='data'>" + $(this).find('shcoFlco').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>M B/L-H B/L</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('mblNo').text() + "-" + $(this).find('hblNo').text() + "</span></td>	";
                vHTML += "       <th>화물구분</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('cargTp').text() + "</span></td>	";
                vHTML += "       <th>선박/항공편 명</th>	";
                vHTML += "       <td colspan='3'><span class='data'>" + $(this).find('shipNm').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>통관진행상태</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('csclPrgsStts').text() + "</span></td>	";
                vHTML += "       <th>처리일시</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('prcsDttm').text() + "</span></td>	";
                vHTML += "       <th>선박국적</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('shipNatNm').text() + "</span></td>	";
                vHTML += "       <th>선박대리점</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('agnc').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>품명</th>	";
                vHTML += "       <td colspan='3'><span class='data'>" + $(this).find('prnm').text() + "</span></td>	";
                vHTML += "       <th>적재항</th>	";
                vHTML += "       <td colspan='3'><span class='data'>" + $(this).find('ldprCd').text() + " : " + $(this).find('ldprNm').text() + ", " + $(this).find('lodCntyCd').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>포장개수</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('pckGcnt').text() + " " + $(this).find('pckUt').text() + "</span></td>	";
                vHTML += "       <th>총 중량</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('ttwg').text() + " " + $(this).find('wghtUt').text() + "</span></td>	";
                vHTML += "       <th>양륙항</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('dsprCd').text() + " : " + $(this).find('dsprNm').text() + "</span></td>	";
                vHTML += "       <th>입항세관</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('etprCstm').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>용적</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('msrm').text() + "</span></td>	";
                vHTML += "       <th>B/L유형</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('blPtNm').text() + "</span></td>	";
                vHTML += "       <th>입항일</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('etprDt').text() + "</span></td>	";
                vHTML += "       <th>항차</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('vydf').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>관리대상지정여부</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('mtTrgtCargYnNm').text() + "</span></td>	";
                vHTML += "       <th>컨테이너개수</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('cntrGcnt').text() + "</span></td>	";
                vHTML += "       <th>반출의무과태료</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('rlseDtyPridPassTpcd').text() + "</span></td>	";
                vHTML += "       <th>신고지연가산세</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('dclrDelyAdtxYn').text() + "</span></td>	";
                vHTML += "   </tr>	";
                vHTML += "   <tr>	";
                vHTML += "       <th>특수화물코드</th>	";
                vHTML += "       <td><span class='data'>" + $(this).find('spcnCargCd').text() + "</span></td>	";
                vHTML += "       <th>컨테이너번호</th>	";
                vHTML += "       <td colspan='5'><span class='data'>" + $(this).find('cntrNo').text() + "</span></td>	";
                vHTML += "   </tr>	";
            });


            $("#div_UniCargoFirst1").append(vHTML);
            if (!chkLength) {
                $("#UniCargoList").hide();
                chkLength = false;
            }
            //$("#div_UniCargoArea").show();
            ////$("#UniCargoList").hide();
            //$("#tn3").hide();
            ////$("#tn4").hide();

            vHTML = "";

            var vLength = $(vXML).find('cargCsclPrgsInfoDtlQryVo').length;

            $.each($(vXML).find('cargCsclPrgsInfoDtlQryVo'), function (i) {

                vHTML += "  <tr>	";
                vHTML += "       <td class='no' rowspan='2'><span class='data'>" + vLength + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('cargTrcnRelaBsopTpcd').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('shedSgn').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('pckGcnt').text() + " " + $(this).find('pckUt').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('rlbrDttm').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('dclrNo').text() + "</span></td>";
                vHTML += "   </tr>";
                vHTML += "   <tr>";
                vHTML += "       <td><span class='data'>" + $(this).find('prcsDttm').text().substring(0, 4) + "-" + $(this).find('prcsDttm').text().substring(4, 6) + "-" + $(this).find('prcsDttm').text().substring(6, 8) + " " + $(this).find('prcsDttm').text().substring(8, 10) + ":" + $(this).find('prcsDttm').text().substring(10, 12) + ":" + $(this).find('prcsDttm').text().substring(12, 14) + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('shedNm').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + fnSetComma($(this).find('wght').text()) + " " + $(this).find('wghtUt').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('rlbrCn').text() + "</span></td>";
                vHTML += "       <td><span class='data'>" + $(this).find('rlbrBssNo').text() + "</span></td>";
                vHTML += "   </tr>";
                vLength = vLength - 1;
            });

            $("#div_UniCargoSecond").append(vHTML);
            $(".notice_box2").show();
            //$(".cnt_box").show();
            //$("#tn2").show();
            $("#tn2_head").show();
        }
    }
}

//수출이행내역 - 수출신고번호
function fnXmlParsing_OBnum(vXML) {

    var vHTML = "";
    $("#div_UniOB_NumFirst").empty();

    if ($(vXML).find('tCnt').text() == "0") {
        //데이터 없을 경우	

        $(".search_cnt").hide();
        $("#div_UniOB_NumSecond2").hide();
        $("#div_UniOB_NumFirst2").hide();
        _fnAlertMsg("데이터가 존재하지 않습니다.");
    }
    else if ($(vXML).find('tCnt').text() == "-1") {
        //검색을 잘 못 하였을 경우

        _fnAlertMsg($(vXML).find('ntceInfo').text());

        $(".search_cnt").hide();
        $("#div_UniOB_NumSecond2").hide();
        $("#div_UniOB_NumFirst2").hide();
    }
    else {
        //데이터가 있을 경우
        $(vXML).find('expDclrNoPrExpFfmnBrkdQryRsltVo').each(function () {

            $("#div_UniOB_NumFirst2").empty();
            $("#div_UniOB_NumSecond").empty();
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>수출화주/대행자</th>   ";
            vHTML += "   			<td>" + $(this).find('exppnConm').text() + "</td> ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>적재의무기한</th>     ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('loadDtyTmlm').text()) + "</td>   ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>통관포장개수</th>     ";
            vHTML += "   			<td>" + $(this).find('csclPckGcnt').text() + " " + $(this).find('csclPckUt').text() + "</td>        ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>선기적완료여부</th>    ";
            vHTML += "   			<td>" + $(this).find('shpmCmplYn').text() + "</td>            ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>선기적포장개수</th>    ";
            vHTML += "   			<td>" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</td>        ";
            vHTML += "   		</tr>                     ";
            $("#div_UniOB_NumFirst").append(vHTML);
            vHTML = "   		<tr>                      ";
            vHTML += "   			<th>제조자</th>         ";
            vHTML += "   			<td>" + $(this).find('mnurConm').text() + "</td> ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>수리일자</th>        ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('acptDt').text()) + "</td>   ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>통관중량(KG)</th>    ";
            vHTML += "   			<td>" + fnSetComma(Number($(this).find('csclWght').text())) + "</td>       ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>선박/편명</th>       ";
            vHTML += "   			<td>" + $(this).find('sanm').text() + "</td>   ";
            vHTML += "   		</tr>                     ";
            vHTML += "   		<tr>                      ";
            vHTML += "   			<th>선기적중량(KG)</th>   ";
            vHTML += "   			<td>" + fnSetComma($(this).find('shpmWght').text()) + "</td>       ";
            vHTML += "   		</tr>                     ";

            $("#div_UniOB_NumFirst2").append(vHTML);
            $("#div_UniOB_NumFirst2").show();

            $("#span_UniOB_NumCount")[0].innerHTML = "전체 <strong>" + $(vXML).find('expDclrNoPrExpFfmnBrkdDtlQryRsltVo').length + "</strong>건";

            vHTML = "";


            $(vXML).find('expDclrNoPrExpFfmnBrkdDtlQryRsltVo').each(function (i) {

                vHTML += "   		<tr>                                           ";
                vHTML += "   			<td><span class=\"data\">" + $(this).find('blNo').text() + "</span></td> ";
                vHTML += "   			<td><span class=\"data\">" + _fnFormatDate($(this).find('tkofDt').text()) + "</span></td>       ";
                vHTML += "   			<td><span class=\"data\">" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</span></td>              ";
                vHTML += "   			<td><span class=\"data\">" + fnSetComma($(this).find('shpmWght').text()) + "</span></td>    ";
                vHTML += "   		</tr>                                            ";

            });
        });

        $(".search_cnt").show();
        $("#div_UniOB_NumSecond2").show();
        $("#div_UniOB_NumSecond").append(vHTML);
    }
}

//수출이행내역 - BL
function fnXmlParsing_OBbl(vXML) {

    var vHTML = "";
    $("#div_UniOB_BlFirst2").empty();
    $("#div_UniOB_BlFirst").empty();

    if ($(vXML).find('tCnt').text() == "0") {
        //데이터 없을 경우	
        $("#div_UniOB_BLArea").hide();
        _fnAlertMsg("데이터가 존재하지 않습니다.");
        $(".search_cnt").hide();
    }
    else if ($(vXML).find('tCnt').text() == "-1") {

        $("#div_UniOB_BLArea").hide();
        _fnAlertMsg($(vXML).find('ntceInfo').text());
    }
    else {

        $("#span_UniOB_BlCount")[0].innerHTML = "전체 <strong>" + $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').length + "</strong>건";

        $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').each(function () {

            $("#div_UniOB_BlFirst").empty();
            vHTML += "   		<tr>                                                      ";
            vHTML += "   			<td>" + $(this).find('exppnConm').text() + "</td>              ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('acptDt').text()) + "</td>                ";
            vHTML += "   			<td>" + $(this).find('csclPckGcnt').text() + " " + $(this).find('csclPckUt').text() + "</td>                      ";
            vHTML += "   		</tr>                                                     ";
            vHTML += "   		<tr>                                                      ";
            vHTML += "   			<td>" + $(this).find('expDclrNo').text().substring(0, 5) + "-" + $(this).find('expDclrNo').text().substring(5, 7) + "-" + $(this).find('expDclrNo').text().substring(7, $(this).find('expDclrNo').text().length) + "</td>         ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('loadDtyTmlm').text()) + "</td>                ";
            vHTML += "   			<td>" + fnSetComma(Number($(this).find('csclWght').text())) + "</td>                     ";
            vHTML += "   		</tr>                                                     ";
        });
        $("#div_UniOB_BlFirst").append(vHTML);



        $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').each(function () {

            $("#div_UniOB_BlFirst2").empty();
            vHTML = "   		<tr>                                                      ";
            vHTML += "   			<td rowspan=\"2\">" + $(this).find('mrn').text() + "</td> ";
            vHTML += "   			<td>" + $(this).find('shpmAirptPortNm').text() + "</td>                      ";
            vHTML += "   			<td>" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</td>                     ";
            vHTML += "   			<td>" + $(this).find('dvdeWdrw').text() + "</td>                         ";
            vHTML += "   		</tr>                                                     ";
            vHTML += "   		<tr>                                                      ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('tkofDt').text()) + "</td>                ";
            vHTML += "   			<td>" + fnSetComma($(this).find('shpmWght').text()) + "</td>                     ";
            vHTML += "   			<td>" + $(this).find('shpmCmplYn').text() + "</td>                         ";
            vHTML += "   		</tr>                                                     ";
        });

        $("#div_UniOB_BlFirst2").append(vHTML);
        $("#div_UniOB_BLArea").show();
    }
}


$("#POL_CD").click(function (e) {
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        $("#POL_POP").show();
        $("#POD_POP").hide();
    }
});

  
$("#POD_VAL").click(function (e) {
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        $("#POD_POP").show();
        $("#POL_POP").hide();
    }
});
$("#POL_POP li").click(function (e) {
    $("#POL_POP li").removeClass();
    $(this).addClass("on");
    $("#POL_RST").empty();
    var pol = $(this).children().text();
    $("#POL_CD").val(pol);
    $("#POL_RST").append(pol);
    $("#POL_HIDDEN").val($(this).children().val());
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        $("#POL_POP").hide();
    }
    fnDrawingBoard();
});

$("#POD_POP li").click(function (e) {
    $("#POD_POP").show();
    $("#POD_POP li").removeClass();
    $(this).addClass("on");
    $("#POD_RST").empty();
    var pol = $(this).children().text();
    $("#POD_CD").val(pol);
    $("#POD_VAL").val(pol);
    $("#POD_RST").append(pol);
    $("#POD_HIDDEN").val($(this).children().val());
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        $("#POD_POP").hide();
    }
    fnDrawingBoard();
});


function fnDrawingBoard(){
    if (_fnToNull($("#DATE_RST").text()) != "" && _fnToNull($("#POL_HIDDEN").val()) != "" && _fnToNull($("#POD_HIDDEN").val()) != ""){
        $(".selectLayer .inner").css('border', '2px solid #04c096');
    }
}

$("#btnSearch").click(function (e) {
    if (validateCheck(false)) {
        obj.ID = "";
        ChkPage = true;
        fnSearchData();
    }
});

function validateCheck(bool) {
    if (_fnToNull($("#DATE_RST").text()) == "") {
        _fnAlertMsg("날짜를 선택하세요");
        return false;
    }

    if (_fnToNull($("#POL_RST").text()) == "") {
        _fnAlertMsg("출발지를 선택하세요");
        return false;
    }

    if (_fnToNull($("#POD_RST").text()) == "") {
        _fnAlertMsg("도착지를 선택하세요");
        return false;
    }
    return true;
}


$('.btn_order').click(function () {
    ChkPage = true;
    if (validateCheck(false)) {
        $('.btn_order').removeClass('desc');
        $('#' + this.id).addClass('desc');
        if (sort) {
            //내림차순
            $('#' + this.id).addClass('desc');
            obj.ORDER = "DESC";
            obj.ID = this.id.substring(2);
            sort = false;
            fnSearchData();
        } else {
            //오름차순
            $('#' + this.id).removeClass('desc');
            obj.ORDER = "ASC";
            obj.ID = this.id.substring(2);
            sort = true;
            fnSearchData();
        }
    }
});

function fnSearchData() {
    $("#SchList").empty();
    obj.STRT_YMD = _fnToNull($("#DATE_RST").text().replace(/-/gi, ""));
    obj.POL = _fnToNull($("#POL_HIDDEN").val());
    obj.POD = _fnToNull($("#POD_HIDDEN").val());
    obj.POL_CD = _fnToNull($("#POL_HIDDEN").val());
    obj.POD_CD = _fnToNull($("#POD_HIDDEN").val());
    obj.OFFICE_CD = _fnToNull(offie_code);
    if (ChkPage) {
        pageNum = 1;
        ChkPage = false;
    }
    obj.PAGE = pageNum;

    MakeBooking();
}


$("#more").on("click", function () {
    obj.PAGE = pageNum;
    MakeBooking();
});

$(document).on("click", ".btnReserve", function (key) {
    var tr = $(this).closest('td');
    var td = tr.children();
    obj.T_POL_CD = td.eq(1).text();
    obj.T_POD_CD = td.eq(2).text();
    if (_fnToNull($("#LoginChk").val()) == "Y") {
        controllerToLink('ReserveMgt','Reserve', obj);
    } else {
        fnShowLoginLayer('/Reserve/ReserveMgt');
    }

    //var objParam = new Object();
    //objParam.SCH_NO = td.eq(0).text();
    //objParam.PRC = td.eq(1).text();
    //controllerToLink("ReserveDtl", "Reserve", objParam);

});

function MakeBooking() {
    var callObj = new Object();
    callObj.paramObj = _fnMakeJson(obj);

    $.ajax({
        type: "POST",
        url: "/" + url + "/GetScheduleList",
        async: true,
        dataType: "json",
        data: callObj,
        success: function (rtnVal) {
            var apdVal = "";
        if (rtnVal.Result[0].trxCode == "Y") {
            var rtnTbl = rtnVal.Table1;
            if (_fnToNull(rtnTbl) != "") {
                $(rtnTbl).each(function (i) {
                    apdVal += "	<tr class='view' data-row='row_" + _fnToNull(rtnTbl[i].RNUM) + "'>	";
                    apdVal += "            <td style='font-weight:400'>	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].LINE_CD) + "<br class='pc' />	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].VSL_VOY);
                    apdVal += "            </td>	";
                    apdVal += "            <td>	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].ETD) + "<br class='pc' />	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].POL_CD) + "	";
                    apdVal += "            </td>	";
                    apdVal += "            <td>	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].ETA) + "<br class='pc' />	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].POD_CD) + "	";
                    apdVal += "            </td>	";
                    if (_fnToNull(rtnTbl[i].PREV_CLOSE) <= _fnGetTodayStamp()) {
                        apdVal += "                   <td style='color:orange'>	";
                        apdVal += "                       " + _fnToNull(rtnTbl[i].DOC_CLOSE_YMD) + "<br class='pc' />	";
                        apdVal += "                       " + _fnToNull(rtnTbl[i].DOC_CLOSE_HM) + "	";
                        apdVal += "                   </td>	";
                    } else {
                        apdVal += "                   <td>	";
                        apdVal += "                       " + _fnToNull(rtnTbl[i].DOC_CLOSE_YMD) + "<br class='pc' />	";
                        apdVal += "                       " + _fnToNull(rtnTbl[i].DOC_CLOSE_HM) + "	";
                        apdVal += "                   </td>	";
                    }
                    apdVal += "            <td>	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].CARGO_CLOSE_YMD) + "<br class='pc' />	";
                    apdVal += "                " + _fnToNull(rtnTbl[i].CARGO_CLOSE_HM) + "	";
                    apdVal += "            </td>	";
                    apdVal += "            <td>" + _fnToNull(rtnTbl[i].TRANSIT_TIME) + "Day(s)</td>	";
                    apdVal += "            <td style='color:red'>" + _fnToNull(rtnTbl[i].CURR_CD) + ' ' + _fnToNull(_fnGetNumber(rtnTbl[i].PRC, 'sum')) + "</td>	";
                    apdVal += "            <td class='t_btn'>	";
                    apdVal += "                <div style='display:none'>" + _fnToNull(rtnTbl[i].SCH_NO) + "</div>	";
                    apdVal += "                <div style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</div>	";
                    apdVal += "                <div style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</div>	";
                    apdVal += "                <div class='etc_area mo'>	";
                    apdVal += "                    <ul class='etc_info'>	";
                    apdVal += "                        <li>	";
                    apdVal += "                            <em class='tit'>반입지</em>	";
                    apdVal += "                            <span class='txt'>" + _fnToNull(rtnTbl[i].POL_TML_NM) + "</span>	";
                    apdVal += "                        </li>	";
                    apdVal += "                        <li>	";
                    apdVal += "                            <em class='tit'>담당자</em>	";
                    apdVal += "                            <span class='txt'>" + _fnToNull(rtnTbl[i].SCH_PIC) + "</span>	";
                    apdVal += "                        </li>	";
                    apdVal += "                        <li>	";
                    apdVal += "                            <em class='tit'>비고</em>	";
                    apdVal += "                            <div class='txt'>" + _fnToNull(rtnTbl[i].RMK) + "</div>	";
                    apdVal += "                        </li>	";
                    apdVal += "                    </ul>	";
                    apdVal += "                </div>	";
                    if (_fnToNull(rtnTbl[i].DOC_CLOSE) < _fnGetDateStamp()) {
                        apdVal += "                       <a href='javascript:void(0)' class='btns type3 btnClose'>예약하기</a>	";
                    } else {
                        apdVal += "                       <a href='javascript:void(0)' class='btns type3 btnReserve'>예약하기</a>	";
                    }
                    apdVal += "            </td>	";
                    apdVal += "            <td class='t_bul'><i class='icn_direct'></i></td>	";
                    apdVal += "        </tr>	";
                    apdVal += "       <tr class='fold' id='row_" + _fnToNull(rtnTbl[i].RNUM) + "'>";
                    apdVal += "       <td colspan='9'>";
                    apdVal += "           <div class='etc_area'>";
                    apdVal += "               <ul class='etc_info'>";
                    apdVal += "                   <li>";
                    apdVal += "                       <em class='tit'>반입지</em>";
                    apdVal += "                       <span class='txt'>" + _fnToNull(rtnTbl[i].POL_TML_NM) + "</span>";
                    apdVal += "                   </li>";
                    apdVal += "                   <li>";
                    apdVal += "                       <em class='tit'>담당자</em>";
                    apdVal += "                       <span class='txt'>" + _fnToNull(rtnTbl[i].SCH_PIC) + "</span>";
                    apdVal += "                   </li>";
                    apdVal += "                   <li>";
                    apdVal += "                       <em class='tit'>비고</em>";
                    apdVal += "                       <div class='txt'>" + _fnToNull(rtnTbl[i].RMK) + "</div>";
                    apdVal += "                   </li>";
                    apdVal += "               </ul>";
                    apdVal += "           </div>";
                    apdVal += "       </td>";
                    apdVal += "   </tr>";
                    if (rtnTbl[i].RNUM == rtnTbl[i].TOTCNT) {
                        $('#more').hide();
                        ChkPage = true;
                    } else {
                        $('#more').show();
                    }
                });
                pageNum += 1;
                $("#SchList").append(apdVal);
                $("#sch_show").show();
                $(".no_data").hide();
                $(".data_area").show();
                if (pageNum == 2) {
                    fnMovePage('sch_show');
                }
            } else {
                $(".no_data").show();
                $("#no_str").text("스케줄 정보가 없습니다.");
                $(".data_area").hide();
                $('#more').hide();
                $("#sch_show").show();
                fnMovePage('no_data');
            } 
            }
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }, beforeSend: function () {
            $("#ProgressBar_Loading").show(); //프로그래스 바 

        },
        complete: function () {
            $("#ProgressBar_Loading").hide(); //프로그래스 바 
        }
    });
}

$(document).on("click", ".btnClose", function () {
    _fnAlertMsg("서류마감 된 스케줄입니다.");
});