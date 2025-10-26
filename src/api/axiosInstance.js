import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 API 기본 주소
    withCredentials: true, // Refresh Token 쿠키 전송 위해 필수!
});

// 인터셉터 설정 함수를 export
export const setupInterceptors = (authContext) => {
    // 1. 요청 인터셉터: 모든 요청에 Access Token 추가 (특정 경로 제외)
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = authContext.getAccessToken();
            // 토큰이 있고, 재발급/로그인/회원가입 요청이 아닐 때만 헤더 추가
            const noAuthUrls = ['/v1/reissue', '/v1/oauth', '/v1/users/sign-up', '/v1/users/verifications'];
            if (token && !noAuthUrls.some(url => config.url.startsWith(url))) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 2. 응답 인터셉터: 401 에러 시 토큰 재발급 및 재시도 로직
    let isRefreshing = false; // 현재 토큰 재발급 중인지 여부 플래그
    let failedQueue = [];     // 토큰 재발급을 기다리는 요청 목록 (대기 큐)

    // 대기 중이던 요청들을 처리하는 함수
    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error); // 재발급 실패 시 에러 전파
            } else {
                prom.resolve(token); // 재발급 성공 시 새 토큰 전달
            }
        });
        failedQueue = []; // 큐 비우기
    };

    axiosInstance.interceptors.response.use(
        (response) => response, // 성공 응답은 그대로 반환
        async (error) => {
            const originalRequest = error.config; // 원래 실패했던 요청 정보

            // 401 에러이고, 재발급 요청이 아니며, 아직 재시도 안 한 요청일 때
            if (error.response?.status === 401 && originalRequest.url !== '/v1/reissue' && !originalRequest._retry) {
                // 이미 다른 요청이 재발급을 진행 중이라면...
                if (isRefreshing) {
                    try {
                        // Promise를 만들어서 failedQueue에 추가 -> 재발급이 완료될 때까지 기다림
                        const token = await new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        });
                        // 재발급 성공 후 받은 새 토큰으로 원래 요청 재시도
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return await axiosInstance(originalRequest);
                    } catch (promiseError) {
                        // 재발급 실패 시 에러 반환
                        return Promise.reject(promiseError);
                    }
                }

                // 재발급 시작 (첫 401 요청만 여기 진입)
                originalRequest._retry = true; // 재시도 플래그 설정 (무한 재발급 방지)
                isRefreshing = true;          // 재발급 진행 중 플래그 설정

                try {
                    console.log("Access Token 만료. 재발급 시도...");
                    // Refresh Token 쿠키는 자동으로 전송됨
                    const refreshResponse = await axiosInstance.post('/v1/reissue');
                    const newAccessToken = refreshResponse.headers['authorization']?.replace('Bearer ', '');

                    if (!newAccessToken) {
                        throw new Error("재발급 응답에 토큰 없음");
                    }

                    authContext.login(newAccessToken); // Context(메모리)에 새 토큰 저장
                    processQueue(null, newAccessToken); // 재발급 성공했으니, 대기 중이던 모든 요청(failedQueue) 재개

                    // 현재 실패했던 원래 요청도 새 토큰으로 재시도
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return await axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("토큰 재발급 실패:", refreshError);
                    // 재발급 실패 시 대기 중이던 모든 요청 실패 처리
                    processQueue(refreshError, null);
                    authContext.logout(); // 로그아웃 처리
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false; // 재발급 상태 해제
                }
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInstance;