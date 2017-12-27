app.controller('select', ['$scope', function($scope) {
    
    var listItem = [{id: 1, name: 'スタンプラリー1', package: 200}, {id: 2, name: 'スタンプラリー2', package: 200}];
    this.data = listItem;

    this.dlClick = function(arg){
        //ダウンロードファイルを保存するパス(cordova.file.applicationStorageDirectoryに保存したほうがいい)
        //var rootDir = fileSystem.root.toURL();
        var rootDir = cordova.file.applicationDirectory;
        var fileFullPath = rootDir + 'img/' + arg + '/stamp' + arg + '.png';

        // window.resolveLocalFileSystemURL(fileFullPath, function(fileSystem) {
        //     if(fileSystem.isFile) {
        //       console.log(fileFullPath + ' ファイルが存在する');
        //     }
        //     else {
        //       console.log(fileFullPath + ' ファイルが存在しない');
        //     }
        //   }, function(error) {
        //     console.log('ファイル存在確認中にエラーが発生', error.code);
        //   });

        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

        //     console.log('file system open: ' + fs.name);
        //     fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
        
        //         console.log("fileEntry is file?" + fileEntry.isFile.toString());
        //         // fileEntry.name == 'someFile.txt'
        //         // fileEntry.fullPath == '/someFile.txt'
        //         writeFile(fileEntry, null);
        
        //     }, function(e){

        //     });
        
        // }, function(e){
                
        //     });
        //ダウンロード予定のファイルが存在するか確認
       window.resolveLocalFileSystemURL(fileFullPath, function(fileSystem) {
            if(fileSystem.isFile) {
                //ファイルが存在するため、ダウンロードせずに次の画面に遷移する
                this.replace(arg);
            } 
          }, function(error) {
              //ファイルが存在しないため、ダウンロードして次の画面に遷移する
              var fileTransfer = new FileTransfer();
              //ダウンロードするURL
              var url = encodeURI('http://japan-izm.com/var/www/htnl/dat/kon/test/stamp/img/' + arg + '/stamp' + arg + '.png');
              console.log(url);
              fileTransfer.download(url, fileFullPath, function(entry) {
                  //ダウンロード成功
                  this.replace(arg);
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
          });
    };
}]);

function replace(arg){
    // 選択ファイルの読み込み
    var filePath = cordova.file.applicationStorageDirectory + 'img/' + arg + '/stamp' + arg + '.json';
    httpObj = new XMLHttpRequest();
    httpObj.open("get", filePath, true);
    httpObj.onload = function(){
            var myData = JSON.parse(this.responseText);
            var txt = "";
            console.log(myData);
            for (var i=0; i<myData.length; i++){
               var option = document.createElement("option");
                option.innerText = myData[i].name;
                option.value=myData[i].value;
                document.getElementById("group_select").appendChild(option); 
                navi.replacePage("html/slide-menu.html");
            }
        }
   httpObj.send(null);
}