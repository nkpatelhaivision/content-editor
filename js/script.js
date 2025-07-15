document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    const htmlOutput = document.getElementById('html-output');
    const copyBtn = document.getElementById('copy-html');
    const toolbarButtons = document.querySelectorAll('.toolbar button');
    
    // Update preview and HTML output when editor content changes
    editor.addEventListener('input', updateOutputs);
    
    // Add toolbar button functionality
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            const className = this.getAttribute('data-class');
            const attributes = this.getAttribute('data-attributes');
            
            // Get selected text
            const selectedText = editor.value.substring(
                editor.selectionStart, 
                editor.selectionEnd
            );
            
            let element;
            
            // Special handling for UL bullets
            if (tag === 'ul' && className === 'bullets') {
                if (selectedText) {
                    // Wrap selected lines in LI tags if multi-line
                    const listItems = selectedText.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => `<li>${line}</li>`)
                        .join('\n');
                    element = `<ul class="bullets">\n${listItems}\n</ul>`;
                } else {
                    element = `<ul class="bullets">\n<li></li>\n</ul>`;
                }
            } 
            // Special handling for OL numbered
            else if (tag === 'ol') {
                if (selectedText) {
                    // Wrap selected lines in LI tags if multi-line
                    const listItems = selectedText.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => `<li>${line}</li>`)
                        .join('\n');
                    element = `<ol>\n${listItems}\n</ol>`;
                } else {
                    element = `<ol>\n<li></li>\n</ol>`;
                }
            }
            // Special handling for image which is self-closing
            else if (tag === 'img') {
                element = `<img`;
                if (attributes) {
                    try {
                        const attrObj = JSON.parse(attributes);
                        for (const [key, value] of Object.entries(attrObj)) {
                            element += ` ${key}="${value}"`;
                        }
                    } catch (e) {
                        console.error('Error parsing attributes:', e);
                    }
                }
                element += `>`;
            } 
            // Special handling for italic (i) tag
            else if (tag === 'i') {
                element = `<i>${selectedText}</i>`;
            }
            // Standard element handling
            else {
                element = `<${tag}`;
                
                // Add class if specified
                if (className) {
                    element += ` class="${className}"`;
                }
                
                // Add attributes if specified
                if (attributes) {
                    try {
                        const attrObj = JSON.parse(attributes);
                        for (const [key, value] of Object.entries(attrObj)) {
                            element += ` ${key}="${value}"`;
                        }
                    } catch (e) {
                        console.error('Error parsing attributes:', e);
                    }
                }
                
                element += `>${selectedText}</${tag}>`;
            }
            
            // Insert at cursor position
            insertAtCursor(editor, element);
            
            // Update preview and HTML output
            updateOutputs();
        });
    });
    
    // Copy HTML to clipboard
    copyBtn.addEventListener('click', function() {
        htmlOutput.select();
        document.execCommand('copy');
        
        // Change button text temporarily
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
    });
    
    // Function to insert text at cursor position
    function insertAtCursor(textarea, text) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Replace selected text with new text
        textarea.value = textarea.value.substring(0, startPos) + 
                        text + 
                        textarea.value.substring(endPos);
        
        // Set cursor position after inserted text
        const newCursorPos = startPos + text.length;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        
        // Focus back on the textarea
        textarea.focus();
    }
    
    // Update both preview and HTML output
    function updateOutputs() {
        const content = editor.value;
        preview.innerHTML = content;
        htmlOutput.value = content;
    }
    
    // Initialize
    updateOutputs();
});