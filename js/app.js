requirejs.config ({

    baseUrl : 'js/app', // base url is directory of the actual app
    paths: {

        utilities : '../utilities', // path to utility modules
        jquery : '../libs/jquery-2.1.4.min', // jquery path
        three : '../libs/three.min', // three webgl library
        elements : 'elements' // reusable elements
    }
});

require(['Main'], function(Main) {

    Main.init();
});