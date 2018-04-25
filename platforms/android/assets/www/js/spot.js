app.controller('spotCtr', ['$timeout', '$q', 'page_val', 'get_permission_service',　'get_http_service', function($timeout, $q, page_val, get_permission_service, get_http_service) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
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
            id=localStorage.getItem('ID');
            permission.getGps(deferred,id);
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
    var nCoupon= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearCoupon(deferred, data);
        }, 0)
        return deferred.promise;
    }

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==page_val.nearTab){
            roadingModal.show();
            page_val.rally_mode="";
            page_val.nearSpot="";
            spotFrame.src=page_val.url+"nearby/index.php";
            if (device.platform == "iOS") {
                document.getElementById('spotFrame').src=page_val.url+"nearby/index.php";
            }
            spotFrame.addEventListener('load',spotLoad);
            if (device.platform == "iOS") {
                document.getElementById('spotFrame').addEventListener('load',spotLoad);
            }
        }
    });

     //アクティブなタブの切り替え前の処理
     mainTab.on('postchange',function(event){
        if(event.index==page_val.nearTab){
            console.log("spotタブへ切り替え前");
            roadingModal.show();
            spotFrame.src=page_val.url+"nearby/index.php";
            spotFrame.addEventListener('load',spotLoad);
            if (device.platform == "iOS") {
                document.getElementById('spotFrame').src=page_val.url+"nearby/index.php";
                document.getElementById('spotFrame').addEventListener('load',spotLoad);
            }
        }
    });

    //アクティブなタブの完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index!=page_val.nearTab){
            page_val.rally_mode="";
            if(compBtn.style.visibility==""){
                compBtn.style.visibility="hidden";
            }
            if(stampBtn.style.visibility==""){
                stampBtn.style.visibility="hidden";
            }
        }

        if(event.index==page_val.nearTab){
            console.log("spotタブへ切り替え完了後");
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    function spotLoad () {
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('spotFrame').contentWindow;
        }
        if(mainTab.getActiveTabIndex()==page_val.nearTab){
            console.log("spotFrame読み込み完了");
            console.log(page_val.rally_mode);
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
            if(angular.isUndefined(page_val.rally_mode)){
                page_val.rally_mode="";
            }
            switch(page_val.rally_mode){
                case "":
                    if(page_val.nearSpot=="" || page_val.nearSpot!=page_val.spot_id){
                        if(page_val.stamp_comp_flg==0){
                            spotPermissionAndGps();
                        }
                    }else{
                        postMessage =
                        {   "user":id,
                            "rally_id":page_val.rally_id,
                            "course_id":page_val.course_id,
                            "spot_id":page_val.spot_id,
                            "mode":"list",
                        };
                        ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    }
                    page_val.rally_mode="stop";
                    break;
                case "spot":
                    postMessage =
                    {   "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "spot_id":page_val.spot_id,
                        "mode":""
                    };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    page_val.rally_mode="";
                    roadingModal.hide();
                    break;
                case "rally":
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    roadingModal.hide();
                    break;
                case "stamp":
                    completeSpotS(id);
                    // if(page_val.stamp_comp_flg==0){
                    //     spotPermissionAndGps();
                    // }
                    break;
                case "list":
                    postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "spot_id":page_val.spot_id,
                    };
                    
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    roadingModal.hide();
                    break;
                case "map":
                    var postMessage={
                        "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "page":"home",
                        "lat":page_val.lat,
                        "lng":page_val.lng
                    }
                    
                    ifrm.postMessage(postMessage, page_val.url+"near_map/index.php");
                    break;
                case "detail":
                    var postMessage =
                            {   "user":id,
                                "rally_id":page_val.rally_id,
                                "course_id":page_val.course_id,
                                "spot_id":page_val.spot_id,
                                "page":"stop"
                            };
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "list_detail":
                    var postMessage =
                        {   "user":id,
                            "rally_id":page_val.rally_id,
                            "course_id":page_val.course_id,
                            "spot_id":page_val.spot_id,
                            "page":"stop"
                        };
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "list":
                    postMessage =
                    {   "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "spot_id":page_val.spot_id,
                        "mode":"stop"
                    };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    page_val.rally_mode="";
                    break;
                case "stop":
                    if(angular.isUndefined(page_val.course_id)){
                        page_val.course_id=0;
                    }
                    if(angular.isUndefined(page_val.v)){
                        page_val.rally_id=0;
                    }
                    postMessage =
                            {   "user":id,
                                "rally_id":page_val.rally_id,
                                "course_id":page_val.course_id,
                                "spot_id":page_val.spot_id,
                                "mode":"stop",
                            };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    roadingModal.hide();
                    break;
                case "coupon":
                    roadingModal.show();
                    //spotPermissionAndGps();
                    break;
                default:
                    var postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "spot_id":page_val.spot_id,
                        "page":"home",
                        "mode":"stop"};
                    gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    }

    //コンプリート状況確認
    function completeSpotS(id){
        complete(id).then(
            function (msg) {
                console.log('comp:' + msg);
                if(msg[0]=="true" && page_val.stamp_comp_flg==1){
                    //コンプ済
                    compBtn.style.visibility="visible";
                    stampBtn.style.visibility="hidden";
                    gpsBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else if(msg[0]=="false" && page_val.stamp_comp_flg==1){
                    //コンプ済応募済み
                    compBtn.style.visibility="hidden";
                    stampBtn.style.visibility="hidden";
                    gpsBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else{
                    //未コンプ
                    compBtn.style.visibility="hidden";
                    stampBtn.style.visibility="hidden";
                    gpsBtn.style.visibility="visible";
                    page_val.stamp_comp_flg=0;
                    roadingModal.hide();
                    // spotPermissionAndGps();
                }
            },
            // 失敗時　（deferred.reject）
            function (msg) {
                // エラーコードに合わせたエラー内容をアラート表示
                setTimeout(function() {
                    ons.notification.alert({ message: "スタンプ情報取得中にエラーが発生しました。", title: "エラー", cancelable: true });
                    }, 0);
                roadingModal.hide();
        });
    }

    function spotPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                switch(page_val.rally_mode){
                    case "map":
                        spotNearSpotSearch(msg);
                    break;
                    case "coupon":
                        cSearch(msg);
                        break;
                    default:
                        spotNearSpotSearch(msg);
                        break;
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
                        switch(page_val.rally_mode){
                            case "map":
                                spotNearSpotSearch(msg);
                            break;
                            case "coupon":
                                cSearch(msg);
                                break;
                            default:
                                spotNearSpotSearch(msg);
                                break;
                        }
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        // エラーコードに合わせたエラー内容をアラート表示
                        setTimeout(function() {
                            ons.notification.alert({ message: "位置情報取得中にエラーが発生しました。", title: "エラー", cancelable: true });
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

    function spotNearSpotSearch (data){
        nearSpot(data).then(
            function (res) {
                stampBtn.style.visibility="hidden";
                compBtn.style.visibility="hidden";
                // iframeのwindowオブジェクトを取得
                var ifrm = spotFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('spotFrame').contentWindow;
                }
                var postMessage={
                    "user":id,
                    "course_id":page_val.course_id,
                    "rally_id":page_val.rally_id,
                    "page":"home",
                    "lat":page_val.lat,
                    "lng":page_val.lng
                }
                switch(page_val.rally_mode){
                    case "map":
                        ifrm.postMessage(postMessage, page_val.url+"rally/map/index.php");
                    break;
                    case "stamp":
                        ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    break;
                    default:
                        ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                        break;
                }
                page="";
                roadingModal.hide();
                if(res.length==0){
                    setTimeout(function() {
                        ons.notification.alert({ message: "近くに表示可能なスポットがありません。", title: "", cancelable: true });
                    }, 0);
                }
            },
            // 失敗時　（deferred.reject）
            function (res,status) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "周辺情報取得中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }
    function cSearch (data){
        nCoupon(data).then(
            function (res) {
                var postMessage="";
                if (res.length>=1) {
                    postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"true",
                        "page":"detail"
                    }
                }else{
                    postMessage={
                        "user":id,
                        "coupon_id":page_val.coupon_id,
                        "spot_id":page_val.spot_id,
                        "coupon":"false",
                        "page":"detail"
                    }

                }
                // iframeのwindowオブジェクトを取得
                var ifrm = spotFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('spotFrame').contentWindow;
                }
                ifrm.postMessage(postMessage, page_val.url+"coupon_det/index.php");
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
