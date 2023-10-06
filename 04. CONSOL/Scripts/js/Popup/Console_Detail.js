////////////////////전역 변수//////////////////////////
//테스트 데이터
//var _DetailMngtNo = "MOW21072212";
//var _DetailMngtNo = "DXB21121506";
//var _DetailSeq = "1";

////////////////////jquery event///////////////////////
$(function () {
    fnLayer_Console_Detail();
});

////////////////////////function///////////////////////
function fnLayer_Console_Detail() {
    try {
        var objJsonData = new Object();

        objJsonData.BK_NO = _fnToNull(_DetailMngtNo);
        objJsonData.BK_SEQ = _fnToNull(_DetailSeq);
        objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());
        objJsonData.CUST_CD = _fnToNull($("#Session_CUST_CD").val());        

        $.ajax({
            type: "POST",
            url: "/Popup/fnGetLayerConsoleDetail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeLayerConsole(result);
                fnMakeLayerConsoleDetail(result);
            }, error: function (xhr, status, error) {
                alert("담당자에게 문의 하세요.");
                console.log(error);
                vReturn = false;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnLayer_Console_Detail]"+err.message);
    }
}


/////////////////function MakeList/////////////////////
//콘솔 상세 조회
function fnMakeLayerConsole(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Console;

            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">입고일자</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + String(_fnToNull(vResult[0]["GR_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">입고번호</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + _fnToNull(vResult[0]["GR_NO"]) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">실화주</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + _fnToNull(vResult[0]["ACT_CUST_NM"]) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">품명</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + _fnToNull(vResult[0]["SKU_NM"]) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">도착지</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + _fnToNull(vResult[0]["POD_CD"]) + "<br/>" + _fnToNull(vResult[0]["POD_NM"]) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">MARK</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + _fnToNull(vResult[0]["MARK"]) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">수량</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + fnSetComma(_fnToNull(vResult[0]["ACT_QTY"])) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">중량</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + fnSetComma(_fnToNull(vResult[0]["ACT_GRS_WGT"])) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";
            vHTML += "   <li class=\"item col-sm-6 col-12\"> ";
            vHTML += "   	<div class=\"text-box row\"> ";
            vHTML += "   		<span class=\"tit col-md-4 col-12\">용적</span> ";
            vHTML += "   		<span class=\"des col-md col-12\">" + fnSetComma(_fnToNull(vResult[0]["ACT_MSRMT"])) + "</span> ";
            vHTML += "   	</div> ";
            vHTML += "   </li> ";

            $("#Layer_Console_Info")[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            magnificPopup.close();
            alert("상세 데이터가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            magnificPopup.close();
            alert("데이터를 가져 올 수 없습니다. \n관리자에게 문의하세요.");
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerConsole]" + err.message);
    }
}

//콘솔 상세 조회 디테일
function fnMakeLayerConsoleDetail(vJsonData) {
    try {

        var vHTML = "";
        var vResult = JSON.parse(vJsonData).DeTail;

        if (JSON.parse(vJsonData).DeTail != undefined) {

            vHTML = "";

            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td class=\"txt\">" + _fnToNull(vResult[i]["GR_NO"]) + "</td> ";
                vHTML += "   	<td class=\"txt\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_W"])) + "</td> ";
                vHTML += "   	<td class=\"txt\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_D"])) + "</td> ";
                vHTML += "   	<td class=\"txt\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_H"])) + "</td> ";
                vHTML += "   	<td class=\"txt\">" + fnSetComma(_fnToNull(vResult[i]["QTY"])) + "</td> ";
                vHTML += "   	<td class=\"txt\">" + fnSetComma(_fnToNull(vResult[i]["MSRMT"])) + "</td> ";
                vHTML += "   </tr> ";
            });

            $("#PC_Layer_Console_Detail")[0].innerHTML = vHTML;

            vHTML = "";

            $.each(vResult, function (i) {
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">입고번호</p> ";
                vHTML += "   	<p class=\"des\">" + _fnToNull(vResult[i]["GR_NO"]) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">가로</p> ";
                vHTML += "   	<p class=\"des\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_W"])) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">세로</p> ";
                vHTML += "   	<p class=\"des\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_D"])) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">높이</p> ";
                vHTML += "   	<p class=\"des\">" + fnSetComma(_fnToNull(vResult[i]["SIZE_H"])) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">수량</p> ";
                vHTML += "   	<p class=\"des\">" + fnSetComma(_fnToNull(vResult[i]["QTY"])) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">용적</p> ";
                vHTML += "   	<p class=\"des\">" + fnSetComma(_fnToNull(vResult[i]["MSRMT"])) + "</p> ";
                vHTML += "   </li> ";
            });

            $("#MO_Layer_Console_Detail")[0].innerHTML = vHTML;
        } else {
            vHTML = "";

            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"6\" class=\"no-data\">데이터가 없습니다.</td> ";
            vHTML += "   </tr> ";

            $("#PC_Layer_Console_Detail")[0].innerHTML = vHTML;

            vHTML = "";

            vHTML += "   <li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></li> ";

            $("#MO_Layer_Console_Detail")[0].innerHTML = vHTML;
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerConsoleDetail]" + err.message);
    }
}