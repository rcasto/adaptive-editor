import pell from 'pell';

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
    var editor = pell.init({
        element: elem,
        onChange: onChangeHandler,
        actions: [
            'bold',
            'italic',
            'heading1',
            'heading2',
            'paragraph',
            'olist',
            'ulist',
            'link',
            'image'
        ]
    });
    return editor;
}

export default {
    startEditor
};