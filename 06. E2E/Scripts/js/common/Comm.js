////////////////////전역 변수//////////////////////////
var vChatHubUrl = "http://chat.elvisprime.com/signalr";
var hubConn = null;
var chatHub = null;
var hubParam;
var closeVar = ""; //ID
var _QuickMenu = "";

////////////////////jquery event///////////////////////

////////////////////////function///////////////////////
$(function () { //ready Function

    strDomain = $("#Session_DOMAIN").val();
    if (strDomain == null) strDomain = _fnToNull(_Domain);
    if (_fnToNull(strDomain) != "") {  //로그인이 되어있을때 만 Connecting을 한다                        
        if (chatHub == null) {

            hubConn = $.hubConnection(vChatHubUrl);
            chatHub = hubConn.createHubProxy('chatHub');
            registerClientMethods(chatHub);
            hubConn.start({ jsonp: true })
                .done(function () {
                    console.log('Now connected, connection ID=' + hubConn.id);
                    if (_fnToNull($("#Session_DOMAIN").val()) != "") {  //로그인 되어있다고 판단
                        var conObj = new Object();
                        conObj.NAME = $("#Session_EMAIL").val();
                        conObj.DOMAIN = strDomain;
                        chatHub.invoke("Connect", conObj);
                    }
                })
                .fail(function () {
                    console.log('Could not connect');
                });
        }
    }

});

function registerClientMethods(chatHub) {
    if (chatHub == null) {
        console.log('Could not connect');
    } else {
        // Calls when user successfully logged in 
        chatHub.on("onConnected", function (id, userName, allUsers, messages) {
            // onConnected 
        });
        chatHub.on("notifyUsers", function (paramList) {
            // Push Notify 
            // JOB_TYPE 정의 
            /*             
            BKG   부킹 => 부킹번호 
            QUO   견적 => 견적번호 
            HBL   비엘 => H/BL번호 
            INV   청구서 => Invoice 번호 
            TRC   화물추적 => H/BL번호, 컨테이너번호 
            */

            hubParam = paramList;   
            var titleText = paramList.MSG;
            var userID = paramList.USR_ID;
            var messageText = "<button type='button' class='btn_go' onclick='goPushPage()'><span>자세히보기</span></button>";
            if (_fnToNull($("#Session_EMAIL").val()) == _fnToNull(userID)) {  //로그인 되어있다고 판단         
                toastr.options.closeButton = true;
                toastr.info(messageText, titleText);
            }
        });
        chatHub.on("onNewUserConnected", function (id, name) {
            //Connect New User 
        });
        chatHub.on("onUserDisconnected", function (id, userName) {
            //DisConnect User 
        });
        chatHub.on("messageReceived", function (userName, message) {
            //MessageReceived 
        });
        chatHub.on("sendPrivateMessage", function (windowId, fromUserName, message) {
            //sendPrivateMessage 1:1 Chat 
        });
    }
}

function Chathub_Push_Message(obj) {
    strDomain = $("#Session_DOMAIN").val();
    if (strDomain == null) strDomain = _fnToNull(_Domain);
    var flagLogin = false;
    if (_fnToNull($("#Session_DOMAIN").val()) != "") flagLogin = true;

    var userId = obj.USR_ID;
    var jobType = obj.JOB_TYPE;
    var Message = obj.MSG;
    var ref1 = obj.REF1;
    var ref2 = obj.REF2;
    var ref3 = obj.REF3;
    var ref4 = obj.REF4;
    var ref5 = obj.REF5;

    var conObj = new Object();

    if (_fnToNull(strDomain) != "") {  //도메인 정보가 있을때만 가능하다

        if (chatHub == null) {  //ChatHub가 값이 없으면 reConnect           

            console.log('Could not connect');
            hubConn = $.hubConnection(vChatHubUrl);
            chatHub = hubConn.createHubProxy('chatHub');
            registerClientMethods(chatHub);

            hubConn.start({ jsonp: true })
                .done(function () {
                    console.log('Now connected, connection ID=' + hubConn.id);
                    if (_fnToNull($("#Session_DOMAIN").val()) != "") {  //로그인 되어있다고 판단
                        var conObj = new Object();
                        conObj.NAME = userId;
                        conObj.DOMAIN = strDomain;
                        chatHub.invoke("Connect", conObj);
                    }
                })
                .fail(function () {
                    console.log('Could not connect');
                });
        } else {
            conObj.NAME = userId;
            conObj.DOMAIN = strDomain;
            chatHub.invoke("Connect", conObj);
        }

        if (userId != "") {
            //도메인|보내는사람|받는사람|요청서비스|구분|형태|메세지|key아이디|            
            var FullMsg = strDomain + "|" + userId + "|" + "" + "|" + "WE" + "|" + "P" + "|" + jobType + "|" + Message + "|" + "" + "|" + ref1 + "|" + ref2 + "|" + ref3 + "|" + ref4 + "|" + ref5;
            // alert(userId);
            chatHub.invoke("prime_Message", strDomain, FullMsg);
            //메세지를 보냈으면 커넥팅을 끊자
            if (flagLogin == false) {   //로그인을 하지 않은상태면 연결을 끊는다
                chatHub.invoke("DisConnect", conObj);
            }

        } else {
            console.log('User ID is Empty');
        }
    }
}

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 4000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 4000)
    toast.classList.add("reveal"),
        toast.innerText = string;
}

