app.controller('entryCtr' ,['page_val', function (page_val) {
    //応募画面のコントローラー
    var id=localStorage.getItem('ID');
    var page="select";

    if(device.platform == "iOS"){
        document.getElementById('entryFrame').addEventListener('load',entryLoad);
    }
    //iframe読み込み完了後の処理
    entryFrame.addEventListener('load',entryLoad);
    //iframe読み込み完了後の処理
    function entryLoad () {
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.header_title_img;
        head_news.src=page_val.header_news_img;
        head_setting.src=page_val.header_setting_img;
        // iframeのwindowオブジェクトを取得
        var ifrm = entryFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('entryFrame').contentWindow;
        }
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id };
        var url="";
        if(page=="select"){
            url=page_val.url+"privilege/index.php";
        }
        if(page=="entry"){
            url=page_val.url+"entry/index.php";
            roadingModal.hide();
        }
        ifrm.postMessage(postMessage, url);
        roadingModal.hide();
    }

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        console.log("entryFrameメッセージ受信");
        console.log(event.data);
        switch (event.data["page"]){
            case "select":
                if(event.data["mode"]=="back"){
                    navi.popPage();
                    compBtn.style.visibility="";
                }
                if(event.data["mode"]=="entry"){
                    page="entry";
                }
                break;
            case "entry":
                if(event.data["mode"]=="top"){
                    //応募後は何も選択してない状態に戻す。
                    page_val.spot_id=0;
                    page_val.course_id=0;
                    page_val.rally_id=0;
                    page_val.header_color_code=page_val.default_color_code;
                    page_val.header_title_img=page_val.default_title_img;
                    page_val.header_news_img=page_val.default_news_img;
                    page_val.header_setting_img=page_val.default_setting_img;
                    mainTab.setActiveTab(0);
                    navi.popPage();
                }
                if(event.data["mode"]=="privilege"){
                    page=="select"
                }
                break;
        }
    }, false);
}]);