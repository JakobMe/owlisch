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
var minify = require("gulp-json-minify");
var autoprefixer = require("gulp-autoprefixer");
var notify = require("gulp-notify");
var cache = require("gulp-cached");

// Default-Task
gulp.task("default", ["watch"]);

// Watch-Task
gulp.task("watch", function() {
    gulp.watch("src/js/app/*.js", ["js"]);
    gulp.watch("src/**/*.json", ["json"]);
    gulp.watch("src/**/*.html", ["html"]);
    gulp.watch("src/fonts/**/*", ["fonts"]);
    gulp.watch(["src/data/**/*.mp3", "src/data/**/*.jpg"], ["data"]);
    gulp.watch("src/less/**/*.less", ["less"]);
    gulp.watch("src/img/*", ["img"]);
    gulp.watch("src/favicon/*", ["favicon"]);
});

// JSHint-Task
gulp.task("jshint", function() {
    return gulp.src("src/js/app/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"))
        .on("error", notify.onError({
            title: "Gulp",
            message: "<%= error.message %>",
            sound: "Basso",
            icon: "Terminal Icon",
        }));
});

// JavaScript-Task
gulp.task("js", ["jshint"], function() {
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
            "src/js/app/app.js"
        ])
        .pipe(concat("index.min.js"))
        .pipe(gulp.dest("www/js/"))
        .pipe(uglify())
        .pipe(gulp.dest("www/js/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "JS: <%= file.relative %> kompiliert.",
        }));
});

// LESS-Task
gulp.task("less", function() {
    return gulp.src("src/less/index.less")
        .pipe(rename("index.min.css"))
        .pipe(less())
        .on("error", notify.onError({
            title: "Gulp",
            message: "<%= error.message %>",
            sound: "Basso",
            icon: "Terminal Icon",
            wait: true
        }))
        .pipe(gulp.dest("www/css/"))
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest("www/css/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "LESS: <%= file.relative %> kompiliert.",
        }));
});

// JSON-Task
gulp.task("json", function() {
    return gulp.src("src/**/*.json")
        .pipe(cache("json"))
        .pipe(minify())
        .on("error", notify.onError({
            title: "Gulp",
            message: "<%= error.message %>",
            sound: "Basso",
            icon: "Terminal Icon",
        }))
        .pipe(gulp.dest("www/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "JSON: <%= file.relative %> minimiert und nach www/ kopiert.",
        }));
});

// HTML-Task
gulp.task("html", function() {
    return gulp.src("src/**/*.html")
        .pipe(cache("html"))
        .pipe(gulp.dest("www/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "HTML: <%= file.relative %> nach www/ kopiert.",
        }));
});

// Fonts-Task
gulp.task("fonts", function() {
    return gulp.src("src/fonts/**/*")
        .pipe(cache("fonts"))
        .pipe(gulp.dest("www/fonts/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "Fonts: <%= file.relative %> nach www/ kopiert.",
        }));
});

// Data-Task
gulp.task("data", function() {
    return gulp.src(["src/data/**/*.mp3", "src/data/**/*.jpg"])
        .pipe(cache("data"))
        .pipe(imagemin())
        .pipe(gulp.dest("www/data/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "Data: <%= file.relative %> nach www/ kopiert.",
        }));
});

// Images-Task
gulp.task("img", function() {
    return gulp.src("src/img/*")
        .pipe(cache("img"))
        .pipe(imagemin())
        .pipe(gulp.dest("www/img/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "Images: <%= file.relative %> minimiert und nach www/ kopiert.",
        }));
});

// Favicon-Task
gulp.task("favicon", function() {
    return gulp.src("src/favicon/*")
        .pipe(cache("favicon"))
        .pipe(imagemin())
        .pipe(gulp.dest("www/favicon/"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "Favicons: <%= file.relative %> minimiert und nach www/ kopiert.",
        }));
});

// Resource-Task
gulp.task("res", function() {
    return gulp.src("res/**/*.png")
        .pipe(cache("res"))
        .pipe(imagemin())
        .pipe(gulp.dest("res"))
        .pipe(notify({
            sound: false,
            icon: "Terminal Icon",
            title: "Gulp",
            message: "Resources: <%= file.relative %> minimiert und nach www/ kopiert.",
        }));
});

// All-Task
gulp.task(
    "all",
    ["jshint", "js", "less", "html", "fonts", "data", "json", "img", "favicon", "res"]
);
