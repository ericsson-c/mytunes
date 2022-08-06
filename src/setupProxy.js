const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      onProxyReq: function(request) {
        request.setHeader("origin", process.env.REACT_APP_API_URL);
      },
      pathRewrite: {
        '^/api' : ''
      }
    })
  );
};