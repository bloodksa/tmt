import OpenAI from "openai"

const TELEGRAM_API = 'https://api.telegram.org/bot'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createTelegramBot(name: string) {
  const response = await fetch(`${TELEGRAM_API}${process.env.TELEGRAM_BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      commands: [
        {
          command: '/start',
          description: 'Start the bot',
        },
        {
          command: '/help',
          description: 'Get help',
        },
        {
          command: '/chat',
          description: 'Chat with AI',
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create Telegram bot')
  }

  return { id: Date.now().toString(), name }
}

export async function handleTelegramUpdate(update: any) {
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id
    const messageText = update.message.text

    if (messageText.startsWith('/chat')) {
      const prompt = messageText.slice(6).trim()
      const aiResponse = await generateAIResponse(prompt)
      await sendTelegramMessage(chatId, aiResponse)
    } else {
      await sendTelegramMessage(chatId, "Hello! Use /chat followed by your message to chat with AI.")
    }
  }
}

async function generateAIResponse(prompt: string) {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 150,
    })
    return response.choices[0].text.trim()
  } catch (error) {
    console.error('Error generating AI response:', error)
    return "Sorry, I couldn't generate a response at this time."
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  const response = await fetch(`${TELEGRAM_API}${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send Telegram message')
  }
}

