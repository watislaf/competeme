export class Unauthorized extends Error {
  response: { status: number };

  constructor() {
    super("Unauthorized");
    this.name = "Unauthorized";
    this.response = {
      status: 401,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUnauthorized = (error: any): error is Unauthorized => {
  return error?.response?.status === 401;
};
