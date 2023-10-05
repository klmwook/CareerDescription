////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#Booking .inner").addClass("on");
        fnInitAutoComplete();

        //현재일 기준 저번달 첫일 , 다음달 말일 세팅
        $("#input_DATE_START").val(fnSetPrevNextDate(_fnPlusDate(0), "Prev"));
        $("#input_DATE_END").val(fnSetPrevNextDate(_fnPlusDate(0), "Next"));
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

//자세히 보기
$(document).on("click", ".btns.open", function () {
    $(this).closest('.result-detail').find('.result-tbl__hidden').slideToggle();
    $(this).toggleClass('on');
});

//거래처 X 박스 버튼 삭제 시 숨겨 놓은 CUST_CD 초기화 이벤트
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

//조회 버튼 이벤트
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
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
            url: "/Booking/fnGetCust",
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

//조회 버튼 이벤트
function fnSearchData() {
    try {

        if (_fnToNull($("#input_FILE_NO").val()) == "" && _fnToNull($("#input_BK_NO").val()) == "" && _fnToNull($("#input_CUST_CD").val()) == "") {
            _fnAlertMsg("File No , 선사부킹번호 , 거래처 중 하나를 입력 해 주세요.");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.DATE_START = _fnToNull($("#input_DATE_START").val().replace(/-/gi, ""));
        objJsonData.DATE_END = _fnToNull($("#input_DATE_END").val().replace(/-/gi, ""));
        objJsonData.FILE_NO = _fnToNull($("#input_FILE_NO").val().replace(/ /gi,""));
        objJsonData.BK_NO = _fnToNull($("#input_BK_NO").val().replace(/ /gi, ""));
        objJsonData.CUST_CD = _fnToNull($("#input_CUST_CD").val().replace(/ /gi, ""));
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Booking/fnSearchData",
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

/////////////////function MakeList/////////////////////
//검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
        {
            var vResult = JSON.parse(vJsonData).Booking;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"result-box\"> ";
                vHTML += "   	<div class=\"result-order\"> ";
                vHTML += "   		<div class=\"result-type2\"> ";
                vHTML += "   			<div class=\"result-type2__info\"> ";
                vHTML += "   				<div class=\"result-type2__title\"><p>File No</p></div> ";
                vHTML += "   				<div class=\"result-type2__desc\"><p>" + _fnToNull(vResult[i]["FILE_NO"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-type2__info\"> ";
                vHTML += "   				<div class=\"result-type2__title\"><p>Bkg No</p></div> ";
                vHTML += "   				<div class=\"result-type2__desc\"><p>" + _fnToNull(vResult[i]["BKG_NO"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"result-detail\"> ";
                vHTML += "   			<div class=\"result-tbl\"> ";
                vHTML += "   				<div class=\"result-tbl__cont\"> ";
                vHTML += "   					<div class=\"result-tbl__title\"><p>선사</p></div> ";
                vHTML += "   					<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["LINE_NM"]) + "</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__cont\"> ";
                vHTML += "   					<div class=\"result-tbl__title\"><p>업체명</p></div> ";
                vHTML += "   					<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["CUST_NM"]) + "</p></div> ";
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

                if (_fnToNull(vResult[i]["ETD"]) != "") {
                    if (_fnToNull(vResult[i]["ETD"].replace(/ /gi, "")) != "") {
                        vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["ETD"])) + " " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETD_HM"])) + "</p></div> ";
                    } else {
                        vHTML += "   						<div class=\"result-tbl__desc\"><p></p></div> ";
                    }
                } else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p></p></div> ";
                }
                
                vHTML += "   						<div class=\"result-tbl__title\"><p>ETA</p></div> ";

                if (_fnToNull(vResult[i]["ETA"]) != "") {
                    if (_fnToNull(vResult[i]["ETA"].replace(/ /gi, "")) != "") {
                        vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["ETA"])) + " " + _fnFormatHHMMTime(_fnToNull(vResult[i]["ETA_HM"])) + "</p></div> ";
                    } else {
                        vHTML += "   						<div class=\"result-tbl__desc\"><p></p></div> ";
                    }
                } else {
                    vHTML += "   						<div class=\"result-tbl__desc\"><p></p></div> ";
                }
                
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"result-tbl__hidden\"> ";
                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>VSL</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["VSL"]) + " " + _fnToNull(vResult[i]["VOY"]) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>작업일</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["BKG_YMD"])) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>D/closing</p></div> ";

                if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"]) != "") {
                    if (_fnToNull(vResult[i]["DOC_CLOSE_YMD"].replace(/ /gi, "")) != "") {
                        vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["DOC_CLOSE_YMD"])) + " " + _fnFormatHHMMTime(_fnToNull(vResult[i]["DOC_CLOSE_HM"])) + "</p></div> ";
                    } else {
                        vHTML += "   							<div class=\"result-tbl__desc\"><p></p></div> ";
                    }
                } else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p></p></div> ";
                }
                
                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>C/closing</p></div> ";

                if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"]) != "") {
                    if (_fnToNull(vResult[i]["CARGO_CLOSE_YMD"].replace(/ /gi, "")) != "") {
                        vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["CARGO_CLOSE_YMD"])) + " " + _fnFormatHHMMTime(_fnToNull(vResult[i]["CARGO_CLOSE_HM"])) + "</p></div> ";
                    } else {
                        vHTML += "   							<div class=\"result-tbl__desc\"><p></p></div> ";
                    }
                } else {
                    vHTML += "   							<div class=\"result-tbl__desc\"><p></p></div> ";
                }
                
                vHTML += "   						</div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__bundle\"> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>CNTR QTY</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["CNTR_LIST"]) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   						<div class=\"result-tbl__cont\"> ";
                vHTML += "   							<div class=\"result-tbl__title\"><p>담당자</p></div> ";
                vHTML += "   							<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["SHP_PIC_NM"]) + " " + _fnToNull(vResult[i]["SHP_RMK"]) + "</p></div> ";
                vHTML += "   						</div> ";
                vHTML += "   					</div> ";

                vHTML += "                      <div class=\"result-tbl__bundle\"> ";
                vHTML += "                      	<div class=\"result-tbl__cont short\"> ";
                vHTML += "                      		<div class=\"result-tbl__title\"><p>DOOR DATE</p></div> ";
                vHTML += "                      		<div class=\"result-tbl__desc\"><p> ";

                vHTML += _fnFormatDate(_fnToNull(vResult[i]["DOOR_YMD"])) + " ";
                if (_fnToNull(vResult[i]["DOOR_YMD"]) != "") {
                    if (_fnToNull(vResult[i]["DOOR_HM"]) != "") {
                        vHTML += _fnFormatHHMMTime(_fnToNull(vResult[i]["DOOR_HM"].replace(/ /gi, "")));
                    }
                }
                vHTML += "                      		</p></div> ";
                vHTML += "                      	</div> ";
                vHTML += "                      	<div class=\"result-tbl__cont long\"> ";
                vHTML += "                      		<div class=\"result-tbl__title\"><p>DOOR</p></div> ";
                vHTML += "                      		<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["FACT_NM"]) + "</p></div> ";
                vHTML += "                      	</div> ";
                vHTML += "                      </div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>Trcuker</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["TRK_NM"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>GRADE</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["GRADE"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   					<div class=\"result-tbl__cont\"> ";
                vHTML += "   						<div class=\"result-tbl__title\"><p>REMARK</p></div> ";
                vHTML += "   						<div class=\"result-tbl__desc\"><p>" + _fnToNull(vResult[i]["RMK"]) + "</p></div> ";
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   			<div class=\"result-tbl__button\"> ";
                vHTML += "   				<button type=\"button\" class=\"btns open\"><span class=\"hidden\">펼치기</span></button> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            });

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
        {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>검색 결과가 없습니다.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E")
        {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>관리자에게 문의 하세요.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Booking_Result")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}

////////////////////////API////////////////////////////


