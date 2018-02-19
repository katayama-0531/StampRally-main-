app.controller('homeCtr', ['$scope', '$http', '$filter', 'page_val', 'get_img_service', function($scope, $http, $filter, page_val, get_img_service){
    roadingModal.show();

    var id = localStorage.getItem('ID');
    var url = "";
    var page = "";

    //TODO:ログイン失敗した時の処理
    // this.loginClick = function() {
    //     login(id, $http);
    // };

    //this.loginInit = function() {
        //通信の為の準備
        app.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
    //};

    if(id=="" || id==null){
        var data = login(id, $http);
        id = data;
    }

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            roadingModal.show();
            console.log("homeタブへ切り替え前");
            homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
            page="";
            page_val.header_color_code="WHITE";
            page_val.header_title_img="img_common/logo_stamprally.png";
            page_val.header_news_img="img_common/head_icon_news.png";
            page_val.header_setting_img="img_common/head_icon_setting.png";
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==0){
            console.log("homeタブへ切り替え完了");
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        //各タブ内のURLを読み込み直す
        homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
        rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
        spotFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/rally/list/index.php";
        couponFrame.scr="http://japan-izm.com/dat/kon/test/stamp/app_view/coupon/index.php";
        starFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/star/index.php";
        if(event.index==0){
            console.log("homeタブが再度押された");
            roadingModal.show();
            //homeタブ内で遷移してスタンプボタンを出していた場合は消す
            if(compBtn.style.visibility==""){
                compBtn.style.visibility="hidden";
            }
            if(stampBtn.style.visibility==""){
                stampBtn.style.visibility="hidden";
            }

            if(page_val.rally_id==0){
                page_val.header_color_code="WHITE";
                page_val.header_title_img="img_common/logo_stamprally.png";
                page_val.header_news_img="img_common/head_icon_news.png";
                page_val.header_setting_img="img_common/head_icon_setting.png";
                page="";
            }
        }
    });

    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',function() {
        console.log("homeiframe読み込み完了");
        //ヘッダーのアイコンもダウンロードしてくる
        if(header.style.backgroundColor!=page_val.header_color_code){
            header.style.backgroundColor=page_val.header_color_code;
            head_icon.src=page_val.header_title_img;
            head_news.src=page_val.header_news_img;
            head_setting.src=page_val.header_setting_img;
        }
        // iframeのwindowオブジェクトを取得
        var ifrm = homeFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id,
            "page":"home"};
        if(page==""){
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/index.php");
            page="rally";
            roadingModal.hide();
        }else if(page=="rally"){
            roadingModal.show();
            //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
            if (device.platform == "Android") {
                var permissions = cordova.plugins.permissions; 
                //permission確認
                permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                    if ( status.hasPermission ) {
                        console.log("位置情報使用許可済み");
                        this.getGps($filter,$http,page_val);
                    } else {
                        console.warn("位置情報使用未許可");
                        permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                        function permissionSuccess (status){
                            if( !status.hasPermission ){
                                permissionError();
                            } else {
                                this.getGps($filter,$http,page_val);
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
                this.getGps($filter,$http,page_val);
            }
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/index.php");
        }else if(page=="list"){
            // iframeのwindowオブジェクトを取得
            var ifrm = homeFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id
            };
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/list/index.php");
            page="";
            roadingModal.hide();
        }else if(page=="spot"){
            // iframeのwindowオブジェクトを取得
            var ifrm = homeFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id
            };
            ifrm.postMessage(postMessage, "http://japan-izm.com/dat/kon/test/stamp/app_view/rally/list/index.php");
            page="";
            roadingModal.hide();
        }
        
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        console.log("homeiframeメッセージ受信");
        if(event.data["page"]=="list"){
            mainTab.setActiveTab(1);
        }
        if(event.data["rally_id"] > 0){
            roadingModal.show();
            page_val.rally_id=event.data["rally_id"];
            page_val.header_color_code=event.data["color_code"];

            var stampName = "stamp" + page_val.rally_id;
            var headName = "head" + page_val.rally_id;
            var stamp = localStorage.getItem(stampName);
            var head = localStorage.getItem(headName);
            if(!stamp){
                console.log("ダウンロード済みファイルが無い");
                // 選択ファイルの読み込み
                var readFilePath = encodeURI('http://japan-izm.com/dat/kon/test/stamp/img/' + page_val.rally_id + '/stamp' + page_val.rally_id + '.json');
                //injectしたいサービスを記述。ngも必要。
                var injector = angular.injector(['ng','stampRallyApp']);
                //injectorからサービスを取得
                var service = injector.get('get_img_service');
                service.leadAndSet(readFilePath).then(function(res){
                    //ダウンロード失敗
                    if(angular.isDefined(res)){
                        //ダウンロード失敗
                        ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
                        homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index.php";
                        rallyFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/index_list.php";
                        roadingModal.hide();
                    }else{
                        //ダウンロード成功
                        console.log("ダウンロード成功");
                        page_val.header_title_img=localStorage.getItem("head" + page_val.rally_id);
                        head_icon.src=page_val.header_title_img;
                        page_val.header_news_img="img_common/head_icon_news_rally.png";
                        page_val.header_setting_img="img_common/head_icon_setting_rally.png";
                    }
                });
            }else{
                page_val.header_title_img=localStorage.getItem("head"+ page_val.rally_id);
                head_icon.src=page_val.header_title_img;
                page_val.header_news_img="img_common/head_icon_news_rally.png";
                page_val.header_setting_img="img_common/head_icon_setting_rally.png";
            }
        }
        if(event.data["course_id"] > 0){
            if(page_val.course_id==0){
                roadingModal.show();
            }else{
                roadingModal.hide();
            }
            page_val.course_id=event.data["course_id"];
            
        }
        if(event.data["stamp_type"]=="complete"){
            compBtn.style.visibility="";
            if(roadingModal.visible){
                roadingModal.hide();
            }
        }else{
            compBtn.style.visibility="hidden";
        }
        if(event.data["spot_id"]){
            if(event.data["spot_id"]!=""){
                stampBtn.style.visibility="hidden";
                if(roadingModal.visible){
                    roadingModal.hide();
                }
            }
        }
        if(event.data["mode"]){
            if(event.data["mode"]!="course"){
                page=event.data["mode"];
            }
            roadingModal.show();
        }
    }, false);

    //スタンプアニメーション終了時のイベント
    stampImg.addEventListener("animationend", function () {
        switch (stampImg.className) {
            case "animated fadeOut":
                //Ajax通信でphpにアクセス
                var url = "http://japan-izm.com/dat/kon/test/stamp/api/pressStamp.php",
                    config = {
                        timeout: 5000
                    };
                var data = page_val.near_spot_data[0];
                data["course_id"]=page_val.course_id;
                data["user_id"]=id;
                var req = {
                    method: 'POST',
                    url: url,
                    data: data
                };
                $http(req).then(function onSuccess(data, status) {
                    //jsondata = JSON.parse(data.data);
                    console.log("スタンプ押印情報通信成功");
                    console.log(data);
                    //スタンプの状態を更新する為読み込み直す
                    homeFrame.src="http://japan-izm.com/dat/kon/test/stamp/app_view/rally/index.php";
                    page="rally";
                    
                }, function onError(data, status) {
                    ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
                    console.log("エラー："+data);
                    console.log("ステータス："+status);
                });
                break;
        }
    });
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
            return data.data[1];
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

