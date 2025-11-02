import propertyRepository from "../repository/propertyRepository.js";
import gptClient from "../utils/gpt/gptClient.js";
import contentRepository from "../repository/contentRepository.js";
import propertyService from "./propertyService.js";
import propertyFilesRepository from "../repository/propertyFilesRepository.js";
import supabase from "../utils/supabaseClient.js";
import sharp from "sharp";
import montanaCadastral from "../utils/montanaCadastral/montanaCadastral.js";

class ContentService {
  async optimizeImage(buffer) {
    return await sharp(buffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async getImageBuffers(images) {
    const buffers = [];
    for (const image of images) {
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .download(image.full_path);
      if (error) {
        throw error;
      }
      const arrayBuffer = await data.arrayBuffer();

      // Convert ArrayBuffer to Buffer for sharp
      const buffer = Buffer.from(arrayBuffer);

      // Await the optimization
      const optimized = await this.optimizeImage(buffer);

      // Convert optimized buffer to base64
      const base64 = optimized.toString("base64");
      buffers.push(base64);
    }
    return buffers;
  }

  async create(user, type, propertyId, res) {
    await propertyService.propertyBelongsToUser(user, propertyId);

    // Get the geocode which will be used to snag data from montana cadastral api
    const { geocode } = await propertyRepository.findPropertyById(
      propertyId,
      user
    );

    // String version of useful property data
    const propertyData = await montanaCadastral.getPropertyDataForGPT(
      geocode,
      type
    );

    const propertyPhotos =
      await propertyFilesRepository.findByPropertyId(propertyId);
    const optimizedImages = await this.getImageBuffers(propertyPhotos);

    // Begin streaming of the gpt response
    const response = await gptClient.query(
      res,
      type,
      propertyData,
      optimizedImages
    );

    // Save the output data and its token usage
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const content = await contentRepository.create(
      propertyId,
      response.content,
      type,
      inputTokens,
      outputTokens
    );

    return response;
  }

  async getPropertyContentHistory(user, propertyId) {
    await propertyService.propertyBelongsToUser(user, propertyId);

    const history = await contentRepository.findContentByPropertyId(propertyId);
    return history;
  }
}

export default new ContentService();
