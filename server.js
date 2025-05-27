const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learnventure'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Users table created successfully');
    });

    // Create chat_messages table
    const createChatTable = `
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            message TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;
    
    db.query(createChatTable, (err) => {
        if (err) {
            console.error('Error creating chat table:', err);
            return;
        }
        console.log('Chat table created successfully');
    });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if email already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        return res.status(500).json({ error: 'Error registering user' });
                    }
                    res.status(201).json({ message: 'Registration successful' });
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check user credentials
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error checking credentials:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare passwords
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Return user data (excluding password)
            res.json({
                id: user.id,
                name: user.name,
                email: user.email
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if email exists
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Email not found' });
            }

            // TODO: Implement password reset logic (send email with reset link)
            res.json({ message: 'Password reset instructions sent to your email' });
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Chat endpoint - Using LM Studio
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ error: 'Message and userId are required' });
        }

        console.log('Attempting to connect to LM Studio...');
        
        // Call LM Studio API with optimized settings
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // Reduced to 120 seconds

        let retryCount = 0;
        const maxRetries = 1; // Reduced retries for faster failure detection
        
        while (retryCount <= maxRetries) {
            try {
                console.log(`Attempt ${retryCount + 1} to connect to LM Studio...`);
                const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: "user",
                                content: message
                            }
                        ],
                        temperature: 0.3, // Reduced for faster, more focused responses
                        top_p: 0.7, // Reduced for faster sampling
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                        max_tokens: 500, // Limit response length
                        stop: null,
                        stream: false
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                console.log('Received response from LM Studio');

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('LM Studio Error:', errorData);
                    throw new Error(`LM Studio Error: ${errorData.error || 'Unknown error'}`);
                }

                const data = await response.json();
                console.log('Parsed response data');
                
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    console.error('Invalid response format:', data);
                    throw new Error('Invalid response format from LM Studio');
                }

                const aiResponse = data.choices[0].message.content;
                console.log('Generated response:', aiResponse);

                // Save to database asynchronously (don't wait for it)
                db.promise().query(
                    'INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)',
                    [userId, message, aiResponse]
                ).catch(err => console.error('Error saving to database:', err));

                return res.json({ response: aiResponse });
            } catch (fetchError) {
                console.error(`Attempt ${retryCount + 1} failed:`, fetchError);
                
                if (fetchError.name === 'AbortError') {
                    if (retryCount < maxRetries) {
                        console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
                        retryCount++;
                        continue;
                    }
                    throw new Error('Request timed out. The model might be processing a complex question. Please try again with a simpler question.');
                }
                
                if (retryCount < maxRetries) {
                    console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
                    retryCount++;
                    continue;
                }
                
                throw fetchError;
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ 
            error: "I'm having trouble connecting to the AI service. Please try these steps:\n1. Make sure LM Studio is running\n2. Check if the model is loaded in LM Studio\n3. Verify the server is started in LM Studio\n4. If the problem persists:\n   - Close LM Studio completely\n   - Reopen LM Studio\n   - Load the model again\n   - Start the server\n   - Then refresh this page",
            details: error.message
        });
    }
});

// Get chat history
app.get('/api/chat-history', async (req, res) => {
    try {
        const userId = req.query.userId;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const [results] = await db.promise().query(
            'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 