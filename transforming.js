const { OpenAI } = require("openai");

const openai = new OpenAI(); // gets API Key from environment variable OPENAI_API_KEY

async function main() {
  const promptPrefix = `Translate text inside the tag <review> from English to Spanish\
  Return only text\n`;

  const review = `
  I loved it! \
  If you want to be close to the action in Jardin this is a great place. \ 
  Right outside your hotel is the main square. \
  I loved being close to all the action and bars and restaurants. \
  The hotel is very clean and the staff are very kind and helpful `;


  const prompt = `${promptPrefix}<review>${review}</review>`;

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
