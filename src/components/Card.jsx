import styles from './Card.module.css';

function Card({ icon, title, text }) {
  // Pass the mouse position to CSS so the glow follows the cursor
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className={styles.card} onMouseMove={handleMove}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default Card;