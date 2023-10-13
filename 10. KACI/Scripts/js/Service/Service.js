////////////////////전역 변수//////////////////////////
//var _objJsonData = new Object();
var chkAll = true;
////////////////////jquery event///////////////////////
$(function () {    

    //신청일자
    $("#Elvis_REG_DATE").val(_fnPlusDate(0));

    //달력
    $("#Elvis_REG_DATE_Area").datetimepicker({
        timepicker: false,
        format: 'Y-m-d',   
        onShow: function (ct) {
            this.setOptions({
                maxDate: $("#Elvis_STAT_DATE_Area").find(".int").val() ? $("#Elvis_STAT_DATE_Area").find(".int").val() : false
            });
        },
        onSelectDate: function (dp, $input) {
            var str = $input.val();
            var m = str.substr(0, 10);
            $("#Elvis_REG_DATE_Area").find("#Elvis_REG_DATE").val(m);
        }
    });
    $("#Elvis_STAT_DATE_Area").datetimepicker({
        timepicker: false,
        format: 'Y-m-d', 
        onShow: function (ct) {
            this.setOptions({
                minDate: $("#Elvis_REG_DATE_Area").find(".int").val() ? $("#Elvis_REG_DATE_Area").find(".int").val() : false
            });
        },
        onSelectDate: function (dp, $input) {
            var str = $input.val();
            var m = str.substr(0, 10);
            $("#Elvis_STAT_DATE_Area").find("#Elvis_STAT_DATE").val(m);
        }
    });

    //-찍어서 자동으로 나오게 세팅
    $("#Elvis_HP_NO").keyup(function (e) {
        $(this).val($(this).val().replace(/[^0-9]/gi, ""));
        $(this).val(_fnMakePhoneForm($(this).val()));
    });

    //key 세팅 할때
});

//비밀번호 1번 key 입력 이벤트
$(document).on("keyup", "#Elvis_PW1", function (e) {

    var vPw1 = $(this).val();
    var vPw2 = $("#Elvis_PW2").val();    

    //6개 이상
    if (vPw1 == "") {
        $("#Pw1_OverSix").hide();
    } else {
        if (vPw1.length < 6) {
            $("#Pw1_OverSix").show();
        } else {
            $("#Pw1_OverSix").hide();
        }
    }

    //6개 이상
    if (vPw1 == "") {
        $("#Pw2_Compare").hide();
    } else {
        if (vPw1 != "" && vPw2 != "") {
            if (vPw1 != vPw2) {
                //데이터를 입력 해 주세요.
                $("#Pw2_Compare").show();
            } else if (vPw1 == vPw2) {
                $("#Pw2_Compare").hide();
            }
        }
    }

});

$('.tab > li').on("click", function () {

    $(":checkbox").prop("checked", false);
    $("#elvis_total_price").text(0);
    if (_fnToNull(this.id) == "TAB_ALL") {
        $(".span_elvis").attr("rowspan", 15);
        $(".span_svc").attr("rowspan", 14);
        $(".elvis").show();
    } else if (_fnToNull(this.id) == "TAB_FRD") {
        $(".span_elvis").attr("rowspan", 9);
        $(".span_svc").attr("rowspan", 8);
        $(".elvis").hide();
        $(".row_frd").show();
    } else if (_fnToNull(this.id) == "TAB_PRM") {
        $(".span_elvis").attr("rowspan", 7);
        $(".span_svc").attr("rowspan", 6);
        $(".elvis").hide();
        $(".row_prm").show();

    } else if (_fnToNull(this.id) == "TAB_BIG") {
        $(".span_elvis").attr("rowspan", 11);
        $(".span_svc").attr("rowspan", 10);
        $(".elvis").hide();
        $(".row_big").show();
    }
    
});


//비밀번호 2번 key 입력 이벤트
$(document).on("keyup", "#Elvis_PW2", function (e) {
    var vPw1 = $("#Elvis_PW1").val();        
    var vPw2 = $(this).val();

    //6개 이상
    if (vPw2 == "") {
        $("#Pw2_OverSix").hide();
    } else {
        if (vPw2.length < 6) {
            $("#Pw2_OverSix").show();
        } else {
            $("#Pw2_OverSix").hide();
        }
    }

    if (vPw2 == "") {
        $("#Pw2_Compare").hide();
    } else {
        if (vPw1 != "" && vPw2 != "") {
            if (vPw1 != vPw2) {
                //데이터를 입력 해 주세요.
                $("#Pw2_Compare").show();
            } else if (vPw1 == vPw2) {
                $("#Pw2_Compare").hide();
            }
        }
    }
});

//엔터키 입력시 마다 다음 input으로 가기
$(document).keydown(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');
            $('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
        }
    }
});

//이메일 선택 클릭 시 
$(document).on("change", "#Elvis_Email_Select", function () {
    $("#Elvis_EMAIL2").val($(this).val());
});

//주소 찾기 버튼 이벤트
$(document).on("click", "#Elvis_Find_Addr", function () {

    //기존 데이터 초기화
    $("#Elvis_Juso_keyword").val("");
    $(".Elvis_JusoList_Area").hide();

    layerPopup('#Find_Address');
});


//기본주소를 입력 해 주세요. input 클릭 시 주소 찾기 팝업창 띄우기
$(document).on("click", "#Elvis_OFFICE_ADDR, #Elvis_OFFICE_CODE", function () {

    //기존 데이터 초기화
    $("#Elvis_Juso_keyword").val("");
    $(".Elvis_JusoList_Area").hide();

    layerPopup('#Find_Address');
});

//상세건물 보기 이벤트
$(document).on("click", "#Elvis_JusoList_DataList tr td[name='detBdNmList']", function () {
    if (_fnToNull($(this).text().trim()) != "") {
        if ($(this).text() == "닫기") {
            $(this).text("상세건물 보기");
            $(this).parent().find("td").eq(1).find("p[name=detBdNmList_display]").hide();
        } else {
            $(this).text("닫기");
            $(this).parent().find("td").eq(1).find("p[name=detBdNmList_display]").show();
        } 
    }
});

