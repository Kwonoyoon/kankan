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

  function addReview({ spaceId, rating, text, nickname }) {
    const next = [...mine, { id: `rv-${Date.now()}`, spaceId, nickname, rating, text, date: todayISODate() }];
    setMine(next);
    saveReviews(next);
  }

  return { reviewsFor, ratingFor, addReview };
}

export default useReviews;
