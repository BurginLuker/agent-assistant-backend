import montanaCadastral from "../DataSearching/MontanaCadestral.js";
import chatGPTClient from "../Model/ChatGPTClient.js";
import sharp from "sharp";

class ListingController {
  async optimizeImage(buffer) {
    return await sharp(buffer)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async generateListingDescription(geocode, images, res) {
    const propertyData = await montanaCadastral.getPropertyData(geocode);

    const base64Images = [];
    for (const image of images) {
      const optimizedBuffer = await this.optimizeImage(image.buffer);
      const base64String = optimizedBuffer.toString("base64");
      base64Images.push(base64String);
    }

    return await chatGPTClient.queryChatGPTClient(propertyData, base64Images);
  }
}

const listingController = new ListingController();
export default listingController;
