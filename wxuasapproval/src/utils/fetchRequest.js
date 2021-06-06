import { getStrValue, isObjNull } from './common'

export function fetchPost (url, params, header) {
  if (window.navigator.onLine == false) {
    return Promise.reject('网络连接失败，请检查网络连接')
  }
  // const userInfo = store.getState().redUserInfo

  if (isObjNull(header)) {
    header = {}
  }

  let formData = new FormData()
  if (params) {
    for (let key in params) {
      // if ((typeof params[key]) === 'string') {
      //     formData.append(key, encodeURI(params[key].toString()))
      // } else {
      formData.append(key, params[key])
      // }
    }
  }
  const request = fetch(url, {
    method: 'POST',
    body: formData,
    mode: 'cors',
    credentials: 'include',
    // cache: "force-cache",
    headers: new Headers({
      'Accept': 'application/json',
      // "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      // "Authorization": userInfo.token,
      ...header,
    }),
  })

  return fetchResult(request)
}

export function fetchPostObj (url, params, header) {
  if (window.navigator.onLine == false) {
    return Promise.reject('网络连接失败，请检查网络连接')
  }

  // const userInfo = store.getState().redUserInfo

  if (isObjNull(header)) {
    header = {}
  }

  const request = fetch(url, {
    method: 'POST',
    body: params,
    mode: 'cors',
    credentials: 'include',
    // cache: "force-cache",
    headers: new Headers({
      'Accept': 'application/json',
      // "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      // "Authorization": userInfo.token,
      ...header,
    }),
  })

  return fetchResult(request)
}

export function fetchGet (url, params, header) {
  if (window.navigator.onLine == false) {
    return Promise.reject('网络连接失败，请检查网络连接')
  }

  // const userInfo = store.getState().redUserInfo

  if (isObjNull(header)) {
    header = {}
  }

  if (params) {
    let paramsArray = []
    //拼接参数
    Object.keys(params).forEach(key =>
      paramsArray.push(
        key + '=' + encodeURI(getStrValue(params, key).toString())))

    if (paramsArray.length > 0) {
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
    }
  }

  const request = fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    // cache: "force-cache",
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      // "Authorization": userInfo.token,
      ...header,
    }),
  })

  return fetchResult(request)
}

/**
 * 处理网络请求结果
 * @param request
 * @returns {*}
 */
function fetchResult (request) {
  try {
    return request.then(response => {
      if (response.status == 200) {
        return response
      } else {
        throw response
      }
    }).catch(error => {
      if (error.json) {
        return error.json()
      } else {
        return Promise.reject('请求异常')
      }
    }).then(result => {
      if (result.status == 200) {
        let resultJson = result.json()
        return resultJson
      } else {
        if (result.exceptionInfo) {
          if (result.exceptionInfo.length > 80) {
            throw '接口请求异常'
          } else {
            throw result.exceptionInfo.replace(/<[\/\!]*[^<>]*>/ig, '')
          }
        } else if (result.message) {
          if (result.message.length > 80) {
            throw '接口请求异常'
          } else {
            throw result.message.replace(/<[\/\!]*[^<>]*>/ig, '')
          }
        } else {
          throw result
        }
      }
    })
  } catch (e) {
    return Promise.reject('请求异常')
  }

}
