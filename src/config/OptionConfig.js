import {arraySort} from 'd2-utilizr';

export var OptionConfig;

OptionConfig = function() {
    var t = this;

    // service
    var i18nManager;

    // uninitialized
    var displayDensity;
    var fontSize;
    var digitGroupSeparator;
    var aggregationType;

    // setter
    var setDisplayDensity = function() {
        displayDensity = {
            'comfortable': {
                index: 1,
                id: 'COMFORTABLE',
                name: i18nManager.get('comfortable') || 'Comfortable'
            },
            'normal': {
                index: 2,
                id: 'NORMAL',
                name: i18nManager.get('normal') || 'Normal'
            },
            'compact': {
                index: 3,
                id: 'COMPACT',
                name: i18nManager.get('compact') || 'Compact'
            }
        };
    };
    
    var setFontSize = function() {
        fontSize = {
            'large': {
                index: 1,
                id: 'LARGE',
                name: i18nManager.get('large') || 'Large'
            },
            'normal': {
                index: 2,
                id: 'NORMAL',
                name: i18nManager.get('normal') || 'Normal'
            },
            'small': {
                index: 3,
                id: 'SMALL',
                name: i18nManager.get('small') || 'Small'
            }
        };
    };
    
    var setDigitGroupSeparator = function() {
        digitGroupSeparator = {
            'none': {
                index: 1,
                id: 'NONE',
                name: i18nManager.get('none') || 'None',
                value: ''
            },
            'space': {
                index: 2,
                id: 'SPACE',
                name: i18nManager.get('space') || 'Space',
                value: '&nbsp;'
            },
            'comma': {
                index: 3,
                id: 'COMMA',
                name: i18nManager.get('comma') || 'Comma',
                value: ','
            }
        };
    };
    
    var setAggregationType = function() {
        aggregationType = {
            'def': {
                index: 1,
                id: 'DEFAULT',
                name: i18nManager.get('by_data_element') || 'By data element'
            },
            'count': {
                index: 2,
                id: 'COUNT',
                name: i18nManager.get('count') || 'Count'
            },
            'sum': {
                index: 3,
                id: 'SUM',
                name: i18nManager.get('sum') || 'Sum'
            },
            'stddev': {
                index: 4,
                id: 'STDDEV',
                name: i18nManager.get('stddev') || 'Standard deviation'
            },
            'variance': {
                index: 5,
                id: 'VARIANCE',
                name: i18nManager.get('variance') || 'Variance'
            },
            'min': {
                index: 6,
                id: 'MIN',
                name: i18nManager.get('min') || 'Min'
            },
            'max': {
                index: 7,
                id: 'MAX',
                name: i18nManager.get('max') || 'Max'
            }
        };
    };

    // logic
    var getRecords = function(optionType) {
        var records = [];

        for (var option in optionType) {
            if (optionType.hasOwnProperty(option)) {
                records.push(optionType[option]);
            }
        }

        arraySort(records, 'ASC', 'index');

        return records;
    };

    // init
    var initialize = function() {
        setDisplayDensity();
        setFontSize();
        setDigitGroupSeparator();
        setAggregationType();
    };

    // prototype
    t.getDisplayDensity = function(key) {
        return key ? displayDensity[key] : displayDensity;
    };

    t.getFontSize = function(key) {
        return key ? fontSize[key] : fontSize;
    };

    t.getDigitGroupSeparator = function(key) {
        return key ? digitGroupSeparator[key] : digitGroupSeparator;
    };

    t.getAggregationType = function(key) {
        return key ? aggregationType[key] : aggregationType;
    };

    t.getDisplayDensityRecords = function() {
        return getRecords(displayDensity);
    };

    t.getFontSizeRecords = function() {
        return getRecords(fontSize);
    };

    t.getDigitGroupSeparatorRecords = function() {
        return getRecords(digitGroupSeparator);
    };

    t.getAggregationTypeRecords = function() {
        return getRecords(aggregationType);
    };

    t.getDigitGroupSeparatorIdMap = function() {
        var map = {};

        for (var separator in digitGroupSeparator) {
            if (digitGroupSeparator.hasOwnProperty(separator)) {
                map[digitGroupSeparator[separator].id] = digitGroupSeparator[separator];
            }
        }

        return map;
    };

    t.setI18nManager = function(manager) {
        i18nManager = manager;
        initialize();
    };

    // dep 1

    t.getDigitGroupSeparatorValueById = function(id) {
        var separator = t.getDigitGroupSeparatorIdMap()[id];
        return separator ? separator.value : '';
    };
};
