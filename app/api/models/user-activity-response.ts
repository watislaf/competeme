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


// May contain unused imports in some cases
// @ts-ignore
import type { ActivityResponse } from './activity-response';
// May contain unused imports in some cases
// @ts-ignore
import type { RecentActivityResponse } from './recent-activity-response';

/**
 * 
 * @export
 * @interface UserActivityResponse
 */
export interface UserActivityResponse {
    /**
     * 
     * @type {Array<ActivityResponse>}
     * @memberof UserActivityResponse
     */
    'available': Array<ActivityResponse>;
    /**
     * 
     * @type {Array<RecentActivityResponse>}
     * @memberof UserActivityResponse
     */
    'recent': Array<RecentActivityResponse>;
}

