import crypto from "crypto";

/**
 * Verify Discourse webhook signature
 * @param {string} rawBody
 * @param {string} signature
 * @param {string} secret
 * @returns {boolean}
 */
export function verifyDiscourseSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return signature === expected;
}
