  export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload?.user || decodedPayload;
      
    } catch (err) {
      console.error("Error decoding token", err);
      return null;
    }
  };
