////////////////////전역 변수//////////////////////////
//TEST
//var _DocType_MBL = "'MANI','MBL'";
//var _DocType_HBL = "'CIPL', 'HBL', 'CO', 'CC', 'IP','HDC'"; //INV는 따로
////////////////////jquery event///////////////////////
$(function () {
    $('.table--st1 tbody > tr > td').on('click', function () {
        $('tr.on').removeClass('on');
        $(this).parent('tr').addClass('on');
    });

    fnGetTracking($("#input_Tracking_HBL_NO").val());
    //fnGetTracking("SHA22062201");
});

//화물추적 리스트 클릭 이벤트 - PC
$(document).on("click", "tr[name='TrackingList_PC']", function () {   

    if (!$(this).hasClass("Tracking_color")) {
        $("#TrackingList_Result_AREA_PC tr").removeClass("Tracking_color");
        $("#TrackingList_Result_AREA_MO ul").removeClass("Tracking_color");

        var vIndex = $(this).attr("id").replace("TrackingList_PC", "");
        $("#TrackingList_PC" + vIndex).addClass("Tracking_color");
        $("#TrackingList_MO" + vIndex).addClass("Tracking_color");
    
        var vHBL_NO = $(this).find("input[name='TrackingList_HBL_NO']").val();
        var vCNTR_NO = $(this).find("input[name='TrackingList_CNTR_NO']").val();
        var vEX_IM_TYPE = $(this).find("input[name='TrackingList_EX_IM_TYPE']").val();
        fnGetTrackingData(vHBL_NO, vCNTR_NO, vEX_IM_TYPE);
    }
});

//화물추적 리스트 클릭 이벤트 - MO
$(document).on("click", "ul[name='TrackingList_MO']", function () {

    if (!$(this).hasClass("Tracking_color")) {
        $("#TrackingList_Result_AREA_PC tr").removeClass("Tracking_color");
        $("#TrackingList_Result_AREA_MO ul").removeClass("Tracking_color");

        var vIndex = $(this).attr("id").replace("TrackingList_MO", "");
        $("#TrackingList_PC" + vIndex).addClass("Tracking_color");
        $("#TrackingList_MO" + vIndex).addClass("Tracking_color");

        var vHBL_NO = $(this).find("input[name='TrackingList_HBL_NO']").val();
        var vCNTR_NO = $(this).find("input[name='TrackingList_CNTR_NO']").val();
        var vEX_IM_TYPE = $(this).find("input[name='TrackingList_EX_IM_TYPE']").val();
        fnGetTrackingData(vHBL_NO, vCNTR_NO, vEX_IM_TYPE);
    }
});

//파일 리스트 클릭
$(document).on("click", "a[name='btn_Tracking_FileList']", function () {    
    var vHBL_NO = $(this).find("input[name='File_HBL_NO']").val();
    
    fnGetLayerFileList(vHBL_NO);
});

//파일 리스트 클릭
$(document).on("click", "a[name='Layer_Tracking_FileDown']", function () {

    var vMNGT_NO = $(this).find("input[name='LayerTracking_File_MNGT_NO']").val();
    var vSEQ = $(this).find("input[name='LayerTracking_File_SEQ']").val();    

    fnTracking_FileDown(vMNGT_NO, vSEQ);
});

////////////////////////function///////////////////////
function fnGetTracking(vHBL_NO) {

    var objJsonData = new Object();

    objJsonData.HBL_NO = vHBL_NO;
    objJsonData.OFFICE_CD = _Office_CD
    objJsonData.MBL_DOC_TYPE = _DocType_MBL;
    objJsonData.HBL_DOC_TYPE = _DocType_HBL;

    $.ajax({
        type: "POST",
        url: "/Popup/fnGetTracking",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            fnMakeTrackingData(result);
            fnMakeTrackingList(result);
        }, error: function (xhr, status, error) {
            alert("Please contact the person in charge.");
            console.log(error);
        }
    });

}

