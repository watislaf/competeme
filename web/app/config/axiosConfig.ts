import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) {
      throw new Error("Access Denied");
    }
  },
);
