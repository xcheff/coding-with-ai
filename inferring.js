const { OpenAI } = require("openai");
const { readFile } = require("fs/promises");

const openai = new OpenAI(); // gets API Key from environment variable OPENAI_API_KEY

async function content(path) {
  return await readFile(path, "utf8");
}

async function main() {
  const promptPrefix = `Identify the following items from the review text: \
    - Sentiment as positive or negative (sentiment) \
    - Is the reviewer expressing anger? Express it as true or false. (anger) \
    - problem express it (subject) \
    - contract number (contract) \
    - Reviewer's name (name) \
    - Reviewer's address (address) \
    - Reviewer's email (email) \
    - Reviewer' phone (phone) \
    Make the response as short as possible and return a JSON object with the data \
    Use as JSON's atribute names the expressions in parentheses \
    Format of anger is boolean \ `;

  const text = await content("./customer-complaint.txt");
  const prompt = `${promptPrefix}${text}`;

  const request = {
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0,
  };

  const completion = await openai.chat.completions.create(request);
  const [result] = completion.choices;
  console.log(result.message.content);
}

main().catch(console.error);
