// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        //�ٶȵļ���ֵ
        speedMax:50,
        //�����ٶȼ���ֵ
        liveMax:20,
        //�Ƿ�ʹ������
        isEject:false,
        //�½����ٶ�
        accl:4,
        //ƽ�Ƽ��ٶ�
        accl_LR:2,
        //�������ٶ�
        ejectAcc:20,
        
    },



    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //ƽ�ƺ�������ٶ�
        this.fallSpeed = 0;
        this.xSpeed = 0;
        //�Ƿ�ʹ������
        this.isEject = false;
        //�Ƿ���̨����
        this.isStep = false;
        //���Ҽ���trigger
        this.isLeft = false;
        //�������trigger
        this.isRight = false;
        //�ж��Ƿ�һֱ����
        this.isSpace = false;
        //����ȼ��ʣ����
        this.fuel = 100;
        // ��ʼ�������������
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);  
        //������ײ���
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    start() {
     
    },

    //��ײ����
    onCollisionEnter: function (other, self) {
        console.log("On collision enter");
        console.log(other.node.groupIndex)
        if (other.node.groupIndex === 0) {
            console.log("Collide a step!");
            this.isStep = true;
            if (this.fallSpeed > this.liveMax) {
                console.log("Game Over!");
                //������Ϸ������Ϣ�Խ�����Ϸ
                var gameOverEvent = new cc.Event.EventCustom('gameOver', true);
                this.node.dispatchEvent(gameOverEvent);
                //���ڻ�׷����������
            }
           
          
                
            this.fallSpeed = -30;
        }
        if (other.node.groupIndex === 2) {
            console.log("GameOver!")
            //������Ϸ������Ϣ�Խ�����Ϸ
            var gameOverEvent = new cc.Event.EventCustom('gameOver', true);
            this.node.dispatchEvent(gameOverEvent);
        }
    },

    onCollisionExit: function (other, self) {
        console.log('On collison exit!');
        if (other.node.groupIndex === 0) {
            this.fallSpeed = 0;
            console.log("Leave a step!")
            this.isStep = false;
        }
    },

    //��������_ƽ���ƶ�_��������
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.isLeft = true;
                break;
            case cc.macro.KEY.d:
                this.isRight = true;
                break;
            case cc.macro.KEY.space:
                if (!this.isSpace) {
                    this.isEject = true;
                    this.isSpace = true;
                }
                var jet = this.node.getChildByName("jet");
                jet.getComponent(cc.Sprite).enabled = true;
                break;
                
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.isLeft = false;
                this.xSpeed = 0
                break;
            case cc.macro.KEY.d:
                this.isRight = false;
                this.xSpeed = 0
                break;
            case cc.macro.KEY.space:
                var jet = this.node.getChildByName("jet");
                console.log(jet)
                jet.getComponent(cc.Sprite).enabled = false;
                this.isSpace = false;
                break;
        }
    },


    //�����ƶ�
    update: function (dt) {
        if (!this.isStep) {
            if (this.fallSpeed > this.speedMax) this.fallSpeed = this.speedMax
            else this.fallSpeed += this.accl * dt
        } else {
            if (this.fuel < 100) {
                this.fuel += 1;
            }
        }

        if (this.isLeft) {
            this.xSpeed -= this.accl_LR * dt;
        } else if (this.isRight) {
            this.xSpeed += this.accl_LR * dt;
        }
        if (this.isEject) {
            if (this.fuel > 0) {
                if (this.isStep) {
                    this.fallSpeed = -30;
                } else this.fallSpeed = 0;
                this.isEject = false;
                this.fuel -= 30;
                if (this.fuel < 0) {
                    this.fuel = 0;
                }
            }
            
        }

        //����ʵʱȼ����Ϣ
        
        var fuelEvent = new cc.Event.EventCustom('fuelUpdate', true);
        fuelEvent.setUserData(this.fuel);
        this.node.dispatchEvent(fuelEvent);

        //����ʵʱ�ٶ���Ϣ
        var speedEvent = new cc.Event.EventCustom('speedUpdate', true);
        speedEvent.setUserData(this.fallSpeed);
        this.node.dispatchEvent(speedEvent);
        
        this.node.y -= this.fallSpeed * dt
        this.node.x += this.xSpeed * dt;
    },
});
