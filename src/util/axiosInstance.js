import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT access 토큰을 요청 헤더에 추가하는 인터셉터 추가
axiosInstance.interceptors.request.use(
  function (config) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      .split("=")[1];

    console.log("제발", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;

// 위 코드는 Axios 인스턴스를 생성하고, JWT access 토큰을 요청 헤더에 추가하는 인터셉터를 추가하는 코드입니다.

// axios.create({...}): Axios 인스턴스를 생성합니다. baseURL을 설정하여, 해당 URL을 기본 URL로 사용하도록 설정합니다.
// timeout을 설정하여, 요청에 대한 응답을 기다리는 최대 시간을 설정합니다. headers에는 요청 헤더를 설정합니다.
// 이 코드에서는 Content-Type을 application/json으로 설정합니다.
// instance.interceptors.request.use(...): Axios 요청에 대한 인터셉터를 추가합니다.
// 이 코드에서는 요청 헤더에 JWT access 토큰을 추가합니다. function(config)는 요청 구성 객체를 인자로 받습니다.
// 이 함수에서는 document.cookie를 사용하여, access_token 쿠키를 찾아 JWT access 토큰을 가져옵니다.
// config.headers.Authorization에 Bearer <token> 형식으로 JWT access 토큰을 설정합니다.
// export default instance;: 생성한 Axios 인스턴스를 모듈로 내보냅니다.
// 이렇게 하면 다른 파일에서 이 인스턴스를 import하여 사용할 수 있습니다.

// 사용하는 곳 참고
// import axiosInstance from './axiosInstance';

// axiosInstance.get('/users/me')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

// 위 코드에서 /users/me는 /users/me와 같습니다.
// 인스턴스를 사용하면 baseURL을 매번 입력하지 않아도 되므로 코드가 간결해집니다.
