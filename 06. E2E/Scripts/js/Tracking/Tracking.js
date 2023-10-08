////////////////////전역 변수//////////////////////////
var _objTrk = new Object();

////////////////////jquery event///////////////////////
$(function () {
    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
});

//화물 추적 버튼 이벤트
$(document).on("click", "#btn_SearchTrk", function () {
        
    if (_fnToNull($("#input_TrkHBL").val()) != "" && _fnToNull($("#input_TrkCntr").val()) != "") {
        fnGetTrkData($("#input_TrkHBL").val().toUpperCase().trim(), $("#input_TrkCntr").val().toUpperCase().trim());
    } else if (_fnToNull($("#input_TrkHBL").val()) != "") {
        fnGetTrkData($("#input_TrkHBL").val().toUpperCase().trim(), "");
    } else if (_fnToNull($("#input_TrkCntr").val()) != "") {
        fnGetTrkData("", $("#input_TrkCntr").val().toUpperCase().trim());
    }
    else {
        _fnAlertMsg("HBL 번호 혹은 Cntr 번호를 입력 해 주세요.");
    }

});

//첫번째 리스트 중 Tracking Data를 보여주기 위한 함수
$(document).on("click", ".clickevent", function () {

    var vThis = $(this).closest(".wanna_open");
    var vObject = new Object();
    vObject.This = vThis;
    vObject.HBL_NO = vThis.find("input[type='hidden']").eq(0).val();
    vObject.CNTR_NO = vThis.find("input[type='hidden']").eq(1).val();
    vObject.REQ_SVC = vThis.find("input[type='hidden']").eq(2).val();
    vObject.EX_IM_TYPE = vThis.find("input[type='hidden']").eq(3).val();

    fnGetTrackingDetail(vObject);

    var $par = $(this).closest('.wanna_open');
    var inx = $par.index();
    if ($par.hasClass('open') == true) {
        $('.wanna_open:eq(' + inx + ')').find('.tracking_box').stop().slideUp();
        $par.removeClass('open');
    }
    else {
        if ($('.wanna_open').hasClass('open')) {
            $('.wanna_open').removeClass('open');
            $('.wanna_open').find('.tracking_box').slideUp();
        }
        $('.wanna_open:eq(' + inx + ')').addClass('open');
        $par.find('.tracking_box').slideDown();
    }
});

//화물추적 디테일 검색 버튼 클릭 이벤트
$(document).on("click", "button[name='btn_TrkDTL']", function () {

    var vThis = $(this).closest(".wanna_open");
    var vObject = new Object();
    vObject.This = vThis;
    vObject.HBL_NO = vThis.find("input[type='hidden']").eq(0).val();
    vObject.CNTR_NO = vThis.find("input[type='hidden']").eq(1).val();
    vObject.REQ_SVC = vThis.find("input[type='hidden']").eq(2).val();
    vObject.EX_IM_TYPE = vThis.find("input[type='hidden']").eq(3).val();

    fnGetTrackingDetail(vObject);

    var $par = $(this).closest('.wanna_open');
    var inx = $par.index();
    if ($par.hasClass('open') == true) {
        $('.wanna_open:eq(' + inx + ')').find('.tracking_box').stop().slideUp();
        $par.removeClass('open');
    }
    else {
        if ($('.wanna_open').hasClass('open')) {
            $('.wanna_open').removeClass('open');
            $('.wanna_open').find('.tracking_box').slideUp();
        }
        $('.wanna_open:eq(' + inx + ')').addClass('open');
        $par.find('.tracking_box').slideDown();
    }
});


