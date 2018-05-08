app.controller('homeCtr', ['$interval', '$timeout', '$q', 'page_val', 'get_img_service', 'get_permission_service', 'get_http_service', 
function($interval, $timeout, $q, page_val, get_img_service, get_permission_service, get_http_service){
    
    roadingModal.show();
    stringCount=0;
    var id = localStorage.getItem('ID');
    var url = "";
    var page = "";
    var check = 0;
    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var service = injector.get('get_img_service');
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
            permission.getGps(deferred, id);
        }, 0)
        return deferred.promise;
    }

    var login= function() {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getLogin(deferred);
        }, 0)
        return deferred.promise;
    }

    var update= function() {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.checkUpdate(deferred);
        }, 0)
        return deferred.promise;
    }

    var nearSpot= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.getNearStampSpot(deferred, data);
        }, 0)
        return deferred.promise;
    }

    var stamp= function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            httpService.setStamp(deferred, id);
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

    var complete= function(id) {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            httpService.checkComplete(deferred,id);
        }, 0)
        return deferred.promise;
    }
    
    document.addEventListener("deviceready", function(){
         //通信の為の準備
        app.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
        if(device.platform == "Android"){
            versionCheck ();
        }
    }, false);

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(navi.pages.length==1){
            roadingModal.show();
        }
        
        if(event.index==page_val.homeTab){
            console.log("homeタブへ切り替え前");
            homeFrame.addEventListener('load',load);
            homeFrame.src=page_val.url+"index.php";
            if (device.platform == "iOS") {
                document.getElementById('homeFrame').addEventListener('load',load);
                document.getElementById('homeFrame').src=page_val.url+"index.php";
            }
            page="";
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.style.visibility="hidden";
            compBtn.style.visibility="hidden";
        }
    });
    
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==page_val.homeTab){
            console.log("homeタブへ切り替え完了");
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        roadingModal.show();
        compBtn.style.visibility="hidden";
        stampBtn.style.visibility="hidden";
        if(navi.pages.length >= 2){
            navi.resetToPage("html/home.html");
        }else{
            homeFrame.src=page_val.url+"index.php";
            if(device.platform == "iOS"){
                document.getElementById('homeFrame').src=page_val.url+"index.php";
            }
        }
        if(event.index==page_val.homeTab){
            console.log("homeタブが再度押された");
            // gpsBtn.style.visibility="hidden";
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

    if(device.platform == "iOS"){
        document.getElementById('homeFrame').addEventListener('load',load);
    }
    //iframe読み込み完了後の処理
    homeFrame.addEventListener('load',load);
    // gpsBtn.addEventListener('click',function(){
    //     console.log("現在位置確認ボタンタッチ");
    //     roadingModal.show();
    //     permissionAndGps();
    // });
    stampBtn.addEventListener('click',function(){
        console.log("スタンプを押すボタンタッチ");
        //スタンプ画像表示、アニメーション開始。
        // var stampName = "stamp" + page_val.rally_id;
        // var stamp = localStorage.getItem(stampName);
        // stampImg.src=stamp;
        stampImg.src=page_val.stamp_img_URL;
        stampImg.className = "animated bounceInDown";
        stampImg.style.visibility="visible";
    });
    compBtn.addEventListener('click',function(){
        console.log("応募ボタンタッチ");
        compBtn.style.visibility="hidden";
        var ifrm;
        switch (mainTab.getActiveTabIndex()) {
            case page_val.homeTab:
                ifrm = homeFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('homeFrame').contentWindow;
                }
                break;
        
            case page_val.rallyTab:
                ifrm = rallyFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('rallyFrame').contentWindow;
                }
                break;
            case page_val.nearTab:
                ifrm = spotFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('spotFrame').contentWindow;
                }
                break;
            case page_val.couponTab:
                ifrm = couponFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('couponFrame').contentWindow;
                }
                break;
            case page_val.starTab:
                ifrm = starFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('starFrame').contentWindow;
                }
                break;
        }
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id,
            "rally_id":page_val.rally_id,
            "spot_id":page_val.spot_id,
            "mode":"privilege"};
        ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
        roadingModal.hide();
    });
    function load() {
        if((mainTab.getActiveTabIndex()==page_val.homeTab || mainTab.getActiveTabIndex()==1) && navi.pages.length == page_val.rallyTab){
            console.log("homeiframe読み込み完了");
            console.log(page);
            roadingModal.show();
            if(device.platform == "iOS" && check==0){
                check++;
                versionCheck ();
            }
            //ヘッダーのアイコンもダウンロードしてくる
            if(header.style.backgroundColor!=page_val.header_color_code){
                header.style.backgroundColor=page_val.header_color_code;
                head_icon.src=page_val.header_title_img;
                head_news.src=page_val.header_news_img;
                head_setting.src=page_val.header_setting_img;
            }
            // iframeのwindowオブジェクトを取得
            var ifrm = homeFrame.contentWindow;
            if(!ifrm){
                ifrm=document.getElementById('homeFrame').contentWindow;
            }
            if(mainTab.getActiveTabIndex()==page_val.rallyTab){
                ifrm = rallyFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('rallyFrame').contentWindow;
                }
            }
            // 外部サイトにメッセージを投げる
            var postMessage =
            {   "user":id,
                "course_id":page_val.course_id,
                "rally_id":page_val.rally_id,
                "spot_id":page_val.spot_id,
                "page":"home"};

            if(angular.isUndefined(page)){
                page="";
            }
             switch(page){
                case "":
                    ifrm.postMessage(postMessage, page_val.url+"index.php");
                    roadingModal.hide();
                    break;
                case "rally":
                    // gpsBtn.style.visibility="visible";
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                    break;
                case "stamp":
                    ifrm.postMessage(postMessage, page_val.url+"stamp/index.php");
                    break;
                case "list":
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    if(page_val.rally_mode=="privilege"){
                        roadingModal.hide();
                    }
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
                    break;
                case "list_detail":
                    ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                    roadingModal.hide();
                    break;
                case "coupon":
                    roadingModal.show();
                    cPermissionAndGps();
                    break;
                default:
                    postMessage =
                    {   "user":id,
                        "course_id":page_val.course_id,
                        "rally_id":page_val.rally_id,
                        "spot_id":page_val.spot_id,
                        "page":"home",
                        "mode":"stop"};
                    ifrm.postMessage(postMessage, page_val.url+"rally/list/index.php");
                    roadingModal.hide();
                    break;
            }
        }
    }

    // メッセージ受信イベント
    window.addEventListener('message', function(event) {
        if((mainTab.getActiveTabIndex()==page_val.homeTab || mainTab.getActiveTabIndex()==1) && navi.pages.length == page_val.rallyTab){
            console.log("homeiframeメッセージ受信");
            console.log(event.data);
            roadingModal.show();
            if($.type(event.data)=="string"){
                if(stringCount==0){
                    stringCount++;
                }else{
                    roadingModal.hide();
                }
            }else{
                page_val.rally_mode='';
            }
            if(!angular.isUndefined(event.data["rally_id"])){
                if(event.data["rally_id"]!=0){
                    page_val.rally_id=event.data["rally_id"];
                }
            }
            if(!angular.isUndefined(event.data["course_id"])){
                if(event.data["course_id"]!=0){
                    page_val.course_id=event.data["course_id"];
                }
            }
            if(!angular.isUndefined(event.data["spot_id"])){
                if(event.data["spot_id"]!=0){
                    page_val.spot_id=event.data["spot_id"];
                }
            }else{
                page_val.spot_id=0
            }
            page_val.pages=event.data["page"];
            switch (event.data["page"]){
                case "home":
                    page="rally";
                    stampBtn.style.visibility="hidden";
                    if(device.platform == "iOS"){
                        if(mainTab.getActiveTabIndex()==page_val.homeTab||mainTab.getActiveTabIndex()==page_val.rallyTab){
                            // iframeのwindowオブジェクトを取得
                            var ifrm=document.getElementById('homeFrame').contentWindow;
                            if(mainTab.getActiveTabIndex()==page_val.rallyTab){
                                ifrm=document.getElementById('rallyFrame').contentWindow;
                            }
                            // 外部サイトにメッセージを投げる
                            var postMessage =
                            {   "user":id,
                                "course_id":page_val.course_id,
                                "rally_id":page_val.rally_id,
                                "spot_id":page_val.spot_id,
                                "page":"home"};
                                ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                                roadingModal.hide();
                        }
                    }
                    break;
                
                case "list":
                    stampBtn.style.visibility="hidden";
                    mainTab.setActiveTab(1);
                    roadingModal.hide();
                    break;
                
                case "stamp":
                    page_val.spot_id=event.data["spot_id"];
                    completeSearch(id);
                    break;

                case "coupon":
                    stampBtn.style.visibility="hidden";
                    page_val.spot_id=event.data["spot_id"];
                    page=event.data["page"];
                    if(event.data["mode"]=="detail_disp_end"){
                        roadingModal.hide();
                    }else if (event.data["mode"]=="back"){
                        roadingModal.hide();
                        mainTab.setActiveTab(3);
                    }
                    break;
                
                case "rally":
                    page_val.spot_id=0;
                    page_val.rally_mode=event.data["mode"];
                    page="";
                    if(!angular.isUndefined(event.data["course_id"])){
                        if(event.data["course_id"]!=0){
                            page_val.course_id=event.data["course_id"];
                        }
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
                    }
                    
                    if(event.data["stamp_type"]=="comp"){
                        page_val.stamp_comp_flg=1;
                    }else{
                        page_val.stamp_comp_flg=0;
                    }
                    switch (event.data["mode"]){
                        case "stamp":
                            break;
                        case "url":
                            window.open(event.data["url"], '_blank');
                            break;
                        case "adress":
                            var url="";
                            //iOS,Androidでそれぞれ地図アプリを開く
                            if (device.platform=="Android") {
                                url="http://maps.google.com?q=" + encodeURI(event.data["adress"]);
                            }else{
                                url="maps://?q=" + encodeURI(event.data["adress"]);
                            }
                            if(url!=""){
                                window.open(url, "_system");
                            }
                            roadingModal.hide();
                            break;
                        case "list":
                            stampBtn.style.visibility="hidden";
                            page="list";
                            break;
                        case "map":
                            stampBtn.style.visibility="hidden";
                            roadingModal.show();
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
                            // gpsBtn.style.visibility="hidden";
                            page="list";
                            break;
                        case "detail":
                            page="detail";
                            page_val.coupon_id=0;
                            roadingModal.show();
                            completeSearch(id);
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
                            page_val.spot_name=event.data["title"];
                            roadingModal.hide();
                        break;
                        default:
                            page="rally";
                            completeSearch(id);
                            break;
                    }
                    if(event.data["spot_id"]){
                        page_val.spot_id=event.data["spot_id"]
                        stampBtn.style.visibility="hidden";
                    }
                    break;
                case "near_spot":
                    mainTab.setActiveTab(2);
                    page_val.nearSpot=event.data["spot_id"];
                    page_val.spot_id=event.data["spot_id"];
                    break;
                case "select":
                    page=event.data["page"];
                    break;
                case "maintenance":
                    page_val.maintenance=1;
                    mainTab.hide();
                    roadingModal.hide();
                    break;
                
            }
            if(event.data["rally_id"] > 0){
                page_val.rally_id=event.data["rally_id"];
                page_val.header_color_code=event.data["color_code"];

                var stampName = "stamp" + page_val.rally_id;
                var headName = "head" + page_val.rally_id;
                localStorage.removeItem(stampName);
                var stamp = localStorage.getItem(stampName);
                var head = localStorage.getItem(headName);
                if(!stamp){
                    console.log("ダウンロード済みファイルが無い");
                    // 選択ファイルの読み込み
                    var readFilePath = encodeURI(page_val.root_url+'img/' + page_val.rally_id + '/stamp' + page_val.rally_id + '.json');
                    service.leadAndSet(readFilePath).then(function(res){
                        //ダウンロード失敗
                        if(angular.isDefined(res)){
                            //ダウンロード失敗
                            setTimeout(function() {
                                ons.notification.alert({ message: "ダウンロード中にエラーが発生しました。", title: "エラー", cancelable: true });
                                }, 0);
                            homeFrame.src=page_val.url+"index.php";
                            rallyFrame.src=page_val.url+"index_list.php";
                            if(device.platform == "iOS"){
                                document.getElementById('homeFrame').src=page_val.url+"index.php";
                                document.getElementById('rallyFrame').src=page_val.url+"index_list.php";
                            }
                            roadingModal.hide();
                        }else{
                            //ダウンロード成功
                            console.log("ダウンロード成功");
                            page_val.header_title_img=localStorage.getItem("head" + page_val.rally_id);
                            page_val.stamp_img_URL=localStorage.getItem("stamp" + page_val.rally_id);
                            page_val.stamp_img_URL="img_common/stamp_anime.gif"
                            head_icon.src=page_val.header_title_img;
                            page_val.header_news_img="img_common/header/header-news.png";
                            page_val.header_setting_img="img_common/header/header-hamb-menu.png";
                        }
                    });
                }else{
                    page_val.header_title_img=localStorage.getItem("head"+ page_val.rally_id);
                    page_val.stamp_img_URL=localStorage.getItem("stamp" + page_val.rally_id);
                    page_val.stamp_img_URL="img_common/stamp_anime.gif"
                    head_icon.src=page_val.header_title_img;
                    page_val.header_news_img="img_common/header/header-news.png";
                    page_val.header_setting_img="img_common/header/header-hamb-menu.png";
                }
            }
        } else if(mainTab.getActiveTabIndex()==page_val.nearTab){
            //近くのスポットタブメッセージ受信
            console.log("spotframeメッセージ受信");
            console.log(event.data);
            roadingModal.show();
            if($.type(event.data)=="string"){
                if(page_val.rally_mode=="list"){
                    roadingModal.hide();
                }
                //roadingModal.hide();
            }
            switch (event.data["page"]){
                case "near":
                    page_val.rally_mode=event.data["mode"];
                    break;
                case "rally":
                    page_val.spot_id=0;
                    if(angular.isUndefined(event.data["mode"])){
                        page_val.rally_mode="stamp";
                    }else{
                        page_val.rally_mode=event.data["mode"];
                    }
                    if(!angular.isUndefined(event.data["course_id"])){
                        if(event.data["course_id"]!=0){
                            page_val.course_id=event.data["course_id"];
                        }
                    }

                    if(!angular.isUndefined(event.data["spot_id"])){
                        if(event.data["spot_id"]!=0){
                            page_val.spot_id=event.data["spot_id"];
                        }
                    }

                    if(event.data["stamp_type"]=="comp"){
                        page_val.stamp_comp_flg=1;
                    }else{
                        page_val.stamp_comp_flg=0;
                    }
                    switch (event.data["mode"]){
                        case "stamp":
                            break;
                        case "url":
                            window.open(event.data["url"], '_blank');
                            roadingModal.hide()
                            break;
                        case "adress":
                            var url="";
                            //iOS,Androidでそれぞれ地図アプリを開く
                            if (device.platform=="Android") {
                                url="http://maps.google.com?q=" + encodeURI(event.data["adress"]) + "";
                            }else{
                                url="maps://?q=" + encodeURI(event.data["adress"]);
                            }
                            if(url!=""){
                                window.open(url, "_system");
                            }
                            roadingModal.hide();
                            break;
                        case "list":
                            stampBtn.style.visibility="hidden";
                            page="list";
                            break;
                        case "map":
                            stampBtn.style.visibility="hidden";
                            roadingModal.show();
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
                            page="detail";
                            roadingModal.show();
                            completeSearch(id);
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
                            completeSearch(id);
                            break;
                    }
                    if(event.data["spot_id"]){
                        page_val.spot_id=event.data["spot_id"]
                        stampBtn.style.visibility="hidden";
                    }
                    break;
                case "near_spot":
                    mainTab.setActiveTab(2);
                    page_val.nearSpot=event.data["spot_id"];
                    page_val.spot_id=event.data["spot_id"];
                    if(page_val.course_id==0){
                        page_val.course_id=event.data["course_id"];
                    }
                    if(page_val.rally_id==0){
                        page_val.rally_id=event.data["rally_id"];
                    }
                    break;
                case "maintenance":
                    page_val.maintenance=1;
                    mainTab.hide();
                    roadingModal.hide();
                    break;
                case "coupon":
                    page_val.spot_id=event.data["spot_id"];
                    page_val.rally_mode=event.data["page"];
                    if(event.data["mode"]=="detail_disp_end"){
                        roadingModal.hide();
                    }else if (event.data["mode"]=="back"){
                        roadingModal.hide();
                        mainTab.setActiveTab(3);
                    }
                    break;
            }
        }
        if(event.data["page"]=="maintenance"){
            page_val.maintenance=1;
            mainTab.hide();
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
                $interval(function() {
                    stampImg.src="";
                    stampImg.className = "";
                    stampImg.style.visibility="hidden";
                }, 5000,1);
                stamp(id).then(
                    function (res) {
                        // iframeのwindowオブジェクトを取得
                        var ifrm;
                        switch(mainTab.getActiveTabIndex()){
                            case page_val.homeTab:
                                ifrm = homeFrame.contentWindow;
                                if(!ifrm){
                                    ifrm=document.getElementById('homeFrame').contentWindow;
                                }
                                break;
                            case page_val.rallyTab:
                                ifrm = rallyFrame.contentWindow;
                                if(!ifrm){
                                    ifrm=document.getElementById('rallyFrame').contentWindow;
                                }
                                break;
                            case page_val.nearTab:
                                ifrm = spotFrame.contentWindow;
                                if(!ifrm){
                                    ifrm=document.getElementById('spotFrame').contentWindow;
                                }
                                break;
                            case page_val.couponTab:
                                ifrm = couponFrame.contentWindow;
                                if(!ifrm){
                                    ifrm=document.getElementById('couponFrame').contentWindow;
                                }
                                break;
                            case page_val.starTab:
                                ifrm = starFrame.contentWindow;
                                if(!ifrm){
                                    ifrm=document.getElementById('starFrame').contentWindow;
                                }
                                break;

                        }
                        // 外部サイトにメッセージを投げる
                        var postMessage =
                        {   "spot_id":Number(page_val.near_spot_data[0]["id"]),
                            "course_id":page_val.course_id,
                            "rally_id":page_val.rally_id,
                            "spot_id":page_val.spot_id,
                            "mode":res["result"]
                        };
                        ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                        ifrm.postMessage(postMessage, page_val.url+"detail/index.php");
                        //送信するデータを近くのスポット配列から消す
                        page_val.near_spot_data.splice(0,1);
                        
                        if(page_val.near_spot_data.length < 1){
                            //押せるスタンプが無いので非表示にする
                            // gpsBtn.style.visibility="visible";
                            stampBtn.style.visibility="hidden";
                        }
                        if(res["result"]=="comp"){
                            //コンプリートしたので応募ボタンを表示
                            // gpsBtn.style.visibility="hidden";
                            compBtn.style.visibility="visible";
                        }else if(res["result"]=="true"){
                            compBtn.style.visibility="hidden";
                        }
                    },
                    // 失敗時　（deferred.reject）
                    function (res,status) {
                        setTimeout(function() {
                            ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
                            }, 0);
                        console.log(res);
                        roadingModal.hide();
                });
                break;

            default:
                roadingModal.hide();
                break;
        }
    });

    //コンプリート状況確認
    function completeSearch(id){
        complete(id).then(
            function (msg) {
                console.log('comp:' + msg);
                if(msg[0]=="true" && page_val.stamp_comp_flg==1){
                    //コンプ済
                    compBtn.style.visibility="visible";
                    stampBtn.style.visibility="hidden";
                    // gpsBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else if(msg[0]=="false" && page_val.stamp_comp_flg==1){
                    //コンプ済応募済み
                    compBtn.style.visibility="hidden";
                    stampBtn.style.visibility="hidden";
                    // gpsBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=1;
                    roadingModal.hide();
                }else{
                    //未コンプ
                    compBtn.style.visibility="hidden";
                    page_val.stamp_comp_flg=0;
                    permissionAndGps();
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

    //パーミッション確認
    function permissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                    console.log('SuccessGps:' + msg);
                    nearSpotSearch(msg);
                },
                // 失敗時　（deferred.reject）
                function (msg) {
                    // エラーコードに合わせたエラー内容をアラート表示
                    setTimeout(function() {
                        // エラーコードのメッセージを定義
                                var errorMessage = {
                                    0: "原因不明のエラーが発生しました。",
                                    1: "位置情報の取得が許可されませんでした。",
                                    2: "電波状況などで位置情報が取得できませんでした。",
                                    3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
                                };
                        ons.notification.alert({ message: errorMessage[mes.code], title: "エラー", cancelable: true });
                        }, 0);
                    roadingModal.hide();
            });
        }
        if (device.platform == "Android") {
            permissionCheck(id).then(// 成功時　（deferred.resolve）
                function (msg) {
                    console.log('Success:' + msg);
                    gpsCheck(id).then(
                        function (msg) {
                        console.log('SuccessGps:' + msg);
                        nearSpotSearch(msg);
                        },
                        // 失敗時　（deferred.reject）
                        function (msg) {
                            // エラーコードに合わせたエラー内容をアラート表示
                            setTimeout(function() {
                                //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
                                // エラーコードのメッセージを定義
                                var errorMessage = {
                                    0: "原因不明のエラーが発生しました。",
                                    1: "位置情報の取得が許可されませんでした。",
                                    2: "電波状況などで位置情報が取得できませんでした。",
                                    3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
                                };
                                ons.notification.alert({ message: errorMessage[msg.code], title: "エラー", cancelable: true });
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

    //位置情報取得
    function nearSpotSearch (data){
        nearSpot(data).then(
            function (res) {
                if (res.length==0) {
                    stampBtn.style.visibility="hidden";
                } else {
                    // gpsBtn.style.visibility="hidden";
                    stampBtn.style.visibility="visible";
                }
                page="";
                if(mainTab.getActiveTabIndex()==page_val.nearTab){
                    // iframeのwindowオブジェクトを取得
                    var ifrm = spotFrame.contentWindow;
                    if(!ifrm){
                        ifrm=document.getElementById('spotFrame').contentWindow;
                    }
                    var postMessage =
                    {   "user":id,
                        "rally_id":page_val.rally_id,
                        "course_id":page_val.course_id,
                        "spot_id":page_val.spot_id,
                        "lat":page_val.lat,
                        "lng":page_val.lng,
                        "mode":"stamp"
                    };
                    ifrm.postMessage(postMessage, page_val.url+"rally/index.php");
                }
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

    function versionCheck (){
        update().then(function (message) {
            if (message == "") {
                console.log("アップデートなし");
                console.log("ユーザーID"+id);
                if(id=="" || id==null){
                    //チュートリアルの為にアプリの使い方を表示する
                    navi.pushPage("html/howto.html");
                    login().then(
                        function (res) {
                            if (res[0] == "success") {
                                localStorage.setItem("ID", res[1]);
                                id = res[1];
                                console.log("取得したユーザーID"+id);
                            } else {
                                roadingModal.hide();
                                setTimeout(function() {
                                    ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
                                    }, 0);
                                console.log(res);
                            }
                        },
                        // 失敗時　（deferred.reject）
                        function (res,status) {
                            roadingModal.hide();
                            setTimeout(function() {
                                ons.notification.alert({ message: "ログイン中にエラーが発生しました。エラー："+res+"ステータス："+status, title: "エラー", cancelable: true });
                                }, 0);
                            
                            console.log("エラー："+res);
                            console.log("ステータス："+status);
                    });
                }
            } else {
                console.log("アップデートあり");
            }
        },
        // 失敗時　（deferred.reject）
        function (res,status) {
            roadingModal.hide();
            setTimeout(function() {
                ons.notification.alert({ message: "アップデートを確認中にエラーが発生しました。エラー："+res+"ステータス："+status, title: "エラー", cancelable: true });
                }, 0);
            
            console.log("エラー："+res);
            console.log("ステータス："+status);
        });
    }

    function cPermissionAndGps() {
        if (device.platform == "iOS") {
            gpsCheck(id).then(
                function (msg) {
                console.log('SuccessGps:' + msg);
                cSearch(msg);
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
                        cSearch(msg);
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        // エラーコードに合わせたエラー内容をアラート表示
                        setTimeout(function() {
                            ons.notification.alert({ message: "位置情報取得中にエラーが発生しました。コード："+message.code, title: "エラー", cancelable: true });
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

    function cSearch (data){
        nCoupon(data).then(
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
                var ifrm = homeFrame.contentWindow;
                if(!ifrm){
                    ifrm=document.getElementById('homeFrame').contentWindow;
                }
                if(mainTab.getActiveTabIndex()==page_val.rallyTab){
                    ifrm = rallyFrame.contentWindow;
                    if(!ifrm){
                        ifrm=document.getElementById('rallyFrame').contentWindow;
                    }
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