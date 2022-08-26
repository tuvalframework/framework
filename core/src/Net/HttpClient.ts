import { int } from '../float';
import { axios } from './Axios/axios';


export type HttpClientRequestHeaders = Record<string, string | number | boolean>;

export type HttpClientResponseHeaders = Record<string, string> & {
    "set-cookie"?: string[]
};

export interface HttpClientRequestTransformer {
    (data: any, headers?: HttpClientRequestHeaders): any;
}

export interface HttpClientResponseTransformer {
    (data: any, headers?: HttpClientResponseHeaders): any;
}

export interface HttpClientAdapter {
    (config: HttpClientRequestConfig): HttpClientPromise;
}

export interface HttpClientBasicCredentials {
    username: string;
    password: string;
}

export interface HttpClientProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

export interface TransitionalOptions {
    silentJSONParsing?: boolean;
    forcedJSONParsing?: boolean;
    clarifyTimeoutError?: boolean;
}

export interface HttpClientRequestConfig<D = any> {
    url?: string;
    method?: Method;
    baseURL?: string;
    transformRequest?: HttpClientRequestTransformer | HttpClientRequestTransformer[];
    transformResponse?: HttpClientResponseTransformer | HttpClientResponseTransformer[];
    headers?: HttpClientRequestHeaders;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: D;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    adapter?: HttpClientAdapter;
    auth?: HttpClientBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: HttpClientProxyConfig | false;
    cancelToken?: CancelToken;
    decompress?: boolean;
    transitional?: TransitionalOptions;
    signal?: AbortSignal;
    insecureHTTPParser?: boolean;
}

export interface HeadersDefaults {
    common: HttpClientRequestHeaders;
    delete: HttpClientRequestHeaders;
    get: HttpClientRequestHeaders;
    head: HttpClientRequestHeaders;
    post: HttpClientRequestHeaders;
    put: HttpClientRequestHeaders;
    patch: HttpClientRequestHeaders;
    options?: HttpClientRequestHeaders;
    purge?: HttpClientRequestHeaders;
    link?: HttpClientRequestHeaders;
    unlink?: HttpClientRequestHeaders;
}

export interface HttpClientDefaults<D = any> extends Omit<HttpClientRequestConfig<D>, 'headers'> {
    headers: HeadersDefaults;
}

export interface HttpClientResponse<T = any, D = any> {
    data: T;
    status: number;
    statusText: string;
    headers: HttpClientResponseHeaders;
    config: HttpClientRequestConfig<D>;
    request?: any;
}

export interface HttpClientError<T = any, D = any> extends Error {
    config: HttpClientRequestConfig<D>;
    code?: string;
    request?: any;
    response?: HttpClientResponse<T, D>;
    isAxiosError: boolean;
    toJSON: () => object;
}

export interface HttpClientPromise<T = any> extends Promise<HttpClientResponse<T>> {
}

export interface CancelStatic {
    new(message?: string): Cancel;
}

export interface Cancel {
    message: string;
}

export interface Canceler {
    (message?: string): void;
}

export interface CancelTokenStatic {
    new(executor: (cancel: Canceler) => void): CancelToken;
    source(): CancelTokenSource;
}

export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}

export interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}

export interface AxiosInterceptorManager<V> {
    use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
    eject(id: number): void;
}

export class HttpClient {
    private axios;
    constructor(config?: HttpClientRequestConfig) {
        this.axios = axios.create(config);
    }
    public static get defaults(): HttpClientDefaults {
        return axios.defaults;
    }

    public static CreateCancelToken(): CancelToken {
        return axios.CancelToken.source();
    }

    /* interceptors: {
        request: AxiosInterceptorManager<HttpClientRequestConfig>;
        response: AxiosInterceptorManager<HttpClientResponse>;
    }; */
    public static GetUri(config?: HttpClientRequestConfig): string {
        return axios.getUri(config);
    }
    public static Request<T = any, R = HttpClientResponse<T>, D = any>(config: HttpClientRequestConfig<D>): Promise<R> {
        return axios.request(config);
    }
    public static Get<T = any, D = any>(url: string, config?: HttpClientRequestConfig<D>): Promise<HttpClientResponse<T>> {
        return axios.get(url, config);
    }
    public static Delete<T = any, R = HttpClientResponse<T>, D = any>(url: string, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.delete(url, config);
    }
    public static Head<T = any, R = HttpClientResponse<T>, D = any>(url: string, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.head(url, config);
    }
    public static Options<T = any, R = HttpClientResponse<T>, D = any>(url: string, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.options(url, config);
    }

    public static Post<D = any, T = any, R = HttpClientResponse<T>>(url: string, data?: D, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.post(url, data, config);
    }

    public static Put<T = any, R = HttpClientResponse<T>, D = any>(url: string, data?: D, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.put(url, data, config);
    }

    public static patch<T = any, R = HttpClientResponse<T>, D = any>(url: string, data?: D, config?: HttpClientRequestConfig<D>): Promise<R> {
        return axios.patch(url, data, config);
    }
}

/* export interface AxiosInstance extends Axios {
    (config: HttpClientRequestConfig): HttpClientPromise;
    (url: string, config?: HttpClientRequestConfig): HttpClientPromise;
}
 */
/* export interface AxiosStatic extends AxiosInstance {
    create(config?: HttpClientRequestConfig): AxiosInstance;
    Cancel: CancelStatic;
    CancelToken: CancelTokenStatic;
    Axios: typeof Axios;
    readonly VERSION: string;
    isCancel(value: any): boolean;
    all<T>(values: Array<T | Promise<T>>): Promise<T[]>;
    spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
    isAxiosError(payload: any): payload is HttpClientError;
} */


/* export class HttpClient {
    public Get(url: string): Promise<IHttpResponse> {
        return axios.get(url);
    }
    public Post<T>(url: string, data: T): Promise<IHttpResponse> {
        return axios.post(url, data);
    }
} */