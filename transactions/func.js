"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fdk_1 = __importDefault(require("@fnproject/fdk"));
const symbol_sdk_1 = require("symbol-sdk");
function getSymbolNetwork(networkType) {
    if (networkType === 104) {
        return {
            generationHash: "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6",
            epochAdjustment: 1615853185,
        };
    }
    else if (networkType === 152) {
        return {
            generationHash: "49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4",
            epochAdjustment: 1667250467,
        };
    }
    else {
        throw new Error("Incorrect network type specified");
    }
}
function handle(input) {
    var _a;
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
    const transaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(config.epochAdjustment), symbol_sdk_1.Address.createFromRawAddress(input.recipientAddress), [new symbol_sdk_1.Mosaic(new symbol_sdk_1.NamespaceId("symbol.xym"), symbol_sdk_1.UInt64.fromUint((_a = input.amount) !== null && _a !== void 0 ? _a : 0 * Math.pow(10, 6)))], input.message ? symbol_sdk_1.PlainMessage.create(input.message) : symbol_sdk_1.EmptyMessage, input.networkType);
    return {
        v: 3,
        type: 3,
        chain_id: config.generationHash,
        network_id: input.networkType,
        payload: transaction.serialize(),
    };
}
fdk_1.default.handle(handle);
