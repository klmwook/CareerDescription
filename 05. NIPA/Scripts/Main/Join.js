////////////////////전역 변수//////////////////////////
//var _objJsonData = new Object();
var _vChkID;
var _vChkForCrn;

////////////////////jquery event///////////////////////
$(function () {
    
    //-찍어서 자동으로 나오게 세팅
    $("#Elvis_HP_NO").keyup(function (e) {
        $(this).val($(this).val().replace(/[^0-9]/gi, ""));
        $(this).val(_fnMakePhoneForm($(this).val()));
    });
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
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        //alert($(e.target).attr('data-index'));
        if ($(e.target).attr('data-index') != undefined) {
            var vIndex = $(e.target).attr('data-index');
            $('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
        }
    }
});

//아이디 key 체크
$(document).on("keyup", "#Elvis_ID", function (e) {
    if (e.keyCode != 13) {
        _vChkID = "";
    }
});

//포워더 사업자등록번호 key 체크
$(document).on("keyup", "#Elvis_ForCRN", function (e) {
    if (e.keyCode != 13) {
        _vChkForCrn = "";
    }
});

//주소 찾기 버튼 이벤트
$(document).on("click", "#Elvis_Find_Addr", function () {

    //기존 데이터 초기화
    $("#Elvis_Juso_keyword").val("");
    $("#Elvis_JusoDetail_roadAddrPart2").val("");
    $(".Elvis_JusoList_Area").hide();

    layerPopup('#Find_Address');
});


