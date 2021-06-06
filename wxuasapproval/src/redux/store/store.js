import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { appReducer } from '../reducers'

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2, // 查看 'Merge Process' 部分的具体情况
}

const myPersistReducer = persistReducer(persistConfig, appReducer)

const store = createStore(myPersistReducer)

export const persistor = persistStore(store)

export default store

/*export const configStore = () => {
    const store = createStore(
        appReducer,
        compose(
            applyMiddleware(thunk, createLogger)
        )
    )
    return store
}*/
