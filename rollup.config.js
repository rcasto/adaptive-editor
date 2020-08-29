import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**' // only transpile our source code
    })
];

if (buildMinifiedLibrary) {
    plugins.unshift(terser());
}

function shouldMinify(args) {
    return (args || []).indexOf('--minify') > -1;
}

export default {
    input: 'public/scripts/index.js',
    output: {
        format: 'iife',
        file: 'dist/public/index.js',
        name: 'AdativeEditor',
        globals: {
            adaptivecards: 'window.AdaptiveCards',
            'adaptive-html': 'window.AdaptiveHtml',
            pell: 'window.pell'
        }
    },
    plugins: plugins,
    external: ['adaptivecards', 'adaptive-html', 'pell']
};