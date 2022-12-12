# GPT-3 Visual Studio Code Extension
Use GPT-3 to be a more efficient programmer!

- ✏️ Write to GPT - ask it anything directly from VS Code
- 📖 Generate documentation for your code
- 💡 Generate suggested alternatives for your code, including an explanation

---

## Install the extension

[Marketplace](https://marketplace.visualstudio.com/items?itemName=Arrendy.gpt3-vscode-extension)

---
## Requirements
Enter your [OpenAI API Key](https://beta.openai.com/signup) into a secret storage prompt.

⚠️ **NOTE**: Some extensions ask you to store your API Key in settings.json - this is **not secure** ⚠️

All extensions can read the entire contents of `settings.json`. If you store your API Key in plain text, a malicious extension can easily access it. To protect your API Key, you **must** store it in secret storage to prevent other extensions from accessing it.

--- 

## Current functionality
### Ask GPT
Opens a text input box and the value entered will be sent to GPT for processing. The response will appear in a modal.

> Default key binding set to `alt + g`

> Status bar item also runs this function.

### Create Documentation
Generates documentation for highlighted code. It will automatically inject it above the highlighted code.

> Default key binding set to `alt + d`

### Suggest Improvements
Sends highlighted code to GPT-3 where it will return suggested code as well as an explanation for why the suggestion is an improvement. The suggested code and explanation will appear in a modal.

> Default key binding set to `alt + i`



---
## Extension Settings
Open preferences to find `GPT` under `extensions`. 

You will need to insert your API Key and update other parameters for your queries. Links for documentation are included for the meaning of each value.

---

## Known Issues
May need to re-configure credentials if updating from a version older than v0.6.0

---

## Release Notes

### 0.9.0
API Key in secret storage

### 0.8.0
Status bar item to initiate Ask GPT function. Returns more readable modal with a copy output button

### 0.7.0
Optionally include Organization in request to GPT

### 0.6.0
Easily configure your extension in preferences

### 0.4.0
Send GPT text directly. Ask a question or get clarity in your own words, without leaving your editor.

### 0.2.0
Generates code suggestion with explanation for highlighted code.

### 0.1.0
Creates documentation for highlighted code.
