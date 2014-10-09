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




/*********************************************
 * 変数一覧
 *********************************************/
//config
var config = {
    path : {
        //開発用
        dev  : {
            SCSS   : 'scss/**/*.scss',
            COFFEE : 'coffee/**/*.coffee',
            JADE   : ['jade/**/*.jade', '!jade/_partial/**/*.jade'],  //htmlとして書き出す対象(_partialを除外)
            JADE_WATCH : 'jade/**/*.jade'  //監視する対象
        },
        //公開用
        deploy : {
            CSS  : '../deploy/common/css/',
            HTML : '../deploy/',
            JS   : '../deploy/common/js/'
        }
    }
};




/*********************************************
 * webサーバ
 *********************************************/
_gulp.task('webserver', function() {
    _gulp.src(config.path.deploy.HTML)  //ルートディレクトリ
    .pipe(_webserver({
        // livereload: false
        //webserverのlivereloadが上手く動作しないため、別途livereloadプラグインを使う
    }));
});




/*********************************************
 * jadeの設定
 *********************************************/
_gulp.task('jade', function() {
    _gulp.src(config.path.dev.JADE)
    .pipe(_data(function(file) {
        //読み込むjsonファイル
        return require('./jade/contents.json');
    }))
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_jade({
        pretty: true
    }))
    .pipe(_gulp.dest(config.path.deploy.HTML))
    .pipe(_livereload({ auto: false }));
});




/*********************************************
 * compassの設定
 *********************************************/
_gulp.task('compass', function() {
    _gulp.src(config.path.dev.SCSS)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_compass({
        config_file: 'scss/config.rb',  //compassの設定ファイルの場所
        css: config.path.deploy.CSS,  //出力するcssのフォルダ場所
        sass: 'scss'  //sassファイルの場所
    }))
    .pipe(_livereload({ auto: false }));

    //.pipe(_gulp.dest(''));  //他にも出力先を指定する場合
});




/*********************************************
 * coffeeScriptの設定
 *********************************************/
_gulp.task('coffee', function() {
    _gulp.src(config.path.dev.COFFEE)
    .pipe(_plumber())  //エラーが出てもwatchを止めない
    .pipe(_coffee())
    .pipe(_gulp.dest(config.path.deploy.JS));
});



/*********************************************
 * watchの設定
 *********************************************/
_gulp.task('watch', function() {
    _livereload.listen();

    _gulp.watch(config.path.dev.JADE_WATCH, ['jade']);
    _gulp.watch(config.path.dev.SCSS, ['compass']);
    _gulp.watch(config.path.dev.COFFEE, ['coffee']);
});




/*********************************************
 * 実行 -> gulp all
 *********************************************/
_gulp.task('all', ['webserver', 'jade', 'compass', 'coffee', 'watch']);




/**
 * [参考]functionでの書き方

    _gulp.task('default', function(){
        _gulp.run('watch', 'copy-html');
    });
*/
