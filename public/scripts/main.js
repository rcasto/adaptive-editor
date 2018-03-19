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
var adaptiveCard = new AdaptiveCards.AdaptiveCard();
var debounceTimeInMs = 50;
var adaptiveSessionKey = 'adaptive-session';

// Content elements
var adaptivePreview;
var adaptivePreviewJson;

// View elements
var adaptiveEditorView;
var adaptivePreviewView;
var adaptivePreviewJsonView;
var adaptivePreviewCardView;

// Button elements
var adaptiveTogglePreviewView;
var adaptiveToggleJsonView;
var adaptiveToggleEditorView;
var adaptiveToggleCardView;

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

function saveSession() {
    var html = editor.getData();
    var adaptiveCardJson = AdaptiveHtml.toJSON(html);
    sessionStorage.setItem(adaptiveSessionKey, JSON.stringify(adaptiveCardJson));
}

function restoreSession() {
    var adaptiveCardJson = sessionStorage.getItem(adaptiveSessionKey);
    if (!adaptiveCardJson) {
        return null;
    }
    var adaptiveElem = AdaptiveHtml.toHTML(adaptiveCardJson);
    return (adaptiveElem && adaptiveElem.outerHTML) || '';
}

function startEditor() {
    editor = CKEDITOR.replace('adaptive-ckeditor', editorConfig);

    editor.on('change', debounce(function (event) {
        var html = event.editor.getData();
        var adaptiveJson = AdaptiveHtml.toJSON(html), adaptiveHtml;
        var prettyAdaptiveJsonString = JSON.stringify(adaptiveJson, null, '\t');
        adaptiveCard.parse(adaptiveJson);
        adaptiveHtml = adaptiveCard.render();
        adaptivePreview.textContent = '';
        if (adaptiveHtml) {
            adaptivePreview.appendChild(adaptiveHtml);
        }
        adaptivePreviewJson.textContent = prettyAdaptiveJsonString;
        console.log(prettyAdaptiveJsonString);
    }, debounceTimeInMs));

    editor.on('instanceReady', function (event) {
        var adaptiveEditorDefaultContent = document.querySelector('.adaptive-default-content').innerHTML
        var restoreAdaptiveSessionData = restoreSession();
        if (restoreAdaptiveSessionData == null) {
            restoreAdaptiveSessionData = adaptiveEditorDefaultContent;
        }
        event.editor.setData(restoreAdaptiveSessionData);
    });
}

function toggleEditorView() {
    adaptivePreviewView.style.display = 'none';
    adaptiveEditorView.style.display = 'block';
}

function togglePreview() {
    adaptivePreviewView.style.display = 'block';
    adaptiveEditorView.style.display = 'none';
}

function togglePreviewCardView() {
    adaptivePreviewJsonView.style.display = 'none';
    adaptivePreviewCardView.style.display = 'block';
}

function togglePreviewJsonView() {
    adaptivePreviewJsonView.style.display = 'block';
    adaptivePreviewCardView.style.display = 'none';
}

function copyJsonToClipboard() {
    adaptivePreviewJson.select();
    document.execCommand('copy');
}

window.addEventListener('resize', debounce(function () {
    resizeEditor(editor);
}, debounceTimeInMs));

document.addEventListener('DOMContentLoaded', function () {
    startEditor();

    // Content elements
    adaptivePreview = document.querySelector('.adaptive-preview');
    adaptivePreviewJson = document.querySelector('.adaptive-preview-json');

    // View elements
    adaptivePreviewView = document.querySelector('.adaptive-preview-view');
    adaptiveEditorView = document.querySelector('.adaptive-editor-view');
    adaptivePreviewJsonView = document.querySelector('.adaptive-preview-json-view');
    adaptivePreviewCardView = document.querySelector('.adaptive-preview-card-view');

    // Button elements
    adaptiveTogglePreviewView = document.querySelector('.adaptive-toggle-preview');
    adaptiveToggleEditorView = document.querySelectorAll('.adaptive-toggle-editor');
    adaptiveToggleJsonView = document.querySelector('.adaptive-toggle-json');
    adaptiveToggleCardView = document.querySelector('.adaptive-toggle-card');

    // Assign content handlers
    adaptivePreviewJson.addEventListener('click', copyJsonToClipboard);

    // Assign button handlers
    adaptiveTogglePreviewView.addEventListener('click', togglePreview);
    adaptiveToggleEditorView.forEach(function (editorViewToggle) {
        editorViewToggle.addEventListener('click', toggleEditorView);
    });
    adaptiveToggleJsonView.addEventListener('click', togglePreviewJsonView);
    adaptiveToggleCardView.addEventListener('click', togglePreviewCardView);

    window.addEventListener('beforeunload', function () {
        saveSession();
    });
});