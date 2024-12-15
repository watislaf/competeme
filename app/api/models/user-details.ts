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
import type { GrantedAuthority } from './granted-authority';

/**
 * 
 * @export
 * @interface UserDetails
 */
export interface UserDetails {
    /**
     * 
     * @type {boolean}
     * @memberof UserDetails
     */
    'enabled'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof UserDetails
     */
    'password'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserDetails
     */
    'username'?: string;
    /**
     * 
     * @type {Array<GrantedAuthority>}
     * @memberof UserDetails
     */
    'authorities'?: Array<GrantedAuthority>;
    /**
     * 
     * @type {boolean}
     * @memberof UserDetails
     */
    'accountNonExpired'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserDetails
     */
    'accountNonLocked'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserDetails
     */
    'credentialsNonExpired'?: boolean;
}

