// Chat functionality
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
const closeButton = document.getElementById('close-button');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    
// Toggle chatbot window
chatbotButton.addEventListener('click', () => {
    chatbotWindow.style.display = 'block';
    loadChatHistory();
});

closeButton.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });
    
// Send message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to use the chat');
        return;
    }
        
        // Add user message to chat
    appendMessage('user', message);
        userInput.value = '';
        loadingIndicator.style.display = 'block';
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                message,
                userId: user.id
            })
            });
            
            const data = await response.json();

        if (response.ok) {
            appendMessage('assistant', data.response);
        } else {
            appendMessage('assistant', data.error || 'Sorry, I encountered an error. Please try again.');
        }
        } catch (error) {
        console.error('Error sending message:', error);
        appendMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
    
// Send message on button click or Enter key
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Append message to chat
function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
    messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Load chat history
    async function loadChatHistory() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

        try {
        const response = await fetch(`/api/chat-history?userId=${user.id}`);
        const history = await response.json();

        // Clear existing messages
            chatMessages.innerHTML = '';

        // Add welcome message
        appendMessage('assistant', 'Hello! I\'m your LearnVenture AI assistant. I can help you with:\n\n' +
            '• Computer Science concepts\n' +
            '• Programming Languages (C, C++, Java, Python)\n' +
            '• Web Development (HTML, CSS, JavaScript, React, Angular)\n' +
            '• Data Science and AI\n' +
            '• Database Management\n' +
            '• And much more!\n\n' +
            'How can I help you today?');

        // Add history messages
        history.reverse().forEach(msg => {
            appendMessage('user', msg.message);
            appendMessage('assistant', msg.response);
        });
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }