const gulp = require('gulp');
const concat = require('gulp-concat');  //сливает все файлы в один
const autoprefixer = require('gulp-autoprefixer');  //добавляет префиксы под разные браузеры
const cleanCSS = require('gulp-clean-css');  //gulp plugin to minify CSS - минифицирует CSS-файлы
const uglifyJS = require('gulp-uglify');  // минифицирует JS-файлы (убирает пробелы, заменяет названия переменных на более короткие и т.п.)
const del = require('del');  // позволяет удалять файлы / Delete files and folders using globs
const browserSync = require('browser-sync').create(); //обновляем страницу браузера при сохранении изменений в файлах

function styles(){
	return gulp.src('./src/css/**/*.css')     //берём все файлы из src>css с расширением css
		.pipe(concat('all.css'))             //сливаем их в один файл с названием all.css
		.pipe(autoprefixer({
            browsers: ['> 0.1%'],            //для браузеров, которые исп-ся больше 0.1% в мире, можно заменить на 'last 2 versions'
            cascade: false
        }))
        .pipe(cleanCSS({                    //минифицирует файл all.css(убирает пробелы, комментарии и т.п.)
        	level: 2
        }))
		.pipe(gulp.dest('./build/css'))     //ложим файл all.css в папку build>css
		.pipe(browserSync.stream());
}

function scripts(){
	return gulp.src('./src/js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(uglifyJS({
			toplevel: true
		}))
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
}

function watch(){                                 //подписываемся на изменения нижеприведенных файлов и выполняем функции
	browserSync.init({                           //инициализируем browserSync
        server: {
            baseDir: "./"                //в какой папке искать наш html-файл
        }
    });
	gulp.watch('./src/css/**/*.css', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./*.html', browserSync.reload); 
}

function clean(){                    //удаляет всё, что находится внутри папки build
	return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,  //выполняем последовательно команду clean и параллельно команды styles и scripts
					 gulp.parallel(styles, scripts)
					 ));

gulp.task('dev', gulp.series('build', 'watch'));
