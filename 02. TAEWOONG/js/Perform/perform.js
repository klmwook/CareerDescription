////////////////////전역 변수//////////////////////////
var _vThis = "";
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#Perform .inner").addClass("on");
        fnInitAutoComplete();
    }
});

//거래처 글자 길이가 길면 생기는 버튼 체크 로직
$(window).resize(function () {
    fnSetPlusBtn();
});

$(document).on("click", "#btn_deleteCust", function () {
    $("#input_CUST_CD").val("");
});

//거래처 Keyup 이벤트
$(document).on("keyup", "#input_CUST_NM", function (e) {

    if ($(this).val().length == 0) {
        $("#input_CUST_CD").val("");
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_CUST_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetCustData($("#input_CUST_NM").val().toUpperCase());
            if (result != undefined) {
                result = JSON.parse(result).Cust
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
                $("#input_CUST_NM").val(ui.item.value);
                $("#input_CUST_CD").val(ui.item.code);
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

//Focus Out 시 autoComplete가 선택이 되지 않았다면 선택하라고 밸리데이션을 보내주기
$(document).on("focusout", "#input_CUST_NM", function () {
    if ($(this).val().length != 0) {
        if (_fnToNull($("#input_CUST_CD").val()) == "") {
            $(this).val("");
            _fnAlertMsg("거래처를 선택 해 주세요.", "input_CUST_NM");
            return false;
        }
    }
});

//검색 버튼 
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
});

//자세히 보기
$(document).on("click", ".btns.open", function () {
    $(this).closest('.customer-hbl').find('.result-tbl__hidden').slideToggle();
    $(this).toggleClass('on');
});

//미마감 버튼
$(document).on("click", ".btns.unfinished", function () {
    $(this).addClass('hide');
    $(this).siblings('.perform-radio').addClass('show');
});

//마감 버튼 클릭 시 확인 레이어 팝업 보여주기
$(document).on("click", ".btn_End", function () {
    if (!$(this).hasClass("on")) {
        _vThis = this;
        layerPopup2("#layer_End");
    }
});

//레이어 팝업 마감 버튼 확인 이벤트 
$(document).on("click", "#btn_End_Confirm", function () {
    var vHBL_NO = $(_vThis).siblings("input[name='input_HBL_NO']").val();
    var vCLOSE_YN = $(_vThis).siblings("input[name='input_CLOSE_YN']").val();
    var vCLOSE_FLAG = $(_vThis).siblings("input[name='input_CLOSE_FLAG']").val();
    var vCLOSE = "";
    
    if (vCLOSE_YN == "N" && vCLOSE_FLAG == "") {
        vCLOSE = "미마감";
    }
    else if (vCLOSE_YN == "Y" && vCLOSE_FLAG == "YYYY") {
        vCLOSE = "마감";
    }
    else if (vCLOSE_YN == "N" && vCLOSE_FLAG == "NNNN") {
        vCLOSE = "마감취소";
    } else {
        vCLOSE = "마감취소";
    }
    
    $(_vThis).siblings("input[type=radio]").removeClass("on");
    $(_vThis).addClass("on");
    
    fnSetEndStatus(vHBL_NO, vCLOSE);
    _vThis = "";
});

//레이어 팝업 마감 버튼 취소 이벤트 
$(document).on("click", "#btn_End_Cancel", function () {

    $("input[value='" + $(_vThis).siblings("input[name='input_HBL_NO']").val() + "']").siblings(".btn_End").removeClass("on");
    $("input[value='" + $(_vThis).siblings("input[name='input_HBL_NO']").val() + "']").siblings(".btn_EndCancel").addClass("on").prop("checked", true);
    _vThis = "";
    layerClose('#layer_End');
});

//마감 취소 버튼
$(document).on("click", ".btn_EndCancel", function () {

    if (!$(this).hasClass("on")) {
        _vThis = this;
        layerPopup2("#layer_EndCancel");
    }
});

//레이어 팝업 마감취소 버튼 확인 이벤트 
$(document).on("click", "#btn_EndCancel_Confirm", function () {
    var vHBL_NO = $(_vThis).siblings("input[name='input_HBL_NO']").val();
    var vCLOSE_YN = $(_vThis).siblings("input[name='input_CLOSE_YN']").val();
    var vCLOSE_FLAG = $(_vThis).siblings("input[name='input_CLOSE_FLAG']").val();
    var vCLOSE = "";

    if (vCLOSE_YN == "N" && vCLOSE_FLAG == "") {
        vCLOSE = "미마감";
    }
    else if (vCLOSE_YN == "Y" && vCLOSE_FLAG == "YYYY") {
        vCLOSE = "마감";
    }
    else if (vCLOSE_YN == "N" && vCLOSE_FLAG == "NNNN") {
        vCLOSE = "마감취소";
    } else {
        vCLOSE = "마감취소";
    }

    if (vCLOSE_YN != "Y") {
        $(_vThis).prop("checked", false);
        _fnAlertMsg("미마감된 자료가 존재합니다.");
    } else {
        $(_vThis).siblings("input[type=radio]").removeClass("on");
        $(_vThis).addClass("on");

        fnSetEndCanCelStatus(vHBL_NO, vCLOSE);
    }
    _vThis = "";
});

//레이어 팝업 마감취소 버튼 취소 이벤트
$(document).on("click", "#btn_EndCancel_Cancel", function () {
    $("input[value='" + $(_vThis).siblings("input[name='input_HBL_NO']").val() + "']").siblings(".btn_EndCancel").removeClass("on");
    $("input[value='" + $(_vThis).siblings("input[name='input_HBL_NO']").val() + "']").siblings(".btn_End").addClass("on").prop("checked", true);
    _vThis = "";
    layerClose('#layer_EndCancel');
});

////////////////////////function///////////////////////
//자동완성 초기화
function fnInitAutoComplete() {
    try {
        $("#input_CUST_NM").autocomplete({
            minLength: 1,
            source: function (request, response) {
                var result = undefined;
                if (result != undefined) {
                    result = JSON.parse(result).Country
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
            }
        });
    }
    catch (err) {
        console.log("[Error - fnInitAutoComplete]" + err.message);
    }
}

//거래처 정보 가져오는 함수
function fnGetCustData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.CUST = vValue;
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Perform/fnGetCust",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                rtnJson = result;
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return rtnJson;
    } catch (e) {
        console.log(e.message);
    }
}

//거래처 조회 함수
function fnSearchData() {
    try {

        //단일 건 조회
        if (_fnToNull($("#input_CUST_CD").val()) == "" && _fnToNull($("#input_HBL_NO").val()) == "") {
            _fnAlertMsg("거래처 혹은 HBL NO를 입력 해 주세요.");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.CUST_NM = _fnToNull($("#input_CUST_NM").val());
        objJsonData.CUST_CD = _fnToNull($("#input_CUST_CD").val());
        objJsonData.HBL_NO = _fnToNull($("#input_HBL_NO").val());
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.USR_AUTH = _fnToNull($("#Session_AUTH_TYPE").val().replace(/ /gi, ""));
        objJsonData.END_STATUS = $("#select_status").find("option:selected").val();

        $.ajax({
            type: "POST",
            url: "/Perform/fnSearchData",
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

//거래처 네이밍 버튼 세팅
function fnSetPlusBtn() {
    try {
        var vDataLength = $("#Perform_Result .result-box").length;

        for (i = 0; i < vDataLength; i++) {
            if ($("#Perform_Result .result-box").eq(i).find(".result-type1").prop('scrollHeight') < 64) {
                $("#Perform_Result .result-box").eq(i).find(".result-type1").addClass('no_button');
                $("#Perform_Result .result-box").eq(i).find(".result-type1").removeClass('on');
                $("#Perform_Result .result-box").eq(i).find(".btns.plus").hide();
                $("#Perform_Result .result-box").eq(i).find(".btns.plus").removeClass("on");
            } else {
                $("#Perform_Result .result-box").eq(i).find(".result-type1").removeClass('no_button');
                $("#Perform_Result .result-box").eq(i).find(".btns.plus").show();
            }
        }

    }
    catch (err) {
        console.log("[Error - fnSetPlusBtn]" + err.message);
    }
}

//실적 마감 함수
function fnSetEndStatus(vHBL_NO,vCLOSE) {
    try {
        layerClose('#layer_End');

        var objJsonData = new Object();

        objJsonData.HBL_NO = vHBL_NO;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.NOW_DATE = _fnPlusDate(0).replace(/-/gi, "");

        $.ajax({
            type: "POST",
            url: "/Perform/fnSetEndStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y")
                {
                    $("input[value='" + vHBL_NO + "']").siblings("input[name='input_CLOSE_YN']").val("Y");
                    $("input[value='" + vHBL_NO + "']").siblings("input[name='input_CLOSE_FLAG']").val("YYYY");
                    _fnAlertMsg("마감 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") 
                {
                    if (vCLOSE == "미마감") {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").removeClass("on").prop("checked", false);
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").removeClass("on").prop("checked", false);
                    } else if (vCLOSE == "마감취소") {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").removeClass("on");
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").addClass("on").prop("checked", true);
                    } else {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").removeClass("on");
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").addClass("on").prop("checked", true);
                    }
                    
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E")
                {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnSetEndStatus]" + err.message);
    }
}

//실적 마감 취소 함수
function fnSetEndCanCelStatus(vHBL_NO, vCLOSE) {
    try {
        //_fnAlertMsg("실적 마감 취소 함수");
        layerClose('#layer_EndCancel');

        var objJsonData = new Object();

        objJsonData.HBL_NO = vHBL_NO;
        objJsonData.USR_ID = _fnToNull($("#Session_USR_ID").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Perform/fnSetEndCanCelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y")
                {
                    $("input[value='" + vHBL_NO + "']").siblings("input[name='input_CLOSE_YN']").val("N");
                    $("input[value='" + vHBL_NO + "']").siblings("input[name='input_CLOSE_FLAG']").val("NNNN");
                    _fnAlertMsg("마감 취소 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {

                    if (vCLOSE == "미마감") {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").removeClass("on").prop("checked", false);
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").removeClass("on").prop("checked", false);
                    } else if (vCLOSE == "마감") {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").removeClass("on");
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").addClass("on").prop("checked", true);
                    } else {
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_EndCancel").removeClass("on");
                        $("input[value='" + vHBL_NO + "']").siblings(".btn_End").addClass("on").prop("checked", true);
                    }
                    
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnSetEndCanCelStatus]" + err.message);
    }
}


/////////////////function MakeList/////////////////////
//검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).PerForm;

            vHTML += "   <div class=\"result-box\"> ";
            vHTML += "   	<div class=\"result-title\"> ";
            vHTML += "   		<h3 class=\"result-type1\">" + _fnToNull(vResult[0]["CUST_NM"]) + "</h3> ";
            vHTML += "   		<button type=\"button\" class=\"btns plus\"></button> ";
            vHTML += "   	</div> ";

            $.each(vResult, function (i) {

                vHTML += "   	<div class=\"result-customer__detail\">				 ";
                vHTML += "   		<div class=\"customer-hbl\"> ";
                vHTML += "   			<h4 class=\"customer-hbl__title\">" + _fnToNull(vResult[i]["HBL_NO"]) + "</h4> ";

                console.log("HBL_NO : " + _fnToNull(vResult[i]["HBL_NO"]));
                console.log("STATUS : " + _fnToNull(vResult[i]["PERF_STATUS"]));
                console.log("MSG : " + _fnToNull(vResult[i]["PERF_STATUS_MSG"]));
                console.log("-------------------------------------------------------------------------------------------");

                //미마감 / 마감 / 마감취소 세팅
                if (_fnToNull(vResult[i]["CLOSE_YN"]) == "N" && _fnToNull(vResult[i]["CLOSE_FLAG"]) == "") { //미마감
                    vHTML += "   			<button type=\"button\" class=\"btns unfinished\">미마감</button> ";
                    vHTML += "   			<div class=\"perform-radio\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_YN\" value=\"" + _fnToNull(vResult[i]["CLOSE_YN"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_FLAG\" value=\"" + _fnToNull(vResult[i]["CLOSE_FLAG"]) + "\"> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" class=\"btn_End\" /> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" class=\"btn_EndCancel\"/> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    vHTML += "   			</div> ";
                }
                else if (_fnToNull(vResult[i]["CLOSE_YN"]) == "Y" && _fnToNull(vResult[i]["CLOSE_FLAG"]) == "YYYY") { //마감
                    vHTML += "   			<button type=\"button\" class=\"btns unfinished hide\">미마감</button> ";
                    vHTML += "   			<div class=\"perform-radio show\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_YN\" value=\"" + _fnToNull(vResult[i]["CLOSE_YN"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_FLAG\" value=\"" + _fnToNull(vResult[i]["CLOSE_FLAG"]) + "\"> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" class=\"btn_End on\" checked=\"checked\" /> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" class=\"btn_EndCancel\" /> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    vHTML += "   			</div> ";
                }
                else if (_fnToNull(vResult[i]["CLOSE_YN"]) == "N" && _fnToNull(vResult[i]["CLOSE_FLAG"]) == "NNNN") { //마감취소
                    vHTML += "   			<button type=\"button\" class=\"btns unfinished hide\">미마감</button> ";
                    vHTML += "   			<div class=\"perform-radio show\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_YN\" value=\"" + _fnToNull(vResult[i]["CLOSE_YN"]) + "\"> ";
                    vHTML += "   				<input type=\"hidden\" name=\"input_CLOSE_FLAG\" value=\"" + _fnToNull(vResult[i]["CLOSE_FLAG"]) + "\"> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" class=\"btn_End\" /> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                    vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" class=\"btn_EndCancel on\" checked=\"checked\" /> ";
                    vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    vHTML += "   			</div> ";
                } else { //플래그가 맞지 않으면 예외처리
                    vHTML += "   			<button type=\"button\" class=\"btns unfinished hide\">미마감</button> ";
                    vHTML += "   			<div class=\"perform-radio disabled show\"> ";

                    if (_fnToNull(vResult[i]["CLOSE_YN"]) == "Y") //마감
                    {
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" checked=\"checked\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    }
                    else if (_fnToNull(vResult[i]["CLOSE_YN"]) == "N") //마감 취소
                    {
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" checked=\"checked\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    }
                    else {
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio" + i + "\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio" + i + "\">마감</label> ";
                        vHTML += "   				<input type=\"radio\" name=\"perform" + i + "\" id=\"perform-radio2" + i + "\" disabled /> ";
                        vHTML += "   				<label class=\"perform-radio__button\" for=\"perform-radio2" + i + "\">마감취소</label> ";
                    }

                    vHTML += "   			</div> ";
                }

                vHTML += "   			<div class=\"result-tbl\"> ";
                vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>MBL</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["MBL_NO"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>HBL</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["HBL_NO"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__bundle\"> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>POL</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["POL_CD"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>POD</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["POD_CD"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__hidden\"> ";
                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>국내매출</p></div> ";

                if (_fnToZero(vResult[i]["TTL_SELL_LAMT"]) != 0) {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["TTL_SELL_LAMT"]) + "</p></div> ";
                } else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["TTL_SELL_LAMT"]) + "</p></div> ";
                }
                
                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>국내매입</p></div> ";

                if (_fnToZero(vResult[i]["TTL_BUY_LAMT"]) != 0) {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["TTL_BUY_LAMT"]) + "</p></div> ";
                }
                else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["TTL_BUY_LAMT"]) + "</p></div> ";
                }
                
                vHTML += "   						</div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>Debit</p></div> ";

                if (_fnToZero(vResult[i]["TTL_DR_LAMT"]) != 0) {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["TTL_DR_LAMT"]) + "</p></div> ";
                }
                else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["TTL_DR_LAMT"]) + "</p></div> ";
                }

                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>Credit</p></div> ";

                if (_fnToZero(vResult[i]["TTL_CR_LAMT"]) != 0) {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["TTL_CR_LAMT"]) + "</p></div> ";
                }
                else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["TTL_CR_LAMT"]) + "</p></div> ";
                }

                vHTML += "   						</div> ";
                vHTML += "   					</div> ";

                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>실적일자</p></div> ";
                if (_fnToNull(vResult[i]["PERF_YMD"]) != "") {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["PERF_YMD"])) + "</p></div> ";
                } else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p></p></div> ";
                }
                
                vHTML += "   					</div> ";

                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>Share 영업사원</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["SALES_NM2"]) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>Share 팀명</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["SALES_DEPT2"]) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>Share 금액</p></div> ";

                if (_fnToZero(vResult[i]["PERF_SHARE_LOC_AMT_KRW"]) != 0) {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["PERF_SHARE_LOC_AMT_KRW"]) + " (KRW)</p></div> ";
                }
                else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["PERF_SHARE_LOC_AMT_KRW"]) + "</p></div> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>Share 금액</p></div> ";

                if (_fnToZero(vResult[i]["PERF_SHARE_LOC_AMT_USD"]) != 0) {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p>" + fnPriceComma(vResult[i]["PERF_SHARE_LOC_AMT_USD"]) + " (USD)</p></div> ";
                }
                else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToZero(vResult[i]["PERF_SHARE_LOC_AMT_USD"]) + "</p></div> ";
                }
                
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>최종실적금액</p></div> ";

                if (_fnToZero(vResult[i]["TTL_PERF_TLAMT_KRW"]) != 0) {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p class=\"red\">" + fnPriceComma(vResult[i]["TTL_PERF_TLAMT_KRW"]) + " (KRW)</p></div> ";
                }
                else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p class=\"red\">" + _fnToZero(vResult[i]["TTL_PERF_TLAMT_KRW"]) + "</p></div> ";
                }

                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>최종실적금액</p></div> ";

                if (_fnToZero(vResult[i]["TTL_PERF_TLAMT_USD"]) != 0) {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p class=\"red\">" + fnPriceComma(vResult[i]["TTL_PERF_TLAMT_USD"]) + " (USD)</p></div> ";
                }
                else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p class=\"red\">" + _fnToZero(vResult[i]["TTL_PERF_TLAMT_USD"]) + "</p></div> ";
                }
                
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-tbl__button\"> ";
                vHTML += "   				<button type=\"button\" class=\"btns open\"><span class=\"hidden\">펼치기</span></button> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
            });

            vHTML += "   </div> ";

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

        $("#Perform_Result")[0].innerHTML = vHTML;
        fnSetPlusBtn();
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}
////////////////////////API////////////////////////////


