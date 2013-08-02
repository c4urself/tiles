function Tiler () {}

Tiler.prototype = {

    current: null,  // current tile
    time: 400,      // animation time
    h: 85,          // height
    w: 150,         // width
    s: 4,           // spacing

    /**
     * Finds a cell using a position `n`
     *
     */
    findCell: function (n) {
        return $('.grid td[data-cell=' + n + ']', this.base);
    },

    /**
     * Moves a tile to a cell
     *
     */
    moveToCell: function (tile, position, large) {
        var that = this,
            cell = that.findCell(position);
            atTop = !large && position % 2 !== 0;

        tile.animate({
            top: cell.offset().top - cell.parent().offset().top + (atTop ? that.h + (that.s * 2) : that.s),
            left: cell.offset().left - cell.parent().offset().left,
            height: large ? (that.h * 2) + that.s : that.h,
            width: large ? (that.w * 2) + that.s * 2: that.w
        }, this.time);

        tile.data('cell', position);
        cell.data('tile', tile);
    },

    /**
     * Positions tiles initially
     *
     */
    reset: function (n) {
        var $tiles = $('div.tiles > div', this.base),
            old = this.time;

        this.time = 0;
        for (var i = 0, d = 1; i < $tiles.length; i++) {
            var $tile = $tiles.eq(i);

            if (i === n) {
                var x;
                if (i % 2 !== 0) {
                    this.moveToCell($tiles.eq(i - 1), i + 4);
                    x = i;
                } else {
                    x = i + d;
                }
                d += 3;
                this.moveToCell($tile, x, true);
                this.current = $tile;
            } else {
                this.moveToCell($tile, i + d);
            }
        }
        this.time = old;
    },

    /**
     * Initialises mouseover event
     *
     * Here we calculate 3 positions and get the respective tiles in each
     * to move them after calculating their new positions.
     *
     * - position of the mouseover tile                  x1
     * - position of the tile right above or below it    x2
     * - position of the tile to the right or left;
     *   this is usually the current large tile          x3
     *
     */
    handler: function () {
        var that = this,
            $tiles = $('div.tiles > div', this.base);

        $tiles.on('mouseover', function (e) {

            var $tile = $(e.currentTarget);

            if (that.current[0] !== $tile[0]) {

                var cx1 = $tile.data('cell'),
                    currentPos = that.current.data('cell'),
                    atTop = cx1 % 2 !== 0,
                    toLeft = currentPos > cx1,
                    nx1 = cx1,
                    cx2 = atTop ? cx1 + 1 : cx1 - 1,
                    nx2 = toLeft ? cx2 + 4 : cx2 - 4,
                    cx3 = toLeft ? cx2 + (atTop ? 1 : 2) : cx2 - (atTop ? 5 : 4),
                    $x2 = that.findCell(cx2).data('tile'),
                    $x3 = that.findCell(cx3).data('tile'),
                    nx3 = cx3;

                if (cx3 !== currentPos) {
                    return that.reset($tile.data('position'));
                }

                if (!atTop) {
                    nx3 += 1;
                    nx1 -= 1;
                }

                if (toLeft) {
                    nx3 += 2;
                } else {
                    nx1 -= 2;
                }

                that.moveToCell($tile, nx1, true);
                that.moveToCell($x3, nx3);
                that.moveToCell($x2, nx2);

                that.current = $tile;
            }
        });
    },

    init: function (base) {
        this.base = base;    // used for scoping jquery calls
        this.reset(1);       // position tiles, large tile in the middle
        this.handler();      // handle mouseover event
    }
};


$(document).ready(function () {
    $('.tiler').each(function () {
        console.log('Initializing new Tiler');
        var tiler = new Tiler();
        tiler.init(this);
    });
});

