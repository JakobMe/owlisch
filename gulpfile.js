// Modules
var gulp = require("gulp");
var util = require("gulp-util");
var less = require("gulp-less");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cssmin = require("gulp-cssmin");
var imagemin = require("gulp-imagemin");
var sourcemaps = require("gulp-sourcemaps");
var minify = require("gulp-json-minify");
var autoprefixer = require("gulp-autoprefixer");

// Default-Task
gulp.task("default", ["watch"]);

// Watch-Task
gulp.task("watch", function() {
    gulp.watch("src/js/app/*.js", ["jshint", "js"]);
    gulp.watch("src/**/*.json", ["json"]);
    gulp.watch("src/**/*.html", ["html"]);
    gulp.watch("src/fonts/**/*", ["fonts"]);
    gulp.watch("src/data/**/*", ["data"]);
    gulp.watch("src/less/**/*.less", ["less"]);
    gulp.watch("src/img/*", ["img"]);
});

// JSHint-Task
gulp.task("jshint", function() {
    return gulp.src("src/js/app/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

// JavaScript-Task
gulp.task("js", function() {
    return gulp.src([
            "src/js/lib/jquery.js",
            "src/js/lib/bemhelpers.js",
            "src/js/lib/mustache.js",
            "src/js/lib/fastclick.js",
            "src/js/app/config.js",
            "src/js/app/util.js",
            "src/js/app/mediator.js",
            "src/js/app/template.js",
            "src/js/app/slider.js",
            "src/js/app/data.js",
            "src/js/app/play.js",
            "src/js/app/featured.js",
            "src/js/app/dictionary.js",
            "src/js/app/quiz.js",
            "src/js/app/statistics.js",
            "src/js/app/more.js",
            "src/js/app/navigationbar.js",
            "src/js/app/view.js",
            "src/js/app/tabbar.js",
            "src/js/app/init.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat("index.min.js"))
        .pipe(gulp.dest("www/js/"))
        .pipe(rename("index.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("www/js/"));
});

// LESS-Task
gulp.task("less", function() {
    return gulp.src("src/less/**/*.less")
        .pipe(sourcemaps.init())
        .pipe(concat("index.min.css"))
        .pipe(gulp.dest("www/css/"))
        .pipe(rename("index.min.css"))
        .pipe(less())
        .pipe(gulp.dest("www/css/"))
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("www/css/"));
});

// JSON-Task
gulp.task("json", function() {
    return gulp.src("src/**/*.json")
        .pipe(minify())
        .pipe(gulp.dest("www/"))
        .on("error", util.log);
});

// HTML-Task
gulp.task("html", function() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("www/"));
});

// Fonts-Task
gulp.task("fonts", function() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("www/fonts/"));
});

// Data-Task
gulp.task("data", function() {
    return gulp.src("src/data/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("www/data/"));
});

// Images-Task
gulp.task("img", function() {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("www/img/"));
});

// All-Task
gulp.task("all", ["jshint", "js", "less", "json", "html", "fonts", "data", "img"]);