////////////////////////function///////////////////////
//화물추적 데이터 가져오는 함수
function fnGetTrkData(vMngtNo, vCntrNo) {
    try {        
        _objTrk = new Object();

        if (isChkBL(vMngtNo, vCntrNo)) {
            fnTrkInit(); //초기화
            if (_objTrk.REQ_SVC == "SEA") {
                if (fnChkTokenExpire()) {
                    _objTrk.HBL_NO = vMngtNo;
                    _objTrk.CNTR_NO = vCntrNo;
                    _objTrk.OFFICE_CD = _Office_CD;
                    fnTrkList("SEA");
                    fnMovePage('SVN_Trk_Area');
                }
                else {
                    $("#SVN_Trk_Area").hide();
                    $("#SVT_map").attr("src", "");
                }
            } else if (_objTrk.REQ_SVC == "AIR") {
                _objTrk.HBL_NO = vMngtNo;
                _objTrk.CNTR_NO = vCntrNo;
                _objTrk.OFFICE_CD = _Office_CD;
                fnTrkList("AIR");
                fnMovePage('List_Trk_Area');
            }
        } else {
            $("#SVN_Trk_Area").hide();
            $("#List_Trk_Area").hide();
            $("#SVT_map").attr("src", "");
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
        objJsonData.OFFICE_CD = _Office_CD;

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

                    if (JSON.parse(result).Check[0]["CHKBL_YN"] == "Y") {
                        _objTrk.HBL_NO = JSON.parse(result).Check[0]["HBL_NO"];
                        _objTrk.MBL_NO = JSON.parse(result).Check[0]["MBL_NO"];
                        _objTrk.REQ_SVC = JSON.parse(result).Check[0]["REQ_SVC"];
                        _objTrk.TOKEN = JSON.parse(result).Check[0]["TOKEN"];
                        _objTrk.EXPIREDDT = JSON.parse(result).Check[0]["EXPIREDDT"] //  만료일 추가 , 쿼리로 수정 필요
                        _objTrk.SCAC_CD = JSON.parse(result).Check[0]["SCAC_CD"];
                        _objTrk.ID = JSON.parse(result).Check[0]["ID"];
                        _objTrk.PWD = JSON.parse(result).Check[0]["PWD"];

                        isBoolean = true;
                    }
                    else if (JSON.parse(result).Check[0]["CHKBL_YN"] == "N") {
                        _fnAlertMsg("B/L 제출을 해주시기 바랍니다.");
                        isBoolean = false;
                    } else {
                        _fnAlertMsg("담당자에게 문의 하세요.");
                        isBoolean = false;
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("Tracking 정보가 없습니다");
                    isBoolean = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("B/L 정보가 없습니다");
                    isBoolean = false;
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return isBoolean;
    }
    catch (err) {
        console.log("[Error - isChkBL()]" + err.message);
    }
}

//씨벤티지 Token 만료 된건지 체크하는 로직
function fnChkTokenExpire() {
    try {

        var vBoolean = true;

        //토큰 만료 체크 확인
        $.ajax({
            url: "https://svmp.seavantage.com/api/v1/user/me",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(_objTrk.ID + ":" + _objTrk.PWD));
            },
            type: "GET",
            async: false,
            dataType: "json",
            success: function (result) {
                if (result.message == "OK") {
                    //vBoolean = true;

                    GetTokenTime = new Date(_objTrk.EXPIREDDT); // db에 저장된 만료 시간
                    nowTime = new Date(); // 현재 시간

                    //현재 시간이 만료 시간을 지났을 경우 or 토큰 값이 null인 경우  갱신
                    if (GetTokenTime.getTime() < nowTime.getTime() || _fnToNull(_objTrk.TOKEN) == "") {
                        vBoolean = false;
                        vBoolean = fnSetSvtgAuthToken();
                    }
                    else {
                        if (_objTrk.TOKEN == result.response.authToken) {
                            vBoolean = true;
                        }
                        // 만료는 안되었지만 토큰 값이 저장된 값과 다를 때 
                        else {
                            vBoolean = false;
                            vBoolean = fnSetSvtgAuthToken();
                        }
                    }
                } else {
                    vBoolean = false;
                    _fnAlertMsg("담당자에게 문의하세요");
                    console.log("[Error - fnChkLayerTokenExpire()]" + result.message);
                }
            }, error: function (xhr) {
                if (JSON.parse(xhr.responseText).message == "UNAUTHORIZED") {
                    _fnAlertMsg("씨벤티지 인증 Token이 만료 되었습니다.");
                    vBoolean = false;
                }
            }
        });

        return vBoolean;
    }
    catch (err) {
        console.log("[Error - fnChkTokenExpire()]" + err.message);
    }
}

