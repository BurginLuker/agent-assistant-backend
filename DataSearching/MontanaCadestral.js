export class MontanaCadastral {
  SUMMARY_BASE_URL =
    "https://svc.mt.gov/msl/cadastralapi/api/v1/Properties/Summary?geocode=";

  async getPropertyData(geocode) {
    const response = await fetch(`${this.SUMMARY_BASE_URL}${geocode}`);
    return await response.json();
  }
}
