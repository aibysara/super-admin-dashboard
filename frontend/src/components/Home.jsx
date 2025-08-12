import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome to the System</h2>
      <p className={styles.paragraph}>Please choose your login type:</p>

      <Link to="/login/superadmin" style={{ textDecoration: 'none' }}>
        <button className={`${styles.button} ${styles.superadminBtn}`}>Super Admin Login</button>
      </Link>

      <Link to="/login/user" style={{ textDecoration: 'none' }}>
        <button className={`${styles.button} ${styles.userBtn}`}>User Login</button>
      </Link>
    </div>
  );
}

export default Home;
