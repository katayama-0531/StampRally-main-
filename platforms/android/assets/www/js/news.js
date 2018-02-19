app.controller('newsCtr' ,['$scope', function ($scope) {
    //ニュース画面のコントローラー
    navi.on('postpush',function(event){
        if(event.enterPage=='newsPage'){
            roadingModal.hide();
        }
    });

    // navi.on('prepush',function(event){
    //     if(event.enterPage=='newsPage'){
    //         // iframeのwindowオブジェクトを取得
    //         var ifrm = homeFrame.contentWindow;
    //         // 外部サイトにメッセージを投げる
    //         var postMessage =
    //         {   "user":id,
    //             "course_id":page_val.course_id};
    //         ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index.php");
    //     }
    // });
}]);