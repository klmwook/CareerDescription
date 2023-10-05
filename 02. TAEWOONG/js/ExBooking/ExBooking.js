////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#ExBooking .inner").addClass("on");
        fnInitAutoComplete();

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

//자동완성 기능 - POL
$(document).on("keyup", "#input_PORT_NM", function () {

	var vPort = "";

	//input_POL 초기화
	if (_fnToNull($(this).val()) == "") {
		$("#input_PORT_CD").val("");
	}

	//autocomplete
	$(this).autocomplete({
		minLength: 3,
		open: function (event, ui) {
			$(this).autocomplete("widget").css({
				"width": $("#AC_PORT_Width").width()
			});
		},
		source: function (request, response) {
			var result = fnGetPortData($("#input_PORT_NM").val().toUpperCase());
			if (result != undefined) {
				result = JSON.parse(result).Table
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
				$("#input_PORT_NM").val(ui.item.value);
				$("#input_PORT_CD").val(ui.item.code);
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
$(document).on("focusout", "#input_PORT_NM", function () {
    if ($(this).val().length != 0) {
        if (_fnToNull($("#input_PORT_CD").val()) == "") {
            $(this).val("");
            _fnAlertMsg("PORT를 선택하여 주세요.", "input_PORT_NM");
            return false;
        }
    }
});

//조회 버튼 이벤트
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
});

////////////////////////function/////////////////////////
//자동완성 초기화
function fnInitAutoComplete() {
    try {
        $("#input_PORT_NM").autocomplete({
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

//Port 정보 가져오는 함수
function fnGetPortData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.LOC_CD = vValue;

        $.ajax({
            type: "POST",
			url: "/ExBooking/fnGetPortData",
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

        if (_fnToNull($("#input_PORT_CD").val()) == "") {
            _fnAlertMsg("PORT를 선택하여 주세요.");
            return false;
        }

        var objJsonData = new Object();
                
        objJsonData.DATE_START = _fnToNull($("#input_DATE_START").val().replace(/-/gi, ""));
        objJsonData.DATE_END = _fnToNull($("#input_DATE_END").val().replace(/-/gi, ""));        
        objJsonData.POD_CD = _fnToNull($("#input_PORT_CD").val().replace(/ /gi, ""));
        objJsonData.DEPT_CD = _fnToNull($("#Session_DEPT_CD").val().replace(/ /gi, ""));
        objJsonData.USR_AUTH = _fnToNull($("#Session_AUTH_TYPE").val().replace(/ /gi, ""));
        
        $.ajax({
            type: "POST",
            url: "/ExBooking/fnSearchData",
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

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).ExBooking;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"result-box\"> ";
                vHTML += "   	<div class=\"result-order\"> ";
                vHTML += "   		<div class=\"result-type4\"> ";
                vHTML += "   			<div class=\"result-type4__info\"> ";
                vHTML += "   				<div class=\"result-type4__title\"><p>" + _fnToNull(vResult[i]["LINE_NM"]) + "</p></div> ";
                vHTML += "   				<div class=\"result-type4__desc\"><p>" + _fnToNull(vResult[i]["POD_NM"]) + "</p></div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"result-detail\"> ";
                vHTML += "   			<div class=\"customer\"> ";
                vHTML += "   				<div class=\"cust__info\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>담당자(팀)</p></div> ";

                if (_fnToNull(vResult[i]["OP_NM"]) != "" && _fnToNull(vResult[i]["DEPT_NM"]) != "") {
                    vHTML += "   <div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["OP_NM"]) + "&" + _fnToNull(vResult[i]["DEPT_NM"]) + "</p></div> ";
                } else {
                    if (_fnToNull(vResult[i]["OP_NM"]) != "") {
                        vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["OP_NM"]) + "</p></div> ";
                    } else if (_fnToNull(vResult[i]["DEPT_NM"]) != "") {
                        vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["DEPT_NM"]) + "</p></div> ";
                    } else {
                        vHTML += "   					<div class=\"cust__desc\"><p></p></div> ";
                    }
                }

                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>ETD</p></div> ";
                vHTML += "   					<div class=\"cust__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["ETD"]))+"</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>상태</p></div> ";

                if (_fnToNull(vResult[i]["STAT"]) == "D") {
                    vHTML += "   					<div class=\"cust__desc\"><p>완료</p></div> ";
                } else if (_fnToNull(vResult[i]["STAT"]) == "C") {
                    vHTML += "   					<div class=\"cust__desc\"><p>캔슬</p></div> ";
                } else if (_fnToNull(vResult[i]["STAT"]) == "R") {
                    vHTML += "   					<div class=\"cust__desc\"><p>거절</p></div> ";
                } else {
                    vHTML += "   					<div class=\"cust__desc\"><p></p></div> ";
                }

                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info wd100\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>컨테이너 타입</p></div> ";

                var vCntrType = "";
                if (_fnToZero(vResult[i]["CNTR20"]) != 0) {
                    vCntrType += "20'x" + _fnToZero(vResult[i]["CNTR20"])+ " ";
                }
                if (_fnToZero(vResult[i]["CNTR40"]) != 0) {
                    if (_fnToNull(vCntrType) != "") {
                        vCntrType += ", 40'x" + _fnToZero(vResult[i]["CNTR40"]) + " ";
                    }
                    else {
                        vCntrType += "40'x" + _fnToZero(vResult[i]["CNTR40"]) + " ";
                    }
                }
                if (_fnToZero(vResult[i]["CNTR40RF"]) != 0) {
                    if (_fnToNull(vCntrType) != "") {
                        vCntrType += ", 40RFx" + _fnToZero(vResult[i]["CNTR40RF"]) + " ";
                    }
                    else {
                        vCntrType += "40RFx" + _fnToZero(vResult[i]["CNTR40RF"]) + " ";
                    }
                }

                vHTML += "   					<div class=\"cust__desc\"><p>" + vCntrType+"</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info wd100\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>기타</p></div> ";
                vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["CNTR_ETC"]) +"</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info wd100\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>모선&항차명</p></div> ";
                vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["VSL"]) + " / " + _fnToNull(vResult[i]["VOY"]) +"</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info wd100\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>선적지</p></div> ";
                vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["POL_NM"]) +"</p></div> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"cust__info wd100\"> ";
                vHTML += "   					<div class=\"cust__title\"><p>Remark</p></div> ";
                vHTML += "   					<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["RMK"]) +"</p></div> ";
                vHTML += "   				</div> ";
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

        $("#ExBooking_Result")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}
////////////////////////API////////////////////////////
