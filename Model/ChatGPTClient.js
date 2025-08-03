import OpenAI from "openai";
import { prompt } from "./Prompt";

export class ChatGPTClient {
  client = new OpenAI();
  GPT_MODEL = "gpt-4o-mini";

  getPrompt(data) {
    return prompt + JSON.stringify(data);
  }

  async queryChatGPTClient(data) {
    const response = await this.client.responses.create({
      model: this.GPT_MODEL,
      input: this.getPrompt(data),
    });

    return response.output_text;
  }

  generateListingDescription(propertyData) {
    return this.queryChatGPTClient(propertyData);
  }
}
