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
import type { UserProfileResponse } from '../models';
// @ts-ignore
import type { UserSearchResponse } from '../models';
/**
 * UserControllerApi - axios parameter creator
 * @export
 */
export const UserControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile: async (userId: , options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('getUserProfile', 'userId', userId)
            const localVarPath = `/api/v1/users/{userId}/profile`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
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
         * @param {string} query 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchUsers: async (query: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'query' is not null or undefined
            assertParamExists('searchUsers', 'query', query)
            const localVarPath = `/api/v1/users/search`;
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

            if (query !== undefined) {
                localVarQueryParameter['query'] = query;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserControllerApi - functional programming interface
 * @export
 */
export const UserControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserProfile(userId: , options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserProfileResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserProfile(userId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserControllerApi.getUserProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {string} query 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchUsers(query: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserSearchResponse>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.searchUsers(query, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserControllerApi.searchUsers']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UserControllerApi - factory interface
 * @export
 */
export const UserControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile(userId: , options?: RawAxiosRequestConfig): AxiosPromise<UserProfileResponse> {
            return localVarFp.getUserProfile(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} query 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchUsers(query: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<UserSearchResponse>> {
            return localVarFp.searchUsers(query, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserControllerApi - object-oriented interface
 * @export
 * @class UserControllerApi
 * @extends {BaseAPI}
 */
export class UserControllerApi extends BaseAPI {
    /**
     * 
     * @param {} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserControllerApi
     */
    public getUserProfile(userId: , options?: RawAxiosRequestConfig) {
        return UserControllerApiFp(this.configuration).getUserProfile(userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} query 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserControllerApi
     */
    public searchUsers(query: string, options?: RawAxiosRequestConfig) {
        return UserControllerApiFp(this.configuration).searchUsers(query, options).then((request) => request(this.axios, this.basePath));
    }
}