//레이어 팝업 - 토큰 갱신
function fnSetSvtgAuthToken() {
    try {
        var vBoolean = false;
        var objJsonData = new Object();
        objJsonData.SVTG_ID = _objTrk.ID;
        objJsonData.SVTG_PWD = _objTrk.PWD;

        $.ajax({
            url: "https://svmp.seavantage.com/api/v1/user/authToken",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(objJsonData.SVTG_ID + ":" + objJsonData.SVTG_PWD));
            },
            type: "GET",
            async: false,
            contentType: "application/json",
            success: function (result) {

                if (result.message == "OK") {
                    //db에 저장할 토큰 값 변경 -> "토큰|만료일" 로 구분자 넣어서 저장 *변경*
                    var objTokenData = new Object();
                    objTokenData.TOKEN = result.response.tokenId + "|" + result.response.expiredDt;
                    objTokenData.OFFICE_CD = _Office_CD;

                    $.ajax({
                        type: "POST",
                        url: "/SeaVentage/SetSvtgAuthToken ",
                        async: false,
                        dataType: "json",
                        data: { "vJsonData": _fnMakeJson(objTokenData) },
                        success: function (rtnVal) {
                            if (JSON.parse(rtnVal).Result[0]["trxCode"] == "Y") {
                                // 조회 할 토큰 값은 구분자 앞의 AUTHTOKEN 값만 사용 *변경*
                                _objTrk.TOKEN = result.response.tokenId;
                                vBoolean = true;
                            } else {
                                _fnAlertMsg("토큰저장에 실패했습니다. 담당자에게 문의해주세요");
                                vBoolean = false;
                            }
                        }, error: function (xhr) {
                            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                            console.log(xhr);
                            return;
                        }
                    });

                } else {
                    vBoolean = false;
                    _fnAlertMsg("담당자에게 문의하세요");
                    console.log("[Error - fnChkLayerTokenExpire()]" + result.message);
                }
            }, error: function (xhr) {
                if (JSON.parse(xhr.responseText).message == "UNAUTHORIZED") {
                    _fnAlertMsg("담당자에게 문의하세요.")
                    console.log("[Error - fnChkLayerTokenExpire()]" + xhr);
                    vBoolean = false;
                }
            }
        });
        return vBoolean;
    }
    catch (err) {
        console.log("[Error - fnGetTrackingParam()]" + err.message);
    }
}

