const {override,  fixBabelImports,  overrideDevServer, addWebpackPlugin, addWebpackExternals} = require('customize-cra')
// const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin') //将moment替换为dayjs，缩小打包体积，package.json和代码中依然正常引入和使用moment即可（不可使用dayjs不支持的高级功能），全部会自动处理
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer') //分析插件，打包后在build/static/report.html中展示各模块所占的大小
// const HtmlWebpackPlugin = require('html-webpack-plugin') //html编译插件，根据变量替换部分内容

const analyze = process.env.REACT_APP_ANALYZE //是否分析打包数据
const externals = process.env.REACT_APP_EXTERNALS //是否使用cdn

module.exports = {
  webpack: override(
    fixBabelImports('antd', {style: 'css'}),
    fixBabelImports('antd-mobile', {style: 'css'}),
    // addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    // analyze ? addWebpackPlugin(new BundleAnalyzerPlugin({
    //   analyzerMode: 'static', //输出静态报告文件report.html，而不是启动一个web服务
    // })): undefined,
    // addWebpackPlugin(new HtmlWebpackPlugin({
    //   template: `${__dirname}/public/index.html`, //create-react-app默认创建的html文件路径，且build写死了必须使用此文件，故直接以它作为模板
    //   externals //设置一个externals变量（将会被templateParameters对应的generator传入模板中）
    // })),
    externals ? addWebpackExternals({
      'react': 'React',
      'react-dom': 'ReactDom',
      'mobx': 'mobx',
    }): undefined,
    // addLessLoader({
    //   javascriptEnabled: true,
    //   modifyVars: { 
    //     "am-primary": "#1cae82", // 正常 
    //     "am-primary-tap": "#1DA57A", // 按下
    //    },
    // })
  ),
  devServer: overrideDevServer()
}