////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
//$(function () {
//
//});

//모바일 화물추적 버튼 이벤트
$(document).on("click", "#mo_Layer_SearchTracking", function () {
    $("#Layer_S_BL_NO").val("");

    if (_fnToNull($("#mo_Layer_T_HBL_NO").val()) == "") {
        _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
        return false;
    } else {
        $("#Layer_S_BL_NO").val($("#mo_Layer_T_HBL_NO").val().replace(/ /gi, ""));
        fnGetLayerTrkData($("#mo_Layer_T_HBL_NO").val().replace(/ /gi,""));
    }
});

//모바일 공통 화물 추적 엔터키 이벤트
$(document).on("keyup", "#mo_Layer_T_HBL_NO", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#mo_Layer_T_HBL_NO").val()) == "") {
            _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
            return false;
        } else {
            $("#Layer_S_BL_NO").val($("#mo_Layer_T_HBL_NO").val().replace(/ /gi, ""));
            fnGetLayerTrkData($("#mo_Layer_T_HBL_NO").val().replace(/ /gi, ""));
        }
    }
});

//공통 화물 추적 버튼 이벤트
$(document).on("click", "#Layer_SearchTracking", function () {
    $("#Layer_S_BL_NO").val("");

    if (_fnToNull($("#Layer_T_HBL_NO").val()) == "") {
        _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
        return false;
    } else {
        $("#Layer_S_BL_NO").val($("#Layer_T_HBL_NO").val().replace(/ /gi, ""));
        fnGetLayerTrkData($("#Layer_T_HBL_NO").val().replace(/ /gi, ""));
    }
});


//공통 화물 추적 엔터키 이벤트
$(document).on("keyup", "#Layer_T_HBL_NO", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Layer_T_HBL_NO").val()) == "") {
            _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
            return false;
        } else {
            $("#Layer_S_BL_NO").val($("#Layer_T_HBL_NO").val().replace(/ /gi, ""));
            fnGetLayerTrkData($("#Layer_T_HBL_NO").val().replace(/ /gi, ""));
        }
    }
});

//레이어 안 공통 화물 추적 버튼 이벤트
$(document).on("click", "#btn_layerTrkList", function () {

    if (_fnToNull($("#Layer_S_BL_NO").val()) == "") {
        _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
        return false;
    } else {
        fnGetLayerTrkData($("#Layer_S_BL_NO").val().replace(/ /gi, ""));
    }
});

//레이어 안 공통 화물 추적 엔터 키 이벤트
$(document).on("keyup", "#Layer_S_BL_NO", function (e) {

    if (e.keyCode == 13) {
        if (_fnToNull($("#Layer_S_BL_NO").val()) == "") {
            _fnAlertMsg("MBL , HBL , CntrNo 중 하나를 입력 해 주세요.");
            return false;
        } else {
            fnGetLayerTrkData($("#Layer_S_BL_NO").val().replace(/ /gi, ""));
        }
    }

});

$(document).on("click", ".nav_toggle", function () {
    if ($("#header.sub").hasClass("close")) {
        sessionStorage.setItem("key1", "N");
    } else {
        sessionStorage.setItem("key1", "Y");
    }
});

//로그아웃 버튼 이벤트
$(document).on("click", "#login_btn", function () {    
    _fnLogout();
});

/////////////////////function///////////////////////////////////
////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
    ////로그아웃 (세션 , 쿠키 삭제)
    $.ajax({
        type: "POST",
        url: "/Main/fnLogOut",
        async: false,
        success: function (result, status, xhr) {
            location.href = window.location.origin;
        }
    });
}

//레이어 팝업 화물추적 함수
function fnGetLayerTrkData(vBLNO) {
    try {
        var objJsonData = new Object();
                
        objJsonData.BL_NO = vBLNO

        $.ajax({
            type: "POST",
            url: "/Sub/fnGetTracking",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    $("#layer_trk_list").empty();
                    fnMakeLayerTrkData(JSON.parse(result));
                    layerPopup('#trackingList');
                }
                else if (JSON.parse(result).Result[0]["trxCode"] != "Y") {
                    _fnAlertMsg("화물 추적 할 수 없는 데이터 입니다.");
                }
                
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnGetLayerTrkData]" + err.message);
    }
}

