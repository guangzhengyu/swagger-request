## Feature
Generate axios api functions from swagger json

## Example
#### test.js
```javascript
import swaggerRequest from 'swagger-request'

swaggerRequest({
  docUrl: 'https://your.swagger-doc.com/swagger.json',
  filepath: path.join(__dirname, './your/folder')
})
```
#### swagger.json
```json
{
  "info": {
    "version": "1.0.0",
    "title": "API"
  },
  "paths": {
    "/users": {
      "get": {
        "operationId": "get_users",
        "summary": "Get all users"
      }
    },
    "/users/{id}": {
      "get": {
        "operationId": "get_user",
        "summary": "Get user by id",
        "parameters": [
          {
            "$ref": "#/parameters/string_id_in_path"
          }
        ]
      }
    }
  }
}
```

#### Generated axios apis
```javascript
let _axios


/**
 * Bind axios
 * @param axios axios
 */
export function bindAxios (axios) {
  _axios = axios
}

/**
 * Get all users
 * @param params {Object} param
 */
export function getStars (params = {}) {
  if (!_axios) {
    throw new Error('No available axios. Please call bindAxios() first')
  }
  const config = {
    url: `/users`,
    method: 'GET',
    params
  }
  return _axios.request(config)
}

/**
 * Get user by id
 * @param params {Object} param
 */
export function getStars (params = {}) {
  if (!_axios) {
    throw new Error('No available axios. Please call bindAxios() first')
  }
  const config = {
    url: `/user/${params.id}`,
    method: 'GET',
    params
  }
  delete params.id
  return _axios.request(config)
}
```

`{id}` in path is changed to `${params.id}` 

## How to use these apis
My practice is:
```javascript
// user-api.js
import { bindAxios } from '../generated-swagger/user.js'
import axios from 'axios'

// Make sure init first.
axios.create({
  baseURL: 'https://user.myhost.com'
})

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

bindAxios(axios)

// Then, use it anywhere you need
// For example
// user-repository.js
import { getUsers } from '../generated-swagger/user.js'

export function query () {
  return new Promise((resolve, reject) => {
    getUsers().then(({ data: user }) => {
      return {
        fullname: user.firstName + ' ' + user.lastName
      }
    }).catch(error => {
      // ...handle the error
      reject()
    })
  })
}
```
