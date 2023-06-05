import fdk from "@fnproject/fdk";
import {
  Address,
  Deadline,
  EmptyMessage,
  Mosaic,
  NamespaceId,
  PlainMessage,
  TransferTransaction,
  UInt64,
} from "symbol-sdk";

interface Props {
  recipientAddress: string;
  networkType: 104 | 152;
  amount: number;
  message: string;
}

interface Response {
  v: number;
  type: number;
  network_id: number;
  chain_id: string;
  data: {
    payload: string;
  };
}

function getSymbolNetwork(networkType: 104 | 152) {
  if (networkType === 104) {
    return {
      generationHash: "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6",
      epochAdjustment: 1615853185,
    };
  } else if (networkType === 152) {
    return {
      generationHash: "49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4",
      epochAdjustment: 1667250467,
    };
  } else {
    throw new Error("Incorrect network type specified");
  }
}

function handle(input: Props): Response {
  if (!input.networkType) {
    throw new Error("networkType is not defined");
  }

  if (!input.recipientAddress) {
    throw new Error("recipientAddress is not defined");
  }

  if (typeof input.amount !== "number") {
    throw new Error("amount is required number");
  }

  const config = getSymbolNetwork(input.networkType);
  const transaction = TransferTransaction.create(
    Deadline.create(config.epochAdjustment),
    Address.createFromRawAddress(input.recipientAddress),
    [new Mosaic(new NamespaceId("symbol.xym"), UInt64.fromUint(input.amount ?? 0 * Math.pow(10, 6)))],
    input.message ? PlainMessage.create(input.message) : EmptyMessage,
    input.networkType
  );

  return {
    v: 3,
    type: 3,
    chain_id: config.generationHash,
    network_id: input.networkType,
    data: {
      payload: transaction.serialize(),
    },
  };
}

fdk.handle(handle);
