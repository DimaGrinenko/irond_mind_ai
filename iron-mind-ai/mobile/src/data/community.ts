import type { Lang } from '../i18n';

export type CommunityPost = {
  id: string;
  name: string;
  timeAgo: string;
  title: string;
  subtitle: string;
};

const POSTS_RU: CommunityPost[] = [
  {
    id: 'p1',
    name: 'Дмитрий',
    timeAgo: '2 часа назад',
    title: 'Закончил свою тренировку',
    subtitle: 'Верх тела 💪',
  },
  {
    id: 'p2',
    name: 'Алексей',
    timeAgo: 'вчера',
    title: 'Новый рекорд в жиме',
    subtitle: '100 кг × 5',
  },
];

const POSTS_EN: CommunityPost[] = [
  {
    id: 'p1',
    name: 'Dmitry',
    timeAgo: '2 hours ago',
    title: 'Finished my workout',
    subtitle: 'Upper body 💪',
  },
  {
    id: 'p2',
    name: 'Alexey',
    timeAgo: 'yesterday',
    title: 'New bench PR',
    subtitle: '100 kg × 5',
  },
];

/** Localized mock community feed. */
export function communityPosts(lang: Lang): CommunityPost[] {
  return lang === 'en' ? POSTS_EN : POSTS_RU;
}
