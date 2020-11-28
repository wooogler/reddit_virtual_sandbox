import axios from 'axios';
import { SpamComment } from './spamComment';
import { SpamSubmission } from './spamSubmission';

export async function getSpamPostsAPI() {
  const response = await axios.get<{ data: (SpamSubmission|SpamComment)[] }>(
    'http://localhost:4000/spam_posts',
  );
  return response.data;
}