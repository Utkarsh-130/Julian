const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Replace with your actual API key
const GEMINI_API_KEY = 'AIzaSyBeo0x0sMfVtgQ-WrxbZ3r9L-VB5ZEWCls';
const DISCORD_TOKEN = 'MTMwMDA4NDIwMjIwODc1NTc2Mw.GTp7Xs.ypg6NnXpPKPODX9DlS2rt8uQU0YIZdpZ3nXZYI'; // Use your actual Discord bot token

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    // Check for a specific command (like "!ask")
    if (message.content.startsWith('!ask')) {
        const userQuestion = message.content.slice(5).trim(); // Adjusted to slice from 5

        if (!userQuestion) {
            return message.channel.send('Please ask a question after the command.');
        }

        try {
            const response = await axios.post('https://api.gemini.com/v1/ask', { // Use the correct Gemini endpoint
                prompt: userQuestion,
                max_tokens: 150,
                n: 1,
                stop: null,
            }, {
                headers: {
                    'Authorization': `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            const answer = response.data.choices[0].text || 'Sorry, I didn’t get a response.'; // Adjust based on Gemini's response structure
            message.channel.send(answer);
        } catch (error) {
            console.error('Error with the API request:', error);
            message.channel.send('Sorry, I encountered an error while trying to respond.');
        }
    }
});

// Log in to Discord with your bot token
client.login('MTMwMDA4NDIwMjIwODc1NTc2Mw.GTp7Xs.ypg6NnXpPKPODX9DlS2rt8uQU0YIZdpZ3nXZYI');
