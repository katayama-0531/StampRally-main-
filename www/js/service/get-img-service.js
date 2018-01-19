angular.module('app').factory('get_img_service', ['$resource', '$localStorage', 'img_num', 
function($resource, $localStorage, img_num){
  return{
    leadAndSet: function(url){
        // $resource(ngResource)を使って読み込む
        var res = $resource(url);

        // $resourceは遅延実行なので$promiseを使ってデータを取得できるまで待ってから$localStorageへ保存
        var data = res.query();  //戻り値が配列（複数）の場合はquery
        //var data = res.get();　//戻り値がJSON１つの場合はget
        //Angularjs 1.6以降はエラー処理を書かないとエラーになる
        return data.$promise.then(function() {
          $localStorage.$default(data); // localStorageの$defaultへ
          return $localStorage; // $localStorageを返す
          //return jString; // $localStorageを返す
        }, function(reason){
          return reason; // reasonを返す
        });
    },
    getURL: function(){
      return img_num.img_list[0].img1;
    }
  };
}]);