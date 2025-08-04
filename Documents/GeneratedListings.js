import { DocumentClass } from "./DocumentClass.js";
import { db } from "../Middleware/firebase-config.js";

const collection = "GeneratedListings";
class GeneratedListings extends DocumentClass {
  constructor() {
    super(db, collection);
  }

  async create(document) {
    await this.getCollection().add(document);
  }

  async getDocumentsByUserId(userId) {
    const response = await this.getCollection()
      .where("user_id", "==", userId)
      .get();

    const docs = this.getFullResponseArray(response);

    return docs.map((doc) => ({
      home_address: doc.home_address,
      timestamp: doc.timestamp,
      geocode: doc.geocode,
      gpt_response: doc.gpt_response,
      id: doc.id,
    }));
  }
}

const generatedListings = new GeneratedListings();
export default generatedListings;
