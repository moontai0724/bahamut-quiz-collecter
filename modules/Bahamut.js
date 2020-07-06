import axios from "axios";
import fs from "fs";

var cookies = JSON.parse(fs.readFileSync("./cookie.json"));

export default {
  /**
   * To submit requests with cookies and specific user-agent.
   * @param {String} method GET, POST etc...
   * @param {String} url target url to request
   * @param {JSON} params parameters in get url
   * @param {JSON} data data in post
   * @returns {Promise} Response of axios.
   */
  async submit(method, url, params, data) {
    return axios({
      method: method,
      url: url,
      withCredentials: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        cookie: [
          `BAHAENUR=${cookies.BAHAENUR}`,
          `BAHARUNE=${cookies.BAHARUNE}`,
        ].join(";"),
      },
      data: data,
      params: params,
    }).then((response) => {
      response.headers["set-cookie"].forEach((cookie) => {
        let [key, value] = cookie.split(";")[0].split("=");
        cookies[key] = value;
      });
      fs.writeFileSync("./cookie.json", JSON.stringify(cookies));
      return response;
    });
  },
  /**
   * To check BAHARNUR & BAHARUNE is valid to perform member actions or not.
   * @returns {Promise<Boolean>} is logged in or not.
   */
  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.submit("POST", "https://home.gamer.com.tw/setting.php").then(
        (response) => {
          resolve(response.data.includes("會員登入") === false);
        },
        reject
      );
    });
  },
};