function goPushPage() {

    var paramList = new Object();
    paramList.JOB_TYPE = hubParam.JOB_TYPE;
    paramList.REF1 = hubParam.REF1;
    paramList.REF2 = hubParam.REF2;
    paramList.REF3 = hubParam.REF3;
    paramList.REF4 = hubParam.REF4;
    paramList.REF5 = hubParam.REF5;
    if (paramList != null) {
        $.ajax({
            type: "POST",
            url: "/returnApi/CallPushPage",
            //dataType: "json", 
            data: paramList,
            success: function (result) {
                window.location = result;
            }, error: function (xhr) {
                console.log(xhr);
                return;
            }
        });
    } else {
        console.log('paramList is null');
    }
}

//숫자 width만큼 앞에 0 붙혀주는 함수 EX) widht = 2일떄 1은 01로 찍힘
function _pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function _fnMakeJson(data) {
    if (data != undefined) {
        var str = JSON.stringify(data);
        if (str.indexOf("[") == -1) {
            str = "[" + str + "]";
        }
        return str;
    }
}

//Null 값 ""
function _fnToNull(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null') {
        return ''
    } else {
        return data
    }
}

//Null 값 0으로
function _fnToZero(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null' || String(data) == '' || String(data) == 'NaN') {
        return '0'
    } else {
        return data
    }
}

//콤마 찍기
function fnSetComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

//날짜 yyyy-mm-dd 만들어 주는 포멧
function _fnFormatDate(vDate) {

    if (_fnToNull(vDate) == "") {
        return "";
    }

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var vValue = vDate.replace(/-/gi, "");

    var dtArray = vValue.match(rxDatePattern); // is format OK?

    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];

    return dtYear + "-" + _pad(dtMonth, 2) + "-" + _pad(dtDay, 2);
}

//시간 HH : MM 만들어 주는 포멧
function _fnFormatHHMMTime(vTime) {

    if (_fnToNull(vTime) == "") {
        return "";
    }

    var rxDatePattern = ""; //Declare Regex   

    if (vTime.length == 4) {
        rxDatePattern = /^(\d{2})(\d{2})$/;
    }
    else if (vTime.length == 6) {
        rxDatePattern = /^(\d{2})(\d{2})(\d{2})$/;
    } else {
        return vTime;
    }

    var vValue = vTime.replace(/-/gi, "");

    var dtArray = vValue.match(rxDatePattern); // is format OK?

    dtHH = dtArray[1];
    dtMM = dtArray[2];

    return _pad(dtHH, 2) + ":" + _pad(dtMM, 2);
}

//시간 HH : MM 만들어 주는 포멧
function _fnFormatHHMMSSTime(vTime) {

    if (_fnToNull(vTime) == "") {
        return "";
    }

    var rxDatePattern = /^(\d{2})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var vValue = vTime.replace(/-/gi, "");

    var dtArray = vValue.match(rxDatePattern); // is format OK?

    var dtHH = dtArray[1];
    var dtMM = dtArray[2];
    var dtSS = dtArray[3];

    return _pad(dtHH, 2) + ":" + _pad(dtMM, 2) + ":" + _pad(dtSS, 2);
}

/* 지연 함수 - ms 시간만큼 지연하여 실행. */
function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// url 에서 parameter 추출
function _fnGetParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}

//날짜 입력 시 무슨 요일인지 찾아주는 함수
function _fnGetWhatDay(vDate) {

    if (String(vDate).length != 8) {
        return vDate;
    }
    else {
        var vformat = String(vDate);
        vformat = vformat.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

        var week = ['일', '월', '화', '수', '목', '금', '토'];
        var dayOfWeek = week[new Date(vformat).getDay()];

        return dayOfWeek;
    }
}

//시간 시간:분분 format 만들기
function _fnFormatTime(vTime) {
    if (String(vTime).length > 3) {
        return String(vTime).replace(/(\d{2})(\d{2})/, '$1:$2');
    }
    else {
        var vValue = "0" + String(vTime)
        return vValue.replace(/(\d{2})(\d{2})/, '$1:$2');
    }
}

