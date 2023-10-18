$(function(){
	$(".re_page").each(function( index ) {
		$(this).parent("a").addClass('page');
		$(this).parent("a").addClass($(this).data('val'));
	});
});


//datepicker
// 추가
// 기본형 if(check_msg('id','msg','required') == false) return false;
function check_msg(element_id,msg,patton){	
	var array_is = /[,]/;
	var val_is;
	var element_id1 = false;
	var element_id2 = false;

	if(array_is.test(element_id) == true ){
		element = element_id.split(",");
		if(element[0]) element_id = element[0];
		if(element[1]) element_id1 = element[1];
		if(element[2]) element_id2 = element[2];
	}
	
	if($('#'+element_id).val() == '') val_is = false;
	else val_is = true;

	//var re_id = /^[a-z0-9_-]{3,16}$/;												// 아이디 검사식
	var re_pw = /^[a-z0-9_-]{4,18}$/;												// 비밀번호 검사식
	var re_mail = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/;						// 이메일 검사식
	var re_url = /^(https?:\/\/)?([a-z\d\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;	// URL 검사식
	var re_tel = /^[0-9]{8,11}$/;													// 전화번호 검사식
	var re_jumin = /^\d{6}[1234]\d{6}$/;											// 주민번호
	var re_num = /^[0-9]{1,}/;														// 숫자만 alphabet
	var re_alpha = /^[a-z_-]{1,}$/;													// 영문만 alphabet
		
	if(patton != undefined ){
		var patton_arr = patton.split(":");
		for (i=0; i < patton_arr.length; i++){
			
			if(patton_arr[i] == 'required'){
				if(val_is == false){
					alert(msg + ' 항목을 입력해 주세요.'); 
					//alert(msg); 
					$('#'+element_id).focus(); 
					return false;
				}
			}
			
			if(patton_arr[i] == 'password' && val_is == true){
				var pw_error = false;
				var error_msg = '';
				if($('#password').val().length < 3 || $('#password').val().length > 20){
					error_msg = '패스워드가 4자 이상 이어야 합니다.';
					pw_error = true;					
	            }
//                else if($('#password').val() != $('#re_password').val()){
//					error_msg = "패스워드가 일치하지 않습니다.\n다시 확인해서 입력해 주세요.";
//					pw_error = true;
//				}

				if(pw_error == true){
					alert(error_msg);
					$('#password').val('');
					//$('#passwd_re').val('');
					$('#password').focus();
					return false;
				}
			}
			
			if(patton_arr[i] == 'email'){
				if(element_id1){
					var $email = $('#'+element_id);
					var $email1 = $('#'+element_id1);
					if($email.val() !=''){
						var $email_val = $email.val() + '@'+ $email1.val();
						
						if(re_mail.test($email_val) != true){
							alert('이메일 형식이 틀렸습니다. 다시 입력해 주세요.'); 
							
							$email.val('');
							$email1.val('');
							$email.focus();

							return false;
						}
					}
				}else{
					var $email = $('#'+element_id);

					if(re_mail.test($email.val()) != true){
						alert('이메일 형식이 틀렸습니다. 다시 입력해 주세요.'); 

						$email.val('');
						$email.focus();

						return false;
					}
				}

			}
			
			if(patton_arr[i] == 'select'){
				var $selects = $('select[name='+element_id+']');
				if($selects.val() == ''){
					alert(msg + ' 항목을 입력해 주세요.'); 
					$selects[0].focus(); 
					return false;
				}
			}

			if(patton_arr[i] == 'radio'){
				var $radios = $('input:radio[name='+element_id+']');
				if(!$radios.is(":checked")){
					alert(msg + ' 항목을 입력해 주세요.'); 
					$radios[0].focus(); 
					return false;
				}
			}

			if(patton_arr[i] == 'checkbox'){
				var $checkClass = $('.'+element_id);
				if(!$checkClass.is(":checked")){
					if(msg == '') alert('선택된 항목이 없습니다.');
					else alert(msg);

					$checkClass[0].focus(); 

					return false;
				}
				
			}


			if(patton_arr[i] == 'agree1'){
				if(!($("#agree1").is(":checked"))){ 
					alert(msg); 
					$("#agree1").focus(); 
					return false;
				}
			}

			if(patton_arr[i] == 'agree2'){
				if(!($("#agree2").is(":checked"))){ 
					alert(msg); 
					$("#agree2").focus(); 
					return false;
				}
			}
			
			if(patton_arr[i] == 'alphabet' && val_is == true){
				if(re_alpha.test($('#'+element_id).val()) != true){
					alert('영문과 하이폰만 입력 가능합니다.');
					$('#'+element_id).focus();
					return false;
				}
			}
			
			if(patton_arr[i] == 'number' && val_is == true){
				if(re_num.test($('#'+element_id).val()) != true){
					alert('숫자만 입력 하시기 바랍니다.');
					$('#'+element_id).focus();
					$('#'+element_id).val('');
					return false;
				}
			}

			if(patton_arr[i] == 'homepage' && val_is == true){
				if(re_url.test($('#'+element_id).val()) != true){
					alert('홈페이지 주소를 바르게 입력해 주세요.');
					
					$('#'+element_id).focus();
					return false;
				}
			}

			if(patton_arr[i] == 'jumin' && val_is == true){
				$jumin = $('#register_no1').val()+$('#register_no2').val();
				
				if(re_jumin.test($jumin) != true){

					alert('주민번호 형식이 틀렸습니다. 다시 입력해 주세요.'); 
					$('#register_no1').val('');
					$('#register_no2').val('');
					$('#register_no1').focus();

					return false;
				}

			}
			
		}
	}
}

(function($){	
	$.extend($.fn, {
		ajaxUpfileDel : function($selector,$target,$attr,$depth){
			
			$(document).on('click',$selector, function(e){
				e.preventDefault();	
				var $str = '';
				$depth_parent = jQuery(this).parents($depth);
				$this_no = $depth_parent.attr($attr);
				$depth_parent.remove();				
				$str = $($target).val();
				$str = $str.replace($this_no, '');
				$($target).val($str);

			});
			
		}
	});

	$.extend($.fn, {
		btnSelect : function(_selector,base_class,apply_class,value,submit){
			$(document).on('click',_selector, function(e){
				e.preventDefault();	
				var self =$(this);
				
				$(_selector).each(function(i){
					if( $(this).hasClass(apply_class) ){
						$(this).removeClass(apply_class).addClass(base_class);
					}
				});
				
				self.removeClass(base_class).addClass(apply_class);
				if(value){
					$(value).val(self.data("val"));
				}
				
				if(submit){
					$(submit).trigger('click');
				}
			
			});
			
		}
	});


	$.extend($.fn, {
		btnCheck : function(_selector,base_class,apply_class,value,submit){
			$(document).on('click',_selector, function(e){
				e.preventDefault();	
				var self =$(this);
				
				if(self.hasClass(apply_class) ){
					self.removeClass(apply_class).addClass(base_class);
					$(value).val('');
				}else{
					self.removeClass(base_class).addClass(apply_class);
					$(value).val(self.data("val"));
				}
				
				if(submit){
					$(submit).trigger('click');
				}

			});
			
		}
	});

	$.extend($.fn, {
		stepCheck : function(_selector){
			$(document).on('click',_selector, function(e){
				var $span  = $(this).find("span");
				
				if($span.data("val") == 10) $html = '<span data-val="0" ><i class="fa fa-circle-thin" aria-hidden="true"></i><span>';
				else $html = '<span data-val="10" ><i class="fa fa-circle" aria-hidden="true"></i><span>';
				
				alert($span.data("val"));
				
				$(this).html($html);
			});
		}
	});
	
})(jQuery);