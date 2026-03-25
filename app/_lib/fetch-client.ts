export const customFetchClient = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  const response = await fetch(requestUrl, {
    ...options,
    credentials: "include",
  });
  const data = await response.json();
  return { status: response.status, data, headers: response.headers } as T;
};
