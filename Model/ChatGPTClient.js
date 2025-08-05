import OpenAI from "openai";
import { prompt } from "./Prompt.js";
const client = new OpenAI({});

class ChatGPTClient {
  GPT_MODEL = "gpt-4.1-mini";
  MAX_OUTPUT_TOKENS = 250;

  getPrompt(data) {
    return "Property Data: " + JSON.stringify(data);
  }

  getContentArray(data, base64Images) {
    const content = [{ type: "input_text", text: this.getPrompt(data) }];
    for (const image of base64Images) {
      content.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
        detail: "auto",
      });
    }

    return content;
  }

  async queryChatGPTClient(data, base64Images) {
    const response = await client.responses.create({
      model: this.GPT_MODEL,
      max_output_tokens: this.MAX_OUTPUT_TOKENS,
      input: [
        {
          role: "developer",
          content: prompt,
        },
        {
          role: "user",
          content: this.getContentArray(data, base64Images),
        },
      ],
    });

    return response;
  }
}

const chatGPTClient = new ChatGPTClient();
export default chatGPTClient;
