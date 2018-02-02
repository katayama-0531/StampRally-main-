var app = angular.module('stampRallyApp',['ngResource', 'ngStorage']);
//画像表示の際に使用する共通変数
app.constant('page_val', {
  'spot_id': 0,
  'num': 0,
  'img_list':[]
    });