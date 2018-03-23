app.controller('spotCtr', ['$scope','$http', '$filter', 'page_val', '$timeout', function($scope,$http, $filter, page_val, $timeout) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            roadingModal.show();
            page_val.rally_mode="";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==2){
            page_val.rally_mode="";
        }
    });

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index!=2){
            if(compBtn.visible){
                compBtn.hide();
            }
            if(stampBtn.visible){
                stampBtn.hide();
            }
        }

        if(event.index==2){
            roadingModal.show();
            spotFrame.src=page_val.url+"nearby/index.php";
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    spotFrame.addEventListener('load',function() {
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        if(mainTab.getActiveTabIndex()==2){
            console.log("spotFrame読み込み完了");
            roadingModal.show();
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "rally_id":page_val.rally_id,
                "course_id":page_val.course_id,
                "spot_id":page_val.spot_id,
                "lat":page_val.lat,
                "lng":page_val.lng,
                "page":"spot"
            };
            switch(page_val.rally_mode){
                case "":
                    checkSpotGps();
                    break;
                case "spot":
                    var postMessage =
                    {   "user":id
                    };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    page_val.rally_mode="";
                    roadingModal.hide();
                    break;
                case "rally":
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    roadingModal.hide();
                    break;
                case "stamp":
                    mainTab.setActiveTab(1);
                    roadingModal.hide();
                    break;
                case "list":
                    postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "spot_id":page_val.spot_id
                    };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    roadingModal.hide();
                    break;
                case "map":
                    checkSpotGps();
                    break;
                case "detail":
                    postMessage =
                            {   "user":id,
                                "rally_id":page_val.rally_id,
                                "course_id":page_val.course_id,
                                "spot_id":page_val.spot_id,
                                "page":"stop"
                            };
                    ifrm.postMessage(postMessage, page_val.url+"rally/detail.html");
                    roadingModal.hide();
                    break;
                case "list_detail":
                    postMessage =
                        {   "user":id,
                            "rally_id":page_val.rally_id,
                            "course_id":page_val.course_id,
                            "spot_id":page_val.spot_id,
                            "page":"stop"
                        };
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
    function checkSpotGps(){
        //位置情報取得(パーミッション周りはiOSとAndroidで異なる為処理を分ける)
        if (device.platform == "Android") {
            var permissions = cordova.plugins.permissions; 
            //permission確認
            permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                if ( status.hasPermission ) {
                    console.log("位置情報使用許可済み");
                    this.getSpotGps($filter,$http,page_val);
                } else {
                    console.warn("位置情報使用未許可");
                    permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, permissionSuccess, permissionError);
                    function permissionSuccess (status){
                        if( !status.hasPermission ){
                            permissionError();
                        } else {
                            console.log("位置情報使用許可した");
                            this.getSpotGps($filter,$http,page_val);
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
            this.getSpotGps($filter,$http,page_val);
        }
    }
}]);

function getSpotGps($filter,$http,page_val) {
    //位置情報取得
    var onGpsSuccess = function (position) {
        //この辺りで緯度、経度を送信する
        // 小数点第n位まで残す
        var n = 6;
        page_val.lat = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        //緯度 TODO:テスト用
        //0.00277778;
        // page_val.lat = 33.1791;
        page_val.lng = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        //経度　TODO:テスト用
        // page_val.lng = 130.4217;
        //高度
        page_val.alt = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        //位置精度
        page_val.acc = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var postMessage={
            "user":localStorage.getItem('ID'),
            "rally_id":page_val.rally_id,
            "course_id":page_val.course_id,
            "lat":page_val.lat,
            "lng":page_val.lng,
            "page":"near"
        }
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        switch(page_val.rally_mode){
            case "map":
                ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
            break;
            default:
                ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                break;
        }
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
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError,{timeout: 20000, enableHighAccuracy: true});
}

