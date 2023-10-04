////////////////////전역 변수//////////////////////////
var _PKG_BKGNO = "";
var _PKG_SEQ = "";
var _objData = new Object();
var _objFile = new Object(); //파일 object
var _objFclCargo = new Object(); //FCL CARGO object
var _objFileType = new Object(); //파일 타입 object
var _vFileType = "'CIPL','CO','CC','IP'";
var _isExrt = true; //실제 환율 정보가 있는지 팝업을 한번만 띄우기 위한 전역 변수

////////////////////jquery event///////////////////////
$(function () {    

    _objFile.FILE_INFO = new Array();

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
    else {    

        if (_fnToNull($("#View_SCH_NO").val()) == "" && _fnToNull($("#View_BKG_NO").val()) == "") {
            sessionStorage.clear();
            window.history.back();
        } else {
            fnGetFIleType();

            if (_fnToNull($("#View_BKG_NO").val()) != "") {             //부킹 번호 있을 시 수정 
                fnModifyBooking();
            } else if (_fnToNull($("#View_SCH_NO").val()) != "") {      //스케줄 번호만 있을 경우 스케줄 조회
                
                if (_fnToNull($("#View_SEQ").val()) != "") {
                    //LCL 스케줄
                    fnGetLCLSchedule($("#View_SCH_NO").val(), $("#View_SEQ").val());
                } else { 
                    //FCL / AIR 스케줄
                    fnGetSchedule($("#View_SCH_NO").val());
                }
                
            }
        }
    }
});

//문제가 생겨서 스케줄 가져왔을 때 , 부킹을 가져올 때 문제가 되면 History Back 시켜주기
$(document).on("click", "#btn_Booking_HistoryBack", function () {
    layerClose("#Layer_Booking_HistoryBack");
    //window.history.back();
});

// 화물정보 CBM 숫자 올리기
$('#IS_LCL_PRICE_N .bk-cargo2__input').each(function () {
    var spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.cbm-up'),
        btnDown = spinner.find('.cbm-down'),
        min = input.attr('min'),
        max = input.attr('max');

    btnUp.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
    });

    btnDown.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");        
    });

});

// 화물정보 CBM 숫자 올리기
$('#IS_LCL_PRICE_Y .bk-cargo2__input').each(function () {
    var spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.cbm-up'),
        btnDown = spinner.find('.cbm-down'),
        min = input.attr('min'),
        max = input.attr('max');

    btnUp.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");

        fnGetTariff(newVal);

    });

    btnDown.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");

        fnGetTariff(newVal);
    });

});

//FCL - Qty 숫자만 입력 가능하게 수정
$(document).on("keyup", "#Input_FCL_CntrCount", function () {   
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
});

//LCL - CBM 숫자만 입력 가능하게 수정 (Tariff X)
$(document).on("keyup", "#input_LCL_N_CBM", function () {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));

    if ($(this).val().length > 1) {
        $(this).val($(this).val().substring(0, 1));
    }
});

//LCL - CBM 숫자만 입력 가능하게 수정 (Tariff O)
$(document).on("keyup", "#input_LCL_N_CBM", function () {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));

    if ($(this).val().length > 1) {
        $(this).val($(this).val().substring(0, 1));
    }
});

//FCL - 화물 추가 버튼 이벤트
$(document).on("click", "#btn_FCL_AddCargo", function () {
    fnSetFclCargo();
});

//FCL - 화물정보 리스트 삭제
$(document).on("click", "button[name='Btn_Cargo_Del']", function () {
    $(this).parents(".bk-cargo__cont").remove();
});

//부킹요청 버튼 클릭 이벤트 - Confirm 창 추가
$(document).on("click", "button[name='booking_request']", function () {
    layerPopup2("#Booking_Confirm");    
});

//부킹 요청 Confirm 창 확인 이벤트
$(document).on("click", "#Booking_Confirm_confirm", function () {
    layerClose("#Booking_Confirm");
    fnSaveBooking();
});

//부킹 요청 Confirm 창 확인 이벤트
$(document).on("click", "#Booking_Confirm_cancel", function () {
    layerClose("#Booking_Confirm");
});

