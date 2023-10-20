////////////////////전역 변수//////////////////////////
$(function () {
    $(".delivery_mo").hide();
    $("#tracking_List").hide();

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
});
////////////////////jquery event///////////////////////
//화물 추적 버튼 이벤트
$(document).on("click", "#btn_SearchTrk", function () {	

	if (_fnToNull($("#input_TrkHBL").val()) != "" && _fnToNull($("#input_TrkCntr").val()) != "") {
		fnGetTrkData($("#input_TrkHBL").val(), $("#input_TrkCntr").val());
	} else if (_fnToNull($("#input_TrkHBL").val()) != "") {
		fnGetTrkData($("#input_TrkHBL").val(), "");
	} else if (_fnToNull($("#input_TrkCntr").val()) != "") {
		fnGetTrkData("", $("#input_TrkCntr").val());
	}
	else {
		_fnAlertMsg("HBL 번호 혹은 Cntr 번호를 입력 해 주세요.");
    }
});

//화물추적 레이어팝업 리스트 클릭 시 데이터 가져오기
$(document).on("click", ".pc_trk_list", function () {

    if ($(this).css('background-color') != "rgb(245, 245, 245)") {
        $('.pc_trk_list').css('background-color', "#fff");
        $(this).css('background-color', "#f5f5f5");
        $('.mo_trk_list').css('background-color', "#fff");
        $(this).find('.mo_trk_list').css('background-color', "#f5f5f5");

        var tr = $(this).children();

        fnGetTrackingDetail(tr.eq(0).text(), tr.eq(1).text(), tr.eq(2).text(), tr.eq(3).text());
    }

});
////////////////////////function///////////////////////
//화물추적 데이터 가져오는 함수
function fnGetTrkData(vMngtNo,vCntrNo) {
    try {

        if (isChkBL(vMngtNo, vCntrNo)) {
            var rtnJson;
            var objJsonData = new Object();

            objJsonData.HBL_NO = vMngtNo;
            objJsonData.CNTR_NO = vCntrNo;
            objJsonData.OFFICE_CD = _Office_CD;

            $.ajax({
                type: "POST",
                url: "/Tracking/fnGetTrackingList",
                async: true,
                dataType: "json",
                //data: callObj,
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    fnMakeTrackingData(result);
                    fnMakeTrackingList(result);
                    fnMovePage('tracking_page');
                }, error: function (xhr, status, error) {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                    alert("담당자에게 문의 하세요.");
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
    }
    catch (err) {
        console.log("[Error - fnGetTrkData]" + err.message);
    }
}

//화물추적 B/L 제출 되었는지 확인
function isChkBL(vMngtNo, vCntrNo) {
    try {
        var isBoolean = true;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vMngtNo;
        objJsonData.CNTR_NO = vCntrNo;

        $.ajax({
            type: "POST",
            url: "/Tracking/fnIsCheckBL",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //엘비스 - 제출 여부 확인
                    if (JSON.parse(result).Check[0]["CHKBL_YN"] == "N") {
                        _fnLayerAlertMsg("B/L 제출을 해주시기 바랍니다.");
                        isBoolean = false;
                    } else {
                        isBoolean = true;
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnLayerAlertMsg("B/L Tracking 정보가 없습니다");
                    isBoolean = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnLayerAlertMsg("B/L Tracking 정보가 없습니다");
                    isBoolean = false;
                }
            }, error: function (xhr, status, error) {
                _fnLayerAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return isBoolean;
    }
    catch (err) {
        console.log("[Error - isChkBL()]" + err.message);
    }

}


//화물추적 데이터 - Detail 부분만 데이터 가져오기
function fnGetTrackingDetail(vHBL, vCntr , vREQ_SVC , vEX_IM_TYPE) {
    try {

        var rtnJson;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vHBL;
        objJsonData.CNTR_NO = vCntr;
        objJsonData.REQ_SVC = vREQ_SVC;
        objJsonData.EX_IM_TYPE = vEX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Tracking/GetTrackingDetail",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //데이터 그려주기
                    fnMakeTrackingData(result);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnLayerAlertMsg("Tracking 정보가 없습니다");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    $(".delivery_status").hide();
                    console.log("[Error : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnLayerAlertMsg("[Error]관리자에게 문의 해 주세요.");
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnLayerAlertMsg("담당자에게 문의 하세요.");
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
        console.log("[Error - fnGetTracking()]" + err.message);
    }
}


/////////////////function MakeList/////////////////////
//레이어 화물 추적 마일스톤 데이터 그리기
function fnMakeTrackingData(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            //스케줄 데이터 만들기
            var vResult = JSON.parse(vJsonData).DTL;

            $("#MileStronArea").empty();

            $.each(vResult, function (i) {

                if (_fnToNull(vResult[i].EVENT_STATUS) == "N") {
                    vHTML += "		<li class='on'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding02.png' /></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                } else if (_fnToNull(vResult[i].EVENT_STATUS) == "E") {
                    vHTML += "		<li class='on'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding02.png' /></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                } else {
                    vHTML += "		<li class='on now' id='now_track'>			";
                    vHTML += "                <div class='step_box'>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                    </div>			";
                    vHTML += "                    <div class='col'>			";
                    vHTML += "                    <span class='icn'>";
                    vHTML += "                    <div class='center_img'><img src='/Images/rounding_blue02.png' class='blinkcss'/></div>";
                    vHTML += "                    <div class='center_img'><img src='http://image.elvisprime.com" + _fnToNull(vResult[i].FILE_PATH) + _fnToNull(vResult[i].EVENT_FILE_NM) + "'></div>";
                    vHTML += "                    </span>";
                    vHTML += "                        <div class='mo'>			";
                    vHTML += "                            <em class='step'>" + _fnToNull(vResult[i].EVENT_NM) + "</em>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <div class='pc'>			";
                    vHTML += "                            <strong class='location'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</strong>			";
                    vHTML += "                        </div>			";
                    vHTML += "                        <p class='date'>" + _fnToNull(vResult[i].EST_YMD) + " <span>" + _fnToNull(vResult[i].EST_HM) + "</span></p>			";
                    vHTML += "                        <p class='date' style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " <span>" + _fnToNull(vResult[i].ACT_HM) + "</span></p>			";
                    vHTML += "                    </div>			";
                    vHTML += "                </div>			";
                    vHTML += "            </li>			";
                }

            });

            $("#MileStronArea").append(vHTML);
            if ($('#MileStronArea .step').text().length > 10) {
                $('#MileStronArea .step').addClass("long_name");
            }
            if (document.getElementById("now_track")) {
                var location = document.querySelector("#now_track").offsetLeft;
                $(".delivery_mo").scrollLeft(location);
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {

            $("#MileStronArea").empty();
            $(".delivery_mo").hide();

            console.log("[Fail - fnMakeTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("관리자에게 문의 하세요.");
            console.log("[Error - fnMakeTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeTrackingData]" + err.message);
    }
}

//레이어 화물 추적 데이터 리스트
function fnMakeTrackingList(vJsonData) {

    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vJsonData).Main;

            $.each(vResult, function (i) {

                if (i == 0) {
                    vHTML += "   <tr class=\"row pc_trk_list\" data-row=\"row_1\" style=\"background-color:#f5f5f5\"> ";
                } else {
                    vHTML += "   <tr class=\"row pc_trk_list\" data-row=\"row_1\"> ";
                }

                vHTML += "            <td>" + _fnToNull(vResult[i].HBL_NO) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].CNTR_NO) + "</td>	";
                vHTML += "            <td style=\"display:none\">" + _fnToNull(vResult[i].REQ_SVC) + "</td>	";
                vHTML += "            <td style=\"display:none\">" + _fnToNull(vResult[i].EX_IM_TYPE) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].MBL_NO) + "</td>	";
                vHTML += "            <td>" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</td>	";
                vHTML += "            <td>	";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "            </td>	";
                vHTML += "            <td class='mobile_layout' colspan='6'>	";

                if (i == 0) {
                    vHTML += "                <div class='layout_type5 mo_trk_list' style=\"background-color:#f5f5f5\">	";
                } else {
                    vHTML += "                <div class='layout_type5 mo_trk_list'>	";
                }
               
                vHTML += "                    <div class='row s1'>	";
                vHTML += "                        <div class='col w1'>House B/L :</div>	";
                vHTML += "                        <div class='col'>" + _fnToNull(vResult[i].HBL_NO) + "</div>	";
                vHTML += "                    </div>	";
                vHTML += "                    <div class='row s2'>	";
                vHTML += "                        <table class=\"\">	";
                vHTML += "                            <tbody>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Container No :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].CNTR_NO) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Master No :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].MBL_NO) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Status :</th>	";
                vHTML += "                                    <td>" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</td>	";
                vHTML += "                                </tr>	";
                vHTML += "                                <tr>	";
                vHTML += "                                    <th>Location :</th>	";
                vHTML += "                                    <td>	";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "                                    </td>	";
                vHTML += "                                </tr>	";
                vHTML += "                            </tbody>	";
                vHTML += "                        </table>	";
                vHTML += "                    </div>	";
                //vHTML += "                    <button type='button' class='btn_type1'>상세</button>	";
                vHTML += "                </div>	";
                vHTML += "            </td>	";
                vHTML += "        </tr>	";
            });

            $(".delivery_mo").show();
            $("#tracking_List").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $(".delivery_mo").hide();
            $("#tracking_List").hide();
            _fnAlertMsg("Tracking 정보가 없습니다.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            $(".delivery_mo").hide();
            $("#tracking_List").hide();
            _fnAlertMsg("담당자에게 문의하세요");
        }

        $("#delivery_list")[0].innerHTML = vHTML;

        if (vResult.length > 6) {
            $('.tracking_scrollbar').slimScroll({
                height: '215px'
            });
        }
    }
    catch (err) {
        console.log("[Error - fnMakeTrackingList]" + err.message);
    }
}


////////////////////////API////////////////////////////