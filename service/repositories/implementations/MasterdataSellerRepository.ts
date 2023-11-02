import { ISellerRepository, SellerType } from "../ISellerRepository.ts";

export class MasterdataSellerRepository implements ISellerRepository {
  private urlBase: string = "https://agenciam3ar.myvtex.com/";
  private token: string =
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IjI1QTFGMDY5OTg1ODIzQUQ0NzgwMTdDNjI5M0ZENUFCMzY3NEMyRjAiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJodWdvLmNvcnJlaWFAYWdlbmNpYW0zLmNvbSIsImFjY291bnQiOiJhZ2VuY2lhbTNhciIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiNDc4ZWZiZjEtNDIyOC00MDllLWJkM2MtNjVkYTBhN2MzODIwIiwiZXhwIjoxNjk5MDM2NjczLCJ1c2VySWQiOiJiMmFlNDgyMC02MTZiLTQ1NzktYmUzZi05OTU0NmNkMGU5MTciLCJpYXQiOjE2OTg5NTAyNzMsImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiI3ZTNkMDE0MS0zYTYxLTQ0YTEtYTJmMi1jOTQ4YTM5NTVhMGYifQ.g0fvV_deCCN7lU6x2P6M5PjfZHgWM0VTKGxW3vxbEcRAHIdv4pAc5-5etZKdfV74XbfCZwwKQfjKmmL2t_pfAg";

  async updateStatus(email: string, status: boolean): Promise<boolean> {
    const data = await this.findByEmail(email);

    if (!data) return false;

    const { id, email: emailRes } = data;

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

  async findByEmail(email: string): Promise<SellerType | false> {
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

      const data = await res.json() as SellerType;

      return data;
    } catch (err) {
      return false;
    }
  }
}
