import defaultAdaptiveCardJson from './defaultAdaptiveCard';
import defaultAdaptiveCardHostConfig from './defaultAdaptiveCardHostConfig';
import { AdaptiveCard, HostConfig } from 'adaptivecards';
import AdaptiveHtml from 'adaptive-html';
import Pell from './pell';

var adaptiveCard;
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

function saveSession(json) {
    sessionStorage.setItem(adaptiveSessionKey, JSON.stringify(json));
}

function restoreSession() {
    var adaptiveCardJson = sessionStorage.getItem(adaptiveSessionKey);
    if (!adaptiveCardJson) {
        adaptiveCardJson = defaultAdaptiveCardJson;
    }
    var adaptiveElem = AdaptiveHtml.toHTML(adaptiveCardJson);
    return (adaptiveElem && adaptiveElem.outerHTML) || '';
}

function toggleEditorView() {
    adaptivePreviewView.style.display = 'none';
    adaptiveEditorView.style.display = 'block';
    togglePreviewCardView();
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

function handleEditorChange(html) {
    var adaptiveCardJson = AdaptiveHtml.toJSON(html);

    adaptivePreview.textContent = '';
    adaptivePreviewJson.textContent = JSON.stringify(adaptiveCardJson, null, '\t');

    adaptiveCard.parse(adaptiveCardJson);
    adaptiveCard.render(adaptivePreview);

    saveSession(adaptiveCardJson);
}

document.addEventListener('DOMContentLoaded', function () {
    var editor = Pell.startEditor('#adaptive-pell-editor', handleEditorChange);

    adaptiveCard = new AdaptiveCard();
    adaptiveCard.hostConfig = new HostConfig(defaultAdaptiveCardHostConfig);

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

    editor.content.innerHTML = restoreSession();
    handleEditorChange(editor.content.innerHTML);
});