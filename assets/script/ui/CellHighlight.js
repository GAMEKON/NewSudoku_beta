cc.Class({
    extends: cc.Component,

    properties: {
        txt: cc.Label,
        candidates: cc.Node,
        candidatesLabels: [cc.Label]
    },

    showCandidates: function (haveCandidates, highlightCandidates, color) {
        for (var i = 0; i < highlightCandidates.length; i++) {
            if (highlightCandidates[i] != null) {

                if (haveCandidates.indexOf(parseInt(highlightCandidates[i]))>=0) {
                    this.candidatesLabels[highlightCandidates[i] - 1].string = highlightCandidates[i];
                    this.candidatesLabels[highlightCandidates[i] - 1].node.color = color;
                }
            }
        }
    }
});
