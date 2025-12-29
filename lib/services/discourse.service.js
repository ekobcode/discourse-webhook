class DiscourseService {
  constructor() {
    this.baseUrl = process.env.DISCOURSE_BASE_URL;
    this.apiKey = process.env.DISCOURSE_API_KEY;
    this.apiUser = process.env.DISCOURSE_API_USER;
  }

  async getUserEmailById(username) {
    const res = await fetch(
      `${this.baseUrl}/u/${username}/emails.json`,
      {
        method: "GET",
        headers: {
          "Api-Key": this.apiKey,
          "Api-Username": this.apiUser,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Discourse API error ${res.status}: ${text}`
      );
    }

    const data = await res.json();
    return data.email;
  }
}

export default new DiscourseService();