//주소 버튼 클릭 시 상세 주소 데이터 입력 창 띄우기
$(document).on("click", "#Elvis_JusoList_DataList tr td[name='roadAddr']", function () {

    //기존 검색창 hide and show
    $(".Elvis_JusoDetail_Area").show();
    $(".Elvis_JusoList_Area").hide();
    //초기화도 같이 해주자.

    //init
    $("#Elvis_JusoDetail_roadAddr1").text("");
    $("#Elvis_JusoDetail_roadAddr2").text("");
    $("#Elvis_JusoDetail_roadAddrPart1").val("");
    $("#Elvis_JusoDetail_zipNo").val("");

    //도로명 주소
    $("#Elvis_JusoDetail_roadAddr1").text($(this).find("input[name='roadAddrPart1']").val());

    //상세주소 입력
    $("#Elvis_JusoDetail_roadAddr2").text($(this).find("input[name='roadAddrPart2']").val());

    //우편번호 , 기본주소 값
    $("#Elvis_JusoDetail_roadAddrPart1").val($(this).find("input[name='roadAddrPart1']").val());    
    $("#Elvis_JusoDetail_zipNo").val($(this).find("input[name='zipNo']").val());

});

//주소 찾기 - 상세주소입력 엔터키 이벤트
$(document).on("keyup", "#Elvis_JusoDetail_roadAddrPart2", function (i) {
    if (i.keyCode == 13) {
        fnSetAddrData();
    }
});

//주소 찾기 디테일 "주소입력"
$(document).on("click", "#Elvis_JusoDetail_BtnArea label", function () {
    fnSetAddrData();
});

//사업자 등록 번호 체크
$(document).on("click", "#Elvis_Check_Crn", function () {
    var regex = /[^0-9]/g;

    try {
        if ($("#Elvis_CRN").val().length == 10) {

            if (regex.test(_fnToNull($("#Elvis_CRN").val()))) {
                _fnAlertMsg("숫자만 입력 해 주세요.");
                $("#Elvis_CRN").focus();
            }
            else {
                var objJsonData = new Object();
                objJsonData.CRN = $("#Elvis_CRN").val().replace(/-/gi, "-").trim();

                $.ajax({
                    type: "POST",
                    url: "/Home/FnCheckCRN",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result == null) {
                            _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                        } else {
                            if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                                _fnAlertMsg("이미 등록된 사업자 번호 입니다.\n 담당자에게 문의하세요");
                                $("#Elvis_CRN").val("");
                            }
                            else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                                _fnAlertMsg("담당자에게 문의 하세요.");
                                console.log(JSON.parse(result).Result[0]["trxMsg"]);
                            } else if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                                _fnAlertMsg("가입 가능한 사업자 번호 입니다.");
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        _fnAlertMsg("담당자에게 문의 하세요.");
                        console.log(error);
                        $("#ProgressBar_Loading").hide();
                    },
                    beforeSend: function () {
                        $("#ProgressBar_Loading").show(); //프로그래스 바
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                    }
                });
            }
        } else {
            if ($("#Elvis_CRN").val().length != 0) {
                _fnAlertMsg("사업자 등록 번호 10자리를 입력 해 주세요.");
            }
        }
    }
    catch (e) {
        console.log(e.message);
    }
});


$("#elvis_big_friend").click(function (e) {
    if ($("#elvis_big_friend").is(":checked")) {
        $("input[name='elvis_big_friend']").val("Y");

        $("#elvis_big_docu").prop("checked", true);
        $("#elvis_big_exim").prop("checked", true);
        $("#elvis_big_data").prop("checked", true);

    } else {
        if (chkAll) {
            $("input[name='elvis_big_friend']").val("N");
            $("#elvis_big_docu").prop("checked", false);
            $("#elvis_big_exim").prop("checked", false);
            $("#elvis_big_data").prop("checked", false);
        } 
    }
});

$("#elvis").click(function (e) {
    if ($("#elvis").is(":checked")) {
        $("input[name='elvis']").val("Y");

        $("#elvis_fms").prop("checked", true);
        $("#elvis_wms").prop("checked", true);
        $("#elvis_tms").prop("checked", true);
        $("#elvis_express").prop("checked", true);

    } else {
            $("input[name='elvis']").val("N");
            $("#elvis_fms").prop("checked", false);
            $("#elvis_wms").prop("checked", false);
            $("#elvis_tms").prop("checked", false);
            $("#elvis_express").prop("checked", false);
    }
});

  //if ($("#elvis_big_friend").is(":checked")) {
    //    $("input[name='elvis_big_friend']").val("Y");
    //    $("#elvis_big_docu").prop("checked", true);
    //    $("#elvis_big_exim").prop("checked", true);
    //    $("#elvis_big_data").prop("checked", true);

    //} else {
    //    if (chkAll) {
    //    $("input[name='elvis_big_friend']").val("N");
    //        $("#elvis_big_docu").prop("checked", false);
    //        $("#elvis_big_exim").prop("checked", false);
    //        $("#elvis_big_data").prop("checked", false);
    //    }
    //    chkAll = false;

    //

//ELVIS 서비스 체크 박스
$(document).on("click", ".GetServicePrice", function () {
    fnSetTotalPrice();
});

//거래처 정보 이벤트
$(document).on("click", "#elvis_cust_info", function () {
    if ($(this).is(":checked")) {
        $("input[name='elvis_cust_info']").val("Y");
    } else {
        $("input[name='elvis_cust_info']").val("N");
    }
});

//회계 잔액 이벤트
$(document).on("click", "#elvis_account", function () {
    if ($(this).is(":checked")) {
        $("input[name='elvis_account']").val("Y");
    } else {
        $("input[name='elvis_account']").val("N");
    }
});

//FAX 체크 이벤트
$(document).on("click", "#elvis_fax", function () {
    if ($(this).is(":checked")) {
        $("input[name='elvis_fax']").val("Y");
    } else {
        $("input[name='elvis_fax']").val("N");
    }
});

