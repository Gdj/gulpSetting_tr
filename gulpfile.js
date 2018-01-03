var gulp = require('gulp'),
    // load Node.js API
    fs   = require('fs'),
    path = require('path'),
    uglifyjs = require('uglify-js'),
    // gulp 전용패키지
    iconfont= require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-clean-css'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    uglify = require('gulp-uglify'),
    uglifyfier = require('gulp-uglify/minifier'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    htmlbeautify  = require('gulp-html-beautify'),
    // npm 패키지
    gutil = require('gulp-util'),
    del = require('del'),
    browserSync = require('browser-sync').create();


// ---------------------------------
// directory
// ---------------------------------
var pRoot = "root/";                               // 작업 생성될 곳
var dir  = {
    /**  dir.inc   dir.dev_inc
     * pc     : sprite.support_1x.mustache
     * mobile : sprite.support_2x.mustache
     * **/
    template        : 'sprite.support_1x.mustache',
    templateMb      : 'sprite.support_2x.mustache',
    dist_html       : pRoot + "html/"    ,                     // 생성 HTML
    dist_style      : pRoot + "inc/"     + 'css/',             // 생성 스타일
    dist_scripts    : pRoot + "inc/"     + 'js/',              // 생성 스크립트
    dist_images     : pRoot + "inc/"     + 'images/',          // 생성 이미지

    dev_html        : pRoot + "dev_html/" ,                     // 개발 HTML
    dev_style       : pRoot + "dev_inc/"  + 'scss/',            // 개발 스타일
    dev_scripts     : pRoot + "dev_inc/"  + 'js/',              // 개발 스크립트
    dev_images      : pRoot + "dev_inc/"  + 'images/',          // 개발 이미지 느려짐 사용자제
    dev_imagesSp    : pRoot + "dev_inc/"  + 'imagesSp/',        // 개발 스라이스 이미지
};
// ---------------------------------
// PostCss options
// ---------------------------------
var processors = [
    /**
     * ['last 2 versions', "Edge > 0", "ie >= 8"] :   // PC옵션
     * ["Android > 0","iOS > 0","FirefoxAndroid > 0"] // 모바일옵션
     * ['last 2 versions', "Edge > 0", 'ie >= 8', 'safari >=5', 'iOS >=5',
        'Firefox >=3.0','Opera >=10.0', "Android > 0","iOS > 0","FirefoxAndroid > 0"]
     * **/
    autoprefixer({browsers: ["Android > 0","iOS > 0","FirefoxAndroid > 0"]})
];


// ---------------------------------
// Functions 홀더경로 추출함수
// ---------------------------------
// function.getFolders
var getFolders = function (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

    // ---------------------------------
    // jQuery 가져 오기 Tasks
    // ---------------------------------
    gulp.task('jquery', function(){
        // "http://ajax.googleapis.com/ajax/libs/jquery/1.12.1/jquery.min.js"
        return gulp.src( [ dir.dev_scripts + 'trlibrary/jquery-1.12.1.min.js'] )
            .pipe(concat('jquery.min.js'))
            .pipe(gulp.dest( dir.dist_scripts + 'library/'));
    });

    // ---------------------------------
    // 플러그인 CSS 합치기 Tasks
    // ---------------------------------
    // task.concatCss
    gulp.task('libraryConcatCss', function(){
        return gulp.src([
            //"bower_components/swiper/dist/css/swiper.min.css",
            dir.dev_scripts + "library/css/*.css"
        ])
        .pipe(concat('csslibrary.css'))
        .pipe(gulp.dest( dir.dist_style + 'library/'))

        //.pipe(sourcemaps.init())
        .pipe(concat('csslibrary.min.css'))
        .pipe(minifyCSS())
        //.pipe(sourcemaps.write("./maps"))  // "./maps" 빼면 파일에 내포
        .pipe(gulp.dest( dir.dist_style + 'library/'));
    });

    // ---------------------------------
    // 플러그인 JS 합치기 Tasks
    // ---------------------------------
    // task.concatJs
    // jsoptions (all: 모든 주석 삭제 , license: 라이센스 외 모든주석 삭제)
    var jsoptions = {
        preserveComments: 'license'
    };
    gulp.task('libraryConcatJs',function(){
        return gulp.src([
            //"bower_components/swiper/dist/js/swiper.min.js",
            dir.dev_scripts + "library/*.js"
        ])
        .pipe(concat('jquerylibrary.js', {newLine: ';'}))
        .pipe(gulp.dest( dir.dist_scripts + 'library/'))

        //.pipe(sourcemaps.init())
        .pipe(concat('jquerylibrary.min.js', {newLine: ';'}))
        .pipe(uglifyfier(jsoptions, uglifyjs ))
        //.pipe(sourcemaps.write("./maps"))  // "./maps" 빼면 파일에 내포
        .pipe(gulp.dest( dir.dist_scripts + 'library/'));
    });

    // ---------------------------------
    // 이미지 최적화 Tasks
    // ---------------------------------
    // task.imagemin
    gulp.task('imagemin', function(){
        gulp.src([dir.dev_images + '**/*.jpg', dir.dev_images + '**/*.gif', dir.dev_images + '**/*.png' ])
        .pipe(imagemin())
        .pipe(gulp.dest(dir.dist_images + ''));
    });

    // ---------------------------------
    // svg 폰트 변환 tasks
    // ---------------------------------
    // task.iconfont
    gulp.task('iconfont', function(){
        gulp.src([ dir.dev_imagesSp + 'svg/icon/*.svg' ], {base: dir.dev_imagesSp } )
        .pipe(iconfontCss({
            fontName: 'iconfont',                                                // font-family 이름
            //path : './iconfont/_iconfont.scss',
            targetPath: '../../../dev_inc/scss/lib/iconfont/_sp_iconfont.scss',  // 폰트들에서 상대경로
            fontPath: './fonts/',                                                // css 폰트경로
            cssClass: 'spfont'                                                   // class 접두어
        }))
        .pipe(iconfont({
            fontName: 'iconfont',                                                // 폰트파일 이름
            formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'],
            prependUnicode: true
            //appendCodepoints: true
        }))
        .on('codepoints', function(codepoints, options){
            //console.log(codepoints, options);
        })
        .pipe(gulp.dest( dir.dist_style + 'fonts/'));
    });



//--------------------------------
// Tasks spriteimg  // spritesmith 합치기
//--------------------------------
gulp.task('spriteimg', function () {
    // set target folders
    var folders = getFolders(dir.dev_imagesSp + "sprite/");

    // generate image & sass files
    folders.map(function (folder) {
        var _algorithm = "binary-tree";
        //if (folder == "button"){ _algorithm = "top-down"}
        var spriteData = gulp.src('sprite/' + folder + '/*.png', {cwd: dir.dev_imagesSp + ''})
            .pipe(spritesmith({
                imgPath:   '../' + 'images/common/' + 'sp_' + folder + '.png',
                imgName:   'sp_' + folder + '.png',
                cssName:   '_sp_' + folder + '.scss',
                cssFormat: 'scss',
                algorithm: _algorithm , //top-down, left-right, diagonal, alt-diagonal, binary-tree
                padding:   20,
                cssTemplate: dir.dev_style + 'lib/spritesmith/' + dir.template,   // pc 앞축 방법
                cssVarMap: function(sprite) {
                    sprite.name = sprite.name;
                    sprite.origin = 'sp_' + folder;
                },
                cssSpritesheetName: 'sp_' + folder
            }));

        spriteData.css.pipe(gulp.dest(dir.dev_style   + 'lib/spritesmith/'));
        spriteData.img.pipe(gulp.dest(dir.dist_images + 'common'));
    });
});


// ---------------------------------
// Tasks sass    // sass -> css 변환 common.css
// ---------------------------------
gulp.task('sass', function() {
    return gulp.src(dir.dev_style+ "*.scss")
        .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: 'compact' // output style is [nested | expanded | compact | compressed]
            }).on('error', sass.logError))
            .pipe(postcss(processors))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dir.dist_style + ''));
});

