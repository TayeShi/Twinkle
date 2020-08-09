// next.config.js
const withLess = require('@zeit/next-less')
module.exports = withLess({
  /* config options here */
  cssModules: true,
  webpack(config, options) {
    return config
  }
})