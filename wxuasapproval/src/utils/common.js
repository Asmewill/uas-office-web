export function isObjNull (obj) {
  return (obj == null || obj == undefined)
}

export function isObjEmpty (obj) {
  return isObjNull(obj) || obj.length == 0
}

export function isEmptyObject (obj) {
  if (isObjNull(obj)) {
    return false
  }
  if (obj.length == 0) {
    return false
  }
  for (var n in obj) {
    return false
  }
  return true
}

export function strContain (parent, child) {
  if (isObjEmpty(parent)) {
    return false
  }
  return (parent.indexOf(child) != -1)
}

export function getStrValue (object, key) {
  if (isObjNull(object)) {
    return ''
  }
  if (isObjNull(object[key])) {
    return ''
  }
  return object[key]
}

export function getIntValue (object, key) {
  if (isObjNull(object)) {
    return 0
  }
  if (isObjNull(object[key])) {
    return 0
  }
  return object[key]
}

export function getTimeValue (object, key) {
  if (isObjNull(object)) {
    return 0
  }
  if (isObjNull(object[key])) {
    return 0
  }
  let result = object[key]
  if (typeof result == 'string') {
    try {
      let time = Date.parse(new Date(result))
      return time
    } catch (e) {
      return result
    }
  } else {
    return result
  }
}

export function getArrayValue (object, key) {
  if (isObjNull(object)) {
    return []
  }
  if (isObjNull(object[key])) {
    return []
  }
  return object[key]
}

export function getObjValue (object, key) {
  if (isObjNull(object)) {
    return {}
  }
  if (isObjNull(object[key])) {
    return {}
  }
  return object[key]
}

/**
 * 取出中括号内的内容
 * @param text
 * @returns {string}
 */
export function getBracketStr (text) {
  let result = ''
  if (isObjEmpty(text))
    return result
  let regex = /\[(.+?)\]/g
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    let option = options[0]
    if (!isObjEmpty(option)) {
      result = option.substring(1, option.length - 1)
    }
  }
  return result
}

/**
 * 取出小括号内的内容
 * @param text
 * @returns {string}
 */
export function getParenthesesStr (text) {
  let result = ''
  if (isObjEmpty(text))
    return result
  let regex = /\((.+?)\)/g
  //去除转义字符
  text = text.replace(/[\'\"\b\f\n\r\t]/g, '')
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    let option = options[0]
    if (!isObjEmpty(option)) {
      result = option.substring(1, option.length - 1)
    }
  }
  return result
}

String.prototype.replaceAll = function (reg, s) {
  if (isObjEmpty(this)) {
    return ''
  }
  return this.replace(new RegExp(reg, 'gm'), s)
}

/**
 * Map转json
 * @param m
 * @returns String
 */
export function MapToJson (m) {
  if (isObjEmpty(m)) {
    return ''
  }
  var str = '{'
  var i = 1
  m.forEach(function (item, key, mapObj) {
    if (mapObj.size == i) {
      str += '"' + key + '":"' + item + '"'
    } else {
      str += '"' + key + '":"' + item + '",'
    }
    i++
  })
  str += '}'
  return str
}

export function strMapToObj (m) {
  if (isObjEmpty(m)) {
    return ''
  }
  var str = '['
  if (isObjEmpty(m)) {
    return ''
  }
  m.forEach(function (item, key) {
    var obj = JSON.stringify(_strMapToObj(item))
    str += obj + ','
  })
  str = str.slice(0, str.length - 1)
  str += ']'
  return str
}

export function _strMapToObj (item) {
  let obj = Object.create(null)
  for (let [k, v] of item) {
    obj[k] = v
  }
  return obj
}

/**
 * require.context(directory, useSubdirectories = false, regExp = /^\.\//);
 * 获取目标目录下符合条件的所有文件
 * @param directory 目标文件夹
 * @param useSubdirectories 是否查找子级目录
 * @param regExp 匹配文件的正则表达式
 */
export function getDirFiles (directory, useSubdirectories, regExp) {
  const context = require.context(directory, useSubdirectories, regExp)

  return context.keys().map(context)
}

/**
 * 获取当前操作系统
 * @returns {string}
 */
export function getOS () {
  let os, navigator = window.navigator
  if (navigator.userAgent.indexOf('Android') > -1 ||
    navigator.userAgent.indexOf('Linux') > -1) {
    os = 'Android'
  } else if (navigator.userAgent.indexOf('iPhone') > -1 ||
    navigator.userAgent.indexOf('iPad') > -1) {
    os = 'iOS'
  } else if (navigator.userAgent.indexOf('Windows Phone') > -1) {
    os = 'WP'
  } else {
    os = 'Others'
  }
  return os
}

/**
 * 网页是否运行在移动端
 * @returns {boolean}
 */
export function isMobile () {
  if ((navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return true
  } else {
    return false
  }
}

/**
 * 获取sessionId
 * @returns {string}
 */
export function getSessionId () {
  let c_name = 'JSESSIONID'
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + '=')
    if (c_start != -1) {
      let c_start = c_start + c_name.length + 1
      let c_end = document.cookie.indexOf(';', c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
}

//yyyy-MM-dd hh:mm:ss
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1,                 //月份
    'd+': this.getDate(),                    //日
    'h+': this.getHours(),                   //小时
    'm+': this.getMinutes(),                 //分
    's+': this.getSeconds(),                 //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds(),             //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1,
        (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(
          ('' + o[k]).length)))
  return fmt
}

String.prototype.endWith = function (s) {
  if (s == null || s == '' || this.length == 0 || s.length > this.length)
    return false
  if (this.substring(this.length - s.length) == s)
    return true
  else
    return false
  return true
}

String.prototype.startWith = function (s) {
  if (s == null || s == '' || this.length == 0 || s.length > this.length)
    return false
  if (this.substr(0, s.length) == s)
    return true
  else
    return false
  return true
}

/**
 * 数字字符串添加千分位符
 * @param num
 * @returns {string}
 */
export function numFormat (num) {
  if (isObjEmpty(num)) {
    return ''
  }
  var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ','
    })
  })
  return res
}
