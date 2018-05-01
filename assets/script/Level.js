const Sudoku = require("Sudoku");
const Cell = require("Cell");
const Panel = require("Panel");
const HintBar = require("HintBar");
const MenuBar = require("MenuBar");
const DifficultyBar = require("DifficultyBar");

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        left: cc.Node,
        right: cc.Node,
        grid: cc.Node,
        menuBar: MenuBar,
        menuWindow: cc.Node,
        difficultyBar: DifficultyBar,
        hintBar: HintBar,
        panel: Panel,
        CellPrefab: {default: null, type: cc.Prefab},
        cells: [],
        needUpdate: [],
        waitingCellIndex: {default: -1, serializable: false, visible: false},
        puzzle: {default: null, serializable: false, visible: false},
        answer: {default: [], serializable: false, visible: false},
        wrongCells: {default: [], serializable: false, visible: false},
        editMode: {default: false, serializable: false, visible: false}
    },

    onResize: function () {
        var ss = cc.visibleRect;

        if (window.orientation==90 || window.orientation==-90 || (ss.width > ss.height)&&!cc.sys.isMobile) {
            cc.log("landscape!");

            this.node.getComponent(cc.Canvas).fitWidth = false;
            this.node.getComponent(cc.Canvas).fitHeight = true;
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            this.node.getComponent(cc.Canvas).designResolution = cc.size(960, 640);
            this.node.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
            this.node.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
            this.node.getComponent(cc.Layout).horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            this.node.getComponent(cc.Layout).padding = (ss.width - 960) / 4;
            this.node.getComponent(cc.Layout).spacingX = (ss.width - 960) / 2;

            this.left.setContentSize(640, 640);
            this.left.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.left.getComponent(cc.Widget).isAlignVerticalCenter = true;
            this.left.getComponent(cc.Widget).verticalCenter = 0;

            this.right.setContentSize(320, 500);
            this.right.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.right.getComponent(cc.Widget).isAlignVerticalCenter = true;
            this.right.getComponent(cc.Widget).verticalCenter = 0;

            this.right.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;

            this.hintBar.node.setContentSize(320, 360);
            this.hintBar.bar.setContentSize(320, 360);
            this.hintBar.node.setSiblingIndex(2);
            this.hintBar.hint.maxWidth = 320;

            this.difficultyBar.node.setContentSize(320, 60);
            this.difficultyBar.node.parent = this.right;
            this.difficultyBar.node.setSiblingIndex(0);
            this.difficultyBar.node.active = true;

            this.menuBar.node.setContentSize(320, 80);
            this.menuBar.node.parent = this.right;
            this.menuBar.node.setSiblingIndex(0);

            this.panel.node.setContentSize(320, 360);
            this.panel.node.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.panel.node.getComponent(cc.Widget).isAlignVerticalCenter = true;
            this.panel.node.getComponent(cc.Widget).verticalCenter = 0;
            this.panel.node.getComponent(cc.Layout).spacingY = 10;
            this.panel.numsPanel.setContentSize(185, 260);
            this.panel.numsPanel.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
            this.panel.numsPanel.getComponent(cc.Layout).spacingX = 10;
            this.panel.numsPanel.getComponent(cc.Layout).spacingY = 10;
            this.panel.editPanel.setContentSize(120, 80);
            this.panel.editPanel.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
            this.panel.editPanel.getComponent(cc.Layout).spacingX = 10;

            for (var i in this.panel.nums) {
                var num1 = this.panel.nums[i];
                num1.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
                num1.node.getComponent(cc.Widget).isAlignVerticalCenter = false;
            }
            this.panel.editButton.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.panel.editButton.node.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.panel.clearButton.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.panel.clearButton.node.getComponent(cc.Widget).isAlignVerticalCenter = false;

            if (ss.width / ss.height < 1.5) {
                this.node.getComponent(cc.Layout).padding = 0;
                this.getComponent(cc.Layout).spacingX = 0;
                this.left.setContentSize(540, 640);
                this.right.setContentSize(320, 500);
            }
        }
        else {
            cc.log("portrait!");

            this.node.getComponent(cc.Canvas).fitHeight = false;
            this.node.getComponent(cc.Canvas).fitWidth = true;
            cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            this.node.getComponent(cc.Canvas).designResolution = cc.size(640, 960);
            this.node.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
            this.node.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
            this.node.getComponent(cc.Layout).verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
            this.node.getComponent(cc.Layout).padding = 10;
            this.node.getComponent(cc.Layout).spacingY = (ss.height - 960) / 3;

            this.left.setContentSize(640, 580);
            this.left.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.left.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.left.getComponent(cc.Widget).horizontalCenter = 0;

            this.difficultyBar.node.parent = this.node;
            this.difficultyBar.node.setSiblingIndex(0);
            this.difficultyBar.node.setContentSize(640, 40);
            this.difficultyBar.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.difficultyBar.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.difficultyBar.getComponent(cc.Widget).horizontalCenter = 0;

            this.menuBar.node.parent = this.node;
            this.menuBar.node.setSiblingIndex(0);
            this.menuBar.node.setContentSize(640, 140);
            this.menuBar.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.menuBar.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.menuBar.getComponent(cc.Widget).horizontalCenter = 0;

            this.right.setContentSize(640, 200);
            this.right.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.right.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.right.getComponent(cc.Widget).horizontalCenter = 0;
            this.right.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
            this.right.getComponent(cc.Layout).spacingY = 10;

            this.hintBar.node.setContentSize(640, 200);
            this.hintBar.node.y = 0;
            this.hintBar.bar.setContentSize(640, 200);
            this.hintBar.node.setSiblingIndex(0);
            this.hintBar.hint.maxWidth = 640;
            this.hintBar.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.hintBar.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.hintBar.getComponent(cc.Widget).horizontalCenter = 0;

            this.panel.node.setContentSize(640, 200);
            this.panel.node.y = 0;
            this.panel.node.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.panel.node.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this.panel.node.getComponent(cc.Widget).horizontalCenter = 0;
            this.panel.node.getComponent(cc.Layout).spacingY = 5;
            this.panel.numsPanel.setContentSize(600, 100);
            this.panel.numsPanel.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
            this.panel.numsPanel.getComponent(cc.Layout).spacingX = 5;
            this.panel.editPanel.setContentSize(120, 80);
            this.panel.editPanel.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
            this.panel.editPanel.getComponent(cc.Layout).spacingX = 5;
            this.panel.numsPanel.setSiblingIndex(1);

            for (var j in this.panel.nums) {
                var num2 = this.panel.nums[j];
                num2.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
                num2.node.getComponent(cc.Widget).isAlignVerticalCenter = true;
                num2.node.getComponent(cc.Widget).verticalCenter = 0;
            }
            this.panel.editButton.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.panel.editButton.node.getComponent(cc.Widget).isAlignVerticalCenter = false;
            this.panel.clearButton.node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this.panel.clearButton.node.getComponent(cc.Widget).isAlignVerticalCenter = false;

            if (ss.height / ss.width < 1.5) {
                this.node.getComponent(cc.Canvas).designResolution = cc.size(640, 800);
                this.difficultyBar.node.active = false;
                this.node.getComponent(cc.Layout).spacingY = 0;
                this.node.getComponent(cc.Layout).padding = 3;
                this.menuBar.node.setContentSize(640, 70);
                this.left.setContentSize(640, 560);
                this.right.setContentSize(640, 170);
                this.panel.getComponent(cc.Layout).spacingY = 0;
                this.hintBar.node.setContentSize(640, 170);
                this.panel.node.setContentSize(640, 170);
            }
        }


    },//

    onLoad: function () {
        if (!cc.sys.isNative)
        {
            window.addEventListener("orientationchange", this.onResize.bind(this), false);
        }
            cc.view.setResizeCallback(this.onResize.bind(this));

        this.onResize();
        

        this.hintBar.node.on("HintCancel", this.onHintCancel, this);
        this.hintBar.node.on("HintNext", this.onHintNext, this);
        this.hintBar.node.on("HintPrevious", this.onHintPrevious, this);
        this.hintBar.node.on("HintApply", this.onHintApply, this);

        if (window.Global.currentPuzzleId < 0) {
            window.Global.currentPuzzleId = parseInt(Math.random() * window.Global.puzzles[window.Global.currentLevel].length);
        }
        var b = window.Global.puzzles[window.Global.currentLevel][window.Global.currentPuzzleId].puzzle.split(",");
        for (var n in b) {
            if (b[n] == "")
                b[n] = undefined;
            else
                b[n] = parseInt(b[n]);
        }
        var opts = {
            board: b,
            needAnalyze: false,
            boardUpdatedFn: this.onBoardUpdated.bind(this),
            boardFinishedFn: this.onBoardFinished.bind(this),
            boardErrorFn: this.onBoardError.bind(this),
            difficulty: window.Global.currentLevel,
            candidatesShowing: false,
            editingCandidates: false,
            boardFinished: false,
            boardError: false,
            onlyUpdatedCandidates: false,
            gradingMode: true, //solving without updating UI
            generatingMode: false, //silence board unsolvable errors
            invalidCandidates: [] //used by the generateBoard function
        };

        Sudoku.startNewPuzzle(opts);
        this.puzzle = Sudoku.getBoard();
        this.answer = window.Global.puzzles[window.Global.currentLevel][window.Global.currentPuzzleId].answer.split(",");
        for (var m in this.answer) {
            this.answer[m] = parseInt(this.answer[m]);
        }

        // for (var levels = 0; levels < 50; levels++) {
        //     Sudoku.startNewPuzzle(opts, this.onPuzzleAnswer.bind(this));
        //     this.puzzle = Sudoku.getBoard();
        //
        //     var p = "{puzzle: '";
        //     for (var l=0;l<this.puzzle.length;l++)
        //         if (l > 0) {
        //             p+=","+this.puzzle[l].val;
        //         }
        //         else{
        //             p+=this.puzzle[l].val;
        //         }
        //
        //     p+="', answer: '"+this.answer.toString()+"'}";
        //     cc.log(p);
        // }

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var cell = cc.instantiate(this.CellPrefab).getComponent(Cell);
                this.cells.push(cell.node);
                cell.node.on('click', this.onCellTouch, this);
                this.grid.addChild(cell.node);
                cell.node.x = -55 * 4 + 55 * j;
                cell.node.y = 55 * 4 - 55 * i;
            }
        }
        this.updateCells();
        for (var k = 0; k < this.panel.nums.length; k++) {
            var num = this.panel.nums[k];
            num.node.on('click', this.onFillButtonTouch, this);
        }
        this.panel.editButton.node.on('click', this.onEditButtonTouch, this);
        this.panel.clearButton.node.on('click', this.onClearButtonTouch, this);

        for (var l = 0; l < window.Global.filledNumbers.length; l++) {
            var v = parseInt(window.Global.filledNumbers[l]);
            if (!isNaN(v) && v != null && v != "" && v != undefined) {
                if (this.puzzle[l].val!=v)
                {
                    Sudoku.setBoardCell(l, v);
                    this.updateCells();
                    Sudoku.updateCandidates();
                }
            }
        }

        for (var m = 0; m < window.Global.filledCandidates.length; m++) {
            this.cells[m].getComponent(Cell).candidatesShown = window.Global.filledCandidates[m];
            this.cells[m].getComponent(Cell).syncCandidates();
            var u = parseInt(window.Global.filledNumbers[m]);
            if (isNaN(u) || u == null || u == "" || u == undefined) {
                if (window.Global.filledCandidates[m].length>0)
                    this.cells[m].getComponent(Cell).candidates.active = true;
            }
        }

        this.updateSave(false);
    },//
