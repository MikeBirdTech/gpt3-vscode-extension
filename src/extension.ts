import * as dotenv from 'dotenv';
dotenv.config({path:__dirname+'/../.env'});
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";


// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated');

	let disposable = vscode.commands.registerCommand('GPT3.createDocs', async () => {
		console.log('Running createDocs');
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedText = editor.document.getText(editor.selection);

			const prompt = `Create clear and concise documentation for the following code. 
			Every line must be commented out and use multiple lines for long sentences. 
			Use best practices.
			Code: ${selectedText}`;

			const configuration = new Configuration({
				organization: process.env.OPENAI_ORG,
				apiKey: process.env.OPENAI_API_KEY,
			});

			const openai = new OpenAIApi(configuration);

			const response = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `${prompt}`,
				max_tokens: 250,
				temperature: 0.4,
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