//////////////////////function makelist////////////////////////
//트레킹 데이터 그리기
function fnMakeLayerTrkData(rtnJson) {
    try {
        var apdVal = "";
        var rtnTbl = rtnJson.Table1;

        var vChkOn = false;

        if (_fnToNull(rtnTbl) != "") {
            $(rtnTbl).each(function (i) {

                if (rtnTbl[i].EX_IM_TYPE == "E") { //수출
                    if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
                        //apdVal += "	<div class='track_stat on import'> ";
                        if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                            apdVal += "	<div class='track_stat on last export'> ";
                        } else {
                            apdVal += "	<div class='track_stat on export'> ";
                        }
                        vChkOn = true

                    } else {
                        if (vChkOn) {
                            if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                                apdVal += "	<div class='track_stat last export'> ";
                            } else {
                                apdVal += "	<div class='track_stat yet export'> ";
                            }
                        } else {
                            apdVal += "	<div class='track_stat export'> ";
                        }
                    }
                    apdVal += "            <div class='track_proc'> ";
                    apdVal += "                <div class='track_cell'> ";
                    apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
                    apdVal += "                </div> ";
                    apdVal += "            </div> ";
                    apdVal += "            <div class='track_process'> ";
                    apdVal += "                <div class='track_inner'> ";
                    apdVal += "                    <div class='track img'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track loc'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                            <p class='title'>LOCATION</p> ";
                    apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track dnt'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                            <p class='title'>DATE AND TIME</p> ";
                    apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track etc'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    //if (i == 2) {
                    //    apdVal += "                        <button type='button' class='btn_track' name='layerTerminal' id='layerTerminal'>터미널 정보</button> ";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //} else if (i == 3) {
                    //    apdVal += "                       <button type='button' class='btn_track' name='layerLocation' id='layerLocation'>실시간 위치정보</button> ";
                    //    apdVal += "                            <p style='display:none'> </p> ";
                    //    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
                    //} else if (i == 4) {
                    //    apdVal += "                       <button type='button' class='btn_track' name='layerUnipass' id='layerUnipass' >UNIPASS</button>";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
                    //}
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                </div> ";
                    apdVal += "            </div> ";
                    apdVal += "        </div>";
                }
                else if (rtnTbl[i].EX_IM_TYPE == "I") { //수입
                    if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].ROW_COUNT)) {
                        //apdVal += "	<div class='track_stat on import'> ";
                        if (_fnToNull(rtnTbl[i].SEQ) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                            apdVal += "	<div class='track_stat on last import'> ";
                        } else {
                            apdVal += "	<div class='track_stat on import'> ";
                        }
                        vChkOn = true

                    } else {
                        if (vChkOn) {
                            if (_fnToNull(rtnTbl[i].ROW_COUNT) == _fnToNull(rtnTbl[i].MAX_SEQ)) {
                                apdVal += "	<div class='track_stat last import'> ";
                            } else {
                                apdVal += "	<div class='track_stat yet import'> ";
                            }
                        } else {
                            apdVal += "	<div class='track_stat import'> ";
                        }
                    }
                    //if (_fnToNull(rtnTbl[i].SEQ) == (i + 3)) {
                    //    //apdVal += "	<div class='track_stat on import'> ";
                    //    if (rtnTbl.length == (i + 1)) {
                    //        apdVal += "	<div class='track_stat on last import'> ";
                    //    } else {
                    //        apdVal += "	<div class='track_stat on import'> ";
                    //    }
                    //    vChkOn = true
                    //
                    //} else {
                    //    if (vChkOn) {
                    //        if (rtnTbl.length == (i + 1)) {
                    //            apdVal += "	<div class='track_stat last import'> ";
                    //        } else {
                    //            apdVal += "	<div class='track_stat yet import'> ";
                    //        }
                    //    } else {
                    //        apdVal += "	<div class='track_stat import'> ";
                    //    }
                    //}

                    apdVal += "            <div class='track_proc'> ";
                    apdVal += "                <div class='track_cell'> ";
                    apdVal += "                    <p>" + _fnToNull(rtnTbl[i].EVENT_NM) + "</p> ";
                    apdVal += "                </div> ";
                    apdVal += "            </div> ";
                    apdVal += "            <div class='track_process'> ";
                    apdVal += "                <div class='track_inner'> ";
                    apdVal += "                    <div class='track img'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track loc'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                            <p class='title'>LOCATION</p> ";
                    apdVal += "                            <p>" + _fnToNull(rtnTbl[i].ACT_LOC_NM) + "</p> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track dnt'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    apdVal += "                            <p class='title'>DATE AND TIME</p> ";
                    apdVal += "                            <p>" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_YMD)) + "<br />" + _fnDateFormat(_fnToNull(rtnTbl[i].ACT_HM)) + "</p> ";
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                    <div class='track etc'> ";
                    apdVal += "                        <div class='track_cell'> ";
                    //if (i == 3) {
                    //    apdVal += "                        <button type='button' class='btn_track' name='layerTerminal'id='layerTerminal'>터미널 정보</button> ";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //} else if (i == 0) {
                    //    apdVal += "                       <button type='button' class='btn_track' name='layerLocation'id='layerLocation'>실시간 위치정보</button> ";
                    //    apdVal += "                            <p style='display:none'> </p> ";
                    //    apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].VSL) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POL_CD) + "</p> ";
                    //    //apdVal += "                            <p style='display:none'>" + _fnToNull(rtnTbl[i].POD_CD) + "</p> ";
                    //} else if (i == 2) {
                    //    apdVal += "                       <button type='button' class='btn_track' name='layerUnipass' id='layerUnipass' >UNIPASS</button>";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].HBL_NO) + "</p> ";
                    //    apdVal += "                       <p style='display:none'>" + _fnToNull(rtnTbl[i].ETD) + "</p> ";
                    //}
                    apdVal += "                        </div> ";
                    apdVal += "                    </div> ";
                    apdVal += "                </div> ";
                    apdVal += "            </div> ";
                    apdVal += "        </div>";
                }
            });
            $("#layer_trk_list").append(apdVal);
            //drawingLayerNodata();
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
            $("#layer_trk_list").append(apdVal);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerTrkData]" + err.message);
    }
}
/////////////////////////////API///////////////////////////////


