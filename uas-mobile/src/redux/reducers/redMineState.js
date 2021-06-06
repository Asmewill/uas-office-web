/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 我的数据缓存
 */

const initMineState = {}

const redMineState = (state = initMineState, action) => {
  if (action === undefined) {
    return state
  }

  switch (action.type) {

    default:
      return state
  }
}

export default redMineState
