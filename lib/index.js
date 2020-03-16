"use strict";
const https = require("https");
const c = require("centra");

module.exports = class smsorange {
  constructor(client_credentials) {
    this.client_credentials = client_credentials;
    this.token = {
      access_token: false,
      expires_in: 0
    };
  }

  /**
   * Generate Acces Token
   **/
  async sendRequest(uri, method = "GET", body = {}) {
    if (
      !this.token.access_token ||
      new Date().getTime > this.token.expiriationTimestamp
    ) {
      await this.generateToken();
    }

    let res = await c(uri, method)
      .header("Authorization", `Bearer ${this.token.access_token}`)
      .body(body, "json")
      .send();
    if (res.statusCode > 300) {
      throw new Error(res.body);
    }
    return JSON.parse(res.body);
  }

  /**
   * Generate Acces Token
   **/
  async generateToken() {
    let res = await c("https://api.orange.com/oauth/v2/token", "POST")
      .header("Authorization", `Basic ${this.client_credentials}`)
      .body(
        {
          grant_type: "client_credentials"
        },
        "form"
      )
      .send();
    this.token = JSON.parse(res.body);
    this.token.expiriationTimestamp =
      new Date().getTime() + this.token.expires_in;
    if (res.statusCode > 300) {
      throw new Error(res.body);
    }
  }

  /**
   * Get API Statistics
   **/
  async getStatistics() {
    return await this.sendRequest(
      "https://api.orange.com/sms/admin/v1/statistics"
    );
  }

  /**
   * Get SMS Balence
   **/
  async getBalence() {
    return this.sendRequest("https://api.orange.com/sms/admin/v1/contracts");
  }

  /**
   * Send SMS To Number
   **/
  async sendSms(number, message) {
    let senderAddress = number.slice(0, 4);

    let body = {
      outboundSMSMessageRequest: {
        address: `tel:${number}`,
        senderAddress: `tel:${senderAddress}0000`,
        outboundSMSTextMessage: {
          message: message
        }
      }
    };

    return await this.sendRequest(
      "https://api.orange.com/smsmessaging/v1/outbound/tel:+2250000/requests",
      "POST",
      body
    );
  }
};
