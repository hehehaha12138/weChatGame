// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//������Ϸ�����̣�����:
// ש����������    under way
// �ٶ�label�Ŀ���
// ��Ϸ�����Ŀ���
cc.Class({
    extends: cc.Component,

    properties: {
        //�����ٶȣ����Կ���ש�������ߵ��ٶ�
        constantSpeed:30,
        //������ש��ļ����֡��
        interval: 600,
        //ש��prefab
        blockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //ש�����ɵ�yֵ
        yPosition:-100,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.generateBlock();
        //���ɼ��������
        this.count = 0;

        //gameOver ��Ϣ����
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