/////////////////////////////////////////////////////////////////////////////////////////////////
    onHintCancel: function () {
        if (this.menuWindow.active)
            return;
        this.panel.node.active = true;
        this.hintBar.hideHint();
    },//

    onHintNext: function () {
        if (this.menuWindow.active)
            return;
        this.hintBar.hintNext();
    },//

    onHintPrevious: function () {
        if (this.menuWindow.active)
            return;
        this.hintBar.hintPrevious();
    },//

    onHintApply: function () {
        if (this.menuWindow.active)
            return;

        if (this.hintBar.currentRequest == "Need Candidates") {
            this.showCandidates();
        }
        else if (this.hintBar.currentRequest == "Fix Cells") {
            this.fixWrongCells();
        }
        else if (this.hintBar.currentHint) {
            if (this.hintBar.currentHint.result.val) {
                Sudoku.setBoardCell(this.hintBar.currentHint.result.cell, this.hintBar.currentHint.result.val);
                this.cells[this.hintBar.currentHint.result.cell].getComponent(Cell).candidates.active = false;
                this.updateCells();
                Sudoku.updateCandidates();
                this.updateCandidatesAsSet(this.hintBar.currentHint.result.cell, this.hintBar.currentHint.result.val);
            }
            if (this.hintBar.currentHint.result.updateCells) {
                Sudoku.removeCandidatesFromCells(this.hintBar.currentHint.result.updateCells, this.hintBar.currentHint.result.removeCandidates, false);
                Sudoku.updateCandidates();
                this.updateCandidatesAsReject(this.hintBar.currentHint.result.updateCells, this.hintBar.currentHint.result.removeCandidates);
            }
        }
        this.panel.node.active = true;
        this.hintBar.hintApply();
        this.updateSave(this.checkFinished());
    },
