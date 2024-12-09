import { AuthenticationControllerApi } from "./apis/authentication-controller-api";
import { Configuration } from "./configuration";
import { API_URL } from "@/config/vars";
import { jwtDecode } from "jwt-decode";

const isTokenAboutToExpire = (
  token: string,
  thresholdInSeconds: number = 60
): boolean => {
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp - currentTime <= thresholdInSeconds;
};

const getAccessToken = (): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN_KEY");
    if (!accessToken) {
      return resolve("");
    }

    if (!isTokenAboutToExpire(accessToken)) {
      return resolve(accessToken);
    }

    const refreshToken = localStorage.getItem("REFRESH_TOKEN_KEY");
    if (!refreshToken) {
      return resolve("");
    }
    try {
      const refreshedData = await apis().auth.refresh(refreshToken + "42");
      if (refreshedData.status === 200) {
        localStorage.setItem(
          "ACCESS_TOKEN_KEY",
          refreshedData.data.accessToken
        );
        localStorage.setItem(
          "REFRESH_TOKEN_KEY",
          refreshedData.data.refreshToken
        );
        return resolve(refreshedData.data.accessToken);
      }
    } catch (error) {
      return resolve("");
    }
    return resolve("");
  });

const Api = () => {
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
