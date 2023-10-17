////////////////////전역 변수//////////////////////////

////////////////////jquery event///////////////////////
//$(function () {

//});

//이메일 클릭 시
$(document).on('change', '#select_EmailName', function () {
	$('#input_email02').val($(this).val());
});

//버튼 클릭 시 조회
$(document).on('click', '#btn_EmailSend', function () {
	fnSendMail();
});

//엔터키 이벤트
$(document).keyup(function (e) {
	if (e.keyCode == 13) {
		var vIndex = $(e.target).attr('data-index');
		$('[data-index="' + (parseFloat(vIndex) + 1).toString() + '"]').focus();
	}
});

////////////////////////function///////////////////////
//이메일 전송
function fnSendMail() {
	//alert("준비중 입니다.");

	try {
		if (fnvalidation()) {
			var objJsonData = new Object();

			objJsonData.fst_EndAddr = $('#input_email01').val() + '@' + $('#input_email02').val();
			objJsonData.mail_title = $('#input_title').val();
			objJsonData.mail_Content = $('#textarea_content').val().replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

			$.ajax({
				type: 'POST',
				url: '/community/SendEmail',
				async: true,
				dataType: 'json',
				//data: { "mailCon": _fnMakeJson(objJsonData) },
				data: objJsonData,
				success: function (result) {
					if (result != 'Y') {
						alert('메일 전송이 실패하였습니다. \n 관리자에게 문의 하세요.');
						console.log(result);
					} else if (result == 'Y') {
						alert('메일이 전송 되었습니다.');
						fnDataInit();
					}
				},
				error: function (xhr) {
					console.log(xhr);
					$('#ProgressBar_Loading').hide();
				},
				beforeSend: function () {
					$('#ProgressBar_Loading').show(); //프로그래스 바
				},
				complete: function () {
					$('#ProgressBar_Loading').hide(); //프로그래스 바
				},
			});
		}
	} catch (e) {
		console.log(e.message);
	}
}

//벨리데이션 체크
function fnvalidation() {
	if (_fnToNull($('#input_email01').val()) == '') {
		alert('이메일을 입력 해 주세요.');
		$('#input_email01').focus();
		return false;
	}

	if (_fnToNull($('#input_email02').val()) == '') {
		alert('이메일을 입력 해 주세요.');
		$('#input_email02').focus();
		return false;
	}

	if (_fnToNull($('#input_title').val()) == '') {
		alert('제목을 입력 해 주세요.');
		$('#input_title').focus();
		return false;
	}

	if (_fnToNull($('#textarea_content').val()) == '') {
		alert('내용을 입력 해 주세요.');
		$('#textarea_content').focus();
		return false;
	}

	return true;
}

/////////////////function MakeList/////////////////////
function fnMakeMailContent() {
	var vHTML = '';

	vHTML += '<br><span>제목 : ' + $('#input_title').val() + '</span>';
	vHTML += '<br><span></span>';
	vHTML += '<br><span>내용 : ' + $('#textarea_content').val() + '</span>';

	return vHTML;
}

function fnDataInit() {
	$('#input_email01').val('');
	$('#input_email02').val('');
	$('#input_title').val('');
	$('#textarea_content').val('');
	$('select_EmailName').val('');
}

////////////////////////API////////////////////////////
