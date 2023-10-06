////////////////////전역 변수//////////////////////////
var _objConsoleFile = new Object(); //파일 object - 수출
var _vPage = 1; //페이징
var _ImageMngtNo = "";
var _DetailMngtNo = "";
var _DetailSeq = "";

var _OrderBy = "";
var _Sort = "";
var _isSearch = false;
////////////////////jquery event///////////////////////
$('input[name="environment"]').change(function () {
    setImageFromFile(this, '#preview');
});

function setImageFromFile(input, expression) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        $("#preview").css({"display":"block"});
        reader.onload = function (e) {
            $(expression).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}



$(function () {

    $('body').addClass('e-service--sub');
    $('.delete-btn').on('click', function () {
        $(this).siblings().val('');
    });

    //로그인 세션 확인
    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    }
    else {
        $("#input_ETD").val(_fnPlusDate(0));
        $("#input_ETA").val(_fnPlusDate(7));
    }
});

//출발지 도착지 삭제 버튼 이벤트
$(document).on("click", ".delete-btn", function () {
    if ($(this).attr("name") == "input_auto_POD") {
        $("#input_auto_POD").val("");
        $("#input_auto_PODCD").val("");
    }

    $(this).hide();
});

//수출 - POD 클릭 (AutoComplete O)
$(document).on("click", "#input_auto_POD", function () {
    if ($(this).val().length == 0) {
        $(".sch-pop--pod--export").show();
    } else {
        $(".sch-pop--pod--export").hide();
    }
});

//수출 POD AutoComplete
$(document).on("keyup", "#input_auto_POD", function () {
    //input_POL 초기화
    if (_fnToNull($(this).val()) == "") {
        $("#input_auto_PODCD").val("");
    }

    //출발 도시 바로 선택 화면 가리기
    if ($(this).val().length > 0) {
        $("button[name='input_auto_POD']").show();
        $(".sch-pop--pod--export").hide();
    }
    else if ($(this).val().length == 0) {
        $("button[name='input_auto_POD']").hide();
        $(".sch-pop--pod--export").hide();
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_POD_Width").width()
            });
        },
        source: function (request, response) {
            var result = _fnGetPortData($("#input_auto_POD").val().toUpperCase());
            if (result != undefined) {
                result = JSON.parse(result).Table
                response(
                    $.map(result, function (item) {
                        return {
                            label: item.NAME,
                            value: item.NAME,
                            code: item.CODE
                        }
                    })
                );
            }
        },
        select: function (event, ui) {
            if (ui.item.value.indexOf('데이터') == -1) {
                $("#input_auto_POD").val(ui.item.value);
                $("#input_auto_PODCD").val(ui.item.code);
                vPort = ui.item.code;
            } else {
                ui.item.value = "";
            }
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.value + "<br>" + item.code + "</div>")
            .appendTo(ul);
    };
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETD_Icon", function () {
    $("#input_ETD").focus();
});

//달력 클릭 이벤트
$(document).on("click", "#input_ETA_Icon", function () {
    $("#input_ETA").focus();
});


//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_ETD", function () {
    var vValue = $("#input_ETD").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val(_fnPlusDate(0));
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        alert("ETD가 ETA 보다 빠를 수 없습니다. ");
        $("#input_ETD").val(vETA.substring("0", "4") + "-" + vETA.substring("4", "6") + "-" + vETA.substring("6", "8"));
    }
});

//ETD 날짜 yyyymmdd 로 입력 시 yyyy-mm-dd 로 변경
$(document).on("focusout", "#input_ETA", function () {
    var vValue = $("#input_ETA").val();
    var vValue_Num = vValue.replace(/[^0-9]/g, "");
    if (vValue != "") {
        vValue = vValue_Num.substring("0", "4") + "-" + vValue_Num.substring("4", "6") + "-" + vValue_Num.substring("6", "8");
        $(this).val(vValue);
    }

    //값 벨리데이션 체크
    if (!_fnisDate($(this).val())) {
        $(this).val(_fnPlusDate(7));
    }

    //날짜 벨리데이션 체크
    var vETD = $("#input_ETD").val().replace(/[^0-9]/g, "");
    var vETA = $("#input_ETA").val().replace(/[^0-9]/g, "");

    if (vETA < vETD) {
        alert("ETA가 ETD 보다 빠를 수 없습니다. ");
        $("#input_ETA").val(vETD.substring("0", "4") + "-" + vETD.substring("4", "6") + "-" + vETD.substring("6", "8"));
    }
});

