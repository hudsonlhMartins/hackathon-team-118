import { ISellerRepository, SellerType } from "../ISellerRepository.ts";

export class MasterdataSellerRepository implements ISellerRepository {
  private urlBase: string = "https://agenciam3ar.myvtex.com/";
  private token: string =
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IjMyQUM3M0JGRTI1RDJGMDY1MUIzRjc0OEFBNUU3Rjc4MzYyMUZEMUMiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJodWdvLmNvcnJlaWFAYWdlbmNpYW0zLmNvbSIsImFjY291bnQiOiJhZ2VuY2lhbTNhciIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiZWNhYmQ4NGUtNjIwYi00ZWI2LWE1YzEtZDA1YWM5OWQ1MmUzIiwiZXhwIjoxNjk5Mjc3MDMzLCJ1c2VySWQiOiJiMmFlNDgyMC02MTZiLTQ1NzktYmUzZi05OTU0NmNkMGU5MTciLCJpYXQiOjE2OTkxOTA2MzMsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI3ZTRkZTE1NS05MzI2LTRiYTUtYjY5MC02OGRkYzhiNDY1ZjcifQ.dc6JhxBlciwh2o8b6p1oPmBKoBFMJX3uUjZC2X-DD1cx_8iddHm3aorBsa9DYVZ6xrQYtoeFC14zxB4sKKaPxg";

  async updateStatus(email: string, status: boolean): Promise<boolean> {
    const data = await this.findByEmail(email);

    if (!data) return false;

    const { id, email: emailRes } = data[0];

    const url = `${this.urlBase}/api/dataentities/CL/documents/${id}`;

    try {
      const updateStatus = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "VtexIdclientAutCookie": this.token,
        },
        method: "PATCH",
        body: JSON.stringify({
          isActive: status,
          email: emailRes,
        }),
      });

      const res = await updateStatus.json();

      return true;
    } catch (err) {
      return false;
    }
  }

  async findByEmail(email: string): Promise<SellerType[] | false> {
    const url =
      `${this.urlBase}/api/dataentities/CL/search?email=${email}&_fields=isActive,email,userId,isSeller,sellerCategoryIds,id`;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "VtexIdclientAutCookie": this.token,
        },
        method: "GET",
      });

      const data = await res.json() as SellerType[];

      return data;
    } catch (err) {
      return false;
    }
  }

  async listSeller(): Promise<SellerType | []> {
    const url =
      `${this.urlBase}/api/dataentities/CL/search?isSeller=true&_fields=isActive,email,userId,isSeller,sellerCategoryIds,id`;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "VtexIdclientAutCookie": this.token,
        },
        method: "GET",
      });

      const data = await res.json() as SellerType;

      return data;
    } catch (err) {
      return [];
    }
  }
}