// ---------------------------------
// Tasks cssmin    // inc css 파일 앞축
// ---------------------------------
gulp.task('cssmin',['sass'], function() {
    return gulp.src( [ dir.dist_style + '**/*.css', '!'+dir.dist_style + '**/*.min.css' ])
        .pipe(rename({extname: ".min.css"}))
        .pipe(sourcemaps.init())
            //.pipe(postcss(processors))
            .pipe(minifyCSS())
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest(dir.dist_style + ''));
});


// ---------------------------------
// Tasks sassbuild    // sourcemaps 정보 삭제
// ---------------------------------
gulp.task('sassbuild', function() {
    return gulp.src(dir.dev_style+ "scss/*.scss")
        .pipe(sass({
            outputStyle: 'compact' // output style is [nested | expanded | compact | compressed]
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(dir.dist_style + ''));
});
// ---------------------------------
// Tasks cssminbuild    // sourcemaps 정보 삭제
// ---------------------------------
gulp.task('cssminbuild',['sassbuild'], function() {
    return gulp.src( [ dir.dist_style + '**/*.css', '!'+dir.dist_style + '**/*.min.css' ])
        .pipe(rename({extname: ".min.css"}))
        .pipe(postcss(processors))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dir.dist_style + ''));
});



// ---------------------------------
// Tasks concatJs    // *.js -> 합치기   common.js
// ---------------------------------
gulp.task('concatJs', function(){
    return gulp.src([dir.dev_scripts + "*.js"])
    .pipe(sourcemaps.init())
        .pipe(concat('common.js', {newLine: ';'}))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest( dir.dist_scripts + ''));
});
// ---------------------------------
// Tasks jsmin    // inc js 파일 앞축
// ---------------------------------
gulp.task('jsmin', ['concatJs'], function(){
    //return gulp.src([  dir.dist_scripts + '*.js', '!'+dir.dist_scripts + '*.min.js'])
    return gulp.src([  dir.dist_scripts + 'common.js'])
    .pipe(sourcemaps.init())
        .pipe(rename({extname:'.min.js'}))
        .pipe(uglifyfier(jsoptions, uglifyjs ))
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(dir.dist_scripts + ''));
});

