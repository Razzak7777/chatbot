// script.js

const API_KEY = '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'; // Securely manage API keys
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Function to create a chat list item
const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.className = className;

    const chatContent = className === 'outgoing'
        ? `<p>${message}</p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;

    chatLi.innerHTML = chatContent;
    return chatLi;
};

// Function to generate a response from the API
const generateResponse = async (userMessage, chatElement) => {
    const messageElement = chatElement.querySelector('p');

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: userMessage }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        messageElement.textContent = data.choices[0].message.content.trim();
    } catch (error) {
        messageElement.classList.add('error');
        messageElement.textContent = 'An error occurred. Please try again.';
        console.error('Error fetching response:', error);
    }
};

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-message');
    const userMessage = chatInput.value.trim();

    if (userMessage) {
        // Create and append the outgoing message
        const userChatElement = createChatLi(userMessage, 'outgoing');
        document.querySelector('.chatbox').appendChild(userChatElement);
        chatInput.value = '';

        // Generate and append the response from the chatbot
        const responseChatElement = createChatLi('', 'incoming');
        document.querySelector('.chatbox').appendChild(responseChatElement);
        generateResponse(userMessage, responseChatElement);
    }
});

// Event listener for toggling the chat interface
document.querySelector('.chatbot-toggler').addEventListener('click', () => {
    const chatbot = document.querySelector('.chatbot');
    if (chatbot.classList.contains('show')) {
        chatbot.classList.remove('show');
        chatbot.classList.add('hide');
    } else {
        chatbot.classList.remove('hide');
        chatbot.classList.add('show');
    }
});

// Event listener for closing the chat interface
document.querySelector('.close-btn').addEventListener('click', () => {
    const chatbot = document.querySelector('.chatbot');
    chatbot.classList.remove('show');
    chatbot.classList.add('hide');
});
