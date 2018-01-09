app.controller('homeCtr', ['$scope', 'img_num', function($scope, img_num) {

    loginName.innerHTML = "ID:" + localStorage.getItem('ID') + "でログイン中";

    var img = img_num.img_list[0].img1;
    this.imgdata = img;
    //更新チェック
    this.updataClick=function(){
        codePush.sync(function (status) {
            switch (status) {
                case SyncStatus.DOWNLOADING_PACKAGE:
                    updataModal.show();
                    break;
                case SyncStatus.INSTALLING_UPDATE:
                    updataModal.hide();
                    navigator.notification.alert(
                        '更新データがあります。アプリを再起動してください', // メッセージ
                        function(){
                            codePush.restartApplication();
                        }, // コールバック関数
                        '確認', // タイトル
                        '再起動' // ボタン名
                    );
                    break;
            }
        }, null, null);
    }

    //push通知入れるとしたらこの辺り

    // 無限リストサンプル
    this.MyDelegate = {
        configureItemScope: function(index, itemScope) {
            // Initialize scope
            itemScope.item = 'Item #' + (index + 1);
        },

        countItems: function() {
            // Return number of items.
            return 10000;
        },

        calculateItemHeight: function(index) {
            // Return the height of an item in pixels.
            return ons.platform.isAndroid() ? 48 : 44;
        }
    };
}]);