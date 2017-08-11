$(function(){
    /**
     * 记住密码
     */
    $('body').on('click', '#remember_password', function(event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $(this).siblings("input[type='hidden']").val() == 0 ? $(this).siblings("input[type='hidden']").val(1) : $(this).siblings("input[type='hidden']").val(0);
    });

    /**
     * 获取验证码
     */

    $('body').on('touchend click', '#btn_get_code,#get_img_code', function(event) {
        event.preventDefault();
        var that = document.getElementById('btn_get_code');

        var mobileVal = '';
        if($("#reg_account")[0]){
            mobileVal = $('#reg_account').val();
        }else if ($("#back_account")[0]) {
            mobileVal = $('#back_account').val();
            }else if ($("#verify_account")[0]){
          mobileVal = $('#verify_account').val();
        }

        if($.trim($('#verifycode').val()) == ''){
            $('#get_img_html').show();
            return false;
        }

        $.get("/login/get-mobile-code", { mobile: mobileVal,type:$("#type").val(),code:$('#verifycode').val(), time: new Date().getTime() },function(result){

            if (result.code == 1) { //失败流程

                if(typeof result.message == 'string'){
                    alert(result.message);
                }else{
                    for(var o in result.message){
                        alert(result.message[o]+'');
                        break;
                    }
                }
                return false;

            }
          $('#get_img_html').hide();

            //60秒后重新获取验证码
            var wait = 60;
            $("#btn_get_code").disabled = false;

            (function time(o) {
                if (wait == 0) {
                    o.removeAttribute("disabled");
                    o.value = "点击获取";
                    wait = 60;
                } else {
                    o.setAttribute("disabled", true);
                    o.value = "(" + wait + ")";
                    wait--;
                    setTimeout(function() {
                        time(o)
                    },1000)
                }
            })(that);

        },'JSON');


    });

    /**
     * 注册账号的时候检测输入的是手机号码/邮箱
     */
    $('body').on('input propertychange', '#reg_account', function(event) {
        event.preventDefault();
        var registerPhone = $(this).val();
        if (!registerPhone.length) {
            $('#get_code_box').slideUp();
        } else {
            if(checkPhone('#reg_account')){
                $('#get_code_box').slideDown();
            } else {
                $('#get_code_box').slideUp();
            }
        }
    });

    /**
     * 重置密码的时候检测输入的是手机号码/邮箱
     */
     $('body').on('input propertychange', '#back_account', function(event) {
        event.preventDefault();
        var backAccount = $(this).val();
        if (!backAccount.length) {
            $('#set_password').slideUp();
        } else {
            if(checkPhone('#back_account')){
                $('#set_password').slideDown();
            } else {
                $('#set_password').slideUp();
            }
            if (checkEmail('#back_account')) {
                $('#btn_reset_password').val('发送重置密码邮件');
            } else {
                $('#btn_reset_password').val('重置密码');
            }
        }
    });

     /**
      * 忘记密码/返回登录
      */
     $('body').on('click', '#back_password', function(event) {
         event.preventDefault();
         $('#login_box').addClass('hide');
         $('#password_back').removeClass('hide');
         $('#btn_now_register').html('返回登录');
     });

     /**
      * 判断 立即注册/立即登录/返回登录
      */
     $('body').on('click', '#btn_now_register', function(event) {
         event.preventDefault();
         var thisHtml = $(this).html();
         if(thisHtml == '返回登录') {
            $('#login_box').removeClass('hide');
            $('#password_back').addClass('hide');
            $('#btn_now_register').html('立即注册');
         } else if(thisHtml == '立即注册') {
            parent.layer.closeAll();
            parent.jumpFrame('/register/index','800px','480px','login-class');
         } else if (thisHtml == '立即登录') {
            parent.layer.closeAll();
            parent.jumpFrame('/login/index','800px','480px','login-class');
         }

     });
})


function checkPhone(sel) {
    if(/^1\d{10}$/.test($(sel).val())){
        return true;
    } else {
        return false;
    }
}

function checkEmail(sel) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (reg.test($(sel).val())) {
        return true;
    } else {
        return false;
    }
}

/**
 * [tip description]
 * 输入不合法时的提示，默认提示浮动在输入框左上角
 */
function tip(content, sel) {
    layer.tips(content, sel, {
        tips: [1, '#222'] // 1234 => 上右下左 还可配置背景颜色
    });
}
