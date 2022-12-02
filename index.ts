import axios, {AxiosError, AxiosInstance} from 'axios';

function getAxiosRefreshInstance(refreshToken: () => Promise<any>, onRefreshFailure?: ()=>void): AxiosInstance {
    let isRefreshing = false;
    let failedQueue: {reject: (err: AxiosError) => void; resolve: (value?: unknown) => void}[] = [];

    const processQueue = (error: AxiosError | null): void => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve();
            }
        });

        failedQueue = [];
    };

    const http = axios.create({});

    http.interceptors.response.use(
        undefined,
        function (error) {
            const originalRequest = error.config;
            if (error.response?.status === 401) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({resolve, reject});
                    })
                        .then(() => {
                            return http(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                isRefreshing = true;

                return new Promise(function (resolve, reject) {
                    refreshToken()
                        .then(() => {
                            processQueue(null);
                            resolve(http(originalRequest));
                        })
                        .catch((err) => {
                            reject(err);
                            processQueue(err);
                            onRefreshFailure && onRefreshFailure();
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                });
            }

            return Promise.reject(error);
        }
    );

    return http;
}


export default getAxiosRefreshInstance;