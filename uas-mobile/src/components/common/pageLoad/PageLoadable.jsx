/**
 * Created by RaoMeng on 2020/3/4
 * Desc: react-loadable方式加载页面，加快页面渲染速度
 */

import React from 'react'
import Loadable from 'react-loadable'

const defaultLoading = () => {
  return (
    <div></div>
  )
}

export default (loadPage, loading = defaultLoading) => {
  return Loadable({
    loader: () => {
      return loadPage
    },
    loading,
  })
}
