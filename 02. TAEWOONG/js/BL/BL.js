////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {       

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#BL .inner").addClass("on");

        $("#input_DATE_START").val(fnSetPrevNextDate(_fnPlusDate(0), "Prev"));
        $("#input_DATE_END").val(fnSetPrevNextDate(_fnPlusDate(0), "Next"));

        if (_fnToNull($("#View_HBL_NO").val() != "")) {
            $("#input_HBL_NO").val($("#View_HBL_NO").val());
            fnSingleSearchData($("#View_HBL_NO").val());
        }
    }

});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_DATE_START", function () {
    var vValue = $("#input_DATE_START").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val($("#input_DATE_END").val());
        $(this).focus();
    }

    //날짜 벨리데이션 체크$
    var vETD = $("#input_DATE_START").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_DATE_END").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETD가 ETA 보다 빠를 수 없습니다. ");
        $("#input_DATE_START").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_DATE_END", function () {
    var vValue = $("#input_DATE_END").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val($("#input_DATE_START").val());
        $(this).focus();
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_DATE_START").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_DATE_END").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        _fnAlertMsg("ETA가 ETD 보다 빠를 수 없습니다. ");
        $("#input_DATE_END").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
    }
});

//거래처 X 박스 버튼 삭제 시 숨겨 놓은 CUST_CD 초기화 이벤트
$(document).on("click", "#btn_deleteCust", function () {
    $("#input_CUST_CD").val("");
});

//조회 버튼 이벤트
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
});

//PDF Viewer 이벤트
$(document).on("click", "button[name='layer_pdf_viewer']", function () {
    fnBLPrint($(this).siblings("input[name='PDF_MNGT_NO']").val(), $(this).siblings("input[name='PDF_DOC_TYPE']").val());
});
////////////////////////function///////////////////////
//단건 조회 버튼 이벤트
function fnSingleSearchData(vHBL_NO) {
    try {

        var objJsonData = new Object();

        objJsonData.MNGT_NO = vHBL_NO;
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/BL/fnSearchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSearchData(result);
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
        console.log("[Error - fnSearchData]" + err.message);
    }
}
//조회 버튼 이벤트
function fnSearchData() {
    try {

        if (_fnToNull($("#input_FILE_NO").val()) == "" && _fnToNull($("#input_HBL_NO").val()) == "" && _fnToNull($("#input_MBL_NO").val()) == "") {
            _fnAlertMsg("File No , HBL No , MBL No 중 하나를 입력 해 주세요.");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.MNGT_NO = "";
        objJsonData.DATE_START = _fnToNull($("#input_DATE_START").val().replace(/-/gi, ""));
        objJsonData.DATE_END = _fnToNull($("#input_DATE_END").val().replace(/-/gi, ""));
        objJsonData.FILE_NO = _fnToNull($("#input_FILE_NO").val().replace(/ /gi, ""));
        objJsonData.HBL_NO = _fnToNull($("#input_HBL_NO").val().replace(/ /gi, ""));
        objJsonData.MBL_NO = _fnToNull($("#input_MBL_NO").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/BL/fnSearchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSearchData(result);
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
        console.log("[Error - fnSearchData]" + err.message);
    }
}

//PDF 출력 함수
function fnBLPrint(vHBL, vDocType) {

    try {

        var vResult;
        vResult = fnGetBLPrintData(vHBL, vDocType); //BL 데이터 가져오기

        if (JSON.parse(vResult).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vResult).BL[0];

            var objJsonData = new Object();

            objJsonData.FILE_NM = vResult.FILE_NM;
            objJsonData.MNGT_NO = vResult.MNGT_NO;              //부킹 번호
            objJsonData.INS_USR = $("#Session_LOC_NM").val();   //부킹 번호
            objJsonData.DOMAIN = $("#Session_DOMAIN").val();    //접속 User
            objJsonData.SEQ = vResult.SEQ;

            $.ajax({
                type: "POST",
                url: "/File/DownloadElvis",
                async: false,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result, status, xhr) {

                    if (result != "E") {
                        var rtnTbl = JSON.parse(result);
                        rtnTbl = rtnTbl.Path;
                        var file_nm = rtnTbl[0].FILE_REAL_NAME;

                        if (_fnToNull(rtnTbl) != "") {
                            var agent = navigator.userAgent.toLowerCase();
                            if (file_nm.substring(file_nm.length, file_nm.length - 4) == ".pdf" || file_nm.substring(file_nm.length, file_nm.length - 4) == ".PDF") {
                                if (agent.indexOf('trident') > -1) {
                                    window.location = "/File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + file_nm;
                                } else {
                                    layerPopup2('#blPopup');
                                    $("#iframe_pdf_viewer").attr("src", "/web/viewer.html?file=/Content/TempFiles/" + file_nm);
                                }
                            } else {
                                window.location = "/File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + file_nm;
                            }
                        
                        }
                    } else {
                        _fnAlertMsg("다운받을 수 없는 출력물입니다");
                    }
                },
                error: function (xhr, status, error) {
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                    return;
                }
            });
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "N") {
            _fnAlertMsg("다운받을 수 없는 출력물입니다");
            console.log("[Fail]fnBLPrint" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vResult).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("다운받을 수 없는 출력물입니다");
            console.log("[Error]fnBLPrint" + JSON.parse(vResult).Result[0]["trxMsg"]);
        }

    } catch (err) {
        console.log("[Error]fnBLPrint" + err.message);
    }
}

