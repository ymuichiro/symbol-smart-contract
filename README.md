## 利用手順

1. Symbol Blockchain に書き込む js ファイルを作成します。
2. js ファイルを `./playground/editor.js` 内へ記載します。
3. `node ./playground/editor.js` を実行し、出力された json データを Symbol の transfer transaction の本文に記載してください。

## 安全性の検討

### サーバー内で悪意のあるファイル書き換え、更新

- 実行環境を fn-project のコンテナ内とし、ファイルへの書き込み権限は全て削除とする
- コンテナ内のファイルは全て READ-ONLY
- コンテナの外で実行されている symbol-bootstrap 等へのアクセス権限は無し

### 悪意のあるスクリプトの発生防止

- 以下の通り js コードは Function コンストラクタ内にて実行され、 import や require は実行されない。

```javascript
Function(`
"use strict;"
const sdk = arguments[0]
`)(sdk);
```

- トランザクションボディの js スクリプトは AST 形式で取得され、スクリプトの実行時に bebel/traverse により再起的に検証が行われ、今後悪意のあるソースコードパターンは前述の箇所で検証を行う
- symbol-sdk は Function コンストラクタ内へ引数として渡され `arguments[0]` からのみ取得可能とする
