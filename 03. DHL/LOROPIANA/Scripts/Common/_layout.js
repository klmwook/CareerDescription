////////////////////전역 변수//////////////////////////
var _SuccessSound = new Audio('./Files/SuccessSound.wav');
var _FailSound = new Audio('./Files/FailSound.wav');

////////////////////jquery event///////////////////////
//$(function () {
//    //var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER");
//    //if (_fnToNull(userInputId) != "") {
//    //    $("#email").val(userInputId);
//    //    $("#login_keep").replaceWith("<input type='checkbox' id='login_keep' name='login_keep' class='chk' checked>");
//    //}
//});

//로그아웃 버튼
$(document).on("click", ".btn_logout", function () {
    _fnLogout()
});

////////////////////////function///////////////////////
function _fnLogout() {
    $.ajax({
        type: "POST",
        url: "/Main/LogOut",
        async: false,
        success: function (result, status, xhr) {
            window.location = window.location.origin;
        }
    });
}

/////////////////function MakeList/////////////////////
////////////////////////API////////////////////////////





