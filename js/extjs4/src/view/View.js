/**
 * @class Ext.view.View
 * @extends Ext.view.AbstractView
 *
 * A mechanism for displaying data using custom layout templates and formatting. DataView uses an {@link Ext.XTemplate}
 * as its internal templating mechanism, and is bound to an {@link Ext.data.Store}
 * so that as the data in the store changes the view is automatically updated to reflect the changes.  The view also
 * provides built-in behavior for many common events that can occur for its contained items including click, doubleclick,
 * mouseover, mouseout, etc. as well as a built-in selection model. <b>In order to use these features, an {@link #itemSelector}
 * config must be provided for the DataView to determine what nodes it will be working with.</b>
 *
 * <p>The example below binds a DataView to a {@link Ext.data.Store} and renders it into an {@link Ext.panel.Panel}.</p>
 * {@img Ext.DataView/Ext.DataView.png Ext.DataView component}
 * <pre><code>
    Ext.regModel('Image', {
        Fields: [
            {name:'src', type:'string'},
            {name:'caption', type:'string'}
        ]
    });
    
    Ext.create('Ext.data.Store', {
        id:'imagesStore',
        model: 'Image',
        data: [
            {src:'http://www.sencha.com/img/20110215-feat-drawing.png', caption:'Drawing & Charts'},
            {src:'http://www.sencha.com/img/20110215-feat-data.png', caption:'Advanced Data'},
            {src:'http://www.sencha.com/img/20110215-feat-html5.png', caption:'Overhauled Theme'},
            {src:'http://www.sencha.com/img/20110215-feat-perf.png', caption:'Performance Tuned'}            
        ]
    });
    
    var imageTpl = new Ext.XTemplate(
        '<tpl for=".">',
            '<div style="thumb-wrap">',
              '<img src="{src}" />',
              '<br/><span>{caption}</span>',
            '</div>',
        '</tpl>'
    );
    
    Ext.create('Ext.DataView', {
        store: Ext.data.StoreManager.lookup('imagesStore'),
        tpl: imageTpl,
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images available',
        renderTo: Ext.getBody()
    });
 * </code></pre>
 * @xtype dataview
 */
