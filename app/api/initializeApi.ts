import globalAxios from "axios";
import { AuthenticationControllerApi } from "./apis/authentication-controller-api";
import { Configuration } from "./configuration";
import { API_URL } from "@/config/vars";

export class NoAccess extends Error {}

const getAccessToken = (): Promise<string> =>
  new Promise((resolve) => {
    return resolve(localStorage.getItem("ACCESS_TOKEN_KEY") || "");
    // if (!getLocalAccessTokenExp()) {
    //   resolve("");
    // }
    //
    // const maxRequestTimeSec = 10;
    // console.log(getLocalAccessTokenExp());
    //
    // const restTime =
    //   +(getLocalAccessTokenExp() || 0) - Date.now() / 1000 - maxRequestTimeSec;
    //
    // if (restTime <= 0) {
    //   const refreshToken = getLocalRefreshToken();
    //
    //   apis()
    //     .auth.refresh({ refreshToken })
    //     .then(({ data }) => {
    //       setToken(data);
    //       resolve(getLocalAccessToken());
    //     })
    //     .catch((_) => resolve(""));
    // } else {
    //   resolve(getLocalAccessToken());
    // }
  });

export const Api = () => {
  const configuration = new Configuration({
    basePath: API_URL,
    accessToken: getAccessToken,
    baseOptions: {
      timeout: 5000,
    },
  });

  return {
    auth: new AuthenticationControllerApi(configuration),
  };
};

let _apis: ReturnType<typeof Api>;

export const apis = () => {
  if (!_apis) {
    _apis = Api();
  }

  return _apis;
};
