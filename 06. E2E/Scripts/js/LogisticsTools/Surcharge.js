////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
$(function () {
	fnSetSurchargePort(); //PORT 정보 가져오기
	//fnSetSurchargeCountry("O"); //국가옵션 최초 데이터 가져오기
});

//선사 / 훼리 Select 이벤트
$(document).on("click", "input[name='Surcharge_shippingType']", function () {

    if ($(this).attr("id") == "unit_shipping")
    {
		$("[name='select_CountryList']").show();
		$(".surcharge_list").removeClass("wd33"); //국가 옵션 show / hide 떄문에 넣음
		fninitShipper(); //선사 초기화 함수	
		fnInitResult();
    }
    else if ($(this).attr("id") == "unit_ferry")
    {
		$("[name='select_CountryList']").hide();
		$(".surcharge_list").addClass("wd33"); //국가 옵션 show / hide 떄문에 넣음
		fninitFerry(); //훼리 초기화 함수
		fnInitResult();
    }

	fnSetSurchargePort();
});

//BOUND 선틱 시 - 검색 이벤트
$(document).on("change", "select[name='select_Surcharge_Bound']", function () {
	fnSetSurchargeCountry($(this).find("option:selected").val());
	//$("select[name='select_Surcharge_Bound']").val($(this).find("option:selected").val()).prop("selected", true);
	//
	////선사 클릭
	//if ($("input[name='Surcharge_shippingType']:checked").attr("id") == "unit_shipping") {
	//	fnSetSurchargeCountry($(this).find("option:selected").val());
	//}
});

//PORT 정보 선택 시 - 검색 이벤트
$(document).on("change", "select[name='select_surcharge_port']", function () {
	$("select[name='select_surcharge_port']").val($(this).find("option:selected").val()).prop("selected", true);	
});

////컨테이너 타입 선택 시 - 검색 이벤트
$(document).on("change", "select[name='select_Surcharge_CntrType']", function () {
	$("select[name='select_Surcharge_CntrType']").val($(this).find("option:selected").val()).prop("selected", true);
});

////국가 옵션 선택 시 - 검색 이벤트
$(document).on("change", "select[name='select_CountryList']", function () {
	$("select[name='select_CountryList']").val($(this).find("option:selected").val()).prop("selected", true);
});

//검색 버튼 클릭 이벤트
$(document).on("click", "#btn_surcharge_Search", function () {
	fnSurchargeSearch();
});


/////////////////////function//////////////////////////
//선사 탭 초기화 함수
function fninitShipper() {
	$("select[name='select_Surcharge_Bound']").eq(0).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_Bound']").eq(1).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_CntrType']").eq(0).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_CntrType']").eq(1).find("option").eq(0).prop("selected", true);	
	fnSetSurchargePort();
	fnSetSurchargeCountry("");
	$("#input_ER").val("1100");
}

//훼리 탭 초기화 함수
function fninitFerry() {
	$("select[name='select_Surcharge_Bound']").eq(0).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_Bound']").eq(1).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_CntrType']").eq(0).find("option").eq(0).prop("selected", true);
	$("select[name='select_Surcharge_CntrType']").eq(1).find("option").eq(0).prop("selected", true);		
	fnSetSurchargePort();
	$("#input_ER").val("1100");
}

//포트 데이터 가져오기
function fnSetSurchargePort() {

	var objJsonData = new Object();

	objJsonData.PORT_TYPE = "S";

	$.ajax({
		type: "POST",
		url: "/LogisticsTools/fnSetSurchargePort",
		async: true,
		cache: false,
		dataType: "Json",
		data: { "vJsonData": _fnMakeJson(objJsonData) },
		success: function (result) {
			fnMakeSetSurchargePort(result);
		}, error: function (xhr) {
			alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
			console.log(xhr);
		}
	});
}

//국가 옵션 가지고 오기 (수출,수입)
function fnSetSurchargeCountry(vValue) {
	try {
		var objJsonData = new Object();

		objJsonData.BOUND = vValue;

		$.ajax({
			type: "POST",
			url: "/LogisticsTools/fnSetSurchargeCountry",
			async: true,
			cache: false,
			dataType: "Json",
			data: { "vJsonData": _fnMakeJson(objJsonData) },
			success: function (result) {
				fnMakeSetSurchargeCountry(result);
			}, error: function (xhr) {
				alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
				console.log(xhr);
			}
		});

	} catch (err) {
		console.log("[fnSetSurchargeCountry]"+err);
    }
}