//////////////////////////////////////////////////////////////////////////////////////////////////
    onBoardFinished: function (o) {
        // cc.log(o.difficultyInfo);
    },//

    onBoardError: function (o) {
        cc.log(o.msg);
    },//

    onBoardUpdated: function (o) {
        this.clearWaitingCellHighlight();
        this.panel.editButton.node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
        this.clearEditPanel();
        if (this.wrongCells.length > 0) {
            this.panel.node.active = false;
            this.hintBar.requestFixWrongCells();
            return;
        }
        if (o.cause != "Open Singles") {
            if (!this.allCandidatesShown()) {
                this.panel.node.active = false;
                this.hintBar.requestShowCandidates();
                return;
            }
        }
        this.panel.node.active = false;
        this.hintBar.showHint(this.puzzle, o);
    },//
//////////////////////////////////////////////////////////////////////////////////////////////////
    onCellTouch: function (e) {
        if (this.menuWindow.active)
            return;
        if (!this.panel.node.active)
            return;

        var touchedCellIndex = this.cells.indexOf(e.detail.node);
        if (this.waitingCellIndex != touchedCellIndex) {
            this.onBoardTouch(e);
            this.waitingCellIndex = this.cells.indexOf(e.detail.node);
            this.cells[this.waitingCellIndex].color = cc.Color.YELLOW;
            if (this.editMode) {
                this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.active = false;
                this.cells[this.waitingCellIndex].getComponent(Cell).candidates.active = true;
                this.mapCandidatesToPanel();
            }
        } else {
            this.onBoardTouch(e);
        }
    },

    onBoardTouch: function (e) {
        if (this.menuWindow.active)
            return;
        this.clearWaitingCellHighlight();
        this.clearEditPanel();
    },//

    onClearButtonTouch: function (e) {
        if (this.menuWindow.active)
            return;
        if (!this.panel.node.active)
            return;

        if (this.editMode) {
            if (this.waitingCellIndex >= 0) {
                var c1 = this.cells[this.waitingCellIndex].getComponent(Cell);
                c1.candidatesShown = [];
                c1.syncCandidates();
                this.mapCandidatesToPanel();
            }
        }
        else {
            this.removeWrongCell();
            if (this.waitingCellIndex >= 0) {
                var c2 = this.cells[this.waitingCellIndex].getComponent(Cell);
                c2.txt.node.active = false;
                c2.candidates.active = true;
            }
        }
        this.clearEditPanel();
        this.updateSave(false);
    },//

    onHintButtonTouch: function (e) {
        if (this.menuWindow.active)
            return;
        this.editMode = false;
        this.clearWaitingCellHighlight();
        this.panel.editButton.node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
        this.clearEditPanel();
        Sudoku.solveStep();
    },//

    onEditButtonTouch: function (e) {
        if (this.menuWindow.active)
            return;
        if (!this.panel.node.active)
            return;

        if (this.editMode) {
            if (this.waitingCellIndex >= 0) {
                if (this.wrongCells.indexOf(this.waitingCellIndex) >= 0) {
                    this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.active = true;
                    this.cells[this.waitingCellIndex].getComponent(Cell).candidates.active = false;
                }
                else {
                    this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.active = false;
                    this.cells[this.waitingCellIndex].getComponent(Cell).candidates.active = true;
                }
            }
            e.detail.node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
            this.clearEditPanel();
            this.editMode = false;
        }
        else {
            if (this.waitingCellIndex >= 0) {
                this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.active = false;
                this.cells[this.waitingCellIndex].getComponent(Cell).candidates.active = true;
            }
            e.detail.node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.YELLOW;
            this.mapCandidatesToPanel();
            this.editMode = true;
        }
    },//

    onFillButtonTouch: function (e) {
        if (this.menuWindow.active)
            return;
        if (!this.panel.node.active)
            return;

        if (this.waitingCellIndex >= 0) {
            var numIndex = this.panel.nums.indexOf(e.detail);
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (this.editMode) {
                c.candidates.active = true;
                c.txt.node.active = false;
                if (this.puzzle[this.waitingCellIndex].candidates.indexOf(numIndex + 1) >= 0) {
                    if (c.candidatesShown[numIndex] == numIndex + 1) {
                        c.candidatesShown[numIndex] = undefined;
                    }
                    else {
                        c.candidatesShown[numIndex] = numIndex + 1;
                    }
                    c.syncCandidates();
                }
                else {
                    var wc = Sudoku.checkConflict(this.waitingCellIndex, numIndex + 1);
                    if (wc != null)
                        this.flashing(wc);
                }
                this.mapCandidatesToPanel();
            } else {
                c.txt.string = numIndex + 1;
                c.candidates.active = false;
                c.txt.node.active = true;
                var ci = this.wrongCells.indexOf(this.waitingCellIndex);
                if (this.answer[this.waitingCellIndex] == numIndex + 1) {
                    if (ci >= 0) {
                        this.wrongCells.splice(ci, 1);
                    }
                    Sudoku.setBoardCell(this.waitingCellIndex, numIndex + 1);
                    this.updateCells();
                    Sudoku.updateCandidates();
                    this.updateCandidatesAsSet(this.waitingCellIndex, numIndex + 1);
                    this.onBoardTouch(e);
                }
                else {
                    var wn = Sudoku.checkConflict(this.waitingCellIndex, numIndex + 1);
                    if (wn != null)
                        this.flashing(wn);
                    if (ci < 0) {
                        c.txt.node.color = cc.Color.RED;
                        this.wrongCells.push(this.waitingCellIndex);
                    }
                }
            }
            this.updateSave(this.checkFinished());
        }
    },//
