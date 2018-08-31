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
        //速度的极限值
        speedMax:50,
        //存活的速度极限值
        liveMax:20,
        //是否使用喷气
        isEject:false,
        //下降加速度
        accl:4,
        //平移加速度
        accl_LR:2,
        //喷气加速度
        ejectAcc:20,
        
    },



    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //平移和下落的速度
        this.fallSpeed = 0;
        this.xSpeed = 0;
        //是否使用喷气
        this.isEject = false;
        //是否在台阶上
        this.isStep = false;
        //向右加速trigger
        this.isLeft = false;
        //向左加速trigger
        this.isRight = false;
        //判断是否一直喷气
        this.isSpace = false;
        //喷气燃料剩余量
        this.fuel = 100;
        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);  
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    start() {
     
    },

    //碰撞控制
    onCollisionEnter: function (other, self) {
        console.log("On collision enter");
        console.log(other.node.groupIndex)
        if (other.node.groupIndex === 0) {
            console.log("Collide a step!");
            this.isStep = true;
            if (this.fallSpeed > this.liveMax) {
                console.log("Game Over!");
                //发送游戏结束信息以结束游戏
                var gameOverEvent = new cc.Event.EventCustom('gameOver', true);
                this.node.dispatchEvent(gameOverEvent);
                //后期会追加死亡动画
            }
           
          
                
            this.fallSpeed = -30;
        }
        if (other.node.groupIndex === 2) {
            console.log("GameOver!")
            //发送游戏结束信息以结束游戏
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

    //按键控制_平移移动_气流喷射
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


    //更新移动
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

        //发送实时燃料信息
        
        var fuelEvent = new cc.Event.EventCustom('fuelUpdate', true);
        fuelEvent.setUserData(this.fuel);
        this.node.dispatchEvent(fuelEvent);

        //发送实时速度信息
        var speedEvent = new cc.Event.EventCustom('speedUpdate', true);
        speedEvent.setUserData(this.fallSpeed);
        this.node.dispatchEvent(speedEvent);
        
        this.node.y -= this.fallSpeed * dt
        this.node.x += this.xSpeed * dt;
    },
});
