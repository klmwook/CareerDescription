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

/* 지연 함수 - ms 시간만큼 지연하여 실행. */
function _fnsleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

/* 레이어팝업 */
var layerPopup = function (obj, target, bool, id) {
    var $laybtn = $(obj),
        $glayer_zone = $(".layer_zone_edemo");
    $focus = target;
    if ($glayer_zone.length === 0) { return; }
    $glayer_zone.hide();
    $("body").addClass("layer_on");
    $laybtn.fadeIn(200);

    $glayer_zone.on("click", ".close", function (e) {
        var $this = $(this),
            t_layer = $this.parents(".layer_zone_edemo");
        $("body").removeClass("layer_on");
        t_layer.fadeOut(300);
    });

    $glayer_zone.on("click", function (e) {
        if (bool != false) {
            var $this = $(this),
                $t_item = $this.find(".layer_cont_edemo");
            if (id != undefined) {
                $("#" + id).focus();
            }
            if ($(e.target).parents(".layer_cont_edemo").length > 0) {
                return;
            }
            $("body").removeClass("layer_on");
            $this.fadeOut(300);
        }
    });

};