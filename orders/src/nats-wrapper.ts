import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client)
      throw new Error("Cannot access nats client before connecting");
    return this._client;
  }

  connect(options: {
    clusterIp: string;
    clientId: string;
    url: string;
  }): Promise<void> {
    this._client = nats.connect(options.clusterIp, options.clientId, {
      url: options.url,
    });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Nats connected!");
        resolve();
      });

      this._client!.on("error", (err) => {
        console.log(err);
        reject();
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
