const axios = require("axios");

class ShopifyService {
    constructor() {
        this.shop = process.env.SHOPIFY_SHOP;
        this.token = process.env.SHOPIFY_ADMIN_TOKEN;
        this.version = "2025-10";
    }

    get headers() {
        return {
            "X-Shopify-Access-Token": this.token,
            "Content-Type": "application/json"
        };
    }

    /**
     * GET customer by email
     * GET /customers/search.json?email=
     */
    async getCustomerByEmail(email) {
        const res = await axios.get(
            `https://${this.shop}/admin/api/${this.version}/customers/search.json`,
            {
                headers: this.headers,
                params: { email }
            }
        );

        return res.data.customers?.[0] || null;
    }

    /**
     * GET discourse_point metafield
     * GET /customers/{id}/metafields.json?key=discourse_point
     */
    async getDiscoursePointMetafield(customerId) {
        const res = await axios.get(
            `https://${this.shop}/admin/api/${this.version}/customers/${customerId}/metafields.json`,
            {
                headers: this.headers,
                params: { key: "discourse_point" }
            }
        );

        return res.data.metafields?.[0] || null;
    }

    /**
     * UPDATE discourse_point value
     * PUT /metafields/{metafield_id}.json
     */
    async updateDiscoursePoint(metafieldId, newValue) {
        return axios.put(
            `https://${this.shop}/admin/api/${this.version}/metafields/${metafieldId}.json`,
            {
                metafield: {
                    id: metafieldId,
                    value: newValue,
                    type: "number_integer"
                }
            },
            { headers: this.headers }
        );
    }

    /**
     * CREATE discourse_point if not exists
     */
    async createDiscoursePoint(customerId, value) {
        return axios.post(
            `https://${this.shop}/admin/api/${this.version}/customers/${customerId}/metafields.json`,
            {
                metafield: {
                    namespace: "custom",
                    key: "discourse_point",
                    type: "number_integer",
                    value
                }
            },
            { headers: this.headers }
        );
    }
}

module.exports = new ShopifyService();