//리스트 클릭 했을 때 마일 스톤 변경
function fnGetTrackingData(vHBL_NO, vCNTR_NO,vEX_IM_TYPE) {

    var objJsonData = new Object();

    objJsonData.HBL_NO = vHBL_NO;
    objJsonData.CNTR_NO = vCNTR_NO;
    objJsonData.EX_IM_TYPE = vEX_IM_TYPE;    

    $.ajax({
        type: "POST",
        url: "/Popup/fnGetTrackingData",
        async: true,
        dataType: "json",
        data: { "vJsonData": _fnMakeJson(objJsonData) },
        success: function (result) {
            fnMakeTrackingData(result);
        }, error: function (xhr, status, error) {
            alert("Please contact the person in charge.");
            console.log(error);
        }
    });

}

//레이어 파일 리스트 데이터 가져오기
function fnGetLayerFileList(vHBL_NO) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vHBL_NO;
        objJsonData.MBL_DOC_TYPE = _DocType_MBL;
        objJsonData.HBL_DOC_TYPE = _DocType_HBL;

        $.ajax({
            type: "POST",
            url: "/Popup/fnGetLayerFileList",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {                
                fnMakeLayerFileList(result);
            }, error: function (xhr, status, error) {
                alert("Please contact the person in charge.");
                console.log(error);
            }
        });
    }
    catch (err) {
        console.log("[Error - fnGetLayerFileList]" + err.message);
    }
}

//파일 다운로드 로직
function fnTracking_FileDown(vMNGT, vSEQ) {
    try {
        var objJsonData = new Object();

        objJsonData.MNGT_NO = vMNGT;  //부킹 번호        
        objJsonData.DOMAIN = _Domain; //도메인
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
//화물추적 리스트 그려주기
function fnMakeTrackingList(vJsonData) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).Main;

            $.each(vResult, function (i) {
                if (i == 0) {
                    vHTML += "   <tr name=\"TrackingList_PC\" class=\"Tracking_color\" id=\"TrackingList_PC" + i + "\"> ";
                } else {
                    vHTML += "   <tr name=\"TrackingList_PC\" id=\"TrackingList_PC" + i + "\"> ";
                }
                vHTML += "   	<td style=\"display:none\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_CNTR_NO\" value=\"" + _fnToNull(vResult[i]["CNTR_NO"]) + "\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_EX_IM_TYPE\" value=\"" + _fnToNull(vResult[i]["EX_IM_TYPE"]) + "\"> ";
                vHTML += "   	</td> ";
                vHTML += "   	<td> ";
                vHTML += _fnToNull(vResult[i].HBL_NO);
                vHTML += "   	</td> ";
                vHTML += "   	<td> ";
                vHTML += _fnToNull(vResult[i].CNTR_NO);
                vHTML += "   	</td> ";
                vHTML += "   	<td> ";
                vHTML += _fnToNull(vResult[i].MBL_NO);
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"tit\">		 ";
                vHTML += _fnToNull(vResult[i].NOW_EVENT_NM);
                vHTML += "   	</td> ";
                vHTML += "   	<td> ";
                vHTML += "   		<p>	";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "   		</p> ";
                vHTML += "   	</td> ";
                vHTML += "   	<td class=\"doc\"> ";
                if (_fnToNull(vResult[i].FILE_CNT) == "0") {
                    vHTML += "   		<a href=\"javascript:void(0)\"> ";
                    vHTML += "   			<span class=\"count\">0</span> ";
                    vHTML += "   		</a> ";
                } else {
                    vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_Tracking_FileList\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";                                        
                    vHTML += "   			<span class=\"count\">" + _fnToNull(vResult[i].FILE_CNT) + "</span> ";
                    vHTML += "   		</a> ";
                }
                vHTML += "   	</td> ";
                vHTML += "   </tr> ";
            });

            $("#TrackingList_Result_AREA_PC")[0].innerHTML = vHTML;

            vHTML = "";

            $.each(vResult, function (i) {
                if (i == 0) {
                    vHTML += "   <ul class=\"info-box py-2 px-1 Tracking_color\" name=\"TrackingList_MO\" id=\"TrackingList_MO" + i + "\"> ";
                }
                else {
                    vHTML += "   <ul class=\"info-box py-2 px-1\"  name=\"TrackingList_MO\" id=\"TrackingList_MO" + i + "\"> ";
                }

                vHTML += "   	<li style=\"display:none\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_CNTR_NO\" value=\"" + _fnToNull(vResult[i]["CNTR_NO"]) + "\"> ";
                vHTML += "          <input type=\"hidden\" name=\"TrackingList_EX_IM_TYPE\" value=\"" + _fnToNull(vResult[i]["EX_IM_TYPE"]) + "\"> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt\"> ";
                vHTML += "   		<p class=\"title\">House B/L</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += _fnToNull(vResult[i].HBL_NO);
                vHTML += "   		</p> ";
                vHTML += "   	<li class=\"info-txt\"> ";
                vHTML += "   		<p class=\"title\">Container No</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += _fnToNull(vResult[i].CNTR_NO);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt\"> ";
                vHTML += "   		<p class=\"title\">Master B/L</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += _fnToNull(vResult[i].MBL_NO);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt\"> ";
                vHTML += "   		<p class=\"title\">Status</p> ";
                vHTML += "   		<p class=\"tit\"> ";
                vHTML += _fnToNull(vResult[i].NOW_EVENT_NM);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Last Location</p> ";
                vHTML += "   		<p class=\"des\"> ";
                vHTML += _fnToNull(vResult[i].ACT_LOC_NM);
                vHTML += "   		</p> ";
                vHTML += "   	</li> ";
                vHTML += "   	<li class=\"info-txt info-txt--full\"> ";
                vHTML += "   		<p class=\"title\">Doc</p> ";
                vHTML += "   		<div class=\"doc\"> ";
                if (_fnToNull(vResult[i].FILE_CNT) == "0") {
                    vHTML += "   		<a href=\"javascript:void(0)\"> ";
                    vHTML += "   			<span class=\"count\">0</span> ";
                    vHTML += "   		</a> ";
                } else {
                    vHTML += "   		<a href=\"javascript:void(0)\" name=\"btn_Tracking_FileList\"> ";
                    vHTML += "              <input type=\"hidden\" name=\"File_HBL_NO\" value=\"" + _fnToNull(vResult[i]["HBL_NO"]) + "\"> ";
                    vHTML += "   			<span class=\"count\">" + _fnToNull(vResult[i].FILE_CNT) + "</span> ";
                    vHTML += "   		</a> ";
                }
                vHTML += "   		</div> ";
                vHTML += "   	</li> ";
                vHTML += "   </ul> ";
            });

            $("#TrackingList_Result_AREA_MO")[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            magnificPopup.close();
            alert("There is no tracking information.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {            
            magnificPopup.close();
            alert("Please contact the person in charge.");
        }

    }
    catch (err) {
        console.log("[Error - fnMakeTrackingList]" + err.message);
    }
}

