////////////////////전역 변수//////////////////////////
var obj = new Object();
var mymap;
////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    //$("#header").addClass("close");
    $('#lnb > li.sub_tra > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(6) > a').addClass("on");

    $(document).on("click", ".btn_spin", function () {
        if ($(this).siblings(".sheet").hasClass("on") == false) {
            $(this).siblings(".sheet").addClass("on");
            $(this).addClass("hide");
        }
    })

    $(document).on("click", ".sheet", function () {
        $(this).closest(".sheet").removeClass("on");
        $(this).siblings(".btn_track").removeClass("hide");
    })

    if ($('.scrollbar_tbl').length > 0) {
        $('.scrollbar_tbl').slimScroll({
            height: '100%',
            width: '100%',
            alwaysVisible: true,
            railVisible: true,
        });
    }

    //fnGetXml_Cargo();
    //layerPopup('#terminalPop');
    //fnSearchContainer();
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).on("keyup", "#S_BL_NO", function (e) {
    if (e.keyCode == 13) {
        $("#btn_TrackingSearch").click();
    }
});

$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');

                       

        }
    }
});

$("#btn_TrackingSearch").click(function () {
    fnSearchTracking();
});

$(document).on("click", "button[name='layerTerminal']", function () {
    var tr = $(this).closest('div');
    var td = tr.children();

    if (_fnToNull(td.eq(1).text().replace(/ /gi, "")) == "") {
        _fnAlertMsg("터미널 정보를 확인 할 수 없는 데이터 입니다.");
        console.log("벳셀 데이터가 없습니다.");
        return false;
    }

    $("#Cntr_list").empty();
    //obj.END_YN = "N";
    obj.VSL_NM = td.eq(1).text().replace(/ /gi, "");
    obj.ETD = td.eq(2).text().replace(/ /gi, "");
    obj.ETA = td.eq(3).text().replace(/ /gi, "");

    var strurl = _ApiUrl + "api/Container/GetContainer";
    $("#ProgressBar_Loading").show(); //프로그래스 바

    $.ajax({
        url: strurl,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization-Token', _ApiKey);
        },
        type: "POST",
        async: true,
        dataType: "json",
        data: { "": _fnMakeJson(obj) },
        success: function (result) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            if (result != null) {
                if (JSON.parse(result).Result[0].trxCode == "Y" && _fnToNull(JSON.parse(result).Table1) != "") {
                    _fnMakeTerminal(JSON.parse(result));
                }
                else {
                    _fnAlertMsg(" 터미널 정보를 확인 할 수 없는 데이터 입니다.");
                }
            } else {
                _fnAlertMsg(" 터미널 정보를 확인 할 수 없는 데이터 입니다.");
            }
        }, error: function (xhr) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });
});

