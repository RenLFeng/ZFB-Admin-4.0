import config from '../config'
import storageKeys from './storageKeys'

let baseURL='http://test-admin.sanzhongzhixiang.com';

//  baseURL='http://192.168.0.23:8080';

const CODE = {
  SUCCESS: '200',
  UN_AUTH: '403',
  NO_LOGIN: '400',
  FAIL: '500',
  SYS_ERROR: '404'
}


let gb = {}

export const init = ({ navigator, tips }) => {
  gb.navigator = navigator
  gb.tips = tips
}

export class NoLoginError extends Error {
  constructor(msg) {
    super()
    this.message = msg
  }
}

export class RequestError extends Error {
  constructor(msg) {
    super()
    this.message = msg
  }
}

const goLogin = () => {
  localStorage.clear()
  gb.navigator.goLogin()
}

const handlers = [
  {
    code: 200,
    handle: (responseText, resolve, reject) => {
      if (!responseText) {
        return
      }
      const { code, data, msg } = JSON.parse(responseText)
      if (code === CODE.SUCCESS) {
        resolve({
          data,
          msg
        })
      }
      if (code === CODE.NO_LOGIN) {
        goLogin()
      }
      if (code === CODE.FAIL) {
        gb.tips(msg);
      }
      if (code === CODE.SYS_ERROR) {
        gb.tips(msg)
      }
      reject(new RequestError(msg))
    }
  }
]

export const post = ({ url, data }) =>
  new Promise((resolve, reject) => {
    data = data || {}
    let prefix = process.env.VUE_APP_HOST || baseURL
    // let prefix = baseURL
    url = [prefix, url].join('/')
    let client = new XMLHttpRequest()
    client.open('POST', url, true)
    client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    const token = localStorage.getItem(storageKeys.TOKEN)
    if (token) {
      client.setRequestHeader('token', token)
    }
    client.send(
      Object.keys(data)
        .map(key => `${key}=${data[key]}`)
        .join('&')
    )
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        const handler = handlers.find(handler => handler.code === client.status)
        if (handler) {
          handler.handle(client.responseText, resolve, reject)
        }
      }
    }
  })

export const postWithFile = ({ url, data, fileForm }) =>
  new Promise((resolve, reject) => {
    data = data || {}
    let prefix = process.env.VUE_APP_HOST || baseURL
    // let prefix = baseURL
    url = [prefix, url].join('/')
    const formData = new FormData()
    Object.keys(fileForm).forEach(key => {
      formData.append(key, fileForm[key])
    })
    Object.keys(data).forEach(key => {
      formData.append(key, data[key])
    })
    const client = new XMLHttpRequest()
    client.open('post', url)
    if (localStorage.getItem(storageKeys.TOKEN)) {
      client.setRequestHeader('token', localStorage.getItem(storageKeys.TOKEN))
    }
    client.send(formData)
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        const handler = handlers.find(handler => handler.code === client.status)
        if (handler) {
          handler.handle(client.responseText, resolve, reject)
        }
      }
    }
  })

export const postJOSN = ({ url, data }) =>
  new Promise((resolve, reject) => {
    data = data || {}
    let prefix = process.env.VUE_APP_HOST || baseURL
    // let prefix = baseURL
    url = [prefix, url].join('/')
    let client = new XMLHttpRequest()
    client.open('POST', url, true)
    client.setRequestHeader('Content-type', 'application/json')
    const token = localStorage.getItem(storageKeys.TOKEN)
    if (token) {
      client.setRequestHeader('token', token)
    }
    client.send(JSON.stringify(data))
    client.onreadystatechange = () => {
      if (client.readyState === 4) {
        const handler = handlers.find(handler => handler.code === client.status)
        if (handler) {
          handler.handle(client.responseText, resolve, reject)
        }
      }
    }
  })
