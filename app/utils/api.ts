interface RequestBody {
  query: string;
  returnSecureToken?: boolean;
}

interface ApiResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export const fetchHandler = async (requestData: RequestBody): Promise<ApiResponse> => {
  const url = "https://api.deepseek.com/v1/chat/completions"
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: requestData.query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        returnSecureToken: requestData.returnSecureToken || false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch data');
  }
} 