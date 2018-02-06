app.controller('rallyCtr', ['$scope', 'page_val', 'get_img_service', function($scope, page_val, get_img_service) {
    //ラリー帳画面のコントローラー
    var id = localStorage.getItem('ID');

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==1){
            rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
            page_val.header_color_code="WHITE";
            page_val.header_title_img="logo_stamprally.png";
            page_val.header_news_img="head_icon_news.png";
            page_val.header_setting_img="head_icon_setting.png";
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==1){
            rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
            page_val.header_color_code="WHITE";
            page_val.header_title_img="logo_stamprally.png";
            page_val.header_news_img="head_icon_news.png";
            page_val.header_setting_img="head_icon_setting.png";
        }
    });
    
    //iframe読み込み完了後の処理
    rallyFrame.addEventListener('load',function() {
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.img_pass+page_val.header_title_img;
        head_news.src=page_val.img_pass+page_val.header_news_img;
        head_setting.src=page_val.img_pass+page_val.header_setting_img;
        // iframeのwindowオブジェクトを取得
        var ifrm = rallyFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php");
    });

    // メッセージ受信イベント(home-viewで受信する)
    // window.addEventListener('message', function(event) {
    //     if(event.data["course_id"] > 0){
    //         //TODO:ヘッダーのアイコンもダウンロードしてくる
    //         page_val.course_id=event.data["course_id"];
    //         console.log("カラーコード"+page_val.header_color_code);

    //         // 選択ファイルの読み込み
    //         var filePath = encodeURI('http://japan-izm.com/dat/kon/test/stamp/img/' + event.data["course_id"] + '/stamp' + event.data["course_id"] + '.json');
    //             //injectしたいサービスを記述。ngも必要。
    //         var injector = angular.injector(['ng','stampRallyApp']);
    //         //injectorからサービスを取得
    //         var service = injector.get('get_img_service');
    //         service.leadAndSet(filePath).then(function(res){
    //             ///ダウンロード失敗
    //             if(res["name"] === "Error"){
    //                 ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
    //                 rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
    //             }else{
    //                 page_val.header_title_img="tit_chikugositikoku.png";
    //                 page_val.header_news_img="head_icon_news_rally.png";
    //                 page_val.header_setting_img="head_icon_setting_rally.png";
    //                 page_val.header_color_code=event.data["color_code"];
    //             }
    //         });
    //     }
    // }, false);

}]);