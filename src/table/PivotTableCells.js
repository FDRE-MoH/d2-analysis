import { getDefaultNumberDisplayValue } from './PivotTableUtils';
import uuid from 'd2-utilizr/lib/uuid';

import { VALUE_CELL,
         SUB_TOTAL_CELL,
         TOTAL_CELL,
         DIMENSION_CELL,
         DIMENSION_SUB_TOTAL_CELL,
         DIMENSION_TOTAL_CELL,
         EMPTY_CELL,
         LABELED_CELL,
         PADDING_CELL,
         FILTER_CELL,
         NA_AGGREGATION_TOTAL} from '../table/PivotTableConstants';

const cellClsMap = {
    [TOTAL_CELL]: {
        totalAggregationType: {
            [NA_AGGREGATION_TOTAL]: 'aggtype-na',
        },
    },
};

const cellTitleMap = {
    [TOTAL_CELL]: {
        totalAggregationType: {
            [NA_AGGREGATION_TOTAL]: 'Irrelevant total - sum across aggregation types',
        },
    },
};

const cellDisplayValueMap = {
    [TOTAL_CELL]: {
        totalAggregationType: {
            [NA_AGGREGATION_TOTAL]: '-',
        }
    }
}

const getFromCellMap = function(map, type, prop, value) {
    return (type in map) &&
        (prop in map[type]) &&
        (value in map[type][prop]) &&
        map[type][prop][value];
};

export class TableCell {

    collapsed = false;
    hidden = false;
    empty = false;
    colSpan = 1;
    rowSpan = 1;
    width = 120;
    height = 25;
    style = '';

    constructor(config={}) {
        Object.assign(this, config);
    }
}

export class NumberCell extends TableCell {
    constructor(value, displayValue, config) {
        super(config);

        this.value = value;
        this.displayValue = displayValue;
        // this.displayValue = getDefaultNumberDisplayValue(displayValue, config.skipRounding);

        this.title = this.displayValue;
    }
}

export class TextCell extends TableCell {
    constructor(displayValue, config) {
        super(config);

        this.displayValue = typeof displayValue !== 'string' && typeof displayValue !== 'number' ?
            '&nbsp;' : displayValue;
        this.title = this.displayValue;
    }
}

export class ValueCell extends NumberCell {

    type = VALUE_CELL;
    cls = 'pivot-value';

    constructor(value, displayValue, config) {
        super(value, displayValue, config);
        this.isValue = true;
        this.uuid = uuid();
    }
}

export class TextValueCell extends ValueCell {

    constructor(value, displayValue, config) {
        super(value, displayValue, config);

        this.displayValue = displayValue;

        this.cls += ' align-left cursor-default';
    }
}

export class PlainValueCell extends NumberCell {

    type = VALUE_CELL;
    cls = 'pivot-value';

    constructor(value, displayValue, config) {
        super(value, displayValue, config);
    }
}

export class SubTotalCell extends NumberCell {

    type = SUB_TOTAL_CELL;
    cls = 'pivot-value-subtotal';

    constructor(value, displayValue, config) {
        super(value, displayValue, config);
    }
};

export class TotalCell extends NumberCell {

    type = TOTAL_CELL;
    cls = 'pivot-value-total-subgrandtotal';

    constructor(value, displayValue, config) {
        super(value, displayValue, config);

        const aggTypeCls = getFromCellMap(cellClsMap, this.type, 'totalAggregationType', config.totalAggregationType);
        aggTypeCls && (this.cls += (' ' + aggTypeCls));

        const aggTypeTitle = getFromCellMap(cellTitleMap, this.type, 'totalAggregationType', config.totalAggregationType);
        aggTypeTitle && (this.title += (' (' + aggTypeTitle + ')'));

        const aggTypeDisplayValue = getFromCellMap(cellDisplayValueMap, this.type, 'totalAggregationType', config.totalAggregationType);
        aggTypeDisplayValue && (this.displayValue = aggTypeDisplayValue);
    }
};

export class RowAxisCell extends TextCell {

    type = DIMENSION_CELL;
    cls = 'pivot-dim pivot-row-dim td-nobreak';
    axis = 'row'

    constructor(displayValue, config) {
        super(displayValue, config);

        if (this.showHierarchy) {
            this.csl += ' align-left';
        }
    }
}

export class ColumnAxisCell extends TextCell {

    type = DIMENSION_CELL;
    cls = 'pivot-dim pivot-col-dim';
    axis = 'column'

    constructor(displayValue, config) {
        super(displayValue, config);

        if (this.sort) {
            this.cls += ' td-sortable';
        }
    }
}

export class DimensionSubTotalCell extends TextCell {

    type = DIMENSION_SUB_TOTAL_CELL;
    cls = 'pivot-dim-subtotal';

    constructor(displayValue, config) {
        super(displayValue, config);
    }
}

export class DimensionGrandTotalCell extends TextCell {

    type = DIMENSION_TOTAL_CELL;
    cls = 'pivot-dim-total';

    constructor(value, displayValue, config) {
        super(value, displayValue, config);

        if (this.sort) {
            this.cls += ' td-sortable';
        }

        if (this.generateUuid) {
            this.uuid = uuid();
        }
    }
}

export class DimensionEmptyCell extends TextCell {

    type = EMPTY_CELL;
    cls = 'pivot-empty';

    constructor(config) {
        super('&nbsp;', config);
    }
}

export class DimensionLabelCell extends TextCell {

    type = LABELED_CELL;
    cls = 'pivot-dim-label';
    axis = 'row';

    constructor(displayValue, config) {
        super(displayValue, config);
    }
}

export class PaddingCell extends TableCell {

    type = PADDING_CELL;
    displayValue = '&nbsp;';

    constructor(config) {
        super(config);
    }
}

export class BottomPaddingCell extends PaddingCell {

    cls = 'pivot-padding bottom-padding';

    constructor(heightInPixels, config) {
        super(config);

        this.hidden = heightInPixels <= 0;
        this.height = heightInPixels;
    }
}

export class TopPaddingCell extends PaddingCell {

    cls = 'pivot-padding top-padding';

    constructor(heightInPixels, config) {
        super(config);

        this.hidden = heightInPixels <= 0;
        this.height = heightInPixels;
    }
}

export class LeftPaddingCell extends PaddingCell {

    cls = 'pivot-padding left-padding';

    constructor(widthInPixels, config) {
        super(config);

        this.hidden = widthInPixels <= 0;
        this.width = widthInPixels;
    }
}

export class RightPaddingCell extends PaddingCell {

    cls = 'pivot-padding right-padding';

    constructor(widthInPixels, config) {
        super(config);

        this.hidden = widthInPixels <= 0;
        this.width = widthInPixels;
    }
}

export class FilterCell extends TableCell {

    type = FILTER_CELL;
    cls = 'pivot-filter cursor-default';

    constructor(displayValue, colSpan, config) {
        super(config);

        this.displayValue = displayValue;
        this.colSpan = colSpan;
    }
}