// ---------------------------------
// Tasks concatJsbuild    // sourcemaps 정보 삭제
// ---------------------------------
gulp.task('concatJsbuild', function(){
    return gulp.src([dir.dev_scripts + "*.js"])
    .pipe(concat('common.js', {newLine: ';'}))
    .pipe(gulp.dest( dir.dist_scripts + ''));
});
// ---------------------------------
// Tasks jsminbuild    // sourcemaps 정보 삭제
// ---------------------------------
gulp.task('jsminbuild', ['concatJsbuild'], function(){
    return gulp.src([  dir.dist_scripts + 'common.js'])
    .pipe(rename({extname:'.min.js'}))
    .pipe(uglifyfier(jsoptions, uglifyjs ))
    .pipe(gulp.dest(dir.dist_scripts + ''));
});


// ---------------------------------
// Tasks fileinclude    // 파일 인크루드
// ---------------------------------
gulp.task('fileinclude', function() {
	gulp.src([ dir.dev_html + '**/*.html', '!'+dir.dev_html + 'include/*.html'], {base : dir.dev_html})
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file'
	}))
    .pipe(htmlbeautify())
	.pipe(gulp.dest(dir.dist_html));
});



// ---------------------------------
// Tasks watch    // 파일감시
// ---------------------------------
gulp.task('watch', function(){
    gulp.watch([dir.dev_scripts     + 'library/**/*'], ['libraryConcatCss', 'libraryConcatJs']);
    gulp.watch([dir.dev_imagesSp    + 'sprite/**/*'],  ['spriteimg'], ['iconfont']);
    gulp.watch([dir.dev_style       + '**/*.scss'],    ['cssmin']);
    gulp.watch([dir.dev_scripts     + '*.js' ],        ['jsmin']);
    gulp.watch([dir.dev_html        + '**/*.html' ],   ['fileinclude']);
    //gulp.watch([dir.dev_images + '_img/**/*'], ['imagemin']);         // 이미지 최적화
});


/* *************************************
    이미지최 적화                             gulp imagemin
    dev_inc/images/ => inc/images/
**************************************** */

/* *************************************
    svg 폰트 변환                            gulp iconfont
    dev_inc/imagesSp/svg/ => inc/css/fonts/
**************************************** */

/* *************************************ㅔ
    bower & 라이브러리 불러오기                gulp libraryLoad
**************************************** */
gulp.task('libraryLoad',['jquery', 'libraryConcatCss', 'libraryConcatJs'], function(){ console.log("libraryLoad"); });


/* *************************************
    build (css, js) 생성 배포                 gulp build
**************************************** */
gulp.task('build',[ 'libraryLoad', 'spriteimg', 'iconfont', 'cssminbuild', 'jsminbuild'], function(){ });


/* *************************************
    gulp, watch, browserSync (css, js) 생성 기본 세팅      gulp
**************************************** */
gulp.task('default',[ 'libraryLoad', 'spriteimg', 'iconfont', 'cssmin', 'jsmin', 'fileinclude', 'watch'], function(){
    browserSync.init({
        server: pRoot,
        port: 1212
    });
    gulp.watch([dir.dist_style+'*.css', dir.dist_scripts+'*.js', dir.dist_html+'**/*.html']).on('change', browserSync.reload);
});


/* *************************************
    브라우저 감시                             gulp bs
**************************************** */
// task.bs
gulp.task('bs',['watch'], function() {
    browserSync.init({
        server: pRoot,
        port: 1212
    });
    /*browserSync({
        files : ['*.html','*.php'],
        startPath:  pRoot,
        proxy: 'localhost:8080',
        open: 'http://localhost:8080/sample.html',  //'external',
        logPrefix: "bs"
    });*/

    gulp.watch([dir.dist_style+'*.css', dir.dist_scripts+'*.js', dir.dist_html+'**/*.html']).on('change', browserSync.reload);

});