function fnTrkList(vREQ_SVC) {
    try {

        if (vREQ_SVC == "SEA") {
            $("#SVT_map").empty();
            $("#SVN_Trk_Area").show();

            //TWKIM 20221005 PREFIX 삭제 로직 추가
            if (_objTrk.SCAC_CD == "CKCO" || _objTrk.SCAC_CD == "COSU" || _objTrk.SCAC_CD == "EGLV" || _objTrk.SCAC_CD == "HDMU" || _objTrk.SCAC_CD == "MAEU" || _objTrk.SCAC_CD == "MCPU" || _objTrk.SCAC_CD == "ONEY" || _objTrk.SCAC_CD == "POBU" || _objTrk.SCAC_CD == "SMLM") {
                _objTrk.MBL_NO = _objTrk.MBL_NO.replace(_objTrk.SCAC_CD, "");
            }

            $("#SVT_map").attr("src", "https://svmp.seavantage.com/#/cargo/tracking?authToken=" + _objTrk.TOKEN + "&mblNo=" + _objTrk.MBL_NO + "&hiddenPanel=all");

            $.ajax({
                type: "POST",
                url: "/Tracking/GetSeaTrackingList",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(_objTrk) },
                success: function (result) {
                    $("#List_Trk_Area").hide();
                    fnMakeSeaTrkList(result);
                }, error: function (xhr, status, error) {
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
        } else if (vREQ_SVC == "AIR") {
            $("#List_Trk_Area").show();

            $.ajax({
                type: "POST",
                url: "/Tracking/GetAirTrackingList",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(_objTrk) },
                success: function (result) {
                    $("#SVN_Trk_Area").hide();

                    //받은 데이터 Y / N 체크
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        //데이터 그려주기
                        fnMakeLAirTrkList(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnAlertMsg("화물추적 데이터가 없습니다.");
                        console.log("[Fail : fnTrkList(" + vREQ_SVC + ")]" + JSON.parse(result).Result[0]["trxMsg"]);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        console.log("[Error : fnTrkList(" + vREQ_SVC + ")]" + JSON.parse(result).Result[0]["trxMsg"]);
                        _fnAlertMsg("[Error]관리자에게 문의 해 주세요.");
                    }
                }, error: function (xhr, status, error) {
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
        console.log("[Error - fnTrkList()]" + err.message);
    }
}

//화물추적 데이터 - Detail 부분만 데이터 가져오기
function fnGetTrackingDetail(vObject) {
    try {

        var rtnJson;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vObject.HBL_NO;
        objJsonData.CNTR_NO = vObject.CNTR_NO;
        objJsonData.REQ_SVC = vObject.REQ_SVC;
        objJsonData.EX_IM_TYPE = vObject.EX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Tracking/GetTrackingDetail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //데이터 그려주기                    
                    fnMakeAirTrackingData(vObject.This, result);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg("Tracking 정보가 없습니다");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    $(".delivery_status").hide();
                    console.log("[Error : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요.");
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetTracking()]" + err.message);
    }
}

//화물추적 초기화
function fnTrkInit() {
    try {
        $("#SVN_Trk_Area").hide();
        $("#tracking_List").empty();        
        $("#SVT_map").empty();
        $("#SVT_map").attr("src", "");
        //$("#LF_map_Area").empty();

        $("#SVT_Area").empty();
        var vHTML = "";
        vHTML += "<iframe src=\"\" id=\"SVT_map\" class=\"map\" width=\"100%\" height=\"100%\"></iframe>";
        $("#SVT_Area")[0].innerHTML = vHTML;

        //var vHTML = "<div id=\"LF_map\" class=\"LF_map\"></div>";
        //$("#LF_map_Area")[0].innerHTML = vHTML;
        //_Map.remove();
    }
    catch (err) {
        console.log("[Error - fnTrkInit]"+err.message);
    }
}
/////////////////function MakeList/////////////////////
//레이어 화물 추적 데이터 리스트
//function fnMakeTrackingList(vJsonData) {

//    try {
//        var vHTML = "";
//        var vResult = "";

//        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

//            vResult = JSON.parse(vJsonData).TrackingList;
                        
//            $("#Trk_MBL_NO").empty();
//            $("#Trk_HBL_NO").empty();
//            $("#Trk_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
//            $("#Trk_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));

//            if (_fnToNull(vResult) != "") {
//                $("#trackAppend").empty();                                
//                $(vResult).each(function (i) {

//                    if (_fnToNull(vResult[i].ACT_EVT_CD) == "Y") {
//                        vHTML += "	<li class='now'>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                        } else {
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "E") {
//                        vHTML += "	<li class='complete'>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                        } else {
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "N") {
//                        vHTML += "	<li>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_CD) != "") {
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                        } else {
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    }
//                });
//                $("#trackAppend").append(vHTML);
//                $(".trk_delivery_status").show();
//            } else {
//                $(".trk_delivery_status").hide();
//            }
//        } else {
//            $(".trk_delivery_status").hide();
//        }

//        //var vHTML = "";
//        //var vResult = "";
//        //
//        //if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
//        //
//        //    vResult = JSON.parse(vJsonData).Main;
//        //
//        //    $.each(vResult, function (i) {
//        //        vHTML += "   <div class=\"trk_box wanna_open\"> ";
//        //        vHTML += "      <div class=\"trk_cover\"> ";
//        //
//        //        vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].HBL_NO) + "\" /> ";
//        //        vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].CNTR_NO) + "\" /> ";
//        //        vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].REQ_SVC) + "\" /> ";
//        //        vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].EX_IM_TYPE) + "\" /> ";
//        //
//        //        vHTML += "      	<div class=\"trk_info\"> ";
//        //        vHTML += "      		<p>House B/L No.</p> ";
//        //        vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].HBL_NO) + "</p> ";
//        //        vHTML += "      	</div> ";
//        //        vHTML += "      	<div class=\"trk_info\"> ";
//        //        vHTML += "      		<p>Container No.</p> ";
//        //        vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].CNTR_NO) + "</p> ";
//        //        vHTML += "      	</div> ";
//        //        vHTML += "      	<div class=\"trk_info\"> ";
//        //        vHTML += "      		<p>Master B/L No.</p> ";
//        //        vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].MBL_NO) + "</p> ";
//        //        vHTML += "      	</div> ";
//        //        vHTML += "      	<div class=\"trk_info\"> ";
//        //        vHTML += "      		<p>Status</p> ";
//        //        vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</p> ";
//        //        vHTML += "      	</div> ";
//        //        vHTML += "      	<div class=\"trk_info\"> ";
//        //        vHTML += "      		<p>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
//        //        vHTML += "      		<p class=\"trk_cont\">Busan, Korea</p> ";
//        //        vHTML += "      	</div> ";
//        //        vHTML += "      	<button class=\"btn_open btn_listOpen\" name=\"btn_TrkDTL\"></button> ";
//        //        vHTML += "      </div> ";
//        //        vHTML += "      <div class=\"tracking_box\"></div> ";
//        //        vHTML += "   </div> ";
//        //    });
//        //
//        //    $(".tracking_area").show();
//        //}
//        //else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {                        
//        //    $(".tracking_area").hide();
//        //    _fnAlertMsg("Tracking 정보가 없습니다.");
//        //    return false;
//        //}
//        //else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {            
//        //    $(".tracking_area").hide();
//        //    _fnAlertMsg("담당자에게 문의하세요");
//        //    return false;
//        //}
//        //
//        //$("#trk_list")[0].innerHTML = vHTML;
//    }
//    catch (err) {
//        console.log("[Error - fnMakeTrackingList]" + err.message);
//    }
//}

//씨벤티지 - 레이어 화물 추적 데이터 리스트
function fnMakeSeaTrkList(vJsonData) {

    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).TrackingList;

            $("#SVT_Trk_MBL_NO").empty();
            $("#SVT_Trk_HBL_NO").empty();
            $("#SVT_Trk_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
            $("#SVT_Trk_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));

            if (_fnToNull(vResult) != "") {
                $("#SVT_trackAppend").empty();

                $(vResult).each(function (i) {

                    if (_fnToNull(vResult[i].ACT_EVT_CD) == "Y") {
                        vHTML += "	<li class='now'>	";
                        vHTML += "        <div class='inner'>	";
                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                        vHTML += "            <div class='cont'>	";
                        vHTML += "                <div class='info_box'>	";
                        vHTML += "                    <div class='col'>	";
                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
                            vHTML += "                    <span style='color:#019e96'>	";
                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                            vHTML += "                    </span>	";
                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
                            vHTML += "                    <span>	";
                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
                            vHTML += "                    </span>	";
                        }
                        vHTML += "                    </div>	";
                        vHTML += "                    <div class='col right'>	";
                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                        vHTML += "                    </div>	";
                        vHTML += "                </div>	";
                        vHTML += "            </div>	";
                        vHTML += "        </div>	";
                        vHTML += "    </li>	";
                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "E") {
                        vHTML += "	<li class='complete'>	";
                        vHTML += "        <div class='inner'>	";
                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                        vHTML += "            <div class='cont'>	";
                        vHTML += "                <div class='info_box'>	";
                        vHTML += "                    <div class='col'>	";
                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
                            vHTML += "                    <span style='color:#019e96'>	";
                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                            vHTML += "                    </span>	";
                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
                            vHTML += "                    <span>	";
                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
                            vHTML += "                    </span>	";
                        }
                        vHTML += "                    </div>	";
                        vHTML += "                    <div class='col right'>	";
                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                        vHTML += "                    </div>	";
                        vHTML += "                </div>	";
                        vHTML += "            </div>	";
                        vHTML += "        </div>	";
                        vHTML += "    </li>	";
                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "N") {
                        vHTML += "	<li>	";
                        vHTML += "        <div class='inner'>	";
                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
                        vHTML += "            <div class='cont'>	";
                        vHTML += "                <div class='info_box'>	";
                        vHTML += "                    <div class='col'>	";
                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
                            vHTML += "                    <span style='color:#019e96'>	";
                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                            vHTML += "                    </span>	";
                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
                            vHTML += "                    <span>	";
                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
                            vHTML += "                    </span>	";
                        }
                        vHTML += "                    </div>	";
                        vHTML += "                    <div class='col right'>	";
                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
                        vHTML += "                    </div>	";
                        vHTML += "                </div>	";
                        vHTML += "            </div>	";
                        vHTML += "        </div>	";
                        vHTML += "    </li>	";
                    }
                });
                $("#SVT_trackAppend").append(vHTML);
                $(".SVT_trk_delivery_status").show();
            } else {
                $(".SVT_trk_delivery_status").hide();
            }
        } else {
            $(".SVT_trk_delivery_status").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeSeaTrkList]" + err.message);
    }
}

