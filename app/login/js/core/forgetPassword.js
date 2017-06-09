/**
 * Created by WDL on 2015/8/29.
 */
define(['jquery', 'validateEngine', 'liteValidate', 'simpleValidateEngine', 'validateEngineLang'], function (jq, ve, lv, simpleValidateEngine, validateEngineLang) {
    var g = {};
    //var validEngine = require('lib/validationEngine/simple-validate-engine');
    var builder;
    var process;
    var event;
    var helper;

    var config = {
        showOneMessage: true,
        promptPosition: 'topLeft',
        ajaxFormValidation: true,
        ajaxFormValidationMethod: 'post',
        autoHidePrompt: true,
        autoHideDelay: 2000
    };

    g.node = {
        step1: $('#step1'),
        step2: $('#step2'),
        step3: $('#step3'),
        step4: $('#step4'),
        step5: $('#step5'),
        step6: $('#step6'),
        step7: $('#step7'),
        stepForm1: $('#stepForm1'),
        next: $('#next'),  //
        validateCode: $('#validateCode'),
        account: $('#account'),
        account1: $('#account1'),
        account2: $('#account2'),
        account3: $('#account3'),
        changeCodeImage: $('#change-code-image'),
        refreshImage: $('#refresh-image'),
        tip: $('#tip'),
        email: $('#email'),
        mobile: $('#mobile'),
        sendEmail: $('#sendEmail'),
        sendMobile: $('#sendMobile'),
        second: $('#second'),
        alreadyEmail: $('#alreadyEmail'),
        reloadSendEmail: $('#reloadSendEmail'),
        againSendEmail: $('#againSendEmail'),
        otherStyle: $('#otherStyle'),
        noneFind: $('#noneFind')

    };
    g.data = {
        account: {
            userName: ''
        },
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
        initValidationEngine: function () {
            g.node.stepForm1.validationEngine('attach', g.config);
        },
        installValidation: function () {
            // 注册校验引擎
            /*$.validationEngineLanguage.allRules.ajaxCode = {
                url: '/web/login/validateCode/validation',
                //alertTextLoad: "* 正在校验...",
                autoHideOkPrompt: true,
                autoHideOkDelay: 2000
            };*/
            $.extend($.validationEngineLanguage.allRules,{ "ajaxCode": {
                "url": "/web/login/validateCode/validation",
                "extraData": "dt="+(new Date()).getTime(),
                /*"alertText": "* 验证失败！",*/
                "alertTextLoad": "* 验证中，请稍候..."}
            });
            //var obj = $.extend(g.config, {});
            //g.node.stepForm1.validationEngine('attach', g.config);
            /*g.node.validateCode.bind("blur", function () {
                $.get('/web/login/validateCode/validation', function (data) {
                    if (!data.info) {
                        g.node.tip.html("验证码错误");
                    } else {
                        g.node.tip.html("验证码正确");
                    }
                });
            });*/

        },

        initData: function () {/*
            g.node.step1.css({"display": "block"});
            g.node.step2.css({"display": "none"});
            g.node.step3.css({"display": "none"});
            g.node.step4.css({"display": "none"});
            g.node.step5.css({"display": "none"});
            g.node.step6.css({"display": "none"});
            g.node.step7.css({"display": "none"});*/
        }
    };

    process = {
        init: function () {
            event.listener();
            builder.initValidationEngine();
            builder.installValidation();
            builder.initData();
        },
        next: function () {
            var result = g.node.stepForm1.validationEngine('validate');
            if (result) {
                g.node.next.attr('disabled', 'disabled');
                var url = '/web/login/forgetPassword/forgetInfo';
                var account = g.node.account.val();
                g.data.loginInput = account;
                var option = {};
                $.post(url, {loginInput: account}, function (data) {
                    if (data.status) {
                        option.type = 'success';
                        if (data.info) {
                            g.data.email = data.info.email;
                            g.data.mobile = data.info.mobile;
                        }
                        g.node.account1.text(account);
                        if (data.info.email) {
                            g.node.email.html("<span>通过邮箱找回密码</span>" + data.info.email);
                        } else {
                            g.node.sendEmail.css('display', 'none');
                            g.node.sendEmail.addClass("hide");
                        }

                        if (data.info.mobile) {
                            g.node.mobile.html("<span>通过手机找回密码</span>" + data.info.mobile);
                        } else {
                            g.node.sendMobile.css('display', 'none');
                            g.node.sendEmail.removeClass('bor');
                        }
                        if (!data.info.email && !data.info.mobile) {
                            g.node.noneFind.css('display', 'block');
                        }
                        g.node.step1.addClass('hide');
                        g.node.step2.removeClass('hide');
                    } else {
                        //option.type = 'error';
                        alert('查询失败！');
                    }
                    //option.msg = data.messages;
                    g.node.next.removeAttr("disabled");
                    //tip.alert(option);
                }, 'json');
            }
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
        }
    };

    event = {
        listener: function () {
            //找回密码
            g.node.next.bind('click', function () {

                process.next();
            });
            g.node.sendEmail.bind("click", function () {
                var url = '/web/login/forgetPassword/sendUUIDRandomNumber';
                g.data.sendStyle = true;
                var datas = {
                    type: 'email',
                    loginInput: g.data.loginInput
                };
                $.post(url, datas, function (data) {
                    if (data.status) {
                        g.node.account2.text(g.data.loginInput);
                        g.node.account3.text(g.data.loginInput);
                        if (data.info) {
                            g.node.alreadyEmail.html(g.data.email);
                            g.node.step1.addClass('hide');
                            g.node.step2.addClass('hide');
                            g.node.step3.removeClass('hide');
                            g.node.step4.addClass('hide');
                        } else {
                            g.node.step1.addClass('hide');
                            g.node.step2.addClass('hide');
                            g.node.step3.addClass('hide');
                            g.node.step4.removeClass('hide');
                        }
                    } else {
                        g.node.step1.addClass('hide');
                        g.node.step2.addClass('hide');
                        g.node.step4.removeClass('hide');
                        g.node.step3.addClass('hide');
                    }
                }, 'json');
            });
            g.node.sendMobile.bind("click", function () {
                var url = '/web/login/forgetPassword/sendUUIDRandomNumber';
                g.data.sendStyle = false;
                var datas = {
                    type: 'mobile',
                    loginInput: g.data.loginInput
                };
                var option = {};
                $.post(url, {loginInput: account}, function (data) {
                    if (data.status) {
                        option.type = 'success';
                        g.data.email = data.info.email;
                        g.data.mobile = data.info.mobile;
                        g.node.accountId.text(account);
                        g.node.email.html("<span>通过邮箱找回密码</span>" + data.info.email);
                        g.node.mobile.html("<span>通过手机找回密码</span>" + data.info.mobile);
                        g.node.step1.addClass('hide');
                        g.node.step2.removeClass('hide');
                    } else {
                        option.type = 'error';
                    }
                    option.msg = data.messages;
                    g.node.next.removeAttr("disabled");
                    //tip.alert(option);
                }, 'json');
            });
            g.node.otherStyle.bind("click", function () {
                g.node.step1.addClass('hide');
                g.node.step2.removeClass('hide');
                g.node.step3.addClass('hide');
            });
            g.node.reloadSendEmail.bind("click", function () {
                if (g.data.sendStyle) {
                    g.node.sendEmail.click();
                    g.node.sendEmail.click();
                    g.node.sendEmail.trigger("click");
                } else {
                    g.node.sendMobile.click();
                    g.node.sendMobile.click();
                    g.node.sendMobile.trigger("click");
                }
            });
            g.node.againSendEmail.bind("click", function() {
                if (g.data.sendStyle) {
                    g.node.sendEmail.click();
                    g.node.sendEmail.click();
                    g.node.sendEmail.trigger("click");
                } else {
                    g.node.sendMobile.click();
                    g.node.sendMobile.click();
                    g.node.sendMobile.trigger("click");
                }
            });
            g.node.changeCodeImage.bind("click", function () {
                g.node.refreshImage.attr('src', "/web/login/validateCode/code?" + Math.random());
            });
            g.node.refreshImage.bind("click", function () {
                g.node.refreshImage.attr('src', "/web/login/validateCode/code?" + Math.random());
            });
        },
        listen: function () {
            g.node.loginButton.click(function () {
                process.tologin();
            });
            g.node.student.click(function () {
                g.node.student.addClass('current');
                g.node.admin.removeClass('current');
                g.data.currentUser = "student";
                builder.initData(g.data.currentUser);
            });
            g.node.admin.click(function () {
                g.node.admin.addClass('current');
                g.node.student.removeClass('current')
                g.data.currentUser = "admin";
                builder.initData(g.data.currentUser);
            });
            //页面enter事件
            $(document).keydown(function (e) {
                if (e.keyCode === 13) {
                    process.tologin();
                }
            });

        }
    };

    helper = {
        installValidation: function () {
            // 注册校验引擎
            $.validationEngineLanguage.allRules.ajaxCode = {
                url: baseUrl + '/web/admin/validateCode/0/validation',
                //alertTextLoad: "* 正在努力校验员工号是否被使用...",
                autoHideOkPrompt: true,
                autoHideOkDelay: 2000
            };
            simpleValidateEngine.installFormValidation(g.node.stepForm1, {});
        }
    };


    process.init();
});
