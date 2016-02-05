import {AboutWindow} from './AboutWindow';

export var NorthRegion;

NorthRegion = function(c, cmpConfig) {
    var appManager = c.appManager,
        uiManager = c.uiManager,
        i18nManager = c.i18nManager,

        i18n = i18nManager.get(),
        path = appManager.getPath();

    // component
    cmpConfig = cmpConfig || {};

    cmpConfig.i18n = cmpConfig.i18n || {};
    cmpConfig.i18n.about = cmpConfig.i18n.about || i18n.about || 'about';
    cmpConfig.i18n.home = cmpConfig.i18n.home || i18n.home || 'home';

    cmpConfig.theme = cmpConfig.theme || uiManager.getTheme();
    cmpConfig.brandName = cmpConfig.brandName || 'DHIS 2';
    cmpConfig.appName = cmpConfig.appName || '';
    cmpConfig.logoWidth = cmpConfig.logoWidth ? parseFloat(cmpConfig.logoWidth) : 418;
    cmpConfig.aboutFn = cmpConfig.aboutFn || function() {
        AboutWindow(c).show();
    };
    cmpConfig.homeFn = cmpConfig.homeFn || function() {
        window.location.href = path +  '/dhis-web-commons-about/redirect.action';
    };

    var cmp = {};

    var setLogoWidth = function(width, append) {
        width = width || cmpConfig.logoWidth;
        append = append || 0;

        cmp.logo.setWidth(width + append);
    };

    var setState = function(layout, isFavorite) {
        cmp.title.setState(layout, isFavorite);
    };

    return Ext.create('Ext.toolbar.Toolbar', {
        componentCls: 'toolbar-north',
        region: 'north',
        cls: cmpConfig.theme + ' ' + cmpConfig.cls,
        cmp: cmp,
        setLogoWidth: setLogoWidth,
        setState: setState,
        items: function() {
            cmp.logo = Ext.create('Ext.toolbar.TextItem', {
                cls: 'logo',
                width: cmpConfig.logoWidth,
                html: '<span class="brand">' + cmpConfig.brandName + '</span> ' + cmpConfig.appName
            });

            cmp.title = Ext.create('Ext.toolbar.TextItem', {
                cls: 'title user-select',
                html: '&nbsp;',
                titleValue: '',
                setTitle: function(name) {
                    this.titleValue = name;
                    this.update(this.titleValue);
                },
                setSaved: function() {
                    //this.update(this.titleValue);
                    this.getEl().removeCls('unsaved');
                },
                setUnsaved: function() {
                    //this.update('* ' + this.titleValue);
                    if (this.titleValue) {
						this.getEl().addCls('unsaved');
					}
                },
                setState: function(layout, isFavorite) {
                    if (layout) {
                        if (isFavorite && layout.name) {
                            this.setTitle(layout.name);
                            this.setSaved();
                        }
                        else {
                            this.setUnsaved();
                        }
                    }
                    else {
                        this.setTitle('');
                        this.setUnsaved();
                    }
                }
            });

            //cmp.tf = Ext.create('Ext.form.field.Text', {
				////width: 300,
				//disabled: true,
				//fieldStyle: 'border:0 none; background:none; font-size:13px',
				//value: 'Immunization: BMI population sample by gender and age group'
			//});

			//cmp.title = Ext.create('Ext.form.field.Text', {
				////width: uiManager.get('centerRegion').getWidth(),
				//width: 200,
				//fieldStyle: 'border:0 none; background:none; font-size:13px',
                //cls: 'title user-select',
                //titleValue: '',
                //setTitle: function(name) {
                    //this.titleValue = name;
                    //this.setValue(this.titleValue);
                //},
                //setSaved: function() {
                    ////this.getEl().removeCls('unsaved');
                    //Ext.get(this.getInputId()).removeCls('unsaved');
                    //this.enable();
                //},
                //setUnsaved: function() {
                    ////this.update('* ' + this.titleValue);
                    //if (this.titleValue) {
						//Ext.get(this.getInputId()).addCls('unsaved');
						//this.disable();
					//}
                //},
                //setState: function(isFavorite) {
                    //if (isFavorite) {
                        //this.setSaved();
                    //}
                    //else {
                        //this.setUnsaved();
                    //}
                //},
                //listeners: {
					//afterrender: function(cmp) {
						//cmp.setWidth(uiManager.get('northRegion').getWidth());
					//}
				//}
            //});

            cmp.about = Ext.create('Ext.toolbar.TextItem', {
                id: 'aboutButton',
                cls: 'about',
                html: cmpConfig.i18n.about,
                //rendered: true,
                listeners: {
                    render: function(ti) {
                        var el = ti.getEl();

                        el.on('mouseover', function() {
                            el.addCls('hover');
                        });

                        el.on('mouseout', function() {
                            el.removeCls('hover');
                        });

                        el.on('click', function() {
                            cmpConfig.aboutFn();
                        });

                        el.rendered = true;
                    }
                }
            });

            cmp.home = Ext.create('Ext.toolbar.TextItem', {
                id: 'homeButton',
                cls: 'about home',
                html: cmpConfig.i18n.home,
                //rendered: true,
                listeners: {
                    render: function(ti) {
                        var el = ti.getEl();

                        el.on('mouseover', function() {
                            el.addCls('hover');
                        });

                        el.on('mouseout', function() {
                            el.removeCls('hover');
                        });

                        el.on('click', function() {
                            cmpConfig.homeFn();
                        });

                        el.rendered = true;
                    }
                }
            });

            return [
                cmp.logo,
                cmp.title,
                //cmp.tf,
                '->',
                cmp.about,
                cmp.home,
                ' ', ' '
            ];
        }()
    });
};