//리스트 형식 - 레이어 화물 추적 데이터 리스트
function fnMakeLAirTrkList(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vJsonData).Main;

            if (_fnToNull(vResult) != "") {
                $('#List_Trk_Area').show();
                $("#tracking_List").empty();                

                $(vResult).each(function (i) {

                    vHTML += "   <div class=\"trk_box wanna_open\"> ";
                    vHTML += "      <div class=\"trk_cover\"> ";

                    vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].HBL_NO) + "\" /> ";
                    vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].CNTR_NO) + "\" /> ";
                    vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].REQ_SVC) + "\" /> ";
                    vHTML += " <input type=\"hidden\" value=\"" + _fnToNull(vResult[i].EX_IM_TYPE) + "\" /> ";

                    vHTML += "      	<div class=\"trk_info\"> ";
                    vHTML += "      		<p>House B/L No.</p> ";
                    vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].HBL_NO) + "</p> ";
                    vHTML += "      	</div> ";
                    vHTML += "      	<div class=\"trk_info\"> ";
                    vHTML += "      		<p>Container No.</p> ";
                    vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].CNTR_NO) + "</p> ";
                    vHTML += "      	</div> ";
                    vHTML += "      	<div class=\"trk_info\"> ";
                    vHTML += "      		<p>Master B/L No.</p> ";
                    vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].MBL_NO) + "</p> ";
                    vHTML += "      	</div> ";
                    vHTML += "      	<div class=\"trk_info\"> ";
                    vHTML += "      		<p>Status</p> ";
                    vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].NOW_EVENT_NM) + "</p> ";
                    vHTML += "      	</div> ";
                    vHTML += "      	<div class=\"trk_info\"> ";
                    vHTML += "      		<p>Location</p> ";
                    vHTML += "      		<p class=\"trk_cont\">" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
                    vHTML += "      	</div> ";
                    if (i == 0) {
                        vHTML += "      	<button class=\"btn_open clickevent\"></button> ";
                    } else {
                        vHTML += "      	<button class=\"btn_open\" name=\"btn_TrkDTL\"></button> ";
                    }

                    vHTML += "      </div> ";
                    vHTML += "      <div class=\"tracking_box\"></div> ";
                    vHTML += "   </div> ";
                });

                $("#tracking_List").append(vHTML);
                $(".clickevent").click();
            } else {
                _fnAlertMsg("화물추적 데이터가 없습니다.");
            }
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLAirTrkList]" + err.message);
    }
}

