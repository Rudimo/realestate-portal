module.exports = function (grunt) {

    let site_js = [
        './node_modules/angular/angular.js',
        './node_modules/angular-cookies/angular-cookies.js',
        './node_modules/angular-animate/angular-animate.js',
        './node_modules/angular-growl-v2/build/angular-growl.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        './resources/javascripts/common/oi.file.js',
        './node_modules/@flowjs/ng-flow/dist/ng-flow-standalone.js',
        './node_modules/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',

        //'./node_modules/less/dist/less.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js',

        './resources/unitegallery/js/unitegallery.js',
        './resources/unitegallery/themes/grid/ug-theme-grid.js',

        './resources/javascripts/site/script.js',

        './resources/smarty-template/js/scripts.js',

        './resources/javascripts/site/app.js',

        './resources/javascripts/site/controllers/UserObjectFormController.js',
        './resources/javascripts/site/controllers/objects-search-form-controller.js',

        './resources/javascripts/site/controllers/user-setting-controller.js',
        './resources/javascripts/site/controllers/user-password-controller.js',
        './resources/javascripts/site/controllers/user-email-controller.js',

        './resources/javascripts/site/directives.js',
        './resources/javascripts/site/services.js',
    ];

    let site_css = [
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/font-awesome/css/font-awesome.min.css',
        './node_modules/angular-growl-v2/build/angular-growl.css',

        './resources/unitegallery/css/unite-gallery.css',
        './resources/unitegallery/themes/default/ug-theme-default.css',

        './resources/smarty-template/css/layout.css',
        './resources/smarty-template/css/essentials.css',
        './resources/smarty-template/css/header-1.css',
        './resources/smarty-template/css/color_scheme/blue.css'
    ];

    let site_less = [
        './public/stylesheets/style.less'
    ];

    let admin_js = [
        './resources/javascripts/admin/script.js',
    ];

    let admin_css = [
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/font-awesome/css/font-awesome.min.css'
    ];

    grunt.initConfig({

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './node_modules/font-awesome/fonts',
                        src: '**',
                        dest: './public/fonts/',
                    }
                ]
            },
        },

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "./public/stylesheets/site_build_less.css": site_less
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    cleancss: true
                },
                files: {
                    "./public/stylesheets/site_build_less.css": site_less
                }
            }
        },

        uglify: {
            site_build_js: {
                files: {
                    './public/javascripts/site_build.js': site_js
                }
            },
            admin_build_js: {
                files: {
                    './public/javascripts/admin_build.js': admin_js
                }
            }
        },

        uglifysite: {
            site_build_js: {
                files: {
                    './public/javascripts/site_build.js': site_js
                }
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './public/stylesheets/site_build.css': site_css,
                    './public/stylesheets/admin_build.css': admin_css
                }
            }
        },

        watch: {
            /*site_build_js: {
                files: ['./resources/!**!/!*.js'],
                tasks: ['js']
            },*/
            development: {
                files: ['./public/stylesheets/**/*.less'],
                tasks: ['less-prod']
            }
        },

        clean: ['./resources/tmp']
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'less:production', 'clean']);
    grunt.registerTask('less-prod', ['less:production', 'clean']);
    grunt.registerTask('js', ['uglify:site_build_js', 'clean']);
};