//////////////////////////////////////////////////////////////////////////////////////////////////
    onMenuButtonTouch: function (e) {
        this.menuWindow.active = true;
    },//

    onMenuWindowCloseTouch: function (e) {
        this.menuWindow.active = false;
    },//

    onMenuWindowNewTouch: function (e, d) {
        window.Global.currentLevel = d;
        window.Global.filledNumbers = [];
        window.Global.filledCandidates = [];
        window.Global.currentPuzzleId = -1;
        cc.director.loadScene("Level");
    },//
//////////////////////////////////////////////////////////////////////////////////////////////////
    flashing: function (i) {
        // var action = cc.tintTo(1, 255, 0, 0);
        var action = cc.blink(1, 2);
        this.cells[i].getComponent(Cell).txt.node.runAction(action);
    },//

    fixWrongCells: function () {
        for (var i = this.wrongCells.length - 1; i >= 0; i--) {
            var ci = this.wrongCells.pop();
            this.cells[ci].getComponent(Cell).txt.node.color = cc.Color.BLACK;
            this.cells[ci].getComponent(Cell).txt.string = "";
            this.cells[ci].getComponent(Cell).txt.node.active = false;
            this.cells[ci].getComponent(Cell).candidates.active = true;
        }
    },//

    removeWrongCell: function () {
        if (this.waitingCellIndex >= 0) {
            var ci = this.wrongCells.indexOf(this.waitingCellIndex);
            if (ci >= 0) {
                this.cells[this.waitingCellIndex].getComponent(Cell).txt.node.color = cc.Color.BLACK;
                this.cells[this.waitingCellIndex].getComponent(Cell).txt.string = "";
                this.wrongCells.splice(ci, 1);
            }
        }
    },//

    updateCandidatesAsSet: function (i, d) {
        var houses = Sudoku.getHouses(i);
        for (var j = 0; j < houses[0].length; j++) {
            this.cells[houses[0][j]].getComponent(Cell).candidatesShown[d - 1] = undefined;
            if (this.needUpdate.indexOf(houses[0][j]) < 0)
                this.needUpdate.push(houses[0][j]);
        }
        for (var k = 0; k < houses[1].length; k++) {
            this.cells[houses[1][k]].getComponent(Cell).candidatesShown[d - 1] = undefined;
            if (this.needUpdate.indexOf(houses[1][k]) < 0)
                this.needUpdate.push(houses[1][k]);
        }
        for (var l = 0; l < houses[2].length; l++) {
            this.cells[houses[2][l]].getComponent(Cell).candidatesShown[d - 1] = undefined;
            if (this.needUpdate.indexOf(houses[2][l]) < 0)
                this.needUpdate.push(houses[2][l]);
        }
        this.showCandidatesUpdateEffect();
    },//

    updateCandidatesAsReject: function (cs, d) {
        for (var i = 0; i < cs.length; i++) {
            this.cells[cs[i]].getComponent(Cell).candidatesShown[d - 1] = undefined;
            if (this.needUpdate.indexOf(cs[i]) < 0)
                this.needUpdate.push(cs[i]);
        }
        this.showCandidatesUpdateEffect();
    },//

    showCandidatesUpdateEffect: function () {
        for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i].getComponent(Cell);
            cell.syncCandidates();
            if (this.needUpdate.indexOf(i) >= 0)
                cell.showUpdateEffect();
        }
        this.needUpdate = [];
    },//

    mapCandidatesToPanel: function () {
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            for (var i = 0; i < c.candidatesLabels.length; i++) {
                if (c.candidatesLabels[i].string == this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).string) {
                    this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.YELLOW;
                }
                else {
                    this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
                }
            }
        }

    },//

    clearEditPanel: function () {
        for (var i = 0; i < this.panel.nums.length; i++) {
            this.panel.nums[i].node.getChildByName("txt").getComponent(cc.Label).node.color = cc.Color.WHITE;
        }
    },//

    showCandidates: function () {
        for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i].getComponent(Cell);
            var num = this.puzzle[i].val;
            var can = this.puzzle[i].candidates.slice(0);
            if (num == null || num == undefined || num == "") {
                cell.candidatesShown = can;
                cell.syncCandidates();
                cell.candidates.active = true;
            }
        }
    },//

    updateCells: function () {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var cell = this.cells[i * 9 + j].getComponent(Cell);
                var num = this.puzzle[i * 9 + j].val;
                if (num != null && num != "" && num != undefined) {
                    cell.txt.string = num;
                    cell.node.color = cc.color(230, 212, 167);
                    cell.txt.node.color = cc.Color.BLACK;
                    cell.getComponent(cc.Button).interactable = false;
                }
            }
        }
    },//

    clearWaitingCellHighlight: function () {
        if (this.waitingCellIndex >= 0) {
            var c = this.cells[this.waitingCellIndex].getComponent(Cell);
            if (this.answer[this.waitingCellIndex] != parseInt(c.txt.string)) {
                if (this.wrongCells.indexOf(this.waitingCellIndex) >= 0) {
                    c.txt.node.active = true;
                    c.candidates.active = false;
                }
                else {
                    c.txt.node.active = false;
                    c.candidates.active = true;
                }
                c.node.color = cc.Color.WHITE;
            }
            this.waitingCellIndex = -1;
        }
    },//

    allCandidatesShown: function () {
        for (var i = 0; i < this.cells.length; i++) {
            var num = this.puzzle[i].val;
            var can = this.puzzle[i].candidates.slice(0);
            var cell = this.cells[i].getComponent(Cell);
            if (num == null) {
                if (!cell.candidates.active)
                    return false;
                for (var j = 0; j < can.length; j++) {
                    if (can[j] != null && can[j].toString() != cell.candidatesLabels[j].string)
                        return false;
                }
            }
        }
        return true;
    },//

    checkFinished:function () {


        return false;
    },

    updateSave: function (finished) {
        if (finished) {
            window.Global.passedLevels[window.Global.currentLevel].push(window.Global.currentPuzzleId);
            window.Global.puzzles[window.Global.currentLevel].splice(window.Global.currentPuzzleId, 1);
            window.Global.filledNumbers = [];
            window.Global.filledCandidates = [];
            window.Global.currentPuzzleId = -1;
        }
        else {
            for (var i = 0; i < this.cells.length; i++) {
                var cell = this.cells[i].getComponent(Cell);
                window.Global.filledCandidates[i] = cell.candidatesShown;
                window.Global.filledNumbers[i] = this.puzzle[i].val;
            }
        }

        var savedGame = {
            currentPuzzleId: window.Global.currentPuzzleId,
            currentLevel: window.Global.currentLevel,
            passedLevels: window.Global.passedLevels,
            filledNumbers: window.Global.filledNumbers,
            filledCandidates: window.Global.filledCandidates,
            mute: window.Global.mute
        };
        cc.sys.localStorage.setItem("sudoku", JSON.stringify(savedGame));
        cc.log("saved");
    }//
//////////////////////////////////////////////////////////////////////////////////////////////

});

