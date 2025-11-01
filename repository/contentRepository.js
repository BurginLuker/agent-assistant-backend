import supabase from "../utils/supabaseClient.js";
class ContentRepository {
  table = "Content";
  async create(property_id, content, type, input_tokens, output_tokens) {
    const { data, error } = await supabase
      .from(this.table)
      .insert({
        property_id,
        content,
        type,
        input_tokens,
        output_tokens,
      })
      .select();
    if (error) {
      throw error;
    }

    return data;
  }

  async findContentByPropertyId(property_id) {
    const { data, error } = await supabase
      .from(this.table)
      .select("content, type, created_at, id")
      .eq("property_id", property_id)
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteContentByIds(contentIds) {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .in("id", contentIds);
    if (error) {
      throw error;
    }
    return data;
  }
}
export default new ContentRepository();
