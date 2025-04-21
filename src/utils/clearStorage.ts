import { deleteCookie } from "cookies-next";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const clearStorage = () => {
  deleteCookie(ACCESS_TOKEN);
  deleteCookie(REFRESH_TOKEN);
};

export { clearStorage };
