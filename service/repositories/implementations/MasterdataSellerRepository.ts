import { ISellerRepository, SellerType } from "../ISellerRepository.ts";

export class MasterdataSellerRepository implements ISellerRepository {
  private urlBase: string = "https://agenciam3ar.myvtex.com/";
  private token: string =
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IjVBMzAzMzE2OUVEMEM5RDEyMENEOUU4NTc0MEM0OThDMEU1QTk4REYiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJodWdvLmNvcnJlaWFAYWdlbmNpYW0zLmNvbSIsImFjY291bnQiOiJhZ2VuY2lhbTNhciIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiMGU4YTlhNjUtODQ2MC00YTFhLWI2ZmYtNDc3ODdkMDkxZTJkIiwiZXhwIjoxNjk5MTM2NzEyLCJ1c2VySWQiOiJiMmFlNDgyMC02MTZiLTQ1NzktYmUzZi05OTU0NmNkMGU5MTciLCJpYXQiOjE2OTkwNTAzMTIsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiJhZGU1OTk5ZC1iOTNjLTQ4M2EtYjU4My01ZTNhYzExMDU3OTcifQ.gD3paNDpEVub8yQLwQOeN63ufeDUFwiqpInd3znESWzBmOnGUFzlumlxdFzu_jvcUG3XhyWJxzCzjUIJznRHgw";

  async updateStatus(email: string, status: boolean): Promise<boolean> {
    const data = await this.findByEmail(email);
    console.log("MasterdataSellerRepository.ts -> data", data);

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
      console.log("MasterdataSellerRepository.ts -> res", res);

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
