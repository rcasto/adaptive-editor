var windowSize = getWindowSize();
var editor;
var editorConfig = {
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
    removePlugins: 'elementspath'
};
var adaptivePreview;
var adaptivePreviewJSON;
var adaptivePreviewView;
var adaptivePreviewCardView;
var adaptiveTogglePreview;
var adaptiveToggleJSON;
var adaptiveCard = new AdaptiveCards.AdaptiveCard();
var debounceTimeInMs = 50;

adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
    fontFamily: 'Segoe UI, Segoe UI Web, Segoe UI Symbol, Helvetica Neue, BBAlpha Sans, S60 Sans, Arial, sans-serif',
    fontSizes: {
        default: 15
    },
    spacing: {
        padding: 12
    },
    containerStyles: {
        default: {
            backgroundColor: '#ffffff'
        }
    }
});

function debounce(func, debounceTimeInMs) {
    var debounceId = null;
    return function () {
        var that = this;
        var args = arguments;
        if (debounceId) {
            clearTimeout(debounceId);
        }
        debounceId = setTimeout(function () {
            func.apply(that, args);
            debounceId = null;
        }, debounceTimeInMs);
    };
}

function getWindowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

function resizeEditor(editor) {
    windowSize = getWindowSize();
    editor.resize(windowSize.width, windowSize.height);
}

function startEditor() {
    editor = CKEDITOR.replace('adaptive-ckeditor', editorConfig);

    editor.on('change', debounce(function (event) {
        var html = event.editor.getData();
        var adaptiveJson = AdaptiveHtml.transform(html), adaptiveHtml;
        var prettyAdaptiveJsonString = JSON.stringify(adaptiveJson, null, '\t');
        adaptiveCard.parse(adaptiveJson);
        adaptiveHtml = adaptiveCard.render();
        adaptivePreview.textContent = '';
        if (adaptiveHtml) {
            adaptivePreview.appendChild(adaptiveHtml);
        }
        adaptivePreviewJSON.textContent = prettyAdaptiveJsonString;
        console.log(prettyAdaptiveJsonString);
    }, debounceTimeInMs));

    editor.on('instanceReady', function (event) {
        var adaptiveEditorDefaultContent = document.querySelector('.adaptive-default-content').innerHTML;
        event.editor.setData(adaptiveEditorDefaultContent);
    });
}

function togglePreviewCard() {
    var previewDisplay = window.getComputedStyle(adaptivePreviewCardView).display;
    if (previewDisplay === 'none') {
        adaptivePreviewCardView.style.display = 'block';
        editor.container.setStyle('display', 'none');
    } else {
        adaptivePreviewCardView.style.display = 'none';
        editor.container.setStyle('display', '');
    }
}

function togglePreviewJSON() {
    var previewJsonDisplay = window.getComputedStyle(adaptivePreviewJSON).display;
    if (previewJsonDisplay === 'none') {
        adaptivePreviewJSON.style.display = 'block';
        adaptivePreview.style.display = 'none';
    } else {
        adaptivePreviewJSON.style.display = 'none';
        adaptivePreview.style.display = 'block';
    }
}

window.addEventListener('resize', debounce(function () {
    resizeEditor(editor);
}, debounceTimeInMs));

document.addEventListener('DOMContentLoaded', function () {
    startEditor();

    adaptivePreview = document.querySelector('.adaptive-preview');
    adaptiveTogglePreview = document.querySelector('.adaptive-toggle-preview');
    adaptivePreviewJSON = document.querySelector('.adaptive-preview-json');
    adaptivePreviewCardView = document.querySelector('.adaptive-preview-card-view');
    adaptiveToggleJSON = document.querySelector('.adaptive-toggle-json');

    adaptiveTogglePreview.addEventListener('click', togglePreviewCard);
    adaptiveToggleJSON.addEventListener('click', togglePreviewJSON);
    adaptiveToggleJSON.addEventListener('keyup', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            if (event.target.getAttribute('checked') === 'true') {
                event.target.setAttribute('checked', 'false');
            } else {
                event.target.setAttribute('checked', 'true');
            }
            togglePreviewJSON();
        }
    });
});