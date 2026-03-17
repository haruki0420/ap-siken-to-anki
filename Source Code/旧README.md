**AP Siken to Anki** is a Tampermonkey userscript designed to supercharge your study workflow for the Applied Information Technology Engineer Examination (応用情報技術者試験).

With just a single click or keyboard shortcut, you can effortlessly export questions, choices, images, and detailed explanations from [*ap-siken.com*](http://ap-siken.com/) straight into your Anki deck.

---

## 📌 概要 (Overview)

[応用情報技術者試験ドットコム（過去問道場）](https://www.ap-siken.com/apkakomon.php) の問題を、ワンクリックで単語帳アプリ「Anki」へエクスポートする強力なTampermonkeyスクリプトです。学習の記録と反復復習の効率を最大化します。

### ✨ 主な機能 (Features)

- 🚀 **ワンクリック送信:** 画面のボタン、または `Shift + Enter` で即座にAnkiへ送信。
- 🖼️ **画像の完全サポート:** 問題や選択肢の画像を自動検出し、Ankiにダウンロードして綺麗に配置。
- 🔄 **スマートな上書き更新 (Upsert):** Ankiデッキを自動検索。既に問題が存在する場合は重複させず、最新の情報とレイアウトでカードを賢く更新します。
- 🏷️ **自動タグ付け:** 出題時期（例: `令和4年秋期_問6`）やカテゴリー（`テクノロジ系`, `データベース`）を自動でタグ付け。
- 💅 **モダンなカードデザイン:** 独立した選択肢カードや、ソースコードの等幅グレー枠など、視認性に優れた専用のHTML/CSSテンプレートを同梱。

---

## 📦 ファイル構成 (Files)

- `ap-siken-to-anki.user.js` : Tampermonkeyに登録するスクリプト本体
- `anki_front.html` : Ankiカード（表面）のHTMLテンプレート
- `anki_back.html` : Ankiカード（裏面）のHTMLテンプレート
- `anki_style.css` : Ankiカードのデザイン設定(CSS)

---

## ⚙️ 導入手順 (Setup Guide)

このツールを使うには、PC版のAnkiアプリとブラウザ拡張機能が必要です。

### Step 1: 必要なツールのインストール

1. [Anki PC版](https://apps.ankiweb.net/) をインストールして起動します。
2. Ankiにアドオン [AnkiConnect (2055492159)](https://ankiweb.net/shared/info/2055492159) をインストールします。
3. ブラウザ（Chrome / Edgeなど）に拡張機能 [Tampermonkey](https://www.tampermonkey.net/) をインストールします。

### Step 2: AnkiConnectの通信許可 (CORS設定)

過去問道場のサイトからAnkiへデータを送れるように設定します。

1. Ankiの `ツール` > `アドオン` から AnkiConnect を選び、`設定` をクリック。
2. `webCorsOriginList` の項目に過去問道場のURLを追加し、以下のようにします。

```json
"webCorsOriginList": [
  "<http://localhost>",
  "[<https://www.ap-siken.com>](<https://www.ap-siken.com>)"
]
```

設定を保存し、Ankiアプリを再起動します。

### Step 3: Ankiの「ノートタイプ」を作成する

Ankiの ツール > ノートタイプを管理 > 追加 から Basic (基本) を元に新しいノートタイプを作成し、名前を 「AP過去問モデル」 にします。

作成したモデルを選択して フィールド をクリックし、以下の7つのフィールドを正確な名前で作成します。（最初からある「表面」「裏面」は削除してください）

問題

選択肢ア

選択肢イ

選択肢ウ

選択肢エ

正解

解説

### Step 4: デザイン（テンプレート）の適用

「AP過去問モデル」の カード ボタンをクリックし、本リポジトリのコードをコピペします。

表面のテンプレート: anki_front.html の中身を貼り付け

裏面のテンプレート: anki_back.html の中身を貼り付け

書式（スタイル）: anki_style.css の中身を貼り付け

### Step 5: スクリプトの登録

Tampermonkeyのアイコンをクリックし 新規スクリプトを追加 を選択。

エディタの中身をすべて消し、ap-siken-to-anki.user.js のコードを丸ごと貼り付けます。

コード内にある "deckName": "応用情報技術者試験" の部分を、ご自身のAnkiのデッキ名に合わせて変更し、保存（Ctrl+S）します。

## 🎮 使い方 (Usage)

Ankiアプリを起動した状態にしておきます（バックグラウンドでOK）。

過去問道場を開き、問題を解いて**「解説」が表示されている状態**にします。

画面右下の 「Ankiへ送信」 ボタンをクリックするか、キーボードの Shift + Enter を押します。

送信完了のアラートが出れば、Ankiへの登録は成功です！

## ⚠️ 免責事項 (Disclaimer)

本スクリプトは個人の学習を効率化する目的で作成された非公式のツールです。

応用情報技術者試験ドットコム 様のサイト仕様が変更された場合、正常に動作しなくなる可能性があります。

サイト管理者の著作権を尊重し、取得したデータを含むAnkiのデッキ（.apkg）を不特定多数へ再配布・公開する行為はおやめください。

# こちらは旧版です。現在のREADMEを閲覧してください。