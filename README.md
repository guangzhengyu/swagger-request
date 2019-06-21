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
  _axios.request(config)
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
  _axios.request(config)
}
```

`{id}` in path is changed to `${params.id}` 
