const { OpenAI } = require("openai");
const { readFile } = require("fs/promises");

const openai = new OpenAI(); // gets API Key from environment variable OPENAI_API_KEY

async function content(path) {
  return await readFile(path, "utf8");
}

async function main() {
  const promptPrefix = `Product review summary in at most 30 words. \
  Write the summary with the product's name as the title \
  Express its pros and cons as a bullet list: `;

  const text = await content("./gopro-reviews.txt");
  const prompt = `${promptPrefix}${text}`;

  const request = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0,
  };

  const completion = await openai.chat.completions.create(request);
  const [result] = completion.choices;
  console.log(result.message.content);
}

main().catch(console.error);
