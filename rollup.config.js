import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel({
        exclude: 'node_modules/**' // only transpile our source code
    })
];

if (buildMinifiedLibrary) {
    plugins.unshift(uglify());
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
            'adaptive-html': 'window.AdaptiveHtml'
        }
    },
    plugins: plugins,
    external: ['adaptivecards', 'adaptive-html']
};