//화물추적 데이터 그려주기
function fnMakeTrackingData(vJsonData) {
    try {
        var vHTML = "";
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).DTL;

            if (_fnToNull(vResult[0]["EX_IM_TYPE"]) == "E") {
                $("#Tracking_Result_AREA").removeClass("import");
            }
            else if (_fnToNull(vResult[0]["EX_IM_TYPE"]) == "I") {
                $("#Tracking_Result_AREA").addClass("import");
            }

            //여기서 부터 작업 해야됨.,
            $.each(vResult, function (i) {
                if (_fnToNull(vResult[i].EVENT_STATUS) == "N") {
                    vHTML += "   <li class=\"trc-cnt-box yet\"> ";
                    vHTML += "   	<div class=\"title\">" + _fnToNull(vResult[i].EVENT_NM) +"</div> ";
                    vHTML += "   	<div class=\"item\"> ";
                    if (_fnToNull(vResult[i].EX_IM_TYPE) == "E") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-"+(i+1)+".png\" alt=\"icon\" /> ";
                    }
                    else if (_fnToNull(vResult[i].EX_IM_TYPE) == "I") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-im-" + (i + 1) +".png\" alt=\"icon\" /> ";
                    }
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"txt-box\"> ";
                    vHTML += "   		<p class=\"txt\">" + _fnToNull(vResult[i].ACT_LOC_NM)+"</p> ";
                    vHTML += "   		<p class=\"time\">" + _fnToNull(vResult[i].ACT_YMD) + " " + _fnToNull(vResult[i].ACT_HM)+"</p> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </li> ";
                } else if (_fnToNull(vResult[i].EVENT_STATUS) == "E") {
                    vHTML += "   <li class=\"trc-cnt-box end\"> ";
                    vHTML += "   	<div class=\"title\">" + _fnToNull(vResult[i].EVENT_NM) + "</div> ";
                    vHTML += "   	<div class=\"item\"> ";
                    if (_fnToNull(vResult[i].EX_IM_TYPE) == "E") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-" + (i + 1) + ".png\" alt=\"icon\" /> ";
                    }
                    else if (_fnToNull(vResult[i].EX_IM_TYPE) == "I") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-im-" + (i + 1) + ".png\" alt=\"icon\" /> ";
                    }
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"txt-box\"> ";
                    vHTML += "   		<p class=\"txt\">" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
                    vHTML += "   		<p class=\"time\">" + _fnToNull(vResult[i].ACT_YMD) + " " + _fnToNull(vResult[i].ACT_HM) + "</p> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </li> ";
                }
                else if (_fnToNull(vResult[i].EVENT_STATUS) == "Y") {
                    vHTML += "   <li class=\"trc-cnt-box now\"> ";
                    vHTML += "   	<div class=\"title\">" + _fnToNull(vResult[i].EVENT_NM) + "</div> ";
                    vHTML += "   	<div class=\"item blink\"> ";
                    if (_fnToNull(vResult[i].EX_IM_TYPE) == "E") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-" + (i + 1) + ".png\" alt=\"icon\" /> ";
                    }
                    else if (_fnToNull(vResult[i].EX_IM_TYPE) == "I") {
                        vHTML += "   		<img src=\"/Images/Masstige/e-service/trc-icon-im-" + (i + 1) + ".png\" alt=\"icon\" /> ";
                    }
                    vHTML += "   	</div> ";
                    vHTML += "   	<div class=\"txt-box\"> ";
                    vHTML += "   		<p class=\"txt\">" + _fnToNull(vResult[i].ACT_LOC_NM) + "</p> ";
                    vHTML += "   		<p class=\"time\">" + _fnToNull(vResult[i].ACT_YMD) + " " + _fnToNull(vResult[i].ACT_HM) + "</p> ";
                    vHTML += "   	</div> ";
                    vHTML += "   </li> ";
                }
            });

            $("#Tracking_Result_AREA")[0].innerHTML = vHTML;
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {            
            magnificPopup.close();
            alert("There is no tracking information.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            magnificPopup.close();
            alert("Please contact the person in charge.");
        }

    }
    catch (err) {
        console.log("[Error - fnMakeTrackingList]" + err.message);
    }
}

