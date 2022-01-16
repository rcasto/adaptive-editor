import defaultAdaptiveView from './defaultView.html';
import defaultAdaptiveCardHostConfig from './defaultAdaptiveCardHostConfig';
import { AdaptiveCard, HostConfig } from 'adaptivecards';
import AdaptiveHtml from 'adaptive-html';
import SimpleTrack from 'simple-track';
import CKEditor from './ckeditor';

const appName = 'adaptive-editor';
const analyticsApiUrl = 'https://analytics-service-299521.ue.r.appspot.com/analytics';
const eventTypes = {
    pageView: 'page-view',
};

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

function saveSession(html) {
    sessionStorage.setItem(adaptiveSessionKey, html);
}

function restoreSession() {
    var adaptiveView = sessionStorage.getItem(adaptiveSessionKey);
    if (!adaptiveView) {
        adaptiveView = defaultAdaptiveView;
    }
    return adaptiveView;
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

function handleEditorChange(html) {
    var adaptiveCardJson = AdaptiveHtml.toJSON(html);

    adaptivePreview.textContent = '';
    adaptivePreviewJson.textContent = JSON.stringify(adaptiveCardJson, null, '\t');

    adaptiveCard.parse(adaptiveCardJson);
    adaptiveCard.render(adaptivePreview);

    togglePreviewCardView();
    saveSession(html);
}

document.addEventListener('DOMContentLoaded', function () {
    const eventGenerator = SimpleTrack.createEventGenerator({
        appName,
        analyticsApiUrl,
    });
    const editor = CKEditor.startEditor('#adaptive-ckeditor', handleEditorChange);

    eventGenerator.track(eventTypes.pageView, {
        url: window.location.href,
    });

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

    editor.setData(restoreSession());
    handleEditorChange(editor.getData());
});