$(document).on("click", "button[name='layerLocation']", function () {

    var tr = $(this).closest('div');
    var td = tr.children();

    if (_fnToNull(td.eq(1).text()) == "") {
        _fnAlertMsg("추적이 되지않는 데이터입니다.");
        console.log("벳셀 데이터가 없습니다.");
        return false;
    }

    //obj.OFFICE_CD = td.eq(1).text();
    obj.reqVal1 = td.eq(1).text();
    //obj.reqVal1 = td.eq(1).text();
    //obj.reqVal2 = td.eq(2).text();
    //obj.reqVal3 = td.eq(3).text();
    
    var strurl = _ApiUrl + "/api/Trk/GetTrackingAIS"; //실시간 위치 정보    
    $("#ProgressBar_Loading").show(); //프로그래스 바

    $.ajax({
        url: strurl,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization-Token', _ApiKey);
        },
        type: "POST",
        async: true,
        dataType: "json",
        data: { "": _fnMakeJson(obj) },
        success: function (result) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            if (_fnToNull(result) != "") {
                var rtnData = JSON.parse(result);
                if (_fnToNull(rtnData.Result) != "") {
                    if (rtnData.Result[0].trxCode == "N" || rtnData.Result[0].trxCode == "E") {
                        //drawingLayerNodata();
                        _fnAlertMsg("추적이 되지않는 데이터입니다.");
                        return false;
                    }
                } else {
                    layerPopup('#trackingPop');
                    fnMakeRealLocation(result,td.eq(1).text()); //데이터 넣기
                    drawingLayer(rtnData);
                }

            } else {
                layerClose("#tracking_layer");
                _fnAlertMsg("추적이 되지않는 데이터입니다.");
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

});

//유니패스 - 수입화물진행정보
$(document).on("click", "button[name='Import_layerUnipass']", function () {
    try {
        var tr = $(this).closest('div');

        //리스트 hide 및 초기화
        $("#UniCargoList").hide();
        $("#UniCargoList").empty();

        var objJsonData = new Object();

        objJsonData.crkyCn = "i220k129u161i054w030p040s2";
        objJsonData.cargMtNo = "";
        objJsonData.mblNo = "";
        objJsonData.hblNo = _fnToNull(tr.find("p[name='Unipass_HBL']").text());
        objJsonData.blYy = _fnToNull(tr.find("p[name='Unipass_ETD']").text());

        $.ajax({
            type: "POST",
            url: "/Unipass/GetCargoInfo",
            async: true,
            dataType: "xml",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                //alert(result);
                $("#UniCargoList").hide(); //마스터 비엘 시 하우스 비엘 여러 건 일 경우
                $("#div_UniCargoArea").hide();
                $("#no_data").hide();
                $("#no_search").hide();
                fnXmlParsing_Cargo(result);
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
    catch (e) {
        console.log(e.message);
    }
});

//수출이행내역 - B/L
$(document).on("click", "button[name='Export_layerUnipass']", function () {

    var tr = $(this).closest('div');
    var td = tr.children();
    fnExport_Unipass(td.eq(1).text());
});




/////////////////////function///////////////////////////////////
//화물추적 조회
function fnSearchTracking() {
    $("#trk_list").empty();
    obj.BL_NO = _fnToNull($("#S_BL_NO").val().replace(/ /gi,""));


    $.ajax({
        type: "POST",
        url: "/Tracking/fnGetTracking",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(obj) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                $("#no_data").hide();
                _fnMakeList(JSON.parse(result));
            }
            else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                $("#no_data").show();
            }
        }, error: function (xhr) {
            $("#ProgressBar_Loading").hide();
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

function CntrSpin() {
    $(this).closest(".sheet").addClass("on");
    $(this).addClass("hide");
}

function CntrSpinHide() {
    $(".btn_track").closest(".sheet").removeClass("on");
    $(this).closest(".btn_track").removeClass("hide");
}

function CalPercent(completeCnt, TotalCnt) {
    var percent = Math.ceil(completeCnt / TotalCnt * 100);
    if (isNaN(percent)) percent = 0;
    return percent;
}

//실시간 위치정보 벳셀 정보 가져오기
function fnGetVslData(vHBL) {

    try {
        var vResult = "";
        var objJsonData = new Object(); 

        objJsonData.BL_NO = vHBL;

        $.ajax({
            type: "POST",
            url: "/Tracking/fnGetVslData",
            async: false,
            dataType: "json",
            //data: callObj,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                vResult = result 
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnGetVslData]" + err.message);
    }
}

//유니패스 - 수출이행내역 B/L
function fnExport_Unipass(vHBL) {

    try {
        var objJsonData = new Object();
        objJsonData.crkyCn = "u270b149n161k024l060s050u1";
        objJsonData.blNo = vHBL;

        $.ajax({
            type: "POST",
            url: "/Unipass/GetOBBLInfo",
            async: true,
            dataType: "xml",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnXmlParsing_OBbl(result);                
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
        console.log("[Error - fnGetVslData]" + err.message);
    }
}
//function drawingLayerNodata() {

//    if (_fnToNull(mymap) != "") {
//        mymap.remove();
//    }
//    mymap = L.map('map', {
//        //center: [lat, lng],
//        center: [32.896531, 124.402956],
//        zoom: 5,
//        zoomControl: false
//    });

//    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
//        attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
//    }).addTo(mymap);
//}
//////////////////////function makelist////////////////////////
function fnXmlParsing_Cargo(vXML) {

    var vHTML = "";

    if ($(vXML).find('tCnt').text() == "0") {

        //데이터 없을 경우	
        //vHTML += " <table>                                        ";
        //vHTML += "   <colgroup class=\"mo\"> ";
        //vHTML += "   	<col class=\"w1\">  ";
        //vHTML += "   	<col>               ";
        //vHTML += "   	<col class=\"w1\">  ";
        //vHTML += "   	<col>               ";
        //vHTML += "   </colgroup>             ";
        //vHTML += " 	<colgroup class=\"pc\">                      ";
        //vHTML += " 		<col class=\"w1\">                       ";
        //vHTML += " 		<col>                                    ";
        //vHTML += " 	</colgroup>                                  ";
        //vHTML += " 		<tr class=\"pc\">                        ";
        //vHTML += " 			<td colspan=\"8\">데이터가 없습니다.</td> ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " 		<tr class=\"mo\">                        ";
        //vHTML += " 			<td colspan=\"8\">데이터가 없습니다.</td> ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " </table>                                       ";

        //$("#div_UniCargoFirst1")[0].innerHTML = vHTML;

        $("#div_UniCargoFirst2").hide();
        $("#div_UniCargoSecond").hide();
        $("#div_UniCargoSecond2").hide();
        $(".notice_box").hide();
        $(".cnt_box").hide();

        //$("#no_data").show();
        _fnAlertMsg("UNIPASS 정보가 없습니다");
        //$("#UniCarogo_Result").show();
    }
    else if ($(vXML).find('tCnt').text() == "-1") {
        //데이터 없을 경우	
        //vHTML += " <table>                                        ";
        //vHTML += "   <colgroup class=\"mo\"> ";
        //vHTML += "   	<col class=\"w1\">  ";
        //vHTML += "   	<col>               ";
        //vHTML += "   </colgroup>             ";
        //vHTML += " 	<colgroup class=\"pc\">                      ";
        //vHTML += " 		<col class=\"w1\">                       ";
        //vHTML += " 		<col>                                    ";
        //vHTML += " 	</colgroup>                                  ";
        //vHTML += " 		<tr class=\"pc\">                        ";
        //vHTML += " 			<td colspan=\"8\">[화물관리번호(cargMtNo)], [Master B/L번호와 BL년도], [House B/L번호과 BL년도] 중 한가지는 필수입력입니다. 또는 화물관리번호는 15자리 이상 자리로 입력하셔야 합니다.</td>              ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " 		<tr class=\"mo\">                        ";
        //vHTML += " 			<td colspan=\"4\">[화물관리번호(cargMtNo)], [Master B/L번호와 BL년도], [House B/L번호과 BL년도] 중 한가지는 필수입력입니다. 또는 화물관리번호는 15자리 이상 자리로 입력하셔야 합니다.</td>              ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " </table>                                       ";
        //
        //$("#div_UniCargoFirst1")[0].innerHTML = vHTML;

        $("#div_UniCargoFirst2").hide();
        $("#div_UniCargoSecond").hide();
        $("#div_UniCargoSecond2").hide();
        $(".notice_box").hide();
        $(".cnt_box").hide();

        //$("#no_data").show();
        //$("#UniCarogo_Result").show();
    }
    else if ($(vXML).find('ntceInfo').text().indexOf("[N00] 조회 결과가 다건입니다.") > -1) {
        $("#UniCarogo_Result").hide(); //유니패스 결과 감추기

        vHTML += "   <table class=\"tbl_type1 mo2\"> ";
        vHTML += "   	<colgroup class=\"pc\"> ";
        vHTML += "   		<col class=\"w1\"> ";
        vHTML += "   		<col class=\"w4\"> ";
        vHTML += "   		<col> ";
        vHTML += "   		<col class=\"w3\"> ";
        vHTML += "   		<col class=\"w2\"> ";
        vHTML += "   		<col class=\"w3\"> ";
        vHTML += "   	</colgroup> ";
        vHTML += "   	<colgroup class=\"mo\"> ";
        vHTML += "   		<col class=\"w5\"> ";
        vHTML += "   		<col class=\"w5\"> ";
        vHTML += "   		<col class=\"w5\"> ";
        vHTML += "   		<col class=\"w5\"> ";
        vHTML += "   		<col class=\"w5\"> ";
        vHTML += "   	</colgroup> ";
        vHTML += "   	<thead class=\"head\"> ";
        vHTML += "   		<tr class=\"row\"> ";
        vHTML += "   			<th class=\"pc\">번호</th> ";
        vHTML += "   			<th>화물관리번호</th> ";
        vHTML += "   			<th>B/L 번호</th> ";
        vHTML += "   			<th>입항일자</th> ";
        vHTML += "   			<th>양륙항</th> ";
        vHTML += "   			<th>운송사명</th> ";
        vHTML += "   		</tr> ";
        vHTML += "   	</thead> ";
        vHTML += "   </table> ";
        vHTML += "   <div class=\"scrollbar_tbl scrollbar-outer tn3 mb1\" id=\"UniCargoList_Scrollbar\"> ";
        vHTML += "   	<table class=\"tbl_type1 mo2\"> ";
        vHTML += "   		<colgroup class=\"pc\"> ";
        vHTML += "   			<col class=\"w1\"> ";
        vHTML += "   			<col class=\"w4\"> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col class=\"w3\"> ";
        vHTML += "   			<col class=\"w2\"> ";
        vHTML += "   			<col class=\"w3\"> ";
        vHTML += "   		</colgroup> ";
        vHTML += "   		<colgroup class=\"mo\"> ";
        vHTML += "   			<col class=\"w5\"> ";
        vHTML += "   			<col class=\"w5\"> ";
        vHTML += "   			<col class=\"w5\"> ";
        vHTML += "   			<col class=\"w5\"> ";
        vHTML += "   			<col class=\"w5\"> ";
        vHTML += "   		</colgroup> ";
        vHTML += "   		<tbody> ";

        $(vXML).find('cargCsclPrgsInfoQryVo').each(function (i) {
            vHTML += "   			<tr> ";
            vHTML += "                   <td class='pc'>" + (i + 1) + "</td>";
            vHTML += "                   <td><a href='javascript:void(0)' class=\"Searchmngt\" name='Unipass_SearchMngt'>" + $(this).find('cargMtNo').text() + "</a></td>";
            vHTML += "                   <td>" + $(this).find('mblNo').text() + "-" + $(this).find('hblNo').text() + "</td>";
            vHTML += "                   <td>" + _fnFormatDate($(this).find('etprDt').text()) + "</td>";
            vHTML += "                   <td>" + $(this).find('dsprNm').text() + "</td>";
            vHTML += "                   <td>" + $(this).find('shcoFlco').text() + "</td>";
            vHTML += "   			</tr> ";
        });

        vHTML += "   		</tbody> ";
        vHTML += "   	</table> ";
        vHTML += "   </div> ";

        $("#UniCargoList")[0].innerHTML = vHTML;

        if ($(vXML).find('cargCsclPrgsInfoQryVo').length > 4) {
            //스크롤 
            $('#UniCargoList_Scrollbar').slimScroll({
                height: '161px',
                size: "5px",
                alwaysVisible: true,
                railVisible: true
            })
        }

        $("#UniCargoList").show();
    }
    else {
        //데이터가 있을 경우expDclrNoPrExpFfmnBrkdQryRsltVo
        $(vXML).find('cargCsclPrgsInfoQryVo').each(function () {

            vHTML += " <table>                                       ";
            vHTML += " 	<colgroup class=\"mo\">                      ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 	</colgroup>                                  ";
            vHTML += " 	<colgroup class=\"pc\">                      ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 		<col class=\"w1\">                       ";
            vHTML += " 		<col>                                    ";
            vHTML += " 	</colgroup>                                  ";
            vHTML += " 	<tbody>                                      ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>화물관리번호</th>                     ";
            vHTML += " 			<td>" + $(this).find('cargMtNo').text() + "</td>                            ";
            vHTML += " 			<th>진행상태</th>                       ";
            vHTML += " 			<td>" + $(this).find('prgsStts').text() + "</td>                            ";
            vHTML += " 			<th class=\"pc\">선사/항공사</th>        ";
            vHTML += " 			<td colspan=\"3\" class=\"pc\">" + $(this).find('shcoFlco').text() + "</td> ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>M B/L-H B/L</th>                 ";
            vHTML += " 			<td>" + $(this).find('mblNo').text() + "-" + $(this).find('hblNo').text() + "</td>                            ";
            vHTML += " 			<th>화물구분</th>                       ";
            vHTML += " 			<td>" + $(this).find('cargTp').text() + "</td>                            ";
            vHTML += " 			<th class=\"pc\">선박/항공편명</th>       ";
            vHTML += " 			<td colspan=\"3\" class=\"pc\">" + $(this).find('shipNm').text() + "</td> ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>통관진행상태</th>                     ";
            vHTML += " 			<td>" + $(this).find('csclPrgsStts').text() + "</td>                            ";
            vHTML += " 			<th>처리일시</th>                       ";
            vHTML += " 			<td>" + $(this).find('prcsDttm').text().substring(0, 4) + "-" + $(this).find('prcsDttm').text().substring(4, 6) + "-" + $(this).find('prcsDttm').text().substring(6, 8) + " " + $(this).find('prcsDttm').text().substring(8, 10) + ":" + $(this).find('prcsDttm').text().substring(10, 12) + ":" + $(this).find('prcsDttm').text().substring(12, 14) + "</span></td>                            ";
            vHTML += " 			<th class=\"pc\">선박국적</th>          ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('shipNatNm').text() + "</td>               ";
            vHTML += " 			<th class=\"pc\">선박대리점</th>         ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('agnc').text() + "</td>               ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>품명</th>                          ";
            vHTML += " 			<td colspan=\"3\">" + $(this).find('prnm').text() + "</td>              ";
            vHTML += " 			<th class=\"pc\">적재항</th>           ";
            vHTML += " 			<td colspan=\"3\" class=\"pc\">" + $(this).find('ldprCd').text() + " : " + $(this).find('ldprNm').text() + ", " + $(this).find('lodCntyCd').text() + "</td> ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>포장개수</th>                       ";
            //vHTML += " 			<td>" + $(this).find('pckGcnt').text() + " " + $(this).find('pckUt').text() + "</td>                            ";
            vHTML += " 			<td>" + $(this).find('pckGcnt').text() + " " + $(this).find('pckUt').text() + "</td>                            ";
            vHTML += " 			<th>총 중량</th>                       ";
            vHTML += " 			<td>" + fnSetComma($(this).find('ttwg').text()) + " " + $(this).find('wghtUt').text() + "</td>                            ";
            vHTML += " 			<th class=\"pc\">양륙항</th>           ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('dsprCd').text() + " : " + $(this).find('dsprNm').text() + "</td>               ";
            vHTML += " 			<th class=\"pc\">입항세관</th>          ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('etprCstm').text() + "</td>               ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>용적</th>                          ";
            vHTML += " 			<td>" + $(this).find('msrm').text() + "</td>                            ";
            vHTML += " 			<th>B/L유형</th>                       ";
            vHTML += " 			<td>" + $(this).find('blPtNm').text() + "</td>                            ";
            vHTML += " 			<th class=\"pc\">입항일</th>           ";
            vHTML += " 			<td class=\"pc\">" + _fnFormatDate($(this).find('etprDt').text()) + "</td>               ";
            vHTML += " 			<th class=\"pc\">항차</th>             ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('vydf').text() + "</td>               ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr>                                     ";
            vHTML += " 			<th>관리대상지정여부</th>                  ";
            vHTML += " 			<td>" + $(this).find('mtTrgtCargYnNm').text() + "</td>                            ";
            vHTML += " 			<th>컨테이너개수</th>                     ";
            vHTML += " 			<td>" + $(this).find('cntrGcnt').text() + "</td>                            ";
            vHTML += " 			<th class=\"pc\">반출의무과태료</th>      ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('rlseDtyPridPassTpcd').text() + "</td>               ";
            vHTML += " 			<th class=\"pc\">신고지연가산세</th>      ";
            vHTML += " 			<td class=\"pc\">" + $(this).find('dclrDelyAdtxYn').text() + "</td>               ";
            vHTML += " 		</tr>                                    ";
            vHTML += " 		<tr class=\"pc\">                        ";
            vHTML += " 			<th>특수화물코드</th>                     ";
            vHTML += " 			<td>" + $(this).find('spcnCargCd').text() + "</td>                            ";
            vHTML += " 			<th>컨테이너번호</th>                     ";
            vHTML += " 			<td colspan=\"5\">" + $(this).find('cntrNo').text() + "</td>              ";
            vHTML += " 		</tr>  ";
            vHTML += " 	</tbody>   ";
            vHTML += " </table>     ";
        });

        $("#div_UniCargoFirst1")[0].innerHTML = vHTML;

        //모바일 전용
        $(vXML).find('cargCsclPrgsInfoQryVo').each(function () {
            vHTML = "";

            vHTML += "   <table class=\"mo\"> ";
            vHTML += "   	<colgroup> ";
            vHTML += "   		<col class=\"w1\"> ";
            vHTML += "   		<col> ";
            vHTML += "   		<col class=\"w1\"> ";
            vHTML += "   		<col> ";
            vHTML += "   	</colgroup> ";
            vHTML += "   	<tbody> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>선사/항공사</th> ";
            vHTML += "   			<td colspan=\"3\">" + $(this).find('shcoFlco').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>선박/항공편명</th> ";
            vHTML += "   			<td colspan=\"3\">" + $(this).find('shipNm').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>선박국적</th> ";
            vHTML += "   			<td>" + $(this).find('shipNatNm').text() + "</td> ";
            vHTML += "   			<th>선박대리점</th> ";
            vHTML += "   			<td>" + $(this).find('agnc').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>적재항</th> ";
            vHTML += "   			<td colspan=\"3\">" + $(this).find('ldprCd').text() + " : " + $(this).find('ldprNm').text() + ", " + $(this).find('lodCntyCd').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>양륙항</th> ";
            vHTML += "   			<td>" + $(this).find('dsprCd').text() + " : " + $(this).find('dsprNm').text() + "</td> ";
            vHTML += "   			<th>입항세관</th> ";
            vHTML += "   			<td>" + $(this).find('etprCstm').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>입항일</th> ";
            vHTML += "   			<td>" + _fnFormatDate($(this).find('etprDt').text()) + "</td> ";
            vHTML += "   			<th>항차</th> ";
            vHTML += "   			<td>" + $(this).find('vydf').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr> ";
            vHTML += "   			<th>반출의무과태료</th> ";
            vHTML += "   			<td>" + $(this).find('rlseDtyPridPassTpcd').text() + "</td> ";
            vHTML += "   			<th>신고지연가산세</th> ";
            vHTML += "   			<td>" + $(this).find('dclrDelyAdtxYn').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   		<tr class=\"mo\"> ";
            vHTML += "   			<th>특수화물코드</th> ";
            vHTML += "   			<td>" + $(this).find('spcnCargCd').text() + "</td> ";
            vHTML += "   			<th>컨테이너번호</th> ";
            vHTML += "   			<td>" + $(this).find('cntrNo').text() + "</td> ";
            vHTML += "   		</tr> ";
            vHTML += "   	</tbody> ";
            vHTML += "   </table> ";
        });

        $("#div_UniCargoFirst2")[0].innerHTML = vHTML;

        $("#span_UniCount")[0].innerHTML = "전체 <em>" + $(vXML).find('cargCsclPrgsInfoDtlQryVo').length + "</em>건";

        ///////////////////////////////////////////////div_UniCargoSecond////////////////////////////////////////////////////
        vHTML = "";

        vHTML += "   <table> ";
        vHTML += "   	<colgroup> ";
        vHTML += "   		<col style=\"width: 10%\"> ";
        vHTML += "   		<col style=\"width: 18%\"> ";
        vHTML += "   		<col style=\"width: 18%\"> ";
        vHTML += "   		<col style=\"width: 18%\"> ";
        vHTML += "   		<col style=\"width: 18%\"> ";
        vHTML += "   		<col style=\"width: 18%\"> ";
        vHTML += "   	</colgroup> ";
        vHTML += "   	<thead> ";
        vHTML += "   		<tr> ";
        vHTML += "   			<th rowspan=\"2\">No</th> ";
        vHTML += "   			<th>처리단계</th> ";
        vHTML += "   			<th>장치장/장치위치</th> ";
        vHTML += "   			<th>포장개수</th> ";
        vHTML += "   			<th>반출입(처리)일시</th> ";
        vHTML += "   			<th>신고번호</th> ";
        vHTML += "   		</tr> ";
        vHTML += "   		<tr> ";
        vHTML += "   			<th>처리일시</th> ";
        vHTML += "   			<th>장치장명</th> ";
        vHTML += "   			<th>중량</th> ";
        vHTML += "   			<th>반출입(처리)내용</th> ";
        vHTML += "   			<th>반출입근거번호</th> ";
        vHTML += "   		</tr> ";
        vHTML += "   	</thead> ";
        vHTML += "   </table> ";

        $("#div_UniCargoSecond")[0].innerHTML = vHTML;
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        vHTML = "";

        vHTML += "   <div class=\"scrollbar_tbl\" id=\"Unipass_Cargo_scrollbar\"> ";
        vHTML += "   	<table> ";
        vHTML += "   	    <colgroup> ";
        vHTML += "   	    	<col style=\"width: 10%\"> ";
        vHTML += "   	    	<col style=\"width: 18%\"> ";
        vHTML += "   	    	<col style=\"width: 18%\"> ";
        vHTML += "   	    	<col style=\"width: 18%\"> ";
        vHTML += "   	    	<col style=\"width: 18%\"> ";
        vHTML += "   	    	<col style=\"width: 18%\"> ";
        vHTML += "   	    </colgroup>			 ";
        vHTML += "   		    <tbody> ";


        var vLength = $(vXML).find('cargCsclPrgsInfoDtlQryVo').length;

        $.each($(vXML).find('cargCsclPrgsInfoDtlQryVo'), function (i) {

            if (i % 2 == 1) {
                vHTML += "   		<tr style=\"background: #fafafa;\">                                           ";
            } else {
                vHTML += "   		<tr>                                           ";
            }

            vHTML += "   			<td class=\"a_center\" rowspan=\"2\">" + vLength + "</td> ";
            vHTML += "   			<td class=\"a_center\">" + $(this).find('cargTrcnRelaBsopTpcd').text() + "</td>               ";
            vHTML += "   			<td>" + $(this).find('shedSgn').text() + "</td>                                  ";
            vHTML += "   			<td class=\"a_right\">" + $(this).find('pckGcnt').text() + " " + $(this).find('pckUt').text() + "</td>                ";
            vHTML += "   			<td class=\"a_center\">" + $(this).find('rlbrDttm').text() + "</td>               ";
            vHTML += "   			<td class=\"a_center\">" + $(this).find('dclrNo').text() + "</td>               ";
            vHTML += "   		</tr>                                          ";

            if (i % 2 == 1) {
                vHTML += "   		<tr style=\"background: #fafafa;\">                                           ";
            }
            else {
                vHTML += "   		<tr>                                           ";
            }
            vHTML += "   			<td class=\"a_center\">" + $(this).find('prcsDttm').text().substring(0, 4) + "-" + $(this).find('prcsDttm').text().substring(4, 6) + "-" + $(this).find('prcsDttm').text().substring(6, 8) + " " + $(this).find('prcsDttm').text().substring(8, 10) + ":" + $(this).find('prcsDttm').text().substring(10, 12) + ":" + $(this).find('prcsDttm').text().substring(12, 14) + "</td>";
            vHTML += "   			<td>" + $(this).find('shedNm').text() + "</td>                                  ";
            vHTML += "   			<td class=\"a_right\">" + fnSetComma($(this).find('wght').text()) + " " + $(this).find('wghtUt').text() + "</td>                ";
            vHTML += "   			<td class=\"a_center\">" + $(this).find('rlbrCn').text() + "</td>               ";
            vHTML += "   			<td class=\"a_center\">" + $(this).find('rlbrBssNo').text() + "</td>               ";
            vHTML += "   		</tr>		                                   ";

            vLength = vLength - 1;
        });

        vHTML += "   	</tbody>                                           ";
        vHTML += "   </table>                                               ";
        vHTML += "   </div> ";

        $("#div_UniCargoSecond2")[0].innerHTML = vHTML;

        //4개 이상일 떄만 스크롤 생기게 수정
        if ($(vXML).find('cargCsclPrgsInfoDtlQryVo').length > 4) {
            //스크롤 
            $('#Unipass_Cargo_scrollbar').slimScroll({
                height: '301px',
                size: "5px",
                alwaysVisible: true,
                railVisible: true
            })
        }

        $("#div_UniCargoFirst2").show();
        $("#div_UniCargoSecond").show();
        $("#div_UniCargoSecond2").show();
        $(".notice_box").show();
        $(".cnt_box").show();
        $("#UniCarogo_Result").show();
        $("#div_UniCargoArea").show();        
        
        layerPopup('#unipassPop');
    }
}

//수출이행내역 - BL
function fnXmlParsing_OBbl(vXML) {

    var vHTML = "";

    if ($(vXML).find('tCnt').text() == "0") {
        //데이터 없을 경우	
        //vHTML += "   <div class=\"grid_col\"> ";
        //vHTML += "      <table>                                        ";
        //vHTML += "        <colgroup class=\"mo\"> ";
        //vHTML += "        	<col class=\"w1\">  ";
        //vHTML += "        	<col>               ";
        //vHTML += "        	<col class=\"w1\">  ";
        //vHTML += "        	<col>               ";
        //vHTML += "        </colgroup>             ";
        //vHTML += "      	<colgroup class=\"pc\">                      ";
        //vHTML += "      		<col class=\"w1\">                       ";
        //vHTML += "      		<col>                                    ";
        //vHTML += "      	</colgroup>                                  ";
        //vHTML += "      		<tr class=\"pc\">                        ";
        //vHTML += "      			<td colspan=\"8\">데이터가 없습니다.</td> ";
        //vHTML += "      		</tr>                                    ";
        //vHTML += "      		<tr class=\"mo\">                        ";
        //vHTML += "      			<td colspan=\"8\">데이터가 없습니다.</td> ";
        //vHTML += "      		</tr>                                    ";
        //vHTML += "      </table>                                       ";
        //vHTML += "   </div> ";

        //$(".cnt_box").hide();
        //$("#div_UniOB_BLArea").hide();
        ////$("#div_UniOB_BlFirst")[0].innerHTML = vHTML;
        //$("#no_data").show();

        _fnAlertMsg("UNIPASS 정보가 없습니다");
    }
    else if ($(vXML).find('tCnt').text() == "-1") {
        //검색을 잘 못 하였을 경우
        //vHTML += "   <div class=\"grid_col\"> ";
        //vHTML += "      <table>                                        ";
        //vHTML += "      	<colgroup class=\"pc\">                      ";
        //vHTML += "      		<col class=\"w1\">                       ";
        //vHTML += "      		<col>                                    ";
        //vHTML += "      	</colgroup>                                  ";
        //vHTML += "      		<tr class=\"pc\">                        ";
        //vHTML += "      			<td colspan=\"8\">" + $(vXML).find('ntceInfo').text() + "</td>              ";
        //vHTML += "      		</tr>                                    ";
        //vHTML += "      		<tr class=\"mo\">                        ";
        //vHTML += "      			<td colspan=\"8\">" + $(vXML).find('ntceInfo').text() + "</td> ";
        //vHTML += "      		</tr>                                    ";
        //vHTML += "      </table>                                       ";
        //vHTML += "   </div> ";
        //
        //$("#div_UniOB_BlFirst")[0].innerHTML = vHTML;
        //$("#div_UniOB_BLArea").hide();
        //$("#no_data").show();

        _fnAlertMsg("UNIPASS 정보가 없습니다");
    }
    else {

        $("#span_UniOB_BlCount")[0].innerHTML = "전체 <em>" + $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').length + "</em>건";

        vHTML += "   <div class=\"grid_col\"> ";
        vHTML += "   	<table> ";
        vHTML += "   		<colgroup> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col> ";
        vHTML += "   		</colgroup> ";
        vHTML += "   		<thead> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th colspan=\"3\">통관사항</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th>수출자</th> ";
        vHTML += "   				<th>수리일자</th> ";
        vHTML += "   				<th>통관포장개수</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th>수출신고번호</th> ";
        vHTML += "   				<th>적재의무기한</th> ";
        vHTML += "   				<th>통관중량(KG)</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   		</thead> ";
        vHTML += "   		<tbody> ";

        $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').each(function () {
            vHTML += "   			<tr> ";
            vHTML += "   				<td class=\"a_center\">" + $(this).find('exppnConm').text() + "</td> ";
            vHTML += "   				<td class=\"a_center\">" + _fnFormatDate($(this).find('acptDt').text()) + "</td> ";
            vHTML += "   				<td class=\"a_right\">" + $(this).find('csclPckGcnt').text() + " " + $(this).find('csclPckUt').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<td class=\"a_center\">" + $(this).find('expDclrNo').text().substring(0, 5) + "-" + $(this).find('expDclrNo').text().substring(5, 7) + "-" + $(this).find('expDclrNo').text().substring(7, $(this).find('expDclrNo').text().length) + "</td> ";
            vHTML += "   				<td class=\"a_center\">" + _fnFormatDate($(this).find('loadDtyTmlm').text()) + "</td> ";
            vHTML += "   				<td class=\"a_right\">" + fnSetComma(Number($(this).find('csclWght').text())) + "</td> ";
            vHTML += "   			</tr> ";
        });

        vHTML += "   		</tbody> ";
        vHTML += "   	</table> ";
        vHTML += "   </div> ";
        vHTML += "   <div class=\"grid_col\"> ";
        vHTML += "   	<table> ";
        vHTML += "   		<colgroup> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col> ";
        vHTML += "   			<col> ";
        vHTML += "   		</colgroup> ";
        vHTML += "   		<thead> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th colspan=\"4\">선적사항</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th rowspan=\"2\">적하목록관리번호</th> ";
        vHTML += "   				<th>선기적지</th> ";
        vHTML += "   				<th>선기적포장개수</th> ";
        vHTML += "   				<th>분할회수</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   			<tr> ";
        vHTML += "   				<th>출항일자</th> ";
        vHTML += "   				<th>선기적중량(KG)</th> ";
        vHTML += "   				<th>선기적완료여부</th> ";
        vHTML += "   			</tr> ";
        vHTML += "   		</thead> ";
        vHTML += "   		<tbody> ";

        $(vXML).find('expDclrNoPrExpFfmnBrkdBlNoQryRsltVo').each(function () {
            vHTML += "   			<tr> ";
            vHTML += "   				<td class=\"a_center\" rowspan=\"2\">" + $(this).find('mrn').text() + "</td> ";
            vHTML += "   				<td class=\"a_center\">" + $(this).find('shpmAirptPortNm').text() + "</td> ";
            vHTML += "   				<td class=\"a_right\">" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</td> ";
            vHTML += "   				<td class=\"a_center\">" + $(this).find('dvdeWdrw').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<td class=\"a_center\">" + _fnFormatDate($(this).find('tkofDt').text()) + "</td> ";
            vHTML += "   				<td class=\"a_right\">" + fnSetComma($(this).find('shpmWght').text()) + "</td> ";
            vHTML += "   				<td class=\"a_center\">" + $(this).find('shpmCmplYn').text() + "</td> ";
            vHTML += "   			</tr> ";
        });

        vHTML += "   		</tbody> ";
        vHTML += "   	</table> ";
        vHTML += "   </div> ";

        $("#div_UniOB_BlFirst")[0].innerHTML = vHTML;

        $("#div_UniOB_BLArea").show();
        layerPopup('#import_unipassPop');
    }
}

function _fnMakeTerminal(result) {
    var apdVal = "";
    var CntrJson = result.Table1;
    if (_fnToNull(CntrJson) != "") {
        $(CntrJson).each(function (i) {

            apdVal += "<div class='term_cont'>	";
            apdVal += "           <div class='term_box'>";
            apdVal += "               <div class='term_inner long'>";
            apdVal += "                                 <p class='title'>" + _fnToNull(CntrJson[i].TRMN_NM) + "(" + _fnToNull(CntrJson[i].VSL_REF) + ")</p> ";
            apdVal += "                                 <p>선석 " + _fnToNull(CntrJson[i].TRMN_BERTH);
            if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "양호") {
                apdVal += "<span class='cong_level green'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "보통") {
                apdVal += "<span class='cong_level yellow'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "혼잡") {
                apdVal += "<span class='cong_level red'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            }
            apdVal += "                             </p>";
            apdVal += "                   <div class='term_flex'>";
            apdVal += "                       <div class='term_info'>";
            apdVal += "                           <span class='vsl_nm'>" + _fnToNull(CntrJson[i].VSL_ORG_NM) + "</span> ";
            apdVal += "                           <span class='vsl_per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span> ";
            apdVal += "                           <div class='vsl_bar'>";
            apdVal += "                               <div class='bar_percent per" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "'></div> ";
            apdVal += "                           </div>";
            apdVal += "                       </div>";
            apdVal += "                   </div>";
            apdVal += "               </div>";
            apdVal += "           </div>";
            apdVal += "           <div class='term_box'>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>접안 시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ATB_YMD)) + " " + _fnDateFormat(CntrJson[i].ATB_HM) + "</p> ";
            apdVal += "               </div>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>작업 시작시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].START_YMD)) + " " + _fnDateFormat(CntrJson[i].START_HM) + "</p> ";
            apdVal += "               </div>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>출항(예정) 시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ATD_YMD)) + " " + _fnDateFormat(_fnToNull(CntrJson[i].ATD_HM)) + "</p> ";
            apdVal += "               </div>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>양하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_COMPLETED), "sum") + "/" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].DISCHARGE_COMPLETED), parseInt(CntrJson[i].DISCHARGE_TOTAL)) + "%</span></p> ";
            apdVal += "               </div>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>적하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_COMPLETED), "sum") + " / " + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].LOADING_COMPLETED), parseInt(CntrJson[i].LOADING_TOTAL)) + "%</span></p> ";
            apdVal += "               </div>";
            apdVal += "               <div class='term_inner'>";
            apdVal += "                                 <p class='title'>합계</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), "sum") + " / " + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL)), "sum") + " <span class='per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span></p> ";
            apdVal += "               </div>";
            apdVal += "           </div>";
            apdVal += "       </div>";
        });
        apdVal += " <button type=\"button\" class=\"btns close\" onclick=\"layerClose('#terminalPop');\"><span class=\"blind\">닫기</span></button> ";
        
        $("#Cntr_list").append(apdVal);
    } else {
        apdVal += "	<div class='client' id='no_data'> ";
        apdVal += "        <div class='no_data'> ";
        apdVal += "            <div class='no_sorry'> ";
        apdVal += "                <h3> ";
        apdVal += "                    Sorry<br /> ";
        apdVal += "                    <span>검색 결과가 없습니다.</span> ";
        apdVal += "                </h3> ";
        apdVal += "            </div> ";
        apdVal += "        </div> ";
        apdVal += "    </div>";

        apdVal += " <button type=\"button\" class=\"btns close\" onclick=\"layerClose('#terminalPop');\"><span class=\"blind\">닫기</span></button> ";

        $("#Cntr_list").append(apdVal);
    }

    layerPopup('#terminalPop');
}

//실시간 위치정보 중 텍스트 데이터 그려주기 
function fnMakeRealLocation(vJsonData,vHBL){
    try {

        var vHTML = "";
        var vResult = "";
        var vVslData = fnGetVslData(vHBL);
        vResult = JSON.parse(vJsonData).Detail;        

        vHTML += "";
        
        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"client_logo\"> ";

        if (_fnToNull(JSON.parse(vVslData).VSLINFO[0]["LINE_PATH"]) == "") {
            vHTML += "       <img src=\"/images/no_data_bg04.png\" /> ";
        } else {
            vHTML += "       <img src=\"" + _fnToNull(JSON.parse(vVslData).VSLINFO[0]["LINE_PATH"]) + "\" /> ";
        }

        vHTML += "   	</div> ";
        vHTML += "   </div> ";
        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"flex_line\"> ";
        vHTML += "   		<p><span>Carrier</span>" + _fnToNull(JSON.parse(vVslData).VSLINFO[0]["CARR_NM"]) +"</p> ";
        vHTML += "   		<p><span>Vessel</span>" + _fnToNull(JSON.parse(vVslData).VSLINFO[0]["VSL"]) +"</p> ";
        vHTML += "   		<p><span>IMO</span>" + _fnToNull(JSON.parse(vVslData).VSLINFO[0]["VSL_IMO"]) +"</p> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";
        vHTML += "   <div class=\"flex_box\"> ";
        vHTML += "   	<div class=\"flex_line\"> ";
        vHTML += "   		<p><span>MMSI</span>" + _fnToNull(JSON.parse(vVslData).VSLINFO[0]["VSL_MMSI"]) +"</p> ";
        vHTML += "   		<p><span>LAT</span>" + vResult[vResult.length - 1]["MAP_LAT"]+"</p> ";
        vHTML += "   		<p><span>LNG</span>" + vResult[vResult.length - 1]["MAP_LNG"] +"</p> ";
        vHTML += "   	</div> ";
        vHTML += "   </div> ";

        $("#layerTrkInfoArea")[0].innerHTML = vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeRealLocation]" + err.message);
    }
}

function _fnMakeList(rtnJson) {
    var apdVal = "";
    var rtnTbl = rtnJson.Table1;

    var vChkOn = false;
    var vUnipass = false;

    if (_fnToNull(rtnTbl) != "") {
        $(rtnTbl).each(function (i) {
            if (rtnTbl[i].EX_IM_TYPE == "E") { //수출

                if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
                    //apdVal += "	<div class='track_stat on import'> ";
                    if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                        apdVal += "	<div class='track_stat on last export'> ";
                    } else {
                        apdVal += "	<div class='track_stat on export'> ";
                    }
                    vChkOn = true

                } else {
                    if (vChkOn) {
                        if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                            apdVal += "	<div class='track_stat last export'> ";
                        } else {
                            apdVal += "	<div class='track_stat yet export'> ";
                        }
                    } else {
                        apdVal += "	<div class='track_stat export'> ";
                    }
                }
                apdVal += "            <div class='track_proc'> ";
                apdVal += "                <div class='track_cell'> ";
                apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
                apdVal += "                </div> ";
                apdVal += "            </div> ";
                apdVal += "            <div class='track_process'> ";
                apdVal += "                <div class='track_inner'> ";
                apdVal += "                    <div class='track img'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track loc'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                            <p class='title'>LOCATION</p> ";
                apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track dnt'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                            <p class='title'>DATE AND TIME</p> ";
                apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track etc'> ";
                apdVal += "                        <div class='track_cell'> ";
                if (i == 1) {
                    apdVal += "                        <button type='button' class='btn_track' name='layerTerminal' id='layerTerminal'>터미널 정보</button> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD_YMD) + "</p> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETA_YMD) + "</p> ";
                } else if (i == 2) {
                    apdVal += "                       <button type='button' class='btn_track' name='layerLocation' id='layerLocation'>실시간 위치정보</button> ";                    
                    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
                    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
                } else if (i == 3) {
                    apdVal += "                       <button type='button' class='btn_track' name='Export_layerUnipass' id='Export_layerUnipass' >UNIPASS</button>";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
                }
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                </div> ";
                apdVal += "            </div> ";
                apdVal += "        </div>";
            }
            else if (rtnTbl[i].EX_IM_TYPE == "I") { //수입
                if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
                    //apdVal += "	<div class='track_stat on import'> ";
                    if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                        apdVal += "	<div class='track_stat on last import'> ";
                    } else {
                        apdVal += "	<div class='track_stat on import'> ";
                    }
                    vChkOn = true

                    //유니패스 찍어주는거 떄매.. -_-;; 
                    if (2<i) {
                        vUnipass = true;
                    }

                } else {
                    if (vChkOn) {
                        if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                            apdVal += "	<div class='track_stat last import'> ";
                        } else {
                            apdVal += "	<div class='track_stat yet import'> ";
                        }
                    } else {
                        apdVal += "	<div class='track_stat import'> ";
                    }
                }               
                
                apdVal += "            <div class='track_proc'> ";
                apdVal += "                <div class='track_cell'> ";
                apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
                apdVal += "                </div> ";
                apdVal += "            </div> ";
                apdVal += "            <div class='track_process'> ";
                apdVal += "                <div class='track_inner'> ";
                apdVal += "                    <div class='track img'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track loc'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                            <p class='title'>LOCATION</p> ";
                apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track dnt'> ";
                apdVal += "                        <div class='track_cell'> ";
                apdVal += "                            <p class='title'>DATE AND TIME</p> ";
                apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                    <div class='track etc'> ";
                apdVal += "                        <div class='track_cell'> ";
                if (i == 3) {
                    apdVal += "                        <button type='button' class='btn_track' name='layerTerminal'id='layerTerminal'>터미널 정보</button> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD_YMD) + "</p> ";
                    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETA_YMD) + "</p> ";
                } else if (i == 0) {
                    apdVal += "                       <button type='button' class='btn_track' name='layerLocation'id='layerLocation'>실시간 위치정보</button> ";                    
                    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
                    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
                }

                if (_fnToNull(rtnTbl[i].MAX_SEQ) == _fnToNull(rtnTbl[i].SEQ)) {
                    if (i == 5) {
                        apdVal += "                       <button type='button' class='btn_track' name='Import_layerUnipass' id='layerUnipass' >UNIPASS</button>";
                        apdVal += "                       <p style='display:none' name=\"Unipass_HBL\">" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                        apdVal += "                       <p style='display:none' name=\"Unipass_ETD\">" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
                    }
                } else {
                    if (vChkOn) {
                        if (vUnipass) {
                            apdVal += "                       <button type='button' class='btn_track' name='Import_layerUnipass' id='layerUnipass' >UNIPASS</button>";
                            apdVal += "                       <p style='display:none' name=\"Unipass_HBL\">" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                            apdVal += "                       <p style='display:none' name=\"Unipass_ETD\">" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
                            vUnipass = false;
                        }
                    }                    
                }

                apdVal += "                        </div> ";
                apdVal += "                    </div> ";
                apdVal += "                </div> ";
                apdVal += "            </div> ";
                apdVal += "        </div>";
            }
        });
        $("#trk_list").append(apdVal);
        //drawingLayerNodata();
    } else {
        apdVal += "	<div class='client' id='no_data'> ";
        apdVal += "        <div class='no_data'> ";
        apdVal += "            <div class='no_sorry'> ";
        apdVal += "                <h3> ";
        apdVal += "                    Sorry<br /> ";
        apdVal += "                    <span>검색 결과가 없습니다.</span> ";
        apdVal += "                </h3> ";
        apdVal += "            </div> ";
        apdVal += "        </div> ";
        apdVal += "    </div>";
        $("#trk_list").append(apdVal);
    }
}