//문서 리스트 그려주기
function fnMakeLayerFileList(vJsonData) {
    try {
        var vHTML = "";
        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
            var vResult = JSON.parse(vJsonData).FileList;

            $.each(vResult, function (i) {
                vHTML += "   <li> ";
                vHTML += "   	<div class=\"file_sort\"> ";
                vHTML += "   		<p>" + _fnToNull(vResult[i]["DOC_NM"]) + "</p> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"file_nm\"> ";
                vHTML += "   		<a href=\"javascript:void(0)\" class=\"file_name\" name=\"Layer_Tracking_FileDown\"> ";
                vHTML += _fnToNull(vResult[i]["MNGT_NM"]);
                vHTML += "              <input type=\"hidden\" name=\"LayerTracking_File_MNGT_NO\" value=\"" + _fnToNull(vResult[i]["MNGT_NO"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"LayerTracking_File_SEQ\" value=\"" + _fnToNull(vResult[i]["SEQ"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"LayerTracking_File_FILE_PATH\" value=\"" + _fnToNull(vResult[i]["FILE_PATH"]) + "\" /> ";
                vHTML += "              <input type=\"hidden\" name=\"LayerTracking_File_REPLACE_FILE_NM\" value=\"" + _fnToNull(vResult[i]["REPLACE_FILE_NM"]) + "\" /> ";
                vHTML += "   		</a> ";
                vHTML += "   	</div> ";
                vHTML += "   </li> ";
            });

            $("#layer_Tracking_FileList #Layer_FileList")[0].innerHTML = vHTML;
            layerPopup2('#layer_Tracking_FileList');
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            alert("The document does not exist.");
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            alert("Please contact the person in charge.");
        }
    }
    catch (err) {
        console.log("[Error - fnMakeLayerFileList]" + err.message);
    }
}