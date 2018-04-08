import utilities from './utilities';

export default function () {
    var windowSize = utilities.getWindowSize();
    return {
        width: windowSize.width,
        height: windowSize.height,
        toolbarGroups: [
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'align'] },
            { name: 'links' },
            { name: 'styles' },
            { name: 'insert' }
        ],
        customConfig: '',
        removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Table,HorizontalRule,Styles',
        removeDialogTabs: 'link:advanced',
        resize_enabled: false,
        removePlugins: 'elementspath',
        format_tags: 'p;h1;h2;h3;h4;h5;h6',
        extraAllowedContent: 'ol[start]'
    };
};