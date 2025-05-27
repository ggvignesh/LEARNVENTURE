# LearnVenture

A web-based learning platform with an AI-powered chatbot for interactive learning experiences.

## Features

- User authentication (Register/Login)
- Interactive AI chatbot powered by LM Studio
- Chat history tracking
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=learnventure
   PORT=3001
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open `index.html` in your browser

## Requirements

- Node.js
- MySQL
- LM Studio (for AI chatbot functionality)

## Note

Make sure LM Studio is running with a loaded model before using the chatbot feature. 