////////////////////전역 변수//////////////////////////
var obj = new Object();
var _vPage = 1;
////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    //$("#header").addClass("close");
    $('#lnb > li.sub_ter > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(5) > a').addClass("on");

    $.ajax({
        type: "POST",
        url: "/Terminal/fnGetPort",
        async: true,
        dataType: "json",
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                var vHtml = "";
                var Port_nm = JSON.parse(result).PORT;
                vHtml += "<option value=''>지역 선택</option>";
                $(Port_nm).each(function (i) {
                    vHtml += "<option value='" + Port_nm[i].LOC_CD + "'>" + Port_nm[i].LOC_NM + "</option>";
                });
                $("#PORT_LOC_CD").append(vHtml);
            }
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });

    //페이지 시작 시 데이터 보여주기 위함
    fnSearchContainer(1);
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            fnSearchContainer(1);
        }
    }
});

/////////////////////function///////////////////////////////////
$("#PORT_LOC_CD").change(function () {
    fnSearchSelect();
    fnSearchContainer(1);
});

$("#PORT_TRMN_CD").change(function () {    
    fnSearchContainer(1);
});

$("#S_END_YN").change(function () {
    fnSearchContainer(1);
});

$("#TRMN_CONGEST_STAT").change(function () {
    fnSearchContainer(1);
});

function fnSearchSelect() {
    $("#PORT_TRMN_CD").empty();
    obj.LOC_CD = $("#PORT_LOC_CD option:selected").val();
    $.ajax({
        type: "POST",
        url: "/Terminal/fnGetTerminal",
        async: false,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(obj) },
        success: function (result) {
            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                var vHtml = "";
                var Port_nm = JSON.parse(result).Table1;
                vHtml += "<option value=''>터미널 선택</option>";
                $(Port_nm).each(function (i) {
                    vHtml += "<option value='" + Port_nm[i].TRMN_CD + "'>" + Port_nm[i].TRMN_NM + "</option>";
                });
                $("#PORT_TRMN_CD").append(vHtml);
            }
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });
}

$("#btn_search").click(function () {
    fnSearchContainer(1);
});

