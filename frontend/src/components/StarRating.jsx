import styles from './StarRating.module.css';

// onChange가 있으면 눌러서 고르는 입력 모드, 없으면 점수만 보여주는 표시 모드.
function StarRating({ value, onChange }) {
  return (
    <span className={styles.stars} role={onChange ? "group" : "img"} aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = <span className={filled ? styles.on : styles.off}>★</span>;
        return onChange ? (
          <button type="button" key={n} className={styles.btn} onClick={() => onChange(n)} aria-label={`${n}`}>
            {star}
          </button>
        ) : (
          <span key={n} aria-hidden="true">{star}</span>
        );
      })}
    </span>
  );
}

export default StarRating;
