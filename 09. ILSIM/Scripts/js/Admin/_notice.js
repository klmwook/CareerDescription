$(function () {

        $('.location .depth').css("background-color", '#0D8DBC');
        $('.location .depth .sub_list').css("background-color", '#0D8DBC');
    
    goSearch();

    $("._btn_write").on('click', function (e) {
        location.href = "/Admin/NoticeWrite";
    });

    $("._search_btn").on('click', function (e) {
        _fnSearchData(1);
    });

    $("._select").on('change', function (e) {
        $("._search_btn").trigger('click');
    });
});

$(document).on("keydown", "#stx", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        $("._search_btn").trigger('click');
    }
});

function goView(pageID) {
    location.href = "/Admin/NoticeWrite?id=" + pageID;
}

function goPage(pageIndex) {
    _fnSearchData(pageIndex);
}

function goSearch() {
    _fnSearchData(1);
}

function _fnSearchData(pageIndex) {

    //var opt1 = $("#sf option:selected").val();
    var opt = $("#sfl option:selected").val();
    var txtVal = $("#stx").val();

    var rtnJson;
    var rtnVal;
    var callObj = new Object();

    callObj.Option = opt;
    //callObj.Type = opt1;
    callObj.SearchText = txtVal;
    callObj.Page = pageIndex;

    $.ajax({
        type: "POST",
        url: "/Admin/Notice_CallAjax",
        async: false,
        dataType: "json",
        data: callObj,
        success: function (result) {
            rtnVal = result;    //JSON.stringify(result);
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });

    $("#dataTbl > table").remove();

    var innerText = "";
    var innerPage = "";
    var totPageCnt;
    var maxPageCnt = 0;
    var nPage = 1;
    if (rtnVal == undefined) {
        innerText += "<table width='100%' class='table table-bordered'> ";
        innerText += "	<colgroup> ";
        innerText += "		<col width='10%' /> ";
        /*innerText += "		<col width='10%' /> ";*/
        innerText += "		<col width='*' /> ";
        /*innerText += "		<col width='10%' /> ";*/
        innerText += "		<col width='10%' /> ";
        innerText += "		<col width='15%' /> ";
        innerText += "	</colgroup> ";
        innerText += "	<thead> ";
        innerText += "		<tr> ";
        innerText += "			<th>번호</th> ";
        /*innerText += "			<th>구분</th> ";*/
        innerText += "			<th>제목</th> ";
        /*innerText += "			<th>조회수</th> ";*/
        innerText += "			<th>사용여부</th> ";
        innerText += "			<th>등록일</th> ";
        innerText += "		</tr> ";
        innerText += "	</thead> ";
        innerText += "<tbody> ";
        innerText += "<tr> ";
        innerText += "<td style='height:100px;text-align:center;vertical-align:middle;' colspan='5'>등록된 데이터가 없습니다</td>";
        innerText += "</tr> ";
        innerText += "</tbody> ";
        innerText += "</table> ";

        $(".paging > ul").remove();  

    } else {
        innerText += "<table width='100%' class='table table-bordered table-hover tb_style' id='data_table'> ";
        innerText += "	<colgroup> ";
        innerText += "		<col width='10%' /> ";
        /*innerText += "		<col width='10%' /> ";*/
        innerText += "		<col width='*' /> ";
        /*innerText += "		<col width='10%' /> ";*/
        innerText += "		<col width='10%' /> ";
        innerText += "		<col width='15%' /> ";
        innerText += "	</colgroup> ";
        innerText += "	<thead> ";
        innerText += "		<tr> ";
        innerText += "			<th>번호</th> ";
        /*innerText += "			<th>구분</th> ";*/
        innerText += "			<th>제목</th> ";
        /*innerText += "			<th>조회수</th> ";*/
        innerText += "			<th>사용여부</th> ";
        innerText += "			<th>등록일</th> ";
        innerText += "		</tr> ";
        innerText += "	</thead> ";
        innerText += "	<tbody> ";

        $(rtnVal).each(function (i) {
            totPageCnt = rtnVal[i].TOTCNT;
            maxPageCnt = maxPageCnt + 1;
            nPage = rtnVal[i].PAGE;

            if (rtnVal[i].NOTICE_YN == "y") {
                innerText += "<tr> ";
                innerText += "	<td>공지</td> ";
                //if (rtnVal[i].TYPE == 0) {
                //    innerText += "	<td>공지사항</td> ";
                //} else {
                //    innerText += "	<td>물류뉴스</td> ";
                //}
                innerText += "	<td class='ta_left'><a href='javascript:void(0);' onclick='goView(" + rtnVal[i].NOTICE_ID + ")' class='_btn_edit' data-val='" + rtnVal[i].NOTICE_ID + "'>" + rtnVal[i].TITLE + "</a></td> ";
                /*innerText += "	<td>" + rtnVal[i].CNT + "</td> ";*/
                if (rtnVal[i].USE_YN == "y") {
                    innerText += "	<td>사용</td> ";
                } else {
                    innerText += "	<td>미사용</td> ";
                }
                innerText += "	<td>" + rtnVal[i].REGDT + "</td> ";
                innerText += "</tr> ";
            } else {
                innerText += "<tr> ";
                innerText += "	<td>" + rtnVal[i].NUM + "</td> ";
                //if (rtnVal[i].TYPE == 0) {
                //    innerText += "	<td>공지사항</td> ";
                //} else {
                //    innerText += "	<td>물류뉴스</td> ";
                //}
                innerText += "	<td class='ta_left'><a href='javascript:void(0);' onclick='goView(" + rtnVal[i].NOTICE_ID + ")' class='_btn_edit' data-val='" + rtnVal[i].NOTICE_ID + "'>" + rtnVal[i].TITLE + "</a></td> ";
                /*innerText += "	<td>" + rtnVal[i].CNT + "</td> ";*/
                if (rtnVal[i].USE_YN == "y") {
                    innerText += "	<td>사용</td> ";
                } else {
                    innerText += "	<td>미사용</td> ";
                }
                innerText += "	<td>" + rtnVal[i].REGDT + "</td> ";
                innerText += "</tr> ";
            }
        });

        innerText += "		</tbody> ";
        innerText += "	</table> ";

        fnPaging(totPageCnt, 10, 5, pageIndex);
    }
    $("#dataTbl").append(innerText);
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

    $(".paging .pagination").remove();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var html = "";
    html += "<ul class='pagination'> ";
    html += "	<li><a href='javascript:void(0);' onclick='goPage(1)'><i class='fa fa-angle-double-left'></i><span class='sr-only'>처음페이지로 가기</span></a></li> ";
    html += "	<li><a href='javascript:void(0);' onclick='goPage(" + prevPage + ")'><i class='fa fa-angle-left'></i><span class='sr-only'>이전페이지로 가기</span></a></li> ";
    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            html += "		<li class='active'><a href='javascript:void(0);'>" + i + "</a></li> ";
        } else {
            html += "		<li><a href='javascript:void(0);' onclick='goPage(" + i + ")'>" + i + "</a></li> ";
        }
    }

    html += "	<li><a href='javascript:void(0);' onclick='goPage(" + nextPage + ")'><i class='fa fa-angle-right'></i><span class='sr-only'>다음페이지로 가기</span></a></li> ";
    html += "	<li><a href='javascript:void(0);' onclick='goPage(" + totalPage + ")'><i class='fa fa-angle-double-right'></i><span class='sr-only'>마지막페이지로 가기</span></a></li> ";
    html += "</ul> ";
    $(".paging").append(html);    // 페이지 목록 생성
}