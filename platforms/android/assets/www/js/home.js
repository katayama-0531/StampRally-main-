ons.bootstrap(['stampRallyApp']);
var app = angular.module('stampRallyApp',['ngResource', 'ngStorage']);
//画像表示の際に使用する共通変数
app.constant('page_val', {
  'spot_id': 0,
  'course_id': 0,
  'num': 0,
  'img_num': 0,
  'img_URL':'',
  'img_list':[],
  'header_color_code':'WHITE',
  'img_pass':'img_common/',
  'header_title_img':'logo_stamprally.png',
  'header_news_img':'head_icon_news.png',
  'header_setting_img':'head_icon_setting.png'
    });
  app.config(['$localStorageProvider',
  function ($localStorageProvider) {
      // prefixをつけないと他のwebアプリと混在する。
      $localStorageProvider.setKeyPrefix('stampRally');
  }]);
