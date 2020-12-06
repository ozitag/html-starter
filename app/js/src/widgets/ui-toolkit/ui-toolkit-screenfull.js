(function () {
    'use strict';

    const document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
    
    const fn = (function () {
        let val;
        const fnMap = [
            [
                'requestFullscreen',
                'exitFullscreen',
                'fullscreenElement',
                'fullscreenEnabled',
                'fullscreenchange',
                'fullscreenerror'
            ],
            [
                'webkitRequestFullscreen',
                'webkitExitFullscreen',
                'webkitFullscreenElement',
                'webkitFullscreenEnabled',
                'webkitfullscreenchange',
                'webkitfullscreenerror'

            ],
            [
                'webkitRequestFullScreen',
                'webkitCancelFullScreen',
                'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen',
                'webkitfullscreenchange',
                'webkitfullscreenerror'

            ],
            [
                'mozRequestFullScreen',
                'mozCancelFullScreen',
                'mozFullScreenElement',
                'mozFullScreenEnabled',
                'mozfullscreenchange',
                'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen',
                'msExitFullscreen',
                'msFullscreenElement',
                'msFullscreenEnabled',
                'MSFullscreenChange',
                'MSFullscreenError'
            ]
        ];

        let ret = {};
        for (let i = 0; i < fnMap.length; i++) {
            val = fnMap[i];
            if (val && val[1] in document) {
                for (let i = 0; i < val.length; i++) {
                    ret[fnMap[0][i]] = val[i];
                }
                return ret;
            }
        }

        return false;
    })();

    const eventNameMap = {
        change: fn.fullscreenchange,
        error: fn.fullscreenerror
    };

    const screenfull = {
        request: function (element) {
            return new Promise((resolve, reject) => {
                const onFullScreenEntered = () => {
                    this.off('change', onFullScreenEntered);
                    resolve();
                };

                this.on('change', onFullScreenEntered);

                element = element || document.documentElement;

                const returnPromise = element[fn.requestFullscreen]();

                if (returnPromise instanceof Promise) {
                    returnPromise.then(onFullScreenEntered).catch(reject);
                }
            });
        },
        exit: function () {
            return new Promise((resolve, reject) => {
                if (!this.isFullscreen) {
                    resolve();
                    return;
                }

                const onFullScreenExit = ()  =>{
                    this.off('change', onFullScreenExit);
                    resolve();
                };

                this.on('change', onFullScreenExit);

                const returnPromise = document[fn.exitFullscreen]();

                if (returnPromise instanceof Promise) {
                    returnPromise.then(onFullScreenExit).catch(reject);
                }
            });
        },
        toggle: function (element) {
            return this.isFullscreen ? this.exit() : this.request(element);
        },
        onchange: function (callback) {
            this.on('change', callback);
        },
        onerror: function (callback) {
            this.on('error', callback);
        },
        on: function (event, callback) {
            const eventName = eventNameMap[event];
            if (eventName) {
                document.addEventListener(eventName, callback, false);
            }
        },
        off: function (event, callback) {
            const eventName = eventNameMap[event];
            if (eventName) {
                document.removeEventListener(eventName, callback, false);
            }
        },
        raw: fn,
    };

    if (!fn) {
        window.screenfull = { isEnabled: false };
        return;
    }

    Object.defineProperties(screenfull, {
        isFullscreen: {
            get: function () {
                return Boolean(document[fn.fullscreenElement]);
            }
        },
        element: {
            enumerable: true,
            get: function () {
                return document[fn.fullscreenElement];
            }
        },
        isEnabled: {
            enumerable: true,
            get: function () {
                return Boolean(document[fn.fullscreenEnabled]);
            }
        }
    });

    window.screenfull = screenfull;
})();