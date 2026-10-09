import { Link } from 'react-router-dom'
import logo from '../../assets/JelaniCon-Logo.png'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.about}>
          <span className={styles.brand}><img src={logo} alt="Jelani Consulting" className={styles.logo} /></span>
          <p>Career-focused courses taught by industry practitioners, with hiring partners ready to meet you.</p>
        </div>
        <nav className={styles.col} aria-label="Learn">
          <h4>Learn</h4>
          <Link to="/courses">All courses</Link>
          <Link to="/posts">News</Link>
          <a href="/#branches">Branches</a>
          <a href="/#alumni">Alumni success</a>
        </nav>
        <nav className={styles.col} aria-label="Company">
          <h4>Company</h4>
          <a href="/#about">About us</a>
          <a href="/#staff">Our team</a>
          <Link to="/support">Customer service</Link>
        </nav>
      </div>
      <p className={styles.legal}>© {new Date().getFullYear()} Jelani Consulting · jelani.consulting. All rights reserved.</p>
    </footer>
  )
}
