$(function () {
    $("#login_submit").click(function (e) {
        e.preventDefault();

        if ($("#m_id").val() == "") {
            alert('아이디를 입력해 주세요.');
            $("#m_id").focus();
            return true;
        } else if ($("#password").val() == "") {
            alert('패스워드를 입력해 주세요.');
            $("#password").focus();
            return true;
        }
        var loginObj = new Object();
        loginObj.m_id = $("#m_id").val();
        loginObj.pwd = $("#password").val();

        $.ajax({
            type: "POST",
            url: "/Admin/adminLogin",
            data: loginObj,
            success: function (result) {
                if (result.Success) {
                    location.href = "/Admin/Notice";
                } else {
                    alert(result.Message);
                }
            }
        });
        //var $form_data = $("#login_form").serialize()
        //$("#login_form").submit();
    });

    $("#password").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#login_submit").trigger('click');
        }
    });

});