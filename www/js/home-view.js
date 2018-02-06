app.controller('homeCtr', ['$scope', '$http', 'page_val', 'get_img_service', function($scope, $http, page_val, get_img_service){
    roadingModal.show();

    var id = localStorage.getItem('ID');
    var url = "";

    $scope.loginClick = function() {
        login(id, $http);
    };

    $scope.loginInit = function() {
        //ログインの通信の為の準備
        app.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
    };

    //JavaScriptからネイティブ機能へアクセスが可能になった時の処理
    document.addEventListener("deviceready", function() {
        if(id==""){
            var data = login(id, $http);
            id = data[1];
        }
    });

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            //homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
            page_val.header_color_code="WHITE";
            page_val.header_title_img="logo_stamprally.png";
            page_val.header_news_img="head_icon_news.png";
            page_val.header_setting_img="head_icon_setting.png";
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==0){
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
            page_val.header_color_code="WHITE";
            page_val.header_title_img="logo_stamprally.png";
            page_val.header_news_img="head_icon_news.png";
            page_val.header_setting_img="head_icon_setting.png";
        }
    });

    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',function() {
        console.log("homeiframe読み込み完了");
        //TODO:ヘッダーのアイコンもダウンロードしてくる
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.img_pass+page_val.header_title_img;
        head_news.src=page_val.img_pass+page_val.header_news_img;
        head_setting.src=page_val.img_pass+page_val.header_setting_img;
        // iframeのwindowオブジェクトを取得
        var ifrm = homeFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =id;
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index.php");
        roadingModal.hide();
    });

    

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="list"){
            mainTab.setActiveTab(1);
        }
        if(event.data["course_id"] > 0){
            page_val.course_id=event.data["course_id"];
            console.log("カラーコード"+page_val.header_color_code);

            // 選択ファイルの読み込み
            var filePath = encodeURI('http://japan-izm.com/dat/kon/test/stamp/img/' + event.data["course_id"] + '/stamp' + event.data["course_id"] + '.json');
                //injectしたいサービスを記述。ngも必要。
            var injector = angular.injector(['ng','stampRallyApp']);
            //injectorからサービスを取得
            var service = injector.get('get_img_service');
            service.leadAndSet(filePath).then(function(res){
                ///ダウンロード失敗
                if(res["name"] === "Error"){
                    ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
                    homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
                    rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
                }else{
                    page_val.header_title_img="tit_chikugositikoku.png";
                    page_val.header_news_img="head_icon_news_rally.png";
                    page_val.header_setting_img="head_icon_setting_rally.png";
                    page_val.header_color_code=event.data["color_code"];
                }
            });
        }
    }, false);

}]);

function login(id, $http) {
    //ログイン処理
    var postData = null;
    if (id) {
        postData = {
            userId: id
        };
    }
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/login.php",
        config = {
            timeout: 5000
        };
    
    var req = {
        method: 'POST',
        url: url,
        data: postData
    };

    $http(req).then(function onSuccess(data, status) {
        if (data.data[0] == "success") {
            localStorage.setItem("ID", data.data[1]);
            return data.data;
        } else {
            roadingModal.hide();
            ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
            console.log(data);
        }
    }, function onError(data, status) {
        roadingModal.hide();
        ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
        console.log("エラー："+data.data);
        console.log("ステータス："+status);
    });
}