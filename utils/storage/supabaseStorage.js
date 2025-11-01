import supabase from "../supabaseClient.js";

class SupabaseStorage {
  async deleteFiles(filePaths) {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return true;
    }

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove(filePaths);

    if (error) {
      throw error;
    }

    return data ?? [];
  }
}

export default new SupabaseStorage();
