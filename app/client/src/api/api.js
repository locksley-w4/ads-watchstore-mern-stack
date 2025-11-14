import axios from "axios";
// import process from "process";

const NODE_ENV = "development";

export const baseURL =
  NODE_ENV === "production" ? "" : "http://localhost:5000";

export const baseAPIURL = `${baseURL}/api/v1`;

export const api = axios.create({ baseURL: baseAPIURL, withCredentials: true });
