app.controller('inCtr' ,['$filter', '$timeout', '$q','get_http_service', function ($filter, $timeout, $q, get_http_service) {

     //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var httpService = injector.get('get_http_service');

    var set= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.setHandover(deferred,data);
        }, 0)
        return deferred.promise;
    }

    $('#pw0').focusin(function(e) {
        for (var i = 0; i < 4; i++) {
            document.getElementById('pw'+i).value="";
        }
    });

    $('input[id^="pw"]').keyup(function() {
        if ($(this).val().length >= $(this).attr('maxlength')) {
            if(device.platform == "Android"){
                $(this).next().focus();
            }
        }
    });

    $('#pw3').on('input', function(event) {
        $('#pw3').blur();
      });

    this.handover=function(){
        var cord = document.getElementById('cord').value;
        var password = "";
        for (var i = 0; i < 4; i++) {
            password+=document.getElementById('pw'+i).value;
        }
        var error = false;
        var errorComment = '';
        if(cord==""){
            errorComment='引き継ぎコードを入力して下さい。<br>';
            error=true;
        }else if(!cord.match(/[a-zａ-ｚA-ZＡ-Ｚ0-9０-９]/g)){
            errorComment+='引き継ぎコードは半角英数字で入力して下さい。<br>';
            error=true;
        }
        if(password==""){
            errorComment+='パスワードを入力して下さい。';
            error=true;
        }else if(!password.match(/[0-9０-９]/g)){
            errorComment+='パスワードは半角数字で入力して下さい。';
            error=true;
        }

        if(error){
            setTimeout(function() {
                ons.notification.alert({ message: errorComment, title: "エラー", cancelable: true });
                }, 0);
        }else{
            cord = cord.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);    
            });
            $filter('lowercase')(cord);
            password = password.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);    
            });
    
            var setData=[];
            setData["user_id"]=localStorage.getItem('ID');
            setData["cord"]=cord;
            setData["pw"]=password;
    
            set(setData).then(// 成功時　（deferred.resolve）
                function (msg) {
                    roadingModal.hide();
                    if(angular.isArray(msg)){
                        navi.bringPageTop("html/handover/in-end.html",{data:{param:msg[0]}});
                    }else{
                        setTimeout(function() {
                            ons.notification.alert({ message: "該当するデータが見つかりません。", title: "エラー", cancelable: true });
                            }, 0); 
                    }
                },
                // 失敗時　（deferred.reject）
                function (msg) {
                    roadingModal.hide();
                },
                // notify呼び出し時
                function (msg) {
                    roadingModal.hide();
                    console.log('Notification:' + msg);
                });
        }
    }

}]);