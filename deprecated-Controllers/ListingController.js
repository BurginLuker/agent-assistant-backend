import montanaCadastral from "../DataSearching/MontanaCadestral.js";
import chatGPTClient from "../Model/ChatGPTClient.js";
import sharp from "sharp";
import generatedListings from "../Documents/GeneratedListings.js";

class ListingController {
  async optimizeImage(buffer) {
    return await sharp(buffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async logGeneratedDescription(propertyData, gptResponse, user) {
    try {
      const logData = {
        geocode: propertyData.geoCode || "undefined",
        gpt_response: gptResponse.output_text,
        home_address:
          propertyData.situsAddressLine1 ||
          "NO_ADDRESS" + propertyData.situsCityStateZip ||
          "",
        input_tokens: gptResponse.usage.input_tokens,
        output_tokens: gptResponse.usage.output_tokens,
        timestamp: new Date(),
        total_total: gptResponse.usage.total_tokens,
        user_id: user.user_id,
      };
      await generatedListings.create(logData);
    } catch (err) {
      console.log(err);
    }
  }

  async generateListingDescription(
    geocode,
    images,
    user,
    mode,
    focus,
    searchZillowForMoreInfo
  ) {
    const propertyData = await montanaCadastral.getPropertyData(geocode);

    const base64Images = [];
    for (const image of images) {
      const optimizedBuffer = await this.optimizeImage(image.buffer);
      const base64String = optimizedBuffer.toString("base64");
      base64Images.push(base64String);
    }

    const gptResponse = await chatGPTClient.queryChatGPTClient(
      propertyData,
      base64Images,
      mode,
      focus,
      searchZillowForMoreInfo
    );

    await this.logGeneratedDescription(propertyData, gptResponse, user);
    return gptResponse.output_text;
  }
}

const listingController = new ListingController();
export default listingController;
