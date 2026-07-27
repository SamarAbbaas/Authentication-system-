import OpenAI from 'openai';
import dotenv from 'dotenv';
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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', // Yahan apni key likhein
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: 'Help me write a Python script for file renaming.' }],
  });

  console.log(completion.choices[0].message.content);
}

main();