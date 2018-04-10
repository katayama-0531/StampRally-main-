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

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            roadingModal.show();
            page_val.rally_mode="";
            page_val.nearSpot="";
            if (device.platform == "Android") {
                spotFrame.addEventListener('load',spotLoad);
            } else {
                spotLoad();
            }
        }
    });

    //アクティブなタブの完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index!=2){
            if(compBtn.style.visibility==""){
                compBtn.style.visibility="hidden";
            }
            if(stampBtn.style.visibility==""){
                stampBtn.style.visibility="hidden";
            }
        }

        if(event.index==2){
            roadingModal.show();
            spotFrame.src=page_val.url+"nearby/index.php";
            if (device.platform == "Android") {
                spotFrame.addEventListener('load',spotLoad);
            } else {
                spotLoad();
            }
        }
    });
    
    //iframe読み込み完了後の処理(iframe内で画面遷移した場合も呼ばれる)
    function spotLoad () {
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('spotFrame').contentWindow;
        }
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
                    if(page_val.nearSpot=="" || page_val.nearSpot!=page_val.spot_id){
                        if(page_val.stamp_comp_flg==0){
                            spotPermissionAndGps();
                        }
                    }else{
                        postMessage =
                        {   "user":id,
                            "rally_id":page_val.rally_id,
                            "course_id":page_val.course_id,
                            "spot_id":page_val.spot_id
                        };
                        ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                    }
                    page_val.rally_mode="stop";
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
                    if(page_val.stamp_comp_flg==0){
                        spotPermissionAndGps();
                    }
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
                    if(page_val.stamp_comp_flg==0){
                        spotPermissionAndGps();
                    }
                    break;
                case "detail":
                    postMessage =
                            {   "user":id,
                                "rally_id":page_val.rally_id,
                                "course_id":page_val.course_id,
                                "spot_id":page_val.spot_id,
                                "page":"stop"
                            };
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
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
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
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
    }

    function spotPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                // iframeのwindowオブジェクトを取得
                var ifrm = spotFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('spotFrame').contentWindow;
                }
                switch(page_val.rally_mode){
                    case "map":
                        ifrm.postMessage(msg, page_val.url+"rally/map/index.php");
                    break;
                    default:
                        ifrm.postMessage(msg, page_val.url+"nearby/index.php");
                        break;
                }
                spotNearSpotSearch(msg);
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
                        spotNearSpotSearch(msg);
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

    function spotNearSpotSearch (data){
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
                    ons.notification.alert({ message: "ログイン中にエラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
        });
    }
}]);
