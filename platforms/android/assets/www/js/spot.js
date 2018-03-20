app.controller('spotCtr', ['$scope', 'page_val', function ($scope, page_val) {
    //近くのスポット画面のコントローラー
    var id = localStorage.getItem('ID');
    var page="";
    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==2){
            roadingModal.show();
            page="";
        }
    });

    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(e){
        if(event.index==2){
            page="";
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
        console.log("spotFrame読み込み完了");
        // iframeのwindowオブジェクトを取得
        var ifrm = spotFrame.contentWindow;
        if(mainTab.getActiveTabIndex()==2){
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
                case angular.isUndefined(page):
                    if(page=="spot"){
                        var postMessage =
                        {   "user":id,
                            "rally_id":page_val.rally_id,
                            "course_id":page_val.course_id,
                            "spot_id":page_val.spot_id,
                            "lat":page_val.lat,
                            "lng":page_val.lng,
                            "page":"stop"
                        };
                        ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                        roadingModal.hide();
                        page="";
                        page_val.rally_mode="stop";
                    }else{
                        ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
                        roadingModal.hide();
                        page="spot";
                    }
                    break;
                case "spot":
                    var postMessage =
                    {   "user":id
                    };
                    ifrm.postMessage(postMessage, page_val.url+"nearby/index.php");
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
                    var postMessage =
                    {   "user":id
                    };
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
}]);
