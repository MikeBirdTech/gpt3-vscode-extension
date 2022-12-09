# GPT-3 Visual Studio Code Extension README

## Install the extension

[Marketplace](https://marketplace.visualstudio.com/items?itemName=Arrendy.gpt3-vscode-extension)

Stage 1: Running 'Create documentation' when code is highlighted will generate documentation for that code. It will automatically inject it above the highlighted code.
Default key binding set to `alt + d`

## Extension Settings
Update your `settings.json` file to include the following settings:

    "GPT.openaiOrg": "org-<id>",
    "GPT.openaiApiKey": "<API Key>",
    "GPT.model": "text-davinci-003",
    "GPT.maxTokens": 250,
    "GPT.temperature": 0.7,

## Known Issues
Things are just getting started

## Release Notes
### 0.1.0
Creates documentation for highlighted code.
