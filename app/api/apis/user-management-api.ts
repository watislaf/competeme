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
 * UserManagementApi - axios parameter creator
 * @export
 */
export const UserManagementApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Retrieves complete profile information for a specific user
         * @summary Get user profile
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile: async (userId: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
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
         * Searches users by name and returns sorted results
         * @summary Search users
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
        /**
         * Updates the profile image URL for the authenticated user
         * @summary Update profile image
         * @param {number} id 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateProfileImage: async (id: number, body: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateProfileImage', 'id', id)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('updateProfileImage', 'body', body)
            const localVarPath = `/api/v1/users/{id}/image`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JwtAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
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
    }
};

/**
 * UserManagementApi - functional programming interface
 * @export
 */
export const UserManagementApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserManagementApiAxiosParamCreator(configuration)
    return {
        /**
         * Retrieves complete profile information for a specific user
         * @summary Get user profile
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserProfile(userId: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserProfileResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserProfile(userId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserManagementApi.getUserProfile']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Searches users by name and returns sorted results
         * @summary Search users
         * @param {string} query 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchUsers(query: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserSearchResponse>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.searchUsers(query, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserManagementApi.searchUsers']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Updates the profile image URL for the authenticated user
         * @summary Update profile image
         * @param {number} id 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateProfileImage(id: number, body: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateProfileImage(id, body, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UserManagementApi.updateProfileImage']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UserManagementApi - factory interface
 * @export
 */
export const UserManagementApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserManagementApiFp(configuration)
    return {
        /**
         * Retrieves complete profile information for a specific user
         * @summary Get user profile
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile(userId: number, options?: RawAxiosRequestConfig): AxiosPromise<UserProfileResponse> {
            return localVarFp.getUserProfile(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * Searches users by name and returns sorted results
         * @summary Search users
         * @param {string} query 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchUsers(query: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<UserSearchResponse>> {
            return localVarFp.searchUsers(query, options).then((request) => request(axios, basePath));
        },
        /**
         * Updates the profile image URL for the authenticated user
         * @summary Update profile image
         * @param {number} id 
         * @param {string} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateProfileImage(id: number, body: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.updateProfileImage(id, body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserManagementApi - object-oriented interface
 * @export
 * @class UserManagementApi
 * @extends {BaseAPI}
 */
export class UserManagementApi extends BaseAPI {
    /**
     * Retrieves complete profile information for a specific user
     * @summary Get user profile
     * @param {number} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserManagementApi
     */
    public getUserProfile(userId: number, options?: RawAxiosRequestConfig) {
        return UserManagementApiFp(this.configuration).getUserProfile(userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Searches users by name and returns sorted results
     * @summary Search users
     * @param {string} query 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserManagementApi
     */
    public searchUsers(query: string, options?: RawAxiosRequestConfig) {
        return UserManagementApiFp(this.configuration).searchUsers(query, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Updates the profile image URL for the authenticated user
     * @summary Update profile image
     * @param {number} id 
     * @param {string} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserManagementApi
     */
    public updateProfileImage(id: number, body: string, options?: RawAxiosRequestConfig) {
        return UserManagementApiFp(this.configuration).updateProfileImage(id, body, options).then((request) => request(this.axios, this.basePath));
    }
}

