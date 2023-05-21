const fdk = require("@fnproject/fdk");
const sdk = require("symbol-sdk");
const parser = require("@babel/parser");
const { default: generator } = require("@babel/generator");

fdk.handle(async function (input) {
  // ここで該当トランザクションのbodyを取得する
  const hash = input.hash;
  const res = await fetch(
    `https://mikun-testnet.tk:3001/transactions/confirmed/${hash}`
  );
  const json = await res.json();
  const payload = sdk.MessageFactory.createMessageFromHex(
    json.transaction.message
  ).payload;

  const ast = parser.parse(payload, undefined);
  const code = generator(ast.program.body[0].declarations[0].init.body).code;

  // トランザクションbodyのjsをパースする
  const result = Function(`
"use strict;"
const sdk = arguments[0]

${code}
`)(sdk);

  return { message: result };
});