//SMS 체크 이벤트
$(document).on("click", "#elvis_sms", function () {
    if ($(this).is(":checked")) {
        $("input[name='elvis_sms']").val("Y");
    } else {
        $("input[name='elvis_sms']").val("N");
    }
});

//사업자 번호 업로드 버튼 이벤트
$(document).on("change", "#Elvis_Crn_Upload", function () {
    var vFileExtension = $(this).get(0).files[0].name.substring($(this).get(0).files[0].name.lastIndexOf(".") + 1, $(this).get(0).files[0].name.length);

    if (fnFileValidation("Elvis_Crn_Upload")) {
        if (vFileExtension.toLowerCase() == "pdf" || vFileExtension.toLowerCase() == "jpg" || vFileExtension.toLowerCase() == "jpeg" || vFileExtension.toLowerCase() == "png") {
            $("#Elvis_Crn_FileName").val($(this).get(0).files[0].name);
        } else {
            _fnAlertMsg("pdf,jpg,jpeg,png 확장자 파일만 업로드 가능 합니다.");
            $(this).val("");
        }
    } 
});

//ELVIS 청구 업로드 버튼 이벤트
$(document).on("change", "#Elvis_Charge_Upload", function () {
    var vFileExtension = $(this).get(0).files[0].name.substring($(this).get(0).files[0].name.lastIndexOf(".") + 1, $(this).get(0).files[0].name.length);

    if (fnFileValidation("Elvis_Charge_Upload")) {
        if (vFileExtension.toLowerCase() == "doc" || vFileExtension.toLowerCase() == "pdf") {
            $("#Elvis_Charge_FileName").val($(this).get(0).files[0].name);
        } else {
            _fnAlertMsg("양식 확장자인 doc 확장자만 업로드 가능 합니다.");
            $(this).val("");
        }
    } 
});

//자동이체 신청서 업로드 버튼 이벤트
$(document).on("change", "#Elvis_Auto_Upload", function () {
    var vFileExtension = $(this).get(0).files[0].name.substring($(this).get(0).files[0].name.lastIndexOf(".") + 1, $(this).get(0).files[0].name.length);

    if (fnFileValidation("Elvis_Auto_Upload")) {
        if (vFileExtension.toLowerCase() == "doc" || vFileExtension.toLowerCase() == "pdf") {
            $("#Elvis_Auto_FileName").val($(this).get(0).files[0].name);
        } else {
            _fnAlertMsg("양식 확장자인 doc 확장자만 업로드 가능 합니다.");
            $(this).val("");
        }
    } 
});

//submit - 등록 버튼 이벤트
$(document).on("click", "#btn_Regester", function () {
    $("#ajax_form").submit();
});

//동의하고 가입하기 버튼 클릭 이벤트
$("#ajax_form").submit(function (e) {
    e.preventDefault();

    try {
        //벨리데이션 체크
        //if (fnValidation()) {

            //데이터 넣기
            $("#elvis_fms_price").val($("#elvis_fms_price_text").text().replace(/,/gi, ""));
            $("#elvis_wms_price").val($("#elvis_wms_price_text").text().replace(/,/gi, ""));
            $("#elvis_tms_price").val($("#elvis_tms_price_text").text().replace(/,/gi, ""));
            $("#elvis_express_price").val($("#elvis_express_price_text").text().replace(/,/gi, ""));
            $("#elvis_prime_price").val($("#elvis_prime_price_text").text().replace(/,/gi, ""));
            $("#elvis_hidden_total_price").val($("#elvis_total_price").text().replace(/,/gi, ""));
            $("#elvis_big_uni_price").val(50000);
            $("#elvis_big_sfi_price").val(50000);
            $("#elvis_big_ter_price").val(50000);
            $("#elvis_big_trk_price").val(50000);
            $("#elvis_big_lat_price").val(50000);
            $("#elvis_big_docu_price").val(200000);
            $("#elvis_big_exim_price").val(100000);
            $("#elvis_big_data_price").val(100000);

            $.ajax({
                type: "POST",
                url: "/Home/FnSetRegister",
                async: true,
                dataType: "json",
                contentType: false, //Ajax로 이메일 보낼 때 필수 추가 하여야 합니다.
                processData: false, //Ajax로 이메일 보낼 때 필수 추가 하여야 합니다.
                data: new FormData(this),
                success: function (result) {
                    if (result == null) {
                        _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            
                            //back 단에서 이메일 보내기 함수 호출
                            if (fnSendEmail(result) == "Y") {
                                _fnsleep(3000);
                                _fnAlertMsg("서비스 가입 신청이 완료 되었습니다.");
                            }
                            else {
                                _fnsleep(3000);
                                _fnAlertMsg("서비스 가입 신청이 완료 되었습니다.");
                                console.log("이메일이 전송되지 않았습니다. 담당자 확인 필요");
                            }                            
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            _fnAlertMsg(JSON.parse(result).Result[0]["trxMsg"]);
                            console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        }
                        else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                            _fnAlertMsg("담당자에게 문의 하세요.");
                            console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        }
                    }
                }, error: function (xhr, status, error) {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(error);
                    $("#ProgressBar_Loading").hide();
                },
                beforeSend: function () {
                    $("#ProgressBar_Loading").show(); //프로그래스 바
                },
                complete: function () {
                    $("#ProgressBar_Loading").hide(); //프로그래스 바
                }
            });
        //}
    }
    catch (e) {
        console.log(e.message);
    }
});    

