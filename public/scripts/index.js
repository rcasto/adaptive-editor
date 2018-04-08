import defaultAdaptiveCardJson from './defaultAdaptiveCard';
import defaultAdaptiveCardHostConfig from './defaultAdaptiveCardHostConfig';
import editorConfig from './editorConfig';
import utilities from './utilities';
import { AdaptiveCard, HostConfig } from 'adaptivecards';

var editor;
var adaptiveCard = new AdaptiveCard();
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

adaptiveCard.hostConfig = new HostConfig(defaultAdaptiveCardHostConfig);

function resizeEditor(editor) {
    let windowSize = utilities.getWindowSize();
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
        adaptiveCardJson = defaultAdaptiveCardJson;
    }
    var adaptiveElem = AdaptiveHtml.toHTML(adaptiveCardJson);
    return (adaptiveElem && adaptiveElem.outerHTML) || '';
}

function startEditor() {
    editor = CKEDITOR.replace('adaptive-ckeditor', editorConfig());

    editor.on('change', utilities.debounce(function (event) {
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
        var restoreAdaptiveSessionData = restoreSession();
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

window.addEventListener('resize', utilities.debounce(function () {
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