//즐겨찾기 포트 선택
$(document).on("click", ".quick_pod_port", function () {

    var vValue = $(this).val();
    var vSplit = vValue.split(";");

    $("#input_auto_POD").val(vSplit[0]);
    $("#input_auto_PODCD").val(vSplit[1]);
    $("button[name='input_auto_POD']").show();
});

//창고 조회 버튼 이벤트
$(document).on("click", "#btn_Console_Search", function () {

    _OrderBy = "";
    _Sort = "";
    _vPage = 1; 
    fnConsoleSearch();

    //TEST 입니다.
    //$("#hdn_Preview_MngtNo").val("");
    //$("#hdn_Preview_Seq").val("");
    //$("#img_Preview").attr("src", "");
    //layerPopup2('#Upload_pop');
});

//TEST
//다운로드 버튼 변경 시키기    
$(document).on("click", "#Preview01", function () {
    $("#img_Preview").attr("src", "");
    $("#img_Preview").attr("src", "http://110.45.209.61:8099/EDMS/DOC/MOAX.ELVIS.DEV/MOAX/20230206/CCU21020901_1_이미지.png");

    $("#hdn_Preview_MngtNo").val("CCU21020901");
    $("#hdn_Preview_Seq").val("1");
});

//다운로드 버튼 변경 시키기    
$(document).on("click", "#Preview02", function () {    
    $("#img_Preview").attr("src", "");
    $("#img_Preview").attr("src", "http://110.45.209.61:8099/EDMS/DOC/MOAX.ELVIS.DEV/MOAX/20230206/CCU21020901_2_웰시 이미지.png");

    $("#hdn_Preview_MngtNo").val("CCU21020901");
    $("#hdn_Preview_Seq").val("2");
});

$(document).on("click", "#Preview03", function () {
    $("#img_Preview").attr("src", "");
    $("#img_Preview").attr("src", "http://110.45.209.61:8099/EDMS/DOC/MOAX.ELVIS.DEV/MOAX/20230206/CCU21020901_3_고양이.png");

    $("#hdn_Preview_MngtNo").val("CCU21020901");
    $("#hdn_Preview_Seq").val("3");
});

//파일 다운로드 로직
$(document).on("click", "#btn_Preview_Download", function () {

    if (_fnToNull($("#hdn_Preview_MngtNo").val()) == "") {
        alert("파일을 먼저 선택 해주시기 바랍니다.");
    } else {
        fnImageDown($("#hdn_Preview_MngtNo").val(), $("#hdn_Preview_Seq").val());
    }
});
//TEST


//정렬
$(document).on("click", ".orderby", function () {

    if ($(this).siblings("button").val().length > 0) {
        if (_isSearch) {
            var vValue = "";

            if ($(this).siblings("button").hasClass("on")) {
                vValue = "asc"
            }
            else {
                vValue = "desc"
            }

            $("#Console_orderby th button").removeClass("on");
            if (vValue == "desc") {
                $(this).siblings("button").addClass('on');
            } else if (vValue == "desc") {
                $(this).siblings("button").removeClass('on');
            }

            _vPage = 1;
            _OrderBy = $(this).siblings("button").val();
            _Sort = vValue.toUpperCase();
            fnConsoleSearch();
        }
    }
});

//파일 업로드 버튼 이벤트
$(document).on("click", "a[name='layer_ImageUpload']", function () {   

    $('body').addClass('hidden_scroll');
    //초기화
    _objConsoleFile = new Object();
    _objConsoleFile.FILE_INFO = new Array();
    $("#layer_Upload_FileList").empty();
    
    ////파일 데이터 가져오기 
    _ImageMngtNo = $(this).siblings("input[type='hidden']").val(); //관리번호    
    fnSetFileList(_ImageMngtNo);
});

