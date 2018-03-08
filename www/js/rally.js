app.controller('rallyCtr', ['$scope', '$http', '$filter', 'page_val', 'get_img_service', function($scope, $http, $filter, page_val, get_img_service) {
    //ラリー帳画面のコントローラー
    var id = localStorage.getItem('ID');
    var page = "";
    page_val.header_color_code=page_val.default_color_code;
    page_val.header_title_img=page_val.default_title_img;
    page_val.header_news_img=page_val.default_news_img;
    page_val.header_setting_img=page_val.default_setting_img;

    //アクティブなタブの切り替え前の処理
    mainTab.on('postchange',function(event){
        if(event.index==1){
            rallyFrame.src=page_val.url+"index_list.php";
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.hide();
            compBtn.hide();
        }
    });
    //アクティブなタブの切り替え完了後の処理
    mainTab.on('postchange',function(event){
        if(event.index==1){
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
        }
    });

    //アクティブなタブが再度押された場合の処理
    mainTab.on('reactive',function(event){
        if(event.index==1){
            page_val.header_color_code=page_val.default_color_code;
            page_val.header_title_img=page_val.default_title_img;
            page_val.header_news_img=page_val.default_news_img;
            page_val.header_setting_img=page_val.default_setting_img;
            //スタンプが押せる画面ではないので非表示にする
            stampBtn.hide();
            compBtn.hide();
        }
    });
    
    //iframe読み込み完了後の処理
    rallyFrame.addEventListener('load',function() {
        console.log("rallyFrame読み込み完了");
        header.style.backgroundColor=page_val.header_color_code;
        head_icon.src=page_val.header_title_img;
        head_news.src=page_val.header_news_img;
        head_setting.src=page_val.header_setting_img;
        // iframeのwindowオブジェクトを取得
        var rallyifrm = rallyFrame.contentWindow;
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":id,
            "course_id":page_val.course_id,
            "page":"rally"};
            var url="";
        if(mainTab.getActiveTabIndex()==1){
            if(page==""){
                url=page_val.url+"index_list.php";
                page="rally";
            }else{
                url=page_val.url+"rally/index.php";
            }
        }
        if(url!=""){
            rallyifrm.postMessage(postMessage, url);
        }
    });
}]);