//부대비용 - 검색
function fnSurchargeSearch() {

	try {
		var objJsonData = new Object();

		if (SurchargeValidation()) {
			objJsonData.PORT_TYPE = "S";
			objJsonData.COUNTRY_OPTION = $("select[name='select_CountryList']").eq(0).find("option:selected").val(); //국가옵션 체크
			objJsonData.BOUND = $("select[name='select_Surcharge_Bound']").eq(0).find("option:selected").val();
			objJsonData.PORT = $("select[name='select_surcharge_port']").eq(0).find("option:selected").val(); //PORT
			objJsonData.CNTR_TYPE = $("select[name='select_Surcharge_CntrType']").eq(0).find("option:selected").val(); // 컨테이너 타입						

			$.ajax({
				type: "POST",
				url: "/LogisticsTools/fnSearchSurcharge",
				async: true,
				cache: false,
				dataType: "Json",
				data: { "vJsonData": _fnMakeJson(objJsonData) },
				success: function (result) {
					fnMakeSurchargeData(result);
					//alert(result);
					//fnMakeSetSurchargePort(result);
				}, error: function (xhr) {
					$("#ProgressBar_Loading").hide(); //프로그래스 바 
					alert("시스템 사정으로 요청하신 작업을 처리할 수 없습니다.");
					console.log(xhr);
				}, beforeSend: function () {
					$("#ProgressBar_Loading").show(); //프로그래스 바 

				},
				complete: function () {
					$("#ProgressBar_Loading").hide(); //프로그래스 바 
				}
			});
        }
	} catch (err) {
		console.log("[fnSurchargeSearch]"+err);
    }
}

//부대비용 화폐 계산 (화폐 계산)
function fnCal_Currecy(vValue) {

	var vTotal = 0;
	var vER = $("#input_ER").val(); //환율 - exchange rate

	vTotal = vValue * vER;

	return vTotal;	
}

//부대비용 벨리데이션 체크
function SurchargeValidation() {	

	//BOUND 검색 선택 안할 경우 검색 하지 못하게
	if ($("select[name='select_Surcharge_Bound']").find("option:selected").val() == "") {
		_fnAlertMsg("BOUND를 먼저 선택 해 주세요.");
		return false;
	}

	//PORT 검색 선택 안할 경우 검색 하지 못하게
	if ($("select[name='select_surcharge_port']").find("option:selected").val() == "") {
		_fnAlertMsg("PORT를 먼저 선택 해 주세요.");
		return false;
	}

	//컨테이너 타입 선택 안할 경우 검색 하지 못하게
	if ($("select[name='select_Surcharge_CntrType']").find("option:selected").val() == "") {
		_fnAlertMsg("컨테이너 타입을 먼저 선택 해 주세요.");
		return false;
	}

	return true; 
}

/////////////////function MakeList/////////////////////
//선사 / 훼리 
function fnInitResult() {
	$("#surcharge_result_Area").empty();

	var vHTML = "";

	vHTML +="   <div class=\"surcharge_result\"> ";
	vHTML +="   	<table class=\"list_type1 tools\"> ";
	vHTML +="   		<colgroup> ";
	vHTML +="   			<col /> ";
	vHTML +="   			<col class=\"w3\" /> ";
	vHTML +="   			<col class=\"w3\" /> ";
	vHTML +="   			<col class=\"w3\" /> ";
	vHTML +="   			<col class=\"w3\" /> ";
	vHTML +="   			<col class=\"w3\" /> ";
	vHTML +="   		</colgroup> ";
	vHTML +="   		<thead> ";
	vHTML +="   			<tr> ";
	vHTML +="   				<th>내역</th> ";
	vHTML +="   				<th>코드</th> ";
	vHTML +="   				<th>단위</th> ";
	vHTML +="   				<th>화폐</th> ";
	vHTML +="   				<th>단가</th> ";
	vHTML +="   				<th>원화</th> ";
	vHTML +="   			</tr> ";
	vHTML +="   		</thead> ";
	vHTML +="   		<tbody> ";
	vHTML +="   		</tbody> ";
	vHTML +="   	</table> ";
	vHTML +="   	<div class=\"no_data\"> ";
	vHTML +="   		<span>부대비용 자동 계산을 위해 <strong>검색조건을 선택해주세요.</strong></span> ";
	vHTML +="   	</div> ";
	vHTML +="   </div> ";

	$("#surcharge_result_Area")[0].innerHTML = vHTML;
}

