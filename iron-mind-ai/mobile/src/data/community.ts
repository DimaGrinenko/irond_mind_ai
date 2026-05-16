export type CommunityPost = {
  id: string;
  name: string;
  timeAgo: string;
  title: string;
  subtitle: string;
};

export const communityPosts: CommunityPost[] = [
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

