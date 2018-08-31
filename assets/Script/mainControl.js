// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//控制游戏的流程，包括:
// 砖块的随机出现    under way
// 速度label的控制
// 游戏结束的控制
cc.Class({
    extends: cc.Component,

    properties: {
        //卷轴速度，用以控制砖块向上走的速度
        constantSpeed:30,
        //生成新砖块的间隔（帧）
        interval: 600,
        //砖块prefab
        blockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //砖块生成的y值
        yPosition:-100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.generateBlock();
        //生成间隔计数器
        this.count = 0;

        //gameOver 消息处理
        this.node.on('gameOver', function (event) {
            event.stopPropagation();
            cc.director.loadScene('gameOverScene');
        });
    },

    start () {
        
    },

    generateBlock: function () {
        var newBlock = cc.instantiate(this.blockPrefab);
        this.node.addChild(newBlock);
        //console.log(newBlock);
        newBlock.setPosition(this.getRandomPosition());
    },

    getRandomPosition: function () {
        var randX = 0;
        var y = this.yPosition;
        randX = Math.random() * 356-200;
        console.log("x:" + randX + " y:" + y);
        return cc.v2(randX, y);
    },

    update(dt) {
        if (this.count >= this.interval) {
            console.log("Generate a block!");
            this.generateBlock();
            this.count = 0;
        } else this.count++;
    },
});
