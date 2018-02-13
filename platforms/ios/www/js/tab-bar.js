import { worker } from "cluster";

app.controller('tabCtr', ['$scope', 'page_val', 'get_img_service', 'get_json_service', function ($scope, page_val, get_img_service, get_json_service) {
    //タブバー、ヘッダーメニューのコントローラー
    this.settingTouch=function(){
        mainTab.setActiveTab(0);
        navi.pushPage("html/setting.html");
    }
    this.newsTouch=function(){
        mainTab.setActiveTab(0);
        if(navi.pages[navi.pages.length-1]["id"] == 'newsPage'){
            navi.resetToPage("html/home.html");
        }else{
            navi.pushPage("html/news.html");
            roadingModal.show();
        }
    }
    this.iconTouch=function(){
        mainTab.setActiveTab(0);
        if(navi.pages.length >= 2){
            navi.resetToPage("html/home.html");
        }
    }
    this.compTouch=function(){
        console.log("応募ボタンタッチ");
    }
    this.stampTouch=function(){
        console.log("スタンプを押すボタンタッチ");
        // //injectしたいサービスを記述。ngも必要。
        // var injector = angular.injector(['ng','stampRallyApp']);
        // //injectorからサービスを取得
        // var service = injector.get('get_json_service');
        // service.all().then(function(res){
        //     var jsonItem = res;
        //     if(res.status==404){
        //         console.log("読み込み失敗");
        //     }else{
        //         console.log("読み込み成功");
        //     }
        // });
        // var fileName = page_val.course_id + '.json';
        // window.resolveLocalFileSystemURL(page_val.img_URL, function(fileSystem) {
        //     if(fileSystem.isFile){
        //         fileSystem.getFile(fileName, {create: true}, function (fileEntry) {
        //             fileEntry.file(function (file){
        //                var img = readAsText(file);
        //                console.log('files ファイル読み込み 成功');
        //             }, function(error) {
        //                 console.log('files ファイル読み込み エラー', error.code);
        //               });
        //         }, function(error) {
        //             console.log('files ファイル取得 エラー', error.code);
        //           });

        //     }
        // }, function(error) {
        //     console.log('files ディレクトリ操作 エラー', error.code);
        //   });
    }
}]);