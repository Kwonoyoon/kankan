import { useState } from 'react';
import { sampleReviews } from '../data/mockData';
import { loadReviews, saveReviews } from '../lib/reviews';
import { todayISODate } from '../lib/reservations';

function useReviews() {
  const [mine, setMine] = useState(loadReviews);

  const all = [...mine, ...sampleReviews].sort((a, b) => b.date.localeCompare(a.date));

  function reviewsFor(spaceId) {
    return all.filter((r) => r.spaceId === spaceId);
  }

  // 평균은 소수 첫째 자리까지만 보여준다. 후기가 없으면 0.
  function ratingFor(spaceId) {
    const list = reviewsFor(spaceId);
    if (list.length === 0) return { avg: 0, count: 0 };
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length };
  }

  // userId가 없는 후기는 userId를 저장하기 전에 쓴 것이다. 그런 후기는 닉네임으로 내 것인지 판단한다.
  function reviewsBy(user) {
    if (!user) return [];
    return mine
      .filter((r) => (r.userId ? r.userId === user.id : r.nickname === user.nickname))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function addReview({ spaceId, rating, text, user }) {
    const next = [...mine, { id: `rv-${Date.now()}`, spaceId, userId: user.id, nickname: user.nickname, rating, text, date: todayISODate() }];
    setMine(next);
    saveReviews(next);
  }

  // 샘플 후기(mockData)는 mine에 없어서 지울 수 없다. 내가 쓴 후기만 지운다.
  function removeReview(id) {
    const next = mine.filter((r) => r.id !== id);
    setMine(next);
    saveReviews(next);
  }

  return { reviewsFor, ratingFor, reviewsBy, addReview, removeReview, allReviews: all };
}

export default useReviews;
