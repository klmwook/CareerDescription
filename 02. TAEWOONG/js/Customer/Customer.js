////////////////////전역 변수//////////////////////////
////////////////////jquery event///////////////////////
$(function () {   

    if (_fnToNull($("#Session_USR_ID").val()) == "") {
        window.location = window.location.origin;
    } else {
        $("list_item .inner").removeClass("on");
        $("#Customer .inner").addClass("on");
        fnInitAutoComplete();
                
        //뒤로가기 이벤트로 왔을 경우 이벤트
        if (event.persisted || (window.performance && window.performance.navigation.type == 2) || event.originalEvent && event.originalEvent.persisted) {
            if (_fnToNull(sessionStorage.getItem("BEFORE_VIEW_NAME")) == "Customer") {

                $("#input_CUST_NM").val(_fnToNull(sessionStorage.getItem("CUST_NM")));
                $("#input_CUST_CD").val(_fnToNull(sessionStorage.getItem("CUST_CD")));
                sessionStorage.clear();

                $("#btn_Search").click();
            }
        }
    }
});

//거래처 글자 길이가 길면 생기는 버튼 체크 로직
$(window).resize(function () {
    fnSetPlusBtn();
});

$(document).on("click", "#btn_deleteCust", function () {
    $("#input_CUST_CD").val("");
});