//이메일 보내기 C#으로 보내기.
function fnSendEmail(vJsonData) {

    //back단도 신경 써야됨.
    try {
        var objJsonData = new Object();
        var vResult = JSON.parse(vJsonData).ZIP_DATA;

        var vReturnValue = "";

        objJsonData.ZIP_PATH = vResult[0]["ZIP_PATH"];
        objJsonData.Elvis_ID = $("#Elvis_ID").val();
        objJsonData.Elvis_OfficeNM = $("#Elvis_OfficeNM").val();
        objJsonData.Elvis_LOCNM = $("#Elvis_LOCNM").val();
        objJsonData.Elvis_EMAIL = $("#Elvis_EMAIL1").val() + "@" + $("#Elvis_EMAIL2").val();
        objJsonData.Elvis_CRN = $("#Elvis_CRN").val();
        objJsonData.Elvis_OFFICE = $("#Elvis_OFFICE_CODE").val() + " " + $("#Elvis_OFFICE_ADDR").val() + " " + $("#Elvis_OFFICE_ADDR2").val();        
        objJsonData.Elvis_HP_NO = $("#Elvis_HP_NO").val();
        objJsonData.Elvis_REG_DATE = $("#Elvis_REG_DATE").val();
        objJsonData.Elvis_STAT_DATE = $("#Elvis_STAT_DATE").val();
        objJsonData.elvis_total_price = $("#elvis_total_price").text();

        if ($("#elvis_fms").is(":checked")) {
            objJsonData.elvis_fms = "Y";
        } else {
            objJsonData.elvis_fms = "N";
        }

        if ($("#elvis_wms").is(":checked")) {
            objJsonData.elvis_wms = "Y";
        } else {
            objJsonData.elvis_wms = "N";
        }

        if ($("#elvis_tms").is(":checked")) {
            objJsonData.elvis_tms = "Y";
        } else {
            objJsonData.elvis_tms = "N";
        }

        if ($("#elvis_express").is(":checked")) {
            objJsonData.elvis_express = "Y";
        } else {
            objJsonData.elvis_express = "N";
        }

        if ($("#elvis_prime").is(":checked")) {
            objJsonData.elvis_prime = "Y";
        } else {
            objJsonData.elvis_prime = "N";
        }

        if ($("#elvis_cust_info").is(":checked")) {
            objJsonData.elvis_cust_info = "Y";
        } else {
            objJsonData.elvis_cust_info = "N";
        }

        if ($("#elvis_account").is(":checked")) {
            objJsonData.elvis_account = "Y";
        } else {
            objJsonData.elvis_account = "N";
        }

        if ($("#elvis_fax").is(":checked")) {
            objJsonData.elvis_fax = "Y";
        } else {
            objJsonData.elvis_fax = "N";
        }

        if ($("#elvis_sms").is(":checked")) {
            objJsonData.elvis_sms = "Y";
        } else {
            objJsonData.elvis_sms = "N";
        }

        if ($("#elvis_sms").is(":checked")) {
            objJsonData.elvis_sms = "Y";
        } else {
            objJsonData.elvis_sms = "N";
        }

        //엘비스 빅
        if ($("#elvis_big").is(":checked")) {
            objJsonData.elvis_big = "Y";

            if ($("#elvis_big_uni").is(":checked")) {
                objJsonData.elvis_big_uni = "Y";
            } else {
                objJsonData.elvis_big_uni = "N";
            }

            if ($("#elvis_big_sfi").is(":checked")) {
                objJsonData.elvis_big_sfi = "Y";
            } else {
                objJsonData.elvis_big_sfi = "N";
            }

            if ($("#elvis_big_ter").is(":checked")) {
                objJsonData.elvis_big_ter = "Y";
            } else {
                objJsonData.elvis_big_ter = "N";
            }

            if ($("#elvis_big_trk").is(":checked")) {
                objJsonData.elvis_big_trk = "Y";
            } else {
                objJsonData.elvis_big_trk = "N";
            }

            if ($("#elvis_big_lat").is(":checked")) {
                objJsonData.elvis_big_lat = "Y";
            } else {
                objJsonData.elvis_big_lat = "N";
            }


        } else {
            objJsonData.elvis_big = "N";
            objJsonData.elvis_big_uni = "N";
            objJsonData.elvis_big_sfi = "N";
            objJsonData.elvis_big_ter = "N";
            objJsonData.elvis_big_trk = "N";
            objJsonData.elvis_big_lat = "N";
        }



        //엘비스 프렌드
        if ($("#elvis_big_friend").is(":checked")) {
            objJsonData.elvis_big_friend = "Y";

            if ($("#elvis_big_docu").is(":checked")) {
                objJsonData.elvis_big_docu = "Y";
            } else {
                objJsonData.elvis_big_docu = "N";
            }

            if ($("#elvis_big_exim").is(":checked")) {
                objJsonData.elvis_big_exim = "Y";
            } else {
                objJsonData.elvis_big_exim = "N";
            }

            if ($("#elvis_big_data").is(":checked")) {
                objJsonData.elvis_big_data = "Y";
            } else {
                objJsonData.elvis_big_data = "N";
            }


        } else {
            objJsonData.elvis_big_friend = "N";
            objJsonData.elvis_big_docu = "N";
            objJsonData.elvis_big_exim = "N";
            objJsonData.elvis_big_data = "N";
        }

        $.ajax({
            type: "POST",
            url: "/Home/fnSendEmail",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    console.log(result);
                    vReturnValue = "N";
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        vReturnValue = "Y";
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        vReturnValue = "N";
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                        vReturnValue = "N";
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                return false;
            }            
        });

        return vReturnValue;
    }
    catch (e)
    {
        console.log(e.message);
        return "N";
    }
}

////////////////////////function///////////////////////
function fnprepare() {
    _fnAlertMsg("준비중 입니다.");
}

//파일 벨리데이션 체크
function fnFileValidation(vFileID) {

    //벨리데이션 체크
    for (var i = 0; i < $("#" + vFileID).get(0).files.length; i++) {
        //추후 DB에 제외 확장자 목록 테이블을 넣고 거기서 변경 할 수 있게 조절.
        var vFileExtension = $("#" + vFileID).get(0).files[i].name.substring($("#" + vFileID).get(0).files[i].name.lastIndexOf(".") + 1, $("#" + vFileID).get(0).files[i].name.length);


        //파일 사이즈 10MB 이상일 경우 Exception
        if (10485759 < $("#" + vFileID).get(0).files[i].size) {
            _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
            return false;
        }
        //확장자 Validation - exe,js,asp,jsp,php,java 파일은 파일 저장 X
        if (vFileExtension == "exe" || vFileExtension == "js" || vFileExtension == "asp" || vFileExtension == "jsp" || vFileExtension == "php" || vFileExtension == "java") {
            _fnAlertMsg(vFileExtension + " 확장자는 파일 업로드를 할 수 없습니다.");
            return false;
        }
    }

    return true;
}

