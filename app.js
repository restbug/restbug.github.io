var app = new Vue({
    el: '#app',
    data: {
        method: 'GET',
        url: 'https://code.visualstudio.com/feed.xml',
        headers: '{}',
        body: '',
        resStatusCode: '',
        resHeaders: '',
        resBody: ''
    },
    methods: {
        sendRequest: sendRequest
    }
});

function getProxyId(hostname, callback) {
    jQuery.get('https://restbug.azurewebsites.net/api/getProxy?hostname=' + hostname, function(res) {
        var proxyId = res.proxyId;
        callback(proxyId);
    });
}

function sendRequest() {
    app.resStatusCode = '';
    app.resHeaders = '';
    app.resBody = '';
    
    var url = app.url;
    var method = app.method;
    var urlParser = document.createElement('a');
    urlParser.href = url;
    var hostname = urlParser.host;
    var rest = urlParser.pathname + urlParser.search;
    urlParser = null;
    var headers;
    try {
        headers = JSON.parse(app.headers);
    } catch(e) {
        headers = {};
    }
    var body = app.body || null;
    getProxyId(hostname, function(proxyId) {
        var url = 'https://restbug.azurewebsites.net/proxy/' + proxyId + rest;
        jQuery.ajax({
            url: url,
            method: method,
            headers: headers,
            data: body
        }).done(function(data, textStatus, jqXHR) {
            app.resStatusCode = jqXHR.status;
            app.resHeaders = jqXHR.getAllResponseHeaders();
            app.resBody = jqXHR.responseText;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            app.resStatusCode = jqXHR.status;
            app.resHeaders = jqXHR.getAllResponseHeaders();
            app.resBody = jqXHR.responseText;
        });
    });
}