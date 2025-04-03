import { jwtDecode, JwtPayload } from "jwt-decode";

export const extractIdFromToken = (token: string) => {
  return jwtDecode<JwtPayload>(token).sub;
};
