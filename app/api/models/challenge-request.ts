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



/**
 * 
 * @export
 * @interface ChallengeRequest
 */
export interface ChallengeRequest {
    /**
     * 
     * @type {string}
     * @memberof ChallengeRequest
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof ChallengeRequest
     */
    'description': string;
    /**
     * 
     * @type {number}
     * @memberof ChallengeRequest
     */
    'goal': number;
    /**
     * 
     * @type {string}
     * @memberof ChallengeRequest
     */
    'unit': string;
    /**
     * 
     * @type {Array<number>}
     * @memberof ChallengeRequest
     */
    'participants': Array<number>;
}

