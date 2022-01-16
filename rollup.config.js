import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**' // only transpile our source code
    }),
    string({
        // Required to be specified
        include: "**/*.html",

        // Undefined by default
        exclude: ["**/index.html"]
    })
];

if (buildMinifiedLibrary) {
    plugins.unshift(terser());
}

function shouldMinify(args) {
    return (args || []).indexOf('--minify') > -1;
}

export default {
    input: 'src/scripts/index.js',
    output: {
        format: 'iife',
        file: 'public/index.js',
        name: 'AdaptiveEditor',
        globals: {
            adaptivecards: 'window.AdaptiveCards',
            'adaptive-html': 'window.AdaptiveHtml',
            pell: 'window.pell'
        }
    },
    plugins: plugins,
    external: ['adaptivecards', 'adaptive-html', 'pell']
};