//동의하고 가입하기 벨리데이션 체크
function fnValidation() {

    /********************************************필수 값 체크********************************************/
    //사용할 아이디 값 체크
    if (_fnToNull($("#Elvis_ID").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("사용할 아이디를 입력 해 주세요.", "Elvis_ID");
        return false;
    }

    if (_fnToNull($("#Elvis_PW1").val()) == "") {
        _fnAlertMsg("비밀번호를 입력 해 주세요.", "Elvis_PW1");
        return false;
    }

    if (_fnToNull($("#Elvis_PW2").val()) == "") {
        _fnAlertMsg("비밀번호를 입력 해 주세요.", "Elvis_PW2");
        return false;
    }
    
    //상호 값 체크
    if (_fnToNull($("#Elvis_OfficeNM").val().replace(/ /gi, "")) == "") {
        //alert("상호를 입력 해 주세요.");        
        //$("#Elvis_OfficeNM").focus();
        _fnAlertMsg("상호를 입력 해 주세요.", "Elvis_OfficeNM");
        return false;
    }
    
    //대표자 값 체크
    if (_fnToNull($("#Elvis_LOCNM").val().replace(/ /gi, "")) == "") {
        //alert("대표자를 입력 해 주세요.");       
        //$("#Elvis_LOCNM").focus();
        _fnAlertMsg("대표자를 입력 해 주세요.", "Elvis_LOCNM");
        return false;
    }
    
    //이메일 첫번째 태그 값 체크
    if (_fnToNull($("#Elvis_EMAIL1").val().replace(/ /gi, "")) == "") {
        //alert("이메일을 입력 해 주세요.");        
        //$("#Elvis_EMAIL1").focus();
        _fnAlertMsg("이메일을 입력 해 주세요.", "Elvis_EMAIL1");
        return false;
    }
    
    //이메일 두번째 태그 값 체크
    if (_fnToNull($("#Elvis_EMAIL2").val().replace(/ /gi, "")) == "") {
        //alert("이메일을 입력 해 주세요.");
        //$("#Elvis_EMAIL2").focus();
        _fnAlertMsg("이메일을 입력 해 주세요.", "Elvis_EMAIL2");
        return false;
    }
    
    //사업자등록번호 값 체크 
    if (_fnToNull($("#Elvis_CRN").val().replace(/ /gi, "")) == "") {
        //alert("사업자 번호를 입력 해 주세요.");        
        //$("#Elvis_CRN").focus();
        _fnAlertMsg("사업자 번호를 입력 해 주세요.", "Elvis_CRN");
        return false;
    }
    
    //주소 입력체크 (주석 풀어야된다.)
    if (_fnToNull($("#Elvis_OFFICE_ADDR").val().replace(/ /gi, "")) == "") {
        //alert("주소를 입력 해 주세요.");        
        //$("#Elvis_OFFICE_ADDR").focus();
        _fnAlertMsg("주소를 입력 해 주세요.", "Elvis_OFFICE_ADDR");
        return false;
    }
    
    //휴대전화 값 체크 
    if (_fnToNull($("#Elvis_HP_NO").val().replace(/ /gi, "")) == "") {
        //alert("휴대전화 번호를 입력 해 주세요.");
        //$("#Elvis_HP_NO").focus();
        _fnAlertMsg("휴대전화 번호를 입력 해 주세요.", "Elvis_HP_NO");
        return false;
    }
    
    //신청일자를 입력 해 주세요.
    if (_fnToNull($("#Elvis_REG_DATE").val().replace(/ /gi, "")) == "") {
        //alert("신청일자를 입력 해 주세요.");
        //$("#Elvis_REG_DATE").focus();
        _fnAlertMsg("신청일자를 입력 해 주세요.", "Elvis_REG_DATE");
        return false;
    }
    
    //시작 일자 값 체크
    if (_fnToNull($("#Elvis_STAT_DATE").val().replace(/ /gi, "")) == "") {
        //alert("휴대전화 번호를 입력 해 주세요.");
        //$("#Elvis_STAT_DATE").focus();
        _fnAlertMsg("휴대전화 번호를 입력 해 주세요.", "Elvis_STAT_DATE");
        return false;
    }
/********************************************필수 값 체크********************************************/

    //비밀번호 체크 로직 넣기 
    //var vCheck = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{6,17}$/;
    //!vCheck.test(vValue)

    if (_fnToNull($("#Elvis_PW1").val()) != _fnToNull($("#Elvis_PW2").val())) {
        _fnAlertMsg("비밀번호가 동일 하지 않습니다. 다시 입력 해 주세요.", "Elvis_PW2");
        return false;
    }

    //번호 이외의 문자가 들어간 것 체크
    var regex = /[^0-9]/g;
    
    //사업자 번호 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_CRN").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        //alert("숫자만 입력 해 주세요.");
        //$("#Elvis_CRN").focus();
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_CRN");
        return false;
    }   
    
    //휴대전화 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_HP_NO").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        //alert("숫자만 입력 해 주세요.");
        //$("#Elvis_HP_NO").focus();
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_HP_NO");
        return false;
    }
    
    //신청일자 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_REG_DATE").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        //alert("숫자만 입력 해 주세요.");
        //$("#Elvis_REG_DATE").focus();
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_REG_DATE");
        return false;
    }
    
    //시작일자 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_STAT_DATE").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        //alert("숫자만 입력 해 주세요.");
        //$("#Elvis_STAT_DATE").focus();
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_STAT_DATE");
        return false;
    }
    
    //이메일 특수문자 안되게 (영어 , 한글 , 숫자만 되게)
    var vCheckEmail = /[\{\}\[\]\/?.,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/gi    

    if (vCheckEmail.test(_fnToNull($("#Elvis_EMAIL1").val().replace(/ /gi, "")))){
        _fnAlertMsg("이메일에 특수 문자는 들어 갈 수 없습니다.", "Elvis_EMAIL1");
        return false;
    }
    
    var vKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;    
    
    //사용할 아이디 값 한글 체크
    if (vKorean.test(_fnToNull($("#Elvis_ID").val().replace(/ /gi, "")))) {
        _fnAlertMsg("아이디에 한글이 들어 갈 수 없습니다.", "Elvis_ID");
        return false;
    }

    //아이디 특수문자 체크
    if (vCheckEmail.test(_fnToNull($("#Elvis_ID").val().replace(/ /gi, "")))) {
        _fnAlertMsg("아이디에 특수문자가 들어 갈 수 없습니다.", "Elvis_ID");
        return false;
    }

    return true;
}