//BL 출력 함수 데이터 가져오기
function fnGetBLPrintData(vHBL, vDocType) {

    try {
        var vResult;

        var objJsonData = new Object();
        objJsonData.HBL_NO = vHBL;
        objJsonData.DOC_TYPE = vDocType;

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/BL/fnGetBLPrint",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                vResult = result;
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error]fnGetBLPrintData" + err);
    }
}

//PDF_VIEWER 종료 시 초기화
function fniframeClose() {
    layerClose('#blPopup');
    $("#iframe_pdf_viewer").attr("src", "");
}
/////////////////function MakeList/////////////////////
//검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).BL;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"result-box\"> ";
                vHTML += "   	<div class=\"result-order\"> ";
                vHTML += "   		<div class=\"result-type2\"> ";
                vHTML += "   			<div class=\"result-type2__info\"> ";
                vHTML += "   				<div class=\"result-type2__title\"><p>File No</p></div> ";
                vHTML += "   				<div class=\"result-type2__desc\"><p>" + _fnToNull(vResult[i]["FILE_NO"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-type2__info\"> ";
                vHTML += "   				<div class=\"result-type2__title\"><p>HBL No</p></div> ";
                vHTML += "   				<div class=\"result-type2__desc\"><p>" + _fnToNull(vResult[i]["HBL_NO"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-type2__info\"> ";
                vHTML += "   				<div class=\"result-type2__title\"><p>MBL No</p></div> ";
                vHTML += "   				<div class=\"result-type2__desc\"><p>" + _fnToNull(vResult[i]["MBL_NO"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"result-detail\"> ";
                vHTML += "   			<div class=\"result-tbl\"> ";
                vHTML += "   				<div class=\"result-tbl__cont\"> ";
                vHTML += "   					<div class=\"result-tbl__title\"><p>SHPR</p></div> ";
                vHTML += "   					<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["SHP_NM"]) + "</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__cont\"> ";
                vHTML += "   					<div class=\"result-tbl__title\"><p>CNEE</p></div> ";
                vHTML += "   					<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["CNE_NM"]) + "</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>POL</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["POL_CD"]) + "</p></div> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>POD</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["POD_CD"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>ETD</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["ETD"])) + "</p></div> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>ETA</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["ETA"])) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-tbl__button\"> ";

                if (_fnToNull(vResult[i]["PDF_FILE"]) != "" ) {
                    vHTML += "   				<button type=\"button\" class=\"btns pdf\" name=\"layer_pdf_viewer\"><span>PDF</span>문서보기</button> ";
                    vHTML += "   				<input type=\"hidden\" name=\"PDF_MNGT_NO\" value=\"" + _fnToNull(vResult[i]["PDF_FILE"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"PDF_DOC_TYPE\" value=\"" + _fnToNull(vResult[i]["DOC_TYPE"]) + "\"> ";
                }
                else {
                    vHTML += "   				<button type=\"button\" class=\"btns pdf disabled\" disabled=\"disabled\"><span>PDF</span>문서보기</button> ";
                }
                
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            });

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>검색 결과가 없습니다.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>관리자에게 문의 하세요.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#BL_Result")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}
////////////////////////API////////////////////////////
