import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function summarizeText(text: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a professional technical writer.
    Summarize the following snippet in 30 words or less, focusing on clarity and key ideas:

    "${text}"
  `;

  const result = await model.generateContent(prompt); 
  return result.response.text().trim();
}

export async function* streamSummary(text: string): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a professional technical writer.
    Summarize the following snippet in 30 words or less, focusing on clarity and key ideas:

    "${text}"
  `;

  const result = await model.generateContentStream([{ text: prompt }]);
  for await (const chunk of result.stream) {
    const part = chunk.text();
    if (part) yield part;
  }
}