//기본주소를 입력 해 주세요. input 클릭 시 주소 찾기 팝업창 띄우기
$(document).on("click", "#Elvis_OFFICE_ADDR, #Elvis_OFFICE_CODE", function () {

    //기존 데이터 초기화
    $("#Elvis_Juso_keyword").val("");
    $("#Elvis_JusoDetail_roadAddrPart2").val("");
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

//아이디 중복 확인 버튼 이벤트
$(document).on("click", "#Elvis_Check_ID", function () {
    fnChkID();
});

//포워더 사업자 등록 번호 체크
$(document).on("click", "#Elvis_Check_Crn", function () {
    fnChkForCrn();
});

//submit - 등록 버튼 이벤트
$(document).on("click", "#btn_Regester", function () {
    fnRegister();
});

//가입 완료 후 확인 버튼 이벤트
$(document).on("click", "#btn_RegComplete", function () {    
    location.href = window.location.origin;
});

////////////////////////function///////////////////////
//아이디 중복 확인
function fnChkID() {
    try {

        if (_fnToNull($("#Elvis_ID").val().trim()) == "") {
            _fnAlertMsg("아이디를 입력 해 주세요.", "Elvis_ID");
            return false;
        }

        var objJsonData = new Object();
        objJsonData.ID = $("#Elvis_ID").val();

        $.ajax({
            type: "POST",
            url: "/Main/fnCheckID",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (result == null) {
                    _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                } else {
                    if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                        _fnAlertMsg("이미 사용중인 아이디 입니다.");
                    }
                    else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                        _fnAlertMsg("담당자에게 문의 하세요.");
                        console.log(JSON.parse(result).Result[0]["trxMsg"]);
                    } else if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                        _fnAlertMsg("가입 가능한 아이디 입니다.");
                        _vChkID = $("#Elvis_ID").val();
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
    catch (e) {
        console.log("[Error - fnChkID]" + e.message);
    }
}

//사업자 번호 확인 함수
function fnChkForCrn() {
    try {
        var regex = /[^0-9]/g;
        if ($("#Elvis_ForCRN").val().length == 10) {

            if (regex.test(_fnToNull($("#Elvis_ForCRN").val()))) {
                _fnAlertMsg("숫자만 입력 해 주세요.");
                $("#Elvis_ForCRN").focus();
            }
            else {
                var objJsonData = new Object();
                objJsonData.CRN = $("#Elvis_ForCRN").val().replace(/-/gi, "-").trim();

                $.ajax({
                    type: "POST",
                    url: "/Main/fnCheckCRN",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result == null) {
                            _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                        } else {
                            if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                                _fnAlertMsg("ELVIS-BIG을 사용하지 않는 사업자 번호입니다.");
                            }
                            else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                                _fnAlertMsg("담당자에게 문의 하세요.");
                                console.log(JSON.parse(result).Result[0]["trxMsg"]);
                            } else if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                                _fnAlertMsg("가입 가능한 사업자 번호 입니다.");
                                _vChkForCrn = $("#Elvis_ForCRN").val();
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
            if ($("#Elvis_ForCRN").val().length < 10) {
                _fnAlertMsg("사업자 등록 번호 10자리를 입력 해 주세요.");
            }
        }
    }
    catch (e) {
        console.log("[Error - fnChkForCrn]"+e.message);
    }
}

//동의하고 가입하기 함수
function fnRegister() {
    try {
        if (fnValidation()) {
            var objJsonData = new Object();

            objJsonData.ID = $("#Elvis_ID").val();
            objJsonData.PSWD = $("#Elvis_PW1").val();
            objJsonData.CRN = $("#Elvis_CRN").val();
            objJsonData.FOR_CRN = $("#Elvis_ForCRN").val();
            objJsonData.OFFICE_NM = $("#Elvis_OfficeNM").val();
            objJsonData.OFFICE_ADDR = $("#Elvis_OFFICE_ADDR").val();
            objJsonData.OFFICE_ADDR2 = $("#Elvis_OFFICE_ADDR2").val();
            objJsonData.OFFICE_ADDR_CD = $("#Elvis_OFFICE_CODE").val();
            objJsonData.EMAIL = $("#Elvis_EMAIL").val();
            objJsonData.HP_NO = $("#Elvis_HP_NO").val();
            objJsonData.APV_YN = "N";
            objJsonData.CONTENT = fnMakeContent();

            //MNGT_NO만 넣어주기

            $.ajax({
                type: "POST",
                url: "/Main/fnRegister",
                async: true,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result == null) {
                        _fnAlertMsg("오류가 발생 하였습니다. 담당자에게 문의 해주세요.");
                    } else {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                            layerPopup("#layer_RegComplete");
                            //_fnAlertMsg("가입 신청이 완료 되었습니다.");
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

        }
    }
    catch (err) {
        console.log("[Error - fnRegister]" + err.message);
    }
}

//동의하고 가입하기 벨리데이션 체크
function fnValidation() {

    /********************************************필수 값 체크********************************************/
    //사용할 아이디 값 체크
    if (_fnToNull($("#Elvis_ID").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("사용할 아이디를 입력 해 주세요.", "Elvis_ID");
        return false;
    }

    //이메일 값 체크
    if (_fnToNull($("#Elvis_EMAIL").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("이메일을 입력 해 주세요.", "Elvis_EMAIL");
        return false;
    }

    //비밀번호 값 체크
    if (_fnToNull($("#Elvis_PW1").val()) == "") {
        _fnAlertMsg("비밀번호를 입력 해 주세요.", "Elvis_PW1");
        return false;
    }

    //비밀번호 확인 체크
    if (_fnToNull($("#Elvis_PW2").val()) == "") {
        _fnAlertMsg("비밀번호를 입력 해 주세요.", "Elvis_PW2");
        return false;
    }

    //사업자등록번호 값 체크 
    if (_fnToNull($("#Elvis_CRN").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("사업자 번호를 입력 해 주세요.", "Elvis_CRN");
        return false;
    }

    //포워더 사업자등록번호 값 체크 
    if (_fnToNull($("#Elvis_ForCRN").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("포워더 사업자 번호를 입력 해 주세요.", "Elvis_ForCRN");
        return false;
    }

    //휴대전화 값 체크 
    if (_fnToNull($("#Elvis_HP_NO").val().replace(/ /gi, "")) == "") {
        _fnAlertMsg("휴대전화 번호를 입력 해 주세요.", "Elvis_HP_NO");
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
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_CRN");
        return false;
    }

    //사업자 번호 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_ForCRN").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_ForCRN");
        return false;
    }

    //휴대전화 숫자 체크
    if (regex.test(_fnToNull($("#Elvis_HP_NO").val().replace(/-/gi, "").replace(/ /gi, "")))) {
        _fnAlertMsg("숫자만 입력 해 주세요.", "Elvis_HP_NO");
        return false;
    }    

    //이메일 특수문자 안되게 (영어 , 한글 , 숫자만 되게)
    var vCheckEmail = /[\{\}\[\]\/?.,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/gi

    if (vCheckEmail.test(_fnToNull($("#Elvis_EMAIL1").val()))) {
        _fnAlertMsg("이메일에 특수 문자는 들어 갈 수 없습니다.", "Elvis_EMAIL1");
        return false;
    }

    var vKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

    //사용할 아이디 값 한글 체크
    if (vKorean.test(_fnToNull($("#Elvis_ID").val()))) {
        _fnAlertMsg("아이디에 한글이 들어 갈 수 없습니다.", "Elvis_ID");
        return false;
    }

    //아이디 특수문자 체크
    if (vCheckEmail.test(_fnToNull($("#Elvis_ID").val()))) {
        _fnAlertMsg("아이디에 특수문자가 들어 갈 수 없습니다.", "Elvis_ID");
        return false;
    }

    if (_vChkID != _fnToNull($("#Elvis_ID").val())) {
        _fnAlertMsg("아이디 중복 체크를 확인 해주시기 바랍니다.", "Elvis_ID");
        return false;
    }

    if (_vChkForCrn != _fnToNull($("#Elvis_ForCRN").val())) {
        _fnAlertMsg("사업자 번호 체크를 확인 해주시기 바랍니다.", "Elvis_ForCRN");
        return false;
    }

    return true;
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

//회원가입 Content 만들기
function fnMakeContent() {

    try {

        var vHTML = "";

        vHTML += "  아이디 : " + $("#Elvis_ID").val();
        vHTML += "  이메일 : " + $("#Elvis_EMAIL").val();
        vHTML += "  사업자등록번호 : " + $("#Elvis_CRN").val();

        if (_fnToNull($("#Elvis_OfficeNM").val()) != "") {
            vHTML += "  상호 : " + $("#Elvis_OfficeNM").val();
        }

        vHTML += "  포워더 연계사 사업자등록번호 : " + $("#Elvis_ForCRN").val();
        vHTML += "  휴대전화 : " + $("#Elvis_HP_NO").val();

        if (_fnToNull($("#Elvis_OFFICE_ADDR").val()) != "") {
            vHTML += "  주소 : " + $("#Elvis_OFFICE_CODE").val() + " " + $("#Elvis_OFFICE_ADDR").val() + " " + $("#Elvis_OFFICE_ADDR2").val();
        }
        
        return vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeContent]" + err.message);
    }

}
/////////////////function MakeList/////////////////////
//주소 리스트 찍어주는 함수
function fnMakeAddrList(vJsonData) {

    var vHTML = "";
    var vCommon = vJsonData["results"]["common"];
    var vResult = vJsonData["results"]["juso"];

    $("#Elvis_JusoList_Total")[0].innerHTML = "＊도로명주소 검색 결과 (" + vCommon["totalCount"] + "건)";

    $.each(vResult, function (i) {

        if ((i % 2) == 0) {
            vHTML += "<tr style=\"background-color:#f2f2f2\">";
        } else {
            vHTML += "<tr>";
        }

        vHTML += " <td> ";
        vHTML += ((parseInt(vCommon["countPerPage"]) * (parseInt(vCommon["currentPage"]) - 1))) + (i + 1);
        vHTML += " </td> ";

        vHTML += "   <td name=\"roadAddr\"> ";
        vHTML += "   	<strong>" + vResult[i]["roadAddr"] + "</strong><br /> ";
        vHTML += "   	<p>[지번] " + vResult[i]["jibunAddr"] + "</p> ";

        if (_fnToNull(vResult[i]["detBdNmList"]) != "") {
            vHTML += "   	<p name=\"detBdNmList_display\" style=\"display:none\">[상세건물명]" + vResult[i]["detBdNmList"] + "</p> ";
        }

        //여기다가 숨겨두자
        vHTML += " <input type=\"hidden\" name=\"roadAddrPart1\" value=\"" + vResult[i]["roadAddrPart1"] + "\" /> ";
        vHTML += " <input type=\"hidden\" name=\"roadAddrPart2\" value=\"" + vResult[i]["roadAddrPart2"] + "\" /> ";
        vHTML += " <input type=\"hidden\" name=\"zipNo\" value=\"" + vResult[i]["zipNo"] + "\" /> ";

        vHTML += "   </td> ";
        vHTML += "   <td name=\"detBdNmList\"> ";

        if (_fnToNull(vResult[i]["detBdNmList"]) != "") {
            vHTML += "   	상세건물 보기 ";
        }

        vHTML += "   </td> ";
        vHTML += "   <td>" + vResult[i]["zipNo"] + "</td> ";
        vHTML += "</tr>";

    });

    $("#Elvis_JusoList_DataList")[0].innerHTML = vHTML;
}
//////////////////////////API////////////////////////////
