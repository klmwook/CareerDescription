////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {

    //로그인 하지 않고 들어왔을때
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        location.href = window.location.origin;
    }

    $('#lnb > li.sub_dash > a').addClass("on");
    $('.h_type2 .icon_menu li:nth-child(2) > a').addClass("on");
});

//조회 버튼 이벤트
$(document).on("click", "#btn_search", function () {
    fnSearchData(1);
});

//조회 버튼 엔터 이벤트
$(document).on("keyup", "#input_LineBK", function (e) {
    if (e.keyCode == 13 ) {
        fnSearchData(1);
    }
});

/////////////////////function///////////////////////////////////
function fnSearchData(vPage) {
    try {

        if (_fnToNull($("#input_LineBK").val().replace(/ /gi, "")) == "") {
            _fnAlertMsg("Line B/K No를 입력 해 주세요.");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.LINE_BKG_NO = $("#input_LineBK").val().replace(/ /gi, "");
        objJsonData.PAGE = vPage;

        $.ajax({
            type: "POST",
            url: "/DashBoard/fnGetDashBoardData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                $("#no_search").hide();
                $("#no_data").hide();
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnMakeSearchData(result);
                    fnPaging(JSON.parse(result).DashBoard[0]["TOTCNT"], 7, 5, objJsonData.PAGE);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    $("#Dashboard_ResultArea").empty();
                    $("#no_data").show();
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
        console.log("[Error - fnSearchData]" + err.message)
    }
}

function goPage(pageIndex) {
    fnSearchData(pageIndex);
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

//////////////////////function makelist////////////////////////
//검색 된 데이터 만들어서 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).DashBoard;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"dashboard\"> ";
                vHTML += "   	<div class=\"flex_type5 height100\"> ";
                vHTML += "   		<div class=\"flex_box\"> ";
                vHTML += "   			<div class=\"flex_line w3\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";                

                if (_fnToNull(vResult[i]["LINE_PATH"]) == "") {
                    vHTML += "   						<img src=\"/images/no_data_bg04.png\" /> ";
                } else {
                    vHTML += "   						<img src=\"" + _fnToNull(vResult[i]["LINE_PATH"]) + "\" /> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"flex_line w1\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title\">CUSTOMER</p> ";

                if (_fnToNull(vResult[i]["BK_CUST_NM"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["BK_CUST_NM"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell has_line\"> ";
                vHTML += "   						<p class=\"title\">CNTR NO.</p> ";

                if (_fnToNull(vResult[i]["CNTR_NO"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["CNTR_NO"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"flex_line w1\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title\">M B/L No.</p> ";

                if (_fnToNull(vResult[i]["MBL_NO"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["MBL_NO"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell has_line\"> ";
                vHTML += "   						<p class=\"title\">H B/L No.</p> ";

                if (_fnToNull(vResult[i]["HBL_NO"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["HBL_NO"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"flex_line w1\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title\">POL</p> ";

                if (_fnToNull(vResult[i]["POL_NM"]) == "") {                    
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["POL_CD"]) + "</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["POL_NM"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell has_line\"> ";
                vHTML += "   						<p class=\"title\">POD</p> ";

                if (_fnToNull(vResult[i]["POD_NM"]) == "") {
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["POD_CD"]) + "</p> ";                    
                } else {                                                                              
                    vHTML += "   						<p class=\"desc\">" + _fnToNull(vResult[i]["POD_NM"]) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"flex_line w1\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title\">ETD</p> ";

                if (_fnToNull(vResult[i]["ETD"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnFormatDotDate(_fnToNull(vResult[i]["ETD"])) + "</p> ";
                }
                
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell has_line\"> ";
                vHTML += "   						<p class=\"title\">ETA</p> ";

                if (_fnToNull(vResult[i]["ETA"]) == "") {
                    vHTML += "   						<p class=\"desc\">&nbsp;</p> ";
                } else {
                    vHTML += "   						<p class=\"desc\">" + _fnFormatDotDate(_fnToNull(vResult[i]["ETA"])) + "</p> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"flex_line w2\"> ";
                vHTML += "   				<div class=\"flex_row\"> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title02\">BOOKING</p> ";

                if (_fnToNull(vResult[i]["BK_STATUS"]) == "Y") {
                    vHTML += "   						<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["BK_RECV_YMD"])) + "</p> ";
                    vHTML += "   						<div class=\"dash_status green\"></div> ";
                }
                else if (_fnToNull(vResult[i]["BK_STATUS"]) == "D") {
                    vHTML += "   						<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["BK_RECV_YMD"])) + "</p> ";
                    vHTML += "   						<div class=\"dash_status red\"></div> ";
                }
                else if (_fnToNull(vResult[i]["BK_STATUS"]) == "N") {
                    vHTML += "   						<div class=\"dash_status gray\"></div> ";
                }
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title02\">S/R</p> ";

                if (_fnToNull(vResult[i]["SR_STATUS"]) == "Y") {
                    vHTML += "   						<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["SR_SEND_YMD"])) + "</p> ";
                    vHTML += "   						<div class=\"dash_status green\"></div> ";
                }
                else if (_fnToNull(vResult[i]["SR_STATUS"]) == "N") {
                    vHTML += "   						<div class=\"dash_status gray\"></div> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title02\">INVOICE</p> ";

                if (_fnToNull(vResult[i]["INV_STATUS"]) == "Y") {
                    vHTML += "   						<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["INV_RECV_YMD"])) + "</p> ";
                    vHTML += "   						<div class=\"dash_status green\"></div> ";
                }
                else if (_fnToNull(vResult[i]["INV_STATUS"]) == "N") {
                    vHTML += "   						<div class=\"dash_status gray\"></div> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"flex_cell\"> ";
                vHTML += "   						<p class=\"title02\">컨테이너반입</p> ";

                _fnFormatTime
                if (_fnToNull(vResult[i]["CNTR_STATUS"]) == "Y") {
                    if (_fnToNull(vResult[i]["LOC_GATE_IN_HM"]).length == "6") {
                        vHTML += "   				<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["LOC_GATE_IN_YMD"])) + "<br />" + _fnFormatTime(_fnToNull(vResult[i]["LOC_GATE_IN_HM"]).substring("0","4")) + "</p> ";
                    }
                    else {
                        vHTML += "   				<p class=\"desc02\">" + _fnFormatDotDate(_fnToNull(vResult[i]["LOC_GATE_IN_YMD"])) + "<br />" + _fnFormatTime(_fnToNull(vResult[i]["LOC_GATE_IN_HM"])) + "</p> ";
                    }
                    vHTML += "   				<div class=\"dash_status green\"></div> ";
                }
                else if (_fnToNull(vResult[i]["CNTR_STATUS"]) == "N") {
                    vHTML += "   						<div class=\"dash_status gray\"></div> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            });

            $("#Dashboard_ResultArea")[0].innerHTML = vHTML;

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("담당자에게 문의하세요.");
            console.log("[Error - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message)
    }
}


/////////////////////API///////////////////////////////////////