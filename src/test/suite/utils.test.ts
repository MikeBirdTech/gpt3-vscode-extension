import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../../utils';

suite('Utils Test Suite', () => {
	test('Capture file extension', () => {
        let file = "path/to/file.js";
        let extension = myExtension.getFileExtension(file);

		assert.strictEqual(extension, 'js');
	});
});