Ext.define('Ext.view.View', {
    extend: 'Ext.view.AbstractView',
    alternateClassName: 'Ext.view.View',
    alias: 'widget.dataview',
    
    inheritableStatics: {
        EventMap: {
            mousedown: 'MouseDown',
            mouseup: 'MouseUp',
            click: 'Click',
            dblclick: 'DblClick',
            contextmenu: 'ContextMenu',
            mouseover: 'MouseOver',
            mouseout: 'MouseOut',
            mouseenter: 'MouseEnter',
            mouseleave: 'MouseLeave',
            keydown: 'KeyDown'
        }
    },
    
    addCmpEvents: function() {
        this.addEvents(
            /**
             * @event beforeitemmousedown
             * Fires before the mousedown event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmousedown',
            /**
             * @event beforeitemmouseup
             * Fires before the mouseup event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseup',
            /**
             * @event beforeitemmouseenter
             * Fires before the mouseenter event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseenter',
            /**
             * @event beforeitemmouseleave
             * Fires before the mouseleave event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemmouseleave',
            /**
             * @event beforeitemclick
             * Fires before the click event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemclick',
            /**
             * @event beforeitemdblclick
             * Fires before the dblclick event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemdblclick',
            /**
             * @event beforeitemcontextmenu
             * Fires before the contextmenu event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'beforeitemcontextmenu',
            /**
             * @event beforeitemkeydown
             * Fires before the keydown event on an item is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object. Use {@link Ext.EventObject#getKey getKey()} to retrieve the key that was pressed.
             */
            'beforeitemkeydown',
            /**
             * @event itemmousedown
             * Fires when there is a mouse down on an item
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmousedown',
            /**
             * @event itemmouseup
             * Fires when there is a mouse up on an item
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseup',
            /**
             * @event itemmouseenter
             * Fires when the mouse enters an item.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseenter',
            /**
             * @event itemmouseleave
             * Fires when the mouse leaves an item.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemmouseleave',
            /**
             * @event itemclick
             * Fires when an item is clicked.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemclick',
            /**
             * @event itemdblclick
             * Fires when an item is double clicked.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemdblclick',
            /**
             * @event itemcontextmenu
             * Fires when an item is right clicked.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object
             */
            'itemcontextmenu',
            /**
             * @event itemkeydown
             * Fires when a key is pressed while an item is currently selected.
             * @param {Ext.view.View} this
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {HTMLElement} item The item's element
             * @param {Number} index The item's index
             * @param {Ext.EventObject} e The raw event object. Use {@link Ext.EventObject#getKey getKey()} to retrieve the key that was pressed.
             */
            'itemkeydown',
            /**
             * @event beforecontainermousedown
             * Fires before the mousedown event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermousedown',
            /**
             * @event beforecontainermouseup
             * Fires before the mouseup event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseup',
            /**
             * @event beforecontainermouseover
             * Fires before the mouseover event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseover',
            /**
             * @event beforecontainermouseout
             * Fires before the mouseout event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainermouseout',
            /**
             * @event beforecontainerclick
             * Fires before the click event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainerclick',
            /**
             * @event beforecontainerdblclick
             * Fires before the dblclick event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainerdblclick',
            /**
             * @event beforecontainercontextmenu
             * Fires before the contextmenu event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'beforecontainercontextmenu',
            /**
             * @event beforecontainerkeydown
             * Fires before the keydown event on the container is processed. Returns false to cancel the default action.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object. Use {@link Ext.EventObject#getKey getKey()} to retrieve the key that was pressed.
             */
            'beforecontainerkeydown',
            /**
             * @event containermouseup
             * Fires when there is a mouse up on the container
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseup',
            /**
             * @event containermouseover
             * Fires when you move the mouse over the container.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseover',
            /**
             * @event containermouseout
             * Fires when you move the mouse out of the container.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containermouseout',
            /**
             * @event containerclick
             * Fires when the container is clicked.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerclick',
            /**
             * @event containerdblclick
             * Fires when the container is double clicked.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containerdblclick',
            /**
             * @event containercontextmenu
             * Fires when the container is right clicked.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object
             */
            'containercontextmenu',
            /**
             * @event containerkeydown
             * Fires when a key is pressed while the container is focused, and no item is currently selected.
             * @param {Ext.view.View} this
             * @param {Ext.EventObject} e The raw event object. Use {@link Ext.EventObject#getKey getKey()} to retrieve the key that was pressed.
             */
            'containerkeydown',
            
            /**
             * @event selectionchange
             * Fires when the selected nodes change. Relayed event from the underlying selection model.
             * @param {Ext.view.View} this
             * @param {Array} selections Array of the selected nodes
             */
            'selectionchange',
            /**
             * @event beforeselect
             * Fires before a selection is made. If any handlers return false, the selection is cancelled.
             * @param {Ext.view.View} this
             * @param {HTMLElement} node The node to be selected
             * @param {Array} selections Array of currently selected nodes
             */
            'beforeselect'
        );
    },
    // private
    afterRender: function(){
        var me = this, 
            listeners;
        
        me.callParent();

        listeners = {
            scope: me,
            click: me.handleEvent,
            mousedown: me.handleEvent,
            mouseup: me.handleEvent,
            dblclick: me.handleEvent,
            contextmenu: me.handleEvent,
            mouseover: me.handleEvent,
            mouseout: me.handleEvent,
            keydown: me.handleEvent
        };
        
        me.mon(me.getTargetEl(), listeners);
        
        if (me.store) {
            me.bindStore(me.store, true);
        }
    },
    
    handleEvent: function(e) {
        if (this.processUIEvent(e) !== false) {
            this.processSpecialEvent(e);
        }
    },
    
    // Private template method
    processItemEvent: Ext.emptyFn,
    processContainerEvent: Ext.emptyFn,
    processSpecialEvent: Ext.emptyFn,
    
    processUIEvent: function(e, type) {
        type = type || e.type;
        var me = this,
            item = e.getTarget(me.getItemSelector(), me.getTargetEl()),
            map = this.statics().EventMap,
            index, record;
        
        if (!item) {
            // There is this weird bug when you hover over the border of a cell it is saying
            // the target is the table.
            // BrowserBug: IE6 & 7. If me.mouseOverItem has been removed and is no longer
            // in the DOM then accessing .offsetParent will throw an "Unspecified error." exception.
            // typeof'ng and checking to make sure the offsetParent is an object will NOT throw
            // this hard exception.
            if (type == 'mouseover' && me.mouseOverItem && typeof me.mouseOverItem.offsetParent === "object" && Ext.fly(me.mouseOverItem).getRegion().contains(e.getPoint())) {
                item = me.mouseOverItem;
            }
            
            // Try to get the selected item to handle the keydown event, otherwise we'll just fire a container keydown event
            if (type == 'keydown') {
                record = me.getSelectionModel().getLastSelected();
                if (record) {
                    item = me.getNode(record);
                }
            }
        }
        
        if (item) {
            index = me.indexOf(item);
            if (!record) {
                record = me.getRecord(item);
            }
            
            if (me.processItemEvent(type, record, item, index, e) === false) {
                return false;
            }
            
            type = me.isNewItemEvent(type, item, e);
            if (type === false) {
                return false;
            }
            
            if (
                (me['onBeforeItem' + map[type]](record, item, index, e) === false) ||
                (me.fireEvent('beforeitem' + type, me, record, item, index, e) === false) ||
                (me['onItem' + map[type]](record, item, index, e) === false)
            ) { 
                return false;
            }
            
            me.fireEvent('item' + type, me, record, item, index, e);
        } 
        else {
            if (
                (me.processContainerEvent(type, e) === false) ||
                (me['onBeforeContainer' + map[type]](e) === false) ||
                (me.fireEvent('beforecontainer' + type, me, e) === false) ||
                (me['onContainer' + map[type]](e) === false)
            ) {
                return false;
            }
            
            me.fireEvent('container' + type, me, e);
        }
        
        return true;
    },
    
    isNewItemEvent: function(type, item, e) {
        var me = this,
            overItem = me.mouseOverItem,
            contains,
            isItem;
            
        switch (type) {
            case 'mouseover':
                if (item === overItem) {
                    return false;
                }
                me.mouseOverItem = item;
                return 'mouseenter';
            break;
            
            case 'mouseout':
               /*
                * Need an extra check here to see if it's the parent element. See the
                * comment re: the browser bug at the start of processUIEvent
                */
                if (overItem && typeof overItem.offsetParent === "object") {
                    contains = Ext.fly(me.mouseOverItem).getRegion().contains(e.getPoint());
                    isItem = Ext.fly(e.getTarget()).hasCls(me.itemSelector);
                    if (contains && isItem) {
                        return false;
                    }
                }
                me.mouseOverItem = null;
                return 'mouseleave';
            break;
        }
        return type;
    },
    
    // private
    onItemMouseEnter: function(record, item, index, e) {
        if (this.trackOver) {
            this.highlightItem(item);
        }
    },

    // private
    onItemMouseLeave : function(record, item, index, e) {
        if (this.trackOver) {
            this.clearHighlight();
        }
    },

    // @private, template methods
    onItemMouseDown: Ext.emptyFn,
    onItemMouseUp: Ext.emptyFn,
    onItemClick: Ext.emptyFn,
    onItemDblClick: Ext.emptyFn,
    onItemContextMenu: Ext.emptyFn,
    onItemKeyDown: Ext.emptyFn,
    onBeforeItemMouseDown: Ext.emptyFn,
    onBeforeItemMouseUp: Ext.emptyFn,
    onBeforeItemMouseEnter: Ext.emptyFn,
    onBeforeItemMouseLeave: Ext.emptyFn,
    onBeforeItemClick: Ext.emptyFn,
    onBeforeItemDblClick: Ext.emptyFn,
    onBeforeItemContextMenu: Ext.emptyFn,
    onBeforeItemKeyDown: Ext.emptyFn,
    
    // @private, template methods
    onContainerMouseDown: Ext.emptyFn,
    onContainerMouseUp: Ext.emptyFn,
    onContainerMouseOver: Ext.emptyFn,
    onContainerMouseOut: Ext.emptyFn,
    onContainerClick: Ext.emptyFn,
    onContainerDblClick: Ext.emptyFn,
    onContainerContextMenu: Ext.emptyFn,
    onContainerKeyDown: Ext.emptyFn,
    onBeforeContainerMouseDown: Ext.emptyFn,
    onBeforeContainerMouseUp: Ext.emptyFn,
    onBeforeContainerMouseOver: Ext.emptyFn,
    onBeforeContainerMouseOut: Ext.emptyFn,
    onBeforeContainerClick: Ext.emptyFn,
    onBeforeContainerDblClick: Ext.emptyFn,
    onBeforeContainerContextMenu: Ext.emptyFn,
    onBeforeContainerKeyDown: Ext.emptyFn,
    
    /**
     * Highlight a given item in the DataView. This is called by the mouseover handler if {@link #overItemCls}
     * and {@link #trackOver} are configured, but can also be called manually by other code, for instance to
     * handle stepping through the list via keyboard navigation.
     * @param {HTMLElement} item The item to highlight
     */
    highlightItem: function(item) {
        var me = this;
        me.clearHighlight();
        me.highlightedItem = item;
        Ext.fly(item).addCls(me.overItemCls);
    },

    /**
     * Un-highlight the currently highlighted item, if any.
     */
    clearHighlight: function() {
        var me = this,
            highlighted = me.highlightedItem;
            
        if (highlighted) {
            Ext.fly(highlighted).removeCls(me.overItemCls);
            delete me.highlightedItem;
        }
    },

    refresh: function() {
        this.clearHighlight();
        this.callParent(arguments);
    }
});