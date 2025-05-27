// Test script for Phi-2 model in LM Studio
const testPhi2 = async () => {
    console.log('Testing Phi-2 model connection...');
    
    try {
        // Test LM Studio connection with Phi-2 optimized settings
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
                        content: "What is Python? Give a brief answer."
                    }
                ],
                temperature: 0.2,
                top_p: 0.5,
                max_tokens: 300,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`LM Studio Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Phi-2 Response:', data.choices[0].message.content);
        console.log('✅ Phi-2 model is working correctly!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.log('\nTroubleshooting steps:');
        console.log('1. Is LM Studio running?');
        console.log('2. Is Phi-2 model loaded in LM Studio?');
        console.log('3. Is the server started in LM Studio?');
        console.log('4. Check if port 1234 is available');
    }
};

// Run the test
testPhi2(); 