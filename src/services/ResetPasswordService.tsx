import axios from "axios";

export const forgotPasswordAPI = async (
  newPassword: any,
  token: any
): Promise<any> => {
  const apiUrl: string = `${import.meta.env.VITE_BASE_URL}/forgot-password`;
  try {
    const response = await axios.post(apiUrl, { newPassword, token });
    return response?.data;
  } catch (error) {
    console.error("error in reset", error);
    throw error;
  }
};

export const resetPasswordLink = async (username: any): Promise<any> => {
  const apiUrl: string = `${import.meta.env.VITE_BASE_URL}/password-reset-link`;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirectUrl");
    // let redirectUrl = import.meta.env.VITE_FRONTEND_BASE_URL || "";
    // if (redirectUrl === "" && typeof window !== "undefined") {
    //   redirectUrl = window.location.origin;
    // }
    const response = await axios.post(apiUrl, { username, redirectUrl });
    return response?.data;
  } catch (error) {
    console.error("error in reset", error);
    throw error;
  }
};

// Uncomment and update this function if needed
// export const successfulNotification = async (
//   isQueue:boolean,
//   context: any,
//   key: any,
//   email: any
// ): Promise<any> => {
//   const apiUrl: string =   `${process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL}/notification/send`;
//   try {
//     const response = await axios.post(apiUrl, { isQueue, context, key, email });
//     console.log(email);
//     return response?.data;
//   } catch (error) {
//     console.error('error in reset', error);
//     throw error;
//   }
// };
