export function showHelp() {
	const helpText = `This tool leverages AI to convert your natural language questions into precise CLI commands. 
    Simply ask a question, and let the AI generate the appropriate command for you. 
    Usage:
    \`bashgenie [OPTIONS] <YOUR QUESTION>\`

    Options:
    -h, --help  
        Show this help message and exit.

    -e, --explain  
        Explain the generated command. This will provide a detailed breakdown of the command components and why they were selected.

    -v, --verbose  
        Show additional information, such as token usage, to help understand the internal workings of the tool.

    --init  
        Run the configuration wizard to set up the tool with your preferences. Useful for first-time users or when you want to adjust settings.
    
    --no-exec
        Do not ask to run the generate command and exit after printing the generation result

    Example Usage:
    1. Basic command generation:
    \`bashgenie "How can I list files in a directory?"\`

    2. Command with explanation:
    \`bashgenie download google.com -e\`

    3. Running the configuration wizard:
    \`bashgenie --init\`
    `;

	return helpText;
}
