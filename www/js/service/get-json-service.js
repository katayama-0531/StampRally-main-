angular.module('stampRallyApp')
  .factory('get_json_service', ['$resource', '$localStorage','page_val',
    function($resource, $localStorage, page_val){
        // factoryサービスのreturn部
        return{
            all: function(){
                // $resource(ngResource)を使って読み込む
                var res = $resource(page_val.img_URL);
        
                // $resourceは遅延実行なので$promiseを使ってデータを取得できるまで
                // 待ってから$localStorageへ保存
                var data = res.query();
                return data.$promise.then(function(){
                    window.resolveLocalFileSystemURL(page_val.img_URL, function(fileSystem) {
                        var fileName = page_val.course_id + '.json';
                        fileSystem.getFile(fileName, {create: true}, function (fileEntry) {
                            fileEntry.file(function (file){
                               return readAsText(file);
                            }, function(error) {
                                console.log('files ファイル読み込み エラー', error.code);
                                return　error;
                              });
                        }, function(error) {
                            console.log('files ファイル取得 エラー', error.code);
                            return　error;
                          });
                    }, function(error) {
                        console.log('files ディレクトリ操作 エラー', error.code);
                        return　error;
                      });
                  }, function(reason){
                    console.log(reason);
                    return reason; // reasonを返す
                  });
            }
        };
    }]);
