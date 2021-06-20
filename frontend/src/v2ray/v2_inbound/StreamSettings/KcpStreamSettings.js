export class KcpStreamSettings extends V2CommonClass {
  constructor(
    mtu = 1350,
    tti = 20,
    uplinkCapacity = 5,
    downlinkCapacity = 20,
    congestion = false,
    readBufferSize = 2,
    writeBufferSize = 2,
    type = "none",
    seed = randomString(10)
  ) {
    super();
    this.mtu = mtu;
    this.tti = tti;
    this.upCap = uplinkCapacity;
    this.downCap = downlinkCapacity;
    this.congestion = congestion;
    this.readBuffer = readBufferSize;
    this.writeBuffer = writeBufferSize;
    this.type = type;
    this.seed = seed;
  }

  static fromJson(json = {}) {
    return new KcpStreamSettings(
      json.mtu,
      json.tti,
      json.uplinkCapacity,
      json.downlinkCapacity,
      json.congestion,
      json.readBufferSize,
      json.writeBufferSize,
      isEmpty(json.header) ? "none" : json.header.type,
      json.seed
    );
  }

  toJson() {
    return {
      mtu: this.mtu,
      tti: this.tti,
      uplinkCapacity: this.upCap,
      downlinkCapacity: this.downCap,
      congestion: this.congestion,
      readBufferSize: this.readBuffer,
      writeBufferSize: this.writeBuffer,
      header: {
        type: this.type,
      },
      seed: this.seed,
    };
  }
}