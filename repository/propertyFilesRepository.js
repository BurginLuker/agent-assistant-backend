import supabase from "../utils/supabaseClient.js";
class PropertyFilesRepository {
  table = "PropertyFiles";
  async create(uploads) {
    const { error } = await supabase.from(this.table).insert(uploads);
    if (error) {
      throw error;
    }
  }

  async findByPropertyId(propertyId) {
    const { data, error } = await supabase
      .from(this.table)
      .select()
      .eq("property_id", propertyId);
    if (error) {
      throw error;
    }
    return data;
  }
}
export default new PropertyFilesRepository();