//ELVIS 서비스 체크박스 가격 체크
function fnSetTotalPrice() {

    var vTotalPrice = 0;
    var vBigTotalPrice = 0;

    //FMS
    if ($("#elvis_fms").is(":checked")) {
        $("input[name='elvis_fms']").val("Y");
        vTotalPrice += 250000;
    } else {
        $("input[name='elvis_fms']").val("N");
    }

    //WMS
    if ($("#elvis_wms").is(":checked")) {
        $("input[name='elvis_wms']").val("Y");
        vTotalPrice += 250000;
    } else {
        $("input[name='elvis_wms']").val("N");
    }

    //TMS
    if ($("#elvis_tms").is(":checked")) {
        $("input[name='elvis_tms']").val("Y");
        vTotalPrice += 150000;
    } else {
        $("input[name='elvis_tms']").val("N");
    }

    //EXPRESS
    if ($("#elvis_express").is(":checked")) {
        $("input[name='elvis_express']").val("Y");
        vTotalPrice += 150000;
    } else {
        $("input[name='elvis_express']").val("N");
    }

    //PRIME
    if ($("#elvis_prime").is(":checked")) {
        $("input[name='elvis_prime']").val("Y");
        vTotalPrice += 150000;
    } else {
        $("input[name='elvis_prime']").val("N");
    }

    //ELVIS-BIG
    if ($("#elvis_big").is(":checked")) {
        $("input[name='elvis_big']").val("Y");
        vTotalPrice += 100000;
        vBigTotalPrice += 100000;
        $("#elvis_big_price").val(100000);

        $("#elvis_big_uni").attr("disabled", false);
        $("#elvis_big_sfi").attr("disabled", false);
        $("#elvis_big_ter").attr("disabled", false);
        $("#elvis_big_trk").attr("disabled", false);
        $("#elvis_big_lat").attr("disabled", false);

        //ELVIS-BIG 수입화물/수출이행
        if ($("#elvis_big_uni").is(":checked")) {
            $("input[name='elvis_big_uni']").val("Y");
            vTotalPrice += 50000;
            vBigTotalPrice += 50000;
        } else {
            $("input[name='elvis_big_uni']").val("N");
        }

        //ELVIS-BIG 해상운임
        if ($("#elvis_big_sfi").is(":checked")) {
            $("input[name='elvis_big_sfi']").val("Y");
            vTotalPrice += 50000;
            vBigTotalPrice += 50000;
        } else {
            $("input[name='elvis_big_sfi']").val("N");
        }

        //ELVIS-BIG 터미널
        if ($("#elvis_big_ter").is(":checked")) {
            $("input[name='elvis_big_ter']").val("Y");
            vTotalPrice += 50000;
            vBigTotalPrice += 50000;
        } else {
            $("input[name='elvis_big_ter']").val("N");
        }

        //ELVIS-BIG 화물추적
        if ($("#elvis_big_trk").is(":checked")) {
            $("input[name='elvis_big_trk']").val("Y");
            vTotalPrice += 50000;
            vBigTotalPrice += 50000;            
        } else {
            $("input[name='elvis_big_trk']").val("N");
        }

        //ELVIS-BIG D/A 최적화
        if ($("#elvis_big_lat").is(":checked")) {
            $("input[name='elvis_big_lat']").val("Y");
            vTotalPrice += 50000;
            vBigTotalPrice += 50000;
        } else {
            $("input[name='elvis_big_lat']").val("N");
        }

        $("#elvis_big_price_text").text(fnSetComma(vBigTotalPrice));
    } else {
        $("input[name='elvis_big']").val("N");
        fninitElvisBig();
    }
    //ELVIS-FRIEND
    //if ($("#elvis_big_friend").is(":checked")) {
    //    $("input[name='elvis_big_friend']").val("Y");
    //    $("#elvis_big_docu").prop("checked", true);
    //    $("#elvis_big_exim").prop("checked", true);
    //    $("#elvis_big_data").prop("checked", true);
        
    //} else {
    //    if (chkAll) {
    //    $("input[name='elvis_big_friend']").val("N");
    //        $("#elvis_big_docu").prop("checked", false);
    //        $("#elvis_big_exim").prop("checked", false);
    //        $("#elvis_big_data").prop("checked", false);
    //    }
    //    chkAll = false;
        
    //}


    //ELVIS-BIG 해상운임
    if ($("#elvis_big_docu").is(":checked")) {
        $("input[name='elvis_big_docu']").val("Y");
        vTotalPrice += 200000;
        vBigTotalPrice += 200000;
    } else {
        
        $("input[name='elvis_big_docu']").val("N");
    }


    //ELVIS-BIG 해상운임
    if ($("#elvis_big_exim").is(":checked")) {
        $("input[name='elvis_big_exim']").val("Y");
        vTotalPrice += 100000;
        vBigTotalPrice += 100000;
    } else {
        $("#elvis_big_exim").prop("checked", false);
        $("input[name='elvis_big_exim']").val("N");
    }


    //ELVIS-BIG 해상운임
    if ($("#elvis_big_data").is(":checked")) {
        $("input[name='elvis_big_data']").val("Y");
        vTotalPrice += 100000;
        vBigTotalPrice += 100000;
    } else {
        $("#elvis_big_data").prop("checked", false);
        $("input[name='elvis_big_data']").val("N");
    }
    $("#elvis_total_price").text(fnSetComma(vTotalPrice));
    $("input[name='elvis_total_price']").val(vTotalPrice);
}

