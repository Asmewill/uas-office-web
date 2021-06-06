/**
 * 对象是否为null或undefined
 * @param obj
 * @returns {boolean}
 */
export function isObjNull (obj) {
  return (obj === null || obj === undefined)
}

/**
 * 对象是否为null或undefined或长度为0
 * @param obj
 * @returns {boolean}
 */
export function isObjEmpty () {
  let args = arguments
  if (isObjNull(args) || (args.length === 0)) {
    return true
  } else {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i]
      if (isObjNull(arg) ||
        (typeof arg === 'string' ? arg.trim().length === 0 : arg.length ===
          0)) {
        return true
      }
    }
    return false
  }
}

/**
 * 是否为空object
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject (obj) {
  if (isObjNull(obj)) {
    return false
  }
  if (obj.length === 0) {
    return false
  }
  for (var n in obj) {
    return false
  }
  return true
}

/**
 * 字符串是否包含另一字符串
 * @param parent
 * @param child
 * @returns {boolean}
 */
export function strContain (parent, child) {
  if (isObjEmpty(parent)) {
    return false
  }
  return (parent.indexOf(child) !== -1)
}

/**
 * 根据key取某对象中的String值
 * @param object
 * @param key
 * @returns {*}
 */
export function getStrValue (object, key) {
  if (isObjNull(object)) {
    return ''
  }
  if (isObjNull(object[key])) {
    return ''
  }
  return object[key]
}

/**
 * 根据key取某对象中的Number值
 * @param object
 * @param key
 * @returns {*}
 */
export function getIntValue (object, key) {
  if (isObjNull(object)) {
    return 0
  }
  if (isObjNull(object[key])) {
    return 0
  }
  return object[key]
}

/**
 * 根据key取某对象中的日期long值
 * @param object
 * @param key
 * @returns {*}
 */
export function getTimeValue (object, key) {
  if (isObjNull(object)) {
    return 0
  }
  if (isObjNull(object[key])) {
    return 0
  }
  let result = object[key]
  if (typeof result === 'string') {
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

/**
 * 根据key取某对象中的Array值
 * @param object
 * @param key
 * @returns {*}
 */
export function getArrayValue (object, key) {
  if (isObjNull(object)) {
    return []
  }
  if (isObjNull(object[key])) {
    return []
  }
  return object[key]
}

/**
 * 根据key取某对象中的Object值
 * @param object
 * @param key
 * @returns {*}
 */
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
 * 是否以某一字符串开头
 * @param s
 * @returns {boolean}
 */
String.prototype.startWith = function (s) {
  if (s === null || s === '' || this.length === 0 || s.length > this.length)
    return false
  if (this.substr(0, s.length) === s)
    return true
  else
    return false
  return true
}

/**
 * 是否以某一字符串结尾
 * @param s
 * @returns {boolean}
 */
String.prototype.endWith = function (s) {
  if (s === null || s === '' || this.length === 0 || s.length > this.length)
    return false
  if (this.substring(this.length - s.length) === s)
    return true
  else
    return false
  return true
}

/**
 * 是否存在于参数字符串列表中
 * @returns {boolean}
 */
String.prototype.isStrEquals = function () {
  let args = arguments
  if (isObjNull(args) || args.length === 0) {
    return false
  } else {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i]
      if (isObjNull(arg)) {
        return false
      }
      if (this === arg) {
        return true
      }
    }
    return false
  }
}

/**
 * 字符串全局替换
 * @param reg
 * @param s
 * @returns {string}
 */
String.prototype.replaceAll = function (reg, s) {
  if (isObjEmpty(this)) {
    return ''
  }
  return this.replace(new RegExp(reg, 'gm'), s)
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
        (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(
          ('' + o[k]).length)))
  return fmt
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
    if (mapObj.size === i) {
      str += '"' + key + '":"' + item + '"'
    } else {
      str += '"' + key + '":"' + item + '",'
    }
    i++
  })
  str += '}'
  return str
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

export const getCheckedNodes = (extra) => {
  let checkedNodes = extra.allCheckedNodes || [extra.triggerNode]
  // let count = getCheckedCount(checkedNodes)
  if (isObjEmpty(checkedNodes)) {
    checkedNodes = []
  }
  checkedNodes = getNodes(checkedNodes)
  console.log('checkNodes', checkedNodes)
  return { checkedNodes, count: checkedNodes.length }
}