//첨부파일 - 클릭 시 세팅
$(document).on("change", "#bk_file_upload", function () {

    if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {

        if (_fnToNull(_objData.STATUS) == "C") {
            _fnAlertMsg("부킹 취소 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "D") {
            _fnAlertMsg("부킹 삭제 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "F") {
            _fnAlertMsg("부킹 확정 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "O") {
            _fnAlertMsg("부킹 거절 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }

        if (_fnToNull(_objData.STATUS) == "Y") {
            _fnAlertMsg("부킹 승인 상태 입니다. <br/> 첨부파일 추가 하실 수 없습니다.");
            return false;
        }
    } else {
        fnSetFileData("bk_file_upload");
        $(this).val("");
    } 
});

//파일 삭제 (화면 상에서만 삭제 처리)
$(document).on("click", "button[name='BK_FileList_FileDelete']", function () {

    var vValue = $(this).parents(".bk-file__cont").find(".input_FileList_SetTime").val();

    //처음 파일 저장시 SETTIME을 주어서 취소 눌렀을 때 그걸 비교하여 li에 있는 값들을 삭제 합니다.
    for (var i = 0; i < _objFile.FILE_INFO.length; i++) {
        if (vValue == _fnToNull(_objFile.FILE_INFO[i]["SETTIME"])) {

            if (_objFile.FILE_INFO[i].constructor.name == "File") {
                _objFile.FILE_INFO[i]["FILE_YN"] = "N";
            }
            else {
                _objFile.FILE_INFO[i]["FILE_CRUD"] = "DELETE";
            }
        }
    }

    $(this).parents(".bk-file__cont").remove();
});

/* 구분이 변경될 때 DOC_NO 변경 */
$(document).on("change", "select[name='select_FileList_FileSeparation']", function () {

    var vValue = $(this).parents(".bk-file__cont").find(".input_FileList_SetTime").val();

    for (var i = 0; i < _objFile.FILE_INFO.length; i++) { 

        if (vValue == _objFile.FILE_INFO[i]["SETTIME"]) {
            
            _objFile.FILE_INFO[i]["DOC_TYPE"] = $(this).find('option:selected').val();
            _objFile.FILE_INFO[i]["DOC_NO"] = fnSetFileType(_objFile.FILE_INFO[i]["DOC_TYPE"]);
            _objFile.FILE_INFO[i]["FILE_CRUD"] = "UPDATE";
            _objFile.FILE_INFO[i]["UPD_USR"] = $("#Session_USR_ID").val();
        }
    }    
});

//파일 다운로드 로직 
$(document).on("click", "span[name='span_FileList_FileDownload']", function () {
    fnBookingDocDown($(this).parents("div").children(".input_FileList_SEQ").val());
});

//부킹 수정 상태 일 시 리스트로 넘어가는 로직
$(document).on("click", "button[name='booking_list']", function () {

    if (_fnToNull(sessionStorage.getItem("DETAIL_TO_BKG_BKG_NO")) != "" && _fnToNull(sessionStorage.getItem("DETAIL_TO_BKG_PAGE")) == "BKG_DETAIL") {
        sessionStorage.setItem("DETAIL_TO_BKG_PAGE", "");
    }

    var vBKG_NO = $(this).siblings("input[type='hidden']").val();
    var objJsonData = new Object();
    objJsonData.BKG_NO = vBKG_NO;
    controllerToLink("Inquiry", "Booking", objJsonData);
});

//FCL 웰컴 페이지 팝업으로 띄우기
$(document).on("click", "#FCL_welcome_link", function () {
    var welcome_page = 'http://www.ckpanasia.com/?WelcomeMgr=Y&Cntrtype=FCL';

    window.open(welcome_page);
});

//FCL 웰컴 페이지 팝업으로 띄우기
$(document).on("click", "#BULK_welcome_link", function () {
    var welcome_page = 'http://www.ckpanasia.com/?WelcomeMgr=Y&Cntrtype=BULK';

    window.open(welcome_page);
});

//LCL 웰컴 페이지 팝업으로 띄우기
$(document).on("click", "#LCL_welcome_link", function () {
    var welcome_page = 'http://www.ckpanasia.com/?WelcomeMgr=Y&Cntrtype=LCL';

    window.open(welcome_page);
});

//LCL 웰컴 페이지 팝업으로 띄우기
$(document).on("click", "#AIR_welcome_link", function () {
    var welcome_page = 'http://www.ckpanasia.com/?WelcomeMgr=Y&Cntrtype=AIR';

    window.open(welcome_page);
});

//이미 등록된 FCL 컨테이너 삭제 하는 버튼 이벤트
$(document).on("click", "button[name='Btn_RealCargo_Del']", function () {
    _PKG_BKGNO = $(this).parents(".bk-cargo__cont").find("input[name='input_BkgNo']").val();
    _PKG_SEQ = $(this).parents(".bk-cargo__cont").find("input[name='input_SEQ']").val();
    layerPopup2("#layer_Delete_BkgPkg");
});

//취소 버튼 이벤트 - 이미 등록된 FCL 컨테이너 삭제 하는 버튼 이벤트
$(document).on("click", "#Delete_BkgPkg_Cancel", function () {
    _PKG_BKGNO = "";
    _PKG_SEQ = "";
    layerClose("#layer_Delete_BkgPkg");
});

//확인 버튼 이벤트 - 이미 등록된 FCL 컨테이너 삭제 하는 버튼 이벤트
$(document).on("click", "#Delete_BkgPkg_Confirm", function () {
    layerClose("#layer_Delete_BkgPkg");    
    fnDeleteBkgPkg();
    _PKG_BKGNO = "";
    _PKG_SEQ = "";
});

//부킹 취소 버튼 이벤트
$(document).on("click", "button[name='booking_cancel']", function () {
    fnStatusConfirm("부킹 취소를 하시겠습니까?");
});

//부킹 취소 - 취소 버튼 이벤트
$(document).on("click", "#BkgList_Confirm_cencel", function () {
    layerClose('#Booking_Confirm');
});

//부킹 취소 Confirm 확인 버튼 이벤트
$(document).on("click", "#BkgList_Confirm_confirm", function () {
    fnSetCancelStatus();
    layerClose('#Booking_Confirm');
});
////////////////////////function///////////////////////
//파일 문서 타입 데이터 가져오기.
function fnGetFIleType() {
    try {

        var objJsonData = new Object();
        objJsonData.FILE_TYPE = _vFileType;

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetFIleType",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _objFileType = JSON.parse(result).FileType;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _objFileType = null;
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _objFileType = null;
                }
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

    }
    catch (err) {
        console.log("[Error - fnGetFIleType]" + err.message);
    }
}

//FCL , AIR - 스케줄 데이터 가져오기
function fnGetSchedule(vSCH_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = vSCH_NO;
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetSchedule",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSchedule(result);                
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                layerPopup2("#Layer_Booking_HistoryBack");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetSchedule]" + err.message);
    }
}

//LCL - 스케줄 데이터 가져오기
function fnGetLCLSchedule(vSCH_NO,vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = vSCH_NO;
        objJsonData.SEQ = vSEQ;
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetLCLSchedule",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSchedule(result);
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                layerPopup2("#Layer_Booking_HistoryBack");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetSchedule]" + err.message);
    }
}

///FCL 화물추가 함수
function fnSetFclCargo() {
    try {

        if ($("#Select_FCL_CntrType").find("option:selected").val() == "") {
            _fnAlertMsg("CNTR TYPE을 선택 해주세요.");
            return false; 
        }

        if ($("#Select_FCL_CntrSize").find("option:selected").val() == "") {
            _fnAlertMsg("CNTR SIZE을 선택 해주세요.");
            return false;
        }

        if (_fnToNull($("#Input_FCL_CntrCount").val()) == "") {
            _fnAlertMsg("갯수를 입력 해주세요.");
            return false;
        }

        //데이터 넣기
        var vHTML = "";

        vHTML += "   <div class=\"bk-cargo__cont\"> ";
        vHTML += "   	<div class=\"bk-cargo__num\"><p><span></span></p></div> ";
        vHTML += "   	<div class=\"bk-cargo__desc\"> ";
        vHTML += "   	    <input type=\"hidden\" value=\"" + $("#Select_FCL_CntrType").find("option:selected").val()+"\" name=\"input_cntr_type\" > ";
        vHTML += "   	    <input type=\"hidden\" value=\"" + $("#Select_FCL_CntrSize").find("option:selected").val()+"\" name=\"input_cntr_size\" > ";
        vHTML += "   	    <input type=\"hidden\" value=\"" + $("#Input_FCL_CntrCount").val()+"\" name=\"input_cntr_count\" > ";
        vHTML += "   		<p><span>" + $("#Select_FCL_CntrType").find("option:selected").text() + "</span> | <span>" + $("#Select_FCL_CntrSize").find("option:selected").text() + "</span> | <span>" + $("#Input_FCL_CntrCount").val()+"</span></p> ";
        vHTML += "   	</div> ";
        vHTML += "   	<button type=\"button\" class=\"btns cargo_del\" name=\"Btn_Cargo_Del\"></button> ";
        vHTML += "   </div> ";

        $("#FCL_Cntr_Area").append(vHTML);

        //제일 아래로 스크롤 내리기
        $("#FCL_Cntr_Area").scrollTop($("#FCL_Cntr_Area")[0].scrollHeight);

        //데이터 넣고 초기화
        $("#Select_FCL_CntrType").val("");
        $("#Select_FCL_CntrSize").val("");
        $("#Input_FCL_CntrCount").val("");        

    }
    catch (err) {
        console.log("[Error - fnSetFclCargo]" + err.message);
    }
}

//Tariff 데이터 가져오기
function fnGetTariff(vCBM) {
    try {
        var objJsonData = new Object();
        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.REQ_SVC = "SEA";
        objJsonData.SELL_BUY_TYPE = "S";
        objJsonData.CNTR_TYPE = "L";
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();
        objJsonData.POL_CD = _objData.POL_CD;
        objJsonData.POD_CD = _objData.POD_CD;
        //objJsonData.APLY_DATE = _objData.ETD; //현재 날짜의 운임 가격을 고지 받기 위해 현재 날짜로 변경 됨.
        objJsonData.NOW_DATE = _fnPlusDate(0).replace(/-/gi, ""); //현재 날짜의 운임 가격을 고지 받기 위해 현재 날짜로 변경 됨.

        //objJsonData.WGT = 0;
        //objJsonData.RTON = null;
        objJsonData.CBM = vCBM;
        objJsonData.EX_IM_TYPE = _objData.EX_IM_TYPE;

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetTariff",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnSetTariff(result);
            }, error: function (xhr, status, error) {
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);                
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetTariff]" + err.message);
    }
}

//문서 정보 추가
/* 파일 선택 시 파일 리스트 생성하는 함수 */
function fnSetFileData(vFileID) {
    var _arrFileValue = new Array(); //파일 정보 저장

    for (var i = 0; i < $("#" + vFileID).get(0).files.length; i++) {
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

        $("#" + vFileID).get(0).files[i].SETTIME = _fnGetNowTime();
        $("#" + vFileID).get(0).files[i].FILE_YN = "Y";
        $("#" + vFileID).get(0).files[i].FILE_CRUD = "INSERT";
        $("#" + vFileID).get(0).files[i].IS = "FILE";       //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE
                
        //$("#" + vFileID).get(0).files[i].DOC_NO = "C/I,P/L";
        if (_objFileType != null) {
            $("#" + vFileID).get(0).files[i].DOC_TYPE = _objFileType[0].COMN_CD;
        }
        else {
            $("#" + vFileID).get(0).files[i].DOC_TYPE = "CIPL";
        }

        $("#" + vFileID).get(0).files[i].DOC_NO = "";
        _arrFileValue.push($("#" + vFileID).get(0).files[i]);

        //SETTIME을 설정하기 위한 sleep 함수
        _fnsleep(50);
    }

    for (var i = 0; i < _arrFileValue.length; i++) {
        _objFile.FILE_INFO.push(_arrFileValue[i]);
    }

    var vHTML = "";

    /* 파일 이름 가져오기 */
    $.each($("#" + vFileID)[0].files, function (i) {

        vHTML += "   <div class=\"bk-file__cont\"> ";
        vHTML += "   	<div class=\"bk-file__select\"> ";
        vHTML += "   		<select name=\"select_FileList_FileSeparation\"> ";
        vHTML += fnMakeFileOption();
        vHTML += "   		</select> ";
        vHTML += "   	</div> ";
        vHTML += "   	<div class=\"bk-file__nm\"> ";
        vHTML += "   		<p><span>" + $("#" + vFileID)[0].files[i].name + "</span></p> ";
        vHTML += "   	</div> ";
        vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SEQ\"> ";
        vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SetTime\" name=\"input_FileList_SetTime\" value=\"" + $("#" + vFileID)[0].files[i].SETTIME + "\"> ";
        vHTML += "   	<button type=\"button\" class=\"btns file_del\" name=\"BK_FileList_FileDelete\"></button> ";
        vHTML += "   </div> ";

    });

    /* 결과값 보여주기 */
    $("#BK_FileList").append(vHTML);

}

