class ShopifyService {
  constructor() {
    this.shop = process.env.SHOPIFY_SHOP;
    this.token = process.env.SHOPIFY_ADMIN_TOKEN;
    this.version = "2025-10";
  }

  get headers() {
    return {
      "X-Shopify-Access-Token": this.token,
      "Content-Type": "application/json",
    };
  }

  buildUrl(path, params = {}) {
    const url = new URL(
      `https://${this.shop}/admin/api/${this.version}${path}`
    );

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    return url.toString();
  }

  async request(url, options = {}) {
    const res = await fetch(url, {
      headers: {
        ...this.headers,
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Shopify API error ${res.status}: ${text}`
      );
    }

    // Shopify kadang return empty body (204)
    if (res.status === 204) return null;

    return res.json();
  }

  /**
   * GET customer by email
   * GET /customers/search.json?email=
   */
  async getCustomerByEmail(email) {
    const url = this.buildUrl(
      "/customers/search.json",
      { email }
    );

    const data = await this.request(url, { method: "GET" });
    return data.customers?.[0] || null;
  }

  /**
   * GET discourse_point metafield
   * GET /customers/{id}/metafields.json?key=discourse_point
   */
  async getDiscoursePointMetafield(customerId) {
    const url = this.buildUrl(
      `/customers/${customerId}/metafields.json`,
      { key: "discourse_point" }
    );

    const data = await this.request(url, { method: "GET" });
    return data.metafields?.[0] || null;
  }

  /**
   * UPDATE discourse_point value
   * PUT /metafields/{metafield_id}.json
   */
  async updateDiscoursePoint(metafieldId, newValue) {
    const url = this.buildUrl(
      `/metafields/${metafieldId}.json`
    );

    return this.request(url, {
      method: "PUT",
      body: JSON.stringify({
        metafield: {
          id: metafieldId,
          value: newValue,
          type: "number_integer",
        },
      }),
    });
  }

  /**
   * CREATE discourse_point if not exists
   */
  async createDiscoursePoint(customerId, value) {
    const url = this.buildUrl(
      `/customers/${customerId}/metafields.json`
    );

    return this.request(url, {
      method: "POST",
      body: JSON.stringify({
        metafield: {
          namespace: "custom",
          key: "discourse_point",
          type: "number_integer",
          value,
        },
      }),
    });
  }
}

export default new ShopifyService();