//포트 정보 Select 데이터 그려주기
function fnMakeSetSurchargePort(vJsonData) {
	var vHTML = "";
	var vResult = "";

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
	{
		vResult = JSON.parse(vJsonData).Table1;

		if ($("input[name='Surcharge_shippingType']:checked").attr("id") == "unit_shipping") {
			vHTML += "<option value=\"\">PORT</option>";
		}
		else if ($("input[name='Surcharge_shippingType']:checked").attr("id") == "unit_ferry") {
			vHTML += "<option value=\"\">CARR</option>";
		}

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["PORT"]) + "\">" + _fnToNull(vResult[i]["PORT"]) + "</option>";
		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
	{
		//데이터가 없습니다.
		vHTML += "<option value=\"\">PORT</option>";
	}

	$("select[name='select_surcharge_port'")[0].innerHTML = vHTML;
	//$("select[name='select_surcharge_port'")[1].innerHTML = vHTML;
}

//국가 옵션 Select 데이터 그려주기
function fnMakeSetSurchargeCountry(vJsonData) {
	var vHTML = "";
	var vResult = "";

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y") {
		vResult = JSON.parse(vJsonData).Table1;		

		$.each(vResult, function (i) {
			vHTML += "<option value=\"" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "\">" + _fnToNull(vResult[i]["COUNTRY_OPTION"]) + "</option>";
		});

	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N") {
		//데이터가 없습니다.
		vHTML += "<option value=\"\">국가 옵션</option>";
	}

	$("select[name='select_CountryList']")[0].innerHTML = vHTML;
	//$("select[name='select_CountryList']")[1].innerHTML = vHTML;
}