//거래처 Keyup 이벤트
$(document).on("keyup", "#input_CUST_NM", function (e) {

    if ($(this).val().length == 0) {
        $("#input_CUST_CD").val("");
    }

    //autocomplete
    $(this).autocomplete({
        minLength: 3,
        open: function (event, ui) {
            $(this).autocomplete("widget").css({
                "width": $("#AC_CUST_Width").width()
            });
        },
        source: function (request, response) {
            var result = fnGetCustData($("#input_CUST_NM").val().toUpperCase());
            if (result != undefined) {
                result = JSON.parse(result).Cust
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
                $("#input_CUST_NM").val(ui.item.value);
                $("#input_CUST_CD").val(ui.item.code);
                fnSearchData();
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

//Focus Out 시 autoComplete가 선택이 되지 않았다면 선택하라고 밸리데이션을 보내주기
$(document).on("focusout", "#input_CUST_NM", function () {
    if ($(this).val().length != 0) {
        if (_fnToNull($("#input_CUST_CD").val()) == "") {
            $(this).val("");
            _fnAlertMsg("거래처를 선택 해 주세요.", "input_CUST_NM");
            return false;
        }
    }
});

//조회 버튼 이벤트
$(document).on("click", "#btn_Search", function () {
    fnSearchData();
});

//Tab 이동 기능 만들기
$(document).on("click", "ul[name='customer_tab'] li", function () {

    //현재 ON이 클래스가 있다면, 기능 X
    var vTabName = $(this).attr("name");  
    var vCustCD = $(this).siblings("li").eq(0).text();

    if (!$(this).hasClass("on")) {

        //초기화
        $(this).siblings("li").removeClass("on");        
        $(this).parents("ul").siblings(".tab_panel").find(".panel").hide();

        //데이터 선택 및 보여주기
        $("li[name='" + vTabName + "']").addClass("on")

        if (vTabName.replace(vCustCD, "") == "PIC") {
            fnGetPIC(vCustCD);
            $("div[name='" + vTabName + "']").show();
        }
        else if (vTabName.replace(vCustCD, "") == "HISTORY") {
            fnGetHistory(vCustCD);
            $("div[name='" + vTabName + "']").show();
        }
        else if (vTabName.replace(vCustCD, "") == "MAP") {
            $("div[name='" + vTabName + "']").show();
        }
        else if (vTabName.replace(vCustCD, "") == "RECEIVE") {
            fnGetReceive(vCustCD);
            $("div[name='" + vTabName + "']").show();
        }
    }
    
});

//거래내역 B/L 클릭 시 B/L 이동
$(document).on("click", "a[name='History_HBL_NO']", function () {
    fnGoBLPage($(this).siblings("input[type='hidden']").val());
});
////////////////////////function///////////////////////
//자동완성 초기화
function fnInitAutoComplete() {
    try {
        $("#input_CUST_NM").autocomplete({
            minLength: 1,
            source: function (request, response) {
                var result = undefined;
                if (result != undefined) {
                    result = JSON.parse(result).Country
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
            }
        });
    }
    catch (err) {
        console.log("[Error - fnInitAutoComplete]" + err.message);
    }
}

//거래처 정보 가져오는 함수
function fnGetCustData(vValue) {
    try {
        var rtnJson;
        var objJsonData = new Object();

        objJsonData.CUST = vValue;
        objJsonData.OFFICE_CD = _Office_CD;

        $.ajax({
            type: "POST",
            url: "/Customer/fnGetCust",
            async: false,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                rtnJson = result;
            }, error: function (xhr, status, error) {
                $("#ProgressBar_Loading").hide(); //프로그래스 바
                _fnAlertMsg("담당자에게 문의 하세요.");
                console.log(error);
            }
        });

        return rtnJson;
    } catch (e) {
        console.log(e.message);
    }
}

//거래처 조회 함수
function fnSearchData() {
    try {

        //단일 건 조회
        if (_fnToNull($("#input_CUST_CD").val()) == "") {
            _fnAlertMsg("거래처를 선택 해 주세요.","input_CUST_NM");
            return false;
        }

        var objJsonData = new Object();

        objJsonData.CUST_NM = _fnToNull($("#input_CUST_NM").val());
        objJsonData.CUST_CD = _fnToNull($("#input_CUST_CD").val());

        $.ajax({
            type: "POST",
            url: "/Customer/fnSearchData",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeSearchData(result);
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
        console.log("[Error - fnSearchData]" + err.message);
    }
}

//담당자 정보 데이터 가져오기
function fnGetPIC(vCUST_CD) {
    try {
        var objJsonData = new Object();

        objJsonData.CUST_CD = vCUST_CD;

        $.ajax({
            type: "POST",
            url: "/Customer/fnGetPIC",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakePIC(result, vCUST_CD);
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
        console.log("[Error - fnGetPIC]" + err.message);
    }

}

//거래내역 Tab 데이터 가져오기
function fnGetHistory(vCUST_CD) {
    try {

        var objJsonData = new Object();

        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.CUST_CD = vCUST_CD;

        $.ajax({
            type: "POST",
            url: "/Customer/fnGetHistory",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeHistory(result, vCUST_CD);
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
        console.log("[Error - fnGetHistory]" + err.message);
    }
}

//미수현황 Tab 데이터 가져오기
function fnGetReceive(vCUST_CD) {
    try {
        var objJsonData = new Object();

        objJsonData.OFFICE_CD = _Office_CD;
        objJsonData.CUST_CD = vCUST_CD;

        $.ajax({
            type: "POST",
            url: "/Customer/fnGetReceive",
            async: true,
            dataType: "json",
            data: { "vJsonData": _fnMakeJson(objJsonData) },
            success: function (result) {
                fnMakeReceive(result, vCUST_CD);
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
        console.log("[Error - fnGetReceive]" + err.message);
    }
}

//거래처 네이밍 버튼 세팅
function fnSetPlusBtn() {
    try {
        var vDataLength = $("#Customer_Result .result-box").length;

        for (i = 0; i < vDataLength; i++) {            
            if ($("#Customer_Result .result-box").eq(i).find(".result-type1").prop('scrollHeight') < 64) {
                $("#Customer_Result .result-box").eq(i).find(".result-type1").addClass('no_button');
                $("#Customer_Result .result-box").eq(i).find(".result-type1").removeClass('on');
                $("#Customer_Result .result-box").eq(i).find(".btns.plus").hide();
                $("#Customer_Result .result-box").eq(i).find(".btns.plus").removeClass("on");
            } else {
                $("#Customer_Result .result-box").eq(i).find(".result-type1").removeClass('no_button');
                $("#Customer_Result .result-box").eq(i).find(".btns.plus").show();
            }
        }

    }
    catch (err) {
        console.log("[Error - fnSetPlusBtn]" + err.message);
    }
}

//거래 내역에서 B/L 화면으로 이동 하는 함수
function fnGoBLPage(vHBL_NO) {
    try {
        var objJsonData = new Object();
        objJsonData.HBL_NO = vHBL_NO

        //History Back 세팅
        sessionStorage.setItem("BEFORE_VIEW_NAME", "Customer");
        sessionStorage.setItem("VIEW_NAME", "BL");
        sessionStorage.setItem("CUST_NM", $("#input_CUST_NM").val());
        sessionStorage.setItem("CUST_CD", $("#input_CUST_CD").val());

        controllerToLink("", "BL", objJsonData);
    }
    catch (err) {
        console.log("[Error - fnGoBLPage]" + err.message);
    }
}
/////////////////function MakeList/////////////////////
//첫 검색 데이터 뿌려주기
function fnMakeSearchData(vJsonData) {
    try {

        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
        {
            var vResult = JSON.parse(vJsonData).Cust;
            
            //for문 돌리는거 확인
            for (var i = 0; i < vResult.length;i++) {
                var vPicCount = _fnToNull(vResult[i]["ROW_COUNT"]);

                vHTML += "   <div class=\"result-box\"> ";
                vHTML += "   	<div class=\"result-title\"> ";
                vHTML += "   		<h3 class=\"result-type1\">" + _fnToNull(vResult[i]["CUST_NM"]) + "</h3> ";
                vHTML += "   		<button type=\"button\" class=\"btns plus\"></button> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"result-customer__detail\"> ";
                vHTML += "   		<div class=\"customer\"> ";
                vHTML += "   			<div class=\"cust__info\"> ";
                vHTML += "   				<div class=\"cust__title\"><p>사업자번호</p></div> ";
                vHTML += "   				<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["CRN"]) + "</p></div> ";
                vHTML += "   			</div> ";
                //vHTML += "   			<div class=\"cust__info\"> "
                //vHTML += "   				<div class=\"cust__title\"><p>거래처코드</p></div> ";
                //vHTML += "   				<div class=\"cust__desc\"><p>" + _fnToNull(vResult[i]["CUST_CD"]) + "</p></div> ";
                //vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"tab-area\"> ";
                vHTML += "   			<ul class=\"tab\" name=\"customer_tab\"> ";
                vHTML += "   				<li style=\"display:none\">" + _fnToNull(vResult[i]["CUST_CD"]) + "</li> ";
                vHTML += "   				<li class=\"on\" name=\"PIC" + _fnToNull(vResult[i]["CUST_CD"]) + "\"><div class=\"icon type1\"></div><p>담당자</p></li> ";
                vHTML += "   				<li name=\"HISTORY" + _fnToNull(vResult[i]["CUST_CD"]) + "\"><div class=\"icon type2\"></div><p>거래내역</p></li> ";
                vHTML += "   				<li name=\"MAP" + _fnToNull(vResult[i]["CUST_CD"]) + "\"><div class=\"icon type3\"></div><p>지도</p></li> ";
                vHTML += "   				<li name=\"RECEIVE" + _fnToNull(vResult[i]["CUST_CD"]) + "\"><div class=\"icon type4\"></div><p>미수현황</p></li> ";
                vHTML += "   			</ul> ";
                vHTML += "   			<div class=\"tab_panel\"> ";
                vHTML += "   				<div class=\"panel\" name=\"PIC" + _fnToNull(vResult[i]["CUST_CD"]) + "\" style=\"display:block;\"> ";

                //담당자 
                if (vPicCount == 0) {
                    vHTML += "   <div class=\"cust-panel__person no-data\"> ";
                    vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
                    vHTML += "   	<p>검색결과가 없습니다.</p> ";
                    vHTML += "   </div> ";
                }
                else {
                    for (var j = 0; j < vPicCount; j++) {
                        vHTML += "  <div class=\"cust-panel__person\"> ";
                        vHTML += "  	<div class=\"cust-panel__cont\"> ";
                        vHTML += "  		<div class=\"cust-panel__title\"><p>Attention</p></div> ";
                        vHTML += "  		<div class=\"cust-panel__desc\"><p>" + _fnToNull(vResult[(i + j)]["CUST_PIC_NM"]) + "</p></div> ";
                        vHTML += "  	</div> ";
                        vHTML += "  	<div class=\"cust-panel__cont\"> ";
                        vHTML += "  		<div class=\"cust-panel__title\"><p>Tel</p></div> ";
                        vHTML += "  		<div class=\"cust-panel__desc\"><p><a href='tel:" + _fnToNull(vResult[(i + j)]["TEL_NO"]) + "'>" + _fnToNull(vResult[i + j]["TEL_NO"]) + "</a></p></div> ";
                        vHTML += "  	</div> ";
                        vHTML += "  	<div class=\"cust-panel__cont\"> ";
                        vHTML += "  		<div class=\"cust-panel__title\"><p>E-Mail</p></div> ";
                        vHTML += "  		<div class=\"cust-panel__desc\"><p>" + _fnToNull(vResult[(i + j)]["EMAIL"]) + "</p></div> ";
                        vHTML += "  	</div> ";
                        vHTML += "  	<div class=\"cust-panel__cont\"> ";
                        vHTML += "  		<div class=\"cust-panel__title\"><p>Cellphone</p></div> ";
                        vHTML += "  		<div class=\"cust-panel__desc\"><p><a href='tel:" + _fnToNull(vResult[(i + j)]["HP_NO"]) + "'>" + _fnToNull(vResult[i + j]["HP_NO"]) + "</a></p></div> ";
                        vHTML += "  	</div> ";
                        vHTML += "  </div> ";
                    }
                }

                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"panel\" name=\"HISTORY" + _fnToNull(vResult[i]["CUST_CD"]) + "\"> ";
                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"panel px-0 py-0\" name=\"MAP" + _fnToNull(vResult[i]["CUST_CD"]) + "\"> ";

                if (_fnToNull(vResult[i]["CUST_KRNM"]) != "") {
                    vHTML += "   					<iframe width=\"100%\" height=\"100%\" style=\"border:0\" loading=\"lazy\" allowfullscreen src=\"https://www.google.com/maps/embed/v1/place?key=" + _GoogleMapKey + "&q=" + _fnToNull(vResult[i]["CUST_KRNM"]) + "&region=KR&language=ko\"></iframe> ";
                } else {
                    vHTML += "   					<iframe width=\"100%\" height=\"100%\" style=\"border:0\" loading=\"lazy\" allowfullscreen src=\"https://www.google.com/maps/embed/v1/place?key=" + _GoogleMapKey + "&q=" + _fnToNull(vResult[i]["CUST_NM"]) + "&region=KR&language=ko\"></iframe> ";
                }

                vHTML += "   				</div> ";
                vHTML += "   				<div class=\"panel\" name=\"RECEIVE" + _fnToNull(vResult[i]["CUST_CD"]) + "\"> ";
                vHTML += "   					</div> ";
                vHTML += "   				</div> ";
                vHTML += "   			</div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";

                //다음 Header로 이동
                if (vPicCount > 1) {
                    i = i + (vPicCount - 1);
                }
            }
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>검색 결과가 없습니다.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"result-box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata.png\" /> ";
            vHTML += "   	<span>관리자에게 문의 하세요.</span>	 ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeSearchData]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("#Customer_Result")[0].innerHTML = vHTML;
        fnSetPlusBtn(); //btn 세팅
    }
    catch (err) {
        console.log("[Error - fnMakeSearchData]" + err.message);
    }
}

//담당자 정보 데이터 그려주기
function fnMakePIC(vJsonData, vCustCD) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            var vResult = JSON.parse(vJsonData).PIC;

            $.each(vResult, function (i) {
                vHTML += "  <div class=\"cust-panel__person\"> ";
                vHTML += "  	<div class=\"cust-panel__cont\"> ";
                vHTML += "  		<div class=\"cust-panel__title\"><p>Attention</p></div> ";
                vHTML += "  		<div class=\"cust-panel__desc\"><p>" + _fnToNull(vResult[(i)]["CUST_PIC_NM"]) + "</p></div> ";
                vHTML += "  	</div> ";
                vHTML += "  	<div class=\"cust-panel__cont\"> ";
                vHTML += "  		<div class=\"cust-panel__title\"><p>Tel</p></div> ";
                vHTML += "  		<div class=\"cust-panel__desc\"><p><a href='tel:" + _fnToNull(vResult[(i)]["TEL_NO"]) + "'>" + _fnToNull(vResult[i]["TEL_NO"]) + "</a></p></div> ";
                vHTML += "  	</div> ";
                vHTML += "  	<div class=\"cust-panel__cont\"> ";
                vHTML += "  		<div class=\"cust-panel__title\"><p>E-Mail</p></div> ";
                vHTML += "  		<div class=\"cust-panel__desc\"><p>" + _fnToNull(vResult[(i)]["EMAIL"]) + "</p></div> ";
                vHTML += "  	</div> ";
                vHTML += "  	<div class=\"cust-panel__cont\"> ";
                vHTML += "  		<div class=\"cust-panel__title\"><p>Cellphone</p></div> ";
                vHTML += "  		<div class=\"cust-panel__desc\"><p><a href='tel:" + _fnToNull(vResult[(i)]["HP_NO"]) + "'>" + _fnToNull(vResult[i]["HP_NO"]) + "</a></p></div> ";
                vHTML += "  	</div> ";
                vHTML += "  </div> ";
            });

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"cust-panel__person no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>검색결과가 없습니다.</p> ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakePIC]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"cust-panel__person no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>관리자에게 문의하세요.</p> ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakePIC]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("div[name='PIC" + vCustCD + "']")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeHistory]" + err.message);
    }
}

//거래 내역 정보 데이터 그려주기
function fnMakeHistory(vJsonData,vCustCD) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            var vResult = JSON.parse(vJsonData).History;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"transaction-panel__box\"> ";
                vHTML += "   	<div class=\"transaction-panel-bl\"> ";
                vHTML += "   		<div class=\"transaction-panel-bl__title\"><p>B/L No</p></div> ";
                vHTML += "   		<div class=\"transaction-panel-bl__desc\"> ";
                vHTML += "   		    <a href=\"javascript:void(0)\" name=\"History_HBL_NO\"> ";
                vHTML += _fnToNull(vResult[i]["HBL_NO"]);
                vHTML += "   		    </a> ";
                vHTML += "          <input type=\"hidden\" value=\"" + _fnToNull(vResult[i]["HBL_NO"])+"\" />";
                vHTML += "   		</div> ";                
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"transaction-panel-dtl\"> ";
                vHTML += "   		<div class=\"transaction-panel-dtl__cont\"> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__title\"><p>해운/항공</p></div> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__desc\"><p>" + _fnToNull(vResult[i]["REQ_SVC"]) + "</p></div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"transaction-panel-dtl__cont\"> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__title\"><p>계산서일자</p></div> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__desc\"><p>" + _fnFormatDate(_fnToNull(vResult[i]["TAX_BILL_YMD"])) + "</p></div> ";
                vHTML += "   		</div> ";
                vHTML += "   		<div class=\"transaction-panel-dtl__cont\"> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__title\"><p>지역</p></div> ";
                vHTML += "   			<div class=\"transaction-panel-dtl__desc\"><p>" + _fnToNull(vResult[i]["POD_NM"]) + "</p></div> ";
                vHTML += "   		</div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            });
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"transaction-panel__box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>검색결과가 없습니다.</p> ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeHistory()]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"transaction-panel__box no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>관리자에게 문의하세요.</p> ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeHistory()]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("div[name='HISTORY" + vCustCD + "']")[0].innerHTML = vHTML;

    }
    catch (err) {
        console.log("[Error - fnMakeHistory]" + err.message);
    }
}

//미수현황 데이터 그려주기
function fnMakeReceive(vJsonData, vCustCD) {
    try {
        var vHTML = "";

        if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {

            var vResult = JSON.parse(vJsonData).Receive;

            $.each(vResult, function (i) {
                vHTML += "   <div class=\"attempted-sum\"> ";
                vHTML += "   	<div class=\"attempted-sum__title\"><p>미수현황 누계</p></div> ";
                vHTML += "   	<div class=\"attempted-sum__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["TOT_MONTH"])) + "</p></div> ";
                vHTML += "   </div> ";
                vHTML += "   <div class=\"attempted-panel\"> ";
                vHTML += "   	<div class=\"attempted-panel__cont\"> ";
                vHTML += "   		<div class=\"attempted-panel__title\"><p>3개월 이하</p></div> ";
                vHTML += "   		<div class=\"attempted-panel__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["MONTH3"])) + "</p></div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"attempted-panel__cont\"> ";
                vHTML += "   		<div class=\"attempted-panel__title\"><p>3~6개월</p></div> ";
                vHTML += "   		<div class=\"attempted-panel__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["MONTH6"])) + "</p></div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"attempted-panel__cont\"> ";
                vHTML += "   		<div class=\"attempted-panel__title\"><p>6~9개월</p></div> ";
                vHTML += "   		<div class=\"attempted-panel__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["MONTH9"])) + "</p></div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"attempted-panel__cont\"> ";
                vHTML += "   		<div class=\"attempted-panel__title\"><p>9~12개월</p></div> ";
                vHTML += "   		<div class=\"attempted-panel__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["MONTH12"])) + "</p></div> ";
                vHTML += "   	</div> ";
                vHTML += "   	<div class=\"attempted-panel__cont\"> ";
                vHTML += "   		<div class=\"attempted-panel__title\"><p>1년 이상</p></div> ";
                vHTML += "   		<div class=\"attempted-panel__desc\"><p>" + fnSetComma(_fnToZero(vResult[i]["OVER12"])) + "</p></div> ";
                vHTML += "   	</div> ";
                vHTML += "   </div> ";
            });

        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
            vHTML += "   <div class=\"attempted-panel__cont no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>검색결과가 없습니다.</p> ";
            vHTML += "   </div> ";
            console.log("[Fail - fnMakeReceive()]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }
        else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E") {
            vHTML += "   <div class=\"attempted-panel__cont no-data\"> ";
            vHTML += "   	<img src=\"/Images/Common/icn_nodata2.png\" /> ";
            vHTML += "   	<p>관리자에게 문의하세요.</p> ";
            vHTML += "   </div> ";
            console.log("[Error - fnMakeReceive()]" + JSON.parse(vJsonData).Result[0]["trxMsg"]);
        }

        $("div[name='RECEIVE" + vCustCD + "']")[0].innerHTML = vHTML;
    }
    catch (err) {
        console.log("[Error - fnMakeHistory]" + err.message);
    }
}

////////////////////////API////////////////////////////
