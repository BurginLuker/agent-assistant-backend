import OpenAI from "openai";
import {
  listingPrompt,
  instagramPrompt,
  imageFocus,
  dataFocus,
} from "./Prompt.js";

//const functions = require('firebase-functions');
const client = new OpenAI({
  apiKey:
    "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",
});

class ChatGPTClient {
  GPT_MODEL = "gpt-4.1-mini";
  MAX_LISTING_OUTPUT_TOKENS = 250;
  MAX_INSTAGRAM_TOKENS = 500;

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

  async queryChatGPTClient(data, base64Images, mode, focus) {
    let max = this.MAX_LISTING_OUTPUT_TOKENS;
    let prompt = listingPrompt;
    if (mode === "instagram") {
      prompt = instagramPrompt;
      max = this.MAX_INSTAGRAM_TOKENS;
    }

    if (focus === "images") {
      prompt += imageFocus;
    } else if (focus === "data") {
      prompt += dataFocus;
    }

    const response = await client.responses.create({
      model: this.GPT_MODEL,
      max_output_tokens: max,
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
    console.log(response.usage);

    return response;
  }
}

const chatGPTClient = new ChatGPTClient();
export default chatGPTClient;