function getGps($filter,$http,page_val) {
    //位置情報取得
    var onGpsSuccess = function (position) {
        //この辺りで緯度、経度を送信する
        var id = localStorage.getItem('ID');
        var n = 6; // 小数点第n位まで残す
        //緯度
        var latitude = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //var latitude = 33.5872;
        //経度
        var longitude = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //var longitude = 130.416;
        //高度
        var altitude = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        var accuracy = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var gpsData = {
            user_id: id,
            course_id: page_val.course_id,
            lat: latitude,
            lng: longitude,
            alt: altitude,
            acc: accuracy
        };
        var postData =$filter('json')(gpsData);

        stampSetting(postData, $http,page_val);
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

function stampSetting(postData, $http, page_val) {
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/nearStampSpot.php",
        config = {
            timeout: 5000
        };
    
    var req = {
        method: 'POST',
        url: url,
        data: postData
    };

    $http(req).then(function onSuccess(data, status) {
        //jsondata = JSON.parse(data.data);
            console.log(data.data);
            if(data.data.length==0){
                //近くにスポットは無い
                console.log("近くに表示出来るスポットは無い");
                stampBtn.style.visibility="hidden";
            }else{
                //近くにスポットがある
                console.log("近くに表示可能なスポットがある");
                console.log(data.data);
                page_val.near_spot_data=data.data;
                stampBtn.style.visibility="";
            }
            roadingModal.hide();
    }, function onError(data, status) {
        roadingModal.hide();
        ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
        console.log("エラー："+data.data);
        console.log("ステータス："+status);
    });
}