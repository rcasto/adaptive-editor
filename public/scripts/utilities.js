function debounce(func, debounceTimeInMs) {
    var debounceId = null;
    return function () {
        var that = this;
        var args = arguments;
        if (debounceId) {
            clearTimeout(debounceId);
        }
        debounceId = setTimeout(function () {
            func.apply(that, args);
            debounceId = null;
        }, debounceTimeInMs);
    };
}

function getWindowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

export default {
    debounce,
    getWindowSize
};