/*包含多个用于生成新的 state 的 reducer 函数的模块 */
import { combineReducers } from 'redux'

function xxx(state = 0, action) {
  return state
}

function yyy(state = 0, action) {
  return state
}

export default combineReducers({
  xxx,
  yyy
})
