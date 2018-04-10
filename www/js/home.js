ons.bootstrap(['stampRallyApp']);
var app = angular.module('stampRallyApp',['onsen', 'ngResource', 'ngStorage']);
//画像表示の際に使用する共通変数
app.constant('page_val', {
  // 'url':'https://www.online-carelplus.com/stamp/app_view/',
  // 'root_url':'https://www.online-carelplus.com/stamp/',
  'url':'https://jafstamprally.com/app_view/',
  'root_url':'https://jafstamprally.com/',
  'spot_id': 0,
  'course_id': 0,
  'rally_id': 0,
  'rally_mode': '',
  'coupon_id':0,
  'pages': '',
  'stamp_comp_flg':0,
  'num': 0,
  'img_num': 0,
  'stamp_img_URL':'',
  'img_list':[],
  'near_spot_data':[],
  'header_color_code':'',
  'header_title_img':'',
  'header_news_img':'',
  'header_setting_img':'',
  'default_color_code':'WHITE',
  'default_title_img':'img_common/header/header-appname.png',
  'default_news_img':'img_common/header/header-news.png',
  'default_setting_img':'img_common/header/header-hamb-menu.png',
  'lat':0,
  'lng':0,
  'alt':0,
  'acc':0,
  'coupon':"",
  'nearSpot':"",
  'maintenance':0
    });
  app.config(['$localStorageProvider',
  function ($localStorageProvider) {
      // prefixをつけないと他のwebアプリと混在する。
      $localStorageProvider.setKeyPrefix('stampRally');
  }]);