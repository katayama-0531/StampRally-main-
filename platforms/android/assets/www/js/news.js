app.controller('newsCtr' ,['page_val', function (page_val) {
    //ニュース画面のコントローラー
    if(device.platform == "iOS"){
        document.getElementById('newsFrame').addEventListener('load',newsLoad);
    }
    //iframe読み込み完了後の処理
    newsFrame.addEventListener('load',newsLoad);

    function newsLoad(){
        console.log("newsFrame読み込み完了");
        //console.log(page);
        roadingModal.show();
        // iframeのwindowオブジェクトを取得
        var ifrm = newsFrame.contentWindow;
        if(!ifrm){
            ifrm=document.getElementById('newsFrame').contentWindow;
        }
        // 外部サイトにメッセージを投げる
        var postMessage =
        {   "user":localStorage.getItem('ID'),
            "course_id":page_val.course_id,
            "rally_id":page_val.rally_id,
            "spot_id":page_val.spot_id,
            "page":"news"};
        ifrm.postMessage(postMessage, page_val.url+"news/index.php");
        roadingModal.hide();
    }
}]);