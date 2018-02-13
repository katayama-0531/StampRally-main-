app.controller('homeCtr', ['$scope', '$http', '$filter', 'page_val', 'get_img_service', function($scope, $http, $filter, page_val, get_img_service){
    roadingModal.show();

    var id = localStorage.getItem('ID');
    var url = "";
    var page = "";

    // this.loginClick = function() {
    //     login(id, $http);
    // };

    this.loginInit = function() {
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
            page="";
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
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
            page="";
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
        if(page==""){
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index.php");
            page="rally";
            roadingModal.hide();
        }else{
            //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
            if (device.platform == "Android") {
                var permissions = cordova.plugins.permissions; 
                //permission確認
                permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                    if ( status.hasPermission ) {
                        console.log("位置情報使用許可済み");
                        this.getGps($filter);
                    } else {
                        console.warn("位置情報使用未許可");
                        permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                        function permissionSuccess (status){
                            if( !status.hasPermission ){
                                permissionError();
                            } else {
                                getGps($filter);
                            }
                        };
                        function permissionError (){
                            console.warn('許可されなかった...');
                            stampPageReset();
                            ons.notification.alert({ message: "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。", title: "エラー", cancelable: true });
                            roadingModal.hide();
                        };
                    }
                });
            }else{
                getGps($filter);
            }
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/index.php");
        }
        
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(event.data["page"]=="list"){
            mainTab.setActiveTab(1);
        }
        if(event.data["course_id"] > 0){
            roadingModal.show();
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
        switch (event.data["stamp_type"]){
            case "complete":
                compBtn.style.visibility="";
                stampBtn.style.visibility="hidden";
                break;
            case "stamp":
                compBtn.style.visibility="hidden";
                stampBtn.style.visibility="";
                break;
            default:
                compBtn.style.visibility="hidden";
                stampBtn.style.visibility="hidden";
                break;
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

function getGps($filter) {
    //位置情報取得
    var onGpsSuccess = function (position) {
        //この辺りで緯度、経度を送信する
        var id = localStorage.getItem('ID');
        var n = 6; // 小数点第n位まで残す
        //緯度
        var latitude = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //経度
        var longitude = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //高度
        var altitude = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        var accuracy = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var gpsData = {
            "userId": id,
            "lat": latitude,
            "lng": longitude,
            "alt": altitude,
            "acc": accuracy
        };
        
        // iframeのwindowオブジェクトを取得
        var ifrm = homeFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =$filter('json')(gpsData);
        console.log(postMessage);
        ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/index.php");
        roadingModal.hide();
    };

    var onGpsError = function (message) {
        //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
     
   setTimeout(function () {
            // エラーコードのメッセージを定義
            var errorMessage = {
                0: "原因不明のエラーが発生しました。",
                1: "位置情報の取得が許可されませんでした。",
                2: "電波状況などで位置情報が取得できませんでした。",
                3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
            };
            // エラーコードに合わせたエラー内容をアラート表示
            ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
        }, 0);
        roadingModal.hide();
    };
    //位置情報取得
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
}