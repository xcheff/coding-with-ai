const { OpenAI } = require("openai");

const openai = new OpenAI(); // gets API Key from environment variable OPENAI_API_KEY

async function main() {

  const promptPrefix = `Developers creating new technology support himself over mathematics and computer science\
  Include Javascript code and Math formulas in walls \
  All people look to the space \
  black and white image \
  Dali style`;

  const prompt = `${promptPrefix}`;

  const request = {
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  };

  const completion = await openai.images.generate(request);
  console.log(completion.data[0].url);
}

main().catch(console.error);