//부킹 요청 함수
function fnSaveBooking() {

    try {
        if (fnBKValidation()) {
            var vData = fnSetSaveParameter();
            if (vData == false) {
                _fnAlertMsg("담당자에게 문의하세요.");
                return false;
            }

            //파일 업로드 , 업데이트 , 삭제 먼저
            if (fnBKFileUpload(vData.MST[0]["BKG_NO"])) {
            
                $.ajax({
                    type: "POST",
                    url: "/Booking/fnSaveBooking",
                    async: true,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(vData) },
                    success: function (result) {
                        if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
            
                            //Push 알람
                            var pushObj = new Object();
                            pushObj.JOB_TYPE = "BKG";
                            if (vData.MST[0].STATUS == "Q") {
                                if (_fnToNull($('#View_BKG_NO').val().trim()) != "") {
                                    pushObj.MSG = "부킹수정 확인해주세요.";
                                } else {
                                    pushObj.MSG = "부킹요청 확인해주세요.";
                                }
                            } else if (vData.MST[0].STATUS == "C") {
                                pushObj.MSG = "부킹취소 확인해주세요.";
                            }
                            pushObj.REF1 = JSON.parse(result).Table1[0]["BKG_NO"];
                            pushObj.REF2 = "";
                            pushObj.REF3 = "";
                            pushObj.REF4 = _Office_CD;
                            pushObj.REF5 = JSON.parse(result).Table1[0]["REQ_SVC"];
                            pushObj.USR_ID = $("#Session_EMAIL").val();
                            
                            Chathub_Push_Message(pushObj);
                
                            controllerToLink("Inquiry", "Booking", JSON.parse(result).Table1[0]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                            _fnAlertMsg("[fnSaveBooking - Fail]부킹 저장에 실패 하였습니다.");
                            console.log("[Fail : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }
                        if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                            _fnAlertMsg("[fnSaveBooking - Error]담당자에게 문의 하세요.");
                            console.log("[Error : fnSaveBooking()]" + JSON.parse(result).Result[0]["trxMsg"]);
                        }
                
                    }, error: function (xhr, status, error) {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                        _fnAlertMsg("[fnSaveBooking - Ajax Error]담당자에게 문의 하세요.");
                        console.log(error);
                    },
                    beforeSend: function () {
                        $("#ProgressBar_Loading").show(); //프로그래스 바
                    },
                    complete: function () {
                        $("#ProgressBar_Loading").hide(); //프로그래스 바
                    }
                });
            
            } else {
            
                var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
            
                if (varUA.indexOf('android') > -1) {
                    _fnAlertMsg("[안드로이드]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
                    _fnAlertMsg("[아이폰]파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                } else {
                    _fnAlertMsg("파일 업로드를 실패 하였습니다. \n 담당자에게 문의하세요.");
                }
            }
        }
    }
    catch (err) {
        $("#ProgressBar_Loading").hide();
        console.log("[Error - fnSaveBooking()]" + err);
    }
}

//부킹 상태 밸리데이션
function fnBKValidation() {

    if (_fnToNull(_objData.STATUS) == "C") {
        _fnAlertMsg("부킹 취소 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "D") {
        _fnAlertMsg("부킹 삭제 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "F") {
        _fnAlertMsg("부킹 확정 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "O") {
        _fnAlertMsg("부킹 거절 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    if (_fnToNull(_objData.STATUS) == "Y") {
        _fnAlertMsg("부킹 승인 상태 입니다. <br/> 부킹 수정을 하실 수 없습니다.");
        return false;
    }

    return true;
}

//파라미터 세팅
//Save 파라미터 만들기
function fnSetSaveParameter() {
    try {

        var array_mst = new Array();
        var array_dtl = new Array();
        var final_vJsonData = new Object();
        var vJsonData_MST = new Object;

        vJsonData_MST.SCH_NO = _objData.SCH_NO;

        if (_fnToNull($("#View_BKG_NO").val()) == "") {
            vJsonData_MST.BKG_NO = fnGetBKNO();
            vJsonData_MST.BKG_STATUS = "INSERT";
        } else {
            vJsonData_MST.BKG_NO = _fnToNull($("#View_BKG_NO").val());     //부킹번호
            vJsonData_MST.BKG_STATUS = "ELSE";
        }

        vJsonData_MST.INS_USR = _fnToNull($("#Session_USR_ID").val());
        vJsonData_MST.LOC_NM = _fnToNull($("#Session_LOC_NM").val());
        vJsonData_MST.HP_NO = _fnToNull($("#Session_HP_NO").val());
        vJsonData_MST.POL_CD = _objData.POL_CD;
        vJsonData_MST.POD_CD = _objData.POD_CD;
        vJsonData_MST.ETD = _objData.ETD;
        vJsonData_MST.REQ_SVC = _objData.REQ_SVC;
        vJsonData_MST.CNTR_TYPE = _objData.CNTR_TYPE;
        vJsonData_MST.LOAD_TYPE = _objData.CNTR_TYPE;
        vJsonData_MST.EX_IM_TYPE = _objData.EX_IM_TYPE;
        vJsonData_MST.CUST_CD = _fnToNull($("#Session_CUST_CD").val());
        vJsonData_MST.CUST_NM = _fnToNull($("#Session_CUST_NM").val());
        vJsonData_MST.STATUS = "Q";
        vJsonData_MST.EMAIL = _fnToNull($("#Session_EMAIL").val());
        vJsonData_MST.RMK = _fnToNull($("#input_bk_Remark").val().replace(/'/gi, "''"));               

        if (_objData.CNTR_TYPE == "F" || _objData.CNTR_TYPE == "B") { //FCL // BULK

            vJsonData_MST.TARRIF_FLAG = "N"; //해당 플래그가 Y로 되어있으면 타리프 테이블에도 데이터가 들어감.
            vJsonData_MST.PRC = "";
            vJsonData_MST.CURR_CD = "";

            $.each($("#FCL_Cntr_Area .bk-cargo__desc"), function (i) {

                //새롭게 추가된 데이터만 넣어서 수정 가능하게
                if (_fnToNull($(this).parents(".bk-cargo__cont").attr("name")) == "") {
                    var vJsonData_DTL = new Object;

                    vJsonData_DTL.CNTR_TYPE = $(this).find("input[name='input_cntr_type']").val();
                    vJsonData_DTL.CNTR_SIZE = $(this).find("input[name='input_cntr_size']").val();
                    vJsonData_DTL.PKG = $(this).find("input[name='input_cntr_count']").val();
                    vJsonData_DTL.GRS_WGT = 0;
                    vJsonData_DTL.VOL_WGT = 0;

                    array_dtl.push(vJsonData_DTL);
                }
            });
        }
        else if (_objData.CNTR_TYPE == "L") { //LCL

            var vJsonData_DTL = new Object;
            if (_fnToNull(_objData.TARIFF_YN) == "Y") {

                //타리프에 필요한 데이터들
                vJsonData_MST.TARRIF_FLAG = "Y"; //해당 플래그가 Y로 되어있으면 타리프 테이블에도 데이터가 들어감.
                vJsonData_MST.PRC = $("#LCL_PRICE_TOTAL").text().replace(/,/gi,"");
                vJsonData_MST.CURR_CD = "KRW";
                vJsonData_MST.OFFICE_CD = _Office_CD;
                vJsonData_MST.SELL_BUY_TYPE = "S";
                vJsonData_MST.NOW_DATE = _fnPlusDate(0).replace(/-/gi, ""); //현재 날짜의 운임 가격을 고지 받기 위해 현재 날짜로 변경 됨.

                vJsonData_DTL.CNTR_TYPE = "";
                vJsonData_DTL.CNTR_SIZE = "";
                vJsonData_DTL.PKG = 0;
                vJsonData_DTL.GRS_WGT = 0;
                vJsonData_DTL.VOL_WGT = _fnToZero($("#input_LCL_Y_CBM").val());                
            } else {
                vJsonData_MST.TARRIF_FLAG = "N"; //해당 플래그가 Y로 되어있으면 타리프 테이블에도 데이터가 들어감.
                vJsonData_MST.PRC = "0"; //별도문의
                vJsonData_MST.CURR_CD = "USD";

                vJsonData_DTL.CNTR_TYPE = "";
                vJsonData_DTL.CNTR_SIZE = "";
                vJsonData_DTL.PKG = 0;
                vJsonData_DTL.GRS_WGT = 0;
                vJsonData_DTL.VOL_WGT = _fnToZero($("#input_LCL_N_CBM").val());                
            }

            array_dtl.push(vJsonData_DTL);
        }

        array_mst.push(vJsonData_MST); //MST에 PRC , CURR_CD가 들어가야 하기 때문에 Master Data 삽입은 여기서.

        final_vJsonData.MST = array_mst;
        final_vJsonData.DTL = array_dtl;

        return final_vJsonData;

    }
    catch (err) {
        console.log("[Error - fnSetSaveParameter]" + err.message);
    }
}

//Booking 채번
function fnGetBKNO() {
    try {
        var vResult = "";

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetBKNO",
            async: false,
            dataType: "json",
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    vResult = JSON.parse(result).BKG[0]["BKG_NO"];
                }
                if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("부킹 저장에 실패 하였습니다.");
                    console.log("[Fail : fnGetBKNO()]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error : fnGetBKNO()]" + JSON.parse(result).Result[0]["trxMsg"]);
                }

            }, error: function (xhr, status, error) {

                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnGetBKNO]" + err.message);
    }
}

function fnBKFileUpload(vMNGT_NO) {
    /* 파일 업로드 & 삭제 구문 */
    var objSendInfo, vfileData;
    var vReturn = true;

    /* 파일 Upload & 파일 삭제 로직*/
    for (var i = 0; i < _objFile.FILE_INFO.length; i++) {
        if (_objFile.FILE_INFO[i]["IS"] == "FILE" && _objFile.FILE_INFO[i]["FILE_YN"] == "Y") { //File 형식이면 Insert 로직 태움            

            vfileData = new FormData(); //Form 초기화
            vfileData.append("fileInput", _objFile.FILE_INFO[i]);

            //추후 세션 값으로 변경
            vfileData.append("DOMAIN", $("#Session_DOMAIN").val());   //로그인한 User의 도메인
            vfileData.append("MNGT_NO", vMNGT_NO); //화주 ID (사업자번호)  
            vfileData.append("INS_USR", $("#Session_USR_ID").val());    //User
            vfileData.append("OFFICE_CD", $("#Session_OFFICE_CD").val()); //회사 코드  
            vfileData.append("FILE_TYPE", "BKG");
            vfileData.append("DOC_TYPE", _objFile.FILE_INFO[i]["DOC_TYPE"]);
            vfileData.append("DOC_NO", fnSetFileType(_objFile.FILE_INFO[i]["DOC_TYPE"]));

            $.ajax({
                type: "POST",
                url: "/File/Upload_Files",
                dataType: "json",
                async: false,
                contentType: false, // Not to set any content header
                processData: false, // Not to process data
                data: vfileData,
                success: function (result, status, xhr) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        } else {
                            vReturn = false;
                        }
                    } else {
                        vReturn = false;
                    }
                },
                error: function (xhr, status, error) {
                    _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                    vReturn = false;
                }
            });

            //오류일 경우 바로 나가기
            if (!vReturn) {
                return false;
            }
        } else if (_objFile.FILE_INFO[i]["IS"] == "OBJECT" && _objFile.FILE_INFO[i]["FILE_CRUD"] == "DELETE") { //Object 형식이고 UPDATE 값이면 DOC 데이터 업데이트

            ////삭제로직                    
            var objJsonData = new Object();
            objJsonData.FILE_INFO = new Array();
            objJsonData.FILE_INFO.push(_objFile.FILE_INFO[i]);

            $.ajax({
                type: "POST",
                url: "/File/fnDocDeleteFile",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        } else {
                            vReturn = false;
                        }
                    } else {
                        vReturn = false;
                    }
                }, error: function (xhr, status, error) {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(error);
                    vReturn = false;
                }
            });

            console.log("삭제");
        } else if (_objFile.FILE_INFO[i]["IS"] == "OBJECT" && _objFile.FILE_INFO[i]["FILE_CRUD"] == "UPDATE") { //Object 형식이고 DELETE 값이면 데이터 삭제

            //// 데이터 업데이트 로직       
            var objJsonData = new Object();
            objJsonData.FILE_INFO = new Array();
            objJsonData.FILE_INFO.push(_objFile.FILE_INFO[i]);

            //파일 디테일 업데이트
            $.ajax({
                type: "POST",
                url: "/File/fnDocUpdateFile",
                async: false,
                dataType: "json",
                data: { "vJsonData": _fnMakeJson(objJsonData) },
                success: function (result) {
                    if (result != null) {
                        vResult = JSON.parse(result);

                        if (vResult.Result[0].trxCode == "Y") {
                            console.log("fnFileUpload[trxCode] " + vResult.Result[0].trxCode);
                            console.log("fnFileUpload[trxMsg] " + vResult.Result[0].trxMsg);
                        } else {
                            vReturn = false;
                        }
                    } else {
                        vReturn = false;
                    }
                }, error: function (xhr, status, error) {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log(error);
                    vReturn = false;
                }
            });
        }
    }

    return vReturn;
}

