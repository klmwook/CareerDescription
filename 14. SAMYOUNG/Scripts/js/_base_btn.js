//기본버튼 설정
$(function(){	
	
	if (typeof _url_base == 'undefined') _url_base = '';

	//검색 재설정

	if (typeof _lists != 'undefined'){
		$("._reset").on('click',function(){

			if(typeof _query != 'undefined') location.href = _lists;
			else location.href = _lists + '/page/1';
			
			return false;	
		});
	}


	//리스트
	if (typeof _lists != 'undefined'){
		$("._btn_list").on('click',function(e){		
			e.preventDefault();
			
			if(typeof _query != 'undefined') location.href = _lists + _query +_url_base;
			else location.href = _lists +_url_base;
			
			return false;		
		});
	}

	//글보기
	if (typeof _view != 'undefined'){
		$("._btn_view").on('click',function(e){	
			e.preventDefault();
			
			if(typeof _query != 'undefined') location.href = _view + _query +_url_base+ '&id='+$(this).data("val");
			else location.href = _view +_url_base+'/id/'+$(this).data("val");
			
			return false;
		});
	}

	//글수정
	if (typeof _edit != 'undefined'){
		$("._btn_edit").on('click',function(e){	
			e.preventDefault();
			
			if (typeof _query != 'undefined') location.href = _edit + _query +_url_base+'&id='+$(this).data("val");
			else location.href = _edit +_url_base+'/id/'+$(this).data("val");
			
			return false;		
		});
	}

	//글등록
	if (typeof _write != 'undefined'){
		$("._btn_write").on('click',function(e){
			e.preventDefault();

			if (typeof _query != 'undefined') location.href = _write + _query +_url_base;
			else location.href =  _write + _url_base;
			
			return false;	
		});
	}

	//글삭제
	if (typeof _del != 'undefined'){
		$("._btn_del").on('click',function(e){	
			e.preventDefault();

			if (confirm('정말로 삭제하시겠습니까?')){
				//if($("#_url_base").val()) _url_base = _url_base + $("#_url_base").val();
				
				if (typeof _query != 'undefined') location.href = _del + _query +_url_base+'&id='+$(this).data("val");
				else location.href =  _del + _url_base + '/id/'+ $(this).data("val");

				return false;		
			}
		});
	}
	
	if (typeof _drop != 'undefined'){
		$("._btn_drop").on('click',function(e){	
			e.preventDefault();

			if (confirm('정말로 탈퇴 처리 하시겠습니까?')){
				
				location.href = _drop + _url_base + '/id/'+ $(this).data("val");
				return false;		
			}
		});
	}

	if (typeof _drop1 != 'undefined'){
		$("._btn_drop1").on('click',function(e){	
			e.preventDefault();
			var $this_no =$(this).data("val");

			if (confirm('정말로 정상회원으로 복귀 시키겠습니까?')){
				
				location.href = _drop1 + _url_base + '/id/'+ $this_no;
				return false;		
			}
		});
	}
	
	if (typeof _del_url != 'undefined'){
		$("._btn_del").on('click',function(e){	
			e.preventDefault();
			var $this_no =$(this).data("val");

			if (confirm('정말로 삭제하시겠습니까?')){
				
				location.href = _del_url  + '/id/'+ $this_no + '?_url_base=' + _url_base;
				return false;		
			}
		});
	}

	if (typeof _del_key != 'undefined'){
		$("._del_key").on('click',function(e){	
			e.preventDefault();
			var $this_no =$(this).data("val");

			if (confirm('정말로 삭제하시겠습니까?')){
				
				location.href = _del_key + _url_base + '/id/'+ $this_no;
				return false;		
			}
		});
	}

	//엑셀다운
	if (typeof _excel != 'undefined'){
		
		$("#_btn_excel").on('click',function(e){	
			e.preventDefault();

			$("#insert_form").attr('action', _excel);
			$("#insert_form").submit();
		});
	}

	/* 다중 선택 일 경우 */
	if (typeof _all_chk != 'undefined'){
		
		$("#"+_all_chk).click(function(e){
			e.preventDefault();

			$chkAll = $("input[name=chkAll]");
			
			if($chkAll.is(":checked")){
				$chkAll.prop("checked", false);
			}else{
				$chkAll.prop("checked",true);
			}
			checkedAll();
		});	

	}

	if (typeof _sel_del != 'undefined'){

		$("._sel_del").on('click',function(e){		
			e.preventDefault();
			
			if(!$('._multi').is(":checked")){
				alert('선택된 항목이 없습니다.');
				return false;
			}

			if (confirm('정말로 삭제하시겠습니까?')){

				$("#insert_form").attr('action', _sel_del + _url_base );
				$("#insert_form").submit();
			}
		});
	}


	if (typeof _sel_auth != 'undefined'){

		$("._sel_auth").on('click',function(e){		
			e.preventDefault();
			
			if(!$('._multi').is(":checked")){
				alert('선택된 항목이 없습니다.');
				return false;
			}

			if (confirm('승인 하시겠습니까?')){

				$("#insert_form").attr('action', _sel_auth + _url_base );
				$("#insert_form").submit();
			}
		});
	}

	/* 다중 선택 일 경우 */
	if (typeof _sel_init != 'undefined'){

		$("._sel_init").on('click',function(e){	
			e.preventDefault();
			var mode_txt = '';

			$mode = '&mode='+$(this).data('val');
			
			if($(this).data('type')) mode_txt = $(this).data('type');
			
			if(!$('._multi').is(":checked")){
				alert('선택된 항목이 없습니다.');
				return false;
			}

			if (confirm(mode_txt)){
				var $data = $("#insert_form").serialize() + $mode;
				//alert(_sel_init);
				$.ajax({
					type:"POST",
					url: _sel_init,
					dataType:"json",
					data: $data,
					success:function(data){
						//console.log(data);
						if(data.success == true){
							location.reload();
						}else{
							location.reload();
						}
						
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
		});
	}
	
	//선택항목 확인 안함
	if (typeof _sel_init1 != 'undefined'){
		$("._sel_init1").on('click',function(e){	
			e.preventDefault();
			var mode_txt = '';

			$mode = '&mode='+$(this).data('val');
			
			if($(this).data('type')) mode_txt = $(this).data('type');
			

			if (confirm('선택된 항목을 '+ mode_txt +' 처리 하시겠습니까?')){
				var $data = $("#insert_form").serialize() + $mode;

				$.ajax({
					type:"POST",
					url: _sel_init1,
					dataType:"json",
					data: $data,
					success:function(data){
						//console.log(data);
						if(data.success == true){
							location.reload();
						}else{
							location.reload();
						}
						
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
		});
	}

	

	if (typeof _sel_auth != 'undefined'){

		$("._sel_auth").on('click',function(e){		
			e.preventDefault();
			
			if(!$('._multi').is(":checked")){
				alert('선택된 항목이 없습니다.');
				return false;
			}

			if (confirm('승인 하시겠습니까?')){

				$("#insert_form").attr('action', _sel_auth + _url_base );
				$("#insert_form").submit();
			}
		});
	}

	/* 다중 선택 일 경우 */
	if (typeof _sel_pop_init != 'undefined'){

		$("._sel_pop_init").on('click',function(e){	
			e.preventDefault();
			var mode_txt = '';

			$mode = '&mode='+$(this).data('val');
			
		
			if($(this).data('type')) mode_txt = $(this).data('type');
			
			if(!$('._multi').is(":checked")){
				alert('선택된 항목이 없습니다.');
				return false;
			}

			if (confirm('선택된 항목을 '+ mode_txt +' 처리 하시겠습니까?')){
				var $data = $("#insert_form").serialize() + $mode;
				$.ajax({
					type:"POST",
					url: $url = _sel_pop_init,
					dataType:"json",
					data: $data,
					success:function(data){
						console.log(data);
						if(data.success == true){
							opener.location.reload();
							location.reload();
						}else{
							opener.location.reload();
							location.reload();
						}
						
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
		});
	}
	
	/* select box일  경우 */
	if (typeof _change_init != 'undefined'){

		$("._sel_init").on('change',function(e){	
			e.preventDefault();
			var mode_txt = '';

			$data = 'id='+$(this).data('val') + '&state='+$(this).val();
			
			if($(this).data('msg')){ 
				mode_txt = $(this).data('msg');
				var is_confirm = confirm( mode_txt +' 처리 하시겠습니까?');
			}else{ 
				var is_confirm = true;
			}
			
			if (is_confirm){
				$.ajax({
					type:"POST",
					url: $url = _change_init,
					dataType:"json",
					data: $data,
					success:function(data){
						console.log(data);
						//location.reload();
						alert('처리 되었습니다.');
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
		});
	}


	/* 버튼일  경우 */
	if (typeof _btn_init != 'undefined'){

		$("._btn_init").on('click',function(e){	
			e.preventDefault();
			var mode_txt = '';

			$data = 'mode='+$(this).data('type') + '&val='+$(this).data('val');
			if($(this).data('msg')){ 
				mode_txt = $(this).data('msg');
				var is_confirm = confirm( mode_txt +' 처리 하시겠습니까?');
			}else{ 
				var is_confirm = true;
			}
			
			if (is_confirm){
				
				$.ajax({
					type:"POST",
					url: $url = _btn_init,
					dataType:"json",
					data: $data,
					success:function(data){
						//console.log(data);
						location.reload();
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
		});
	}

	/* selectbox 옵션  경우 */
	if (typeof _sel_opt_init != 'undefined'){

		$("._sel_opt_init").on('click',function(e){	
			e.preventDefault();
					
			if(!$('._multi').is(":checked")){
				alert('체크된 항목이 없습니다.');
				return false;
			}
						
			var self =$('#_sel_opt').find("option:selected");			
			$data = $("#insert_form").serialize() + '&mode='+self.data('type') + '&val='+$('#_sel_opt').val();
			
			if(!self.data('type')){
				alert('선택된 값이 없습니다.');
				return false;
			}
			
			
			if(self.data('msg')){
				var is_confirm = confirm( self.data('msg') +' 처리 하시겠습니까?');
			}else{ 
				var is_confirm = true;
			}
			
			
			if (is_confirm){
				$.ajax({
					type:"POST",
					url: $url = _sel_opt_init,
					dataType:"json",
					data: $data,
					success:function(data){
						//console.log(data);
						location.reload();
					},
					error:function(e){
						console.log(e);		
					}
				});
			}
			
		
		});
	}
});



function sEncode(val) {
	return encodeURIComponent(val).replace(/%/g, '.');
}

function encode(val) {
	return encodeURI(val);
	//return encodeURIComponent(val).replace(/.com/g, '^com');
}

function checkedAll(){ 
	if($("input[name=chkAll]").is(":checked")){
		$("._multi").prop("checked",true);
	}else{
		$("._multi").prop("checked", false);
		
	}
}