function fninitElvisBig() {

    $("#elvis_big_uni").attr("disabled", true);
    $("#elvis_big_sfi").attr("disabled", true);
    $("#elvis_big_ter").attr("disabled", true);
    $("#elvis_big_trk").attr("disabled", true);
    $("#elvis_big_lat").attr("disabled", true);

    $("#elvis_big_uni").prop("checked",false);
    $("#elvis_big_sfi").prop("checked",false);
    $("#elvis_big_ter").prop("checked",false);
    $("#elvis_big_trk").prop("checked",false);
    $("#elvis_big_lat").prop("checked", false);

    $("#elvis_big_price_text").text(fnSetComma(100000));
}

function fninitElvisBigFriend() {


    //$("#elvis_big_price_text").text(fnSetComma(100000));
}

//동의하고 가입하기
function fnSubmit() {
    $("#ajax_form").submit();
}

//주소 검색 함수
function fngetAddr(vPage) {

    //페이징 value 바꾸기
    $("#Elvis_Juso_currentPage").val(vPage);

    // 적용예 (api 호출 전에 검색어 체크) 	
    if (!fnCheckSearchedWord($("#Elvis_Juso_keyword").val())) {
        return;
    }

    $.ajax({
        url: "http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do"  //인터넷망
        , type: "post"
        , data: $("#juso_form").serialize()
        , dataType: "jsonp"
        , crossDomain: true
        , success: function (jsonStr) {
            //$("#list").html("");
            var errCode = jsonStr.results.common.errorCode;
            var errDesc = jsonStr.results.common.errorMessage;
            if (errCode != "0") {
                //alert(errCode + "=" + errDesc);
                _fnAlertMsg(errDesc);
            } else {
                if (jsonStr != null) {
                    //기존 검색창 hide and show
                    $(".Elvis_JusoDetail_Area").hide();
                    $(".Elvis_JusoList_Area").show();

                    fnMakeAddrList(jsonStr);
                    fnAddrPaging(jsonStr["results"]["common"]["totalCount"], 5, 10, vPage)
                    //alert(jsonStr);                    
                }
            }
        }
        , error: function (xhr, status, error) {
            _fnAlertMsg("에러발생");
        }
    });
}

//특수문자, 특정문자열(sql예약어의 앞뒤공백포함) 제거
function fnCheckSearchedWord(obj) {
    if (obj.length > 0) {
        //특수문자 제거
        var expText = /[%=><]/;
        if (expText.test(obj) == true) {
            _fnAlertMsg("특수문자를 입력 할수 없습니다.");
            obj = obj.split(expText).join("");
            return false;
        }

        //특정문자열(sql예약어의 앞뒤공백포함) 제거
        var sqlArray = new Array(
            //sql 예약어
            "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
            "UNION", "FETCH", "DECLARE", "TRUNCATE"
        );

        var regex;
        for (var i = 0; i < sqlArray.length; i++) {
            regex = new RegExp(sqlArray[i], "gi");

            if (regex.test(obj)) {
                _fnAlertMsg("\"" + sqlArray[i] + "\"와(과) 같은 특정문자로 검색할 수 없습니다.");
                obj = obj.replace(regex, "");
                return false;
            }
        }
    }
    return true;
}

//페이징 함수
function fnAddrgoPage(vPage) {
    fngetAddr(vPage);
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//주소 찾기 페이징
function fnAddrPaging(totalData, dataPerPage, pageCount, currentPage) {

    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    $("#Elvis_JusoList_Paging").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }

    var html = "";

    html += "<span onclick='fnAddrgoPage(1)'><<</span>";
    html += "<span onclick='fnAddrgoPage(" + prevPage + ")'><</span>";

    for (var i = first; i <= last; i++) {

        if (i == currentPage) {
            html += "<span class=\"active\">" + i + "</span>";
        } else {
            html += "<span onclick='fnAddrgoPage(" + i + ")'>" + i + "</span>";
        }
    }

    html += "<span onclick='fnAddrgoPage(" + nextPage + ")'>></span>";
    html += "<span onclick='fnAddrgoPage(" + totalPage + ")'>>></span>";

    $("#Elvis_JusoList_Paging").append(html);    // 페이지 목록 생성		
}


//검색 엔터 서치
function fnEnterSearch() {
    var evt_code = (window.netscape) ? ev.which : event.keyCode;
    if (evt_code == 13) {
        event.keyCode = 0;
        fngetAddr(1);
    }
}

//주소 찾기 - 레이어 팝업 끄기
function fnAddrCloseLayer() {
    $(".Elvis_JusoDetail_Area").hide();
    $(".Elvis_JusoList_Area").hide();
    layerClose('#Find_Address');
}

//주소 팝업에서 엔터키
function fnSetAddrData() {
    //우편번호
    $("#Elvis_OFFICE_CODE").val($("#Elvis_JusoDetail_zipNo").val());

    //기본주소
    $("#Elvis_OFFICE_ADDR").val($("#Elvis_JusoDetail_roadAddrPart1").val());

    //상세주소
    $("#Elvis_OFFICE_ADDR2").val($("#Elvis_JusoDetail_roadAddrPart2").val());

    //close 레이어
    fnAddrCloseLayer();
}

