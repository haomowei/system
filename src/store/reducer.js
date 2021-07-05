// redux——1、导出createStore, 调用函数 store = createStore 2、store提供三个API：getState/dispath/subscribe

import {createStore} from 'redux'
import reducer from './reducer'
const store = createStore()
export default store(reducer)