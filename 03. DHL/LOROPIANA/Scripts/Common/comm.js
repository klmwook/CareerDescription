var vlocation_href = window.location.origin + "/Main/Index";
var vChatHubUrl = "http://chat.elvisprime.com/signalr";
var hubConn = null;
var chatHub = null;
var strDomain = null;
var hubParam;


$(function () { //ready Function
    //strDomain = $("#Session_DOMAIN").val();
    //if (strDomain == null) strDomain = _fnToNull(domain);
    //if (_fnToNull(strDomain) != "") {  //로그인이 되어있을때 만 Connecting을 한다                        
    //    if (chatHub == null) {
    //
    //        hubConn = $.hubConnection(vChatHubUrl);
    //        chatHub = hubConn.createHubProxy('chatHub');
    //        registerClientMethods(chatHub);
    //        hubConn.start({ jsonp: true })
    //            .done(function () {
    //                console.log('Now connected, connection ID=' + hubConn.id);
    //                if (_fnToNull($("#Session_DOMAIN").val()) != "") {  //로그인 되어있다고 판단
    //                    var conObj = new Object();
    //                    conObj.NAME = $("#Session_USR_ID").val();
    //                    conObj.DOMAIN = strDomain;
    //                    chatHub.invoke("Connect", conObj);
    //                }
    //            })
    //            .fail(function () {
    //                console.log('Could not connect');
    //            });
    //    }
    //}

    var menu = $(".h_type2 .menu")
    var hType2Left = $(".h_type2 .icon_menu > li > a");
    var mCurrent = -1;
    $('.h_type2 .menu_toggle').bind('click', function () {
        var toggle = $(this);
        var chkMenu = $(this).next('.menu');
        if (menu.hasClass('open')) {
            chkMenu.removeClass('open'); 
            toggle.removeClass('close').addClass('view');
            $('#contentWrap .dimmed').hide();
            chkMenu.find('.active').removeClass('active');
            chkMenu.find('.temp').removeClass('temp').addClass('current');
        } else {
            toggle.removeClass('view').addClass('close');
            chkMenu.addClass('open');

            $('#contentWrap .dimmed').show();
        }

        return false;
    });

    hType2Left.bind('click', function () {
        var toggle = $('.h_type2 .menu_toggle');
        var chkMenu = $('.h_type2 .menu_toggle').next('.menu');
        $('.h_type2 .icon_menu').children('.current').addClass('temp');
        $('.h_type2 .icon_menu > li').removeClass('current');

        if (!menu.hasClass('open')) {
            toggle.removeClass('view').addClass('close');
            chkMenu.addClass('open');
            //$('#contentWrap .dimmed').show();
        }

        if ($(this).parents('.menu').hasClass('open')) {
            var idx = $(this).parent().index();
            if (mCurrent != idx) {
                $('.h_type2 .icon_menu > li').removeClass('active');
                $(this).parent().addClass('active');
                mCurrent = idx;
            } else {
                $(this).parent().toggleClass('active');
            }
        }
    });
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
            hubParam = paramList;   //전역에 담는다 
            var titleText = paramList.MSG;
            var userID = paramList.USR_ID;
            var messageText = "<button type='button' class='btn_go' onclick='goPushPage()'><span>자세히보기</span></button>";
            if (_fnToNull($("#Session_USR_ID").val()) == _fnToNull(userID)) {  //로그인 되어있다고 판단         
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
    if (strDomain == null) strDomain = _fnToNull(domain);
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
    //paramList = hubParam;
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

function _fnToNull(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null') {
        return ''
    } else {
        return data
    }
}

function _fnToZero(data) {
    // undifined나 null을 null string으로 변환하는 함수. 
    if (String(data) == 'undefined' || String(data) == 'null' || String(data) == '' || String(data) == 'NaN') {
        return '0'
    } else {
        return data
    }
}

function _fnDelCookie(cookie_name) {

    _fnSetCookie(cookie_name, "", "-1");
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

function _fnGetNumber(obj, sum) {
    var num01;
    var num02;
    if (sum == "sum") {
        num02 = obj;
        num01 = fnSetComma(num02); //콤마 찍기
        return num01;
    }
    else {
        num01 = obj.value.slice(0, 13);
        num02 = num01.replace(/[^0-9.]/g, ""); //0으로 시작하거나 숫자가 아닌것을 제거,
        num01 = fnSetComma(num02); //콤마 찍기
        obj.value = num01;
    }

}

function _fnGetNumberNoCom(obj, sum) {
    var num01;
    var num02;
    if (sum == "sum") {
        num02 = obj;
        num01 = fnSetComma(num02); //콤마 찍기
        return num01;
    }
    else {
        num01 = obj.value.slice(0, 13);
        num02 = num01.replace(/[^0-9]/g, ""); //0으로 시작하거나 숫자가 아닌것을 제거,
        num01 = fnSetComma(num02); //콤마 찍기
        obj.value = num01;
    }

}


function _fnisDate(vDate) {
    var vValue = vDate;
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    if (_fnToNull(vValue_Num) != "") {

        //8자리가 아닌 경우 false 
        if (vValue_Num.length != 8) {
            _fnAlertMsg("날짜를 YYYYMMDD or YYYY-MM-DD 형식으로 입력 해 주세요.");
            return false;
        }
        //8자리의 yyyymmdd를 원본 , 4자리 , 2자리 , 2자리로 변경해 주기 위한 패턴생성을 합니다. 
        var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
        var dtArray = vValue_Num.match(rxDatePattern);
        if (dtArray == null) { return false; }
        //0번째는 원본 , 1번째는 yyyy(년) , 2번재는 mm(월) , 3번재는 dd(일) 입니다. 
        dtYear = dtArray[1]; dtMonth = dtArray[2]; dtDay = dtArray[3];
        //yyyymmdd 체크 
        if (dtMonth < 1 || dtMonth > 12) {
            _fnAlertMsg("존재하지 않은 월을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        } else if (dtDay < 1 || dtDay > 31) {
            _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
            return false;
        }
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
            _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요"); return false;
        } else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap)) {
                _fnAlertMsg("존재하지 않은 일을 입력하셨습니다. 다시 한번 확인 해주세요");
                return false;
            }
        }
    }
    return true;
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

function _fnUncommaReturn(str, val) {
    if (val == "val") {
        var num = str.val();
    } else {
        var num = str.value;
    }
    num = num.replace(/,/g, '');
    return num;
}



function fnSetComma(n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}


//소수점 자동 생성 함수
function _fnSetDemical(ctrl, key, event, demical, sum) {
    if (ctrl != null) {
        if (demical == 3) {
            var _pattern2 = /^\d*[.]\d{4}$/; // 현재 value값이 소수점 셋째짜리 숫자이면 더이상 입력 불가
            if (_pattern2.test(ctrl.value)) {
                if (ctrl.value.charAt(ctrl.value.length - 1) > 4) {
                    var value1 = Math.round(ctrl.value.replace(/,/gi, '') * 1000) / 1000;
                    $(ctrl).val(_fnnumWithCom(parseFloat(value1).toFixed(demical)));
                    return false;
                } else {
                    $(ctrl).val(ctrl.value.substr(0, ctrl.value.length - 1));
                    return false;
                }
            }
        } else if (demical == 2) {
            var _pattern2 = /^\d*[.]\d{3}$/; // 현재 value값이 소수점 둘째짜리 숫자이면 더이상 입력 불가
            if (_pattern2.test(ctrl.value)) {
                if (ctrl.value.charAt(ctrl.value.length - 1) > 4) {
                    var value1 = Math.round(ctrl.value.replace(/,/gi, '') * 100) / 100;
                    $(ctrl).val(_fnnumWithCom(parseFloat(value1).toFixed(demical)));
                    return false;
                } else {
                    $(ctrl).val(ctrl.value.substr(0, ctrl.value.length - 1));
                    return false;
                }
            }
        }

        if (sum == "sum") {
            var value = Math.round(ctrl * 1000) / 1000;
        } else if (sum == "val") {
            var value = Math.round(ctrl.val().replace(/,/gi, '') * 1000) / 1000;
        } else {
            var value = Math.round(ctrl.value.replace(/,/gi, '') * 1000) / 1000;
        }

        if (isNaN(value)) {
            $(ctrl).val('');
        } else {
            if (event == "enter") {
                if (key.keyCode == 13) {
                    if (sum == "sum") {
                        return _fnnumWithCom(parseFloat(value).toFixed(demical));
                    } else {
                        $(ctrl).val(_fnnumWithCom(parseFloat(value).toFixed(demical)));
                    }
                }
            } else {
                if (sum == "sum") {
                    return _fnnumWithCom(parseFloat(value).toFixed(demical));
                } else {
                    $(ctrl).val(_fnnumWithCom(parseFloat(value).toFixed(demical)));
                }
            }
        }
    }
}

function _fnnumWithCom(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function _fnGetAjaxData(type, url, action, param_Obj, chk_obj) {
    //    alert("Call Custom");

    var rtnJson;
    var urlpath = "/" + url + "/" + action;
    var callObj = new Object();

    if (url == null) return rtnJson;

    if (chk_obj) {
        callObj = param_Obj;
    } else {
        callObj.paramObj = _fnMakeJson(param_Obj);
    }

    $.ajax({
        type: "POST",
        url: urlpath,
        async: false,
        dataType: "json",
        data: callObj,
        success: function (result) {
            rtnJson = result; // JSON.stringify(result);
        }, error: function (xhr) {
            console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            console.log(xhr);
            return;
        }
    });
    //    alert(rtnJson);
    return rtnJson;
}


//HomePage Ajax 호출
function _fnGetAjaxData2(Type, Url, Action, Async, DataType, ParamObj) {
    var rtnJson;
    $.ajax({
        type: Type,
        url: Url + "/" + Action,
        async: Async,
        cache: false,
        dataType: DataType,
        data: { "": _fnMakeJson(ParamObj) },
        success: function (result) {
            rtnJson = result;
            $("#ProgressBar_Loading").hide();
        }, error: function (xhr) {
            _fnAlertMsg("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
            $("#ProgressBar_Loading").hide(); //프로그래스 바
            console.log(xhr);
            rtnJson = result;
            return rtnJson;
        },
        beforeSend: function () {
            $("#ProgressBar_Loading").show(); //프로그래스 바
        },
        complete: function () {
            $("#ProgressBar_Loading").hide(); //프로그래스 바
        }
    });
    return rtnJson;
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

function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

var doubleSubmitFlag = false;
function doubleSubmitCheck() {
    if (doubleSubmitFlag) {
        return doubleSubmitFlag;
    } else {
        doubleSubmitFlag = true;
        return false;
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

function _fnMinusDate(date) {
    var nowDate = new Date();
    var weekDate = nowDate.getTime() - (date * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekYear = nowDate.getFullYear();
    var weekMonth = nowDate.getMonth() + 1;
    var weedDay = nowDate.getDate();
    var weekDays = "";

    if (weekMonth < 10) { weekMonth = "0" + weekMonth; }
    if (weedDay < 10) { weedDay = "0" + weedDay; }
    var result = weekYear + "-" + weekMonth + "-" + weedDay;
    return result;
}

function _fnMinusTime(date) {
    var nowDate = new Date();
    var weekDate = nowDate.getTime() - (date * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekDays = nowDate.getHours();
    var weekMinutes = nowDate.getMinutes();
    if (weekDays.toString().length == 1) {
        weekDays = "0" + weekDays;
    }
    if (weekMinutes.toString().length == 1) {
        weekMinutes = "0" + weekMinutes;
    }
    var result = weekDays + ":" + weekMinutes;
    return result;
}

function _fnPlusDate(date) {
    var nowDate = new Date();
    var weekDate = nowDate.getTime() + (date * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekYear = nowDate.getFullYear();
    var weekMonth = nowDate.getMonth() + 1;
    var weedDay = nowDate.getDate();
    var weekDays = "";

    if (weekMonth < 10) { weekMonth = "0" + weekMonth; }
    if (weedDay < 10) { weedDay = "0" + weedDay; }
    var result = weekYear + "-" + weekMonth + "-" + weedDay;
    return result;
}



function _fn_viewer_open(projectName, formName, datasetList, paramList) {

    var _params = {
        "projectName": projectName      //fn_setViewParam 함수에서 가져와 프로젝트명 셋팅
        , "formName": formName            //fn_setViewParam 함수에서 가져와 서식명 셋팅
    };

    for (var datasetValue in datasetList) {
        _params[datasetValue] = encodeURIComponent(datasetList[datasetValue]);
    }

    for (var paramValue in paramList) {
        _params[paramValue] = paramList[paramValue];
    }

    console.log(_params);

    //var _url = window.location.origin + contextPath + "/UView5/index.jsp"; //UBIFORM Viewer URL
    //var _url = "http://110.45.209.81:8572/UBIFORM/UView5/index.jsp"; //양재 IT 개발 서버에 설치한 UBIFORM Viewer URL
    var _url = "http://110.45.218.43:8072/UBIFORM/UView5/index.jsp";
    var d = new Date();
    var n = d.getTime();

    var name = "TNB";

    //팝업 오픈 Option 해당 설정은 window.open 설정을 참조
    var windowoption = 'location=0, directories=0,resizable=0,status=0,toolbar=0,menubar=0, width=1280px,height=650px,left=0, top=0,scrollbars=0';  //팝업사이즈 window.open참고
    var form = document.createElement("form");

    form.setAttribute("method", "post");
    form.setAttribute("action", _url);

    for (var i in _params) {
        if (_params.hasOwnProperty(i)) {
            var param = document.createElement('input');
            param.type = 'hidden';
            param.name = i;
            param.value = encodeURI(_params[i]);
            form.appendChild(param);
        }
    }
    var winObj = null;


    document.body.appendChild(form);
    form.setAttribute("target", name);
    window.open("", name, windowoption);
    form.submit();
    document.body.removeChild(form);

}


function _fn_viewer_iframe(projectName, formName, datasetList, paramList, target) {

    var _params = {
        "projectName": projectName      //fn_setViewParam 함수에서 가져와 프로젝트명 셋팅
        , "formName": formName            //fn_setViewParam 함수에서 가져와 서식명 셋팅
    };

    for (var datasetValue in datasetList) {
        _params[datasetValue] = encodeURIComponent(datasetList[datasetValue]);
    }

    for (var paramValue in paramList) {
        _params[paramValue] = paramList[paramValue];
    }

    console.log(_params);

    //var _url = window.location.origin + contextPath + "/UView5/index.jsp"; //UBIFORM Viewer URL
    //var _url = "http://110.45.209.81:8572/UBIFORM/UView5/index.jsp"; //양재 IT 개발 서버에 설치한 UBIFORM Viewer URL
    var _url = "http://110.45.218.43:8072/UBIFORM/UView5/index.jsp";
    var d = new Date();
    var n = d.getTime();

    var name = target;

    //팝업 오픈 Option 해당 설정은 window.open 설정을 참조
    var windowoption = 'location=0, directories=0,resizable=0,status=0,toolbar=0,menubar=0, width=1280px,height=650px,left=0, top=0,scrollbars=0';  //팝업사이즈 window.open참고
    var form = document.createElement("form");

    form.setAttribute("method", "post");
    form.setAttribute("action", _url);

    for (var i in _params) {
        if (_params.hasOwnProperty(i)) {
            var param = document.createElement('input');
            param.type = 'hidden';
            param.name = i;
            param.value = encodeURI(_params[i]);
            form.appendChild(param);
        }
    }
    var winObj = null;


    document.body.appendChild(form);
    form.setAttribute("target", name);
    window.open("", name, windowoption);
    form.submit();
    document.body.removeChild(form);
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
var closeVar = "";
function _fnConfirmMsg(msg) {
    $(".alert_cont .inner").html(msg);
    layerPopup('#alert02', "");
    $("#ConfirmChk").focus();
}

$(document).keypress(function (event) {
    if (event.keyCode == "13") {
        if ($("body").hasClass("layer_on")) {
            $("#alert_close").focus();
            layerClose('#alert01');
        }
        if (this.id == "ConfirmChk") {
            layerClose('#alert02');
        }
    }
});

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

function _fnCheckLogin() {
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        $(".alert_cont .inner").html("로그인을 먼저 하십시오.");
        layerPopup('#alert01', "", false);
        sessionStorage.setItem('finalUrl', location.href);
        $('.loginChk').click(function () {
            location.href = vlocation_href;
        });
        $(document).keyup(function (e) {
            if (e.keyCode == 13) {
                location.href = vlocation_href;
            }
        });
        return false;
    }
    else {

        return _fnSetLoginData();
    }
}
function _fnCheckLoginNoPopup() {
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        var objResult = new Object();
        objResult.USR_ID = _fnToNull($("#Session_USR_ID").val());
        objResult.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
        objResult.EMAIL = _fnToNull($("#Session_EMAIL").val());
        objResult.OFFICE_CD = _fnToNull($("#Session_OFFICE_CD").val());
        objResult.BRANCH_CD = _fnToNull($("#Session_BRANCH_CD").val());
        objResult.DEPT_CD = _fnToNull($("#Session_DEPT_CD").val());
        objResult.DEPT_NM = _fnToNull($("#Session_DEPT_NM").val());
        objResult.AUTH_TYPE = _fnToNull($("#Session_AUTH_TYPE").val());


        return objResult;
    }
    else {
        return "";
    }
}

//return Object형식
function _fnSetLoginData() {
    var objResult = new Object();
    objResult.USR_ID = _fnToNull($("#Session_USR_ID").val());
    objResult.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
    objResult.EMAIL = _fnToNull($("#Session_EMAIL").val());
    objResult.OFFICE_CD = _fnToNull($("#Session_OFFICE_CD").val());
    objResult.BRANCH_CD = _fnToNull($("#Session_BRANCH_CD").val());
    objResult.DEPT_CD = _fnToNull($("#Session_DEPT_CD").val());
    objResult.DEPT_NM = _fnToNull($("#Session_DEPT_NM").val());
    objResult.AUTH_TYPE = _fnToNull($("#Session_AUTH_TYPE").val());
    return objResult;
}

//이메일 보내기 - vFrom , vTo , vSubject , vBody
function _fnSendEmail(vFrom, vTo, vSubject, vBody) {

    Email.send({
        SecureToken: "C973D7AD-F097-4B95-91F4-40ABC5567812",
        Host: "mail.yjit.co.kr",
        Username: "mailmaster@yjit.co.kr",
        Password: "Yjit0921)#$%",
        From: vFrom,
        To: vTo,

        Subject: vSubject,
        Body: vBody
    })

    //메일 보내고 1초 정도 딜레이/ 메일 누락 되는 경우가 있어서 딜레이 걸었음
    _fnsleep(1000);

}


function _fnAjaxSuccess(result) {
    var rtnBrand = result.BRAND;
    var rtnSend = result.SEND;
    var rtnItem = result.ITEM;
    var rtnLoc = result.LOC;
    var rtnTs = result.TS;
    var obj = new Object();

    currStr = " <select class='sel st1' id='BRAND_CD'>";

    currStr += "<option value=''>--Select--</option>";
    $(rtnBrand).each(function (i) {
        currStr += "<option value='" + rtnBrand[i].CODE + "'>" + rtnBrand[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.brand = currStr;

    currStr = " <select class='sel st1' id='BRAND_CD2'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnBrand).each(function (i) {
        currStr += "<option value='" + rtnBrand[i].CODE + "'>" + rtnBrand[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.brand2 = currStr;
    

    currStr = " <select class='sel st1' id='REQ_DLV_TYPE'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnSend).each(function (i) {
        currStr += "<option value='" + rtnSend[i].CODE + "'>" + rtnSend[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.send = currStr;

    currStr = " <select class='sel st1' id='ITEM_TYPE'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnItem).each(function (i) {
        currStr += "<option value='" + rtnItem[i].CODE + "'>" + rtnItem[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.item = currStr;


    currStr = " <select class='sel st1' id='REQ_FR_LOC_CD'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnLoc).each(function (i) {
        currStr += "<option value='" + rtnLoc[i].CODE + "'>" + rtnLoc[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.loc = currStr;

    currStr = " <select class='sel st1' id='TO_LOC_CD'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnLoc).each(function (i) {
        currStr += "<option value='" + rtnLoc[i].CODE + "'>" + rtnLoc[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.loc_to = currStr;

    currStr = " <select class='sel st1' id='TS_LOC_CD'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnTs).each(function (i) {
        currStr += "<option value='" + rtnTs[i].CODE + "'>" + rtnTs[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.ts_loc = currStr;

    currStr = " <select class='sel st1' id='TS_LOC_CD2'>";
    currStr += "<option value=''>--Select--</option>";
    $(rtnTs).each(function (i) {
        currStr += "<option value='" + rtnTs[i].CODE + "'>" + rtnTs[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.ts_loc2 = currStr;

    return obj;
}
function numberMaxLength(e) {
    if (e.value.length > e.maxLength) {
        e.value = e.value.slice(0, e.maxLength);
    }
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

function _fnDateCal(etd , atd) {
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


function _fnDateFormat2(date) {
    if (_fnToNull(date) != "") {
        if (date.length == 8) {
            return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
        } else if (date.length == 6 || date.length == 4) {
            return date.substr(0, 2) + ':' + date.substr(2, 2);
        } else if (date.length == 14) {
            return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + '-' + date.substr(8, 2) + '-' + date.substr(10, 2);
        }
    }
}
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
}

$(document).keyup(function (e) {

    if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)
        if ($(e.target).attr('data-index') != undefined) {
            //부킹 등록 - 부킹 스케줄 리스트 가져오기
            if ($(e.target).attr('data-index').indexOf("Regis") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Regis", "");

                if (vIndex != 15) {
                    $('[data-index="Regis' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else {
                }
            }

            if ($(e.target).attr('data-index').indexOf("Inquiry") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Inquiry", "");

                if (vIndex != 15) {
                    $('[data-index="Inquiry' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else {
                }
            }
        }
    } else {
        if ($(e.target).is("#alert01")) //비밀번호
        {
            layerClose('#alert01');
        }
    }
});


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
}



fileDownProc = function (_formInfo, _fileName, _exportType, _circulation, _multiFormType) {

    //UBIFORM API를 호출하기 위한 필수 값
    var _params = { METHOD_NAME: "exportServerSide", CALL: "VIEWER5", FILE_TYPE: "exec", FILE_NAME: "Mview.ubx" };

    //파일다운로드 Header 영역
    /*
        UB_EXPORT_FILE_PATH : 파일 경로
        UB_EXPORT_FILE_NAME : 파일 명
        UB_EXPORT_FILE_TYPE : 파일 타입 [PDF(Default), EXCEL, WORD, PPT, IMAGE, HWP, TXT, TIF] 
        CIRCULATION : 부수
        MULTI_FORM_TYPE : Array에 있는 서식을 각각 저장 or 한 파일로 저장 여부  
    */
    _params.UB_EXPORT_FILE_PATH = typeof _filePath == "undefined" ? "" : _filePath;
    _params.UB_EXPORT_FILE_NAME = typeof _fileName == "undefined" ? "" : _fileName;
    _params.UB_EXPORT_FILE_TYPE = "PNG";
    _params.CIRCULATION = isNaN(_circulation) ? 1 : _circulation == 0 ? 1 : Number(_circulation);
    _params.MULTI_FORM_TYPE = _multiFormType;
    _params.USE_PROTECTION = "false";

    //프로젝트명
    _params.PROJECT_NAME = _formInfo.projectName;
    //form 명
    _params.FORM_NAME = _formInfo.formName;

    var _ubparams = {};

    _ubparams.projectName = _formInfo.projectName;
    _ubparams.formName = _formInfo.formName;

    var _datasetObject = _formInfo.datasetObject;
    var _paramObject = _formInfo.paramObject;
    for (var datasetKey in _datasetObject) {
        _ubparams[datasetKey] = JSON.stringify(_datasetObject[datasetKey]);
    }
    for (var paramKey in _paramObject) {
        _ubparams[paramKey] = _paramObject[paramKey];
    }

    var _jsonParams = JSON.stringify(_ubparams);
    _params.UBPARAMS = encodeURIComponent(_jsonParams);

    fileDownLoadAjaxSubmit(_url, _params);
};
function fileDownLoadAjaxSubmit(url, params) {

    $.ajax({
        url: _url,
        type: 'post',
        data: params,
        success: function (data) {
            var _date = new Date();

            var diff = _date.getTime() - _date.getTime();
            var diffSec = Math.floor(diff / 1000 % 60);
            var diffMin = Math.floor(diff / (60 * 1000) % 60);

            var _time = diffMin + ":" + diffSec + "." + Math.floor(diff % 1000);
            var _item = JSON.parse(decodeURIComponent(data));
            /*
             item : jsonObject형태로 리턴 
                ->Result: API 실행에 대한 결과 코드 전달
                    {Code: "0000", Message: "서비스 수행을 성공하였습니다."}
                ->Data: 각 파일별 서비스 수행 결과 전달 
                    {totalTime: "169", RESULT: "SUCCESS", RESULT_LIST: [{Code: "0000",Message: "서비스 수행을 성공하였습니다.",RESULT: "SUCCESS",fileData: "",fileName: "MULTIFORM_20210419113428248_336_TEMP.pdf",filePath: "D:\company\shinhan\UBIFORM\UFile/sys/temp/",fileSize: "4513"}]}
            */
            var _data = _item.Data;
            _data = JSON.stringify(_data);
            _data = JSON.parse(_data);
            console.log();
            Android.printPNG("110.45.209.81:8572", _data.fileName);

        }
    });
};

callbackIframeLoad = function (result) {
    if (result) {
        try {
            var iframe;
            if (document.getElementById("htmlIframe") == null) {
                iframe = document.createElement('iframe');

                iframe.setAttribute('id', "htmlIframe");
                iframe.setAttribute('name', "htmlIframe");
                iframe.setAttribute('title', "PRINT_IFRAME");
                iframe.style.display = 'none';

                document.body.appendChild(iframe);
            }
            else {
                iframe = document.getElementById("htmlIframe");
            }

            $(iframe).on("load", function () {

                $(iframe).off("load");

                console.log("IFRAME onload Call execCommand Print =======================");

                var _isMobile = isMobile();
                if (_isMobile) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
                else {
                    if (!iframe.contentWindow.document.execCommand('print', false, null)) {

                        console.log("IFRAME onload Call execCommand Print fail =======================");

                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    }

                    doc.open();
                    doc.write("");
                    doc.close();
                }

                console.log("IFRAME onload Call Print Clear document ======================");

            });

            console.log("IFRAME document append html start ======================");

            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write(result);
            doc.close();

            console.log("IFRAME document append html stop ======================");

        }
        catch (err) {
            alert(err.message);
            return;
        }
    }
};

//모바일 인지 여부 
function isMobile() {
    //UBAlert.showAlert("navigator.userAgent" + navigator.userAgent, "1", null);

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        Kakaotalk: function () {
            return navigator.userAgent.match(/KAKAOTALK/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.Kakaotalk());
        }
    };

    return (isMobile.any() != null);
};
