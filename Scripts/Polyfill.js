(function (){
    /**
     * Полифил Object.create
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
     */
    if (typeof Object.create !== 'function') {
        Object.create = function(o, props) {
            function F() {}
            F.prototype = o;

            if (typeof(props) === "object") {
                for (prop in props) {
                    if (props.hasOwnProperty((prop))) {
                        F[prop] = props[prop];
                    }
                }
            }
            return new F();
        };
    }
    /**
     * Полифил Array.forEach
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
     */
    if ( !Array.prototype.forEach ) {
        Array.prototype.forEach = function forEach( callback, thisArg ) {
            var T, k;
            if ( this == null ) {
              throw new TypeError( "this is null or not defined" );
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if ( {}.toString.call(callback) !== "[object Function]" ) {
              throw new TypeError( callback + " is not a function" );
            }
            if ( thisArg ) {
              T = thisArg;
            }
            k = 0;
            while( k < len ) {
              var kValue;
              if ( Object.prototype.hasOwnProperty.call(O, k) ) {
                kValue = O[ k ];
                callback.call( T, kValue, k, O );
              }
              k++;
            }
        };
    }
    /**
     * Полифил Array.some
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some
     */
    if (!Array.prototype.some) {
      Array.prototype.some = function (fun)
      {
        "use strict";
        if (this == null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in t && fun.call(thisp, t[i], i, t))
                return true;
        }
        return false;
      };
    }
    /**
     * Полифил Array.some
     * @source https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
     */
    if (!Array.prototype.filter)
    {
        Array.prototype.filter = function(fun /*, thisp */)
        {
            "use strict";
            if (this == null)
                throw new TypeError();
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun != "function")
                throw new TypeError();
            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++)
            {
                if (i in t)
                {
                    var val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t))
                        res.push(val);
                }
            }
            return res;
        };
    }
}());