class MontanaCadastral {
  SUMMARY_BASE_URL =
    "https://svc.mt.gov/msl/cadastralapi/api/v1/Properties/Summary?geocode=";

  async getPropertyData(geocode) {
    const url = `${this.SUMMARY_BASE_URL}${geocode}&taxYear=2025`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const json = await response.json();
    if (json.propertyId === 0) {
      throw new Error("No Property found for Geocode");
    }

    return json;
  }
}

const montanaCadastral = new MontanaCadastral();
export default montanaCadastral;
