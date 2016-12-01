import isArray from 'd2-utilizr/lib/isArray';

export var Plugin;

Plugin = function({ refs, VERSION, renderFn, initializeFn }) {
    const t = this;

    // public properties
    t.url = null;
    t.username = null;
    t.password = null;
    t.loadingIndicator = false;

    // private properties
    let _layouts = [];
    let _isPending = false;
    let _isReady = false;

    // public functions
    t.add = function (...layouts) {
        layouts = isArray(layouts[0]) ? layouts[0] : layouts;

        if (layouts.length) {
            _layouts = [..._layouts, ...layouts];
        }
    };

    t.load = function (...layouts) {
        t.add(isArray(layouts[0]) ? layouts[0] : layouts);

        _runFn();
    };

    // private functions
    const _readyFn = function () {
        _isReady = true;
        _isPending = false;
    };

    const _pendingFn = function () {
        _isPending = true;
    };

    const _runFn = function (initializeFn = initializeFn || _initializeFn) {
        if (_isReady) {
            while (_layouts.length) {
                renderFn(t, _layouts.shift());
            }
        }
        else if (!_isPending) {
            _pendingFn();

            initializeFn();
        }
    };

    const _initializeFn = function (readyFn = _readyFn, runFn = _runFn) {
        const appManager = refs.appManager;
        const requestManager = refs.requestManager;
        const init = refs.init;
        const Request = refs.api.Request;

        appManager.manifestVersion = VERSION;
        appManager.path = t.url;
        appManager.setAuth(t.username && t.password ? t.username + ':' + t.password : null);

        // user account
        $.getJSON(appManager.getPath() + '/api/me/user-account.json').done(function (userAccount) {
            appManager.userAccount = userAccount;

            requestManager.add(new Request(init.legendSetsInit(refs)));
            requestManager.add(new Request(init.dimensionsInit(refs)));

            readyFn();

            requestManager.set(runFn);
            requestManager.run();
        });
    };
};