//연락처 ==> XXX-XXXX-XXXX 폼으로 만드는 함수
function _fnMakePhoneForm(value) {

    var vTel = "";
    var vValue = value;
    vValue = vValue.replace(/-/gi, "");

    //자동 하이픈
    if (vValue.length < 4) {
        vTel = vValue;
    }
    else if (vValue.length < 7) {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3);
    }
    else if (vValue.length < 11) {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3, 3);
        vTel += "-";
        vTel += vValue.substr(6);
    } else {
        vTel += vValue.substr(0, 3);
        vTel += "-";
        vTel += vValue.substr(3, 4);
        vTel += "-";
        vTel += vValue.substr(7);
    }

    return vTel;
}

//날짜 플러스
function _fnPlusDate(date) {
    var nowDate = new Date();
    var weekDate = nowDate.getTime() + (date * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekYear = nowDate.getFullYear();
    var weekMonth = nowDate.getMonth() + 1;
    var weedDay = nowDate.getDate();

    if (weekMonth < 10) { weekMonth = "0" + weekMonth; }
    if (weedDay < 10) { weedDay = "0" + weedDay; }
    var result = weekYear + "-" + weekMonth + "-" + weedDay;
    return result;
}

//날짜 유효성 체크 (윤달 포함)
function _fnisDate(vDate) {

    var vValue = vDate;
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    if (_fnToNull(vValue_Num) == "") {
        _fnAlertMsg("날짜를 입력 해 주세요.");
        return false;
    }

    //8자리가 아닌 경우 false
    if (vValue_Num.length != 8) {
        _fnAlertMsg("날짜를 20200101 or 2020-01-01 형식으로 입력 해 주세요.");
        return false;
    }

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var dtArray = vValue_Num.match(rxDatePattern); // is format OK?

    if (dtArray == null) {
        return false;
    }

    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];

    //yyyymmdd 체크
    if (dtMonth < 1 || dtMonth > 12) {
        _fnAlertMsg("존재하지 않은 월을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if (dtDay < 1 || dtDay > 31) {
        _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
        _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
        return false;
    }
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap)) {
            _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        }
    }

    return true;
}

//날짜 차이 , 간격 일수 함수 (yyyymmdd , yyyy-mm-dd)
function _fnCompareDay(vValue1, vValue2) {

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex    

    if (vValue1.length > 7 && vValue2.length > 7) {

        //- replaceAll
        var dtArray1 = vValue1.replace(/-/gi, "").match(rxDatePattern); //기준 날짜
        var dtArray2 = vValue2.replace(/-/gi, "").match(rxDatePattern); //비교 날짜

        //0 => 현재 날짜 / 1 => yyyy / 2 => mm / 3 => dd
        var vSDate = new Date(parseInt(dtArray1[1]), parseInt(dtArray1[2]) + 1, parseInt(dtArray1[3]));
        var vEDate = new Date(parseInt(dtArray2[1]), parseInt(dtArray2[2]) + 1, parseInt(dtArray2[3]));

        var vGapDay = Math.abs(vEDate.getTime() - vSDate.getTime());
        vGapDay = Math.ceil(vGapDay / (1000 * 3600 * 24));

        return vGapDay;
    } else {
        return "N";
    }
}

function _fnAlertMsg(msg, id) {
    $(".alert_cont .inner").html("");
    $(".alert_cont .inner").html(msg);
    if (_fnToNull(id) != "") {
        layerPopup('#alert01');
        closeVar = id;
    } else {
        layerPopup('#alert01');
    }
    $("#alert_close").focus();
}

function _fnAlertMsg2(msg) {
    $(".alert_cont .inner").html("");
    $(".alert_cont .inner").html(msg);
    layerPopup2('#alert01');

    $(':focus').blur();
}

function _fnGetDateStamp() {
    var d = new Date();
    var s =
        _fnLeadingZeros(d.getFullYear(), 4) +
        _fnLeadingZeros(d.getMonth() + 1, 2) +
        _fnLeadingZeros(d.getDate(), 2) +
        _fnLeadingZeros(d.getHours(), 2) +
        _fnLeadingZeros(d.getMinutes(), 2);

    return s;
}

function _fnGetTodayStamp() {
    var d = new Date();
    var s =
        _fnLeadingZeros(d.getFullYear(), 4) +
        _fnLeadingZeros(d.getMonth() + 1, 2) +
        _fnLeadingZeros(d.getDate(), 2);

    return s;
}

function _fnLeadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

//레이어 팝업
function _fnLayerAlertMsg(msg) {
    $("#layer_in_alert_content").html(msg);
    layerPopup2('#layer_in_alert', "");
    $("#alert_layer01").focus();
}

/* 레이어팝업 alert 닫기 */
var alert_layerClose = function (obj) {
    var $laybtn = $(obj);
    $("#" + closeVar).focus(); //focus
    $laybtn.hide();
    $("body").addClass("layer_on");   // ★본문스크롤 제거
};

