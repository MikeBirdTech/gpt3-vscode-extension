import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";

interface Config {
	model: string,
	max_tokens: number,
	temperature: number,
	apiKey: string,
	organization?: string
}

const getConfValue = <T = string>(key: string) => vscode.workspace.getConfiguration('GPT').get(key) as T;

const initConfig = () => {
	const config: Config = {
		"model": getConfValue('model'),
		"max_tokens": getConfValue<number>('maxTokens'),
		"temperature": getConfValue<number>('temperature'),
		"apiKey": getConfValue('apiKey'),
	};

	const org = getConfValue('org');

	if(org) {
		config.organization = org;
	}

	if (!config.temperature || config.temperature < 0 || config.temperature > 1) {
		vscode.window.showInformationMessage("Temperature must be between 0 and 1, please update your settings");
		return;
	}
	if (!config.max_tokens || config.max_tokens < 1 || config.max_tokens >= 4000) {
		vscode.window.showInformationMessage("Max tokens must be between 1 and 4000, please update your settings");
		return;
	}
	if (!config.apiKey) {
		vscode.window.showInformationMessage("OpenAI API Key missing, please update your settings");
		return;
	}
	if (!config.model) {
		vscode.window.showInformationMessage("GPT Model missing, please update your settings");
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
		...config
	});

	const openai = new OpenAIApi(openaiConfig);

	// Create documentation for highlighted code
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

		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Generating your documentation! $(book)');

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

		// Insert the text at the start of the selection
		editor.edit((editBuilder) => {
			editBuilder.insert(editor.selection.start, `${output}\n`);
		});

		statusMessage.dispose();
	});

	// Create a suggested alternative to highlight code with an explanation
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

		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Generating your suggestion! $(edit)');

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
		statusMessage.dispose();
	});

	// Directly write a prompt for GPT
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

		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Sending to GPT! $(hubot)');

		const response = await openai.createCompletion({
			model: config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		vscode.window.showInformationMessage(output);
		statusMessage.dispose();
	});


	context.subscriptions.push(createDocumentation);
	context.subscriptions.push(suggestImprovement);
	context.subscriptions.push(askGPT);
}

// This method is called when your extension is deactivated
export function deactivate() { }
