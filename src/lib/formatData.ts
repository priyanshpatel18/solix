export function formatData(data: any): any {
  switch (data.type) {
    case "TRANSFER":
      return {
        type: data.type,
        slot: data.slot,
        signature: data.signature,
        feePayer: data.feePayer,
        fee: data.fee,
        description: data.description,
        accountData: data.accountData,
        instructions: data.instructions,
      };
    default:
      console.warn(`Unknown data type: ${data.type}`);
      return {
        type: data.type,
        rawData: data,
      };
  }
}
