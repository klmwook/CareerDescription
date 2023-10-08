////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

	//$("#header").addClass("close");
    $('#lnb > li.sub_uni > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(3) > a').addClass("on");

    $('.tab > li').on("click", function () {
		var $panel = $('.tab_panel .panel').eq($(this).index());
		var $navi = $('.navi_tab .navi_list').eq($(this).index());
		$('.tab > li').removeClass("on");
		$('.tab.mo > li').removeClass("on");
		$('.navi_tab .navi_list').removeClass("on");
		$(this).addClass("on");
		$('.tab > li').eq($(this).index()).addClass("on");
		$('.tab.mo > li').eq($(this).index()).addClass("on");
		$navi.addClass("on");
		$('.tab_panel .panel').hide();
        $panel.show();

        if ($(this).attr("id") == "UniCargo") { //수입화물진행정보
        
            //데이터 초기화
            $(".delete").hide();
            $("#input_UniCargoMtno").val("");
            $("#input_UniCargoMBL").val("");
            $("#input_UniCargoHBL").val("");
            $("#select_UniCargoYear option:eq(1)").prop("selected", true);

            $("#no_data").hide();
            $("#UniCargoList").hide();
            $("#div_UniCargoFirst2").hide();
            $("#div_UniCargoSecond").hide();
            $("#div_UniCargoSecond2").hide();
            $(".notice_box").hide();
            $(".cnt_box").hide();
            $("#UniCarogo_Result").hide();
            $("#no_search").show();
        }
        else if ($(this).attr("id") == "UniOB") { //수출이행내역
        
            //데이터 초기화
            $("#input_UniOBnum").val("");
            $("#input_UniOBbl").val("");

            $("#no_data").hide();
            $("#div_UniOB_NumArea").hide();
            $("#div_UniOB_BLArea").hide();
            $("#no_search").show();
        }
	});

	if ($('.scrollbar_mbl').length > 0) {
		$('.scrollbar_mbl').slimScroll({
			height: '164px',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
	}
	if ($('.scrollbar_tbl').length > 0) {
		$('.scrollbar_tbl').slimScroll({
			height: '100%',
			width: '100%',
			alwaysVisible: true,
			railVisible: true,
		});
    }

    //화물진행정보 화면 가리기
    $("#UniCargoList").hide();
    $("#div_UniCargoFirst2").hide();
    $("#div_UniCargoSecond").hide();
    $("#div_UniCargoSecond2").hide();
    $(".notice_box").hide();
    $(".cnt_box").hide();
    $("#UniCarogo_Result").hide();
    
    //수출이행내역 화면 가리기
    $("#div_UniOB_NumArea").hide();
    $("#div_UniOB_BLArea").hide();

    _fnSetUniYear("select_UniCargoYear");
});

//화물진행정보 M B/L-H B/L, 화물관리번호 인풋박스 보여주기
$(document).on("click", "input[name='cargo']", function () {

    $(".delete").hide();
    $("#input_UniCargoMtno").val("");
    $("#input_UniCargoMBL").val("");
    $("#input_UniCargoHBL").val("");
    $("#select_UniCargoYear option:eq(1)").prop("selected", true);

	if ($(this).attr("id") == "cargo01") {
		$("div[name='Cargo_Express_Input_Box']").eq(0).show();
		$("div[name='Cargo_Express_Input_Box']").eq(1).hide();
	} else if ($(this).attr("id") == "cargo02") {
		$("div[name='Cargo_Express_Input_Box']").eq(0).hide();
		$("div[name='Cargo_Express_Input_Box']").eq(1).show();
	}

});

//수출이행내역 수출신고번호, B/L 인풋박스 보여주기
$(document).on("click", "input[name='export']", function () {

    $("#input_UniOBnum").val("");
    $("#input_UniOBbl").val("");

	if ($(this).attr("id") == "export01") {
		$("div[name='UniPass_Export_Box']").eq(0).show();
		$("div[name='UniPass_Export_Box']").eq(1).hide();
	} else if ($(this).attr("id") == "export02") {
		$("div[name='UniPass_Export_Box']").eq(0).hide();
		$("div[name='UniPass_Export_Box']").eq(1).show();
	}
});