export const getCheckedCount = (checkedNodes) => {
  if (!isObjEmpty(checkedNodes)) {
    let quantity = 0
    for (let i = 0; i < checkedNodes.length; i++) {
      let checkedNode = checkedNodes[i]
      if (checkedNode) {
        if (checkedNode.node) {
          if (checkedNode.children) {
            checkedNode = checkedNode.children
            quantity = quantity + getCheckedCount(checkedNode)
          } else {
            quantity = quantity + 1
            continue
          }
        } else {
          if (checkedNode.props) {
            if (checkedNode.props.children.length > 0) {
              checkedNode = checkedNode.props.children
              quantity = quantity + getCheckedCount(checkedNode)
            } else {
              quantity = quantity + 1
              continue
            }
          }
        }
      } else {
        continue
      }
    }
    return quantity
  } else {
    return 0
  }
}

export const getNodes = (checkedNodes) => {
  if (!isObjEmpty(checkedNodes)) {
    let childNodes = []
    for (let i = 0; i < checkedNodes.length; i++) {
      let checkedNode = checkedNodes[i]
      if (checkedNode) {
        if (checkedNode.node && checkedNode.node.props) {
          const checkProps = checkedNode.node.props
          if (!isObjEmpty(checkProps.children)) {
            checkedNode = checkProps.children
            childNodes = childNodes.concat(getNodes(checkedNode))
          } else {
            let exist = false
            for (let j = 0; j < childNodes.length; j++) {
              if (checkProps && checkProps.value == childNodes[j].value) {
                exist = true
                break
              }
            }
            if (!exist) {
              childNodes.push(checkProps)
            }
            continue
          }
        } else {
          if (checkedNode.props) {
            const checkProps = checkedNode.props
            if (!isObjEmpty(checkProps.children)) {
              checkedNode = checkProps.children
              childNodes = childNodes.concat(getNodes(checkedNode))
            } else {
              let exist = false
              for (let j = 0; j < childNodes.length; j++) {
                if (checkProps && checkProps.value == childNodes[j].value) {
                  exist = true
                  break
                }
              }
              if (!exist) {
                childNodes.push(checkProps)
              }
              continue
            }
          }
        }
      } else {
        continue
      }
    }
    return childNodes
  } else {
    return []
  }
}

export const getFileType = (filePath) => {
  var startIndex = filePath.lastIndexOf('.')
  if (startIndex != -1) {
    return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
  } else {
    return ''
  }
}

export const getVisibleObj = (obj1, obj2) => {
  return isObjNull(obj1) ? obj2 : obj1
}

//生成从minNum到maxNum的随机数
export function randomNum (minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
      break
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      break
    default:
      return 0
      break
  }
}

//解析url的search参数
export function getSearchParams (searchStr) {
  let params = new Object()
  if (!isObjEmpty(searchStr) && searchStr.indexOf('?') !== -1) {
    searchStr = searchStr.substr(1)
    const searchArray = searchStr.split('&')
    for (let i = 0; i < searchArray.length; i++) {
      params[searchArray[i].split('=')[0]] = unescape(
        searchArray[i].split('=')[1])
    }
  }
  return params
}

//阿拉伯数字转中文数字
export function NoToChinese (num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert('Number is wrong!')
    return 'Number is wrong!'
  }
  var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九')
  var BB = new Array('', '十', '百', '千', '万', '亿', '点', '')
  var a = ('' + num).replace(/(^0*)/g, '').split('.'),
    k = 0,
    re = ''
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
          re = BB[4] + re
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }
    if (k % 4 === 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) ===
      0) re = AA[0] + re
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
    k++
  }
  if (a.length > 1) //加上小数部分(如果有小数部分)
  {
    re += BB[6]
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
  }
  return re
}

/**
 * 获取当前操作系统
 * @returns {string}
 */
export function getOS () {
  let os, navigator = window.navigator
  if (navigator.userAgent.indexOf('Android') > -1
    // || navigator.userAgent.indexOf('Linux') > -1
  ) {
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
 * 保留小数（四舍五入）
 *
 */
export function getFloat (number, precision) {
  return Math.round(+number + 'e' + precision) / Math.pow(10, precision)
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

/**
 * 参数说明
 * @param s：要格式化的数字
 * @param n：保留几位小数
 * */
export function formatCurrency (s, n) {
  n = (n >= 0 && n <= 20) ? n : 2 //n大于0小于等于20时，值为n，否则默认为2
  //将要格式化的数字转换成字符串，并去掉其中匹配的其他字符后返回一个浮点数。
  //把 Number 四舍五入为指定位数的数字后，最终在转换成字符串。
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  let numArry = s.split('.'), //分隔字符串 0 -> 小数点前面数值 1 -> 小数点后面的尾数
    l = numArry[0].split('').reverse(), //将前面数值再分隔，并反转顺序
    t = ''
  for (let i = 0; i < l.length; i++) { //每隔三位小数分始开隔
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '')
  }
  //将顺序反转回来，并返回一个字符串
  return t.split('').reverse().join('') + '.' + numArry[1]
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
