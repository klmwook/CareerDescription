////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {
    //로그인 아이디 저장 체크가 되어있을 시 데이터 넣는 로직
    var userInputId = _fnGetCookie("Prime_CK_USR_ID_REMEMBER_MOAX");
    if (_fnToNull(userInputId) != "") {
        $("#Login_ID").val(userInputId);
        $("#login_keep").attr("checked", true);
    } else {
        $("#Login_ID").focus();
    }
});
////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////