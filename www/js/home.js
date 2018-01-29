var app = angular.module('stampRallyApp',['ngResource', 'ngStorage']);
//画像表示の際に使用する共通変数
app.constant('img_num', {
      'num': 0,
      'img_list':[]
    });