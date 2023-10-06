////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//Enter key 입력 했을 때 이동 및 검색을 위한 이벤트
//엔터키 이벤트
$(document).keyup(function (e) {

 if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)
        if ($(e.target).attr('data-index') != undefined) {

            //회원가입 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("resgi") > -1) {

                var vIndex = $(e.target).attr('data-index').replace("resgi", "");
                $('[data-index="resgi' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //아이디 찾기 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("FindUser") > -1) {

                var vIndex = $(e.target).attr('data-index').replace("FindUser", "");
                $('[data-index="FindUser' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //비밀번호 찾기 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("FindPW") > -1) {

                var vIndex = $(e.target).attr('data-index').replace("FindPW", "");
                $('[data-index="FindPW' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //부킹 등록 수출 옵션 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("BkReg_E_") > -1) {

                var vIndex = $(e.target).attr('data-index').replace("BkReg_E_", "");
                $('[data-index="BkReg_E_' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //부킹 등록 수입 옵션 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("BkReg_I_") > -1) {

                var vIndex = $(e.target).attr('data-index').replace("BkReg_I_", "");

                if (vIndex == 5) {
                    if ($("#input_bk_COL12").attr("disabled") != 'disabled') {
                        $('[data-index="BkReg_I_' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                    } else if ($("#input_bk_COL12").attr("disabled") == 'disabled') {
                        $('[data-index="BkReg_I_' + (parseFloat(vIndex) + 2).toString() + '"]').focus();
                    }
                } else {
                    $('[data-index="BkReg_I_' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
            }
            

        }

    }
});
////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

