const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Generates a sha3-512 hash if an event is passed", () => {
    const partitionKey = deterministicPartitionKey({});
    expect(partitionKey).toBe("c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862");
  });

  it("Generates a sha3-512 hash if the provided partition key is too long", () => {
    const partitionKey = deterministicPartitionKey({ partitionKey: "c180000024050492020402945824597289572857189710841402e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862c180000024050492020402945824597289572857189710841402e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862" });
    expect(partitionKey).toBe("95ce733c635d07df3b3356f78e0e8e7b60c5429d46eb2a3e3809247044b1f8f19ccf21e284caad2a3f19342e12656dd413ffe45859ab451d215f8bfd24006a3f");
  });

  it("Generates a sha3-512 hash even if partitionKey is not a string", () => {
    const partitionKey = deterministicPartitionKey({ partitionKey: 1 });
    expect(partitionKey).toBe("1");
  });
});