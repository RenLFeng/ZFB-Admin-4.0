import axios from 'axios'

export const HTTP_STATUS = {
  SUCCESS: 200,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// get
export function Get(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}
// post
export function Post(url, body) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}
