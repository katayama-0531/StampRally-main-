app.controller('outCtr',[ '$scope','$timeout', '$q','get_http_service', function ($scope, $timeout, $q, get_http_service) {
    //サービスを使うための準備
    //injectしたいサービスを記述。ngも必要。
    var injector = angular.injector(['ng','stampRallyApp']);
    //injectorからサービスを取得
    var httpService = injector.get('get_http_service');

    var getCord= function() {
        var deferred = $q.defer();
        $timeout(function() {
            id=localStorage.getItem('ID');
            httpService.getCord(deferred,id);
        }, 0)
        return deferred.promise;
    }
    var setData= function(data) {
        var deferred = $q.defer();
        $timeout(function() {
            httpService.setPw(deferred,data);
        }, 0)
        return deferred.promise;
    }

    outPage.addEventListener('init', function(event) {
        roadingModal.show();
        var page = event.target;

        getCord().then(// 成功時　（deferred.resolve）
            function (msg) {
                console.log(msg);
                // if(msg[0].cord!=""){
                //     $scope.name=msg[0].cord;
                //     for (var i = 0; i < 4; i++) {
                //         if(msg[0].password!=0000){
                //             document.getElementById(idName).value=msg[0].password[i];
                //         }else{
                //             document.getElementById(idName).value="";
                //         }
                //     }
                //     roadingModal.hide();
                // }else{
                    // 生成する文字列の長さ
                    var l = 8;
                    // 生成する文字列に含める文字セット
                    var c = "abcdefghijklmnopqrstuvwxyz0123456789";
                    var cl = c.length;
                    var r = "";
                    for(var i=0; i<l; i++){
                        r += c[Math.floor(Math.random()*cl)];
                    }
                    $scope.name=r;
                    roadingModal.hide();
                // }
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
        

      }, false);
      
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

    this.regist=function(){

        var cord = document.getElementById('cord').textContent;
        var password = "";
        for (var i = 0; i < 4; i++) {
            password+=document.getElementById('pw'+i).value;
        }

        if(password==""){
            ons.notification.alert('パスワードを入力して下さい。');
        }else{
            var pwArray=[];
            var errorMessage="";
            for (let index = 0; index < password.length; index++) {
                const element = password[index];
                if(!element.match(/[0-9０-９]/)){
                    errorMessage="パスワードは数字で入力して下さい。";
                    break;
                }

                if(index!=0){
                    if(password[0]==element){
                        //同じ文字
                        pwArray.push(element);
                    }
                }else{
                    pwArray.push(element);
                }
            }
            if (pwArray.length == 4) {
                //pwが４桁同じ数字なので登録不可
                setTimeout(function() {
                    ons.notification.alert({ message: "パスワードに同一の数字を4桁設定することは出来ません。", title: "エラー", cancelable: true });
                    }, 0);
            } else if(errorMessage!="") {
                //pwが４桁同じ数字なので登録不可
                setTimeout(function() {
                    ons.notification.alert({ message: errorMessage, title: "エラー", cancelable: true });
                    }, 0);
            } else {

                //pwが４桁同じ数字ではないので登録可
                var data=[];
                data["user_id"]=localStorage.getItem('ID');
                data["cord"]=cord;
                data["pw"]=password;
                setData(data).then(// 成功時　（deferred.resolve）
                    function (msg) {
                        console.log(msg);
                        navi.bringPageTop('html/handover/out-end.html');
                    },
                    // 失敗時　（deferred.reject）
                    function (msg) {
                        roadingModal.hide();
                    });
            }
        }
    }
}]);