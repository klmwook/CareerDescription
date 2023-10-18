//메인 탭처리
$(function () {
    $('.main-tab-index a').click(function () {
        var $this = $(this),
            $p = $this.closest('.main-tab'),
            $t = $p.find($this.attr('href'));
        $p.find('.main-tab-index li').removeClass('on');
        $this.parent().addClass('on');

        if ($t.length > 0) {
            $p.find('.main-tab-ct').hide()
            $t.css('display', 'block');
        }
        return false;
    });
});