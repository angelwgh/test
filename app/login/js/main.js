/*jshint unused: vars */
(function () {
  require.config({
    //baseUrl: '/js',
    paths: {
      //core: './core',
      jquery: '../../../bower_components/jquery/dist/jquery',
      cookie: '../../../bower_components/cookies-js/dist/cookies',
      validateEngine: '../../../bower_components/validation/jquery.validationEngine',
      validateEngineLang: '../../../bower_components/validation/jquery.validationEngine-zh_CN',
      liteValidate: '../../../bower_components/validation/lite-validate',
      simpleValidateEngine: '../../../bower_components/validationEngine/simple-validate-engine',
      md5: '../../../bower_components/js-md5/src/md5'
    },
    shim: {
      validateEngineLang: {deps: ['jquery'], exports: 'validateEngineLang'},
      validateEngine: {deps: ['validateEngineLang', 'jquery'], exports: 'validateEngine'},
      liteValidate: {deps: ['validateEngine', 'jquery'], exports: 'liteValidate'},
        simpleValidateEngine: {deps: ['validateEngine', 'jquery'], exports: 'simpleValidateEngine'},
        md5: {deps: [], exports: 'md5'}
    },
    packages: []
  });
  require(['core/login']);
    /*require(['core/forgetPassword5']);*/
})();
