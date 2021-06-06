const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
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
        test: /\.(css|less|js)$/,
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
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#246aa5' },
      },
    }),

    addCompression(),

    addWebpackAlias({
      '@': path.join(__dirname, 'src'),
    }),

    (config) => {
      //修改、添加loader 配置 :
      // 所有的loaders规则是在config.module.rules(数组)的第二项
      // 即：config.module.rules[2].oneof  (如果不是，具体可以打印 一下是第几项目)
      // 修改 less 配置 ，规则 loader 在第7项(具体可以打印配置)
      const loaders = config.module.rules
        .find(rule => Array.isArray(rule.oneOf)).oneOf
      console.log(loaders)
      loaders[7].use.push({
        loader: 'style-resources-loader',
        options: {
          patterns: path.resolve(__dirname, 'src/configs/theme.config.less'),//全局引入公共的less文件
        },
      })
      return config
    },
  ),
  // devServer: overrideDevServer(devServerConfig()),
}
