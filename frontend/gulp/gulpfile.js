const gulp 			= require('gulp'),
	  sass 			= require('gulp-sass'),
	  autoprefixer 	= require('gulp-autoprefixer'),
	  browserSync 	= require('browser-sync');


gulp.task('sass', function() {
	 gulp.src('../assets/styles/intranet/layouts/*/*.scss')
	 	 .pipe(sass())
	 	 .pipe(gulp.dest('../../dist'))
});

gulp.task('watch', function() {
	gulp.watch('../src/layouts/*.scss',['sass']);
});

gulp.task('browser-sync', function() {  
    browserSync.init(["../../dist/*.css"], {
        server: {
            baseDir: "../../"
        }
    });
});


