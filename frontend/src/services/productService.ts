const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const analyzeProductImage = async (imageUri: string) => {
  if (!imageUri) {
    throw new Error("Image URI is required for analysis.");
  }

  try {
    // Convert the base64/blob URI to a File object
    const res = await fetch(imageUri);
    const blob = await res.blob();
    const file = new File([blob], "product.jpg", { type: blob.type });

    // Create form data
    const formData = new FormData();
    formData.append("image", file);

    // Make the API call
    const apiResponse = await fetch(`${API_BASE_URL}/products/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!apiResponse.ok) {
      // Handle non-2xx responses
      const errorData = await apiResponse.json().catch(() => ({ message: "Ошибка анализа продукта" }));
      throw new Error(errorData.message || "Ошибка сервера");
    }

    const data = await apiResponse.json();

    // Normalize data to handle different key names from the backend
    const normalizedData = {
      ...data,
      productName: data.productName || data.product_name || "",
      brand: data.brand || "",
    };
    
    // Check if the result is meaningful
    if (
      normalizedData.status === "irrelevant" ||
      !normalizedData.ingredients?.length ||
      !normalizedData.productName
    ) {
      return {
        status: "irrelevant",
        confidence: "0",
        productName: "Неопознанный объект",
        ingredients: [],
        concerns: [],
        certification: null,
        recommendation:
          "На фото не обнаружен пищевой продукт. Пожалуйста, сфотографируйте этикетку продукта питания с четко видимым составом.",
      };
    }

    return normalizedData;
  } catch (err) {
    // Re-throw the error to be caught by the component
    throw err;
  }
}; 