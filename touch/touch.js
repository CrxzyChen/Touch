//Touch封装
let TouchBase = function (options = {}) {
    let param = {};
    let initParam = function () {
        param = {
            startTime: 0,
            endTime: 0,
            startFocus: null,
            endFocus: null,
            changed: {
                distanceX: 0,
                distanceY: 0,
                timeInterval: 0,
            },
            moved: {
                isMoved: false,
                moveX: 0,
                moveY: 0,
                distanceX: 0,
                distanceY: 0,
                timeInterval: 0,
                time: 0,
                speedX: 0,
                speedY: 0,
                focus: null,
            }
        };
    };
    let events = [];
    let call = function (event) {
        if (events[event] !== undefined) {
            events[event].forEach(element => {
                element(param)
            });
        }
    };
    let touchStart = function (event) {
        initParam();
        param.startTime = Date.now();
        param.startFocus = event.touches[0];

        call('touchStart')
    };
    let on = function (event, callback) {
        if (typeof callback === 'function') {
            if (events[event] !== undefined) {
                events[event].push(callback)
            } else {
                events[event] = [];
                events[event].push(callback)
            }
        }
    };
    let touchMove = function (event) {
        event.preventDefault();
        if (param.moved.isMoved === false) {
            param.moved.moveX = param.moved.distanceX = event.touches[0].pageX - param.startFocus.pageX;
            param.moved.moveY = param.moved.distanceY = event.touches[0].pageY - param.startFocus.pageY;
            param.moved.time = Date.now();
            param.moved.timeInterval = param.moved.time - param.startTime;
            param.moved.isMoved = true;
        } else {
            param.moved.moveX = event.touches[0].pageX - param.startFocus.pageX;
            param.moved.moveY = event.touches[0].pageY - param.startFocus.pageY;
            param.moved.distanceX = event.touches[0].pageX - param.moved.focus.pageX;
            param.moved.distanceY = event.touches[0].pageY - param.moved.focus.pageY;
            nowTime = Date.now();
            param.moved.timeInterval = nowTime - param.moved.time;
            param.moved.time = nowTime;
        }
        param.moved.speedX = param.moved.distanceX / param.moved.timeInterval;
        param.moved.speedY = param.moved.distanceY / param.moved.timeInterval;
        param.moved.focus = event.touches[0];

        call('touchMove')
    };
    let touchEnd = function (event) {
        param.endTime = Date.now();
        param.endFocus = event.changedTouches[0];

        //changed
        param.changed.distanceX = param.endFocus.pageX - param.startFocus.pageX;
        param.changed.distanceY = param.endFocus.pageY - param.startFocus.pageY;
        param.changed.timeInterval = param.endTime - param.startTime;
        param.changed.speedX = param.changed.distanceX / param.changed.timeInterval;
        param.changed.speedY = param.changed.distanceY / param.changed.timeInterval;
        call('touchEnd')
    };
    let touchCancel = function (event) {
        call('touchCancel')
    };

    //init 
    document.addEventListener('touchstart', touchStart, {
        passive: false
    });
    document.addEventListener('touchmove', touchMove, {
        passive: false
    });
    document.addEventListener('touchend', touchEnd, {
        passive: false
    });
    document.addEventListener('touchcanel', touchCancel, {
        passive: false
    });

    return {
        on: on
    }
};
let TouchController = function () {
    let touchBase = new TouchBase();
    return {
        touchBase: touchBase
    }
};