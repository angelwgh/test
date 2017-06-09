/**
 * Created by WDL on 2015/9/2.
 */
define(['jquery', 'validateEngine', 'liteValidate', 'cookie'], function (jq, ve, lv, cookie) {
    var g = {};
    var builder;
    var process;
    var event;
    g.node = {
        newpw: $('#newpw'),
        enterpw: $('#enterpw'),
        account: $('#account'),
        account1: $('#account1'),
        account2: $('#account2'),
        account3: $('#account3'),
        step4: $('#step4'),
        step6: $('#step6'),
        step7: $('#step7'),
        next: $('#next'),
        tip1: $('#tip1'),
        tip2: $('#tip2'),
        tip3: $('#tip3')
    };
    g.data = {
        account: '',
        password: '',
        currentUser: 'student',
        expires: 60 * 60 * 24 * 30
    };
    g.config = {
        validationEventTrigger: 'blur',
        showPrompts: true,
        scroll: false,
        promptPosition: 'topRight',
        autoHidePrompt: true,
        autoHideDelay: 10000,
        showOneMessage: true,
        onFailure: false,
        focusFirstField: true
    };

    builder = {
        initPage: function() {
            var url = '/web/login/forgetPassword/findUUIDRandomNumber';
            $.post(url, {account: g.data.account, code: g.data.code}, function (data) {
                if (data.status) {
                    if (data.info.length>0) {
                        if (data.info[0].userId == 'true') {
                            g.node.account1.text(data.info[0].accountId);
                            g.node.account2.text(data.info[0].accountId);
                            g.node.account3.text(data.info[0].accountId);
                            g.node.step6.removeClass('hide');
                        } else {
                            g.node.account1.text(data.info[0].accountId);
                            g.node.account2.text(data.info[0].accountId);
                            g.node.account3.text(data.info[0].accountId);
                            g.node.step4.removeClass('hide');
                        }
                    } else {
                        g.node.step4.removeClass('hide');
                    }

                    //g.node.email.html("<span>通过邮箱找回密码</span>" + data.info.email);
                    //g.node.mobile.html("<span>通过手机找回密码</span>" + data.info.mobile);

                    //g.node.step6.addClass('hide');
                } else {
                }
            }, 'json');
        },
        initValidationEngine: function () {
            g.node.mainOperation.validationEngine('attach', g.config);
        },
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },

        initData: function (cruuent) {
            var cookiePassword,
                cookieAccount;
            if (cruuent == 'admin') {
                cookiePassword = cookie.get('adminPassword');
                cookieAccount = cookie.get('adminAccount');
            } else {
                cookiePassword = cookie.get('studentPassword');
                cookieAccount = cookie.get('studentAccount');
            }

            if (cookiePassword) {
                if (cookiePassword !== null && cookiePassword !== '') {
                    g.node.password.val(cookiePassword);
                    g.data.password = cookiePassword;
                }
            } else {
                g.node.password.val(cookiePassword);
            }
            if (cookieAccount) {
                if (cookieAccount !== null && cookieAccount !== '') {
                    g.node.account.val(cookieAccount);
                    g.data.account = cookieAccount;
                    g.node.rememberPassword.prop('checked', true);
                }
            } else {
                g.node.account.val(cookieAccount);
                g.node.rememberPassword.prop('checked', false);
            }
        }
    };

    process = {
        init: function () {
            g.data.code = builder.getUrlParam('code');
            g.data.account = builder.getUrlParam('account');
            builder.initPage();
            event.listen();
            //process.getLoginPioneer();
        },

        getValidateResult: function () {
            return g.node.mainOperation.validationEngine('validate');
        },


        login: function () {
            process.saveData();
            process.preLogin();
        },

        preLogin: function () {
            var account = document.getElementById("account").value;
            var password = document.getElementById("password").value;
            process.doSsoLogin(account, password);
        },


        doSsoLogin: function (account, password) {
            process.submit(account, password);
        },

        tologin: function () {
            if (process.getValidateResult() === true) {
                process.login();
            }
        },

        // 记住密码保存cookie
        rememberThePwd: function (currentUser) {
            var account = $.trim(g.node.account.val()),
                password = $.trim(g.node.password.val());
            if (currentUser == 'admin') {
                cookie.set('adminAccount', account, {expires: g.data.expires});
                cookie.set('adminPassword', password, {expires: g.data.expires});
            } else {
                cookie.set('studentAccount', account, {expires: g.data.expires});
                cookie.set('studentPassword', password, {expires: g.data.expires});
            }

        },
        //删除cookie
        removeCookie: function (currentUser) {
            if (currentUser == 'admin') {
                cookie.expire('adminAccount');
                cookie.expire('adminPassword');
            } else {
                cookie.expire('studentAccount');
                cookie.expire('studentPassword');
            }

        },
        //保存数据
        saveData: function () {
            if (g.node.rememberPassword.is(':checked')) {
                process.rememberThePwd(g.data.currentUser);
            } else {
                process.removeCookie(g.data.currentUser);
            }
        },
        submit: function (username, password) {
            var accountType = "1";
            if (g.data.currentUser == 'admin') {
                accountType = "2";
            }
            var loginParam = {"accountType": accountType, "username": username, "password": password};
            ssoLogin.login(loginParam, "{'portalType':'mall'}");
        },
        loginSuccess: function (data) {
            if (data.code == 603) {
                window.location = data.location;
            } else if (data.code == 611) {
                lv.showPrompt(g.node.account, {
                    content: '帐号已被停用',
                    type: 'error'
                });
            }
            else {
                lv.showPrompt(g.node.account, {
                    content: '账号或密码错误',
                    type: 'error'
                });
            }
        },
        initCas: function () {
            $.get('/web/login/login/getLoginParameters.action', function (data) {
                processLogin = process.loginSuccess;
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = data.info.casDomain + "/login?TARGET=" + data.info.currentDomain + "/web/sso/auth&js&callback=processLogin";
                document.documentElement.appendChild(script);
            });
        },
        /**
         * 获取登入之星
         */
        getLoginPioneer: function () {
            $.get('/login/getLoginParameters', function (data) {
                $.each(data.data, function (index, item) {
                    var html = [];
                    html.push('' +
                    '<li><img src="' + item.picture + '" alt=""/>' +
                    '<p>' + item.name + '</p>' +
                    ' </li>');
                    g.node.studyStar.append(html.join(''));
                })
            });
        },
        /**
         * 获取学习之星
         */
        getStudyStar: function () {
            $.get('/web/login/login/getStudyStar', function (data) {
                if (data.status) {
                    var html = [];
                    $.each(data.info, function (index, item) {
                        var photoAddress = item.photoAddress ? '/mfs/' + item.photoAddress : 'images/user-img.jpg',
                            temp = '<li><img src="' + photoAddress + '" alt=" "/>'
                                + '<p>' + item.studentName + '<span class="pl5">' + item.courseCount + '门</span></p></li>';
                        html.push(temp);
                    });
                    g.node.studyStar.append(html.join(''));
                }
            });
        }
    };

    event = {
        listen: function () {

            //页面enter事件
            $(document).keydown(function (e) {
                if (e.keyCode === 13) {
                    process.tologin();
                }
            });
            g.node.next.bind("click", function () {

                if (g.node.newpw.val() == '') {
                    g.node.tip1.removeClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.newpw.focus();
                    return;
                }

                if (g.node.enterpw.val() == '') {
                    g.node.tip1.addClass('hide');
                    g.node.tip2.removeClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }

                if (g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }

                var url = '/web/login/forgetPassword/updateUserPassword';
                g.data.sendStyle = false;
                var datas = {
                    code: g.data.code,
                    newPassword: g.node.newpw.val()
                };
                $.post(url, datas, function (data) {
                    if (data.status) {
                        if (data.info) {
                            g.node.step4.addClass('hide');
                            g.node.step6.addClass('hide');
                            g.node.step7.removeClass('hide');
                        } else {

                        }
                        //window.location = data.location;
                    } else {

                    }
                }, 'json');
            });
            g.node.newpw.blur(function(){
                if (g.node.newpw.val() == '') {
                    g.node.tip1.removeClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.newpw.focus();
                    return;
                }
                if (g.node.newpw.val() != '' && g.node.enterpw.val() != '' && g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.newpw.focus();
                    return;
                }
            });
            g.node.enterpw.blur(function(){
                if (g.node.enterpw.val() == '') {
                    g.node.tip1.addClass('hide');
                    g.node.tip2.removeClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }
                if (g.node.newpw.val() != '' && g.node.enterpw.val() != '' && g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }
                /*if (g.node.enterpw.val()=='') {
                    g.node.newpw.val('请输入新密码');
                }*/
            });
            /*g.node.newpw.focus(function(){
                if(g.node.newpw.val()=='请输入新密码') {
                    g.node.newpw.val('');
                }
            });
            g.node.newpw.blur(function(){
                if (g.node.newpw.val()=='') {
                    g.node.newpw.val('请输入新密码');
                }
            });
            g.node.enterpw.focus(function(){
                if(g.node.enterpw.val()=='请再次输入新密码') {
                    g.node.enterpw.val('');
                }
            });
            g.node.enterpw.blur(function(){
                if (g.node.enterpw.val()=='') {
                    g.node.enterpw.val('请再次输入新密码');
                }
            });*/

        }
    };
    process.init();
});
