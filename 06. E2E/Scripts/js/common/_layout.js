////////////////////전역 변수//////////////////////////
var _isConfirm;
var _initPage = "";
var Login_Count = 0;
var _objTrkJsonData = new Object();
////////////////////jquery event///////////////////////
$(function () {

    //로그인 아이디 저장 체크가 되어있을 시 데이터 넣는 로직
    var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_ITI0");
    if (_fnToNull(userInputId) != "") {
        $("#Login_ID").val(userInputId);
        $("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' class='chk' checked>");
    }

    //파라미터가 LoginPopup Y 가 있을 경우 로그인 레이어 팝업이 뜨게 끔 하는 로직
    if (_getParameter("LoginPopup") == "Y" && _fnToNull($("#Session_USR_ID").val()) == "") {
        fnShowLoginLayer("init");
    }

    //만약 파트너로 로그인이 되어있을 경우 
    if (_fnToNull($("#Session_USR_TYPE").val()) != "") {
        if (_fnToNull($("#Session_USR_TYPE").val()) == "P") {
            $(".login_info").addClass("partner");
        }
    }

});

//Confrim 이벤트
$(document).on("click", "#alert02_confirm", function () {
    _isConfirm = true;
});

//Confrim 이벤트
$(document).on("click", "#alert02_cencel", function () {
    _isConfirm = false;
});

//PC - 화물추적 버튼 이벤트
$(document).on("click", "#Pc_btn_Tracking", function () {
    if (_fnToNull($("#Pc_Input_Tracking").val()) != "") {
        $("#Pc_Input_Tracking_Layer").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
        fngetLayerTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnAlertMsg("검색할 번호를 입력해주세요");
    }
});

//PC - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Pc_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Pc_Input_Tracking").val()) != "") {
            $("#Pc_Input_Tracking_Layer").val($("#Pc_Input_Tracking").val().toUpperCase().trim());
            fngetLayerTracking($("#Pc_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg("검색할 번호를 입력해주세요");
        }
    }
});

//모바일 - 화물추적 버튼 이벤트
$(document).on("click", "#Mo_btn_Tracking", function () {
    if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
        $("#Pc_Input_Tracking_Layer").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
        fngetLayerTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
    } else {
        _fnAlertMsg("검색할 번호를 입력해주세요");
    }
});

//모바일 - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Mo_Input_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Mo_Input_Tracking").val()) != "") {
            $("#Pc_Input_Tracking_Layer").val($("#Mo_Input_Tracking").val().toUpperCase().trim());
            fngetLayerTracking($("#Mo_Input_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg("검색할 번호를 입력해주세요");
        }
    }
});

//레이어 팝업 내에서 검색
$(document).on("click", "#L_btnAirTrkSearch", function () {
    fngetLayerTracking($("#Layer_L_Tracking").val().toUpperCase().trim(), $("#Layer_L_Tracking").val().toUpperCase().trim());
});

//모바일 - 화물추적 버튼 엔터 이벤트
$(document).on("keyup", "#Layer_L_Tracking", function (e) {
    if (e.keyCode == 13) {
        if (_fnToNull($("#Layer_L_Tracking").val()) != "") {
            fngetLayerTracking($("#Layer_L_Tracking").val().toUpperCase().trim(), "");
        } else {
            _fnAlertMsg("검색할 번호를 입력해주세요");
        }
    }
});

//해운 - 화물추적 레이어 안에 검색 버튼 이벤트
$(document).on("click", "#btnSeaTrkSearch", function (){
    fngetLayerTracking($("#SVT_P_HBL_NO").val().toUpperCase().trim(), $("#SVT_P_CNTR_NO").val().toUpperCase().trim());
});

//항공 - 화물추적 레이어 안에 검색 버튼 이벤트
$(document).on("click", "#btnAirTrkSearch", function () {
    fngetLayerTracking($("#LF_P_HBL_NO").val().toUpperCase().trim(), $("#LF_P_CNTR_NO").val().toUpperCase().trim());
});

