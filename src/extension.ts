import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";

const getConfValue = <T = string>(key: string) => vscode.workspace.getConfiguration('GPT').get(key) as T;

// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated');

	let disposable = vscode.commands.registerCommand('GPT.createDocs', async () => {
		console.log('Running createDocs');
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedText = editor.document.getText(editor.selection);

			const prompt = `Create clear and concise documentation for the following code. 
			Every line must be commented out and use multiple lines for long sentences. 
			Use best practices.
			Code: ${selectedText}`;

			const model = getConfValue('model');
			const max_tokens = getConfValue<number>('maxTokens');
			const temperature = getConfValue<number>('temperature');
			
			if (temperature < 0 || temperature > 1) {
				vscode.window.showInformationMessage("Temperature must be between 0 and 1, please update your settings");
				return;
			}

			const configuration = new Configuration({
				organization: getConfValue('openaiOrg'),
				apiKey: getConfValue('openaiApiKey'),
			});

			const openai = new OpenAIApi(configuration);

			const response = await openai.createCompletion({
				model,
				prompt,
				max_tokens,
				temperature,
			});

			const output = response.data.choices[0].text?.trim();

			// Start a new edit operation
			editor.edit((editBuilder) => {
				// Insert the text at the start of the selection
				editBuilder.insert(editor.selection.start, `${output}\n`);
			});
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