//부킹 번호 있을 경우 - 스케줄 수정 데이터 , 부킹 수정 데이터
function fnModifyBooking() {
    try {
        var objJsonData = new Object();

        objJsonData.SCH_NO = _fnToNull($("#View_SCH_NO").val());
        objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();

        $.ajax({
            type: "POST",
            url: "/Booking/fnGetModifyBooking",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    _objData.STATUS = _fnToNull(JSON.parse(result).BK_MST[0]["STATUS"]);
                    fnMakeSchedule(result); //스케줄 데이터 그려주기
                    fnSetBookingData(result); //부킹 데이터 그려주기                
                    fnSetFileList(result); //문서 데이터 그려주기           
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    layerPopup2("#Layer_Booking_HistoryBack");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    layerPopup2("#Layer_Booking_HistoryBack");
                    console.log("[Error - fnDeleteBkgPkg]" + JSON.parse(result).Result[0]["trxMsg"]);
                }

                            
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });       

    } catch (err) {
        console.log("[Error - fnModifyBooking]" + err.message);
    }
}

//FCL Booking Pkg 삭제 함수
function fnDeleteBkgPkg() {
    try {
        var objJsonData = new Object();

        objJsonData.BKG_NO = _PKG_BKGNO;
        objJsonData.SEQ = _PKG_SEQ;

        $.ajax({
            type: "POST",
            url: "/Booking/fnDeleteBkgPkg",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {

                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    $("div[name='" + _PKG_BKGNO + "_" + _PKG_SEQ + "']").remove();
                    _fnAlertMsg("삭제 되었습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("삭제 실패 하였습니다.");
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnDeleteBkgPkg]" + JSON.parse(result).Result[0]["trxMsg"]);
                }

            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });
    }
    catch (err) {
        console.log("[Error - fnDeleteBkgPkg]" + err.message);
    }
}

//부킹 취소 레이어 팝업 켜기
function fnStatusConfirm(msg) {
    $("#BkgList_Confirm .inner2").html(msg);
    layerPopup2('#BkgList_Confirm');
    $("#BkgList_Confirm_confirm").focus();
}

//부킹 취소 함수
function fnSetCancelStatus() {
    try {
        var objJsonData = new Object();

        objJsonData.BKG_NO = _fnToNull($("#View_BKG_NO").val());
        objJsonData.REG_BKG_NO = _fnToNull($("#View_BKG_NO").val());

        $.ajax({
            type: "POST",
            url: "/Booking/fnSetCancelStatus",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    var pushObj = new Object();
                    pushObj.JOB_TYPE = "BKG";
                    pushObj.MSG = "부킹취소 확인해주세요.";
                    pushObj.REF1 = objJsonData.BKG_NO;
                    pushObj.REF2 = "";
                    pushObj.REF3 = "";
                    pushObj.REF4 = _Office_CD;
                    pushObj.REF5 = "";
                    //pushObj.USR_ID = $("#Session_USR_ID").val();
                    pushObj.USR_ID = $("#Session_EMAIL").val();
                    
                    Chathub_Push_Message(pushObj);

                    //controllerToLink("Inquiry", "Booking", objJsonData.BKG_NO);
                    controllerToLink("Inquiry", "Booking", objJsonData);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
                    _fnAlertMsg("부킹 취소가 실패하였습니다.");
                    console.log("[Fail - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
                else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
                    _fnAlertMsg("담당자에게 문의 하세요.");
                    console.log("[Error - fnSetCancelStatus]" + JSON.parse(result).Result[0]["trxMsg"]);
                }
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            },
            beforeSend: function () {
                $("#ProgressBar_Loading").show(); //프로그래스 바
            },
            complete: function () {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
            }
        });

    } catch (err) {
        console.log("[Error - fnSearchBK]" + err.message);
    }
}

//타리프 초기화
function fnInitTariff() {

    vHTML = "별도문의";

    $("#booking_detail_tariff").show();
    $("#booking_detail_tariff").text(vHTML);
    $("#booking_detail_tariff2").text(vHTML);
    $("#booking_detail_tariff_CURR_CD").val("USD");
    $("#booking_detail_tariff_PKG_UNIT").val(0);
    $("#booking_detail_tariff_UNIT_PRC").val(0);
    $("#booking_detail_tariff_PRC").val(0);

    //try {
    //    $("#booking_detail_tariff").hide();
    //    $("#booking_detail_tariff_CURR_CD").val("USD");
    //    $("#booking_detail_tariff_PKG_UNIT").val(0);
    //    $("#booking_detail_tariff_UNIT_PRC").val(0);
    //    $("#booking_detail_tariff_PRC").val(0);
    //}
    //catch (err) {
    //    console.log("[Error - fnInitTariff]" + err.message);
    //}
}

