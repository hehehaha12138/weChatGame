 
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        fuelLabel: {
            default: null,
            type: cc.Label,
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        var label = this.label;
        var fuelLabel = this.fuelLabel;
        this.node.on('speedUpdate', function (event) {
            label.string = "Speed:" + (event.getUserData()/10).toFixed(1);
            event.stopPropagation();
        });
        this.node.on('fuelUpdate', function (event) {
            fuelLabel.string = "Fuel:" + event.getUserData() + "%";
            event.stopPropagation();
        });
    },


    updateScore: function (newSpeed) {
        
    },
    // called every frame
    update: function (dt) {
        
    },
});
