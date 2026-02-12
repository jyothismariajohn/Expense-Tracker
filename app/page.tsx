import DashboardStats from './components/DashboardStats';
import styles from './page.module.css';

export default function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.welcome}>Welcome back, Management</h1>
        <p className={styles.date}>{currentDate}</p>
      </header>

      <DashboardStats />

      <section>
        <h2 className={styles.sectionTitle}>Recent Expenses</h2>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <p>Recent transactions will appear here.</p>
        </div>
      </section>
    </div>
  );
}