/////////////////function MakeList/////////////////////
//이메일 전송 form
function fnMakeEmailForm() {

    var vHTML = "";

    vHTML += " <html> ";
    vHTML += " <body> ";
    vHTML += "   <table style=\"margin:0px auto;max-width:700px;width:100%;overflow: hidden;border-collapse:separate;border-spacing:0px;\" data-mce-style=\"margin: 20px auto; width:100%;max-width: 700px;border-collapse:separate;border-spacing:0px;\"> ";
    vHTML += "   	<tbody style=\"\"> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #d9d9d9;border-top:1px solid #d9d9d9;\">상호</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom:1px solid #d9d9d9;border-right:1px solid #d9d9d9;border-top:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_OfficeNM").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">대표자</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_LOCNM").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">이메일</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_EMAIL1").val() + "@" + $("#Elvis_EMAIL2").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">사업자등록번호</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_CRN").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">주소</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_OFFICE_CODE").val() + " " + $("#Elvis_OFFICE_ADDR").val() + " " + $("#Elvis_OFFICE_ADDR2").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    //vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    //vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">유선번호</th> ";
    //vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    //vHTML += $("#Elvis_TEL_NO").val();
    //vHTML += "   			</td> ";
    //vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">휴대전화</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_HP_NO").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">신청일자</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_REG_DATE").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "   			<th style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom: 1px solid #d9d9d9;\">시작일자</th> ";
    vHTML += "   			<td style=\"word-break:break-all;padding: 20px 28px;text-align: left;color: #333;border-right: 1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;\"> ";
    vHTML += $("#Elvis_STAT_DATE").val();
    vHTML += "   			</td> ";
    vHTML += "   		</tr> ";
    vHTML += "   	</tbody> ";
    vHTML += "   </table> ";

    vHTML += " <table style=\"height:50px;\"> ";
    vHTML += " </table> ";

    vHTML += "  <table style=\"margin:5px auto;max-width:700px;width:100%;overflow: hidden;border-collapse:separate;border-spacing:0px;\" data-mce-style=\"margin: 20px auto; width:100%;max-width: 700px;border-collapse:separate;border-spacing:0px;\"> ";
    vHTML += "  	<tbody style=\"\"> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<th rowspan=\"8\" style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #d9d9d9;border-right:1px solid #fff;border-bottom:1px solid #fff;border-top:1px solid #d9d9d9;\">ELVIS</th> ";
    vHTML += "  			<th rowspan=\"6\" style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #d9d9d9;border-bottom:1px solid #fff;border-top:1px solid #d9d9d9;\">서비스</th> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom:1px solid #d9d9d9;border-top:1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_fms").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>FMS ";
    }else{
        vHTML += "  				<input type=\"checkbox\" />FMS ";
    }    
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_wms").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>WMS ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />WMS ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_tms").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>TMS ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />TMS ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_express").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>특송 ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />특송 ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_prime").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>프라임 ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />프라임 ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    vHTML += "  				월사용료 : " + $("#elvis_total_price").text();
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<th rowspan=\"2\" style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #fff;\">ELVIS</th> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_cust_info").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>거래처 정보 ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />거래처 정보 ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr style=\"width:100%;height: 100%;\"> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_account").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>회계 잔액 ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />회계 잔액 ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr> ";
    vHTML += "  			<th rowspan=\"2\" style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #d9d9d9;border-right:1px solid #fff;\">부가 서비스</th> ";
    vHTML += "  			<th rowspan=\"2\" style=\"width:20%; background-color: #d2d2d2;text-align: center;color: #333;font-weight: 700;display: table-cell;vertical-align: middle;padding: 20px 0;border-bottom:1px solid #d9d9d9;\">WEB FAX</th> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;\"> ";
    if ($("#elvis_fax").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>FAX ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />FAX ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  		<tr> ";
    vHTML += "  			<td style=\"word-break:break-all;padding: 20px 28px;text-align: center;color: #333;border-bottom: 1px solid #d9d9d9;border-right:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;\"> ";
    if ($("#elvis_sms").is(":checked")) {
        vHTML += "  				<input type=\"checkbox\" checked/>SMS ";
    } else {
        vHTML += "  				<input type=\"checkbox\" />SMS ";
    }
    vHTML += "  			</td> ";
    vHTML += "  		</tr> ";
    vHTML += "  	</tbody> ";
    vHTML += "  </table> ";

    return vHTML;

}

//주소 리스트 찍어주는 함수
function fnMakeAddrList(vJsonData) {

    var vHTML = "";
    var vCommon = vJsonData["results"]["common"];
    var vResult = vJsonData["results"]["juso"];

    $("#Elvis_JusoList_Total")[0].innerHTML = "＊도로명주소 검색 결과 (" + vCommon["totalCount"] + "건)";
    
    $.each(vResult, function (i) {

        if ((i%2) == 0) {
            vHTML += "<tr style=\"background-color:#f2f2f2\">";            
        } else {
            vHTML += "<tr>";
        }

        vHTML += " <td> ";
        vHTML += ((parseInt(vCommon["countPerPage"]) * (parseInt(vCommon["currentPage"])-1)))+(i+1);
        vHTML += " </td> ";

        vHTML += "   <td name=\"roadAddr\"> ";
        vHTML += "   	<strong>" + vResult[i]["roadAddr"] + "</strong><br /> ";
        vHTML += "   	<p>[지번] " + vResult[i]["jibunAddr"] +"</p> ";

        if (_fnToNull(vResult[i]["detBdNmList"]) != "") {
            vHTML += "   	<p name=\"detBdNmList_display\" style=\"display:none\">[상세건물명]" + vResult[i]["detBdNmList"]+"</p> ";
        }

        //여기다가 숨겨두자
        vHTML += " <input type=\"hidden\" name=\"roadAddrPart1\" value=\"" + vResult[i]["roadAddrPart1"]+"\" /> ";
        vHTML += " <input type=\"hidden\" name=\"roadAddrPart2\" value=\"" + vResult[i]["roadAddrPart2"] +"\" /> ";
        vHTML += " <input type=\"hidden\" name=\"zipNo\" value=\"" + vResult[i]["zipNo"] +"\" /> ";

        vHTML += "   </td> ";
        vHTML += "   <td name=\"detBdNmList\"> ";

        if (_fnToNull(vResult[i]["detBdNmList"]) != "") {
            vHTML += "   	상세건물 보기 ";
        } 

        vHTML += "   </td> ";
        vHTML += "   <td>" + vResult[i]["zipNo"] +"</td> ";
        vHTML += "</tr>";

    });

    $("#Elvis_JusoList_DataList")[0].innerHTML = vHTML;
    
}
//////////////////////////API////////////////////////////
