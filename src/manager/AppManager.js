import {isString, arrayFrom, arrayClean, arraySort} from 'd2-utilizr';

export var AppManager;

AppManager = function() {
    var t = this;

    // constants
    t.defaultUiLocale = 'en';
    t.defaultDisplayProperty = 'displayName';
    t.rootNodeId = 'root';

    t.valueTypes = {
        'numeric': ['NUMBER','UNIT_INTERVAL','PERCENTAGE','INTEGER','INTEGER_POSITIVE','INTEGER_NEGATIVE','INTEGER_ZERO_OR_POSITIVE'],
        'text': ['TEXT','LONG_TEXT','LETTER','PHONE_NUMBER','EMAIL'],
        'boolean': ['BOOLEAN','TRUE_ONLY'],
        'date': ['DATE','DATETIME'],
        'aggregate': ['NUMBER','UNIT_INTERVAL','PERCENTAGE','INTEGER','INTEGER_POSITIVE','INTEGER_NEGATIVE','INTEGER_ZERO_OR_POSITIVE','BOOLEAN','TRUE_ONLY']
    };

    t.defaultAnalysisFields = [
        '*',
        'program[id,displayName|rename(name)]',
        'programStage[id,displayName|rename(name)]',
        'columns[dimension,filter,items[id,$]]',
        'rows[dimension,filter,items[id,$]]',
        'filters[dimension,filter,items[id,$]]',
        '!lastUpdated',
        '!href',
        '!created',
        '!publicAccess',
        '!rewindRelativePeriods',
        '!userOrganisationUnit',
        '!userOrganisationUnitChildren',
        '!userOrganisationUnitGrandChildren',
        '!externalAccess',
        '!access',
        '!relativePeriods',
        '!columnDimensions',
        '!rowDimensions',
        '!filterDimensions',
        '!user',
        '!organisationUnitGroups',
        '!itemOrganisationUnitGroups',
        '!userGroupAccesses',
        '!indicators',
        '!dataElements',
        '!dataElementOperands',
        '!dataElementGroups',
        '!dataSets',
        '!periods',
        '!organisationUnitLevels',
        '!organisationUnits'
    ];

    // uninitialized
    t.manifest;
    t.systemInfo;
    t.systemSettings;
    t.userAccount;
    t.calendar;
    t.periodGenerator;
    t.viewUnapprovedData;

    t.rootNodes = [];
    t.organisationUnitLevels = [];
    t.dimensions = [];
    t.legendSets = [];
    t.dataApprovalLevels = [];

    // transient
    t.path;
    t.dateFormat;
    t.relativePeriod;
    t.uiLocale;
    t.displayProperty;
    t.analysisFields;
};

AppManager.prototype.getPath = function() {
    return this.path ? this.path : (this.path = this.manifest.activities.dhis.href);
};

AppManager.prototype.getDateFormat = function() {
    return this.dateFormat ? this.dateFormat : (this.dateFormat = isString(this.systemSettings.keyDateFormat) ? this.systemSettings.keyDateFormat.toLowerCase() : 'yyyy-mm-dd');
};

AppManager.prototype.getRelativePeriod = function() {
    return this.relativePeriod ? this.relativePeriod : (this.relativePeriod = this.systemSettings.keyAnalysisRelativePeriod || 'LAST_12_MONTHS');
};

AppManager.prototype.getUiLocale = function() {
    return this.uiLocale ? this.uiLocale : (this.uiLocale = this.userAccount.settings.keyUiLocale || this.defaultUiLocale);
};

AppManager.prototype.getDisplayProperty = function() {
    if (this.displayProperty) {
        return this.displayProperty;
    }
    
    var key = this.defaultDisplayProperty;
    return this.displayProperty = (key === 'name') ? key : (key + '|rename(name)');
};

AppManager.prototype.getValueTypesByType = function(type) {
    return this.valueTypes[type];
};

AppManager.prototype.getRootNodes = function() {
    return this.rootNodes;
};

AppManager.prototype.addRootNodes = function(param) {
    var t = this,
        nodes = arrayFrom(param);

    nodes.forEach(function(node) {
        node.expanded = true;
        node.path = '/' + t.rootId + '/' + node.id;
    });

    t.rootNodes = arrayClean(t.rootNodes.concat(nodes));
};

AppManager.prototype.addOrganisationUnitLevels = function(param) {
    this.organisationUnitLevels = arrayClean(this.organisationUnitLevels.concat(arrayFrom(param)));

    arraySort(this.organisationUnitLevels, 'ASC', 'level');
};

AppManager.prototype.addLegendSets = function(param) {
    this.legendSets = arrayClean(this.legendSets.concat(arrayFrom(param)));

    arraySort(this.legendSets, 'ASC', 'name');
};

AppManager.prototype.addDimensions = function(param) {
    this.dimensions = arrayClean(this.dimensions.concat(arrayFrom(param)));

    arraySort(this.dimensions, 'ASC', 'name');
};

AppManager.prototype.addDataApprovalLevels = function(param) {
    this.dataApprovalLevels = arrayClean(this.dataApprovalLevels.concat(arrayFrom(param)));

    arraySort(this.dataApprovalLevels, 'ASC', 'level');
};

AppManager.prototype.setAuth = function(env) {
    if (!(env === 'production' && !(this.manifest && isString(this.manifest.activities.dhis.auth)))) {
        $.ajaxSetup({
            headers: {
                Authorization: 'Basic ' + btoa(this.manifest.activities.dhis.auth)
            }
        });
    }
};

// dep 1

AppManager.prototype.isUiLocaleDefault = function() {
    return this.getUiLocale() === this.defaultUiLocale;
};

AppManager.prototype.getAnalysisFields = function() {
    return this.analysisFields ? this.analysisFields : (this.analysisFields = (this.defaultAnalysisFields.join(',').replaceAll('$', this.getDisplayProperty())));
};

AppManager.prototype.getRootNode = function() {
    return this.getRootNodes()[0];
};