//function _fnMakeList(rtnJson) {
//    var apdVal = "";
//    var rtnTbl = rtnJson.Table1;
//
//    var vChkFirst = true;
//    var vChkOn = false;
//    var vUnipass = false;
//
//    //코드 / 코드 명
//    var vEX_EventCD = ['EMT', 'CIG', 'LOD', 'POL', 'ARR'];
//    var vEX_EventNM = ['공컨 반출', '반입', '선적', '출항', '입항'];
//    var vIM_EventCD = ['CNI', 'POL', 'ARR', 'ICC', 'CYA', 'CYD'];
//    var vIM_EventNM = ['출항', '입항', '통관(수입신고 수리)', '반입(반입 신고)', '반출(반출 신고)', '공컨 반납'];
//    var j = 0;
//        
//    //MAX_SEQ를 체크하여 어디까지 진행 되었는지 확인.
//    $(rtnTbl).each(function (i) {
//        if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].SEQ)) {
//            vChkFirst = false;
//        }
//    });
//
//    if (vChkFirst) {        
//        vChkOn = true;
//    }
//    //MAX_SEQ를 체크하여 어디까지 진행 되었는지 확인.
//
//    if (_fnToNull(rtnTbl) != "") {
//
//        if (rtnTbl[0].EX_IM_TYPE == "E") { //수출               
//            for (var i = 0; i < rtnTbl.length; i++) {
//
//                if (vChkFirst) {
//                    apdVal += "	<div class='track_stat on export'> ";
//                    vChkFirst = false;
//                }
//                else if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
//                    //apdVal += "	<div class='track_stat on import'> ";
//                    if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
//                        apdVal += "	<div class='track_stat on last export'> ";
//                    } else {
//                        apdVal += "	<div class='track_stat on export'> ";
//                    }
//                    vChkOn = true
//
//                } else {
//                    if (vChkOn) {
//                        if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
//                            apdVal += "	<div class='track_stat last export'> ";
//                        } else {
//                            apdVal += "	<div class='track_stat yet export'> ";
//                        }
//                    } else {
//                        apdVal += "	<div class='track_stat export'> ";
//                    }
//                }
//
//                //데이터를 어떻게 해야될까?
//                if (rtnTbl[i].EVENT_CD != vEX_EventCD[j]) {
//                    apdVal += fnMakeExEmptyData(rtnTbl,j,vEX_EventNM[j]);
//                    i = (i - 1);
//                } else {
//                    apdVal += "            <div class='track_proc'> ";
//                    apdVal += "                <div class='track_cell'> ";
//                    apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
//                    apdVal += "                </div> ";
//                    apdVal += "            </div> ";
//                    apdVal += "            <div class='track_process'> ";
//                    apdVal += "                <div class='track_inner'> ";
//                    apdVal += "                    <div class='track img'> ";
//                    apdVal += "                        <div class='track_cell'> ";
//                    apdVal += "                        </div> ";
//                    apdVal += "                    </div> ";
//                    apdVal += "                    <div class='track loc'> ";
//                    apdVal += "                        <div class='track_cell'> ";
//                    apdVal += "                            <p class='title'>LOCATION</p> ";
//                    apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
//                    apdVal += "                        </div> ";
//                    apdVal += "                    </div> ";
//                    apdVal += "                    <div class='track dnt'> ";
//                    apdVal += "                        <div class='track_cell'> ";
//                    apdVal += "                            <p class='title'>DATE AND TIME</p> ";
//                    apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
//                    apdVal += "                        </div> ";
//                    apdVal += "                    </div> ";
//                    apdVal += "                    <div class='track etc'> ";
//                    apdVal += "                        <div class='track_cell'> ";
//                    if (j == 0) {
//                        apdVal += "                        <button type='button' class='btn_track' name='layerTerminal' id='layerTerminal'>터미널 정보</button> ";
//                        apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
//                        apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD_YMD) + "</p> ";
//                        apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETA_YMD) + "</p> ";
//                    } else if (j == 1) {
//                        apdVal += "                       <button type='button' class='btn_track' name='layerLocation' id='layerLocation'>실시간 위치정보</button> ";
//                        apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
//                        apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
//                        //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
//                        //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
//                    } else if (j == 2) {
//                        apdVal += "                       <button type='button' class='btn_track' name='Export_layerUnipass' id='Export_layerUnipass' >UNIPASS</button>";
//                        apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
//                        apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
//                    }
//                    apdVal += "                        </div> ";
//                    apdVal += "                    </div> ";
//                    apdVal += "                </div> ";
//                    apdVal += "            </div> ";
//                    apdVal += "        </div>";
//                }
//
//                j++;
//            } 
//        }
//        else if (rtnTbl[0].EX_IM_TYPE == "I") { //수입
//            for (var i = 0; i < rtnTbl.length; i++) {
//
//            }
//        }
//
//        $("#trk_list").append(apdVal);
//
//        //$(rtnTbl).each(function (i) {
//        //    if (rtnTbl[i].EX_IM_TYPE == "E") { //수출               
//        //
//        //        
//        //    }
//        //    else if (rtnTbl[i].EX_IM_TYPE == "I") { //수입
//        //        if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
//        //            //apdVal += "	<div class='track_stat on import'> ";
//        //            if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
//        //                apdVal += "	<div class='track_stat on last import'> ";
//        //            } else {
//        //                apdVal += "	<div class='track_stat on import'> ";
//        //            }
//        //            vChkOn = true
//        //
//        //            //유니패스 찍어주는거 떄매.. -_-;; 
//        //            if (2 < i) {
//        //                vUnipass = true;
//        //            }
//        //
//        //        } else {
//        //            if (vChkOn) {
//        //                if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
//        //                    apdVal += "	<div class='track_stat last import'> ";
//        //                } else {
//        //                    apdVal += "	<div class='track_stat yet import'> ";
//        //                }
//        //            } else {
//        //                apdVal += "	<div class='track_stat import'> ";
//        //            }
//        //        }
//        //        
//        //        apdVal += "            <div class='track_proc'> ";
//        //        apdVal += "                <div class='track_cell'> ";
//        //        apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
//        //        apdVal += "                </div> ";
//        //        apdVal += "            </div> ";
//        //        apdVal += "            <div class='track_process'> ";
//        //        apdVal += "                <div class='track_inner'> ";
//        //        apdVal += "                    <div class='track img'> ";
//        //        apdVal += "                        <div class='track_cell'> ";
//        //        apdVal += "                        </div> ";
//        //        apdVal += "                    </div> ";
//        //        apdVal += "                    <div class='track loc'> ";
//        //        apdVal += "                        <div class='track_cell'> ";
//        //        apdVal += "                            <p class='title'>LOCATION</p> ";
//        //        apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
//        //        apdVal += "                        </div> ";
//        //        apdVal += "                    </div> ";
//        //        apdVal += "                    <div class='track dnt'> ";
//        //        apdVal += "                        <div class='track_cell'> ";
//        //        apdVal += "                            <p class='title'>DATE AND TIME</p> ";
//        //        apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
//        //        apdVal += "                        </div> ";
//        //        apdVal += "                    </div> ";
//        //        apdVal += "                    <div class='track etc'> ";
//        //        apdVal += "                        <div class='track_cell'> ";
//        //        if (i == 3) {
//        //            apdVal += "                        <button type='button' class='btn_track' name='layerTerminal'id='layerTerminal'>터미널 정보</button> ";
//        //            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
//        //            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD_YMD) + "</p> ";
//        //            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETA_YMD) + "</p> ";
//        //        } else if (i == 0) {
//        //            apdVal += "                       <button type='button' class='btn_track' name='layerLocation'id='layerLocation'>실시간 위치정보</button> ";
//        //            apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
//        //            apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
//        //            //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
//        //            //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
//        //        }
//        //
//        //        if (_fnToNull(rtnTbl[i].MAX_SEQ) == _fnToNull(rtnTbl[i].SEQ)) {
//        //            if (i == 5) {
//        //                apdVal += "                       <button type='button' class='btn_track' name='Import_layerUnipass' id='layerUnipass' >UNIPASS</button>";
//        //                apdVal += "                       <p style='display:none' name=\"Unipass_HBL\">" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
//        //                apdVal += "                       <p style='display:none' name=\"Unipass_ETD\">" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
//        //            }
//        //        } else {
//        //            if (vChkOn) {
//        //                if (vUnipass) {
//        //                    apdVal += "                       <button type='button' class='btn_track' name='Import_layerUnipass' id='layerUnipass' >UNIPASS</button>";
//        //                    apdVal += "                       <p style='display:none' name=\"Unipass_HBL\">" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
//        //                    apdVal += "                       <p style='display:none' name=\"Unipass_ETD\">" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
//        //                    vUnipass = false;
//        //                }
//        //            }
//        //        }
//        //
//        //        apdVal += "                        </div> ";
//        //        apdVal += "                    </div> ";
//        //        apdVal += "                </div> ";
//        //        apdVal += "            </div> ";
//        //        apdVal += "        </div>";
//        //        
//        //    }
//        //});
//        //$("#trk_list").append(apdVal);
//        //drawingLayerNodata();
//    } else {
//        apdVal += "	<div class='client' id='no_data'> ";
//        apdVal += "        <div class='no_data'> ";
//        apdVal += "            <div class='no_sorry'> ";
//        apdVal += "                <h3> ";
//        apdVal += "                    Sorry<br /> ";
//        apdVal += "                    <span>검색 결과가 없습니다.</span> ";
//        apdVal += "                </h3> ";
//        apdVal += "            </div> ";
//        apdVal += "        </div> ";
//        apdVal += "    </div>";
//        $("#trk_list").append(apdVal);
//    }
//}
//
////없는 데이터 그려주기
//function fnMakeExEmptyData(rtnTbl,j,vEventNM) {
//
//    try {
//
//        var apdVal = "";
//
//        apdVal += "            <div class='track_proc'> ";
//        apdVal += "                <div class='track_cell'> ";
//        apdVal += "                    <p>" + _fnToNull(vEventNM) + "</p> ";
//        apdVal += "                </div> ";
//        apdVal += "            </div> ";
//        apdVal += "            <div class='track_process'> ";
//        apdVal += "                <div class='track_inner'> ";
//        apdVal += "                    <div class='track img'> ";
//        apdVal += "                        <div class='track_cell'> ";
//        apdVal += "                        </div> ";
//        apdVal += "                    </div> ";
//        apdVal += "                    <div class='track loc'> ";
//        apdVal += "                        <div class='track_cell'> ";
//        apdVal += "                            <p class='title'>LOCATION</p> ";
//        apdVal += "                            <p></p> ";
//        apdVal += "                        </div> ";
//        apdVal += "                    </div> ";
//        apdVal += "                    <div class='track dnt'> ";
//        apdVal += "                        <div class='track_cell'> ";
//        apdVal += "                            <p class='title'>DATE AND TIME</p> ";
//        apdVal += "                        </div> ";
//        apdVal += "                    </div> ";
//        apdVal += "                    <div class='track etc'> ";
//        apdVal += "                        <div class='track_cell'> ";
//        if (j == 0) {
//            apdVal += "                        <button type='button' class='btn_track' name='layerTerminal' id='layerTerminal'>터미널 정보</button> ";
//            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[0].VSL) + "</p> ";
//            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[0].ETD_YMD) + "</p> ";
//            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[0].ETA_YMD) + "</p> ";
//        } else if (j == 1) {
//            apdVal += "                       <button type='button' class='btn_track' name='layerLocation' id='layerLocation'>실시간 위치정보</button> ";
//            apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[0].HBL_NO) + "</p> ";
//            apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[0].VSL) + "</p> ";
//            //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
//            //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
//        } else if (j == 2) {
//            apdVal += "                       <button type='button' class='btn_track' name='Export_layerUnipass' id='Export_layerUnipass' >UNIPASS</button>";
//            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[0].HBL_NO) + "</p> ";
//            apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[0].ETD) + "</p> ";
//        }
//        apdVal += "                        </div> ";
//        apdVal += "                    </div> ";
//        apdVal += "                </div> ";
//        apdVal += "            </div> ";
//        apdVal += "            </div> ";
//
//        return apdVal;
//    }
//    catch (err) {
//        console.log("[Error - fnMakeExEmptyData]" + err.message);
//    }
//}



