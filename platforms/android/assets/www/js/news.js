app.controller('newsCtr' ,[function () {
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
    //             "course_id":page_val.course_id,
    //             "rally_id":page_val.rally_id,
    //             "spot_id":page_val.spot_id
    //          };
    //         ifrm.postMessage(postMessage, page_val.url+"index.php");
    //     }
    // });
}]);