/* -------------------------------

以下に自動実行される関数を記載してください。
require や importといった追加モジュールのインストール、fs等ファイルシステムへ変更を加える処理は実行されません。

------------------------------- */

const NODE = "https://mikun-testnet.tk:3001";

const source = `
const sdk = arguments[0];
  
const account = sdk.Account.generateNewAccount(sdk.NetworkType.TEST_NET);
return account.address.plain();
`;

/* -------------------------------

以下は編集しないでください。
出力結果の AST 文字列を Symbol Transfer Transaction の message にそのまま格納してください。
環境変数 PRIVATEKEY を指定することでトランザクションの作成も自動的に行います。

------------------------------- */

const { parse } = require("@babel/parser");
const { default: generator } = require("@babel/generator");
const sdk = require("symbol-sdk");
const rxjs = require("rxjs");
const dotenv = require("dotenv");
dotenv.config();

(async () => {
  const repo = new sdk.RepositoryFactoryHttp(NODE);
  const receiptHttp = repo.createReceiptRepository();
  const transactionHttp = repo.createTransactionRepository();
  const listener = repo.createListener();
  const transactionService = new sdk.TransactionService(
    transactionHttp,
    receiptHttp
  );

  const networkType = await repo.getNetworkType().toPromise();
  const generationHash = await repo.getGenerationHash().toPromise();
  const epochAdjustment = await repo.getEpochAdjustment().toPromise();

  const ast = parse(`const _ = () => {${source}}`);
  const code = generator(ast, { minified: true }).code;

  const account = sdk.Account.createFromPrivateKey(
    process.env.PRIVATEKEY,
    networkType
  );
  const transacton = sdk.TransferTransaction.create(
    sdk.Deadline.create(epochAdjustment),
    sdk.Address.createFromRawAddress("TDWBA6L3CZ6VTZAZPAISL3RWM5VKMHM6J6IM3LY"),
    [],
    sdk.PlainMessage.create(code),
    networkType
  ).setMaxFee(100);
  const signedTx = account.sign(transacton, generationHash);

  listener.open().then(async () => {
    try {
      await rxjs.firstValueFrom(
        rxjs.merge(
          transactionService.announce(signedTx, listener),
          listener.status(account.address).pipe(
            rxjs.filter((error) => error.hash === signedTx.hash),
            rxjs.tap((error) => {
              throw new Error(error.code);
            })
          )
        )
      );
      console.log(`https://testnet.symbol.fyi/transactions/${signedTx.hash}`);
      listener.close();
    } catch (err) {
      console.error(err);
    }
  });
})();
