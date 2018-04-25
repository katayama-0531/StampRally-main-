app.controller('rallyCtr', ['page_val', function(page_val) {
    //ラリー帳画面のコントローラー
    var id = localStorage.getItem('ID');
    var page = "";
    page_val.header_color_code=page_val.default_color_code;
    page_val.header_title_img=page_val.default_title_img;
    page_val.header_news_img=page_val.default_news_img;
    page_val.header_setting_img=page_val.default_setting_img;

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.rallyTab){
            rallyFrame.src=page_val.url+"index_list.php";
            if (device.platform == "iOS") {
                document.getElementById('rallyFrame').src=page_val.url+"index_list.php";
                document.getElementById('rallyFrame').addEventListener('load',rallyLoad);
            }
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.style.visibility="hidden";
            compBtn.style.visibility="hidden";
        }
    });
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.rallyTab){
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==page_val.rallyTab){
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.style.visibility="hidden";
            compBtn.style.visibility="hidden";
            rallyFrame.src=page_val.url+"index_list.php";
            if (device.platform == "iOS") {
                document.getElementById('rallyFrame').src=page_val.url+"index_list.php";
                document.getElementById('rallyFrame').addEventListener('load',rallyLoad);
            }
        }
    });
    
    //iframe読み込み完了後の処理
    rallyFrame.addEventListener('load',rallyLoad);
    if (device.platform == "iOS") {
        document.getElementById('rallyFrame').addEventListener('load',rallyLoad);
    }

    function rallyLoad(){
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.header_title_img;
        head_news.src=page_val.header_news_img;
        head_setting.src=page_val.header_setting_img;
        console.log("rallyFrame読み込み完了");
        // iframeのwindowオブジェクトを取得
        var rallyifrm = rallyFrame.contentWindow;
        if(!rallyifrm){
            rallyifrm=document.getElementById('rallyFrame').contentWindow;
        }
        if(page_val.rally_mode!="stop"){
                // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "course_id":page_val.course_id,
                "rally_id":page_val.rally_id,
                "spot_id":page_val.spot_id,
                "page":"rally"};
            if(mainTab.getActiveTabIndex()==page_val.rallyTab){
                if(page==""){
                    rallyifrm.postMessage(postMessage, page_val.url+"index_list.php");
                    page="rally";
                }else{
                    if(page_val.rally_mode=="map"){
                        rallyifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    }else{
                        rallyifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    }
                }
            }
        }else{
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "course_id":page_val.course_id,
                "rally_id":page_val.rally_id,
                "spot_id":page_val.spot_id,
                "mode":"stop"};
            if(mainTab.getActiveTabIndex()==page_val.rallyTab){
                if(page==""){
                    rallyifrm.postMessage(postMessage, page_val.url+"index_list.php");
                    page="rally";
                }else{
                    rallyifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                }
            }
        }
        roadingModal.hide();
    }
}]);