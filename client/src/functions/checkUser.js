export const checkUser = async () => {
  try {
    const getTokenResponse = await fetch("http://localhost:5000/get-token", {
      method: "GET",
    });

    const getTokenResult = await getTokenResponse.json();

    if (getTokenResponse.ok) {
      return getTokenResult.token;
    } else {
      console.log(`Error retrieving token: ${getTokenResult.error}`);
      return "NO TOKEN"; // Return "NO TOKEN" if there is an error
    }
  } catch (error) {
    console.error("Error during token check:", error);
    return "NO TOKEN"; // Handle error scenarios
  }
};
