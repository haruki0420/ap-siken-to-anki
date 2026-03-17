# AP Siken to Anki 🚀

**AP Siken to Anki** is a Tampermonkey userscript designed to supercharge your study workflow for the Applied Information Technology Engineer Examination (応用情報技術者試験).

With just a single click or keyboard shortcut, you can effortlessly export questions, choices, images, and detailed explanations from *ap-siken.com* straight into your Anki deck. 

---

## 📌 概要 (Overview)
[応用情報技術者試験ドットコム（過去問道場）](https://www.ap-siken.com/apkakomon.php) の問題を、ワンクリックで単語帳アプリ「Anki」へエクスポートする強力なTampermonkeyスクリプトです。

### ✨ 主な機能 (Features)
* 🚀 **ワンクリック送信:** 画面のボタン、または `Shift + Enter` で即座にAnkiへ送信。
* 🖼️ **画像の完全サポート:** 問題や選択肢の画像を自動検出し、Ankiにダウンロードして綺麗に配置。
* 🔄 **スマートな上書き更新 (Upsert):** 既に問題が存在する場合は重複させず、最新の情報とレイアウトでカードを賢く更新します。
* 🏷️ **自動タグ付け:** 出題時期（例: `令和4年秋期_問6`）やカテゴリー（`テクノロジ系`, `データベース`）を自動で付与。
* 💅 **モダンなカードデザイン:** 美しく見やすい専用のHTML/CSSテンプレートを適用済み。

---

## ⚙️ 導入手順 (Setup Guide)

難しい設定は不要です。たった3ステップで最強の学習環境が完成します。

### Step 1: 必要なツールの準備
1. [Anki PC版](https://apps.ankiweb.net/) をインストールして起動します。
2. Ankiにアドオン [AnkiConnect (2055492159)](https://ankiweb.net/shared/info/2055492159) をインストールします。
3. ブラウザ（Chrome / Edgeなど）に拡張機能 [Tampermonkey](https://www.tampermonkey.net/) をインストールします。

### Step 2: テンプレートデッキのインポート
このリポジトリにある **`AP_Siken_Template.apkg`** をダウンロードし、ダブルクリックしてAnkiに読み込ませます。
> ※ これにより、自動的に「応用情報技術者試験」という空のデッキと、専用のデザイン設定（ノートタイプ）がAnkiに追加されます。ダミーカードが1枚入っているので、不要であれば削除してください。

### Step 3: 通信許可とスクリプトの登録
1. Ankiの `ツール` > `アドオン` から AnkiConnect を選び `設定` をクリックします。
2. エディタの中身をすべて消し、以下のコードをまるごと貼り付けて保存します。その後、**Ankiアプリを必ず再起動**してください。

```json
{
    "apiKey": null,
    "apiLogPath": null,
    "ignoreOriginList": [],
    "webBindAddress": "127.0.0.1",
    "webBindPort": 8765,
    "webCorsOriginList": [
        "http://localhost",
        "[https://www.ap-siken.com](https://www.ap-siken.com)"
    ]
}
```

3. Tampermonkeyのアイコンから `新規スクリプトを追加` を選び、このリポジトリの **`ap-siken-to-anki.user.js`** のコードを丸ごとコピーして貼り付け、保存します。

**🎉 これで準備は完了です！**

---

## 🎮 使い方 (Usage)
1. Ankiアプリを起動した状態にしておきます（バックグラウンドでOK）。
2. 過去問道場を開き、問題を解いて**「解説」が表示されている状態**にします。
3. 画面右下の **「Ankiへ送信」** ボタンをクリックするか、キーボードの **`Shift + Enter`** を押します。
4. 送信完了のアラートが出れば成功です！

---

## ⚠️ 免責事項 (Disclaimer)
* 本スクリプトは個人の学習を効率化する目的で作成された非公式のツールです。
* [応用情報技術者試験ドットコム](https://www.ap-siken.com/) 様のサイト仕様が変更された場合、正常に動作しなくなる可能性があります。
* リポジトリ内で配布している`.apkg`ファイルは設定とデザインのみの空ファイルであり、過去問のテキスト・画像データ等は一切含まれていません。