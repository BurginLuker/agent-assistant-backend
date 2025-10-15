import OpenAI from "openai";
import {
  instagramPrompt,
  facebookPrompt,
  tiktokPrompt,
  listingPrompt,
  twitterPrompt,
  openHousePrompt,
} from "./prompts.js";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class GptClient {
  model = "gpt-4.1-mini";
  max = 500;

  getSystemPrompt(type) {
    switch (type) {
      case "instagram":
        return instagramPrompt;
      case "facebook":
        return facebookPrompt;
      case "twitter":
        return twitterPrompt;
      case "tiktok":
        return tiktokPrompt;
      case "description":
        return listingPrompt;
      case "openhouse":
        return openHousePrompt;
      default:
        throw new Error(`Prompt type not implemented: ${type}`);
    }
  }

  getImageContentBlock(base64Images) {
    const content = [];
    for (const image of base64Images) {
      content.push({
        type: "input_image",
        image_url: `data:image/jpeg;base64,${image}`,
        detail: "auto",
      });
    }

    return content;
  }

  async query(res, type, cadastralData, base64Images) {
    const imageBlock = this.getImageContentBlock(base64Images);

    const stream = await client.responses.create({
      model: this.model,
      input: [
        { role: "developer", content: this.getSystemPrompt(type) },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Here is the the housing data: ${cadastralData}`,
            },
          ].concat(imageBlock),
        },
      ],
      stream: true,
    });

    let result = "";
    let usage = {};
    for await (const event of stream) {
      //console.log(event);
      if (event.type === "response.output_text.delta") {
        res.write(`${JSON.stringify({ text: event.delta })}\n`);
        result += event.delta;
      } else if (event.type === "response.completed") {
        usage = event.response.usage;
      }
    }

    console.log("HERE");
    console.log(usage);
    if (!result) {
      throw Error("failed to create content");
    }

    return {
      content: result,
      usage,
    };
  }
}
export default new GptClient();
