////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {
    //레이어 팝업 강제 종료
    //$(".mfp-close").click();    
    fnGetMyBaordFileList();

    $('.pop-in-close').on('click', function () {        
        magnificPopup.close();
    });
});

//파일 다운로드 로직
$(document).on("click", "a[name='MyBoard_FileDown']", function () {
    var vMNGT_NO = $(this).find("input[name='MyBoard_File_MNGT_NO']").val();
    var vSEQ = $(this).find("input[name='MyBoard_File_SEQ']").val();

    fnMyBaord_FileDown(vMNGT_NO, vSEQ);
});

////////////////////////function///////////////////////
//파일 리스트 가져오기
function fnGetMyBaordFileList() {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = _fnToNull($("#input_MyBoard_File_HBL_NO").val());
        objJsonData.BKG_NO = _fnToNull($("#input_MyBoard_File_BKG_NO").val());
        objJsonData.INV_NO = _fnToNull($("#input_MyBoard_File_INV_NO").val());
        objJsonData.MBL_DOC_TYPE = _DocType_MBL;
        objJsonData.HBL_DOC_TYPE = _DocType_HBL;

        $.ajax({
            type: "POST",
            url: "/Popup/fnGetMyBoardFileList",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeMyBoardFileList(result);
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetMyBaordFileList]" + err.message);
    }
}

//파일 다운로드 로직
function fnMyBaord_FileDown(vMNGT, vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMNGT;  //부킹 번호        
        objJsonData.DOMAIN = $("#Session_DOMAIN").val(); //도메인
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
                    alert("Unable to download.");
                }
            },
            error: function (xhr, status, error) {
                alert("[Error]Please contact the administrator. " + status);
                return;
            }
        });
    }
    catch (err) {
        console.log("[Error - fnMyBaord_FileDown]" + err.message);
    }
}

/////////////////function MakeList/////////////////////
//MyBoard 문서 데이터 그려주기
function fnMakeMyBoardFileList(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).FileList;

            $.each(vResult, function (i) {
                vHTML += "   <li> ";
                vHTML += "   	<div class=\"file_sort\"> ";
                vHTML += "   		<p>" + _fnToNull(vResult[i]["DOC_NM"])+"</p> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"file_nm\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"file_name\" name=\"MyBoard_FileDown\"> ";
                vHTML += _fnToNull(vResult[i]["MNGT_NM"]);
                vHTML += "              <input type=\"hidden\" name=\"MyBoard_File_MNGT_NO\" value=\"" + _fnToNull(vResult[i]["MNGT_NO"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"MyBoard_File_SEQ\" value=\"" + _fnToNull(vResult[i]["SEQ"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"MyBoard_File_FILE_PATH\" value=\"" + _fnToNull(vResult[i]["FILE_PATH"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"MyBoard_File_REPLACE_FILE_NM\" value=\"" + _fnToNull(vResult[i]["REPLACE_FILE_NM"]) + "\" /> ";
                vHTML += "   		</a> ";
                vHTML += "   	</div> ";
                vHTML += "   </li> ";
            });

            $("#MyBoard_FileList_AREA")[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            $(".mfp-close").click();
            alert("Document file does not exist.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            $(".mfp-close").click();
            alert("Please contact the person in charge.");
        }
    }
    catch (err) {
        console.log("[Error - fnMakeMyBoardFileList]" + err.message);
    }
}