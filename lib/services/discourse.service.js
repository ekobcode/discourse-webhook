const axios = require("axios");

class DiscourseService {
  constructor() {
    this.baseUrl = process.env.DISCOURSE_BASE_URL;
    this.apiKey = process.env.DISCOURSE_API_KEY;
    this.apiUser = process.env.DISCOURSE_API_USER;
  }

  async getUserEmailById(username) {
    const res = await axios.get(
      `${this.baseUrl}/u/${username}/emails.json`,
      {
        headers: {
          "Api-Key": this.apiKey,
          "Api-Username": this.apiUser
        }
      }
    );

    return res.data.email;
  }
}

module.exports = new DiscourseService();
