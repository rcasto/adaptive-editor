var path = require('path');
var express = require('express');
var helmet = require('helmet');
var compression = require('compression');

var httpsRedirect = require('./lib/httpsRedirect');
var wwwToNonWwwRedirect = require('./lib/wwwToNonWwwRedirect');

var port = process.env.PORT || 3000;
var app = express();

app.use(compression());
app.use(helmet({
    noSniff: false
}));
app.use(httpsRedirect);
app.use(wwwToNonWwwRedirect);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port, () => console.log(`Server started on port ${port}`));