//부킹 첨부파일 다운로드
function fnBookingDocDown(vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = $("#View_BKG_NO").val();      //부킹 번호
        objJsonData.INS_USR = $("#Session_LOC_NM").val();   //부킹 번호
        objJsonData.DOMAIN = $("#Session_DOMAIN").val();    //접속 User
        objJsonData.SEQ = vSEQ;

        $.ajax({
            type: "POST",
            url: "/File/DownloadElvis",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {

                if (result != "E") {
                    var rtnTbl = JSON.parse(result);
                    rtnTbl = rtnTbl.Path;
                    var file_nm = rtnTbl[0].FILE_NAME;
                    if (_fnToNull(rtnTbl) != "") {
                        window.location = "/File/DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                    }
                } else {
                    _fnAlertMsg("다운 받을 수 없습니다.");
                }
            },
            error: function (xhr, status, error) {
                _fnAlertMsg("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnPreAlertDown]" + err.message);
    }
}

//파일 타입 세팅
function fnSetFileType(vType) {
    try {

        var vResult = "";

        if (_objFileType != null) {
            $.each(_objFileType, function (i) {
                if (vType == _objFileType[i].COMN_CD) {
                    vResult = _objFileType[i].CD_NM;                    
                }
            });
        }
        else {
            //기본 세팅
            switch (vType) {
                case "CIPL":
                    vResult = "C/I, Packing List";
                    break;
                case "CC":
                    vResult = "Customs Clearance";
                    break;
                case "IP":
                    vResult = "Insurance Policy";
                    break;
                case "CO":
                    vResult = "C/O";
                    break;
            }
        }

        return vResult;
    }
    catch (err) {
        console.log("[Error - fnSetFileType]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//스케줄 만들기
function fnMakeSchedule(vJsonData) {
    var vHTML = "";

    try {
        //스케줄 데이터 만들기
        vResult = JSON.parse(vJsonData).Schedule;

        //단건으로만 들어올꺼니까
        if (vResult == undefined) {
            layerPopup2("#Layer_Booking_HistoryBack");
        }
        else {

            if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

                //부킹 저장을 위한 파라미터 세팅
                if (_fnToNull(vResult[0]["SCH_BKG_NO"]) != "") {
                    _objData.SCH_NO = _fnToNull(vResult[0]["SCH_BKG_NO"]);
                } else {
                    _objData.SCH_NO = _fnToNull(vResult[0]["SCH_NO"]);
                }
                
                _objData.REQ_SVC = _fnToNull(vResult[0]["REQ_SVC"]);
                _objData.POL_CD = _fnToNull(vResult[0]["POL_CD"]);
                _objData.POD_CD = _fnToNull(vResult[0]["POD_CD"]);
                _objData.ETD = _fnToNull(vResult[0]["ETD"]);
                _objData.CNTR_TYPE = _fnToNull(vResult[0]["CNTR_TYPE"]);
                _objData.TARIFF_YN = _fnToNull(vResult[0]["TARIFF_YN"]);
                _objData.EX_IM_TYPE = _fnToNull(vResult[0]["EX_IM_TYPE"]);

                //AIR인 경우도 있으니까.
                if (_fnToNull(vResult[0]["REQ_SVC"]) == "AIR") {
                    $("#LCL_welcome_link").attr("id", "AIR_welcome_link");
                }

                vHTML += "   <div class=\"bk-sch__box\"> ";
                vHTML += "   	<div class=\"bk-sch__line\"> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">서비스</div> ";
                if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "F") {
                    vHTML += "   			<div class=\"bk-sch__cont\">FCL</div> ";
                } else if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "L") {
                    vHTML += "   			<div class=\"bk-sch__cont\">LCL</div> ";
                }
                else if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "B") {
                    vHTML += "   			<div class=\"bk-sch__cont\">BULK</div> ";
                }

                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">VSL</div> ";
                vHTML += "   			<div class=\"bk-sch__cont\">" + _fnToNull(vResult[0]["VSL"])+"</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"bk-sch__line\"> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">VOY</div> ";
                vHTML += "   			<div class=\"bk-sch__cont\">" + _fnToNull(vResult[0]["VOY"]) +"</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">LINER</div> ";
                vHTML += "   			<div class=\"bk-sch__cont\">" + _fnToNull(vResult[0]["LINE_NM"]) +"</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"bk-sch__line\"> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">ETD</div> ";

                vHTML += "   			<div class=\"bk-sch__cont\">";
                vHTML += _fnCK_DateFormat(_fnToNull(vResult[0]["ETD"]));

                if (_fnToNull(vResult[0]["ETD_HM"]) != "") {
                    vHTML += " " + _fnFormatHHMMTime(_fnToNull(vResult[0]["ETD_HM"]));
                }

                vHTML += "   			</div> ";

                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">ETA</div> ";

                vHTML += "   			<div class=\"bk-sch__cont\">";

                if (_fnToNull(vResult[0]["ETA"]) == "") {
                    vHTML += "-";
                } else {
                    vHTML += _fnCK_DateFormat(_fnToNull(vResult[0]["ETA"]));

                    if (_fnToNull(vResult[0]["ETA_HM"]) != "") {
                        vHTML += " " + _fnFormatHHMMTime(_fnToNull(vResult[0]["ETA_HM"]));
                    }
                }

                vHTML += "   			</div> ";

                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"bk-sch__line\"> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">POL</div> ";
                vHTML += "   			<div class=\"bk-sch__cont\">" + _fnToNull(vResult[0]["POL_NM"]) +"</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"bk-sch__inner\"> ";
                vHTML += "   			<div class=\"bk-sch__title\">POD</div> ";
                vHTML += "   			<div class=\"bk-sch__cont\">" + _fnToNull(vResult[0]["POD_NM"]) +"</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
                vHTML += "   <div class=\"bk-sch__box type2\"> ";
                vHTML += "   	<div class=\"bk-sch__inner\"> ";
                vHTML += "   		<div class=\"bk-sch__title\">담당자</div> ";
                vHTML += "   		<div class=\"bk-sch__cont\"> ";
                vHTML += "   			<textarea disabled=\"disabled\">" + _fnToNull(vResult[0]["SCH_PIC"]) +"</textarea> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"bk-sch__inner\"> ";
                vHTML += "   		<div class=\"bk-sch__title\">반입지</div> ";
                vHTML += "   		<div class=\"bk-sch__cont\"> ";
                vHTML += "   			<textarea disabled=\"disabled\">" + _fnToNull(vResult[0]["POL_TML_NM"]) +"</textarea> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"bk-sch__inner\"> ";
                vHTML += "   		<div class=\"bk-sch__title\">비고</div> ";
                vHTML += "   		<div class=\"bk-sch__cont\"> ";
                vHTML += "   			<textarea disabled=\"disabled\">" + _fnToNull(vResult[0]["RMK"]) +"</textarea> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";

                //twkim - 업체 요청으로 LCL은 서류마감일이 지났으면 '부킹 요청만 되지 않게'  / 부킹 번호로 들어왔을 경우에는 타지않게
                if (_fnToNull($("#View_BKG_NO").val()) == "") {
                    if (_fnToNull(vResult[0]["DOC_CLOSE_YMD"]) + _fnFormatHHMMTime(_fnToNull(vResult[0]["DOC_CLOSE_HM"])).replace(/:/gi, "") < _fnGetDateStamp()) {
                        $("button[name='booking_request']").hide();
                    }
                }

                //화면 보여주기
                if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "F") {
                    $("#IS_FCL").show();
                } else if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "L") {

                    if (_fnToNull(vResult[0]["TARIFF_YN"]) == "Y") {
                        $("#IS_LCL_PRICE_Y").show();
                        $("#input_LCL_Y_CBM").val(1);
                        fnGetTariff($("#input_LCL_Y_CBM").val());
                    } else {
                        $("#IS_LCL_PRICE_N").show();
                        $("#input_LCL_N_CBM").val(1);
                    }

                    //부킹 수정 상태로 들어왔을 경우에는무조건 PRICE_Y로 세팅
                    //if ($("#View_BKG_NO").val() != "") {
                    //    $("#IS_LCL_PRICE_Y").show();
                    //} else {
                    //    if (_fnToNull(vResult[0]["TARIFF_YN"]) == "Y") {
                    //        $("#IS_LCL_PRICE_Y").show();
                    //    } else {
                    //        $("#IS_LCL_PRICE_N").show();
                    //    }
                    //}
                } else if (_fnToNull(vResult[0]["CNTR_TYPE"]) == "B") {
                    $("#FCL_welcome_link").attr("id", "BULK_welcome_link");
                    $("#IS_FCL").show();
                }

                $("#SCH_Result_AREA")[0].innerHTML = vHTML;

            }
            else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
                console.log("[Fail - fnMakeSchedule]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
                layerPopup2("#Layer_Booking_HistoryBack");
            }
            else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
                console.log("[Error - fnMakeSchedule]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
                layerPopup2("#Layer_Booking_HistoryBack");
            }
        }

    } catch (e) {
        console.log(e.message);
    }
}

