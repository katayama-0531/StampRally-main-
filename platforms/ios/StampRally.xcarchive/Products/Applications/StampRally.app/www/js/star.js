app.controller('starCtr', ['$scope','$filter','$http','page_val', function($scope,$filter,$http,page_val) {
    //お気に入り画面のコントローラー
    var id = localStorage.getItem('ID');
    var page = "";

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==4){
            starFrame.src=page_val.url+"star/index.php";
            // iframeのwindowオブジェクトを取得
            var ifrm = starFrame.contentWindow;
            // 外部サイトにメッセージを投げる
            var postMessage =id;
            ifrm.postMessage(postMessage, page_val.url+"star/index.php");
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==4){
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==4){
            starFrame.src=page_val.url+"star/index.php";
        }
    });

    //iframe読み込み完了後のイベント
    starFrame.addEventListener('load',function() {
        console.log("starFrame読み込み完了");
        // iframeのwindowオブジェクトを取得
        var ifrm = starFrame.contentWindow;
        // // 外部サイトにメッセージを投げる
        // var postMessage =id;
        // ifrm.postMessage(postMessage, page_val.url+"star/index.php");
        if(mainTab.getActiveTabIndex()==4){
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "rally_id":page_val.rally_id,
                "course_id":page_val.course_id,
                "page":"home"};
            switch(page){
                case "":
                case angular.isUndefined(page):
                    ifrm.postMessage(postMessage, page_val.url+"star/index.html");
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
                        "rally_id":page_val.rally_id,
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
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "page":"home",
                        "mode":"stop"};
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    });

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==4){
            console.log("stariframeメッセージ受信");
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
                        checkStampGps();
                    }
                    break;

                case "coupon":
                    page_val.coupon="detail";
                    page_val.spot_id=event.data["spot_id"];
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
                            roadingModal.hide();
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
                            page_val.rally_mode="stop";
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
                        case "back":
                        break;
                        default:
                            page="rally";
                            if(page_val.stamp_comp_flg==0){
                                checkStampGps();
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
                case "maintenance":
                    page_val.maintenance=1;
                    $scope.tab=false;
                    roadingModal.hide();
                    break;
                
            }
        }
    }, false);
    function checkStampGps(){
        //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
        if (device.platform == "Android") {
            var permissions = cordova.plugins.permissions; 
            //permission確認
            permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                if ( status.hasPermission ) {
                    console.log("位置情報使用許可済み");
                    this.getStapGps($filter,$http,page_val);
                } else {
                    console.warn("位置情報使用未許可");
                    permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                    function permissionSuccess (status){
                        if( !status.hasPermission ){
                            permissionError();
                        } else {
                            console.log("位置情報使用許可した");
                            this.getStapGps($filter,$http,page_val);
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
            this.getStapGps($filter,$http,page_val);
        }
    }
}]);

function getStapGps($filter,$http,page_val) {
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

        starStampSetting(postData, $http,page_val);
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

function starStampSetting(postData, $http, page_val) {
    //Ajax通信でphpにアクセス
    var url = page_val.root_url+"api/nearStampSpot.php",
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