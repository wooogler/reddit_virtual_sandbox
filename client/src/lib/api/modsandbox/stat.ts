import axios from "axios";
import { Frequency, Recommend, Variation } from "./post";

export async function wordVariationAPI(token: string, keyword: string) {
  const response = await axios.post<Variation[]>(
    '/post/word_variation/',
    { keyword },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.data;
}

export async function wordFrequencyAPI(token: string, ids: number[]) {
  const response = await axios.post<Frequency[]>(
    '/spam/word_frequency/',
    { ids },
    {
      headers: { Authorization: `Token ${token}` },
    },
  );

  return response.data;
}

export async function orFilterAPI(token: string) {
  const response = await axios.post<Recommend[]>(
    '/spam/or_filter/',
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return response.data;
}

export async function andFilterAPI(token: string) {
  const response = await axios.post<Recommend[]>(
    '/spam/and_filter/',
    {},
    {
      headers: { Authorization: `Token ${token}` },
    }
  );

  return response.data;
}