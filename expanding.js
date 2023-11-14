const { OpenAI } = require("openai");
const { writeFile } = require("fs/promises");
const resolutions = require("./cases-resolutions.json");

const openai = new OpenAI(); // gets API Key from environment variable OPENAI_API_KEY

async function main() {
  const promptPrefix = `Make a letter according data input and follow the next rules:\n
      anger: 
        - true: Express apologies in a polite way 
        - false: Be straightforward with a warm tone\n
      resolution:
        - "positive": case in favor to customer 
        - "negative": case in favor to company \n 
      action:
        - "field service": technical staff will be customer 
           location to fixed 
        - "remote service": technical fixing had been applied 
           to service restauration 
        - "refund": customer account will charged with credit of dispute 
           amount to left in total amount in zero
        - "suspension": internet service will stop if total amount is 
           not recieved before deadline \n
      deadline: date limit to action execution \n
      security: 
        - when technical staff will visit to customer, email must 
          inform technician's name and id \n
      customer care contact:
        - Customer Care Team at Wonderland Telecomunications
        - Phone: +578908765432
        - Email: support@wonderland.com \n
      status: 
        - closed: this is the final communication about the case 
        - open: the case still open until new updates \n
      letter format:
        - start letter with Wonderland City and today's date
        - heading: customer contact data 
        - subject: caseId and subject 
        - salutation: formal salutation
        - format: block  
        - signature line: Customer Care Team \n 
      postdata about data protection laws:
        - Put annotation about it and customer email with note about receptor \n    
      return only letter text
  `;

  const requests = [];
  resolutions.forEach((customerCase) => {
    const prompt = `${promptPrefix}\n${JSON.stringify(customerCase)}`;
    const request = {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1400,
      temperature: 0,
    };
    requests.push(openai.chat.completions.create(request));
  });

  const completations = await Promise.all(requests);

  const emails = completations.map(async (completion) => {
    const [result] = completion.choices;
    const text = result.message.content;
    const letterId = completion.id;
    await writeFile(`./emails/${letterId}.txt`, text);
  });

  console.log('Process finished');

}

main().catch(console.error);
