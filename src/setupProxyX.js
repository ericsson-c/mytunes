const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://mytunes-api.herokuapp.com',
      changeOrigin: false,
    })
  );
};