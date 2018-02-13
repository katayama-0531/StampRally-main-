app.controller('newsCtr' ,['$scope', function ($scope) {
    //ニュース画面のコントローラー
    navi.on('postpush',function(event){
        if(event.enterPage=='newsPage'){
            roadingModal.hide();
        }
    });
}]);