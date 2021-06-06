const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  overrideDevServer,
} = require(
  'customize-cra')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')

//执行npm run build不产生map文件
process.env.GENERATE_SOURCEMAP = 'false'

const isEnvProduction = process.env.NODE_ENV === 'production'

const addCompression = () => config => {
  if (isEnvProduction) {
    config.plugins.push(
      // gzip压缩
      new CompressionWebpackPlugin({
        test: /\.(css|js)$/,
        // 只处理比1kb大的资源
        threshold: 1024,
        // 只处理压缩率低于90%的文件
        minRatio: 0.9,
      }),
    )
  }

  return config
}

/**
 * 解决react router 路由刷新404问题
 * @returns {function(*): {historyApiFallback: boolean}}
 */
const devServerConfig = () => config => {
  return {
    ...config,
    historyApiFallback: true,
  }
}

module.exports = {
  webpack: override(
    fixBabelImports('import-antd', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),

    fixBabelImports('import-ant-mobile', {
      libraryName: 'antd-mobile',
      libraryDirectory: 'lib',
      style: true,
    }),

    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#1DA57A' },
    }),

    addCompression(),

    addWebpackAlias({
      '@': path.join(__dirname, 'src'),
    }),
  ),
  // devServer: overrideDevServer(
  //   devServerConfig(),
  // ),
}

