function defaultOnChangeHandler(html) {
    console.log(`Output html: ${html}`);
}

function startEditor(elemSelector, onChangeHandler) {
    if (typeof elemSelector !== 'string') {
        console.error(`Must pass valid css element selector as first parameter: ${elemSelector}`);
        return;
    }
    if (typeof onChangeHandler !== 'function') {
        console.warn(`Second parameter passed in was not a function, using default change handler: ${onChangeHandler}`);
        onChangeHandler = defaultOnChangeHandler;
    }
    let elem = document.querySelector(elemSelector);
    if (!elem) {
        console.error(`Could not find element matching css element selector: ${elemSelector}`);
        return;
    }
    var editor = CKEDITOR.replace(elem, {
        // https://ckeditor.com/cke4/presets
        removePlugins: [
            'horizontalrule',
            'htmlwriter',
            'a11yhelp',
            'blockquote',
            'contextmenu',
            'elementspath',
            'filebrowser',
            'resize',
            'maximize',
            'magicline',
            'pastetext',
            'pastefromgdocs',
            'pastefromword',
            'pastefromlibreoffice',
            'showborders',
            'sourcearea',
            'specialchar',
            'scayt',
            'stylescombo',
            'tab',
            'table',
            'tableselection',
            'tabletools',
            'uploadImage',
        ],
        // https://ckeditor.com/docs/ckeditor4/latest/examples/toolbar.html
        // Define the toolbar groups as it is a more accessible solution.
        toolbarGroups: [{
            "name": "basicstyles",
        },
        {
            "name": "links",
        },
        {
            "name": "paragraph",
            "groups": ["list"]
        },
        {
            "name": "insert",
        },
        {
            "name": "styles"
        },
        {
            "name": "about",
        }],
        // Remove the redundant buttons from toolbar groups defined above.
        removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor',
        format_tags: 'p;h1;h2;h3;h4;h5;h6'
    });
    editor.on('change', function (evt) {
        onChangeHandler(evt.editor.getData());
    });
    return editor;
}

export default {
    startEditor
};