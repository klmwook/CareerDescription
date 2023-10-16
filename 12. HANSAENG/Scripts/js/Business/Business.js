//메인 탭처리

var _vIndex = $("input[name=Business_index]").val();

$(function () {

    if (_fnToNull(_vIndex) != "") {
        if (_vIndex == "1") {
            var offset = $(".item01").eq(0).offset();
        }
        else if (_vIndex == "2") {
            var offset = $(".item02").eq(0).offset();
        }
        else if (_vIndex == "3") {
            var offset = $(".item03").eq(0).offset();
        }

        $('html, body').animate({ scrollTop: offset.top - 30 }, 1);
    }
});