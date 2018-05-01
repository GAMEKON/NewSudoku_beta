cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    onHintCancel:function () {
        this.node.dispatchEvent( new cc.Event.EventCustom('HintCancel', true) );
    },

    onHintNext:function () {
        this.node.dispatchEvent( new cc.Event.EventCustom('HintNext', true) );
    },

    onHintPrevious:function () {
        this.node.dispatchEvent( new cc.Event.EventCustom('HintPrevious', true) );
    },

    onHintApply:function () {
        this.node.dispatchEvent( new cc.Event.EventCustom('HintApply', true) );
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
