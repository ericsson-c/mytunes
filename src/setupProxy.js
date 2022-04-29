const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://mytunes-api.herokuapp.com',
      changeOrigin: true,
      onProxyReq: function(request) {
        request.setHeader("origin", "http://mytunes-api.herokuapp.com");
      },
    })
  );
};