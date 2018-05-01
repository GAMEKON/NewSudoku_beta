cc.Class({
    extends: cc.Component,

    properties: {
        effect: cc.Node,
        txt: cc.Label,
        candidates: cc.Node,
        candidatesShown: [],
        candidatesLabels: [cc.Label]
    },

    syncCandidates: function () {
        for (var i = 0; i < this.candidatesLabels.length; i++) {
            if (this.candidatesShown[i] == null || this.candidatesShown[i] == undefined) {
                this.candidatesLabels[i].string = " ";
            }
            else {
                this.candidatesLabels[i].string = this.candidatesShown[i].toString();
            }
        }
    },

    showUpdateEffect: function () {
        this.effect.opacity = 255;
        var a = cc.fadeOut(1);
        this.effect.runAction(a);
    },

    // use this for initialization
    onLoad: function () {

    },

    clean:function () {
        this.candidatesShown = [];
        for (var i = 0; i < this.candidatesLabels.length; i++) {
            this.candidatesLabels[i].string = " ";
        }
        this.txt = "";
    }


});