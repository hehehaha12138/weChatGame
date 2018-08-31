//消息处理中心的实现

var bindFuncList = []; //监听函数存储

var emitList = [];

/**
 * 设置事件监听器
 * @param {事件名} key
 * @param {回调函数} cbFunc
 */

function on(key, cbFunc) {
    if (bindFuncList[key]) {
        //已有事件监听则将回调加入到监听列表
        bindFuncList[key].push(cbFunc);
    } else {
        var ary = new Array();
        ary.push(cbFunc);
        bindFuncList[key] = ary;
    }
}

/**
 * 发送消息
 * @param {事件名} key
 * @param {回调参数} args
 */
function emit(key, args) {
    var ary = bindFuncList[key];
    if (ary) {
        //事件已注册则发送信息
        for (var i in ary) {
            if (ary.hasOwnProperty(i)) {
                try {
                    ary[i].call(this, args);
                } catch (error) {
                    console.log("回调失败！");
                }
            }
        }
    } else {
        if (emitList[key]) {
            emitList[key].push(args);
        } else {
            var ary = new Array();
            ary.push(args);
            emitList[key] = ary;
        }
    }
}

//将emitList中的消息全部发出
function emitAll() {
    for (var key in emitList) {
        if (emitList.hasOwnProperty(key)) {
            var emitAry = emitList[key];
            for (var j in emitAry) {
                if (emitAry.hasOwnProperty(j)) {
                    var args = emitAry[j];
                    var ary = bindFuncList[key];
                    for (var iterator in ary) {
                        if (ary.hasOwnProperty(iterator)) {
                            try {
                                ary[iterator].call(this, args);
                            } catch (error) {
                                console.log("回调失败！");
                            }
                        }
                    }
                }
            }
        }
    }

    emitList = [];
}

function popAll() {
    bindFuncList = [];
} 

module.exports = {
    'on': on,
    'emit': emit,
    'emitAll': emitAll,
    'popAll':popAll,
}

