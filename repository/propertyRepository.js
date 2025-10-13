import supabase from "../utils/supabaseClient.js";
class PropertyRepository {
  table = "Property";
  async create(user, cadastral_data, address, geocode) {
    const { data, error } = await supabase
      .from(this.table)
      .insert({
        user_id: user.user_id,
        cadastral_data: cadastral_data,
        address: address,
        updated_at: new Date(),
        geocode: geocode,
      })
      .select();
    if (error) {
      throw error;
    }
    return data[0];
  }

  async findPropertyId(property_id, user) {
    const { data, error } = await supabase
      .from(this.table)
      .select("id")
      .eq("id", property_id, "user_id", user.user_id);
    return data;
  }

  async findByUserId(user_id) {
    const { data, error } = await supabase
      .from(this.table)
      .select(
        `
    id,    
    address,
    geocode,
    PropertyFiles (*)
  `
      )
      .eq("user_id", user_id)
      .not("geocode", "is", null)
      .order("updated_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  }

  async findPropertyById(propertyId) {
    const { data, error } = await supabase
      .from(this.table)
      .select("geocode,address,id")
      .eq("id", propertyId);

    if (error) {
      throw error;
    }
    return data[0];
  }

  async findCadastralData(propertyId) {
    const { data, error } = await supabase
      .from(this.table)
      .select("cadastral_data")
      .eq("id", propertyId);

    if (error) {
      throw error;
    }
    return data[0];
  }
}
export default new PropertyRepository();
