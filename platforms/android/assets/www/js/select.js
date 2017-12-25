app.controller('select', function($scope) {
    
    var listItem = [{id: 1, name: 'スタンプラリー1', package: 200}, {id: 2, name: 'スタンプラリー2', package: 200}];
    this.data = listItem;

    rootDir = '';
    requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        rootDir = fileSystem.root.toURL();
        console.log(rootDir);
    },function(e){
        alert('ファイルアクセスエラー');
    });

    this.dlClick = function(arg){
        //ダウンロードファイルを保存するパス(cordova.file.applicationStorageDirectoryに保存したほうがいい)
        var filePath = rootDir + 'img/' + arg + '/stamp' + arg + '.png';
        
        //ダウンロード予定のファイルが存在するか確認
        window.resolveLocalFileSystemURL(filePath, function(fileSystem) {
            if(fileSystem.isFile) {
                //ファイルが存在するため、ダウンロードせずに次の画面に遷移する
                //var img = JSON.parse(filePath);
                //this.imgData = img;
                navi.replacePage("html/slide-menu.html");
            } else {
                //ファイルが存在しないため、ダウンロードして次の画面に遷移する
                var fileTransfer = new FileTransfer();
                //ダウンロードするURL
                arg = 40;
                var url = encodeURI('http://japan-izm.com/var/www/htnl/dat/kon/test/stamp/img/' + arg + '/stamp' + arg + '.json');
                fileTransfer.download(url, filePath, function(entry) {
                    //ダウンロード成功
                    console.log('ダウンロード成功 '+filePath);
                    var img = JSON.parse(filePath);
                    this.imgData = img;
                }, function(error) {
                    //ダウンロード失敗
                    errorMessage = '';
                    switch(error.code){
                        case FileTransferError.FILE_NOT_FOUND_ERR:
                            errorMessage += "ファイルが見つかりませんでした。";
                            break;
                        case FileTransferError.INVALID_URL_ERR:
                            errorMessage += "URLが不正です。";
                            break;
                        case FileTransferError.CONNECTION_ERR	:
                            errorMessage += "接続エラーが発生しました。";
                            break;
                        case FileTransferError.ABORT_ERR:
                            errorMessage += "処理が中断されました。";
                            break;
                        case FileTransferError.NOT_MODIFIED_ERR:
                            console.log('HTTPでNot Modifiedによるコンテンツがなかった');
                            errorMessage += "ファイルが見つかりませんでした。";
                            break;
                    }
                    alert('ダウンロード中にエラーが発生しました。<br> '+errorMessage);
                });
            }
          }, function(error) {
              //ダウンロード失敗
              errorMessage = '';
              switch(error.code){
                  case FileError.FILE_NOT_FOUND_ERR:
                      errorMessage += "ファイルが見つかりませんでした。";
                      break;
                  case FileError.SECURITY_ERR:
                      errorMessage += "セキュリティエラー";
                      break;
                  case FileError.ABORT_ERR	:
                      errorMessage += " 処理が中断されました。";
                      break;
                  case FileError.NOT_READABLE_ERR:
                      errorMessage += "読み込みできませんでした。";
                      break;
                  case FileError.ENCODING_ERR:
                      errorMessage += "エンコードできませんでした。";
                      break;
                  case FileError.NO_MODIFICATION_ALLOWED_ERR:
                  errorMessage += "変更が許可されていないファイルです。";
                      break;
                  case FileError.INVALID_STATE_ERR:
                      errorMessage += "無効なファイルです。";
                      break;
                  case FileError.SYNTAX_ERR	:
                      errorMessage += "構文エラー";
                      break;
                  case FileError.INVALID_MODIFICATION_ERR:
                      console.log('HTTPでNot Modifiedによるコンテンツがなかった');
                      errorMessage += "無効な変更です。";
                      break;
                  case FileError.QUOTA_EXCEEDED_ERR:
                      errorMessage += "エラーコード : " + error.code;
                      break;
                      case FileError.TYPE_MISMATCH_ERR:
                      errorMessage += "型の不一致のため開けません。";
                      break;
                  case FileError.PATH_EXISTS_ERR:
                      errorMessage += "エラーコード : " + error.code;
                      break;
              }
            alert('ファイル存在確認中にエラーが発生しました。'+errorMessage);
          });
    };

});