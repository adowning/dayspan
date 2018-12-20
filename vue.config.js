// https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/config.md
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: '/',

  // where to output built files
  outputDir: 'dist',

  configureWebpack: {
    devtool: 'source-map'
    // plugins: [
    //   isProductionEnvFlag
    //     ? new PrerenderSPAPlugin({
    //       // Required - The path to the webpack-outputted app to prerender.
    //       staticDir: path.join(__dirname, 'dist'),
    //       // Required - Routes to render.
    //       routes: ['/', '/explore']
    //     })
    //     : () => { },
    //   // NEED FIX 🚧 : HardSourceWebpackPlugin Will Cause Error.
    //   // new HardSourceWebpackPlugin(),
    //   isProductionEnvFlag ? new SizePlugin() : () => { }
    // ]
  },
  devServer: {
    // open: process.platform === 'darwin',
    host: '127.0.0.1',
    port: 2096,
    // https: false,
    disableHostCheck: true,

    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      // '^/': {
      //   target: 'https://api.ashdevtools.com',
      //   ws: true,
      //   changeOrigin: true
      // },
      '^/token': {
        target: 'https://www.humanity.com/oauth2/token.php',
        ws: true,
        changeOrigin: true
      },
      '^/humanity': {
        target: 'https://www.humanity.com/api/v2',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/humanity': ''
        }
      }
    },
    // https: {
    //   key: fs.readFileSync('./certs/cf_mobile.key'),
    //   cert: fs.readFileSync('./certs/cf_mobile.pem')
    // },
    before: app => {}
  }
}