function _fnConfirmMsg(msg) {
    $("#alert02 .inner").html(msg);
    layerPopup('#alert02', "");
    $("#ConfirmChk").focus();
}

function _fnConfirmMsg_Yes() {
    layerClose('#alert02');
    return true;
}

function _fnConfirmMsg_No() {
    layerClose('#alert02');
    return false;
}

//딜레이 기간 알려주는 함수
function _fnDateCal(etd, atd) {
    var rtnClass = "";
    if (_fnToNull(etd) != "" && _fnToNull(atd) != "") {
        var str = etd;
        var strArr = str.split('-');
        var str = atd;
        var strArr2 = str.split('-');

        var date = new Date(strArr[0], strArr[1] - 1, strArr[2], strArr[3], strArr[4]);
        var date2 = new Date(strArr2[0], strArr2[1] - 1, strArr2[2], strArr2[3], strArr2[4]);

        date.getTime();
        date2.getTime();

        var min = (date2 - date) / 1000 / 3600;
        if (min >= 24 && min < 48) {
            rtnClass = "delay_24";
        } else if (min >= 48 && min < 72) {
            rtnClass = "delay_48";
        } else if (min >= 72) {
            rtnClass = "delay_72";
        } else {
            rtnClass = "tit";
        }

    }
    return rtnClass;
}

//데이터 날짜 포멧 그려주기
function _fnDateFormat(date) {
    if (_fnToNull(date) != "") {
        if (date.length == 8) {
            return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2);
        } else if (date.length == 6 || date.length == 4) {
            return date.substr(0, 2) + ':' + date.substr(2, 2);
        } else if (date.length == 14) {
            return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + '-' + date.substr(8, 2) + '-' + date.substr(10, 2);
        }
    }

    return date;
}

//get 방식 파라미터 데이터 가져오기
function _getParameter(param) {
    var returnValue = '';
    // 파라미터 파싱
    var url = location.href;
    var params = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    for (var i = 0; i < params.length; i++) {
        var varName = params[i].split('=')[0];
        //파라미터 값이 같으면 해당 값을 리턴한다
        if (varName.toUpperCase() == param.toUpperCase()) {
            returnValue = _fnToNull(params[i].split('=')[1]);
            if (returnValue == "") {
                returnValue = "none"
            }
            return decodeURIComponent(returnValue);
        }
    }

    return returnValue;
}

//이름 / 값 / 저장 시킬 시간
function _fnSetCookie(name, value, hours) {
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

//쿠키 삭제
function _fnDelCookie(cookie_name) {
    _fnSetCookie(cookie_name, "", "-1");
}

//쿠키 값 가져오기
function _fnGetCookie(cookie_name) {
    var x, y;
    var val = document.cookie.split(';');

    for (var i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
        }
    }
}

//현재 년월일시분초밀리초 가져오는 함수
function _fnGetNowTime() {
    var d = new Date();
    return d.getFullYear() + _pad((1 + d.getMonth()), "2") + _pad(d.getDate(), "2") + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
}

//현재 년월일시분가져오는 함수
function _fnGetNowTime2() {
    var d = new Date();
    return d.getFullYear() + _pad((1 + d.getMonth()), "2") + _pad(d.getDate(), "2") + _pad(d.getHours(), "2") + _pad(d.getMinutes(),"2");
}


//이동
function controllerToLink(view, controller, obj, toast_yn) {
    var objParam = new Object();
    objParam.LOCATION = view;
    objParam.CONTROLLER = controller;
    if (toast_yn) {
        objParam.TOAST = true;
    }
    if (obj != null) {
        objParam = $.extend({}, objParam, obj);
    }

    $.ajax({
        type: "POST",
        url: "/returnApi/CallPage",
        async: false,
        dataType: "text",
        data: objParam,
        success: function (result) {
            window.location = result;
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });
}

//유니패스 - 화물진행관리 년도 세팅
function _fnSetUniYear(vID) {
    try {
        var year = "";
        var vNowYear = new Date();
        for (var i = 0; i < 10; i++) {
            var date = new Date();
            var calDate = new Date(date.setFullYear(date.getFullYear() - i + 1));

            if (vNowYear.getFullYear() == calDate.getFullYear()) {
                year += "<option value='" + calDate.getFullYear() + "' selected>" + calDate.getFullYear() + "년</option>";
            }
            else {
                year += "<option value='" + calDate.getFullYear() + "'>" + calDate.getFullYear() + "년</option>";
            }
        }
        if (year != "") {
            $("#" + vID).append(year);
        }
    }
    catch (err) {
        console.log("[Error - _fnSetUniYear]" + err.message);
    }
}
/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////