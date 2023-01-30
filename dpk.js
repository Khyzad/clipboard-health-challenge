const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const sha3_512_hash = crypto.createHash("sha3-512");
  const HEX = "hex";
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (event) {

    // return the partitionKey if valid and present, otherwise return a new hash
    let candidate = event.partitionKey;
    if (candidate) {

      // sanitize the paritionKey if necessary
      if (typeof candidate !== "string") {
        candidate = JSON.stringify(event.partitionKey);
      }

      // generate a new partitionKey if the current partitionKey is too long
      if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = sha3_512_hash.update(candidate).digest(HEX);
      }

    } else {
      // if there's no partition key, stringify the entire object hash it
      candidate = sha3_512_hash.update(JSON.stringify(event)).digest(HEX)
    }

    return candidate;
  }

  return TRIVIAL_PARTITION_KEY;
};