//Tariff 세팅
function fnSetTariff(vJsonData) {
    try {

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Tariff;
                        
            var vUSD_TOTAL = 0;            
            var vKRW_TOTAL = 0;
            var vUSD_TO_KRW_TOTAL = 0;  //외화 금액 원화로 변경
            
            $.each(vResult, function (i) {

                //환율정보가 없을 경우 데이터가 뜸
                if (_fnToNull(vResult[i]["CURR_CD"]) == "USD") {

                    if (_isExrt) {
                        if (_fnToNull(vResult[i]["EXRT"]) == 1) {
                            _isExrt = false;
                            _fnAlertMsg("등록된 환율 정보가 없습니다.");
                        }
                    }
                }

                vUSD_TOTAL = vUSD_TOTAL + Number(_fnToNull(vResult[i]["OF_AMT"]));
                vKRW_TOTAL = vKRW_TOTAL + Number(_fnToNull(vResult[i]["OTH_AMT"]));
                vUSD_TO_KRW_TOTAL += Number(_fnToNull(vResult[i]["FARE_LOC_AMT"]));
            });

            $("#LCL_PRICE_USD").text(fnSetComma(vUSD_TOTAL));
            $("#LCL_PRICE_KRW").text(fnSetComma(vKRW_TOTAL));
            $("#LCL_PRICE_TOTAL").text(fnSetComma(vUSD_TO_KRW_TOTAL));
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $("#LCL_PRICE_USD").text(0);
            $("#LCL_PRICE_KRW").text(0);
            $("#LCL_PRICE_TOTAL").text(0);
        }

    } catch (e) {
        console.log("[Error - fnSetTariff]"+e.message);
    }
}

//해운 - 타리프 금액 찍어주기 
function fnMakeSeaTariff(vJsonData) {

    var vHTML = "";

    try {

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Tariff;            

            //토탈 결과
            var vTotal = Number(_fnToNull(vResult[0]["UNIT_PRC"])) * fnCompareWGT() * Number($("#input_bk_Qty").val()); 
            if (_fnToNull(vResult[0]["CURR_CD"]) == "KRW") {
                vHTML = _fnToNull(vResult[0]["CURR_CD"]) + " " + _fnGetNumber(vTotal, "sum");
            } else {
                vHTML = _fnToNull(vResult[0]["CURR_CD"]) + " " + _fnGetNumber(vTotal.toFixed(2), "sum");
            }

            $("#booking_detail_tariff").text(vHTML);
            $("#booking_detail_tariff2").text(vHTML);
            

            $("#booking_detail_tariff_FLAG").val("Y");
            $("#booking_detail_tariff_UNIT_PRC").val(Number(_fnToNull(vResult[0]["UNIT_PRC"])));
            $("#booking_detail_tariff_PRC").val(vTotal.toFixed(2));
            $("#booking_detail_tariff_CURR_CD").val(_fnToNull(vResult[0]["CURR_CD"]));
            $("#booking_detail_tariff_PKG_UNIT").val(_fnToNull(vResult[0]["PKG_UNIT"]));
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML = "별도문의";

            $("#booking_detail_tariff").text(vHTML);
            $("#booking_detail_tariff2").text(vHTML);

            $("#booking_detail_tariff_FLAG").val("N");
            $("#booking_detail_tariff_UNIT_PRC").val(0);
            $("#booking_detail_tariff_PRC").val(0);
            $("#booking_detail_tariff_CURR_CD").val("USD");
            $("#booking_detail_tariff_PKG_UNIT").val("");
        }

        $("#booking_detail_tariff").show();

    } catch (e) {
        console.log(e.message);
    }
}

//항공 - 타리프 금액 찍어주기 
function fnMakeAirTariff(vJsonData) {

    var vHTML = "";

    try {

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).Tariff;

            //토탈 결과
            var vTotal = Number(_fnToNull(vResult[0]["UNIT_PRC"])) * fnCompareWGT() * Number($("#input_bk_Qty").val());

            vHTML = _fnToNull(vResult[0]["CTRT_CURR_CD"]) + " " + vTotal.toFixed(2);

            $("#booking_detail_tariff").text(vHTML);
            $("#booking_detail_tariff2").text(vHTML);

            $("#booking_detail_tariff_FLAG").val("Y");
            $("#booking_detail_tariff_UNIT_PRC").val(Number(_fnToNull(vResult[0]["UNIT_PRC"])));
            $("#booking_detail_tariff_PRC").val(vTotal.toFixed(2));
            $("#booking_detail_tariff_CURR_CD").val(_fnToNull(vResult[0]["CTRT_CURR_CD"]));
            $("#booking_detail_tariff_PKG_UNIT").val(_fnToNull(vResult[0]["PKG_UNIT"]));
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML = "별도문의";

            $("#booking_detail_tariff").text(vHTML);
            $("#booking_detail_tariff2").text(vHTML);

            $("#booking_detail_tariff_FLAG").val("N");
            $("#booking_detail_tariff_UNIT_PRC").val(0);
            $("#booking_detail_tariff_PRC").val(0);
            $("#booking_detail_tariff_CURR_CD").val("USD");
            $("#booking_detail_tariff_PKG_UNIT").val("");
        }

        $("#booking_detail_tariff").show();

    } catch (e) {
        console.log(e.message);
    }
}