//로그인 버튼 클릭 이벤트
$(document).on("click", "#Login_btn", function () {
    if (Login_Count == -3) {
        _fnLayerAlertMsg("보안문자를 그려주세요");
    } else {
        _fnLogin();
    }
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_ID", function (e) {
    if (e.keyCode == 13) {
        if (Login_Count == -3) {
            _fnLayerAlertMsg("보안문자를 그려주세요");
        } else {
            if (_fnToNull($("#Login_Password").val()) != "") {
                _fnLogin();
            } else {
                $("#Login_Password").focus();
            }
        }
    }
});

$(document).on("focus", "#Login_ID", function (e) {
    $("#Password_Warning").hide();
});

$(document).on("focus", "#Login_Password", function (e) {
    $("#Email_Warning").hide();
});

//로그인 엔터 이벤트
$(document).on("keyup", "#Login_Password", function (e) {
    if (e.keyCode == 13) {
        if (Login_Count == -3) {
            _fnLayerAlertMsg("보안문자를 그려주세요");
        } else {
            _fnLogin();
        }
    }
});

//로그인 모션캡처 '새로고침' 버튼 이벤트 
$(document).on("click", ".refresh", function (e) {
    var vHTML = "";
    vHTML += "<div id=\"mc\">";
    vHTML += "<canvas id=\"mc-canvas\"  width=\"220\" height=\"200\"  class=\"mc-valid\"></canvas>";
    vHTML += "</div> ";

    $("#Captcha_Area").empty();
    $("#Captcha_Area").append(vHTML);

    //mc-form => Captcha_Area
    $('#Captcha_Area').motionCaptcha({
        action: '#fairly-unique-id',
        shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail']
    });
});

//첫번째 리스트 중 Tracking Data를 보여주기 위한 함수
$(document).on("click", ".Layer_clickevent", function () {

    var vThis = $(this).closest(".layer_wanna_open");
    var vObject = new Object();
    vObject.This = vThis;
    vObject.HBL_NO = vThis.find("input[type='hidden']").eq(0).val();
    vObject.CNTR_NO = vThis.find("input[type='hidden']").eq(1).val();
    vObject.REQ_SVC = vThis.find("input[type='hidden']").eq(2).val();
    vObject.EX_IM_TYPE = vThis.find("input[type='hidden']").eq(3).val();

    fnGetLayerTrackingDetail(vObject);

    var $par = $(this).closest('.layer_wanna_open');
    var inx = $par.index();
    if ($par.hasClass('open') == true) {
        $('.layer_wanna_open:eq(' + inx + ')').find('.Layer_tracking_box').stop().slideUp();
        $par.removeClass('open');
    }
    else {
        if ($('.layer_wanna_open').hasClass('open')) {
            $('.layer_wanna_open').removeClass('open');
            $('.layer_wanna_open').find('.Layer_tracking_box').slideUp();
        }
        $('.layer_wanna_open:eq(' + inx + ')').addClass('open');
        $par.find('.Layer_tracking_box').slideDown();
    }
});

//화물추적 디테일 검색 버튼 클릭 이벤트
$(document).on("click", "button[name='btn_LayerTrkDTL']", function () {

    var vThis = $(this).closest(".layer_wanna_open");
    var vObject = new Object();
    vObject.This = vThis;
    vObject.HBL_NO = vThis.find("input[type='hidden']").eq(0).val();
    vObject.CNTR_NO = vThis.find("input[type='hidden']").eq(1).val();
    vObject.REQ_SVC = vThis.find("input[type='hidden']").eq(2).val();
    vObject.EX_IM_TYPE = vThis.find("input[type='hidden']").eq(3).val();

    fnGetLayerTrackingDetail(vObject);

    var $par = $(this).closest('.layer_wanna_open');
    var inx = $par.index();
    if ($par.hasClass('open') == true) {
        $('.layer_wanna_open:eq(' + inx + ')').find('.Layer_tracking_box').stop().slideUp();
        $par.removeClass('open');
    }
    else {
        if ($('.layer_wanna_open').hasClass('open')) {
            $('.layer_wanna_open').removeClass('open');
            $('.layer_wanna_open').find('.Layer_tracking_box').slideUp();
        }
        $('.layer_wanna_open:eq(' + inx + ')').addClass('open');
        $par.find('.Layer_tracking_box').slideDown();
    }
});

