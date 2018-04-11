import defaultAdaptiveCardJson from './defaultAdaptiveCard';
import defaultAdaptiveCardHostConfig from './defaultAdaptiveCardHostConfig';
import utilities from './utilities';
import { AdaptiveCard, HostConfig } from 'adaptivecards';
import AdaptiveHtml from 'adaptive-html';
import Pell from './pell';

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

function saveSession(editor) {
    var html = editor.content.innerHTML;
    var adaptiveCardJson = AdaptiveHtml.toJSON(html);
    sessionStorage.setItem(adaptiveSessionKey, JSON.stringify(adaptiveCardJson));
}

function restoreSession(editor) {
    var adaptiveCardJson = sessionStorage.getItem(adaptiveSessionKey);
    if (!adaptiveCardJson) {
        adaptiveCardJson = defaultAdaptiveCardJson;
    }
    var adaptiveElem = AdaptiveHtml.toHTML(adaptiveCardJson);
    editor.content.innerHTML = (adaptiveElem && adaptiveElem.outerHTML) || '';
    handleEditorChange(editor, editor.content.innerHTML);
    return {
        editor,
        html: editor.content.innerHTML,
        json: adaptiveCardJson
    };
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

function handleEditorChange(editor, html) {
    console.log(html);
}

document.addEventListener('DOMContentLoaded', function () {
    var editor = Pell.startEditor('#adaptive-pell-editor', handleEditorChange);
    var adaptiveSession = restoreSession(editor);

    // Content elements
    adaptivePreview = document.querySelector('.adaptive-preview');
    adaptivePreviewJson = document.querySelector('.adaptive-preview-json');

    // View elements
    adaptiveEditorView = document.querySelector('.adaptive-editor-view');
    adaptivePreviewView = document.querySelector('.adaptive-preview-view');
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
    adaptiveToggleEditorView.forEach(editorViewToggle => editorViewToggle.addEventListener('click', toggleEditorView));
    adaptiveToggleJsonView.addEventListener('click', togglePreviewJsonView);
    adaptiveToggleCardView.addEventListener('click', togglePreviewCardView);

    window.addEventListener('beforeunload', () => saveSession(editor));
});