//수출입화물정보 - 화물진행정보 검색 버튼
$(document).on("click", "#btn_Cargo_Search", function () {
    fnGetXml_Cargo();
});

//수출입화물정보 - 수출신고번호 검색 버튼
$(document).on("click", "#btn_Outbound_Search", function () {
    fnGetXml_OutBound();
});

//화물진행정보 관리번호 리스트 검색 버튼 이벤트
$(document).on("click", "a[name='Unipass_SearchMngt']", function () {
    //alert($(this).text());
    fnGetXml_MTNO($(this).text().replace(/ /gi,""));
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {

            var vIndex = $(e.target).attr('data-index');

            //수입화물진행정보 - 수출이행내역
            if (vIndex.indexOf("Main_UniCargoBL") > -1) {
                vIndex = vIndex.replace("Main_UniCargoBL", "");
                if (vIndex == "2") {
                    fnGetXml_Cargo();
                } else {
                    $('[data-index="Main_UniCargoBL' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
            }

            //수입화물진행정보 -화물관리번호
            if (vIndex.indexOf("Main_UniCargoMtno") > -1) {
                fnGetXml_Cargo();
            }

            //수출이행내역 - 수출신고번호
            if (vIndex.indexOf("Main_UniOBnum") > -1) {
                fnGetXml_OutBound();
            }

            //수출이행내역 - B/L
            if (vIndex.indexOf("Main_UniOBbl") > -1) {
                fnGetXml_OutBound();
            }
        }
    }
});


/////////////////////function///////////////////////////////////

//수출입화물정보 - 화물진행정보 검색
function fnGetXml_Cargo() {
    try {
        //다른 input 초기화
        $("#input_UniOBnum").val("");
        $("#input_UniOBbl").val("");

        //리스트 hide 및 초기화
        $("#UniCargoList").hide();
        $("#UniCargoList").empty();

        var objJsonData = new Object();

        if ($("input[name='cargo']:checked").val() == "BL") {
            objJsonData.crkyCn = "i220k129u161i054w030p040s2";
            objJsonData.cargMtNo = "";
            objJsonData.mblNo = $("#input_UniCargoMBL").val().replace(/ /gi,"");
            objJsonData.hblNo = $("#input_UniCargoHBL").val().replace(/ /gi,"");
            objJsonData.blYy = $("#select_UniCargoYear option:selected").val(); //selected 
        }
        else if ($("input[name='cargo']:checked").val() == "MTNO") {
            objJsonData.crkyCn = "i220k129u161i054w030p040s2";
            objJsonData.cargMtNo = $("#input_UniCargoMtno").val().replace(/ /gi, "");
            objJsonData.mblNo = "";
            objJsonData.hblNo = "";
            objJsonData.blYy = "";
        }

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
}

//수출입화물정보 - 화물진행정보 (관리번호로 검색)
function fnGetXml_MTNO(vMTNO) {
    try {

        var objJsonData = new Object();

        objJsonData.crkyCn = "i220k129u161i054w030p040s2";
        objJsonData.cargMtNo = vMTNO;
        objJsonData.mblNo = "";
        objJsonData.hblNo = "";
        objJsonData.blYy = "";

        $.ajax({
            type: "POST",
            url: "/Unipass/GetCargoInfo",
            async: true,
            dataType: "xml",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
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
}


//수출입화물정보 - 수출신고번호 검색
function fnGetXml_OutBound() {

    try {
        //input 화물진행정보 초기화
        $("#input_UniCargoMBL").val("");
        $("#input_UniCargoHBL").val("");
        $("#select_UniCargoYear option:eq(1)").prop("selected", true);

        $("#div_UniCargoArea").hide();

        var objJsonData = new Object();

        if ($("input:radio[name='export']:checked").val() == "OUTBOUND") {
            objJsonData.crkyCn = "u270b149n161k024l060s050u1";
            objJsonData.expDclrNo = $("#input_UniOBnum").val().replace(/ /gi,"");

            $.ajax({
                type: "POST",
                url: "/Unipass/GetOBNumInfo",
                async: true,
                dataType: "xml",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#no_data").hide();
                    $("#no_search").hide();
                    fnXmlParsing_OBnum(result);
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
            $("#div_UniOB_NumArea").show();
            $("#div_UniOB_BLArea").hide();
        } else if ($("input:radio[name='export']:checked").val() == "BL") {
            objJsonData.crkyCn = "u270b149n161k024l060s050u1";
            objJsonData.blNo = $("#input_UniOBbl").val().replace(/ /gi, "");

            $.ajax({
                type: "POST",
                url: "/Unipass/GetOBBLInfo",
                async: true,
                dataType: "xml",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    $("#no_data").hide();
                    $("#no_search").hide();
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
            $("#div_UniOB_NumArea").hide();
            $("#div_UniOB_BLArea").show();
        }


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

        $("#no_data").show();
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

        $("#no_data").show();
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
        $("#div_UniCargoArea").show();
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
            vHTML += " 			<td>"+ $(this).find('cargMtNo').text() + "</td>                            ";
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
            vHTML += " 		</tr>                                    ";
            vHTML += " 	</tbody>                                     ";
            vHTML += " </table>                                       ";
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

        vHTML += "   <div class=\"scrollbar\" id=\"Unipass_Cargo_scrollbar\"> ";
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
                height: '401px',
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
    }
    
}

//수출이행내역 - 수출신고번호
function fnXmlParsing_OBnum(vXML) {

    var vHTML = "";

    if ($(vXML).find('tCnt').text() == "0") {
        //데이터 없을 경우	
        //vHTML += " <div class='grid_col'> ";
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
        //vHTML += " </div>                                       ";

        $(".cnt_box").hide();
        $("#div_UniOB_NumSecond").hide();
        $("#div_UniOB_NumArea").hide();
        //$("#div_UniOB_NumFirst")[0].innerHTML = vHTML;
        $("#no_data").show();
    }
    else if ($(vXML).find('tCnt').text() == "-1") {
        //검색을 잘 못 하였을 경우
        //vHTML += " <div class='grid_col'> ";
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
        //vHTML += " 			<td colspan=\"8\">" + $(vXML).find('ntceInfo').text() + "</td> ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " 		<tr class=\"mo\">                        ";
        //vHTML += " 			<td colspan=\"8\">" + $(vXML).find('ntceInfo').text() + "</td> ";
        //vHTML += " 		</tr>                                    ";
        //vHTML += " </table>                                       ";
        //vHTML += " </div>                                       ";

        $(".cnt_box").hide();
        $("#div_UniOB_NumArea").hide();
        $("#div_UniOB_NumSecond").hide();
        //$("#div_UniOB_NumFirst")[0].innerHTML = vHTML;
        $("#no_data").show();
    }
    else {
        //데이터가 있을 경우
        $(vXML).find('expDclrNoPrExpFfmnBrkdQryRsltVo').each(function () {

            vHTML += "   <div class=\"grid_col\"> ";
            vHTML += "   	<table> ";
            vHTML += "   		<colgroup> ";
            vHTML += "   			<col class=\"w1\" /> ";
            vHTML += "   			<col /> ";
            vHTML += "   		</colgroup> ";
            vHTML += "   		<tbody> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>수출화주/대행자</th> ";
            vHTML += "   				<td>" + $(this).find('exppnConm').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>적재의무기한</th> ";
            vHTML += "   				<td>" + _fnFormatDate($(this).find('loadDtyTmlm').text()) + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>통관포장개수</th> ";
            vHTML += "   				<td>" + $(this).find('csclPckGcnt').text() + " " + $(this).find('csclPckUt').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>선기적완료여부</th> ";
            vHTML += "   				<td>" + $(this).find('shpmCmplYn').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>선기적포장개수</th> ";
            vHTML += "   				<td>" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   		</tbody> ";
            vHTML += "   	</table> ";
            vHTML += "   </div> ";
            vHTML += "   <div class=\"grid_col\"> ";
            vHTML += "   	<table> ";
            vHTML += "   		<colgroup> ";
            vHTML += "   			<col class=\"w1\" /> ";
            vHTML += "   			<col /> ";
            vHTML += "   		</colgroup> ";
            vHTML += "   		<tbody> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>제조자</th> ";
            vHTML += "   				<td>" + $(this).find('mnurConm').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>수리일자</th> ";
            vHTML += "   				<td>" + _fnFormatDate($(this).find('acptDt').text()) + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>통관중량(KG)</th> ";
            vHTML += "   				<td>" + fnSetComma(Number($(this).find('csclWght').text())) + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>선박/편명</th> ";
            vHTML += "   				<td>" + $(this).find('sanm').text() + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   			<tr> ";
            vHTML += "   				<th>선기적중량(KG)</th> ";
            vHTML += "   				<td>" + fnSetComma($(this).find('shpmWght').text()) + "</td> ";
            vHTML += "   			</tr> ";
            vHTML += "   		</tbody> ";
            vHTML += "   	</table> ";
            vHTML += "   </div> ";

            $("#div_UniOB_NumFirst")[0].innerHTML = vHTML;
            $("#span_UniOB_NumCount")[0].innerHTML = "전체 <em>" + $(vXML).find('expDclrNoPrExpFfmnBrkdDtlQryRsltVo').length + "</em>건";

            vHTML = "";

            vHTML += "   <table>                                                  ";
            vHTML += "   	<colgroup class=\"pc\">                                           ";
            vHTML += "   		<col style=\"width: 25%\">                       ";
            vHTML += "   		<col style=\"width: 25%\">                       ";
            vHTML += "   		<col style=\"width: 25%\">                       ";
            vHTML += "   		<col style=\"width: 25%\">                       ";
            vHTML += "   	</colgroup>                                          ";
            vHTML += "   	<colgroup class=\"mo\">                                           ";
            vHTML += "   		<col style=\"width: 100%\">                       ";
            vHTML += "   	</colgroup>                                          ";
            vHTML += "   		<tr>                                             ";
            vHTML += "   			<th>B/L 번호</th>                              ";
            vHTML += "   			<th>선적일자</th>                               ";
            vHTML += "   			<th>선기적포장개수</th>                           ";
            vHTML += "   			<th>선기적중량(KG)</th>                          ";
            vHTML += "   		</tr>                                            ";
            vHTML += "   	</thead>                                             ";
            vHTML += "   	<tbody>		                                         ";


            $(vXML).find('expDclrNoPrExpFfmnBrkdDtlQryRsltVo').each(function (i) {

                if (i % 2 == 1) {
                    vHTML += "   		<tr style=\"background: #fafafa;\">                                           ";
                }
                else {
                    vHTML += "   		<tr>                                           ";
                }
                vHTML += "   			<td class=\"a_center\"><span class=\"data\"> " + $(this).find('blNo').text() + "</span></td> ";
                vHTML += "   			<td class=\"a_center\"><span class=\"data\">" + _fnFormatDate($(this).find('tkofDt').text()) + "</span></td>       ";
                vHTML += "   			<td class=\"a_right\"><span class=\"data\">" + $(this).find('shpmPckGcnt').text() + " " + $(this).find('shpmPckUt').text() + "</span></td>              ";
                vHTML += "   			<td class=\"a_right\"><span class=\"data\">" + fnSetComma($(this).find('shpmWght').text()) + "</span></td>    ";
                vHTML += "   		</tr>                                            ";

            });

            vHTML += "   	</tbody>                                             ";
            vHTML += "   </table>                                                 ";
        });

        $(".cnt_box").show();
        $("#div_UniOB_NumSecond").show();
        $("#div_UniOB_NumSecond")[0].innerHTML = vHTML;

        $("#UniOB_empty_padding").hide();
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

        $(".cnt_box").hide();
        $("#div_UniOB_BLArea").hide();
        //$("#div_UniOB_BlFirst")[0].innerHTML = vHTML;
        $("#no_data").show();
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
        $("#div_UniOB_BLArea").hide();
        $("#no_data").show();
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
    }
}

/////////////////////API///////////////////////////////////////
