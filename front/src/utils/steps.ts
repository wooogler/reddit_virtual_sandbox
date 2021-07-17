import { ReactourStep } from "reactour";

export const stepsModSandbox: ReactourStep[] = [
  {
    selector: '[data-tour="subreddit"]',
    content:
      "you can see what's been posted to the community during the first week of May 2021",
  },
  {
    selector: '[data-tour="search"]',
    content:
      'You can search for posts that contain the word in the posts using the search function.',
  },
  {
    selector: '[data-tour="sort"]',
    content:
      'You can sort the posts by new or top, which puts high score posts up.',
  },
  {
    selector: '[data-tour="sort"]',
    content:
      'Sort by "Smart" displays the posts that are likely to be false alarms among the filtered posts and likely to be the misses among the not filtered posts',
  },
  {
    selector: '[data-tour="post-collection"]',
    content:
      'Post collections allow you to store the posts that are reviewed and judged.',
  },
  {
    selector: '[data-tour="move-to"]',
    content: 'You can bring the posts from the community',
  },
  {
    selector: '[data-tour="create-post"]',
    content: 'Or create your own post in the system.',
  },
  {
    selector: '[data-tour="configuration"]',
    content:
      'you can write down the AutoMod configuration to test AutoMod with the posts on the left side.',
  },
  {
    selector: '[data-tour="guide"]',
    content:
      'If you click the guide, then you can see the same guide for AutoMod configuration.',
  },
  {
    selector: '[data-tour="configuration-analysis"]',
    content:
      'You can use a configuration analysis tool to understand how your AutoMod worked.',
  },
];

export const stepsSandbox: ReactourStep[] = [
  {
    selector: '[data-tour="subreddit"]',
    content:
      "you can see what's been posted to the community during the first week of May 2021",
  },
  {
    selector: '[data-tour="search"]',
    content:
      'You can search for posts that contain the word in the posts using the search function.',
  },
  {
    selector: '[data-tour="sort"]',
    content:
      'You can sort the posts by new or top, which puts high score posts up.',
  },
  {
    selector: '[data-tour="testing-subreddit"]',
    content:
      'Testing subreddit is your private subreddit',
  },
  {
    selector: '[data-tour="create-post"]',
    content: 'You can create your own post in the system to test your configuration',
  },
  {
    selector: '[data-tour="configuration"]',
    content:
      'you can write down the AutoMod configuration to test AutoMod with the posts on the left side.',
  },
  {
    selector: '[data-tour="guide"]',
    content:
      'If you click the guide, then you can see the same guide for AutoMod configuration.',
  },
];

export const stepsBaseline: ReactourStep[] = [
  {
    selector: '[data-tour="subreddit"]',
    content:
      "you can see what's been posted to the community during the first week of May 2021",
  },
  {
    selector: '[data-tour="search"]',
    content:
      'You can search for posts that contain the word in the posts using the search function.',
  },
  {
    selector: '[data-tour="sort"]',
    content:
      'You can sort the posts by new or top, which puts high score posts up.',
  },
  {
    selector: '[data-tour="testing-subreddit"]',
    content:
      'Testing subreddit is your private subreddit',
  },
  {
    selector: '[data-tour="create-post"]',
    content: 'You can create your own post in the system to test your configuration',
  },
  {
    selector: '[data-tour="configuration"]',
    content:
      'you can write down the AutoMod configuration to test AutoMod with the posts on the left side.',
  },
  {
    selector: '[data-tour="guide"]',
    content:
      'If you click the guide, then you can see the same guide for AutoMod configuration.',
  },
];