function fnSearchContainer(pageIndex){
    $("#Cntr_list").empty();
    obj.PORT_CD = _fnToNull($("#PORT_LOC_CD option:selected").val());
    obj.TRMN_CD = _fnToNull($("#PORT_TRMN_CD option:selected").val());
    obj.END_YN = _fnToNull($("#S_END_YN option:selected").val());
    obj.TRMN_CONGEST_STAT = _fnToNull($("#TRMN_CONGEST_STAT option:selected").val());
    obj.VSL_NM = _fnToNull($("#VSL_NM").val().replace(/ /gi, ""));
    obj.PAGE = pageIndex;
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
                _fnMakeList(JSON.parse(result), pageIndex);
            } else {
                _fnAlertMsg("no data");
            }
        }, error: function (xhr) {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });

}
//////////////////////function makelist////////////////////////
function _fnMakeList(result , pageIndex) {
    var apdVal = "";
    var CntrJson = result.Table1;
    if (_fnToNull(CntrJson) != "") {
        $(CntrJson).each(function (i) {
            apdVal += " <div class='terminal'> ";
            apdVal += "                 <div class='flex_type1 height100 pc'> ";
            apdVal += "                     <div class='flex_box'> ";
            apdVal += "                         <div class='flex_line'> ";
            apdVal += "                             <div class='w1'> ";
            apdVal += "                                 <p class='title'>" + _fnToNull(CntrJson[i].TRMN_NM) + "(" + _fnToNull(CntrJson[i].VSL_REF) + ")</p> ";
            apdVal += "                                 <p>선석 " + _fnToNull(CntrJson[i].TRMN_BERTH);
            if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "양호") {
                apdVal += "<span class='cong_level green'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "보통") {
                apdVal += "<span class='cong_level yellow'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "혼잡") {
                apdVal += "<span class='cong_level red'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            }
            apdVal += "                             </p></div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>접안 시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ATB_YMD)) + " " + _fnDateFormat(CntrJson[i].ATB_HM) + "</p> ";
            apdVal += "                             </div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>작업 시작시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].START_YMD)) + " " + _fnDateFormat(CntrJson[i].START_HM) + "</p> ";
            apdVal += "                             </div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>출항(예정) 시간</p> ";

            if (_fnToNull(CntrJson[i].ATD_YMD) == "") {
                apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ETD_YMD)) + " " + _fnDateFormat(_fnToNull(CntrJson[i].ETD_HM)) + "</p> ";
            } else {
                apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ATD_YMD)) + " " + _fnDateFormat(_fnToNull(CntrJson[i].ATD_HM)) + "</p> ";
            }

            apdVal += "                             </div> ";
            apdVal += "                         </div> ";
            apdVal += "                         <div class='flex_line'> ";
            apdVal += "                             <div class='w1 flex_inner'> ";
            apdVal += "                                 <div class='vsl_info'> ";
            apdVal += "                                     <span class='vsl_nm'>" + _fnToNull(CntrJson[i].VSL_ORG_NM) + "</span> ";
            apdVal += "                                     <span class='vsl_per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span> ";
            apdVal += "                                     <div class='vsl_bar'> ";
            apdVal += "                                         <div class='bar_percent per" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "'></div> ";
            apdVal += "                                     </div> ";
            apdVal += "                                 </div> ";
            apdVal += "                             </div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>양하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_COMPLETED), "sum") + "/" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].DISCHARGE_COMPLETED), parseInt(CntrJson[i].DISCHARGE_TOTAL)) + "%</span></p> ";
            apdVal += "                             </div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>적하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_COMPLETED), "sum") + " / " + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].LOADING_COMPLETED), parseInt(CntrJson[i].LOADING_TOTAL)) + "%</span></p> ";
            apdVal += "                             </div> ";
            apdVal += "                             <div class='w2'> ";
            apdVal += "                                 <p class='title'>합계</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), "sum") + " / " + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL)), "sum") + " <span class='per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span></p> ";
            apdVal += "                             </div> ";
            apdVal += "                         </div> ";
            apdVal += "                     </div> ";
            apdVal += "                 </div> ";
            apdVal += "                 <div class='flex_type3 mo'> ";
            apdVal += "                     <div class='flex_box long'> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>" + _fnToNull(CntrJson[i].TRMN_NM) + "(" + _fnToNull(CntrJson[i].VSL_REF) + "</p> ";
            apdVal += "                                 <p>선석 " + _fnToNull(CntrJson[i].TRMN_BERTH);
            if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "양호") {
                apdVal += "<span class='cong_level green'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "보통") {
                apdVal += "<span class='cong_level yellow'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            } else if (_fnToNull(CntrJson[i].TRMN_CONGEST_STAT) == "혼잡") {
                apdVal += "<span class='cong_level red'>" + _fnToNull(CntrJson[i].TRMN_CONGEST_STAT) + "</span> ";
            }
            apdVal += "                         </p></div> ";
            apdVal += "                         <div class='flex_inner real_flex'> ";
            apdVal += "                             <div class='vsl_info'> ";
            apdVal += "                                     <span class='vsl_nm'>" + _fnToNull(CntrJson[i].VSL_ORG_NM) + "</span> ";
            apdVal += "                                     <span class='vsl_per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span> ";
            apdVal += "                                     <div class='vsl_bar'> ";
            apdVal += "                                         <div class='bar_percent per" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "'></div> ";
            apdVal += "                                 </div> ";
            apdVal += "                             </div> ";
            apdVal += "                         </div> ";
            apdVal += "                     </div> ";
            apdVal += "                     <div class='flex_box'> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>작업 시작시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].START_YMD)) + " " + _fnDateFormat(CntrJson[i].START_HM) + "</p> ";
            apdVal += "                         </div> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>작업 종료(예상) 시간</p> ";
            apdVal += "                             <p class='desc'>-</p> ";
            apdVal += "                         </div> ";
            apdVal += "                     </div> ";
            apdVal += "                     <div class='flex_box'> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>출항(예정) 시간</p> ";
            apdVal += "                                 <p class='desc'>" + _fnDateFormat(_fnToNull(CntrJson[i].ATD_YMD)) + " " + _fnDateFormat(_fnToNull(CntrJson[i].ATD_HM)) + "</p> ";
            apdVal += "                         </div> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>양하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_COMPLETED), "sum") + "/" + _fnGetNumber(_fnToZero(CntrJson[i].DISCHARGE_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].DISCHARGE_COMPLETED), parseInt(CntrJson[i].DISCHARGE_TOTAL)) + "%</span></p> ";
            apdVal += "                         </div> ";
            apdVal += "                     </div> ";
            apdVal += "                     <div class='flex_box'> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>적하</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_COMPLETED), "sum") + " / " + _fnGetNumber(_fnToZero(CntrJson[i].LOADING_TOTAL), "sum") + " <span class='loading_per'>" + CalPercent(parseInt(CntrJson[i].LOADING_COMPLETED), parseInt(CntrJson[i].LOADING_TOTAL)) + "%</span></p> ";
            apdVal += "                         </div> ";
            apdVal += "                         <div class='flex_inner'> ";
            apdVal += "                             <p class='title'>합계</p> ";
            apdVal += "                                 <p class='desc'>" + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), "sum") + " / " + _fnGetNumber((parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL)), "sum") + " <span class='per'>" + CalPercent((parseInt(CntrJson[i].DISCHARGE_COMPLETED) + parseInt(CntrJson[i].LOADING_COMPLETED)), (parseInt(CntrJson[i].DISCHARGE_TOTAL) + parseInt(CntrJson[i].LOADING_TOTAL))) + "%</span></p> ";
            apdVal += "                         </div> ";
            apdVal += "                     </div> ";
            apdVal += "                 </div> ";
            apdVal += "             </div>";
        });
        $("#Cntr_list").append(apdVal);
        $("#Paging_List_Area").show();
        fnPaging(CntrJson[0]["TOTCNT"], 7, 5, pageIndex);
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
        $("#Cntr_list").append(apdVal);
        $("#Paging_List_Area").hide();
    }

}

function CalPercent(completeCnt, TotalCnt) {
    var percent = Math.ceil(completeCnt / TotalCnt * 100);
    if (isNaN(percent)) percent = 0;
    return percent;
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

function goPage(pageIndex) {
    fnSearchContainer(pageIndex);
}
/////////////////////API///////////////////////////////////////