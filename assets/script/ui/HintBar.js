cc.Class({
    extends: cc.Component,

    properties: {
        grid: cc.Node,
        CellHighlight: {default: null, type: cc.Prefab},
        BoxHighlight: {default: null, type: cc.Prefab},
        RowHighlight: {default: null, type: cc.Prefab},
        ColHighlight: {default: null, type: cc.Prefab},

        bar: cc.Node,
        title: cc.Label,
        hint: cc.RichText,
        buttons: cc.RichText,

        currentHint: null,
        currentRequest: null,
        currentStep: {default: 0, serializable: false, visible: false},
        currentPuzzle: [],
        highlights: []
    },

    showHint: function (p, o) {
        this.currentPuzzle = p;
        this.currentHint = o;
        this.currentStep = 0;
        this.show(0);
        this.node.active = true;
    },

    clearHighlights: function () {
        while (this.highlights.length > 0) {
            var highlight = this.highlights.pop();
            this.grid.removeChild(highlight);
            highlight.destroy();
        }
    },

    getHouseHighlight: function (house, index) {
        var houseHighlight = null;
        if (house == "row") {
            houseHighlight = cc.instantiate(this.RowHighlight);
            houseHighlight.x = 0;
            houseHighlight.y = (4 - index) * 55;
        }
        if (house == "column") {
            houseHighlight = cc.instantiate(this.ColHighlight);
            houseHighlight.x = (index - 4) * 55;
            houseHighlight.y = 0;
        }
        else if (house == "box") {
            houseHighlight = cc.instantiate(this.BoxHighlight);
            houseHighlight.x = (parseInt(index % 3) - 1) * 165;
            houseHighlight.y = (1 - parseInt(index / 3)) * 165;
        }
        return houseHighlight;
    },

    getCellHighlight: function (index) {
        var cellHighlight = cc.instantiate(this.CellHighlight);
        cellHighlight.x = (parseInt(index % 9) - 4) * 55;
        cellHighlight.y = (4 - parseInt(index / 9)) * 55;
        return cellHighlight
    },

    getNumbersString: function (numbers, color) {
        var s = "";
        for (var i = 0; i < numbers.length; i++) {
            if (i > 0)
                s += ", ";
            s += ("<color=" + color + ">" + numbers[i] + "</c>");
        }
        return s;
    },

    show: function (i) {
        this.title.string = this.currentHint.cause;
        var highlight;
        switch (this.currentHint.cause) {
            case "Open Singles":
                //house：行 还是 列 还是 宫；index：哪一行列宫；cell：总的格子id号；val：数值
                switch (i) {
                    case 0:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "Look at <color=#cc33cc>this " + this.currentHint.result.house + "</c>.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        highlight = this.getCellHighlight(this.currentHint.result.cell);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "<color=#cc33cc>This</c> is only empty cell in the " +
                            this.currentHint.result.house + ".";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 2:
                        this.hint.string = "So <color=#cc33cc>this</c> must be " + this.currentHint.result.val + ".";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Open Singles
            case "Single Candidate":
                //cell：总的格子id号；val：数值
                switch (i) {
                    case 0:
                        highlight = this.getCellHighlight(this.currentHint.result.cell);
                        highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.cell].candidates, this.currentPuzzle[this.currentHint.result.cell].candidates, cc.Color.GREEN);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "<color=#00aa00>" + this.currentHint.result.val + "</c> is the only candidate in <color=#cc33cc>this</c> cell.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        this.hint.string = "So <color=#cc33cc>this</c> must be " + this.currentHint.result.val + ".";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Single Candidate
            case "Visual Elimination":
                //house：行 还是 列 还是 宫；index：哪一行列宫；cell：总的格子id号；val：数值
                switch (i) {
                    case 0:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "Look at <color=#cc33cc>this " + this.currentHint.result.house + "</c>.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        highlight = this.getCellHighlight(this.currentHint.result.cell);
                        highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.cell].candidates, [this.currentHint.result.val], cc.Color.GREEN);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "<color=#00aa00>" + this.currentHint.result.val + "</c> only appears in <color=#cc33cc>this</c> cell.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 2:
                        this.hint.string = "So <color=#cc33cc>this</c> must be " + this.currentHint.result.val + ".";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Visual Elimination
            case "Naked Pair":
            case "Naked Triplet":
            case "Naked Quad":
                //return {house:houseString, index:j, updateCells:result.updateCells, becauseCells:result.becauseCells, becauseCandidates:result.becauseCandidates};
                switch (i) {
                    case 0:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "Look at <color=#cc33cc>this " + this.currentHint.result.house + "</c>.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i1 = 0; i1 < this.currentHint.result.becauseCells.length; i1++) {
                            highlight = this.getCellHighlight(this.currentHint.result.becauseCells[i1]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.becauseCells[i1]].candidates, this.currentHint.result.becauseCandidates, cc.Color.GREEN);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " is the only candidates in <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 2:
                        this.hint.string = "So " + this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " must be in <color=#cc33cc>these</c> cells respectively.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 3:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i2 = 0; i2 < this.currentHint.result.updateCells.length; i2++) {
                            highlight = this.getCellHighlight(this.currentHint.result.updateCells[i2]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.updateCells[i2]].candidates, this.currentHint.result.removeCandidates, cc.Color.RED);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = "In the meanwhile, <color=#cc0000>these</c> numbers won't be in <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Naked Pair, Naked Triplet, Naked Quad
            case "Pointing Elimination":
                //return {house:houseString, index:j, updateCells:uniqueArray(cellsUpdated),becauseCells:cellsWithCandidate,becauseCandidates:[digit]};
                switch (i) {
                    case 0:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "Look at <color=#cc33cc>this " + this.currentHint.result.house + "</c>.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i3 = 0; i3 < this.currentHint.result.becauseCells.length; i3++) {
                            highlight = this.getCellHighlight(this.currentHint.result.becauseCells[i3]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.becauseCells[i3]].candidates, this.currentHint.result.becauseCandidates, cc.Color.GREEN);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " only appears in <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 2:
                        this.hint.string = "So " + this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " must be in one of <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 3:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.altHouse, this.currentHint.result.altIndex);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i2 = 0; i2 < this.currentHint.result.updateCells.length; i2++) {
                            highlight = this.getCellHighlight(this.currentHint.result.updateCells[i2]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.updateCells[i2]].candidates, this.currentHint.result.removeCandidates, cc.Color.RED);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = "Wherever it is, " + this.getNumbersString(this.currentHint.result.removeCandidates, "#cc0000") + " won't be in <color=#cc33cc>these</c> cells of <color=#cc33cc>this</c> "+this.currentHint.result.altHouse+".";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Pointing Elimination
            case "Hidden Pair":
            case "Hidden Triplet":
            case "Hidden Quad":
                //return {house:houseString, index:j, updateCells:result.updateCells, becauseCells:result.becauseCells, becauseCandidates:result.becauseCandidates};
                switch (i) {
                    case 0:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        this.hint.string = "Look at <color=#cc33cc>this " + this.currentHint.result.house + "</c>.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 1:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i1 = 0; i1 < this.currentHint.result.becauseCells.length; i1++) {
                            highlight = this.getCellHighlight(this.currentHint.result.becauseCells[i1]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.becauseCells[i1]].candidates, this.currentHint.result.becauseCandidates, cc.Color.GREEN);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " only appears in <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 2:
                        this.hint.string = "So " + this.getNumbersString(this.currentHint.result.becauseCandidates, "#00aa00") + " must be in <color=#cc33cc>these</c> cells respectively.";
                        this.buttons.string = "<color=#006600 click='onHintPrevious'>Previous</c>     <color=#0000ff click='onHintNext'>Next</c>";
                        break;
                    case 3:
                        this.clearHighlights();
                        highlight = this.getHouseHighlight(this.currentHint.result.house, this.currentHint.result.index);
                        this.grid.addChild(highlight);
                        this.highlights.push(highlight);
                        for (var i2 = 0; i2 < this.currentHint.result.updateCells.length; i2++) {
                            highlight = this.getCellHighlight(this.currentHint.result.updateCells[i2]);
                            highlight.getComponent("CellHighlight").showCandidates(this.currentPuzzle[this.currentHint.result.updateCells[i2]].candidates, this.currentHint.result.removeCandidates, cc.Color.RED);
                            this.grid.addChild(highlight);
                            this.highlights.push(highlight);
                        }
                        this.hint.string = "In the meanwhile, <color=#cc0000>these</c> numbers won't be in <color=#cc33cc>these</c> cells.";
                        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
                        break;
                }
                break;//Hidden Pair, Hidden Triplet, Hidden Quad
        }


    },

    hintNext: function () {
        if (this.currentHint) {
            this.currentStep++;
            this.show(this.currentStep);
        }
    },

    hintPrevious: function () {
        if (this.currentHint) {
            this.currentStep--;
            this.show(this.currentStep);
        }
    },

    hintApply: function () {
        this.hideHint();
    },

    hideHint: function () {
        this.clearHighlights();
        this.currentHint = null;
        this.currentRequest = null;
        this.currentStep = 0;
        this.node.active = false;
    },

    requestShowCandidates:function () {
        this.currentRequest = "Need Candidates";
        this.title.string = "Need Candidates";
        this.hint.string = "Let's mark up all the candidates.";
        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
        this.node.active = true;
    },

    requestFixWrongCells:function () {
        this.currentRequest = "Fix Cells";
        this.title.string = "Fix Cells";
        this.hint.string = "Let's fix the wrong cells.";
        this.buttons.string = "<color=#006600 click='onHintCancel'>Cancel</c>     <color=#0000ff click='onHintApply'>Apply</c>";
        this.node.active = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
