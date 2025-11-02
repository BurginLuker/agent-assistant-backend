class MontanaCadastral {
  SUMMARY_BASE_URL =
    "https://svc.mt.gov/msl/cadastralapi/api/v1/Properties/Summary?geocode=";
  DWELLING_BASE_URL =
    "https://svc.mt.gov/msl/cadastralapi/api/Dwelling?geocode=";

  CURRENT_YEAR = new Date().getFullYear();

  async getPropertyData(geocode) {
    const summaryURL = `${this.SUMMARY_BASE_URL}${geocode}&taxYear=${this.CURRENT_YEAR}`;
    const dwellingURL = `${this.DWELLING_BASE_URL}${geocode}&taxYear=${this.CURRENT_YEAR}`;

    const [summaryResponse, dwellingResponse] = await Promise.all([
      fetch(summaryURL),
      fetch(dwellingURL),
    ]);

    const [summaryJson, dwellingJson] = await Promise.all([
      summaryResponse.json(),
      dwellingResponse.json(),
    ]);

    return { summaryJson, dwellingJson };
  }

  async getPropertyDataForGPT(geocode, type) {
    const { summaryJson, dwellingJson } = await this.getPropertyData(geocode);

    // Collect the acres and the address
    const totalAcres = summaryJson.totalMarketAcres;
    const address = summaryJson.situsAddressLine1;

    // One day could use this to determine dwelling amount?
    const livingUnits = summaryJson.livingUnits;

    // One day will need to include all dwellings intelligently
    // It seems possible that a geocode could have multiple dwellings
    // Unlikely given the current use of my service however
    const details = dwellingJson[0].details[0];

    const {
      // yearBuilt, Do not include, commenting out in case one day it is wanted
      bedrooms,
      fullBaths,
      halfBaths,
      heatedArea: sqftEstimate,
    } = details;

    const dataDictionary = {
      "Total Acres": totalAcres,
      Address: address,
      Bedrooms: bedrooms,
      "Full Baths": fullBaths,
      "Half Baths": halfBaths,
      "Square Footage": sqftEstimate,
    };

    // Remove address for descriptions, its implied
    if (type === "description") {
      delete dataDictionary.Address;
    }

    return Object.entries(dataDictionary)
      .map(([label, value]) => `${label}: ${value ?? "N/A"}`)
      .join(", ");
  }
}

export default new MontanaCadastral();
