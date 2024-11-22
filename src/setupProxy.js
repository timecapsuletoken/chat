const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Proxy only API calls
    createProxyMiddleware({
      target: 'http://localhost:3000', // Backend server address
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        const url = new URL(proxyReq.path, `http://${req.headers.host}`);
        const cacheBuster = `_=${Date.now()}`;

        // Add cache-busting only for API calls
        if (!url.pathname.includes('/login') && !url.pathname.includes('/home')) {
          url.searchParams.set('_', cacheBuster);
          proxyReq.path = `${url.pathname}${url.search}`;
        }
      },
    })
  );
};