//부대비용 데이터 그려주기
function fnMakeSurchargeData(vJsonData) {
	var vHTML = "";
	var vTotalPrice = 0; //전체 금액 설정	

	if (JSON.parse(vJsonData).Result[0]["trxCode"] == "Y")
	{
		var vCntrList = JSON.parse(vJsonData).CntrList;
		var vResult = JSON.parse(vJsonData).SurchargeData;

		$.each(vCntrList, function (i) {

			vTotalPrice = 0;

			vHTML += "   <div class=\"surcharge_result\"> ";
			vHTML += "   	<h1 class=\"table_title\">" + _fnToNull(vCntrList[i]["CNTR_SIZE"])+"</h1> ";
			vHTML += "   	<table class=\"list_type1 tools\"> ";
			vHTML += "   		<colgroup> ";
			vHTML += "   			<col /> ";
			vHTML += "   			<col class=\"w3\" /> ";
			vHTML += "   			<col class=\"w3\" /> ";
			vHTML += "   			<col class=\"w3\" /> ";
			vHTML += "   			<col class=\"w3\" /> ";
			vHTML += "   			<col class=\"w3\" /> ";
			vHTML += "   		</colgroup> ";
			vHTML += "   		<thead> ";
			vHTML += "   			<tr> ";
			vHTML += "   				<th>내역</th> ";
			vHTML += "   				<th>코드</th> ";
			vHTML += "   				<th>단위</th> ";
			vHTML += "   				<th>화폐</th> ";
			vHTML += "   				<th>단가</th> ";
			vHTML += "   				<th>원화</th> ";
			vHTML += "   			</tr> ";
			vHTML += "   		</thead> ";
			vHTML += "   		<tbody> ";

			$.each(vResult, function (j) {

				if (_fnToNull(vCntrList[i]["CNTR_SIZE"]) == _fnToNull(vResult[j]["CNTR_SIZE"])) {
					vHTML += "   			<tr> ";
					vHTML += "   				<td>" + _fnToNull(vResult[j]["CONTENTS"]) + "</td> ";
					vHTML += "   				<td>" + _fnToNull(vResult[j]["CODE"]) + "</td> ";
					vHTML += "   				<td>" + _fnToNull(vResult[j]["UNIT"]) + "</td> ";
					vHTML += "   				<td>" + _fnToNull(vResult[j]["CURRENCY"]) + "</td> ";
					vHTML += "   				<td>" + fnSetComma(_fnToNull(vResult[j]["PRICE"])) + "</td> ";

					//환율 계산
					if (_fnToNull(vResult[j]["CURRENCY"]) == "USD") {
						vHTML += "   	<td>" + fnSetComma(fnCal_Currecy(_fnToNull(vResult[j]["PRICE"]))) + "</td> ";
						vTotalPrice += Number(fnCal_Currecy(_fnToNull(vResult[j]["PRICE"])));
					}
					else {
						vHTML += "   	<td>" + fnSetComma(_fnToNull(vResult[j]["PRICE"])) + "</td> ";
						vTotalPrice += Number(_fnToNull(vResult[j]["PRICE"]));
					}

					vHTML += "   				<td class=\"mobile_layout\" colspan=\"6\"> ";
					vHTML += "   					<div class=\"layout_type2\"> ";
					vHTML += "   						<div class=\"row s1\"> ";
					vHTML += "   							<span>" + _fnToNull(vResult[j]["CONTENTS"]) + "</span></span> ";
					vHTML += "   						</div> ";
					vHTML += "   						<div class=\"row s3\"> ";
					vHTML += "   							<table> ";
					vHTML += "   								<tbody> ";
					vHTML += "   									<tr> ";
					vHTML += "   										<th>코드</th> ";
					vHTML += "   										<th>단위</th> ";
					vHTML += "   										<th>화폐</th> ";
					vHTML += "   									</tr> ";
					vHTML += "   									<tr class=\"has_border_bt\"> ";
					vHTML += "   										<td>" + _fnToNull(vResult[j]["CODE"]) + "</td> ";
					vHTML += "   										<td>" + _fnToNull(vResult[j]["UNIT"]) + "</td> ";
					vHTML += "   										<td>" + _fnToNull(vResult[j]["CURRENCY"]) + "</td> ";
					vHTML += "   									</tr> ";
					vHTML += "   									<tr> ";
					vHTML += "   										<th>단가</th> ";
					vHTML += "   										<th>원화</th> ";
					vHTML += "   									</tr> ";
					vHTML += "   									<tr> ";
					vHTML += "   										<td>" + fnSetComma(_fnToNull(vResult[j]["PRICE"])) + "</td> ";

					if (_fnToNull(vResult[j]["CURRENCY"]) == "USD") {
						vHTML += "   	<td>" + fnSetComma(fnCal_Currecy(_fnToNull(vResult[j]["PRICE"]))) + "</td> ";
					}
					else {
						vHTML += "   	<td>" + fnSetComma(_fnToNull(vResult[j]["PRICE"])) + "</td> ";
					}

					vHTML += "   									</tr> ";
					vHTML += "   								</tbody> ";
					vHTML += "   							</table> ";
					vHTML += "   						</div> ";
					vHTML += "   					</div> ";
					vHTML += "   				</td> ";
					vHTML += "   			</tr> ";
                }
				
			});

			vHTML += "   			<tr> ";
			vHTML += "   				<td colspan=\"5\" class=\"no_border pc\"></td> ";
			vHTML += "   				<td class=\"surcharge_sum pc\">" + fnSetComma(vTotalPrice) +" 원</td> ";
			vHTML += "   				<td colspan=\"4\" class=\"no_border mo\"></td> ";
			vHTML += "   				<td colspan=\"2\" class=\"surcharge_sum mo\">" + fnSetComma(vTotalPrice) +" 원</td> ";
			vHTML += "   			</tr> ";

			vHTML += "   		</tbody> ";
			vHTML += "   	</table> ";
			vHTML += "   </div> ";

		});
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "N")
	{

		vHTML +="   <div class=\"surcharge_result\"> ";
		vHTML +="   	<table class=\"list_type1 tools\"> ";
		vHTML +="   		<colgroup> ";
		vHTML +="   			<col /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   		</colgroup> ";
		vHTML +="   		<thead> ";
		vHTML +="   			<tr> ";
		vHTML +="   				<th>내역</th> ";
		vHTML +="   				<th>코드</th> ";
		vHTML +="   				<th>단위</th> ";
		vHTML +="   				<th>화폐</th> ";
		vHTML +="   				<th>단가</th> ";
		vHTML +="   				<th>원화</th> ";
		vHTML +="   			</tr> ";
		vHTML +="   		</thead> ";
		vHTML +="   		<tbody> ";
		vHTML +="   		</tbody> ";
		vHTML +="   	</table> ";
		vHTML +="   	<div class=\"no_data\"> ";
		vHTML +="   		<span><strong>데이터가 없습니다.</strong></span> ";
		vHTML +="   	</div> ";
		vHTML +="   </div> ";
	}
	else if (JSON.parse(vJsonData).Result[0]["trxCode"] == "E")
	{
		vHTML +="   <div class=\"surcharge_result\"> ";
		vHTML +="   	<table class=\"list_type1 tools\"> ";
		vHTML +="   		<colgroup> ";
		vHTML +="   			<col /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   			<col class=\"w3\" /> ";
		vHTML +="   		</colgroup> ";
		vHTML +="   		<thead> ";
		vHTML +="   			<tr> ";
		vHTML +="   				<th>내역</th> ";
		vHTML +="   				<th>코드</th> ";
		vHTML +="   				<th>단위</th> ";
		vHTML +="   				<th>화폐</th> ";
		vHTML +="   				<th>단가</th> ";
		vHTML +="   				<th>원화</th> ";
		vHTML +="   			</tr> ";
		vHTML +="   		</thead> ";
		vHTML +="   		<tbody> ";
		vHTML +="   		</tbody> ";
		vHTML +="   	</table> ";
		vHTML +="   	<div class=\"no_data\"> ";
		vHTML +="   		<span><strong>데이터가 없습니다.</strong></span> ";
		vHTML +="   	</div> ";
		vHTML +="   </div> ";
	}

	$("#surcharge_result_Area")[0].innerHTML = vHTML;
}

