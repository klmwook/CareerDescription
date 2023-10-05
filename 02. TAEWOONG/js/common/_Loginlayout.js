////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
////////////////////jquery event///////////////////////
$(function () {

    //스크롤 이동 테스트
    if (_fnToNull(sessionStorage.getItem("Scroll")) != "") {
        $(".list").scrollLeft(sessionStorage.getItem("Scroll"));
    } else {

        var vURL = window.location.href.replace(window.location.origin + "/", "");        

        if (vURL != "Home/Login") {
            $("#" + vURL).find(".inner").addClass("on");
            $(".list").scrollLeft($("#" + vURL).offset().left);

            var vScrollLocation = $(".list").scrollLeft();
            sessionStorage.setItem("Scroll", vScrollLocation);
        }   
    }
});

$(".list").scroll(function () {
    var vScrollLocation = $(".list").scrollLeft();
    sessionStorage.setItem("Scroll", vScrollLocation);
});

////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////
