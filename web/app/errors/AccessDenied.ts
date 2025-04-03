export class AccessDenied extends Error {
  response: { status: number };

  constructor() {
    super("Access Denied");
    this.name = "Access Denied";
    this.response = {
      status: 403,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAccessDenied = (error: any): error is AccessDenied => {
  return error?.response?.status === 403;
};
