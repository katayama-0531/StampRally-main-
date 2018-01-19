app.controller('select', ['$scope','img_num', 'get_img_service', '$localStorage', function($scope, img_num, get_img_service, $localStorage) {
    var listItem = [{id: 1, name: 'スタンプラリー1', package: 200}, {id: 2, name: 'スタンプラリー2', package: 200}];
    this.data = listItem;

    var rootDir = cordova.file.dataDirectory;
    if(img_num.num == 0){
       // this.delBtn = disabled;
    }

    this.delete = function(){
        console.log(rootDir);
        var filePath = 'img/' + 1 + '/stamp' + 1 + '.png';
        rootDir.getFile(filePath,{create:false},function(fileEntry){
            //削除実行
            fileEntry.remove();
        },function(){
            alert("Error removing the file " + error.code);
        });

    };

    this.dlClick = function(arg){
        //ダウンロードファイルを保存するパス
        img_num.num = arg;
        var fileFullPath = rootDir + 'img/' + arg + '/stamp' + arg + '.png';

        if($localStorage.$default[0]){
            console.log("デフォルトデータあり");
            console.log(img_num.img_list);
            navi.replacePage("html/slide-menu.html");
        }else{
            console.log("デフォルトデータなし");
            // 選択ファイルの読み込み
            var filePath = encodeURI('http://japan-izm.com/dat/kon/test/stamp/img/' + img_num.num + '/stamp' + img_num.num + '.json');

            //injectしたいサービスを記述。ngも必要。
            var injector = angular.injector(['ng','app']);
            //injectorからサービスを取得
            var service = injector.get('get_img_service');
            service.leadAndSet(filePath).then(function(res){
                //jsonList = JSON.parse(res);
                img_num.img_list = res;
                //$scope.show_loading = false; // ローディング中、を非表示へ
                console.log(img_num.img_list);
                navi.replacePage("html/slide-menu.html");
            });
        };
    };
}]);