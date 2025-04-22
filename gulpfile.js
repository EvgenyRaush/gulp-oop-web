"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./docs/";
// const dist = "/Applications/MAMP/htdocs/test"; // Ссылка на вашу папку на сервере

gulp.task("copy-html", () => {
    return gulp.src("./src/*.html")
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("copy-css", () => {
  return gulp.src("./src/assets/css/*.*")
              .pipe(gulp.dest(dist + "/assets/css"))
              .on("end", browsersync.reload);
});

gulp.task("copy-font", () => {
  return gulp.src("./src/assets/font/*.*")
              .pipe(gulp.dest(dist + "/assets/font"))
              .on("end", browsersync.reload);
});

gulp.task("copy-icons", () => {
    return gulp.src("./src/assets/icons/*.*")
                .pipe(gulp.dest(dist + "/assets/icons"))
                .on("end", browsersync.reload);
});

gulp.task("copy-images", () => {
  return gulp.src("./src/assets/img/*.*")
              .pipe(gulp.dest(dist + "/assets/img"))
              .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
        server: {
            baseDir: "./docs/",
            serveStaticOptions: {
                extensions: ["html"]
            }
        },
		port: 4000,
		notify: true
    });
    
    gulp.watch("./src/*.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/css/*.*", gulp.parallel("copy-css"));
    gulp.watch("./src/assets/font/*.*", gulp.parallel("copy-font"));
    gulp.watch("./src/assets/icons/*.*", gulp.parallel("copy-icons"));
    gulp.watch("./src/assets/img/*.*", gulp.parallel("copy-images"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-css", "copy-font", "copy-images", "copy-icons", "build-js"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));