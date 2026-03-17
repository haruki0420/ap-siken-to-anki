// ==UserScript==
// @name         AP過去問道場 to Anki (Ultimate版 Ver 6.1)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  過去問道場の問題をAnkiに送信。既に存在する場合は最新のフォーマットで上書き更新します。
// @match        https://www.ap-siken.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement("button");
    btn.innerText = "Ankiへ送信 (Shift+Enter)";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "15px";
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
    btn.onclick = sendToAnki;
    document.body.appendChild(btn);

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            if (!btn.disabled) btn.click();
        }
    });

    async function invoke(action, params = {}) {
        const response = await fetch('http://127.0.0.1:8765', {
            method: 'POST',
            body: JSON.stringify({ action, version: 6, params })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.result;
    }

    async function getBase64FromUrl(url) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    }

    async function processNode(el) {
        if (!el) return "";
        const clone = el.cloneNode(true);
        const imgs = clone.querySelectorAll('img');
        
        for (const img of imgs) {
            const absUrl = img.src;
            if (absUrl.startsWith('data:')) continue; 
            
            const randomStr = Math.random().toString(36).substring(2, 8);
            const originalName = absUrl.substring(absUrl.lastIndexOf('/') + 1).split('?')[0];
            const filename = "ap_" + randomStr + "_" + originalName;
            
            try {
                const base64 = await getBase64FromUrl(absUrl);
                await invoke('storeMediaFile', { filename: filename, data: base64 });
                img.src = filename;
            } catch (e) {
                console.error("画像送信エラー:", e);
            }
        }
        return clone.innerHTML;
    }

    async function sendToAnki() {
        btn.disabled = true;
        btn.innerText = "処理中...";
        btn.style.backgroundColor = "#ff9800";

        try {
            const qContainer = document.createElement("div");
            let qNode = document.querySelector(".qno")?.nextElementSibling;
            while(qNode && 
                  !qNode.classList?.contains("anslink") && 
                  !qNode.classList?.contains("ansbg") && 
                  qNode.id !== "ans") {
                qContainer.appendChild(qNode.cloneNode(true));
                qNode = qNode.nextElementSibling;
            }
            let questionText = await processNode(qContainer);

            if (!questionText || questionText.trim() === "") {
                alert("エラー：画面から「問題文」を取得できませんでした。");
                throw new Error("問題文が空です");
            }

            let choiceA = "", choiceB = "", choiceC = "", choiceD = "";
            if (document.querySelector("#select_a")) {
                choiceA = await processNode(document.querySelector("#select_a"));
                choiceB = await processNode(document.querySelector("#select_i"));
                choiceC = await processNode(document.querySelector("#select_u"));
                choiceD = await processNode(document.querySelector("#select_e"));
            } else if (document.querySelector(".selectList")) {
                const listClone = document.querySelector(".selectList").cloneNode(true);
                listClone.querySelectorAll("button, .selectBtn").forEach(b => b.remove());
                const combinedImage = await processNode(listClone);
                questionText += "<br><br><b>【選択肢】</b><br>" + combinedImage;
            }

            const answer = document.querySelector("#answerChar")?.innerText || ""; 
            const explanationElem = document.querySelector("#kaisetsu .ansbg") || document.querySelector("#kaisetsu");
            const explanation = await processNode(explanationElem);

            let cardTags = ["AP過去問"];
            const anslink = document.querySelector(".anslink");
            if (anslink) {
                const timeText = anslink.innerText.split("\n")[0];
                if (timeText) cardTags.push(timeText.replace(/\s+/g, '_'));
            }
            const h3Elements = document.querySelectorAll("h3");
            h3Elements.forEach(h3 => {
                if (h3.innerText.includes("分類")) {
                    const categoryDiv = h3.nextElementSibling;
                    if (categoryDiv && categoryDiv.tagName === "DIV") {
                        const categories = categoryDiv.innerText.split("»").map(c => c.trim().replace(/\s+/g, ''));
                        cardTags.push(...categories);
                    }
                }
            });

            const fieldsData = {
                "問題": questionText,
                "選択肢ア": choiceA,
                "選択肢イ": choiceB,
                "選択肢ウ": choiceC,
                "選択肢エ": choiceD,
                "正解": answer,
                "解説": explanation
            };

            const searchStr = qContainer.innerText.split('\n')[0].replace(/["*]/g, '').trim().substring(0, 25);
            const query = `問題:"*${searchStr}*"`;
            const foundNotes = await invoke('findNotes', { query: query });

            if (foundNotes.length > 0) {
                const existingNoteId = foundNotes[0];
                await invoke('updateNoteFields', { note: { id: existingNoteId, fields: fieldsData } });
                await invoke('addTags', { notes: [existingNoteId], tags: cardTags.join(' ') });
                btn.innerText = "更新完了！";
                btn.style.backgroundColor = "#9c27b0";
            } else {
                const note = {
                    "deckName": "応用情報技術者試験",
                    "modelName": "AP過去問モデル",
                    "fields": fieldsData,
                    "tags": cardTags,
                    "options": { "allowDuplicate": false }
                };
                await invoke('addNote', { note: note });
                btn.innerText = "追加完了！";
                btn.style.backgroundColor = "#2196F3";
            }
        } catch (err) {
            console.error(err);
            alert('通信エラー: ' + err.message);
            btn.innerText = "エラー";
            btn.style.backgroundColor = "#f44336";
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = "Ankiへ送信 (Shift+Enter)";
                btn.style.backgroundColor = "#4CAF50";
            }, 2000);
        }
    }
})();
/*
無断転載・再配布の禁止: READMEを読んで！
リンクフリー: GitHubのリンクを他サイトで公開していただけると嬉しいです！
*/