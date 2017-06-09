define(['jquery', 'validateEngine', 'liteValidate', 'cookie', 'md5'], function (jq, ve, lv, cookie, md5) {
    'use strict';
    var g = {};
    var builder;
    var process;
    var event;
    g.node = {
        mainOperation: $('#main_operation'),
        loginButton: $('#login_button'),
        account: $('#account'),
        password: $('#password'),
        rememberPassword: $('#remember_password'),
        student: $('#student'),
        admin: $('#admin'),
        loginPioneer: $('#login_pioneer'),
        studyStar: $('#study_star'),
        studyNoData: $('#study_no_data'),
        loginNoData: $('#login_no_data'),
        remember: $('#remember')

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
        initValidationEngine: function () {
            g.node.mainOperation.validationEngine('attach', g.config);
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
            builder.initValidationEngine();
            builder.initData(g.data.currentUser);
            event.listen();
            //process.initCas();

            (function () {
                $ (function () {
                    $ (':input[placeholder]').each (function (index, element) {
                        placeHolder (element, true);
                    });
                });

                function getStyle (obj, styleName) {
                    var oStyle = null;
                    if (obj.currentStyle)
                        oStyle = obj.currentStyle[styleName];
                    else if (window.getComputedStyle)
                        oStyle = window.getComputedStyle (obj, null)[styleName];
                    return oStyle;
                }
                function placeHolder (obj, span) {
                    if (!obj.getAttribute ('placeholder')) return;
                    var imitateMode = span === true ? true : false;
                    var supportPlaceholder = 'placeholder' in document.createElement ('input');
                    if (!supportPlaceholder) {
                        var defaultValue = obj.getAttribute ('placeholder');
                        var type = obj.getAttribute ('type');
                        if (!imitateMode) {
                            obj.onfocus = function () {
                                (obj.value == defaultValue) && (obj.value = '');
                                obj.style.color = '';
                            }
                            obj.onblur = function () {
                                if (obj.value == defaultValue) {
                                    obj.style.color = '';
                                } else if (obj.value == '') {
                                    obj.value = defaultValue;
                                    obj.style.color = '#ACA899';
                                }
                            }
                            obj.onblur ();
                        } else {
                            var placeHolderCont = document.createTextNode (defaultValue);
                            var oWrapper = document.createElement ('span');
                            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
                            oWrapper.className = 'wrap-placeholder';
                            oWrapper.style.fontFamily = getStyle (obj, 'fontFamily');
                            oWrapper.style.fontSize = getStyle (obj, 'fontSize');
                            oWrapper.style.marginLeft = parseInt (getStyle (obj, 'marginLeft')) ? parseInt (getStyle (obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
                            oWrapper.style.marginTop = parseInt (getStyle (obj, 'marginTop')) != 0 ? getStyle (obj, 'marginTop') : 0 + 'px';
                            oWrapper.style.paddingLeft = getStyle (obj, 'paddingLeft');
                            oWrapper.style.width = (obj.offsetWidth - parseInt ((getStyle (obj, 'marginLeft') == "auto" ? 0 : (getStyle (obj, 'marginLeft'))))) == 0 ? 100 : (obj.offsetWidth - parseInt ((getStyle (obj, 'marginLeft') == "auto" ? 0 : (getStyle (obj, 'marginLeft'))))) + 'px';
                            oWrapper.style.height = obj.offsetHeight == 0 ? 34 : obj.offsetHeight + 'px';
                            oWrapper.style.lineHeight = obj.nodeName.toLowerCase () == 'textarea' ? '' : (obj.offsetHeight == 0 ? 34 : obj.offsetHeight) + 'px';
                            oWrapper.appendChild (placeHolderCont);
                            obj.parentNode.insertBefore (oWrapper, obj);
                            oWrapper.onclick = function () {
                                obj.focus ();
                            };
                            //绑定input或onpropertychange事件,ie9中删除时无法触发此事件
                            if (typeof(obj.oninput) == 'object') {
                                obj.addEventListener ("input", function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                }, false);
                                obj.onpropertychange = function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                };
                                obj.onkeyup = function (e) {
                                    var e = e || window.event;
                                    if (e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey && e.keyCode == 88)) {
                                        oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                                    }
                                };
                            } else {
                                obj.onpropertychange = function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                };
                                obj.onkeyup = function (e) {
                                    var e = e || window.event;
                                    if (e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey && e.keyCode == 88)) {
                                        oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                                    }
                                };
                            }
                        }
                    }
                }
            }) ();
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
            $.get('/FxbManager/userController/login?username='+username+"&password="+md5(password)+"&accountType="+accountType, function (data) {
                process.loginSuccess(data);
            });
            //ssoLogin.login(loginParam, "{'portalType':'mall'}");
        },
        loginSuccess: function (data) {
            if (data.state == 1) {
               
                window.location = data.jsonBody.location;
            } else if (data.state == 2) {
                lv.showPrompt(g.node.account, {
                    content: '帐号不存在',
                    type: 'error'
                });
            } else {
                lv.showPrompt(g.node.account, {
                    content: '账号或密码错误',
                    type: 'error'
                });
            }
        },
        initCas: function () {
            $.get('/web/login/login/getLoginParameters.action', function (data) {
                window.processLogin = process.loginSuccess;
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = data.info.casDomain + "/login?TARGET=" + data.info.currentDomain + "/web/sso/auth&js&callback=processLogin";
                $('head').append(script);
                //document.documentElement.appendChild(script);
            });
        }
    };

    event = {
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
            g.node.remember.click(function (e) {
                if (g.node.rememberPassword.is(':checked')) {
                    g.node.rememberPassword.prop('checked', false);
                } else {
                    g.node.rememberPassword.prop('checked', true);
                }
            });
            //页面enter事件
            $(document).keydown(function (e) {
                if (e.keyCode === 13) {
                    process.tologin();
                }
            });

        }
    };
    process.init();
});