////////////////////////function///////////////////////
//엘비스 공통 코드 - Service 타입 가져오기
function fnSetServiceType(vSelectID, vREQ_SVC, vPAGE) {
    try {       
        var objJsonData = new Object();

        objJsonData.REQ_SVC = vREQ_SVC;

        $.ajax({
            type: "POST",
            url: "/Common/fnGetServiceType",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeServiceType(vSelectID, vPAGE , result);
            }, error: function (xhr, status, error) {                
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSetServiceType]" + err.message);
    }
}

//로그인 레이어 팝업 보여주기
function fnShowLoginLayer(vValue) {

    if (vValue == "init") {
        _initPage = "";
    } else if (vValue.split(';')[0] == "goSEABooking" || vValue.split(';')[0] == "goAIRBooking") {
        _initPage = vValue;
    } else {
        _initPage = vValue;
    }

    layerPopup2("#login_pop", false);
    $("#Login_Password").val("");
    $("#Login_ID").focus();
}

function fngetLayerTracking(vMngtNo,vCntrNo) {
    try {        
        _objTrkLayer = new Object();

        if (isLayerChkBL(vMngtNo, vCntrNo)) {

            fnTrkLayerInit(); //초기화

            if (_objTrkLayer.REQ_SVC == "SEA") {
                if (fnLayerChkTokenExpire()) {
                    $("#SVT_P_HBL_NO").val(vMngtNo);
                    $("#SVT_P_CNTR_NO").val(vCntrNo);
                    _objTrkLayer.HBL_NO = vMngtNo;
                    _objTrkLayer.CNTR_NO = vCntrNo;
                    _objTrkLayer.OFFICE_CD = _Office_CD;
                    fnLayerTrkList("SEA");
                }
                else {
                    layerClose('#SVT_tracking_layer');                    
                }
            } else if (_objTrkLayer.REQ_SVC == "AIR") {

                //Delivery Pop을 띄어주는 로직으로 변경.
                $("#LF_P_HBL_NO").val(vMngtNo);
                $("#LF_P_CNTR_NO").val(vCntrNo);
                _objTrkLayer.HBL_NO = vMngtNo;
                _objTrkLayer.CNTR_NO = vCntrNo;
                _objTrkLayer.OFFICE_CD = _Office_CD;
                fnLayerTrkList("AIR");
            }
        }
        else
        {
            layerClose('#L_delivery_pop');
            layerClose('#SVT_tracking_layer');
        }
    }
    catch (err) {
        console.log("[Error - fnfngetLayerTracking()]" + err.message);
    }
}

//화물추적 B/L 제출 되었는지 확인
function isLayerChkBL(vMngtNo,vCntrNo) {
    try {
        var isBoolean = true;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vMngtNo;
        objJsonData.CNTR_NO = vCntrNo;
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Home/fnIsCheckBL",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //엘비스 - 제출 여부 확인

                    if (JSON.parse(result).Check[0]["CHKBL_YN"] == "Y") {
                        _objTrkLayer.HBL_NO = JSON.parse(result).Check[0]["HBL_NO"];
                        _objTrkLayer.MBL_NO = JSON.parse(result).Check[0]["MBL_NO"];
                        _objTrkLayer.REQ_SVC = JSON.parse(result).Check[0]["REQ_SVC"];
                        _objTrkLayer.TOKEN = JSON.parse(result).Check[0]["TOKEN"];
                        _objTrkLayer.EXPIREDDT = JSON.parse(result).Check[0]["EXPIREDDT"] //  만료일 추가 , 쿼리로 수정 필요
                        _objTrkLayer.SCAC_CD = JSON.parse(result).Check[0]["SCAC_CD"];
                        _objTrkLayer.ID = JSON.parse(result).Check[0]["ID"];
                        _objTrkLayer.PWD = JSON.parse(result).Check[0]["PWD"];

                        isBoolean = true;
                    }
                    else if (JSON.parse(result).Check[0]["CHKBL_YN"] == "N") {
                        _fnAlertMsg2("B/L 제출을 해주시기 바랍니다.");
                        isBoolean = false;
                    } else {
                        _fnAlertMsg2("담당자에게 문의 하세요.");
                        isBoolean = false;
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg2("Tracking 정보가 없습니다");
                    isBoolean = false;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg2("B/L 정보가 없습니다");
                    isBoolean = false;
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg2("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return isBoolean;
    }
    catch (err) {
        console.log("[Error - isLayerChkBL()]" + err.message);
    }

}

function fnLayerChkTokenExpire() {
    try {
        var vBoolean = true;

        //토큰 만료 체크 확인
        $.ajax({
            url: "https://svmp.seavantage.com/api/v1/user/me",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(_objTrkLayer.ID + ":" + _objTrkLayer.PWD));
            },
            type: "GET",
            async: false,
            dataType: "json",
            success: function (result) {
                if (result.message == "OK") {
                    //vBoolean = true;

                    GetTokenTime = new Date(_objTrkLayer.EXPIREDDT); // db에 저장된 만료 시간 
                    nowTime = new Date(); // 현재 시간

                    //현재 시간이 만료 시간을 지났을 경우 or 토큰 값이 null인 경우  갱신
                    if (GetTokenTime.getTime() < nowTime.getTime() || _fnToNull(_objTrkLayer.TOKEN) == "") {
                        vBoolean = false;
                        vBoolean = fnSetLayerSvtgAuthToken();
                    }
                    else {
                        if (_objTrkLayer.TOKEN == result.response.authToken) {
                            vBoolean = true;
                        }
                        // 만료는 안되었지만 토큰 값이 저장된 값과 다를 때 
                        else {
                            vBoolean = false;
                            vBoolean = fnSetLayerSvtgAuthToken();
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
        console.log("[Error - fnLayerChkTokenExpire()]" + err.message);
    }
}

//레이어 팝업 - 토큰 갱신
function fnSetLayerSvtgAuthToken() {
    try {
        var vBoolean = false;
        var objJsonData = new Object();
        objJsonData.SVTG_ID = _objTrkLayer.ID;
        objJsonData.SVTG_PWD = _objTrkLayer.PWD;

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
                                _objTrkLayer.TOKEN = result.response.tokenId;
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


function fnLayerTrkList(vREQ_SVC) {
    try {

        if (vREQ_SVC == "SEA") {
            layerPopup2('#SVT_tracking_layer');

            //TWKIM 20221005 PREFIX 삭제 로직 추가
            if (_objTrkLayer.SCAC_CD == "CKCO" || _objTrkLayer.SCAC_CD == "COSU" || _objTrkLayer.SCAC_CD == "EGLV" || _objTrkLayer.SCAC_CD == "HDMU" || _objTrkLayer.SCAC_CD == "MAEU" || _objTrkLayer.SCAC_CD == "MCPU" || _objTrkLayer.SCAC_CD == "ONEY" || _objTrkLayer.SCAC_CD == "POBU" || _objTrkLayer.SCAC_CD == "SMLM") {
                _objTrkLayer.MBL_NO = _objTrkLayer.MBL_NO.replace(_objTrkLayer.SCAC_CD, "");
            }

            $("#SVT_layer_map").attr("src", "https://svmp.seavantage.com/#/cargo/tracking?authToken=" + _objTrkLayer.TOKEN + "&mblNo=" + _objTrkLayer.MBL_NO + "&hiddenPanel=all");

            $.ajax({
                type: "POST",
                url: "/Home/GetSeaTrackingList",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(_objTrkLayer) },
                success: function (result) {
                    layerClose('#L_delivery_pop');
                    fnMakeLayerSeaTrkList(result);
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
            //layerPopup2('#L_delivery_pop');
            $.ajax({
                type: "POST",
                url: "/Home/GetAirTrackingList",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(_objTrkLayer) },
                success: function (result) {                    
                    layerClose('#SVT_tracking_layer');                    

                    //받은 데이터 Y / N 체크
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        //데이터 그려주기
                        fnMakeLayerLAirTrkList(result);
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnAlertMsg("화물추적 데이터가 없습니다.");
                        console.log("[Fail : fnLayerTrkList(" + vREQ_SVC+")]" + JSON.parse(result).Result[0]["trxMsg"]);                       
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {                        
                        console.log("[Error : fnLayerTrkList(" + vREQ_SVC +")]" + JSON.parse(result).Result[0]["trxMsg"]);
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
        console.log("[Error - fnLayerTrkList(" + vREQ_SVC +")]" + err.message);
    }
}

//화물추적 데이터 - Detail 부분만 데이터 가져오기
function fnGetLayerTrackingDetail(vObject) {
    try {

        var rtnJson;
        var objJsonData = new Object();

        objJsonData.HBL_NO = vObject.HBL_NO;
        objJsonData.CNTR_NO = vObject.CNTR_NO;
        objJsonData.REQ_SVC = vObject.REQ_SVC;
        objJsonData.EX_IM_TYPE = vObject.EX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Home/GetTrackingDetail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                //받은 데이터 Y / N 체크
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    //데이터 그려주기                    
                    fnMakeLayerAirTrackingData(vObject.This, result);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    console.log("[Fail : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg2("Tracking 정보가 없습니다");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    $(".delivery_status").hide();
                    console.log("[Error : getTracking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                    _fnAlertMsg2("[Error]관리자에게 문의 해 주세요.");
                }
            }, error: function (xhr, status, error) {
                _fnLayerAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetTracking()]" + err.message);
    }
}

//화물추적 초기화
function fnTrkLayerInit() {
    try {                
        $("#layer_tracking_List").empty();

        //씨벤티지 누를때마다 초기화가 안되서 지웠다가 다시 그림
        $("#SVT_layer_Area").empty();
        var vHTML = "";
        vHTML += "<iframe src=\"\" id=\"SVT_layer_map\" class=\"map\" width=\"100%\" height=\"100%\"></iframe>";
        $("#SVT_layer_Area")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnTrkInit]" + err.message);
    }
}

//로그인 함수
function _fnLogin() {
    try {
        //로그인 체크
        if ($("#Login_ID").val() == "") {
            $("#Password_Warning").hide();
            $("#Email_Warning").show();
            $("#Login_ID").focus();
            return false;
        }
        else {
            $("#Email_Warning").hide();
        }
        if ($("#Login_Password").val() == "") {
            $("#Email_Warning").hide();
            $("#Password_Warning").show();
            $("#Login_Password").focus();
            return false;
        }
        else {
            $("#Password_Warning").hide();
        }

        var objJsonData = new Object();
        objJsonData.USR_ID = $("#Login_ID").val();
        objJsonData.PSWD = $("#Login_Password").val();

        $.ajax({
            type: "POST",
            url: "/Home/fnLogin",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    if (JSON.parse(result).Table[0].APV_YN == "Y") {
                        //아이디 저장 체크 일 경우 쿠키에 저장
                        if ($('input[name=login_keep]')[0].checked) {
                            _fnSetCookie("Prime_CK_USR_ID_REMEMBER_ITI0", JSON.parse(result).Table[0].USR_ID, "168");
                        } else {
                            _fnDelCookie("Prime_CK_USR_ID_REMEMBER_ITI0");
                        }

                        var vUserType = JSON.parse(result).Table;

                        $.ajax({
                            type: "POST",
                            url: "/Home/SaveLogin",
                            async: true,
                            data: { "vJsonData": _fnMakeJson(JSON.parse(result)) },
                            success: function (result, status, xhr) {

                                if (_fnToNull(result) == "Y") {
                                    if (_initPage.split(';')[0] == "goSEABooking") {
                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_SEA");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("POL_CD", $("#input_SEA_POL").val());
                                        sessionStorage.setItem("POD_CD", $("#input_SEA_POD").val());
                                        sessionStorage.setItem("POL_NM", $("#input_SEA_Departure").val());
                                        sessionStorage.setItem("POD_NM", $("#input_SEA_Arrival").val());
                                        sessionStorage.setItem("ETD", $("#input_SEA_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", $("#select_SEA_CntrType").find("option:selected").val());
                                        sessionStorage.setItem("LINE_TYPE", 'SEA');

                                        //여기서 유저 타입이 P면 B/L로 보내기                                         
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            window.location = window.location.origin;
                                        } else {
                                            controllerToLink("Regist", "Booking", objJsonData);
                                        }
                                    }                                    
                                    else if (_initPage.split(';')[0] == "goAIRBooking") {
                                        var objJsonData = new Object();
                                        objJsonData.SCH_NO = _initPage.split(';')[1];
                                        sessionStorage.setItem("BEFORE_VIEW_NAME", "MAIN_AIR");
                                        sessionStorage.setItem("VIEW_NAME", "REGIST");
                                        sessionStorage.setItem("POL_CD", $("#input_AIR_POL").val());
                                        sessionStorage.setItem("POD_CD", $("#input_AIR_POD").val());
                                        sessionStorage.setItem("POL_NM", $("#input_AIR_Departure").val());
                                        sessionStorage.setItem("POD_NM", $("#input_AIR_Arrival").val());
                                        sessionStorage.setItem("ETD", $("#input_AIR_ETD").val());
                                        sessionStorage.setItem("CNTR_TYPE", 'L');
                                        sessionStorage.setItem("LINE_TYPE", 'AIR');

                                        //여기서 유저 타입이 P면 B/L로 보내기
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            window.location = window.location.origin;
                                        } else {
                                            controllerToLink("Regist", "Booking", objJsonData);
                                        }
                                    } else {
                                        //여기서 유저 타입이 P면 메인으로 보내기
                                        if (_fnToNull(vUserType[0]["USR_TYPE"]) == "P") {
                                            //문서 관리 - B/L 조회 일때는 바로 보내주기
                                            if (_initPage == "/Document/BL") {
                                                window.location = window.location.origin + _initPage;
                                            } else {
                                                window.location = window.location.origin;
                                            }
                                        } else {
                                            if (_initPage == "") {
                                                window.location = window.location.origin + "/MyBoard/MyBoard";
                                            } else {
                                                window.location = window.location.origin + _initPage;
                                            }
                                        }
                                    }
                                }
                                else if (_fnToNull(result) == "N") {
                                    console.log("[Fail : fnLogin()]");
                                    _fnLayerAlertMsg("관리자에게 문의 하세요");
                                }
                                else {
                                    console.log("[Error : fnLogin()]" + _fnToNull(result));
                                    _fnLayerAlertMsg("관리자에게 문의 하세요");
                                }
                            }
                        });
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "N") {
                        _fnLayerAlertMsg("승인이 되지 않았습니다. 담당자에게 문의 하세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "D") {
                        _fnLayerAlertMsg("가입 승인이 거절 되었습니다. 메일에서 거절 사유를 확인 해 주세요.");
                    }
                    else if (JSON.parse(result).Table[0].APV_YN == "S") {
                        _fnLayerAlertMsg("아이디가 정지 되었습니다. 담당자에게 문의 하세요.");
                    }
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnLayerAlertMsg("아이디 혹은 비밀번호가 틀렸습니다");
                    if (Login_Count >= 0) {
                        Login_Count++;  //로그인 횟수 체크
                    }
                }

                //5번 로그인 틀렸을 시 보안문자 생성
                if (Login_Count > 5 || Login_Count == -1) {
                    Login_Count = -3;
                    $(".security_char").show(); //로그인 버튼 비활성화
                    var vHTML = "";
                    vHTML += "<div id=\"mc\">";
                    vHTML += "<canvas id=\"mc-canvas\"  width=\"220\" height=\"200\"  class=\"mc-valid\"></canvas>";
                    vHTML += "</div> ";

                    $("#Captcha_Area").empty();
                    $("#Captcha_Area").append(vHTML);
                                        
                    $('#Captcha_Area').motionCaptcha({
                        action: '#fairly-unique-id',
                        shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail']
                    });
                }
            }, error: function (xhr) {
                console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                console.log(xhr);
                return;
            }, beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바 

            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바 
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
    $.ajax({
        type: "POST",
        url: "/Home/LogOut",
        async: false,
        success: function (result, status, xhr) {

            $("#Session_USR_ID ").val("");
            $("#Session_LOC_NM ").val("");
            $("#Session_EMAIL").val("");
            $("#Session_CUST_CD").val("");
            $("#Session_HP_NO").val("");
            $("#Session_DOMAIN").val("");
            $("#Session_OFFICE_CD").val("");
            $("#Session_AUTH_KEY").val("");
            $("#Session_USR_TYPE").val("");

            location.href = window.location.origin;
        }
    });
}

//같은 Port를 선택 하였는지 체크 
//vPort = Port Code 명
//vREQ_SVC = SEA / AIR 
//vPOL_POD = POL / POD 
//vType = Q (즐겨찾기) , A (자동완성)
//vPopID = 즐겨찾기 ID 
function _fnCheckSamePort(vPort,vREQ_SVC,vPOL_POD,vType,vPopID) {
	try {

		var vPortPOL = "";
		var vPortPOD = "";

        //POL , POD 세팅
		if (vPOL_POD == "POL") {
            vPortPOL = vPort;
            if (vREQ_SVC != "") {
                vPortPOD = _fnToNull($("#input_" + vREQ_SVC + "_POD").val());
            } else {
                vPortPOD = _fnToNull($("#input_POD").val());
            }
		}
        else if (vPOL_POD == "POD") {
            if (vREQ_SVC != "") {
                vPortPOL = _fnToNull($("#input_" + vREQ_SVC + "_POL").val());
            } else {
                vPortPOL = _fnToNull($("#input_POL").val());
            }            
            vPortPOD = vPort;
        }

        //POL CD와 POD CD 비교
        if (vPortPOL == vPortPOD) {
            var vInit = "";     //TEXT 초기화 
            var vInitCD = "";   //Code 초기화

            //Focus On
            if (vPOL_POD == "POL") {
                if (vREQ_SVC != "") {                    
                    vInit = "input_" + vREQ_SVC + "_POL";
                    vInitCD = "input_" + vREQ_SVC + "_Departure";
                }
                else {                    
                    vInit = "input_POL";
                    vInitCD = "input_Departure";
                }
            } else if (vPOL_POD == "POD") {
                if (vREQ_SVC != "") {
                    vInit = "input_" + vREQ_SVC + "_POD";
                    vInitCD = "input_" + vREQ_SVC + "_Arrival";
                }
                else {
                    vInit = "input_POD";
                    vInitCD = "input_Arrival";
                }
            }

            if (vType == "Q") { //Quick 즐겨찾기 포트 
                _fnAlertMsg("출발지와 도착지의 Port가 동일 합니다.", vInitCD);
                _QuickMenu = vPopID;                
                $("#" + vInit).val("");
                $("#" + vInitCD).val("");
            }
            else if (vType == "A") { //Auto 자동완성 
                _fnAlertMsg("출발지와 도착지의 Port가 동일 합니다.", vInitCD);
            }

            return false;
        }
        return true; 
	}
	catch (err) {
		console.log("[Error - fnCheckSamePort]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//엘비스 공통 코드 - Service 타입 그려주기
function fnMakeServiceType(vSelectID, vPAGE, vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Service;

            if (vPAGE == "SCH") {
                vHTML += "<option value=\"\">Service</option>";
            }

            $.each(vResult, function (i) {
                vHTML += "<option value=\"" + vResult[i].CODE + "\">" + vResult[i].NAME + "</option>";
            });

            $(vSelectID)[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeServiceType]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Fail - fnMakeServiceType]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeServiceType]" + err.message);
    }
}

//씨벤티지 - 레이어 화물 추적 데이터 리스트
function fnMakeLayerSeaTrkList(vJsonData) {

    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).TrackingList;

            $("#SVT_Trk_Layer_MBL_NO").empty();
            $("#SVT_Trk_Layer_HBL_NO").empty();
            $("#SVT_Trk_Layer_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
            $("#SVT_Trk_Layer_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));

            if (_fnToNull(vResult) != "") {
                $("#SVT_layer_trackAppend").empty();

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
                $("#SVT_layer_trackAppend").append(vHTML);
                $(".SVT_layer_delivery_status").show();
            } else {
                $(".SVT_layer_delivery_status").hide();
            }
        } else {
            $(".SVT_layer_delivery_status").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerSeaTrkList]" + err.message);
    }
}

//LeafLet - 레이어 화물 추적 데이터 리스트
//function fnMakeLayerLFAirTrkList(vJsonData) {
//        
//    try {
//    
//        var vHTML = "";
//        var vResult = "";
//    
//        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
//            vResult = JSON.parse(vJsonData).TrackingList;
//    
//            $("#LF_Trk_Layer_MBL_NO").empty();
//            $("#LF_Trk_Layer_HBL_NO").empty();
//            $("#LF_Trk_Layer_MBL_NO").append(_fnToNull(vResult[0].MBL_NO));
//            $("#LF_Trk_Layer_HBL_NO").append(_fnToNull(vResult[0].HBL_NO));
//    
//            if (_fnToNull(vResult) != "") {
//                $("#LF_layer_trackAppend").empty();
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
//                $("#LF_layer_trackAppend").append(vHTML);
//                $(".LF_layer_delivery_status").show();
//            } else {
//                $(".LF_layer_delivery_status").hide();
//            }
//        } else {
//            $(".LF_layer_delivery_status").hide();
//        }
//    }
//    catch (err) {
//        console.log("[Error - fnMakeLayerAirTrkList]" + err.message);
//    }
//}

//리스트 형식 - 레이어 화물 추적 데이터 리스트
function fnMakeLayerLAirTrkList(vJsonData) {
    try {
        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            vResult = JSON.parse(vJsonData).Main;

            if (_fnToNull(vResult) != "") {
                layerPopup2('#L_delivery_pop');
                $("#layer_tracking_List").empty();
                $("#Layer_L_Tracking").val(_fnToNull(vResult[0].HBL_NO));

                $(vResult).each(function (i) {

                    vHTML += "   <div class=\"trk_box layer_wanna_open\"> ";
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
                        vHTML += "      	<button class=\"btn_open Layer_clickevent\"></button> ";
                    } else {
                        vHTML += "      	<button class=\"btn_open\" name=\"btn_LayerTrkDTL\"></button> ";
                    }

                    vHTML += "      </div> ";
                    vHTML += "      <div class=\"Layer_tracking_box tracking_box\"></div> ";
                    vHTML += "   </div> ";
                });

                $("#layer_tracking_List").append(vHTML);
                $(".Layer_clickevent").click();
            } else {
                _fnAlertMsg("화물추적 데이터가 없습니다.");
            }
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerLAirTrkList]" + err.message);
    }
}

//Air 레이어 화물 추적 마일스톤 데이터 그리기
function fnMakeLayerAirTrackingData(vThis, vJsonData) {
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
                    vHTML += "   					<p style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
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
                    vHTML += "   					<p style='color:#0085b4'>" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
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

            $(vThis.find(".Layer_tracking_box"))[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeLayerAirTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _fnAlertMsg2("관리자에게 문의 하세요.");
            console.log("[Error - fnMakeLayerAirTrackingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerAirTrackingData]" + err.message);
    }
}

////////////////////////API////////////////////////////
