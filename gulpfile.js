const {src, dest, watch, parallel, series} = require('gulp');

// install sass
const scss          = require('gulp-sass')(require('sass'));
// конкотынация файлов scss
const concat        = require('gulp-concat');
// конкотынация файлов js6 
const uglifyWatch   = require('gulp-uglify-es').default;
// автоматическое обновление сайта
const browserSync   = require('browser-sync').create();
// свежие префиксы для браузеров
const autoprefixer  = require('gulp-autoprefixer');
// для удаления старого dist перед сборкой нового
const clean         = require('gulp-clean'); 

// функция для соединения скриптов и минифицированя JS
function scripts() {
    return src(['app/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglifyWatch())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
} 

// функция для конвертации scss -> min.css
function styles() {
    return src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());

}

// отслеживания изминений и отрисовка 
// в минифицированные файлы (css, js)
function gatekeeper() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload);
}

function browserLaunch() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}


//  функция для удаления старых файлов из dist
function deleteDist() {
    return src('dist')
        .pipe(clean())
}


// функция для добавления новых файлов в dist
function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base : 'app'})
        .pipe(dest('dist'))
}



// экспорт функций
exports.styles = styles;
exports.scripts = scripts;
exports.gatekeeper = gatekeeper;
exports.browserLaunch = browserLaunch;

exports.build = series(deleteDist, building);
exports.default = parallel(styles, scripts, browserLaunch, gatekeeper);