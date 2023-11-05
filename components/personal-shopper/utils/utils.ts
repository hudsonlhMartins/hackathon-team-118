import { SellerType } from "$store/service/repositories/ISellerRepository.ts";

export async function checkAuth() {
  const url = "/no-cache/profileSystem/getProfile";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = {
      UserId: "b2ae4820-616b-4579-be3f-99546cd0e917",
      IsReturningUser: false,
      IsUserDefined: true,
      IsPJ: false,
      FirstName: "qwe",
      LastName: "qwe",
      Gender: null,
      Email: "teste@teste.com",
    };

    return {
      auth: data.IsUserDefined,
      profileData: data.IsUserDefined ? data : null,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function checkSeller(email: string | undefined) {
  try {
    const resp = await fetch("/check-seller?email=" + email);

    const sellerData: SellerType[] | false = await resp.json();

    if (!sellerData) return { isSeller: false, sellerCategories: "" };

    const { sellerCategoryIds, isSeller } = sellerData[0];

    return { isSeller, sellerCategories: sellerCategoryIds };
  } catch (error) {
    return { isSeller: false, sellerCategories: "" };
  }
}

export function formatMessage(message: string) {
  const urlRegex = /((https?:|www\.)\S+\w)/g;

  const formattedText = message.replace(urlRegex, (url) => {
    let fullURL = url;
    if (!url.startsWith("http")) {
      fullURL = `https://${url}`;
    }

    return `<a href="${fullURL}" target="_blank" class="underline">${url}</a>`;
  });

  return formattedText;
}
