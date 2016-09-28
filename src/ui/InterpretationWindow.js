import { SharingWindow } from './SharingWindow';

export var InterpretationWindow;

InterpretationWindow = function(c, sharing) {
    var appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,

        i18n = c.i18nManager.get(),
        path = appManager.getPath(),
        apiResource = instanceManager.apiResource;

    var resourceName = apiResource.substring(0, apiResource.length - 1);

    var textArea = Ext.create('Ext.form.field.TextArea', {
        cls: 'ns-textarea',
        height: 130,
        width: 407,
        fieldStyle: 'padding-left: 3px; padding-top: 3px',
        emptyText: i18n.write_your_interpretation + '..',
        enableKeyEvents: true,
        listeners: {
            keyup: function() {
                shareButton.xable();
            }
        }
    });

    //var getBody = function() {
        //var body = {
            //object: {
                //id: sharing.object.id,
                //name: sharing.object.name,
                //publicAccess: publicGroup.down('combobox').getValue(),
                //externalAccess: externalAccess ? externalAccess.getValue() : false
            //}
        //};

        //if (userGroupRowContainer.items.items.length > 1) {
            //body.object.userGroupAccesses = [];
            //for (var i = 1, item; i < userGroupRowContainer.items.items.length; i++) {
                //item = userGroupRowContainer.items.items[i];
                //body.object.userGroupAccesses.push(item.getAccess());
            //}
        //}

        //return body;
    //};

    var sharingCmp = new SharingWindow(c, sharing, true);

    var sharingCt = Ext.create('Ext.container.Container', {
        style: 'padding-top:10px',
        items: sharingCmp.items
    });

    var shareButton = Ext.create('Ext.button.Button', {
        text: i18n.share,
        disabled: true,
        xable: function() {
            this.setDisabled(!textArea.getValue());
        },
        handler: function() {
            if (textArea.getValue()) {
                Ext.Ajax.request({
                    url: encodeURI(path + '/api/interpretations/' + resourceName + '/' + instanceManager.getStateFavoriteId()),
                    method: 'POST',
                    params: textArea.getValue(),
                    headers: {'Content-Type': 'text/html'},
                    success: function() {
                        textArea.reset();
                        window.hide();
                    }
                });

                Ext.Ajax.request({
                    url: encodeURI(path + '/api/sharing?type=reportTable&id=' + sharing.object.id),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: Ext.encode(sharingCmp.getBody())
                });

                window.destroy();
            }
        }
    });

    var window = Ext.create('Ext.window.Window', {
        title: i18n.write_interpretation,
        layout: 'fit',
        bodyStyle: 'padding:4px; background-color:#fff',
        resizable: false,
        destroyOnBlur: true,
        modal: true,
        items: [
            textArea,
            sharingCt
        ],
        bbar: {
            cls: 'ns-toolbar-bbar',
            defaults: {
                height: 24
            },
            items: [
                '->',
                shareButton
            ]
        },
        listeners: {
            show: function(w) {
                uiManager.setAnchorPosition(w, 'favoriteButton');

                uiManager.enableRightClick();

                if (!w.hasDestroyOnBlurHandler) {
                    uiManager.addDestroyOnBlurHandler(w);
                }
            },
            hide: function() {
                uiManager.disableRightClick();
            }
        }
    });
    uiManager.reg(window, 'interpretationWindow');

    return window;
};
