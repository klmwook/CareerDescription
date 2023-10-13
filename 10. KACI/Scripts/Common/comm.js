
var hubConn = null;
var chatHub = null;
var strDomain = null;
var hubParam;

/*****************************************************************************/
/*
//PageLoad시 ChatHubConnetion
//*/
$(function () { //ready Function
    //strDomain = $("#Session_DOMAIN").val();
    //if (strDomain == null) strDomain = _fnToNull(domain);    
    //if (_fnToNull(strDomain) != "") {  //로그인이 되어있을때 만 Connecting을 한다                        
    //    if (chatHub == null) {
            
    //        hubConn = $.hubConnection(vChatHubUrl);
    //        chatHub = hubConn.createHubProxy('chatHub');
    //        registerClientMethods(chatHub);
    //        hubConn.start({ jsonp: true })
    //                    .done(function () {
    //                        console.log('Now connected, connection ID=' + hubConn.id);
    //                        if (_fnToNull($("#Session_DOMAIN").val()) != "") {  //로그인 되어있다고 판단
    //                            var conObj = new Object();
    //                            conObj.NAME = $("#Session_USR_ID").val();
    //                            conObj.DOMAIN = strDomain;
    //                            chatHub.invoke("Connect", conObj);
    //                        }
    //                    })
    //                    .fail(function () {
    //                        console.log('Could not connect');
    //                    });
    //    }
    //}

    //$("#ConfirmChk").click(function () {
    //    if ($("body").hasClass("layer_on")) {
    //        layerClose('#alert02');
    //    }
    //});
});

//엔터키 이벤트
$(document).keyup(function (e) {
    if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)

    }
});

//글자수 제한
function _fnTextLengthOverCut(txt, len, lastTxt) {
    if (len == "" || len == null) { // 기본값
        len = 20;
    }
    if (lastTxt == "" || lastTxt == null) { // 기본값
        lastTxt = "...";
    }
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
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

//쿠키 삭제하기
function _fnDelCookie(cookie_name) {

    _fnSetCookie(cookie_name, "", "-1");
}

//이메일 보내기 - vFrom , vTo , vSubject , vBody
function _fnSendEmail(vFrom, vTo, vSubject, vBody) {

    Email.send({
        SecureToken: "C973D7AD-F097-4B95-91F4-40ABC5567812",
        Host: "mail.yjit.co.kr",
        Username: "system@yjit.co.kr",
        Password: "elvis2015",
        From: vFrom,
        To: vTo,

        Subject: vSubject,
        Body: vBody
    })

    //메일 보내고 1초 정도 딜레이/ 메일 누락 되는 경우가 있어서 딜레이 걸었음
    _fnsleep(1000);

}

/* 지연 함수 - ms 시간만큼 지연하여 실행. */
function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);

}

function _fnAlertMsg(msg,id) {
    $(".alert_cont .inner").html("");
    $(".alert_cont .inner").html(msg);
    if (_fnToNull(id) != "") {
        layerPopup('#alert01', "", true, id);
    } else {
        layerPopup('#alert01', "");
    }
    $("#alert_close").focus();
}

function _fnLayerAlertMsg(msg) {
    $("#alert_layer_cont").html(msg);
    layerPopup2('#alert_layer', "");
    $("#alert_layer01").focus();
} 

//현재 년월일시분초밀리초 가져오는 함수
function _fnGetNowTime() {

    var d = new Date();

    return d.getFullYear() + _pad((1 + d.getMonth()), "2") + _pad(d.getDate(), "2") + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
}

//숫자 width만큼 앞에 0 붙혀주는 함수 EX) widht = 2일떄 1은 01로 찍힘
function _pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function _fnNumberDot(ctrl) {
    var val = _fnToNull(ctrl.value);

    if (val == "") {
        $(ctrl).val('');
    } else {
        $(ctrl).val(val.replace(/[^0-9]/g, ""));
    }
}

function _fnNumber_hyphen(ctrl) {
    var val = _fnToNull(ctrl.value);

    if (val == "") {
        $(ctrl).val('');
    } else {
        $(ctrl).val(val.replace(/[^0-9-+]/g, ""));
    }
}

function _fnGetNumber(obj, sum) {
    var num01;
    var num02;
    if (sum == "sum") {
        num02 = obj;
        num01 = fnSetComma(num02); //콤마 찍기
        return num01;
    }
    else {
        num01 = obj.value;
        num02 = num01.replace(/^[0]|[^-0-9.]/g, ""); //0으로 시작하거나 숫자가 아닌것을 제거,
        num01 = fnSetComma(num02); //콤마 찍기
        obj.value = num01;
    }

}

//콤마 풀기
function _fnUncomma(str, val) {
    if (val == "val") {
        var num = str.val();
    } else {
        var num = str.value;
    }
    num = num.replace(/,/g, '');
    str.value = num;
}

//콤마 넣기
function fnSetComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

function _fnnumWithCom(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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