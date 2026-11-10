const vscode = require('vscode');
const path = require('path');

function activate(context) {
    const output = vscode.window.createOutputChannel('CogniStream Tracker');

    const config = vscode.workspace.getConfiguration('cognistream');
    const apiUrl = config.get('apiUrl', 'http://127.0.0.1:8000');

    let eventCount = 0;

    async function sendActivity(eventType, document) {
        if (!document || document.uri.scheme !== 'file') {
            return;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

        const activity = {
            source: 'IDE',
            tool: 'VS Code',
            event_type: eventType,
            timestamp: new Date().toISOString(),
            file_extension: path.extname(document.fileName),
            workspace_name: workspaceFolder
                ? path.basename(workspaceFolder.uri.fsPath)
                : 'Unknown'
        };

        try {
            const response = await fetch(`${apiUrl}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activity)
            });

            if (!response.ok) {
                throw new Error(`Backend returned HTTP ${response.status}`);
            }

            eventCount++;
            output.appendLine(
                `Activity sent: ${eventType} at ${activity.timestamp}`
            );
        } catch (error) {
            output.appendLine(`Could not send activity: ${error.message}`);
        }
    }

    const openListener = vscode.workspace.onDidOpenTextDocument(document => {
        sendActivity('file_opened', document);
    });

    const saveListener = vscode.workspace.onDidSaveTextDocument(document => {
        sendActivity('file_saved', document);
    });

    const statusCommand = vscode.commands.registerCommand(
        'cognistream.showStatus',
        () => {
            vscode.window.showInformationMessage(
                `CogniStream Tracker is active. Events sent: ${eventCount}`
            );
            output.show();
        }
    );

    context.subscriptions.push(
        openListener,
        saveListener,
        statusCommand,
        output
    );

    output.appendLine('CogniStream VS Code Activity Tracker activated.');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
