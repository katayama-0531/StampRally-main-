app.controller('couponCtr', ['$timeout', '$q', 'page_val', 'get_permission_service', 'get_http_service', function($timeout, $q, page_val, get_permission_service, get_http_service) {

    //クーポン画面のコントローラー
    var id = localStorage.getItem('ID');
    var spotId = 0;
    var page="";

    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var permission = injector.get('get_permission_service');
    var httpService = injector.get('get_http_service');


    var permissionCheck= function() {
        var deferred = $q.defer();
        $timeout(function() {
            permission.getPermission(deferred);
        }, 0)
        return deferred.promise;
    }

    var gpsCheck = function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            permission.getGps(deferred, id);
        }, 0)
        return deferred.promise;
    }

    var nearSpot= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearSpot(deferred, data);
        }, 0)
        return deferred.promise;
    }

    var nearCoupon= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearCoupon(deferred, data);
        }, 0)
        return deferred.promise;
    }

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==3){
            console.log("couponタブへ切り替え前");
            compBtn.style.visibility="hidden";
            stampBtn.style.visibility="hidden";
            page="";
            page_val.coupon="";
            couponFrame.scr=page_val.url+"coupon/index.php";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==3){
            console.log("couponタブへ切り替え完了");
            couponLoad();
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==3){
            console.log("couponタブが再び押された");
            roadingModal.show();
            page="";
            page_val.coupon="";
        }
    });

    function couponLoad(){
        console.log("couponFrame読み込み完了");
        // iframeのwindowオブジェクトを取得
        var ifrm = couponFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('couponFrame').contentWindow;
        }
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id,
            "rally_id":page_val.rally_id,
            "page":"home"};

        // 外部サイトにメッセージを投げる
        switch(page){
            case "":
            case angular.isUndefined(page):
                if(page_val.coupon=="detail"){
                    roadingModal.show();
                    couponPermissionAndGps();
                }else {
                    postMessage={
                        "user":localStorage.getItem('ID'),
                        "coupon_id":page_val.coupon_id,
                        "page":""
                    }
                    ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
                }
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
                    "rally_id":page_val.rally_id,
                    "page":"home",
                    "lat":page_val.lat,
                    "lng":page_val.lng
                }
                ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                break;
            case "detail":
                ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                roadingModal.hide();
                break;
            case "list_detail":
                ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                roadingModal.hide();
                break;
            case "stop":
                ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                roadingModal.hide();
                break;
            default:
                var postMessage =
                {   "user":id,
                    "course_id":page_val.course_id,
                    "rally_id":page_val.rally_id,
                    "page":"home",
                    "mode":"stop"};
                ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                roadingModal.hide();
                break;
        }
    }

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if(mainTab.getActiveTabIndex()==3){
            console.log("couponFrameメッセージ受信");
            console.log(event.data);
            page_val.coupon=event.data["mode"];
            page_val.coupon_id=event.data["coupon_id"];
            if(event.data["page"]=="maintenance"){
                page_val.maintenance=1;
                mainTab.hide();
            }
            switch (event.data["page"]){
                case "coupon":
                    if(event.data["mode"]=="detail"){
                        couponLoad();
                    }else{
                        roadingModal.hide();
                    }
                    break;
                case "near":
                    roadingModal.hide();
                    break;
                case "rally":
                    page_val.spot_id=0;
                    page_val.rally_mode=event.data["mode"];
                    if(!angular.isUndefined(event.data["course_id"])){
                        page_val.course_id=event.data["course_id"];
                    }
                    
                    if(event.data["stamp_type"]=="comp"){
                        compBtn.style.visibility="visible";
                        stampBtn.style.visibility="hidden";
                        page_val.stamp_comp_flg=1;
                        if(roadingModal.visible){
                            roadingModal.hide();
                        }
                    }else{
                        compBtn.style.visibility="hidden";
                        page_val.stamp_comp_flg=0;
                    }
                    switch (event.data["mode"]){
                        case "list":
                            page="list";
                            break;
                        case "map":
                            page="map";
                            break;
                        case "map_visible":
                            roadingModal.hide();
                            break;
                        case "course":
                            page="rally";
                            stampBtn.style.visibility="hidden";
                            break;
                        case "spot":
                            page="stamp";
                            stampBtn.style.visibility="hidden";
                            break;
                        case "stop":
                            page="stop";
                            page_val.rally_mode="stop";
                            break;
                        case "privilege":
                            stampBtn.style.visibility="hidden";
                            compBtn.style.visibility="hidden";
                            page="stop";
                            break;
                        case "detail":
                            if(page_val.rally_id != event.data["rally_id"]){
                                page_val.rally_id=event.data["rally_id"]
                            }
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
                                if(page_val.stamp_comp_flg==0){
                                    couponPermissionAndGps();
                                }
                            }
                            break;
                    }
                    if(event.data["spot_id"]){
                        page_val.spot_id=event.data["spot_id"]
                        stampBtn.style.visibility="hidden";
                    }
                    break;
            }
        }
    });

    function couponPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                if(page_val.coupon=="detail"){
                    couponSearch(msg);
                }else{
                    cNearSpotSearch(msg);
                }
            },
            // 失敗時　（deferred.reject）
            function (msg) {
                // エラーコードに合わせたエラー内容をアラート表示
                setTimeout(function() {
                    ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
                    }, 0);
                roadingModal.hide();
            });
        }
        if (device.platform == "Android") {
            permissionCheck().then(// 成功時　（deferred.resolve）
                function (msg) {
                    console.log('Success:' + msg);
                    gpsCheck(id).then(
                        function (msg) {
                        console.log('SuccessGps:' + msg);
                        if(page_val.coupon=="detail"){
                            couponSearch(msg);
                        }else{
                            cNearSpotSearch(msg);
                        }
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        // エラーコードに合わせたエラー内容をアラート表示
                        setTimeout(function() {
                            ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
                            }, 0);
                        roadingModal.hide();
                    },
                    // notify呼び出し時
                    function (msg) {
                        console.log('Notification:' + msg);
                    });
                },
                // 失敗時　（deferred.reject）
                function (msg) {
                    ons.notification.alert({ message: "位置情報へのアクセスが許可されなかったため、現在位置が取得できません。", title: "エラー", cancelable: true });
                roadingModal.hide();
                },
                // notify呼び出し時
                function (msg) {
                    console.log('Notification:' + msg);
                });
        }
    }
    
    function cNearSpotSearch (data){
        nearSpot(data).then(
            function (res) {
                if (res.length==0) {
                    stampBtn.style.visibility="hidden";
                } else {
                    stampBtn.style.visibility="visible";
                }
                page="";
                roadingModal.hide();
            },
            // 失敗時　（deferred.reject）
            function (res,status) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "周辺情報検索中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }

    function couponSearch (data){
        nearCoupon(data).then(
            function (res) {
                var postMessage="";
                if (res.length>=1) {
                    var postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"true",
                        "page":"detail"
                    }
                }else{
                    var postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"false",
                        "page":"detail"
                    }

                }
                // iframeのwindowオブジェクトを取得
                var ifrm = couponFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('couponFrame').contentWindow;
                }
                ifrm.postMessage(postMessage, page_val.url+"coupon/index.php");
            },
            // 失敗時　（deferred.reject）
            function (res,status) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "周辺情報検索中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }
}]);

