# axios-refresh

## Installing

### Package manager

Using npm:

```bash
$ npm install axios-refresh
```

Once the package is installed, you can import the library using `import` approach:

```js
import getAxiosRefreshInstance from "axios-refresh"
```

## Example

> **Note** JS usage

```js
import getAxiosRefreshInstance from "axios-refresh"

const refreshToken = ()=>{
  return axios.post(...).then(data => {
    setTokens()
    return data;
  });
}

// function on refresh token error (change location, remove tokens...) 
const onError = ()=>{...};


export const http = getAxiosRefreshInstance(refreshToken, onError);

http.interceptors.request.use((req: AxiosRequestConfig) => {
    if (req.headers) req.headers.Authorization = `Bearer ${...}`;
    else req.headers = {Authorization: `Bearer ${...}`};
    return req;
});


// Than for protected routes use http axios instance

// example of protected route
const fetchUsers = () => {
  return http.get(...);
}
```
