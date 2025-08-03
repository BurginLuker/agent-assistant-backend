import { ChatGPTClient } from "../Model/ChatGPTClient";
import { MontanaCadastral } from "../DataSearching/MontanaCadestral";
class ListingController {
  CHAT_GPT_CLIENT = new ChatGPTClient();
  MONTANA_CADASTRAL_CLIENT = new MontanaCadastral();

  async generateListingDescription(geocode, images) {
    const propertyData =
      await this.MONTANA_CADASTRAL_CLIENT.getPropertyData(geocode);
    // const description =
    //   await this.CHAT_GPT_CLIENT.generateListingDescription(propertyData);

    return JSON.stringify(propertyData);
  }
}

const listingController = new ListingController();
export default listingController;
