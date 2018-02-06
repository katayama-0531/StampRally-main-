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
          //TODO：いきなりファイルをフルパスで検索すると初回アクセス時エラーになる。
          //エラー回避の為、ディレクトリ検索→ファイル検索の順に行っている。
          window.resolveLocalFileSystemURL(filePath, function(fileSystem) {
            if(fileSystem.isFile) {
              console.log(filePath + ' ディレクトリが存在する');
              window.resolveLocalFileSystemURL(filePath+fileName, function(fileSystem) {
                if(fileSystem.isFile) {
                  page_val.img_URL = fileSystem.toURL();
                  console.log(page_val.course_id + '.json ファイルが存在する');
                  saveFile.push(true);
                  saveFile.push(fileSystem.toURL());
                }else {
                  console.log(page_val.course_id + '.json ファイルが存在しない');
                   // ファイルを生成する
                   fileSystem.getFile(fileName, options, function(fileEntry) {
                    // 生成したファイル情報が FileEntry オブジェクトで返される
                    page_val.img_URL = fileEntry.toURL();
                    console.log('ファイル生成 成功', fileEntry.toURL());
                    saveFile.push(true);
                    saveFile.push(fileEntry.toURL());
    
                  }, function(getFileError) {
                    console.log('ファイル生成 失敗', getFileError.code);
                    saveFile.push(false);
                    saveFile.push(getFileError);
                  }, function(error) {
                    console.log('files ディレクトリ操作 エラー', error.code);
                    saveFile.push(false);
                    saveFile.push(error.code);
                  });
                }
              }, function(error) {
                console.log(filePath + fileName+'ファイル存在確認中にエラーが発生', error.code);
                    saveFile.push(false);
                    saveFile.push(error.code);
              });
            }else {
              console.log(filePath + ' ディレクトリが存在しない');
              window.resolveLocalFileSystemURL(filePath+fileName, function(fileSystem) {
                if(fileSystem.isFile) {
                  page_val.img_URL = fileSystem.toURL();
                  console.log(page_val.course_id + '.json ファイルが存在する');
                  saveFile.push(true);
                  saveFile.push(fileSystem.toURL());
                }else {
                  console.log(page_val.course_id + '.json ファイルが存在しない');
                   // ファイルを生成する
                   fileSystem.getFile(fileName, options, function(fileEntry) {
                    // 生成したファイル情報が FileEntry オブジェクトで返される
                    page_val.img_URL = fileEntry.toURL();
                    console.log('ファイル生成 成功', fileEntry.toURL());
                    saveFile.push(true);
                    saveFile.push(fileEntry.toURL());
    
                  }, function(getFileError) {
                    console.log('ファイル生成 失敗', getFileError.code);
                    saveFile.push(false);
                    saveFile.push(getFileError.code);
                  }, function(error) {
                    console.log('files ディレクトリ操作 エラー', error.code);
                    saveFile.push(false);
                    saveFile.push(error.code);
                  });
                }
              }, function(error) {
                console.log(filePath + fileName+'ファイル存在確認中にエラーが発生', error.code);
                    saveFile.push(false);
                    saveFile.push(error);
              });
            }
          }, function(error) {
            console.log(filePath + fileName+'ファイル存在確認中にエラーが発生', error.code);
                saveFile.push(false);
                saveFile.push(error);
          });
          return saveFile;
          //$localStorage.$default(data); // localStorageの$defaultへ
          //return $localStorage; // $localStorageを返す
          //return jString; // $localStorageを返す
        }, function(reason){
          console.log(reason);
          var saveFile = [];
          saveFile.push(false);
          saveFile.push("ファイルが存在しません。");
          saveFile.push(reason);
          return reason; // reasonを返す
        });
    },
    getURL: function(){
      return page_val.img_list[0].img1;
    }
  };
}]);