//var vlocation_href = urlpath + "/Main/Index";
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

    // input X버튼
    $(".int_box .delete").on("click", function () {
        var intBox = $(this).closest(".int_box");
        intBox.find("input[type='text']").val('').focus();
        intBox.find(".delete").hide();
        intBox.removeClass("has_del");
        intBox.find(".input_hidden").val("");
    });
    $(".int_box input[type='text']").bind("change keyup input", function (event) {
        var intBox = $(this).closest(".int_box");
        intBox.addClass("has_del");
        intBox.find(".delete").toggle(Boolean($(this).val()));
    });


    //$(".nav_toggle").on("click", function () {
    //    if ($('#header').hasClass('.close')) {
    //        $("#container").css("width", "calc(100% - 246px)");
    //    }
    //    else {
    //        $("#container").css("width", "calc(100% - 80px)");
    //    }
    //})
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

//날짜 yyyy.mm.dd 만들어 주는 포멧
function _fnFormatDotDate(vDate) {

    if (_fnToNull(vDate) == "") {
        return "";
    }

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var vValue = vDate.replace(/-/gi, "");

    var dtArray = vValue.match(rxDatePattern); // is format OK?

    dtYear = dtArray[1];
    dtMonth = dtArray[2];
    dtDay = dtArray[3];

    return dtYear + "." + _pad(dtMonth, 2) + "." + _pad(dtDay, 2);
}

//날짜 입력 시 무슨 요일인지 찾아주는 함수
function _fnGetWhatDay_Kor(vDate) {

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

//날짜 입력 시 무슨 요일인지 찾아주는 함수
function _fnGetWhatDay_Eng(vDate) {

    if (String(vDate).length != 8) {
        return vDate;
    }
    else {
        var vformat = String(vDate);
        vformat = vformat.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

        var week = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];
        var dayOfWeek = week[new Date(vformat).getDay()];

        return dayOfWeek;
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

//시간 시간:분분 format 만들기
function _fnFormatTime(vTime) {

    if (vTime == "") {
        return vTime;
    }

    if (String(vTime).length > 3) {
        return String(vTime).replace(/(\d{2})(\d{2})/, '$1:$2');
    }
    else {
        var vValue = "0" + String(vTime)
        return vValue.replace(/(\d{2})(\d{2})/, '$1:$2');
    }
}

//시간 시간:분분 format 만들기
function _fnFormatTime_HHMMSS(vTime) {
    if (String(vTime).length > 5) {
        return String(vTime).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
    }
    else {
        return vTime;
        //var vValue = "0" + String(vTime)
        //return vValue.replace(/(\d{2})(\d{2})/, '$1:$2');
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
    var _url = "http://110.45.218.43:8072/UBIFORM/UView5/index.jsp"; //양재 IT 개발 서버에 설치한 UBIFORM Viewer URL
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

function _fnLogout() {
    $.ajax({
        type: "POST",
        url: "/User/LogOut",
        async: false,
        success: function (result, status, xhr) {
            $("#Session_USR_ID").val("");
            $("#Session_LOC_NM").val("");
            $("#Session_CUST_CD").val("");
            $("#Session_HP_NO").val("");
            $("#Session_DOMAIN").val("");
            $("#Session_OFFICE_CD").val("");
            $("#Session_AUTH_KEY").val("");
            location.href = vlocation_href;
        }
    });
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

function _fnCheckLogin() {
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        fnShowLoginLayer('/Reserve/myBoard');
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
        objResult.CUST_CD = _fnToNull($("#Session_CUST_CD").val());
        objResult.DOMAIN = _fnToNull($("#Session_DOMAIN").val());
        objResult.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
        objResult.HP_NO = _fnToNull($("#Session_HP_NO").val());
        objResult.OFFICE_CD = _fnToNull($("#Session_OFFICE_CD").val());
        objResult.AUTH_KEY = _fnToNull($("#Session_AUTH_KEY").val());
        objResult.AUTH_TYPE = _fnToNull($("#Session_AUTH_TYPE").val());
        objResult.CUST_PIC_CD = _fnToNull($("#Session_CUST_PIC_CD").val());

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
    objResult.CUST_CD = _fnToNull($("#Session_CUST_CD").val());
    objResult.DOMAIN = _fnToNull($("#Session_DOMAIN").val());
    objResult.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
    objResult.HP_NO = _fnToNull($("#Session_HP_NO").val());
    objResult.OFFICE_CD = _fnToNull($("#Session_OFFICE_CD").val());
    objResult.AUTH_KEY = _fnToNull($("#Session_AUTH_KEY").val());
    objResult.CUST_PIC_CD = _fnToNull($("#Session_CUST_PIC_CD").val());
    objResult.CUST_LOC_NM = _fnToNull($("#Session_CUST_LOC_NM").val());
    objResult.BL_ADDR = _fnToNull($("#Session_BL_ADDR").val());

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
    var rtnQna = result.QNA;
    var obj = new Object();

    currStr = " <select class='sel w3' id='QNA_TYPE'>";

    $(rtnQna).each(function (i) {
        currStr += "<option value='" + rtnQna[i].CODE + "'>" + rtnQna[i].NAME + "</option>";
    });
    currStr += "</select>";
    obj.qna = currStr;

  
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



function _fnDateFormat(date) {
    if (_fnToNull(date) != "") {
        if (date.length == 8) {
            return date.substr(0, 4) + '.' + date.substr(4, 2) + '.' + date.substr(6, 2);
        } else if (date.length == 6 || date.length == 4) {
            var test = date.substr(0, 2) + ':' + date.substr(2, 2);
            test = test;
            return date.substr(0, 2) + ':' + date.substr(2, 2);
        } else if (date.length == 14) {
            return date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2) + '-' + date.substr(8, 2) + '-' + date.substr(10, 2);
        }
    } else {
        return "";
    }
}

function _fnSetDate(vDate, vDiff) {

    var vValue = vDate;
    var vValue_Num = vValue.replace(/[^0-9]/g, "");

    var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/; //Declare Regex                  
    var dtArray = vValue_Num.match(rxDatePattern); // is format OK?

    var dtYear = dtArray[1];
    var dtMonth = dtArray[2];
    var dtDay = dtArray[3];

    var nowDate = new Date(dtYear + "/" + dtMonth + "/" + dtDay);
    var weekDate = nowDate.getTime() + (vDiff * 24 * 60 * 60 * 1000);
    nowDate.setTime(weekDate);

    var weekYear = nowDate.getFullYear();
    var weekMonth = nowDate.getMonth() + 1;
    var weedDay = nowDate.getDate();

    if (weekMonth < 10) { weekMonth = "0" + weekMonth; }
    if (weedDay < 10) { weedDay = "0" + weedDay; }
    var result = weekYear + "-" + weekMonth + "-" + weedDay;

    return result;

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