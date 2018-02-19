app.controller('entryCtr' ,['$scope', 'page_val', function ($scope, page_val) {
    //応募画面のコントローラー
    var id = localStorage.getItem('ID');
    //iframe読み込み完了後の処理
    entryFrame.addEventListener('load',function() {
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.header_title_img;
        head_news.src=page_val.header_news_img;
        head_setting.src=page_val.header_setting_img;
        // iframeのwindowオブジェクトを取得
        var ifrm = entryFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id };
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/entry/index_inp.php");
        //roadingModal.hide();
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        console.log("entryFrameメッセージ受信");
        if(event.data["button"]=="top"){
            //応募後は何も選択してない状態に戻す。
            page_val.spot_id=0;
            page_val.course_id=0;
            page_val.rally_id=0;
            mainTab.setActiveTab(0);
            navi.popPage();
        }
    }, false);
}]);