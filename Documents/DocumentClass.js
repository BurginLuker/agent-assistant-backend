export class DocumentClass {
  database;
  collection;

  constructor(db, collection) {
    this.database = db;
    this.collection = collection;
  }

  getCollection() {
    return this.database.collection(this.collection);
  }

  getFullResponseArray(response) {
    const docs = [];
    response.forEach((doc) => {
      docs.push({
        id: doc.id, // Include the document ID
        ...doc.data(), // Spread the document data
      });
    });

    return docs;
  }

  async create(...args) {
    throw new Error("create() must be implemented");
  }
  async read(...args) {
    throw new Error("read() must be implemented");
  }

  async update(...args) {
    throw new Error("update() must be implemented");
  }
  async delete(...args) {
    throw new Error("delete() must be implemented");
  }
}
