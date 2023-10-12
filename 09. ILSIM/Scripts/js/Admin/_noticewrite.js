$(function () {
    //게시글 등록
    //$("._btn_reg").on('click', function (e) {
    //    if (check_msg('title', '제목', 'required') == false) return false;
    //    //if ($("#s_type  option:selected").val() == "") {
    //    //    alert("구분을 선택해주세요.");
    //    //    $("#s_type").focus();
    //    //    return false;
    //    //}

    //    $("#ajax_form").submit();
    //    return false;
    //});

    //파일 밸리데이션
    //$(document).on("change", "#infile", function (event) {
    //    //파일 사이즈 10MB 이상일 경우 Exception
    //    if (10485759 < $("#infile").get(0).files[i].size) {
    //        _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
    //        $(this).val("");
    //        return false;
    //    }
    //});


    $('#infile').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile").val("");
            }
        }
    });

    $('#infile1').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile1").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile1").val("");
            }
        }
    });

    $('#infile2').bind('change', function () {
        //파일 사이즈 제한 - 김은빈
        if ($("#infile2").val() != "") {
            if (this.files[0].size > 10485759) {
                _fnAlertMsg("10MB 이상되는 파일은 업로드 할 수 없습니다.");
                $("#infile2").val("");
            }
        }
    });

    //게시글 삭제
    $("._btn_del").on('click', function (e) {
        if ($("#notice_id").val() != "") {  //아이디가 있어야함
            var Notice_ID = $("#notice_id").val();
            var result = confirm("정말로 삭제하시겠습니까?");
            //var obj = new Object();
            //obj.Notice_ID = Notice_ID;                                                                                        
            if (result) {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Notice_DelAjax?Notice_ID=" + Notice_ID,
                    success: function (result) {
                        alert("삭제되었습니다");
                        location.href = "/Admin/Notice";
                    }, error: function (xhr) {
                        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
                        console.log(xhr);
                        return;
                    }
                });
            }
        }
    });    
});

//신규 등록
$(document).on("click", "#Notice_Btn_Reg", function (e) {
    
    e.preventDefault();

    //alert(CKEDITOR.instances.content.getData().length);
    //return false;

    if (check_msg('title', '제목', 'required') == false) return false;

    //if (CKEDITOR.instances.content.getData().length > 1999) {
    //    alert("공지사항 내용은 2000자를 넘을 수 없습니다.\n 현재 글자수 : " + CKEDITOR.instances.content.getData().length);
    //    return false;
    //}

    //제목에 '가 있을 경우 `로 치환
    $("#title").val($("#title").val().replace(/'/gi, "`"));

    //$.ajax({
    //    type: "POST",
    //    url: "/Admin/NoticeModify",
    //    dataType: "json",
    //    data: formData,
    //    async: false,
    //    contentType: false,
    //    processData: false,
    //    success: function (result) {

    //        location.href = "/Admin/Notice";

    //        //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
    //        //    location.href = "/Admin/Notice";
    //        //    //_fnAlertMsg("저장이 완료 되었습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
    //        //    console.log("[Fail : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("저장을 실패 하였습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
    //        //    console.log("[Error : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("관리자에게 문의하세요.");
    //        //}            

    //    }, error: function (xhr) {
    //        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
    //        console.log(xhr);
    //        return;
    //    }
    //});
    
    $("#ajax_form").submit();
    return false;
});

$(document).on("click", "#Notice_Btn_Modi", function (e) {
    e.preventDefault();
    if (check_msg('title', '제목', 'required') == false) return false;

    //$.ajax({
    //    type: "POST",
    //    url: "/Admin/NoticeModify",
    //    dataType: "json",
    //    data: formData,
    //    async: false,
    //    contentType: false,
    //    processData: false,
    //    success: function (result) {

    //        location.href = "/Admin/Notice";

    //        //if (JSON.parse(result).Result[0]["trxCode"] == "Y") {
    //        //    location.href = "/Admin/Notice";
    //        //    //_fnAlertMsg("저장이 완료 되었습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "N") {
    //        //    console.log("[Fail : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("저장을 실패 하였습니다.");
    //        //}
    //        //else if (JSON.parse(result).Result[0]["trxCode"] == "E") {
    //        //    console.log("[Error : NoticeModify()]" + JSON.parse(result).Result[0]["trxMsg"]);
    //        //    _fnAlertMsg("관리자에게 문의하세요.");
    //        //}            

    //    }, error: function (xhr) {
    //        console.log("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
    //        console.log(xhr);
    //        return;
    //    }
    //});

    $("#ajax_form").submit();
    return false;
});

function fnInputForm() {
    var notice_id = $("notice_id").val();
    var title = $("title").val();
    var notice_yn = $(":input:radio[name=notice_yn]:checked").val();
    var content = $("content").val();
}

