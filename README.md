# 🤖 GPT-3 Visual Studio Code Extension
Use GPT-3 to be a more efficient programmer!

- ✏️ Write to GPT-3 from your editor
- 💻 Generate code from your documentation
- 📖 Generate documentation from your code
- 💡 Code review with explanation

---

## Requirements
Your [OpenAI API key](https://beta.openai.com/account/api-keys)

If you need an OpenAI account, it's free to [signup](https://beta.openai.com/signup) and you get $18 in credits.

--- 
## Install the extension

[Marketplace page](https://marketplace.visualstudio.com/items?itemName=Arrendy.gpt3-vscode-extension)

When the extension is installed, a prompt will appear for you to enter in your API key.

This extension uses secret storage for API keys.

> ⚠️ **NOTE**: Other extensions may store your API key in settings.json - this is **not secure** ⚠️

All extensions can read the contents of `settings.json`. If your API key is stored there, a malicious extension can easily access it. To protect your API key, it **must** be stored in secret storage. 

---


## Current functionality
### 🦄 Ask GPT 🦄
Sends user input to GPT for processing. The response will appear in a modal.

> Default key binding set to `alt + g`

> Ask GPT in the Status Bar

### 🎉 Create Code from Documentation 🎉
Generates code for highlighted documentation. The code is automatically injected **below** the highlighted docs.

> Default key binding set to `alt + x`

### 🔥 Create Documentation from Code 🔥
Generates documentation for highlighted code. The docs are automatically injected **above** the highlighted code.

> Default key binding set to `alt + d`

### 💯 Code Review 💯
Sends highlighted code to GPT-3 for potential improvements. Suggested code and explanation will appear in a modal.

> Default key binding set to `alt + i`

---

## Extension Settings
`Settings` > `Extensions` > `GPT`

---

## FAQ
👽 How can I reset my API key if I entered the wrong one?

> - Open command palette and run `Update OpenAI API Key`
> - Enter your correct API Key into the prompt 
> - Reload the window
---

## Release Notes

### 0.12.0
Added check if completion exceeds max_token values. Alert user how to resolve.

### 0.11.0
Option to set different values for code vs text completion settings (models, temperature, max tokens)

### 0.10.0
Create code from documentation

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