//파일 리스트 - 엑스  박스 버튼 이벤트 
$(document).on("click", "a[name='Layer_FileList_Delete']", function () {

    var vValue = $(this).parents(".file-box").find(".input_FileList_SetTime").val();

    //처음 파일 저장시 SETTIME을 주어서 취소 눌렀을 때 그걸 비교하여 li에 있는 값들을 삭제 합니다.
    for (var i = 0; i < _objConsoleFile.FILE_INFO.length; i++) {
        if (vValue == _fnToNull(_objConsoleFile.FILE_INFO[i]["SETTIME"])) {

            if (_objConsoleFile.FILE_INFO[i].constructor.name == "File") {
                _objConsoleFile.FILE_INFO[i]["FILE_YN"] = "N";                
                $(this).parents(".file-box").remove();
            } else {
                if (confirm("파일을 삭제 하시겠습니까?")) {                    
                    fnLayerFileDelete(this);
                    //초기화
                    //_objConsoleFile = new Object();
                    //_objConsoleFile.FILE_INFO = new Array();
                    //fnSetFileList(_ImageMngtNo);
                }
            }            
        }
    }
});

//카메라 이벤트
$(document).on("change", "#camera", function (e) {
    fnLayerFileSet(this);
    $(this).val("");
});

//파일 업로드 버튼
$(document).on("click", "#layer_FileUpload", function () {

    var vBoolean = false;

    for (var i = 0; i < _objConsoleFile.FILE_INFO.length; i++) {
        if (_objConsoleFile.FILE_INFO[i]["IS"] == "FILE" && _objConsoleFile.FILE_INFO[i]["FILE_YN"] == "Y") {
            vBoolean = true;
        }
    }

    if (vBoolean) {
        fnLayerFileUpload(_ImageMngtNo, _objConsoleFile);
    } else {
        alert("파일을 먼저 등록 해 주세요.");
    }
    
});

//파일 다운로드
$(document).on("click", "p[name='Layer_File_Download']", function () {

    var vMngtNo = $(this).parents(".file-box").find(".input_FileList_MNGT_NO").val();
    var vSeq = $(this).parents(".file-box").find(".input_FileList_SEQ").val();
    
    fnImageDown(vMngtNo,vSeq);
});

//창고 디테일 조회
$(document).on("click", "a[name='layer_ConsoleData']", function () {   

    _DetailMngtNo = $(this).siblings("input[name='layer_DetailMngtNo']").val(); //관리번호
    _DetailSeq = $(this).siblings("input[name='layer_DetailSeq']").val();

    magnificPopup.open({
        items: {
            src: '/Popup/Console_Detail'
        },
        type: 'ajax',
        closeOnBgClick: false
    }, 0);

});
////////////////////////function///////////////////////
//콘솔 Serach
function fnConsoleSearch() {
    try {
        var objJsonData = new Object();

        objJsonData.ETD = _fnToNull($("#input_ETD").val().replace(/-/gi, ""));
        objJsonData.ETA = _fnToNull($("#input_ETA").val().replace(/-/gi, ""));
        objJsonData.BK_NO = _fnToNull($("#input_BkNo").val());
        
        objJsonData.POD = _fnToNull($("#input_auto_POD").text());
        objJsonData.POD_CD = _fnToNull($("#input_auto_PODCD").val());

        objJsonData.USR_TYPE = _fnToNull($("#Session_USR_TYPE").val());
        objJsonData.CUST_CD = $("#Session_CUST_CD").val();
        objJsonData.PAGE = _vPage;

        if (_fnToNull(_OrderBy) != "" || _fnToNull(_Sort) != "") {
            objJsonData.ID = _OrderBy;
            objJsonData.ORDER = _Sort;
        } else {
            objJsonData.ID = "";
            objJsonData.ORDER = "";
        }

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnGetConsoleData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeConsoleList(result);
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnConsolePaging(JSON.parse(result).Console[0]["TOTCNT"], 10, 10, objJsonData.PAGE);
                }
                //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                //    fnMakeSetFileList(result);
                //}
            }, error: function (xhr, status, error) {
                alert("담당자에게 문의 하세요.");
                console.log(error);
                vReturn = false;
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
        console.log("[Error - fnConsoleSearch]" + err.message);
    }
}

