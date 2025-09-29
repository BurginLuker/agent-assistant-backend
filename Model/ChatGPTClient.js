import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import {
  listingPrompt,
  instagramPrompt,
  imageFocus,
  dataFocus,
} from "./Prompt.js";

/**
 * Shared OpenAI client configured with the API key from environment variables.
 * The SDK handles request retries and transport details internally.
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Lightweight wrapper around the OpenAI Responses API for listing generation.
 * Encapsulates prompt assembly so callers can request copy with minimal inputs.
 */
class ChatGPTClient {
  /** Identifier for the model used when generating responses. */
  GPT_MODEL = "gpt-4.1";
  /** Upper bound on tokens returned when creating long-form listing copy. */
  MAX_LISTING_OUTPUT_TOKENS = 500;
  /** Upper bound on tokens returned when producing Instagram content. */
  MAX_INSTAGRAM_TOKENS = 500;

  /**
   * Serializes property data so it can be embedded inside the request payload.
   * @param {Record<string, any>} data - Property facts collected from the UI.
   * @returns {string} Human-readable prompt segment describing the property.
   */
  getPrompt(data) {
    return "Property Data: " + JSON.stringify(data);
  }

  /**
   * Builds the multi-modal content array consumed by the Responses API.
   * @param {Record<string, any>} data - Property facts collected from the UI.
   * @param {string[]} base64Images - JPEG images encoded in base64 (no data URI prefix).
   * @returns {Array<{type: string, text?: string, image_url?: string, detail?: string}>}
   *   Structured payload that pairs textual context with optional images.
   */
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

  /**
   * Issues a generation request to OpenAI, tuning the prompt based on mode/focus.
   * @param {Record<string, any>} data - Property data describing the listing.
   * @param {string[]} base64Images - Optional base64-encoded JPEG images.
   * @param {"listing" | "instagram"} mode - Determines base prompt and token limit.
   * @param {"images" | "data" | undefined} focus - Optional emphasis for the prompt.
   * @returns {Promise<import("openai").Responses.Response>} Raw API response payload.
   */
  async queryChatGPTClient(
    data,
    base64Images,
    mode,
    focus,
    searchZillowForMoreInfo
  ) {
    let max = this.MAX_LISTING_OUTPUT_TOKENS;
    let prompt = listingPrompt;
    if (mode === "instagram") {
      prompt = instagramPrompt;
      max = this.MAX_INSTAGRAM_TOKENS;
    }

    // Append optional focus instructions for the model.
    if (focus === "images") {
      prompt += imageFocus;
    } else if (focus === "data") {
      prompt += dataFocus;
    }

    let listingInfo;
    if (searchZillowForMoreInfo) {
      listingInfo = await this.getMlsNumberAndAgent(data);
    }

    let input = [];
    if (listingInfo && searchZillowForMoreInfo) {
      input.push({
        role: "developer",
        content: [
          { type: "input_text", text: `${JSON.stringify(listingInfo)}` },
        ],
      });
    }

    const response = await client.responses.create({
      model: this.GPT_MODEL,
      max_output_tokens: max,
      input: input.concat([
        {
          role: "developer",
          content: prompt,
        },
        {
          role: "user",
          content: this.getContentArray(data, base64Images),
        },
      ]),
    });
    console.log("CONTENT");
    console.log(response); // Track token consumption for observability.

    return response;
  }

  async getMlsNumberAndAgent(data) {
    try {
      const address = `${data.situsAddressLine1} ${data.situsCityStateZip}`;
      const ListingInformation = z.object({
        listed_by: z.string().nullable().optional().default(null),
        mls_number: z.string().nullable().optional().default(null),
      });

      const zillowInfo = await client.responses.parse({
        model: "gpt-5-mini",
        tools: [{ type: "web_search" }],
        input: [
          {
            role: "system",
            content: `Use zillow to find the listing information for this address: ${address}
        
              Look for:
              - Listed by: [Agent Name], [Agent Brokerage]
              - MLS #: [123456]
              
              IMPORTANT: If you cannot find specific information:
              - Do not make up or guess information
        `,
          },
        ],
        text: {
          format: zodTextFormat(ListingInformation, "Listing"),
        },
      });
      console.log("WEB SEARCH");
      console.log(zillowInfo);
      const listingInfo = zillowInfo.output_parsed;
      return listingInfo;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}

const chatGPTClient = new ChatGPTClient();
export default chatGPTClient;
