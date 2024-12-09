/* tslint:disable */
/* eslint-disable */
/**
 * API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { AuthenticationRequest } from '../models';
// @ts-ignore
import type { AuthenticationResponse } from '../models';
// @ts-ignore
import type { RegistrationRequest } from '../models';
/**
 * AuthenticationControllerApi - axios parameter creator
 * @export
 */
export const AuthenticationControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {AuthenticationRequest} authenticationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authenticate: async (authenticationRequest: AuthenticationRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'authenticationRequest' is not null or undefined
            assertParamExists('authenticate', 'authenticationRequest', authenticationRequest)
            const localVarPath = `/api/v1/auth/authenticate`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(authenticationRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEmail: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/auth/email`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JwtAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refresh: async (body: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('refresh', 'body', body)
            const localVarPath = `/api/v1/auth/refresh-token`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {RegistrationRequest} registrationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register: async (registrationRequest: RegistrationRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'registrationRequest' is not null or undefined
            assertParamExists('register', 'registrationRequest', registrationRequest)
            const localVarPath = `/api/v1/auth/register`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(registrationRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthenticationControllerApi - functional programming interface
 * @export
 */
export const AuthenticationControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthenticationControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {AuthenticationRequest} authenticationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authenticate(authenticationRequest: AuthenticationRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthenticationResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authenticate(authenticationRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationControllerApi.authenticate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEmail(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getEmail(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationControllerApi.getEmail']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async refresh(body: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthenticationResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.refresh(body, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationControllerApi.refresh']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {RegistrationRequest} registrationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async register(registrationRequest: RegistrationRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthenticationResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.register(registrationRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationControllerApi.register']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthenticationControllerApi - factory interface
 * @export
 */
export const AuthenticationControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthenticationControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {AuthenticationRequest} authenticationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authenticate(authenticationRequest: AuthenticationRequest, options?: RawAxiosRequestConfig): AxiosPromise<AuthenticationResponse> {
            return localVarFp.authenticate(authenticationRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEmail(options?: RawAxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.getEmail(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refresh(body: string, options?: RawAxiosRequestConfig): AxiosPromise<AuthenticationResponse> {
            return localVarFp.refresh(body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {RegistrationRequest} registrationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        register(registrationRequest: RegistrationRequest, options?: RawAxiosRequestConfig): AxiosPromise<AuthenticationResponse> {
            return localVarFp.register(registrationRequest, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthenticationControllerApi - object-oriented interface
 * @export
 * @class AuthenticationControllerApi
 * @extends {BaseAPI}
 */
export class AuthenticationControllerApi extends BaseAPI {
    /**
     * 
     * @param {AuthenticationRequest} authenticationRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationControllerApi
     */
    public authenticate(authenticationRequest: AuthenticationRequest, options?: RawAxiosRequestConfig) {
        return AuthenticationControllerApiFp(this.configuration).authenticate(authenticationRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationControllerApi
     */
    public getEmail(options?: RawAxiosRequestConfig) {
        return AuthenticationControllerApiFp(this.configuration).getEmail(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationControllerApi
     */
    public refresh(body: string, options?: RawAxiosRequestConfig) {
        return AuthenticationControllerApiFp(this.configuration).refresh(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {RegistrationRequest} registrationRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationControllerApi
     */
    public register(registrationRequest: RegistrationRequest, options?: RawAxiosRequestConfig) {
        return AuthenticationControllerApiFp(this.configuration).register(registrationRequest, options).then((request) => request(this.axios, this.basePath));
    }
}

