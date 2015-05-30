// define dependent files
define(['jquery'], function($) {

    'use strict';

    function Class (parent) {

        var klass = function () {
            this.init.apply(this, arguments);
        },
        self;

        klass.prototype.init = function(){};

        // Shortcut to access prototype
        klass.fn = klass.prototype;

        // Shortcut to access class
        klass.fn.parent = klass;

        // Adding class properties
        klass.extend = function (obj) {

            var extended = obj.extended,
                i;

            for (i in obj) {
                klass[i] = obj[i];
            }

            if (extended) {
                extended(klass);
            }
        };

        // Adding instance properties
        klass.include = function (obj) {

            var included = obj.included,
                i;

            for (i in obj) {
                klass.fn[i] = obj[i];
            }

            if (included) {
                included(klass);
            }
        };

        // Adding a proxy function
        klass.proxy = function (func) {
        
            self = this;
            
            return (function () {
                return func.apply(self, arguments);
            });
        };

        // Add the function on instances too
        klass.fn.proxy = klass.proxy;
        
        return klass;
    }

    return {
        
        create : function () {
            return new Class;
        }
    };

});