//totalData = 총 데이터 count
//dataPerPage = 한페이지에 나타낼 데이터 수
//pageCount = 한화면에 나타낼 페이지 수
//currentPage = 선택한 페이지 
//공지사항 페이징
function fnConsolePaging(totalData, dataPerPage, pageCount, currentPage) {
    var totalPage = Math.ceil(totalData / dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage / pageCount);    // 페이지 그룹
    if (pageCount > totalPage) pageCount = totalPage;
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if (last > totalPage) last = totalPage;
    var first = last - (pageCount - 1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last + 1;
    var prev = first - 1;

    $("#Paging_Area").empty();

    var prevPage;
    var nextPage;
    if (currentPage - 1 < 1) { prevPage = 1; } else { prevPage = currentPage - 1; }
    //if (last < totalPage) { nextPage = currentPage + 1; } else { nextPage = last; }
    if (currentPage == last) {
        if (last == totalPage) {
            nextPage = last
        } else {
            nextPage = currentPage + 1;
        }
    } else {
        nextPage = currentPage + 1;
    }

    var vHTML = "";

    vHTML += "   <ul> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev-first\" onclick=\"fnConsoleGoPage(1)\" ><span>맨앞으로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" class=\"prev\" onclick=\"fnConsoleGoPage(" + prevPage + ")\"><span>이전으로</span></a> ";
    vHTML += "      </li> ";

    for (var i = first; i <= last; i++) {
        if (i == currentPage) {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" class=\"active\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        } else {
            vHTML += "   <li> ";
            vHTML += "   	<a href=\"javascript:;\" onclick=\"fnConsoleGoPage(" + i + ")\">" + i + "<span></span></a> ";
            vHTML += "   </li> ";
        }
    }

    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnConsoleGoPage(" + nextPage + ")\" class=\"next\"><span>다음으로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "      <li> ";
    vHTML += "      	<a href=\"javascript:;\" onclick=\"fnConsoleGoPage(" + totalPage + ")\" class=\"next-last\"><span>맨뒤로</span></a> ";
    vHTML += "      </li> ";
    vHTML += "   </ul> ";

    $("#Paging_Area").append(vHTML);    // 페이지 목록 생성
}

function fnConsoleGoPage(vPage) {
    _vPage = vPage;
    fnConsoleSearch();
}

//이미 올라간 파일 리스트 세팅
function fnSetFileList(vMngtNo) {
    try {
        var objJsonData = new Object();
        objJsonData.MNGT_NO = vMngtNo;

        $.ajax({
            type: "POST",
            url: "/MyMenu/fnLayerSetFileList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                    fnMakeSetFileList(result);
                }

                //현재 로그인한 사람이 마스터가 아닐경우 업로드 , 삭제 불가
                if ($("#Session_USR_TYPE").val() == "M") {
                    $("#FileUploadBtn_Area").show();
                    $("a[name='Layer_FileList_Delete']").show();
                } else {
                    $("#FileUploadBtn_Area").hide();
                    $("a[name='Layer_FileList_Delete']").hide();
                }

                layerPopup2('#Upload_pop');
            }, error: function (xhr, status, error) {
                alert("담당자에게 문의 하세요.");
                console.log(error);
                vReturn = false;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnSetFileList]" + err.message);
    }
}

//실제 파일 업로드 세팅
function fnLayerFileSet(vThis) {
    try {
        var _arrFileValue = new Array(); //파일 정보 저장

        for (var i = 0; i < $(vThis).get(0).files.length; i++) {
            var vFileExtension = $(vThis).get(0).files[i].name.substring($(vThis).get(0).files[i].name.lastIndexOf(".") + 1, $(vThis).get(0).files[i].name.length).toUpperCase();
            var vFileNM = $(vThis).get(0).files[i].name;

            var vFileRegExp = /[\/\\+:*&?<>|\"#%^]/g;
            if (vFileRegExp.test(vFileNM)) {
                alert('파일명에 특수문자를 제거 해주시기 바랍니다. (/, \, +, :, *, &, ?, <, >, |, ", #, % , ^) 금지');
                return false;
            }
            
            //파일 사이즈 10MB 이상일 경우 Exception
            if (10485759 < $(vThis).get(0).files[i].size) {
                alert("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                return false;
            }

            //이미지 파일이 아닐 경우
            if (vFileExtension == "BMP" || vFileExtension == "JPG" || vFileExtension == "JPEG" || vFileExtension == "JPE" || vFileExtension == "JFIF" || vFileExtension == "TIF" || vFileExtension == "TIFF" || vFileExtension == "PNG") {
                console.log("[파일 확장자] " + vFileExtension);
            } else {
                alert("bmp , jpg , jpeg , jpe , jfif , tif , tiff , png 확장자만 파일 업로드를 할 수 있습니다.");
                return false;
            }

            //PC / MO 공용으로 사용하기 위한 이름 변경
            $(vThis).get(0).files[i].NAME = "IMAGE";
            $(vThis).get(0).files[i].SETTIME = _fnGetNowTime();
            $(vThis).get(0).files[i].FILE_YN = "Y";
            $(vThis).get(0).files[i].FILE_CRUD = "INSERT";
            $(vThis).get(0).files[i].IS = "FILE";
            $(vThis).get(0).files[i].DOC_NO = "";

            _arrFileValue.push($(vThis).get(0).files[i]);

            //SETTIME을 설정하기 위한 sleep 함수
            _fnsleep(50);
        }

        for (var i = 0; i < _arrFileValue.length; i++) {
            _objConsoleFile.FILE_INFO.push(_arrFileValue[i]);
        }

        var vHTML = "";

        $.each($(vThis)[0].files, function (i) {
            vHTML += "   <div class=\"file-box row align-items-center px-2\"> ";
            vHTML += "   	<p class=\"file-box__text col not_uploaded\">" + $(vThis)[0].files[i].name + "</p> ";
            //vHTML += "   	<p class=\"file-box__text col not_uploaded\">IMAGE</p> ";
            vHTML += "   	<a href=\"javascript:void(0)\" class=\"col-auto\" name=\"Layer_FileList_Delete\"><i class=\"xi-close-thin\"></i></a> ";
            vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SEQ\"> ";
            vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SetTime\" name=\"input_FileList_SetTime\" value=\"" + $(vThis)[0].files[i].SETTIME + "\"> ";
            vHTML += "   </div> ";
        });

        $("#layer_Upload_FileList").append(vHTML);
    }
    catch (err) {
        console.log("[Error - fnLayerFileSet]" + err.message);
    }
}

//파일 업로드 함수
function fnLayerFileUpload(vMNGT_NO, vFileObj) {
    try {
        
        /* 파일 업로드 & 삭제 구문 */
        var vfileData;
        var vBoolean = false;

        /* 파일 Upload & 파일 삭제 로직*/
        for (var i = 0; i < vFileObj.FILE_INFO.length; i++) {
            if (vFileObj.FILE_INFO[i]["IS"] == "FILE" && vFileObj.FILE_INFO[i]["FILE_YN"] == "Y") { //File 형식이면 Insert 로직 태움

                vfileData = new FormData(); //Form 초기화
                vfileData.append("fileInput", vFileObj.FILE_INFO[i]);

                //추후 세션 값으로 변경
                vfileData.append("DOMAIN", $("#Session_DOMAIN").val());   //로그인한 User의 도메인
                vfileData.append("MNGT_NO", vMNGT_NO); //화주 ID (사업자번호)  
                vfileData.append("INS_USR", $("#Session_USR_ID").val());    //User
                vfileData.append("OFFICE_CD", $("#Session_OFFICE_CD").val()); //회사 코드 
                vfileData.append("DOC_TYPE", 'ETCH');
                vfileData.append("DOC_NO", vMNGT_NO);

                $.ajax({
                    type: "POST",
                    url: "/File/ConSole_Upload_Files",
                    dataType: "json",
                    async: false,
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data: vfileData,
                    success: function (result, status, xhr) {                        
                        if (result != null) {
                            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                                vBoolean = true;
                                console.log("fnFileUpload[trxCode] " + JSON.parse(result).Result[0]["trxCode"]);
                                console.log("fnFileUpload[trxMsg] " + JSON.parse(result).Result[0]["trxMsg"]);
                            } else {
                                vBoolean = false;
                                console.log("fnFileUpload[trxCode] " + JSON.parse(result).Result[0]["trxCode"]);
                                console.log("fnFileUpload[trxMsg] " + JSON.parse(result).Result[0]["trxMsg"]);
                            }
                        } else {
                            alert("파일 저장에 실패하였습니다.\n관리자에게 문의 해 주세요.");
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("[Error]관리자에게 문의 해 주세요. " + status);
                    }
                });
            }
        }

        if (vBoolean) {
            alert("파일 업로드가 완료 되었습니다.");

            //초기화
            _objConsoleFile = new Object();
            _objConsoleFile.FILE_INFO = new Array();

            fnSetFileList(_ImageMngtNo);
        }
        else {
            alert("파일 업로드가 실패 하였습니다. \n 관리자에게 문의 해 주세요.");
        }
    }
    catch (err) {
        console.log("[Error - fnLayerFileUpload]" + err.message);
    }
}

//이미지 Delete 파일
function fnLayerFileDelete(vThis) {
    try {

        for (var i = 0; i < _objConsoleFile.FILE_INFO.length; i++) {
            if ($(vThis).parents(".file-box").find(".input_FileList_SetTime").val() == _fnToNull(_objConsoleFile.FILE_INFO[i]["SETTIME"])) {
                ////삭제로직                    
                var objJsonData = new Object();
                objJsonData.FILE_INFO = new Array();
                objJsonData.FILE_INFO.push(_objConsoleFile.FILE_INFO[i]);

                $.ajax({
                    type: "POST",
                    url: "/File/ConSole_DeleteFile",
                    async: false,
                    dataType: "json",
                    data: { "vJsonData": _fnMakeJson(objJsonData) },
                    success: function (result) {
                        if (result != null) {
                            if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
                                alert("삭제가 완료 되었습니다.");
                                $(vThis).parents(".file-box").remove();
                            } else {
                                alert("삭제가 되지 않았습니다.\n담당자에게 문의하세요.");
                            }
                        } else {
                            alert("담당자에게 문의하세요.");
                        }
                    }, error: function (xhr, status, error) {
                        alert("담당자에게 문의 하세요.");
                        console.log(error);
                        vReturn = false;
                    }
                });
            }
        }
    }
    catch (err) {
        console.log("[Error - fnLayerFileDelete]" + err.message);
    }
}

//콘솔 이미지 다운로드
function fnImageDown(vMngtNo,vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMngtNo; //관리번호
        objJsonData.DOMAIN = $("#Session_DOMAIN").val(); //접속 User
        objJsonData.SEQ = vSEQ;

        $.ajax({
            type: "POST",
            url: "/File/ConSole_Download",
            async: false,
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result, status, xhr) {
                if (result != "E") {
                    var rtnTbl = JSON.parse(result);
                    rtnTbl = rtnTbl.Path;
                    var file_nm = rtnTbl[0].FILE_NAME;
                    if (_fnToNull(rtnTbl) != "") {
                        window.location = "/File/Console_DownloadFile?FILE_NM=" + file_nm + "&REPLACE_FILE_NM=" + rtnTbl[0].FILE_REAL_NAME;
                    }
                } else {
                    alert("다운 받을 수 없습니다.");
                }
            },
            error: function (xhr, status, error) {
                alert("[Error]관리자에게 문의 해 주세요. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnPreAlertDown]" + err.message);
    }
}
/////////////////function MakeList/////////////////////
function fnMakeSetFileList(vJsonData) {
    try {

        var vHTML = "";
        var vResult = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            vResult = JSON.parse(vJsonData).DOC_MST;

            $("#layer_Upload_FileList").empty();

            //DOC_TYPE - PC
            if (vResult != undefined) {
                if (vResult.length > 0) {
                    $.each(vResult, function (i) {

                        //문서 파일 수정
                        vResult[i]["SETTIME"] = _fnGetNowTime(); //파일 구분을 위한 값 "년월일시분초밀리초"
                        vResult[i]["FILE_YN"] = "Y";
                        vResult[i]["FILE_CRUD"] = "SELECT";
                        vResult[i]["IS"] = "OBJECT";             //파일 업로드 됐을 경우는 OBJECT / 파일 저장이 되지 않았을 때는 FILE

                        _objConsoleFile.FILE_INFO.push(vResult[i]);

                        vHTML += "   <div class=\"file-box row align-items-center px-2\"> ";
                        //vHTML += "   	<p class=\"file-box__text col\">" + $(vThis)[0].files[i].name + "</p> ";
                        vHTML += "   	<p class=\"file-box__text col\" name=\"Layer_File_Download\" style=\"cursor:pointer\">" + vResult[i].FILE_NM+"</p> ";
                        vHTML += "   	<a href=\"javascript:void(0)\" class=\"col-auto\" name=\"Layer_FileList_Delete\"><i class=\"xi-close-thin\"></i></a> ";
                        vHTML += "   	<input type=\"hidden\" class=\"input_FileList_MNGT_NO\" value=\"" + vResult[i].MNGT_NO + "\"> ";
                        vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SEQ\" value=\"" + vResult[i].SEQ+"\"> ";
                        vHTML += "   	<input type=\"hidden\" class=\"input_FileList_SetTime\" name=\"input_FileList_SetTime\" value=\"" + vResult[i].SETTIME + "\"> ";
                        vHTML += "   </div> ";

                        _fnsleep(50);
                    });

                    $("#layer_Upload_FileList").append(vHTML);
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            console.log("[Fail - fnMakeSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);            
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            console.log("[Error - fnMakeSetFileList]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        //UserType에 따라서 버튼 Area 보여줄지 말지 체크
        //if (_fnToNull($("#Session_USR_TYPE").val()) == "M") {
        //    $("#FileUploadBtn_Area").show();
        //}
        //else {
        //    $("#FileUploadBtn_Area").hide();
        //    $("a[name='Layer_FileList_Delete']").hide();
        //}

    }
    catch (err) {
        console.log("[Error - fnMakeSetFileList]" + err.message);
    }
}

function fnMakeConsoleList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            _isSearch = true;
            var vResult = JSON.parse(vJsonData).Console;
            
            //데이터 반복문 - //PC
            $.each(vResult, function (i) {
                vHTML += "   <tr> ";
                vHTML += "   	<td class=\"txt txt--main font-weight-medium\">" + _fnToNull(vResult[i]["ACT_CUST_NM"]) + "</td>  ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + _fnToNull(vResult[i]["BK_NO"]) + "</td>  ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + _fnToNull(vResult[i]["GR_NO"])+"</td>  ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + _fnToNull(vResult[i]["POD_CD"]) +" <br/> " + _fnToNull(vResult[i]["POD_NM"])+"</td>  ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + String(_fnToNull(vResult[i]["GR_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') +"</td>  ";
                vHTML += "   	<td class=\"txt txt--main font-weight-medium\">" + _fnToNull(vResult[i]["MARK"]) + "</td> ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + fnSetComma(_fnToNull(vResult[i]["ACT_QTY"])) + "</td> ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + fnSetComma(_fnToNull(vResult[i]["ACT_GRS_WGT"]))+"</td> ";
                vHTML += "   	<td class=\"txt font-sub font-weight-medium\">" + fnSetComma(_fnToNull(vResult[i]["ACT_MSRMT"])) +"</td> ";
                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" name=\"layer_ImageUpload\" class=\"link\"> <img src=\"/Images/Masstige/e-service/upload-img.jpg\" alt=\"upload\" /> </a> ";
                vHTML += "   		<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["BK_NO"]) +"\" />  ";
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"txt\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" name=\"layer_ConsoleData\" class=\"link\"><i class=\"xi-plus\"></i></a> ";
                vHTML += "   		<input type=\"hidden\" name=\"layer_DetailMngtNo\" value=\"" + _fnToNull(vResult[i]["BK_NO"]) + "\" /> ";
                vHTML += "   		<input type=\"hidden\" name=\"layer_DetailSeq\" value=\"" + _fnToNull(vResult[i]["BK_SEQ"]) + "\" /> ";
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
            });

            $("#Console_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //데이터 반복문 - MO
            $.each(vResult, function (i) {
                vHTML += " <ul class=\"info-box py-2 px-1\"> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">실화주명</p> ";
                vHTML += "   	<p class=\"txt des\">" + _fnToNull(vResult[i]["ACT_CUST_NM"]) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">Booking</p> ";
                vHTML += "   	<p class=\"txt des\">" + _fnToNull(vResult[i]["BK_NO"]) + "</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">입고번호</p> ";
                vHTML += "   	<p class=\"des\">" + _fnToNull(vResult[i]["GR_NO"]) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title\">POD</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + _fnToNull(vResult[i]["POD_CD"]) + " <br/> " + _fnToNull(vResult[i]["POD_NM"]) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">입고일자</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + String(_fnToNull(vResult[i]["GR_YMD"])).replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title\">Mark</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + _fnToNull(vResult[i]["MARK"]) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">수량</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + fnSetComma(_fnToNull(vResult[i]["ACT_QTY"])) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">중량</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + fnSetComma(_fnToNull(vResult[i]["ACT_GRS_WGT"])) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">용적</p> ";
                vHTML += "   	<p class=\"text-gray-6 common-text--14 des\">" + fnSetComma(_fnToNull(vResult[i]["ACT_MSRMT"])) +"</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\"></p> ";
                vHTML += "   	<p class=\"des\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" name=\"layer_ImageUpload\" class=\"link\"> <img src=\"/Images/Masstige/e-service/upload-img.jpg\" alt=\"upload\" /> </a> ";
                vHTML += "   		<input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["BK_NO"]) +"\" /> ";
                vHTML += "   	</p> ";
                vHTML += "   </li> ";
                vHTML += "   <li class=\"info-txt info-txt--full\"> ";
                vHTML += "   	<p class=\"title font-main\">상세보기</p> ";
                vHTML += "   	<p class=\"des\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" name=\"layer_ConsoleData\" class=\"link\"><i class=\"xi-plus\"></i></a> ";
                vHTML += "   		<input type=\"hidden\" name=\"layer_DetailMngtNo\" value=\"" + _fnToNull(vResult[i]["BK_NO"]) + "\" /> ";
                vHTML += "   		<input type=\"hidden\" name=\"layer_DetailSeq\" value=\"" + _fnToNull(vResult[i]["BK_SEQ"]) + "\" /> ";
                vHTML += "   	</p> ";
                vHTML += "   </li> ";
                vHTML += " </ul> ";
            });

            $("#Console_Result_AREA_MO")[0].innerHTML = vHTML;

            $("#Paging_Area").show();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            _isSearch = false;

            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"11\" class=\"no_data\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></td> ";
            vHTML += "   </tr> ";

            $("#Console_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">데이터가 없습니다.</span></li> ";
            vHTML += "   </ul> ";

            $("#Console_Result_AREA_MO")[0].innerHTML = vHTML;

            $("#Paging_Area").hide();
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            _isSearch = false;

            //PC
            vHTML += "   <tr> ";
            vHTML += "   	<td colspan=\"11\" class=\"no_data\"><span class=\"font-weight-medium\">관리자에게 문의하세요.</span></td> ";
            vHTML += "   </tr> ";

            $("#Console_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            //MO
            vHTML += "   <ul class=\"info-box py-2 px-1\"> ";
            vHTML += "   	<li class=\"no_data col-12 py-6\"><span class=\"font-weight-medium\">관리자에게 문의하세요.</span></li> ";
            vHTML += "   </ul> ";

            $("#Console_Result_AREA_MO")[0].innerHTML = vHTML;
            $("#Paging_Area").hide();
        }
    }
    catch (err) {
        console.log("[Error - fnMakeConsoleList()]" + err.message);
    }
}

$(".file_list").on("click", "a", function (e) {
    $('.preview-area > img').removeAttr('src');
    $("#preview").css({ "display": "none" });
})

$(".mfp-close").click(function (e) {
    $('body').removeClass('hidden_scroll');
});
/*document.querySelector("")*/