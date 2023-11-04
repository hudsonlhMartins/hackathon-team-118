import { ISellerRepository, SellerType } from "../ISellerRepository.ts";

export class MasterdataSellerRepository implements ISellerRepository {
  private urlBase: string = "https://agenciam3ar.myvtex.com/";
  private token: string =
    "eyJhbGciOiJFUzI1NiIsImtpZCI6Ijg5RUVBMDM0RjVBRDEzMzZCNTVGNDA2MEEwMDA3QkE4OEFBQkE4OTMiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJodWdvLmNvcnJlaWFAYWdlbmNpYW0zLmNvbSIsImFjY291bnQiOiJhZ2VuY2lhbTNhciIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiMTcyY2UxNjQtOTE4ZS00MmRiLTk5YWMtNmJhZjYwNzM5N2U0IiwiZXhwIjoxNjk5MTgwNTEzLCJ1c2VySWQiOiJiMmFlNDgyMC02MTZiLTQ1NzktYmUzZi05OTU0NmNkMGU5MTciLCJpYXQiOjE2OTkwOTQxMTMsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI3Y2EzM2UyMC0wZDRmLTQwZTUtYmQ0Ny1jZmFiMzkzYTM5ZjQifQ.ue7FJe0Y3B_FgF78V9NeH2Y4CwkXjtzr7kQKCEYlDx1CQKlnWM-kgK_mAzZQmVwbZyl5HEbM8lvV3ul67vW-EA";

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
