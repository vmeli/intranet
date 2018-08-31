const   gulp          = require('gulp'),
        sass          = require('gulp-sass'),
        autoprefixer  = require('gulp-autoprefixer'),
        browserSync   = require('browser-sync');

let path = {
    sass: ['../assets/styles/intranet/layouts/**/*.scss'],
    toAllScssPartials: '../assets/styles/intranet/**/*.scss',
    css: '../../dist/'
};

gulp.task('sass', function() {
    gulp.src(path.sass)
        .pipe(sass())
        .pipe(gulp.dest(path.css))
});

gulp.task('watch', function() {
    gulp.watch(path.toAllScssPartials, ['sass'])
});

gulp.task('browser-sync', function() {  
    browserSync.init(["../../dist/**/*.css"], {
        server: {
            baseDir: "../../"
        }
    });
});