//부킹 데이터 찍어주기
function fnSetBookingData(vJsonData) {
    try {
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).BK_MST;

            //부킹 세팅 해줘야되는게 RMK 말고는 없는거 같은데..?
            $("#input_bk_Remark").val(_fnToNull(vResult[0]["RMK"]));
            $("#bk_file_upload").attr("disabled", false);            

            //Y - 부킹 승인 / F - 부킹 확정 / C - 부킹 취소 / O - 부킹 거절
            if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {                
                $("#input_bk_Remark").attr("disabled", true);
                $("#input_bk_Remark").addClass("disabled");
                $("#bk_file_upload").attr("disabled", true);
                $(".file_upload").hide(); //첨부파일 버튼 안보이게
                $("#btn_FCL_AddCargo").attr("disabled", true);

                $("#input_LCL_N_CBM").attr("disabled", true);
                $("#input_LCL_Y_CBM").attr("disabled", true);
                $(".cbm-up").attr("disabled", true);
                $(".cbm-down").attr("disabled", true);
            }

            //FCL , BULK / LCL 체크 후 보여주기
            if (_objData.CNTR_TYPE == "F" || _objData.CNTR_TYPE == "B") {
                vResult = JSON.parse(vJsonData).BK_PKG;

                //데이터 넣기
                var vHTML = "";

                $.each(vResult, function (i) {
                    vHTML = "";

                    vHTML += "   <div class=\"bk-cargo__cont\" name=\"" + vResult[i]["BKG_NO"] + "_" + vResult[i]["SEQ"] + "\"> ";
                    vHTML += "   	<div class=\"bk-cargo__num\"><p><span></span></p></div> ";
                    vHTML += "   	<div class=\"bk-cargo__desc\"> ";
                    vHTML += "   	    <input type=\"hidden\" value=\"" + vResult[i]["BKG_NO"] + "\" name=\"input_BkgNo\" > ";
                    vHTML += "   	    <input type=\"hidden\" value=\"" + vResult[i]["SEQ"] + "\" name=\"input_SEQ\" > ";
                    vHTML += "   		<p><span>" + _fnToNull(vResult[i]["CNTR_UNIT"]) + "</span> | <span>" + _fnToNull(vResult[i]["CNTR_SIZE"]) + "</span> | <span>" + _fnToNull(vResult[i]["PKG"]) + "</span></p> ";
                    vHTML += "   	</div> ";

                    if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                    } else {
                        vHTML += "   	<button type=\"button\" class=\"btns cargo_del\" name=\"Btn_RealCargo_Del\"></button> ";
                    }
                    
                    vHTML += "   </div> ";

                    $("#FCL_Cntr_Area").append(vHTML);
                });

                //제일 아래로 스크롤 내리기
                $("#FCL_Cntr_Area").scrollTop($("#FCL_Cntr_Area")[0].scrollHeight);

            } else if (_objData.CNTR_TYPE == "L") {

                vResult = JSON.parse(vJsonData).BK_PKG;

                //화물정보
                if ($("#IS_LCL_PRICE_N").css("display") == "flex") {
                    $("#input_LCL_N_CBM").val(_fnToNull(vResult[0]["VOL_WGT"]));
                } else if ($("#IS_LCL_PRICE_Y").css("display") == "flex") {
                    $("#input_LCL_Y_CBM").val(_fnToNull(vResult[0]["VOL_WGT"]));
                    fnGetTariff($("#input_LCL_Y_CBM").val());
                }
            }

            //부킹 요청 상태일 경우에만 취소버튼이 보이게
            if (_objData.STATUS == "Q") {
                $("button[name='booking_request']").text("부킹 수정");
                $("#Booking_Confirm .inner2").text("부킹 수정을 하시겠습니까?");
                $("button[name='booking_cancel']").show();
            } else {
                $("button[name='booking_request']").hide();
            }
            $("button[name='booking_list']").show();

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnSetBookingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnSetBookingData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetBookingData]" + err.message);
    }
}

//문서 데이터 찍어주기
function fnSetFileList(vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).DOC_MST;

            //DOC_TYPE 
            if (vResult != undefined) {
                if (vResult.length > 0) {
                    var vHTML = "";
                    $.each(vResult, function (i) {

                        //문서 파일 수정
                        vResult[i]["SETTIME"] = _fnGetNowTime(); //파일 구분을 위한 값 "년월일시분초밀리초"
                        vResult[i]["FILE_YN"] = "Y";
                        vResult[i]["FILE_CRUD"] = "SELECT";
                        vResult[i]["IS"] = "OBJECT";             //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE

                        _objFile.FILE_INFO.push(vResult[i]);

                        if (_objData.STATUS == "Q") {
                            vHTML += "   <div class=\"bk-file__cont\ uploaded\"> ";
                        } else {
                            vHTML += "   <div class=\"bk-file__cont\ fixed\"> ";
                        }

                        vHTML += "   	<div class=\"bk-file__select\"> ";
                        if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                            vHTML += "      <select class='select' name=\"select_FileList_FileSeparation\" disabled>";
                        }
                        else {
                            vHTML += "      <select class='select' name=\"select_FileList_FileSeparation\">";
                        }
                        vHTML += fnMakeFileOption_Modify(vResult[i].DOC_TYPE);
                        vHTML += "   		</select> ";
                        vHTML += "   	</div> ";

                        vHTML += "   	<div class=\"bk-file__nm\"> ";
                        vHTML += "   		<p><span name='span_FileList_FileDownload'>" + vResult[i].FILE_NM + "</span></p> ";
                        vHTML += "   	</div> ";
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SEQ\" value=\"" + vResult[i].SEQ + "\" />";
                        vHTML += "      <input type=\"hidden\" class=\"input_FileList_SetTime\" id=\"input_FileList_SetTime\" value=\"" + vResult[i].SETTIME + "\"/>";

                        if (_objData.STATUS == "Q") {
                            vHTML += "   	<button type=\"button\" class=\"btns file_del\" name=\"BK_FileList_FileDelete\"></button> ";
                        } 

                        //if (_objData.STATUS == "Y" || _objData.STATUS == "F" || _objData.STATUS == "C" || _objData.STATUS == "O") {
                        //} else {
                        //    
                        //}
                        vHTML += "   </div> ";

                        _fnsleep(50);
                    });

                    /* 결과값 보여주기 */
                    $("#BK_FileList").append(vHTML);
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
    }
    catch (err) {
        console.log("[Error - fnSetFileList]" + err.message);
    }
}

//첨부파일 문서 타입 option
function fnMakeFileOption() {
    try {

        var vHTML = "";
        
        if (_objFileType != null) {
            //그려주기
            $.each(_objFileType, function (i) {
                if (i == 0) {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\" selected>" + _objFileType[i].CD_NM + "</option> ";
                } else {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\">" + _objFileType[i].CD_NM + "</option> ";
                }
            });
        }
        else {
            //기본 타입 세팅
            vHTML += "   			<option value=\"CIPL\" selected>C/I, Packing List</option> ";
            vHTML += "   			<option value=\"CC\">Customs Clearance</option> ";
            vHTML += "   			<option value=\"IP\">Insurance Policy</option> ";
            vHTML += "   			<option value=\"CO\">C/O</option> ";
        }

        return vHTML;

    }
    catch (err) {
        console.log("[Error - fnSetFileSelect]" + err.message);
    }
}

//수정 이후 문서 타입 세팅
function fnMakeFileOption_Modify(vType) {
    try {

        var vHTML = "";

        if (_objFileType != null) {
            //그려주기
            $.each(_objFileType, function (i) {
                if (vType == _objFileType[i].COMN_CD) {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\" selected>" + _objFileType[i].CD_NM + "</option> ";
                } else {
                    vHTML += "  <option value=\"" + _objFileType[i].COMN_CD + "\">" + _objFileType[i].CD_NM + "</option> ";
                }
            });
        }
        else {
            //기본타입
            switch (vType) {
                case "CIPL":
                    vHTML = "<option value=\"CIPL\" selected>C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "CC":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\" selected>Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "IP":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\" selected>Insurance Policy</option><option value=\"CO\">C/O</option>";
                    break;
                case "CO":
                    vHTML = "<option value=\"CIPL\">C/I, Packing List</option><option value=\"CC\">Customs Clearance</option><option value=\"IP\">Insurance Policy</option><option value=\"CO\" selected>C/O</option>";
                    break;
            }
        }

        return vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeFileOption_Modify]" + err.message);
    }
}

////////////////////////API////////////////////////////

