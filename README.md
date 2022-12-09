# GPT-3 Visual Studio Code Extension README

Stage 1: Running 'Create documentation' when code is highlighted will generate documentation for that code. It will automatically inject it above the highlighted code.
Default key binding set to `alt + d`

## Extension Settings
Update your `settings.json` file to include the following settings:

    "GPT3.openaiOrg": "org-<id>",
    "GPT3.openaiApiKey": "<API Key>",
    "GPT3.model": "text-davinci-003",
    "GPT3.maxTokens": 250,
    "GPT3.temperature": 0.7,

## Known Issues
Things are just getting started

## Release Notes
### 0.1.0
Creates documentation for highlighted code.
