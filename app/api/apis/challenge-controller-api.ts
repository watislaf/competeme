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
import type { ChallengeRequest } from '../models';
// @ts-ignore
import type { ChallengeResponse } from '../models';
/**
 * ChallengeControllerApi - axios parameter creator
 * @export
 */
export const ChallengeControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} userId 
         * @param {ChallengeRequest} challengeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addChallenge: async (userId: number, challengeRequest: ChallengeRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('addChallenge', 'userId', userId)
            // verify required parameter 'challengeRequest' is not null or undefined
            assertParamExists('addChallenge', 'challengeRequest', challengeRequest)
            const localVarPath = `/api/v1/users/{userId}/challenges/`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JwtAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(challengeRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChallenges: async (userId: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('getChallenges', 'userId', userId)
            const localVarPath = `/api/v1/users/{userId}/challenges/`
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
         * @param {number} userId 
         * @param {number} challengeId 
         * @param {number} progress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateProgress: async (userId: number, challengeId: number, progress: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            assertParamExists('updateProgress', 'userId', userId)
            // verify required parameter 'challengeId' is not null or undefined
            assertParamExists('updateProgress', 'challengeId', challengeId)
            // verify required parameter 'progress' is not null or undefined
            assertParamExists('updateProgress', 'progress', progress)
            const localVarPath = `/api/v1/users/{userId}/challenges/{challengeId}/progress`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)))
                .replace(`{${"challengeId"}}`, encodeURIComponent(String(challengeId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication JwtAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (progress !== undefined) {
                localVarQueryParameter['progress'] = progress;
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
 * ChallengeControllerApi - functional programming interface
 * @export
 */
export const ChallengeControllerApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ChallengeControllerApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {number} userId 
         * @param {ChallengeRequest} challengeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addChallenge(userId: number, challengeRequest: ChallengeRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addChallenge(userId, challengeRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ChallengeControllerApi.addChallenge']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChallenges(userId: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ChallengeResponse>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getChallenges(userId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ChallengeControllerApi.getChallenges']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} userId 
         * @param {number} challengeId 
         * @param {number} progress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateProgress(userId: number, challengeId: number, progress: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateProgress(userId, challengeId, progress, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ChallengeControllerApi.updateProgress']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * ChallengeControllerApi - factory interface
 * @export
 */
export const ChallengeControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ChallengeControllerApiFp(configuration)
    return {
        /**
         * 
         * @param {number} userId 
         * @param {ChallengeRequest} challengeRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addChallenge(userId: number, challengeRequest: ChallengeRequest, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.addChallenge(userId, challengeRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChallenges(userId: number, options?: RawAxiosRequestConfig): AxiosPromise<Array<ChallengeResponse>> {
            return localVarFp.getChallenges(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} userId 
         * @param {number} challengeId 
         * @param {number} progress 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateProgress(userId: number, challengeId: number, progress: number, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.updateProgress(userId, challengeId, progress, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ChallengeControllerApi - object-oriented interface
 * @export
 * @class ChallengeControllerApi
 * @extends {BaseAPI}
 */
export class ChallengeControllerApi extends BaseAPI {
    /**
     * 
     * @param {number} userId 
     * @param {ChallengeRequest} challengeRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChallengeControllerApi
     */
    public addChallenge(userId: number, challengeRequest: ChallengeRequest, options?: RawAxiosRequestConfig) {
        return ChallengeControllerApiFp(this.configuration).addChallenge(userId, challengeRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChallengeControllerApi
     */
    public getChallenges(userId: number, options?: RawAxiosRequestConfig) {
        return ChallengeControllerApiFp(this.configuration).getChallenges(userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} userId 
     * @param {number} challengeId 
     * @param {number} progress 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ChallengeControllerApi
     */
    public updateProgress(userId: number, challengeId: number, progress: number, options?: RawAxiosRequestConfig) {
        return ChallengeControllerApiFp(this.configuration).updateProgress(userId, challengeId, progress, options).then((request) => request(this.axios, this.basePath));
    }
}
