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

export const isUnauthorized = (error: any): error is Unauthorized => {
  return error?.response?.status === 401;
};