//Air 레이어 화물 추적 마일스톤 데이터 그리기
function fnMakeAirTrackingData(vThis, vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).DTL;

            $.each(vResult, function (i) {

                var vLast = "";

                if (vResult[i].EX_IM_TYPE == "E") {
                    if (i == 1) {
                        vLast = "last";
                    }

                    if (_fnToNull(vResult[i].EVENT_STATUS) == "Y") {
                        vHTML += "   <div class=\"track_stat air on " + vLast + " export\"> ";
                    }
                    else if (_fnToNull(vResult[i].EVENT_STATUS) == "N") {
                        vHTML += "   <div class=\"track_stat air yet " + vLast + " export\"> ";
                    }
                    else if (_fnToNull(vResult[i].EVENT_STATUS) == "E") {
                        vHTML += "   <div class=\"track_stat air " + vLast + " export\"> ";
                    }

                    vHTML += "   	<div class=\"track_proc\"> ";
                    vHTML += "   		<div class=\"track_cell\"> ";
                    vHTML += "   			<p>" + _fnToNull(vResult[i].EVENT_NM) + "</p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"track_process\"> ";
                    vHTML += "   		<div class=\"track_inner\"> ";
                    vHTML += "   			<div class=\"track img\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"track loc\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   					<p class=\"title\">LOCATION</p> ";
                    vHTML += "   					<p>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"track dnt\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   					<p class=\"title\">DATE AND TIME</p> ";
                    //vHTML += "   					<p>" + _fnToNull(vResult[i].EST_YMD) + " " + _fnToNull(vResult[i].EST_HM) + "</p> ";
                    vHTML += "   					<p style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_YMD) + " " + _fnToNull(vResult[i].ACT_HM) + "</p> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
                else if (vResult[i].EX_IM_TYPE == "I") {
                    if (i == 1) {
                        vLast = "last";
                    }

                    if (_fnToNull(vResult[i].EVENT_STATUS) == "Y") {
                        vHTML += "   <div class=\"track_stat air on " + vLast + " import\"> ";
                    }
                    else if (_fnToNull(vResult[i].EVENT_STATUS) == "N") {
                        vHTML += "   <div class=\"track_stat air yet " + vLast + " import\"> ";
                    }
                    else if (_fnToNull(vResult[i].EVENT_STATUS) == "E") {
                        vHTML += "   <div class=\"track_stat air " + vLast + " import\"> ";
                    }

                    vHTML += "   	<div class=\"track_proc\"> ";
                    vHTML += "   		<div class=\"track_cell\"> ";
                    vHTML += "   			<p>" + _fnToNull(vResult[i].EVENT_NM) + "</p> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"track_process\"> ";
                    vHTML += "   		<div class=\"track_inner\"> ";
                    vHTML += "   			<div class=\"track img\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"track loc\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   					<p class=\"title\">LOCATION</p> ";
                    vHTML += "   					<p>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   			<div class=\"track dnt\"> ";
                    vHTML += "   				<div class=\"track_cell\"> ";
                    vHTML += "   					<p class=\"title\">DATE AND TIME</p> ";
                    //vHTML += "   					<p>" + _fnDateFormat(_fnToNull(vResult[i].EST_YMD)) + " " + _fnDateFormat(_fnToNull(vResult[i].EST_HM)) + "</p> ";
                    vHTML += "   					<p style='color:#0085b4'>" + _fnDateFormat(_fnToNull(vResult[i].ACT_YMD)) + " " + _fnDateFormat(_fnToNull(vResult[i].ACT_HM)) + "</p> ";
                    vHTML += "   				</div> ";
                    vHTML += "   			</div> ";
                    vHTML += "   		</div> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </div> ";
                }
            });

            $(vThis.find(".tracking_box"))[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeAirTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg("관리자에게 문의 하세요.");
            console.log("[Error - fnMakeAirTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeAirTrackingData]" + err.message);
    }
}

