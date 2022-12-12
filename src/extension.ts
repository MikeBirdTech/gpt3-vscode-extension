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

const initConfig = async (context: vscode.ExtensionContext) => {
	console.log('init');

	let apiKey = await context.secrets.get('OPENAI_API_KEY');

	if (!apiKey) {
		console.log("API Key doesn't exist in secret storage");

		apiKey = await setNewAPIKey(context);
	}


	const config: Config = {
		"model": getConfValue('model'),
		"max_tokens": getConfValue<number>('maxTokens'),
		"temperature": getConfValue<number>('temperature'),
		"apiKey": apiKey,
	};

	let org = getConfValue('org');

	if (org) {
		config.organization = org;
	}

	let { isValid, reason } = validateConfig(config);

	if (!isValid) {
		vscode.window.showErrorMessage(reason);
		return;
	}

	return config;
};

const setNewAPIKey = async (context: vscode.ExtensionContext): Promise<string> => {
	const inputBoxOptions = {
		title: "Please enter your OpenAI API Key",
		prompt: "Store your API Key in secret storage",
		password: true,
		ignoreFocusOut: true
	};

	const secret = await vscode.window.showInputBox(inputBoxOptions);

	if (!secret) {
		vscode.window.showWarningMessage('No API Key received.');

		return "";
	}

	await context.secrets.store('OPENAI_API_KEY', secret);

	return secret;
};

const validateConfig = (config: Config) => {
	let reason = "";
	let isValid = true;

	if (config.apiKey === "") {
		reason = "API Key cannot be an empty string, please reload window and enter API Key";
		isValid = false;
	}

	if (!config.temperature || config.temperature < 0 || config.temperature > 1) {
		reason = "Temperature must be between 0 and 1, please update your settings";
		isValid = false;
	}

	if (!config.max_tokens || config.max_tokens < 1 || config.max_tokens >= 4000) {
		reason = "Max tokens must be between 1 and 4000, please update your settings";
		isValid = false;
	}

	if (!config.model) {
		reason = "GPT Model missing, please update your settings";
		isValid = false;
	}
	console.log(`isValid: ${isValid}, reason: ${reason}`);

	return { isValid, reason };
};

// This method is called when the extension is activated
export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated');

	const config = await initConfig(context);
	if (!config) {
		deactivate();
		return;
	}

	const openaiConfig = new Configuration({
		...config
	});

	const openai = new OpenAIApi(openaiConfig);

	const statusBarItem = vscode.window.createStatusBarItem();
	statusBarItem.name = "GPT";
	statusBarItem.text = "Ask GPT $(hubot)";
	statusBarItem.command = "GPT.askGPT";
	statusBarItem.tooltip = "Opens a text input for you to send your message to GPT";

	statusBarItem.show();

	// Create documentation for highlighted code
	let createDocumentation = vscode.commands.registerCommand('GPT.createDocs', async () => {
		console.log('Running createDocs');

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (!selectedText) {
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Generating your documentation! $(book)');

		const prompt = `Write doc comments for the code
			Code: 
			${selectedText}
			
			Doc comments:
			`;


		const response = await openai.createCompletion({
			model: config.model,
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
		statusBarItem.show();
	});

	// Create code for highlighted documentation
	let createCodeFromDocumentation = vscode.commands.registerCommand('GPT.createCodeFromDocs', async () => {
		console.log('Running createCodeFromDocs');

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (!selectedText) {
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		let activeFile = editor.document.fileName;
		let filePathParts = activeFile.split('.');
		let fileExtension = filePathParts[filePathParts.length - 1];

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Generating your code! $(code)');

		const prompt = `Write ${fileExtension} code to accomplish the goal of these doc comments
				Doc comments: 
				${selectedText}
				
				Code:
				`;

		const response = await openai.createCompletion({
			model: config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim();

		// Insert the text at the start of the selection
		editor.edit((editBuilder) => {
			editBuilder.insert(editor.selection.end, `\n${output}`);
		});

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Create a suggested alternative to highlight code with an explanation
	let suggestImprovement = vscode.commands.registerCommand('GPT.suggestImprovement', async () => {
		console.log('Running suggestImprovement');
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (!selectedText) {
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		statusBarItem.hide();
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

		const mesesageOptions = {
			"modal": true,
			"detail": "-GPT"
		};

		let items = [
			{
				"title": 'Copy output'
			}
		];

		const gptResponse = vscode.window.showInformationMessage(output, mesesageOptions, ...items);

		gptResponse.then((button) => {
			if (button?.title === 'Copy output') {
				vscode.env.clipboard.writeText(output);
			}
		});

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Directly write a prompt for GPT
	let askGPT = vscode.commands.registerCommand('GPT.askGPT', async () => {
		console.log('Running askGPT');

		const inputBoxOptions = {
			"title": "Ask GPT!",
			"prompt": "Enter in the text you would like to send to GPT"
		};

		const prompt = await vscode.window.showInputBox(inputBoxOptions);

		if (!prompt) {
			vscode.window.showWarningMessage('No input received.');
			return;
		}

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Sending to GPT! $(hubot)');

		const response = await openai.createCompletion({
			model: config.model,
			prompt,
			max_tokens: config.max_tokens,
			temperature: config.temperature,
		});

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		const mesesageOptions = {
			"modal": true,
			"detail": "-GPT"
		};

		let items = [
			{
				"title": 'Copy output'
			}
		];

		const gptResponse = vscode.window.showInformationMessage(output, mesesageOptions, ...items);

		gptResponse.then((button) => {
			if (button?.title === 'Copy output') {
				vscode.env.clipboard.writeText(output);
			}
		});

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Update OpenAI API Key
	let updateAPIKey = vscode.commands.registerCommand('GPT.updateAPIKey', async () => {
		console.log('Running updateAPIKey');

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Securely storing your API Key $(pencil)');

		await setNewAPIKey(context);

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Remove OpenAI API Key
	let removeAPIKey = vscode.commands.registerCommand('GPT.removeAPIKey', async () => {
		console.log('Running removeAPIKey');

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Securely REMOVING your API Key $(error)');

		await context.secrets.delete('OPENAI_API_KEY');

		statusMessage.dispose();
		statusBarItem.show();
	});


	context.subscriptions.push(createDocumentation);
	context.subscriptions.push(createCodeFromDocumentation);
	context.subscriptions.push(suggestImprovement);
	context.subscriptions.push(askGPT);
	context.subscriptions.push(updateAPIKey);
	context.subscriptions.push(removeAPIKey);
}

// This method is called when your extension is deactivated
export function deactivate() { }
