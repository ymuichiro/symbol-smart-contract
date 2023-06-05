const sym = require("symbol-sdk");
const dotenv = require("dotenv");
dotenv.config();

(async () => {
  const NODE = "https://mikun-testnet.tk:3001";
  const repo = new sym.RepositoryFactoryHttp(NODE);
  const networkType = await repo.getNetworkType().toPromise();
  const generationHash = await repo.getGenerationHash().toPromise();
  const epochAdjustment = await repo.getEpochAdjustment().toPromise();

  const account = sym.Account.createFromPrivateKey(
    process.env.PRIVATEKEY,
    networkType
  );

  const tx = sym.TransferTransaction.create(
    sym.Deadline.create(epochAdjustment),
    sym.Address.createFromRawAddress("TDWBA6L3CZ6VTZAZPAISL3RWM5VKMHM6J6IM3LY"),
    [],
    sym.RawMessage.create(Buffer.from("Hello").toString("hex")),
    networkType
  ).setMaxFee(100);

  const signed = account.sign(tx, generationHash);
  // アナウンスしたものとする
  const trtx = sym.TransferTransaction.createFromPayload(signed.payload);
  // 読み取り
  console.log(
    "RawObje",
    sym.RawMessage.create(Buffer.from("Hello").toString("hex")).payload
  );
  console.log("RawMessage", trtx.message.payload);
  console.log(Buffer.from(trtx.message.payload, "hex").toString("utf-8"));
})();

function toUint8Arryay(buffer) {
  var view = new Uint8Array(buffer.length);
  for (var i = 0; i < buffer.length; ++i) view[i] = buffer[i];
  return view;
}
