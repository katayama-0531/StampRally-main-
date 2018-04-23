angular.module('stampRallyApp').factory('get_http_service', ['$http', 'page_val', function($http, page_val){

    return{
        checkUpdate: function(deferred){
            //TODO:強制アップデート
            var　apiUrl="";
            //配布中アプリのversionをチェックする
            if (device.platform == "Android"){
                apiUrl = page_val.root_url+"api/app-version.json";
            }
            if (device.platform == "iOS"){
                apiUrl="https://itunes.apple.com/lookup?country=JP&id=1367402543";
            }
            var url = apiUrl,
            config = {
                    timeout: 30
                };
            
            var req = {
                method: 'POST',
                url: url,
            };
            console.log("配布中アプリversionチェック");
            $http(req).then(function onSuccess(data) {
                var  storeVersion="";
                if (device.platform == "iOS"){
                    //storeVersion=data["data"]["results"]["0"]["version"];
                    storeVersion="1.1.0";
                }
                if (device.platform == "Android"){
                    storeVersion=data["data"]["version"];
                }

                cordova.getAppVersion.getVersionNumber().then(function (version) {
                    console.log("version情報");
                    console.log(version);
                    var message = "";
                    var url = "";

                    if (storeVersion > version){
                        message = "新しいバージョンが公開されています。更新を行ってください。";
                        if (device.platform == "iOS"){
                            //TODO:アプリ公開後に確認
                            //url = 'id1367402543';
                        }
                            if (device.platform == "Android"){
                                url = 'com.jafstamprally';
                        }
                        alert(message);
                        cordova.plugins.market.open(url);
                    }
                    deferred.resolve(message, url); 
                });
            }, function onError(data) {
                roadingModal.hide();
                setTimeout(function() {
                    ons.notification.alert({ message: "versionチェック中にエラーが発生しました。エラー："+data.data+"ステータス："+data.status, title: "エラー", cancelable: true });
                    }, 0);
                
                console.log("エラー："+data.data);
                console.log("ステータス："+status);
                deferred.reject(data.data,data.status);
            });
                return deferred.promise;
            },
      getLogin: function(deferred){
        //ログイン処理
        var postData = null;
        if (localStorage.getItem('ID')) {
            postData = {
                userId: localStorage.getItem('ID')
            };
        }
        //Ajax通信でphpにアクセス
        var url = "https://www.online-carelplus.com/stamp/api/login.php",
        // var url = "https://jafstamprally.com/api/login.php",
        config = {
                timeout: 30
            };
        
        var req = {
            method: 'POST',
            url: url,
            data: postData
        };
        console.log("ログイン");
        $http(req).then(function onSuccess(data, status) {
            //ログイン成功
            deferred.resolve(data.data);
        }, function onError(data, status) {
            //ログイン失敗
            deferred.reject(data.data,status);
        });
            return deferred.promise;
        },
      getNearSpot: function (deferred,postData){
        //Ajax通信でphpにアクセス
        var url = page_val.root_url+"api/nearSpot.php",
        config = {
            timeout: 5000
        };

        var req = {
            method: 'POST',
            url: url,
            data: postData
        };

        $http(req).then(function onSuccess(data, status) {
                if(data.data.length==0){
                    //近くにスポットは無い
                    console.log("近くに表示出来るスポットは無い");
                }else{
                    //近くにスポットがある
                    console.log("近くに表示可能なスポットがある");
                    console.log(data.data);
                    page_val.near_spot_data=data.data;
                }
                deferred.resolve(data.data); 
        }, function onError(data, status) {
            console.log("エラー："+data.data);
            console.log("ステータス："+status);
            deferred.reject(data.data,status);
        });
    },
    getNearStampSpot: function (deferred,postData){
        //Ajax通信でphpにアクセス
        var url = page_val.root_url+"api/nearStampSpot.php",
        config = {
            timeout: 5000
        };

        var req = {
            method: 'POST',
            url: url,
            data: postData
        };

        $http(req).then(function onSuccess(data, status) {
                if(data.data.length==0){
                    //近くにスポットは無い
                    console.log("近くにスタンプが押せるスポットは無い");
                }else{
                    //近くにスポットがある
                    console.log("近くにスタンプが押せるスポットがある");
                    console.log(data.data);
                    page_val.near_spot_data=data.data;
                }
                deferred.resolve(data.data); 
        }, function onError(data, status) {
            console.log("エラー："+data.data);
            console.log("ステータス："+status);
            deferred.reject(data.data,status);
        });
    },
    getNearCoupon: function (deferred,postData){
        //Ajax通信でphpにアクセス
        var url = page_val.root_url+"api/nearCouponSpot.php",
        config = {
            timeout: 5000
        };

        var req = {
            method: 'POST',
            url: url,
            data: postData
        };

        $http(req).then(function onSuccess(data, status) {
                if(data.data.length==0){
                    //近くにスポットは無い
                    console.log("近くにクーポン使用可能スポットは無い");
                }else{
                    //近くにスポットがある
                    console.log("近くにクーポン使用可能スポットがある");
                    console.log(data.data);
                    page_val.near_spot_data=data.data;
                }
                deferred.resolve(data.data); 
        }, function onError(data, status) {
            console.log("エラー："+data.data);
            console.log("ステータス："+status);
            deferred.reject(data.data,status);
        });
    },
  setStamp: function (deferred,id){
        //Ajax通信でphpにアクセス
        var url = page_val.root_url+"api/pressStamp.php",
        config = {
            timeout: 5000
        };
        var data = page_val.near_spot_data[0];
        data["course_id"]=page_val.course_id;
        data["user_id"]=id;
        data["lat"]=page_val.lat;
        data["lng"]=page_val.lng;
        data["alt"]=page_val.alt;
        data["acc"]=page_val.acc;
        var req = {
            method: 'POST',
            url: url,
            data: data
        };
        $http(req).then(function onSuccess(data, status) {
            console.log("スタンプ押印情報通信成功");
            console.log(data);
            deferred.resolve(data.data);
        }, function onError(data, status) {
            deferred.reject(data.data,status);
            setTimeout(function() {
                ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
                }, 0);
            console.log("エラー："+data);
            console.log("ステータス："+status);
        });
    },
    checkComplete: function(deferred,id){
        //Ajax通信でphpにアクセス
        var url = page_val.root_url+"api/compStamp.php",
        config = {
            timeout: 5000
        };
        var postData={};
        postData.course_id=page_val.course_id;
        postData.user_id=id;

        var req = {
            method: 'POST',
            url: url,
            data: postData
        };

        $http(req).then(function onSuccess(data, status) {
                if(data.data[0]=="true"){
                    //コンプリート済み
                    console.log("コンプリート済み");
                    console.log(data.data);
                }else{
                    //コンプリートしてない
                    console.log("コンプリートしてない");
                }
                deferred.resolve(data.data); 
        }, function onError(data, status) {
            console.log("エラー："+data.data);
            console.log("ステータス："+status);
            deferred.reject(data.data,status);
        });
    }
 };
}]);