//벨리데이션 실패 결과 데이터 그리기
//function fnMakeValiData(){

//	$("#surcharge_result_Area").empty();

//	var vHTML = "";

//	vHTML +="   <div class=\"surcharge_result\"> ";
//	vHTML +="   	<table class=\"list_type1 tools\"> ";
//	vHTML +="   		<colgroup> ";
//	vHTML +="   			<col /> ";
//	vHTML +="   			<col class=\"w3\" /> ";
//	vHTML +="   			<col class=\"w3\" /> ";
//	vHTML +="   			<col class=\"w3\" /> ";
//	vHTML +="   			<col class=\"w3\" /> ";
//	vHTML +="   			<col class=\"w3\" /> ";
//	vHTML +="   		</colgroup> ";
//	vHTML +="   		<thead> ";
//	vHTML +="   			<tr> ";
//	vHTML +="   				<th>내역</th> ";
//	vHTML +="   				<th>코드</th> ";
//	vHTML +="   				<th>단위</th> ";
//	vHTML +="   				<th>화폐</th> ";
//	vHTML +="   				<th>단가</th> ";
//	vHTML +="   				<th>원화</th> ";
//	vHTML +="   			</tr> ";
//	vHTML +="   		</thead> ";
//	vHTML +="   		<tbody> ";
//	vHTML +="   		</tbody> ";
//	vHTML +="   	</table> ";
//	vHTML +="   	<div class=\"no_data\"> ";
//	vHTML +="   		<span>부대비용 자동 계산을 위해 <strong>PORT를 먼저 선택하세요.</strong></span> ";
//	vHTML +="   	</div> ";
//	vHTML +="   </div> ";	

//	$("#surcharge_result_Area")[0].innerHTML = vHTML;
//}
////////////////////////API////////////////////////////

