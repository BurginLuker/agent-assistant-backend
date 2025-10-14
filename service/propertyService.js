import supabase from "../utils/supabaseClient.js";
import crypto from "crypto";
import MontanaCadastral from "../utils/montanaCadastral/montanaCadastral.js";
import PropertyRepository from "../repository/propertyRepository.js";
import propertyFilesRepository from "../repository/propertyFilesRepository.js";
import propertyRepository from "../repository/propertyRepository.js";

class PropertyService {
  async uploadImages(images) {
    const uploads = [];
    for (const image of images) {
      const uuid = crypto.randomUUID();
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(`${uuid}-${image.originalname}`, image.buffer, {
          contentType: image.mimetype,
          upsert: false,
        });
      if (error) {
        throw error;
      }
      uploads.push({
        originalname: image.originalname,
        size: image.size,
        data: data,
      });
    }
    return uploads;
  }

  async createNewProperty(user, geocode, images) {
    if (!geocode || images.length === 0) {
      throw new Error("Must have geocode and files");
    }
    const cadastralData = await MontanaCadastral.getPropertyData(geocode);
    const address =
      cadastralData.situsAddressLine1 ||
      "NO_ADDRESS" + cadastralData.situsCityStateZip;
    const newProperty = await PropertyRepository.create(
      user,
      cadastralData,
      address,
      geocode
    );
    const uploads = await this.uploadImages(images);

    const uploadInsertData = uploads.map((f) => {
      return {
        id: f.data.id,
        property_id: newProperty.id,
        full_path: f.data.path,
        original_name: f.originalname,
        size: f.size,
      };
    });
    await propertyFilesRepository.create(uploadInsertData);
  }

  async findPropertiesByUser(user) {
    if (!user) {
      throw new Error("No user provided");
    }
    const response = await propertyRepository.findByUserId(user.user_id);

    const properties = [];
    for (const property of response) {
      const images = [];
      for (const file of property.PropertyFiles) {
        const { data: signedUrl, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(file.full_path);
        if (error) {
          throw error;
        }
        images.push(signedUrl.publicUrl);
      }
      properties.push({
        id: property.id,
        address: property.address,
        geocode: property.geocode,
        images: images,
      });
    }

    return properties;
  }

  async propertyBelongsToUser(user, propertyId) {
    const property = await propertyRepository.findPropertyId(propertyId, user);
    if (!property) {
      throw new Error("property not found");
    }
  }

  async findPropertyById(user, propertyId) {
    await this.propertyBelongsToUser(user, propertyId);
    return await propertyRepository.findPropertyById(propertyId);
  }
}

export default new PropertyService();
