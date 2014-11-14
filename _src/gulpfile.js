/*********************************************
 * gulpやプラグインのインポート
 *********************************************/
var _gulp       = require('gulp');
var _data       = require('gulp-data');
var _webserver  = require('gulp-webserver');
var _livereload = require('gulp-livereload');
var _jade       = require('gulp-jade');
var _compass    = require('gulp-compass');
var _coffee     = require('gulp-coffee');
var _plumber    = require('gulp-plumber');
var _rimraf     = require('gulp-rimraf');




/*********************************************
 * 変数一覧
 *********************************************/
var path = {
    //開発用
    dev  : {
        scss       : 'scss/**/*.scss',
        coffee     : 'coffee/**/*.coffee',
        jade       : ['jade/**/*.jade', '!jade/_*/**/*.jade'],  //htmlとして書き出す対象(_partialを除外)
        jade_watch : 'jade/**/*.jade'  //監視する対象
    },
    //公開用
    deploy : {
        root : '../deploy/',
        html : '../deploy/**/*.html',
        css  : '../deploy/common/css/',
        js   : '../deploy/common/js/'
    }
};




/*********************************************
 * webサーバ
 *********************************************/
_gulp.task('webserver', function() {
    _gulp.src(path.deploy.root)  //ルートディレクトリ
    .pipe(_webserver({
        // livereload: false
        //webserverのlivereloadが上手く動作しないため、別途livereloadプラグインを使う
    }));
});




/*********************************************
 * jadeの設定
 *********************************************/
_gulp.task('jade', function() {
    _gulp.src(path.dev.jade)
    .pipe(_data(function(file) {
        //読み込むjsonファイル
        return require('./jade/contents.json');
    }))
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_jade({
        pretty: true
    }))
    .pipe(_gulp.dest(path.deploy.root))
    .pipe(_livereload({ auto: true }));
});




/*********************************************
 * compassの設定
 *********************************************/
_gulp.task('compass', function() {
    _gulp.src(path.dev.scss)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_compass({
        config_file: 'scss/config.rb',  //compassの設定ファイルの場所
        css: path.deploy.css,  //出力するcssのフォルダ場所
        sass: 'scss'  //sassファイルの場所
    }))
    .pipe(_livereload({ auto: true }));

    //.pipe(_gulp.dest(''));  //他にも出力先を指定する場合
});




/*********************************************
 * coffeeScriptの設定
 *********************************************/
_gulp.task('coffee', function() {
    _gulp.src(path.dev.coffee)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_coffee())
    .pipe(_gulp.dest(path.deploy.js));
});




/*********************************************
 * watchの設定
 *********************************************/
_gulp.task('watch', function() {
    _livereload.listen();

    _gulp.watch(path.dev.jade_watch, ['jade']    );
    _gulp.watch(path.dev.scss,       ['compass'] );
    _gulp.watch(path.dev.coffee,     ['coffee']  );
});




/*********************************************
 * 基本実行
 * コマンド -> gulp
 *********************************************/
_gulp.task('default', ['webserver', 'jade', 'compass', 'coffee', 'watch']);




/*********************************************
 * ファイルの削除
 * 
 * コマンド -> gulp del
 *********************************************/
_gulp.task('del', function() {
    return _gulp.src([path.deploy.html, path.deploy.js, path.deploy.css], { read: false }) // much faster
           .pipe(_rimraf({ force: true }));
});





/**
 * [参考]functionでの書き方

    _gulp.task('default', function(){
        _gulp.run('watch', 'copy-html');
    });
*/