//LeafLet - 레이어 화물 추적 데이터 리스트
//function fnMakeAirTrkList(vJsonData) {
//
//    try {
//
//        var vHTML = "";
//        var vResult = "";
//
//        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
//            vResult = JSON.parse(vJsonData).TrackingList;
//
//            $("#LF_Trk_MBL_NO").empty();
//            $("#LF_Trk_HBL_NO").empty();
//            $("#LF_Trk_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
//            $("#LF_Trk_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));
//
//            if (_fnToNull(vResult) != "") {
//                $("#LF_trackAppend").empty();
//
//                $(vResult).each(function (i) {
//
//                    if (_fnToNull(vResult[i].ACT_EVT_CD) == "Y") {
//                        vHTML += "	<li class='now'>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
//                            vHTML += "                    <span style='color:#019e96'>	";
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                            vHTML += "                    </span>	";
//                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
//                            vHTML += "                    <span>	";
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                            vHTML += "                    </span>	";
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "E") {
//                        vHTML += "	<li class='complete'>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
//                            vHTML += "                    <span style='color:#019e96'>	";
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                            vHTML += "                    </span>	";
//                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
//                            vHTML += "                    <span>	";
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                            vHTML += "                    </span>	";
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    } else if (_fnToNull(vResult[i].ACT_EVT_CD) == "N") {
//                        vHTML += "	<li>	";
//                        vHTML += "        <div class='inner'>	";
//                        vHTML += "            <h3 class='tit " + _fnDateCal(_fnDateFormat(_fnToNull(vResult[i].EST)), _fnDateFormat(_fnToNull(vResult[i].ACT))) + "'>" + _fnToNull(vResult[i].EVENT_NM) + "</h3>	";
//                        vHTML += "            <div class='cont'>	";
//                        vHTML += "                <div class='info_box'>	";
//                        vHTML += "                    <div class='col'>	";
//                        if (_fnToNull(vResult[i].ACT_LOC_NM) != "") {
//                            vHTML += "                    <span style='color:#019e96'>	";
//                            vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
//                            vHTML += "                    </span>	";
//                        } else if (_fnToNull(vResult[i].EST_LOC_NM) != "") {
//                            vHTML += "                    <span>	";
//                            vHTML += _fnToNull(vResult[i].EST_LOC_NM);
//                            vHTML += "                    </span>	";
//                        }
//                        vHTML += "                    </div>	";
//                        vHTML += "                    <div class='col right'>	";
//                        vHTML += "                        <p>" + _fnToNull(_fnDateFormat(vResult[i].EST_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].EST_HM)) + "</p>	";
//                        vHTML += "                        <p style='color:#019e96'>" + _fnToNull(_fnDateFormat(vResult[i].ACT_YMD)) + ' ' + _fnToNull(_fnDateFormat(vResult[i].ACT_HM)) + "</p>	";
//                        vHTML += "                    </div>	";
//                        vHTML += "                </div>	";
//                        vHTML += "            </div>	";
//                        vHTML += "        </div>	";
//                        vHTML += "    </li>	";
//                    }
//                });
//                $("#LF_trackAppend").append(vHTML);
//                $(".LF_trk_delivery_status").show();
//            } else {
//                $(".LF_trk_delivery_status").hide();
//            }
//        } else {
//            $(".LF_trk_delivery_status").hide();
//        }
//    }
//    catch (err) {
//        console.log("[Error - fnMakeAirTrkList]" + err.message);
//    }
//}


////////////////////////API////////////////////////////