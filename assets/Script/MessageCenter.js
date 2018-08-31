//��Ϣ�������ĵ�ʵ��

var bindFuncList = []; //���������洢

var emitList = [];

/**
 * �����¼�������
 * @param {�¼���} key
 * @param {�ص�����} cbFunc
 */

function on(key, cbFunc) {
    if (bindFuncList[key]) {
        //�����¼������򽫻ص����뵽�����б�
        bindFuncList[key].push(cbFunc);
    } else {
        var ary = new Array();
        ary.push(cbFunc);
        bindFuncList[key] = ary;
    }
}

/**
 * ������Ϣ
 * @param {�¼���} key
 * @param {�ص�����} args
 */
function emit(key, args) {
    var ary = bindFuncList[key];
    if (ary) {
        //�¼���ע��������Ϣ
        for (var i in ary) {
            if (ary.hasOwnProperty(i)) {
                try {
                    ary[i].call(this, args);
                } catch (error) {
                    console.log("�ص�ʧ�ܣ�");
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

//��emitList�е���Ϣȫ������
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
                                console.log("�ص�ʧ�ܣ�");
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

