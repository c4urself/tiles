window.tiles = window.tiles || {

    init: function () {
        var $tiles = $('div.tiles > div'),
            $cells = $('table.grid'),
            $current;

        for (var i = 0, d = 1; i < $tiles.length; i++) {
            var $tile = $tiles.eq(i),
                $cell = $cells.find('td[data-cell=' + (i + d) + ']');

            $tile.data('cell', i + d);
            $cell.data('tile', $tile);

            $tile.offset({
                top: $cell.offset().top,
                left: $cell.offset().left
            });

            if (i === 2) {
                d += 3;
                $tile.height(200);
                $tile.width(300);
                $current = $tile;
            }
        }

        console.log($.data('current'));

        $tiles.on('mouseover', function (e) {
            var $tile = $(e.currentTarget);

            // TODO: current ! always = cx3
            // TODO: animation
            // TODO: split placing tile in cell'-functionality into separate method;

            if ($current !== $tile) {
                var cx1 = $tile.data('cell'),
                    cx3 = $current.data('cell'),
                    pos = cx1 % 2 === 0 ? 'bottom' : 'top',
                    dir = cx3 < cx1 ? 'right' : 'left',
                    nx1 = cx1,
                    cx2 = pos === 'bottom' ? cx1 - 1 : cx1 + 1,
                    nx2 = dir === 'right' ? cx2 - 4 : cx2 + 4,
                    $x2 = $cells.find('td[data-cell=' + cx2 + ']').data('tile'),
                    $x3 = $current,
                    nx3 = cx3;

                if (pos === 'bottom') {
                    nx3 += 1;
                    nx1 -= 1;
                }
                if (dir === 'left') {
                    nx3 += 2;
                } else {
                    nx1 -= 2;
                }

                console.log('Current tile pos: ', cx1);
                console.log('New tile pos: ', nx1);
                console.log('Position in row: ', pos);
                console.log('Expand direction: ', dir);
                console.log('Old x2 pos: ', cx2);
                console.log('New x2 pos: ', nx2);
                console.log('Old x3 pos: ', cx3);
                console.log('New x3 pos: ', nx3);

                $current.height(100).width(150);
                $tile.height(200).width(300);

                var $x1cell = $cells.find('td[data-cell=' + nx1 + ']');
                $tile.offset({
                    top: $x1cell.offset().top,
                    left: $x1cell.offset().left
                });
                $tile.data('cell', nx1);
                $x1cell.data('tile', $tile);

                var $x2cell = $cells.find('td[data-cell=' + nx2 + ']');
                $x2.offset({
                    top: $x2cell.offset().top,
                    left: $x2cell.offset().left
                });
                $x2.data('cell', nx2);
                $x2cell.data('tile', $x2);

                var $x3cell = $cells.find('td[data-cell=' + nx3 + ']');
                $x3.offset({
                    top: $cells.find('td[data-cell=' + nx3 + ']').offset().top,
                    left: $cells.find('td[data-cell=' + nx3 + ']').offset().left
                });
                $x3.data('cell', nx3);
                $x3cell.data('tile', $x3);

                $current = $tile;
            }
        });
    }
};

$(document).ready(function () {
    tiles.init();
});
