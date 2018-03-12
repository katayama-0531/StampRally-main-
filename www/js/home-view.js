app.controller('homeCtr', ['$scope', '$http', '$filter', 'page_val', 'get_img_service', function($scope, $http, $filter, page_val, get_img_service){
    roadingModal.show();
    stampBtn.hide();
    stampBtn.hidden=false;
    compBtn.hide();
    compBtn.hidden=false;

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
            homeFrame.src=page_val.url+"index.php";
            page="";
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.hide();
            compBtn.hide();
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
        if(navi.pages.length >= 1){
            navi.resetToPage("html/home.html");
        }else{
            homeFrame.src=page_val.url+"index.php";
        }
        //各タブ内のURLを読み込み直す
        rallyFrame.src=page_val.url+"index_list.php";
        spotFrame.src=page_val.url+"nearby/index.php";
        couponFrame.scr=page_val.url+"coupon/index.php";
        starFrame.src=page_val.url+"star/index.php";
        if(event.index==0){
            console.log("homeタブが再度押された");                                                                                                                                                                        
            roadingModal.show();

            compBtn.hide();
            stampBtn.hide();

            if(page_val.rally_id!=0){
                page_val.rally_id=0;
                page_val.course_id=0;
                page_val.spot_id=0;
                page_val.header_color_code=page_val.default_color_code;
                page_val.header_title_img=page_val.default_title_img;
                page_val.header_news_img=page_val.default_news_img;
                page_val.header_setting_img=page_val.default_setting_img;
                page="";
            }
        }
    });

    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',function() {
        console.log("homeiframe読み込み完了");
        roadingModal.show();
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
        switch(page){
            case "":
            case angular.isUndefined(page):
                var url=page_val.url+"index.php";
                ifrm.postMessage(postMessage, "http://153.127.242.178/dat/kon/test/stamp/app_view/index.php");
                roadingModal.hide();
                break;
            case "rally":
                ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                roadingModal.hide();
                break;
            case "stamp":
                ifrm.postMessage(postMessage, page_val.url+"stamp/index.php");
                break;
            case "list":
                ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                roadingModal.hide();
                break;
            case "spot":
                ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                roadingModal.hide();
                break;
            case "map":
                postMessage={
                    "user":id,
                    "course_id":page_val.course_id,
                    "page":"home",
                    "lat":page_val.lat,
                    "lng":page_val.lng
                }
                ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                break;
            case "detail":
                ifrm.postMessage(postMessage, page_val.url+"rally/detail.html");
                roadingModal.hide();
                break;
            case "list_detail":
                ifrm.postMessage(postMessage, page_val.url+"rally/list/detail.html");
                roadingModal.hide();
                break;
            default:
                var postMessage =
                {   "user":id,
                    "course_id":page_val.course_id,
                    "page":"home",
                    "mode":"stop"};
                ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                roadingModal.hide();
                break;
        }
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        console.log("homeiframeメッセージ受信");
        console.log(event.data);
        roadingModal.show();
        if($.type(event.data)=="string"){
            roadingModal.hide();
        }else{
            page_val.rally_mode='';
        }
        switch (event.data["page"]){
            case "home":
                page="rally";
                break;
            
            case "list":
                mainTab.setActiveTab(1);
                roadingModal.hide();
                break;
            
            case "stamp":
                page_val.spot_id=event.data["spot_id"];
                if(page_val.stamp_comp_flg==0){
                    checkGps();
                }
                break;

            case "coupon":
                page_val.coupon="detail";
                mainTab.setActiveTab(3);
                break;
            
            case "rally":
                page_val.spot_id=0;
                page_val.rally_mode=event.data["mode"];
                if(!angular.isUndefined(event.data["course_id"])){
                    page_val.course_id=event.data["course_id"];
                }
                
                if(event.data["stamp_type"]=="comp"){
                    compBtn.show();
                    stampBtn.hide();
                    page_val.stamp_comp_flg=1;
                    if(roadingModal.visible){
                        roadingModal.hide();
                    }
                }else{
                    compBtn.hide();
                    page_val.stamp_comp_flg=0;
                }
                switch (event.data["mode"]){
                    case "list":
                        page="list";
                        if(mainTab.getActiveTabIndex()==2){
                            var ifrm = homeFrame.contentWindow;
                            // // 外部サイトにメッセージを投げる
                            // var postMessage =
                            // {   "user":id,
                            //     "course_id":page_val.course_id,
                            //     "page":"home"};
                            // ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                            roadingModal.hide();
                        }
                        break;
                    case "map":
                        page="map";
                        break;
                    case "map_visible":
                        roadingModal.hide();
                        break;
                    case "course":
                        page="rally";
                        stampBtn.hide();
                        break;
                    case "spot":
                        page="stamp";
                        stampBtn.hide();
                        break;
                    case "stop":
                        page="stop";
                        break;
                    case "privilege":
                        stampBtn.hide();
                        compBtn.hide();
                        page="stop";
                        break;
                    case "detail":
                        page="detail";
                    break;
                    case "list_detail":
                        page="list_detail";
                    break;
                    case "spot_touch":
                        var positionArray = event.data["position"].split(",");
                        var position ={
                            "map_lat":positionArray[0].slice(1),
                            "map_lng":positionArray[1].slice(0,-1)
                        };
                        page_val.near_spot_data[0]=position ;
                        roadingModal.hide();
                    break;
                    default:
                        page="rally";
                        if(page_val.stamp_comp_flg==0){
                            checkGps();
                        }
                        break;
                }
                if(event.data["spot_id"]){
                    page_val.spot_id=event.data["spot_id"]
                    stampBtn.hide();
                }
                break;
            case "near_spot":
                mainTab.setActiveTab(2);
                page_val.spot_id=event.data["spot_id"]
                break;
            
        }
        if(event.data["rally_id"] > 0){
            page_val.rally_id=event.data["rally_id"];
            page_val.header_color_code=event.data["color_code"];

            var stampName = "stamp" + page_val.rally_id;
            var headName = "head" + page_val.rally_id;
            var stamp = localStorage.getItem(stampName);
            var head = localStorage.getItem(headName);
            if(!stamp){
                console.log("ダウンロード済みファイルが無い");
                // 選択ファイルの読み込み
                var readFilePath = encodeURI('http://153.127.242.178/dat/kon/test/stamp/img/' + page_val.rally_id + '/stamp' + page_val.rally_id + '.json');
                //injectしたいサービスを記述。ngも必要。
                var injector = angular.injector(['ng','stampRallyApp']);
                //injectorからサービスを取得
                var service = injector.get('get_img_service');
                service.leadAndSet(readFilePath).then(function(res){
                    //ダウンロード失敗
                    if(angular.isDefined(res)){
                        //ダウンロード失敗
                        ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
                        homeFrame.src=page_val.url+"index.php";
                        rallyFrame.src=page_val.url+"index_list.php";
                        roadingModal.hide();
                    }else{
                        //ダウンロード成功
                        console.log("ダウンロード成功");
                        page_val.header_title_img=localStorage.getItem("head" + page_val.rally_id);
                        head_icon.src=page_val.header_title_img;
                        page_val.header_news_img="img_common/header/header-news.png";
                        page_val.header_setting_img="img_common/header/header-hamb-menu.png";
                    }
                });
            }else{
                page_val.header_title_img=localStorage.getItem("head"+ page_val.rally_id);
                head_icon.src=page_val.header_title_img;
                page_val.header_news_img="img_common/header/header-news.png";
                page_val.header_setting_img="img_common/header/header-hamb-menu.png";
            }
        }
    }, false);

    //スタンプアニメーション終了時のイベント
    stampImg.addEventListener("animationend", function () {
        roadingModal.show();
        switch (stampImg.className) {
            case "animated bounceInDown":
                stampImg.className = "animated fadeOut";
                break;
            case "animated fadeOut":
                //全てのアニメーションが終了したら画像を消す
                stampImg.src="";
                stampImg.className = "";
                stampImg.style.visibility="hidden";
                //Ajax通信でphpにアクセス
                var url = "http://153.127.242.178/dat/kon/test/stamp/api/pressStamp.php",
                    config = {
                        timeout: 5000
                    };
                var data = page_val.near_spot_data[0];
                data["course_id"]=page_val.course_id;
                data["user_id"]=id;
                data["lat"]=page_val.lat;
                data["lng"]=page_val.lng;
                data["alt"]=page_val.alt;
                data["acc"]=page_val.acc;
                var req = {
                    method: 'POST',
                    url: url,
                    data: data
                };
                $http(req).then(function onSuccess(data, status) {
                    console.log("スタンプ押印情報通信成功");
                    console.log(data);
                    // iframeのwindowオブジェクトを取得
                    var ifrm = homeFrame.contentWindow;
                    // 外部サイトにメッセージを投げる
                    var postMessage =
                    {   "spot_id":Number(page_val.near_spot_data[0]["id"]),
                        "course_id":page_val.course_id,
                        "mode":data.data["result"]
                    };
                    //送信するデータを近くのスポット配列から消す
                    page_val.near_spot_data.splice(0,1);
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    if(page_val.near_spot_data.length < 1){
                        //押せるスタンプが無いので非表示にする
                        stampBtn.hide();
                    }
                    if(data.data["result"]=="comp"){
                        //コンプリートしたので応募ボタンを表示
                        compBtn.show();
                    }else if(data.data["result"]=="true"){
                        compBtn.hide();
                    }
                    roadingModal.hide();     
                }, function onError(data, status) {
                    ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
                    console.log("エラー："+data);
                    console.log("ステータス："+status);
                });
                break;

            default:
                roadingModal.hide();
                break;
        }
    });

    function checkGps(){
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
                            console.log("位置情報使用許可した");
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
    }
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
    var url = "http://153.127.242.178/dat/kon/test/stamp/api/login.php",
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
        // 小数点第n位まで残す
        var n = 6;
        page_val.lat = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //緯度 TODO:テスト用
        //page_val.lat = 33.5872;
        page_val.lng = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //経度　TODO:テスト用
        //page_val.lng = 130.416;
        //高度
        page_val.alt = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        page_val.acc = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var gpsData = {
            user_id: id,
            course_id: page_val.course_id,
            spot_id: page_val.spot_id,
            lat: page_val.lat,
            lng: page_val.lng,
            alt: page_val.alt,
            acc: page_val.acc
        };
        console.log(gpsData);
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
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError,{timeout: 20000, enableHighAccuracy: true});
}

function stampSetting(postData, $http, page_val) {
    //Ajax通信でphpにアクセス
    var url = "http://153.127.242.178/dat/kon/test/stamp/api/nearStampSpot.php",
        config = {
            timeout: 5000
        };
    
    var req = {
        method: 'POST',
        url: url,
        data: postData
    };

    $http(req).then(function onSuccess(data, status) {
            if(data.data.length==0){
                //近くにスポットは無い
                console.log("近くに表示出来るスポットは無い");
                stampBtn.hide();
            }else{
                //近くにスポットがある
                console.log("近くに表示可能なスポットがある");
                console.log(data.data);
                page_val.near_spot_data=data.data;
                stampBtn.show()
            }
            page="";
            roadingModal.hide();
    }, function onError(data, status) {
        roadingModal.hide();
        ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
        console.log("エラー："+data.data);
        console.log("ステータス："+status);
    });
}