//실시간 위치정보 레이어 팝업 그려주기
function fnMakeLayerTrkInfo(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).VSLINFO;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnMakeLayerTrkInfo]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerTrkInfo]" + err.message);
    }
}

/////////////////////API///////////////////////////////////////
function connectTheDots(data) {
    var c = [];
    for (i in data._layers) {
        var x = data._layers[i]._latlng.lat;
        var y = data._layers[i]._latlng.lng;
        c.push([x, y]);
    }
    return c;
}
function drawingLayerNodata() {

    if (_fnToNull(mymap) != "") {
        mymap.remove();
    }
    mymap = L.map('map', {
        //center: [lat, lng],
        center: [32.896531, 124.402956],
        zoom: 5,
        zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; Copyright Google Maps<a target="_blank" href="https://maps.google.com/maps?ll=24.53279,56.62833&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3"></a>' //화면 오른쪽 하단 attributors
    }).addTo(mymap);

}
function drawingLayer(json_data) {
    var spiral = {
        type: "FeatureCollection",
        features: []
    };
    var master = json_data.Master[0];//헤더 테이블 조회
    var result = [];
    for (var i in master)
        result.push([master[i]]);

    var POL = result[4].concat(result[5]);
    //var POL = result[3].concat(result[4]);

    var lastRoute;
    var rotate;
    var detail = json_data.Detail;//디테일 테이블 조회

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
    var zoom = 5; //줌 레벨

    if (_fnToNull(mymap) != "") {
        mymap.remove();
    }

    mymap = L.map('map', {
        //center: [lat, lng],
        center: [32.896531, 124.402956],
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
    //spiralBounds = polyline.getBounds();
    //mymap.fitBounds(spiralBounds);
    polyline.addTo(mymap);

    spiralCoords = connectTheDots(polyline);
    var spiralLine = L.polyline(spiralCoords).addTo(mymap)

    var shipIconBig = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [24, 30]  // size of the icon
    });

    var shipIcon = L.icon({
        iconUrl: "../Images/icn_ship.png",
        iconSize: [24, 30]  // size of the icon
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
        
    //var maker_POL = L.marker(POL, { icon: portIconBig }).addTo(mymap);
    var LastMarker = L.marker(lastRoute, { icon: shipIcon, rotationOrigin: 'center center' }).addTo(mymap);

    mymap.on('zoomend', function () {
        var currentZoom = mymap.getZoom();
        if (currentZoom <= 5) {
            //maker_POL.setIcon(portIconBig);
            LastMarker.setIcon(shipIconBig);
        }
        else {
            //maker_POL.setIcon(portIcon);
            LastMarker.setIcon(shipIcon);
        }
    });

    mymap.options.maxZoom = 8;
    mymap.options.minZoom = 2;
}