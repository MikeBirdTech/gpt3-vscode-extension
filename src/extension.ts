import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";

const getConfValue = <T = string>(key: string) => vscode.workspace.getConfiguration('GPT').get(key) as T;

const initConfig = () => {
	const config = {
		"model": getConfValue('model'),
		"max_tokens": getConfValue<number>('maxTokens'),
		"temperature": getConfValue<number>('temperature'),
		"organization":getConfValue('org'),
		"apiKey": getConfValue('apiKey')
	};

	if (!config.temperature || config.temperature < 0 || config.temperature > 1) {
		vscode.window.showInformationMessage("Temperature must be between 0 and 1, please update your settings");
		return;
	}

	return config;
};

// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated');

	const config = initConfig();
	if(!config){
		return;
	}

	const openaiConfig = new Configuration({
		apiKey: config.apiKey
	});

	const openai = new OpenAIApi(openaiConfig);

	let createDocumentation = vscode.commands.registerCommand('GPT.createDocs', async () => {
		console.log('Running createDocs');

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if(!selectedText){
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		vscode.window.setStatusBarMessage('Generating your documentation!');

		const prompt = `Write doc comments for the code
			Code: 
			${selectedText}
			
			Doc comments:
			`;


		const response = await openai.createCompletion({
			model:config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim();

		// Start a new edit operation
		editor.edit((editBuilder) => {
			// Insert the text at the start of the selection
			editBuilder.insert(editor.selection.start, `${output}\n`);
		});
	});

	let suggestImprovement = vscode.commands.registerCommand('GPT.suggestImprovement', async () => {
		console.log('Running suggestImprovement');
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if(!selectedText){
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		vscode.window.setStatusBarMessage('Generating your suggestion!');

		const prompt = `Improve the Original code. 
		Provde Suggested code and an explanation for why it is better.
		Original code: 
		${selectedText}

		Suggested code:
		`;

		const response = await openai.createCompletion({
			model: config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		vscode.window.showInformationMessage(output);
	});

	let askGPT = vscode.commands.registerCommand('GPT.askGPT', async () => {
		console.log('Running askGPT');

		const inputBoxOptions = {
			"title": "Ask GPT!",
			"prompt": "Enter in the text you would like to send to GPT"
		};
		
		const prompt = await vscode.window.showInputBox(inputBoxOptions);

		if(!prompt) {
			vscode.window.showWarningMessage('No input received.');
			return;
		}

		vscode.window.setStatusBarMessage('Sending to GPT!');

		const response = await openai.createCompletion({
			model: config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		vscode.window.showInformationMessage(output);
	});


	context.subscriptions.push(createDocumentation);
	context.subscriptions.push(suggestImprovement);
	context.subscriptions.push(askGPT);
}

// This method is called when your extension is deactivated
export function deactivate() { }
