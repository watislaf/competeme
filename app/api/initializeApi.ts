import { AuthenticationControllerApi } from "./apis/authentication-controller-api";
import { Configuration } from "./configuration";
import { API_URL } from "@/config/vars";
import { jwtDecode } from "jwt-decode";
import { UserControllerApi } from "@/api/apis/user-controller-api";
import { ActivityControllerApi } from "@/api/apis/activity-controller-api";
import { ChallengeControllerApi } from "@/api/apis/challenge-controller-api";
import { FriendshipControllerApi } from "@/api";

const isTokenAboutToExpire = (
  token: string,
  thresholdInSeconds: number = 60
): boolean => {
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp - currentTime <= thresholdInSeconds;
};

const getAccessToken = (): Promise<string> =>
  new Promise(async (resolve) => {
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
      timeout: 5000
    }
  });

  return {
    auth: new AuthenticationControllerApi(configuration),
    user: new UserControllerApi(configuration),
    challenge: new ChallengeControllerApi(configuration),
    activity: new ActivityControllerApi(configuration),
    friends: new FriendshipControllerApi(configuration)
  };
};

let _apis: ReturnType<typeof Api>;

export const apis = () => {
  if (!_apis) {
    _apis = Api();
  }

  return _apis;
};
