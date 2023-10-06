////////////////////전역 변수//////////////////////////
var _DocType_MBL = "'MANI','MBL'";
var _DocType_HBL = "'CIPL', 'HBL', 'CO', 'CC', 'IP','HDC'"; //INV는 따로
////////////////////jquery event///////////////////////
$(function () {

    $('.mode-btn-light').on('click', function () {
        $('body').removeClass('mode-light');
    });

    $('.mode-btn-dark').on('click', function () {
        $('body').addClass('mode-light');
    });
    $('body').addClass('e-service--main');    

    //파라미터가 LoginPopup Y 가 있을 경우 로그인 레이어 팝업이 뜨게 끔 하는 로직    
    if (_getParameter("LoginPopup") == "Y" && _fnToNull($("#Session_USR_ID").val()) == "") {
        fnShowLoginLayer("");
    }
    else if (_getParameter("HomePage") == "Y") {    //홈페이지에서 넘어온 페이지 이동 파라미터
        if (_fnToNull($("#Session_USR_ID").val()) != "") {  //세션이 남아 있을 경우 바로 페이지 이동
            window.location.href = window.location.origin + _getParameter("PageName") + "/" + _getParameter("Language");
        }
        else {
            if (_fnToNull(_getParameter("PageName")) == "") {   //홈페이지 => 로그인 화면 => 로그인 성공시 메인 페이지 이동
                fnShowLoginLayer("");
            }
            else if (_fnToNull(_getParameter("PageName")) == "/MOLAX/Sea")
            {
                window.location.href = window.location.origin + _getParameter("PageName") + "/" + _getParameter("Language");
            }
            else {
                fnShowLoginLayer(_getParameter("PageName"));    //홈페이지 => 로그인 화면 => 로그인 성공시 페이지 이동
            }
        }
    } else if (_getParameter("LoginFail") == "Y") {             //자동 로그인 실패 시 alert 창 띄우기
        fnShowLoginLayer("");
        alert("Login failed.");
    }
    else if (_fnToNull(_getParameter("TrackingNo")) != "") {    //홈페이지 => Tracking 검색
        $("#input_main_Tracking").val(_getParameter("TrackingNo"));
        $("#btn_main_Tracking").click();
    }

});

//메인 Tracking 버튼 이벤트
$(document).on("keyup", "#input_main_Tracking", function (e) {
    if (e.keyCode == 13) {
        if ($("#input_main_Tracking").val().length > 0) {
            if (isTrackingAvailable($("#input_main_Tracking").val().toUpperCase().replace(/\s/gi, ""))) {

                $("#input_Tracking_HBL_NO").val($("#input_main_Tracking").val().toUpperCase().replace(/\s/gi, ""));

                //레이어 팝업 열기
                magnificPopup.open({
                    items: {
                        src: '/Popup/Tracking'
                    },
                    type: 'ajax',
                    closeOnBgClick: false
                }, 0);
            }
        }
    }
});

//메인 Tracking 버튼 이벤트
$(document).on("click", "#btn_main_Tracking", function () {
    if ($("#input_main_Tracking").val().length > 0) {
        if (isTrackingAvailable($("#input_main_Tracking").val().toUpperCase().replace(/\s/gi, ""))) {

            $("#input_Tracking_HBL_NO").val($("#input_main_Tracking").val().toUpperCase().replace(/\s/gi, ""));

            //레이어 팝업 열기
            magnificPopup.open({
                items: {
                    src: '/Popup/Tracking'
                },
                type: 'ajax',
                closeOnBgClick: false
            }, 0);
        }
    }
    else {
        alert("Please enter House B/L.");
    }
});


////////////////////////function///////////////////////
//Tracking 가능한지 체크 로직
function isTrackingAvailable(vHBL_NO) {
    try {

        var objJsonData = new Object();
        var vResult = false;

        objJsonData.HBL_NO = vHBL_NO;

        $.ajax({
            type: "POST",
            url: "/Home/isTrackingAvailable",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {

                    if (JSON.parse(result).Available[0]["CHKBL_YN"] == "Y") {
                        vResult = true;
                    } else {
                        vResult = false;
                        alert("Please submit the B/L first.");
                    }
                } else {
                    alert("There is no tracking information.");
                    vResult = false;
                }
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });

        return vResult;

    } catch (err) {
        console.log("[Error - isTrackingAvailable]");
    }
}
/////////////////function MakeList/////////////////////
