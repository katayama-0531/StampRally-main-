angular.module('stampRallyApp').factory('get_img_service', ['$resource', '$localStorage', 'page_val', 
function($resource, $localStorage, page_val){

  return{
    leadAndSet: function(url){
      // $resource(ngResource)を使って読み込む
      var res = $resource(url);
      // $resourceは遅延実行なので$promiseを使ってデータを取得できるまで待ってから$localStorageへ保存
      var data = res.query();  //戻り値が配列（複数）の場合はquery
      //var data = res.get();　//戻り値がJSON１つの場合はget

      var options = {
        exclusive: false,
        create: true
      };
      var filePath = cordova.file.dataDirectory;
      var fileName = page_val.course_id + '.json';

      var saveFile = [];

        //Angularjs 1.6以降はエラー処理を書かないとエラーになる
        return data.$promise.then(function() {
          var stampName = "stamp" + page_val.rally_id;
          var headName = "head" + page_val.rally_id;
          localStorage.setItem(stampName, data[0]["stamp"]);
          localStorage.setItem(headName, data[1]["head"]);
          
        }, function(reason){
          console.log(reason);
          var saveFile = [];
          saveFile.push(false);
          saveFile.push("ファイルが存在しません。");
          saveFile.push(reason);
          return reason; // reasonを返す
        });
    }
  };
}]);