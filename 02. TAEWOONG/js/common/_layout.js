////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
//$(function () {    
//
//});

////////////////////////function///////////////////////
////로그아웃 (세션 , 쿠키 삭제)
function _fnLogout() {
    $.ajax({
        type: "POST",
        url: "/Home/LogOut",
        async: false,
        success: function (result, status, xhr) {

            $("#Session_USR_ID").val("");
            $("#Session_OFFICE_CD").val("");
            $("#Session_BRANCH_CD").val("");
            $("#Session_BRANCH_NM").val("");
            $("#Session_LOC_NM").val("");
            $("#Session_ENG_NM").val("");
            $("#Session_DOMAIN").val("");
            $("#Session_TEL_NO").val("");
            $("#Session_HP_NO").val("");
            $("#Session_EMAIL").val("");
            $("#Session_DEPT_CD").val("");
            $("#Session_DEPT_NM").val("");
            $("#Session_AUTH_TYPE").val("");
            $("#Session_AUTH_NM").val("");

            sessionStorage.clear();

            location.href = window.location.origin;
        }
    });
}
/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////
