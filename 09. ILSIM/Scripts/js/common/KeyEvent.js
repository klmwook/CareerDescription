////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//$(function () {
//          
//});

//Enter key 입력 했을 때 이동 및 검색을 위한 이벤트
//엔터키 이벤트
$(document).keyup(function (e) {

 if (e.keyCode == 13) {//키가 13이면 실행 (엔터는 13)
        if ($(e.target).attr('data-index') != undefined) {

            //메인 페이지 - 선사 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_SEA") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Main_SEA", "");

                if (vIndex == 1) {
                    $('[data-index="Main_SEA' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_SEASchedule_Search").click();
                }
            }

            //메인 페이지 - 훼리 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_FERRY") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Main_FERRY", "");

                if (vIndex == 1) {
                    $('[data-index="Main_FERRY' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_FERRYSchedule_Search").click();
                }
            }

            //메인 페이지 - 항공 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_AIR") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Main_AIR", "");

                if (vIndex == 1) {
                    $('[data-index="Main_AIR' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_AIRSchedule_Search").click();
                }
            }

            //메인 페이지 - 화물진행정보(M B/L - H B/L) 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_UniCargoBL") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Main_UniCargoBL", "");

                if (vIndex == 1) {
                    $('[data-index="Main_UniCargoBL' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_Cargo_Search").click();
                }
            }

            //메인 페이지 - 화물진행정보(화물관리번호) 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_UniCargoMtno") > -1) {
                //indexOf 데이터를 지우고 +1
                $("#btn_Cargo_Search").click();
            }

            //메인 페이지 - 수출진행정보(수출신고번호) 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_UniOBnum") > -1) {
                //indexOf 데이터를 지우고 +1
                $("#btn_Outbound_Search").click();
            }

            //메인 페이지 - 수출진행정보(B/L) 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Main_UniOBbl") > -1) {
                //indexOf 데이터를 지우고 +1
                $("#btn_Outbound_Search").click();
            }

            //로지스틱스 툴 - CBM
            if ($(e.target).attr('data-index').indexOf("LogisticsCBM") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("LogisticsCBM", "");
                $('[data-index="LogisticsCBM' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
            }

            //스케줄 관리 - 선사 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Schedule_SEA") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Schedule_SEA", "");

                if (vIndex == 1) {
                    $('[data-index="Schedule_SEA' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_SEASchdule_Search").click();
                }
            }

            //스케줄 관리 - 훼리 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Schedule_FERRY") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Schedule_FERRY", "");

                if (vIndex == 1) {
                    $('[data-index="Schedule_FERRY' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_FERRYSchdule_Search").click();
                }
            }

            //스케줄 관리 - 훼리 스케줄 엔터 키 이벤트
            if ($(e.target).attr('data-index').indexOf("Schedule_AIR") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Schedule_AIR", "");

                if (vIndex == 1) {
                    $('[data-index="Schedule_AIR' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_AIRSchdule_Search").click();
                }
            }

            //문서 관리 - Invoice 조회
            if ($(e.target).attr('data-index').indexOf("invoice") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("invoice", "");

                if (vIndex == 3) {
                    $("button[name='Search_invoice']").click();
                }
                else {
                    $('[data-index="invoice' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }                
            }

            //문서 관리 - BL 조회
            if ($(e.target).attr('data-index').indexOf("BL") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("BL", "");

                if (vIndex == 3) {
                    $("button[name='Search_BL']").click();
                }
                else {
                    $('[data-index="BL' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
            }

            //문서 관리 - MYBOARD 조회
            if ($(e.target).attr('data-index').indexOf("MyBoard") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("MyBoard", "");

                if (vIndex == 3) {
                    $("button[name='Search_Board']").click();
                }
                else {
                    $('[data-index="MyBoard' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
            }

            //부킹 등록 - 부킹 스케줄 리스트 가져오기
            if ($(e.target).attr('data-index').indexOf("Regist") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("Regist", "");

                if (vIndex == 1) {
                    $('[data-index="Regist' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
                }
                else if (vIndex == 2) {
                    $("#btn_BK_Search").click();
                }
            }

            //부킹 등록 - 부킹 데이터 이동 시키기
            if ($(e.target).attr('data-index').indexOf("BK_Reg") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("BK_Reg", "");
                $('[data-index="BK_Reg' + (parseFloat(vIndex) + 1).toString() + '"]').focus();                
            }

            //부킹 조회 - 부킹 디테일 이동 시키기
            if ($(e.target).attr('data-index').indexOf("BKList_Detail") > -1) {
                //indexOf 데이터를 지우고 +1
                var vIndex = $(e.target).attr('data-index').replace("BKList_Detail", "");

                if (vIndex == 3) {
                    $("#btn_BkList_Search").click();
                }
                else {
                    $('[data-index="BKList_Detail' + (parseFloat(vIndex) + 1).toString() + '"]').focus();                    
                }
            }

        }

    }
});


////////////////////////function///////////////////////

/////////////////function MakeList/////////////////////

////////////////////////API////////////////////////////

