/*!*
 * jQuery Sharing SNS Plugin
 * Version 0.0.1
 */
(function( $, window, document ) {
    'use strict';

    // メタ情報を定義
    const namespace = 'share';
    const version   = '0.0.1';

    // デフォルトオプションを定義
    const defaults = {
        // URL。デフォルトでは表示しているページから自動取得
        // オプションで設定した場合は固定でそれを使用
        url : null,

        // 投稿タイトル。デフォルトではページタイトルを自動取得
        // オプションで設定した場合は固定でそれを使用
        title : null,

        // Twitter でハッシュタグを利用する場合に設定
        twHashTag : '',

        // Twitter アカウントを表示する場合に設定
        twAccount : '',

        // 各種 SNS への投稿トリガとなる要素
        target : {
            twitter    : '._share_twitter',
            facebook   : '._share_facebook',
            line       : '._share_line',
            googleplus : '._share_googleplus',
        },
    };

    // コンストラクタを定義
    function Plugin(element, options) {
        this.element  = element;
        this.settings = $.extend({}, defaults, options);

        this.$root   = $(this.element);

        this._defaults = defaults;
        this._name     = namespace;
        this._version  = version;

        this.init();
    }

    // プロトタイプメソッドを定義
    $.extend(Plugin.prototype, {
        init : function () {
            this.getInfo();
            this.initEvents();
        },

        // シェアする情報を取得してエンコーディング
        getInfo : function () {
            // TODO: description も設定できるようにする（Facebook で使えるぽい？）
            const data = {
                url       : this.settings.url || window.location.href,
                title     : this.settings.title || document.title,
                twHashTag : this.settings.twHashTag,
                twAccount : this.settings.twAccount,
            };

            // data の値をエンコード
            $.each(data, function(index, value) {
                data[index] = encodeURIComponent(value);
            });

            this.data = data;
        },

        // イベントにメソッドを設定
        initEvents : function () {
            this.$root.on('click.twitter', this.settings.target.twitter, $.proxy(this.clickTwitter, this));
            this.$root.on('click.facebook', this.settings.target.facebook, $.proxy(this.clickFacebook, this));
            this.$root.on('click.line', this.settings.target.line, $.proxy(this.clickLine, this));
            this.$root.on('click.googleplus', this.settings.target.googleplus, $.proxy(this.clickGooglePlus, this));
        },

        // 受け取った URL を別ウィンドウで開く
        openUrl : function (url) {
            window.open(url, '_blank');
        },

        // イベントハンドラ：Twitter
        clickTwitter : function (e) {
            e.preventDefault();

            // ハッシュタグとアカウントは設定がなければパラメタとして渡さない
            const hashtag = this.data.twHashTag ? `&hashtags=${this.data.twHashTag}` : '';
            const account = this.data.twAccount ? `&via=${this.data.twAccount}` : '';

            const url = `https://twitter.com/share?text=${this.data.title}&url=${this.data.url}${hashtag}${account}`;
            this.openUrl(url);
        },

        // イベントハンドラ：Facebook
        clickFacebook : function (e) {
            e.preventDefault();

            const url = `https://www.facebook.com/sharer.php?u=${this.data.url}&t=${this.data.title}`;
            this.openUrl(url);
        },

        // イベントハンドラ：LINE
        clickLine : function (e) {
            e.preventDefault();

            let url;

            // LINE は PC/スマートフォンでリンクを分ける必要がある
            // PC -> 別ウィンドウで送信画面を開く
            // スマートフォン -> LINE アプリが立ち上がる
            const ua = navigator.userAgent;

            // スマートフォン向けコード
            if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
                url = `http://line.me/R/msg/text/?${this.data.url}`;
            }

            // PC 向けコード
            else {
                url = `https://timeline.line.me/social-plugin/share?url=${this.data.url}`;
            }

            this.openUrl(url);
        },

        // イベントハンドラ：GooglePlus
        clickGooglePlus : function (e) {
            e.preventDefault();

            const url = `https://plus.google.com/share?url=${this.data.url}`;
            this.openUrl(url);
        },
    });

    // jQuery.prototype にプラグイン名を追加し、
    // 受け取った jQuery オブジェクトにプラグインコンストラクタのインスタンスを設定
    $.fn[namespace] = function(options) {
        return this.each(function() {
            if (!$.data(this, `plugin_${namespace}`)) {
                $.data(this, `plugin_${namespace}`, new Plugin(this, options));
            }
        });
    };

}( jQuery, window, document ));
