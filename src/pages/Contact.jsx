import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { site } from '../siteConfig.js';
import usePageTitle from '../hooks/usePageTitle.js';
import styles from './Contact.module.css';

export default function Contact() {
  usePageTitle('Contact');

  // Coming from a course page? /contact?course=Python%20for%20Beginners
  const [params] = useSearchParams();
  const course = params.get('course');

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: course ? `Hi, I would like to know more about "${course}".` : '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status === 'sent') setStatus('idle');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    console.log('Form data:', form); // later: send this to your backend or an email service

    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    }, 900);
  };

  return (
    <section className={`container ${styles.wrap}`}>
      <div>
        <p className="eyebrow anim-up">Contact</p>
        <h1 className="anim-up" style={{ '--d': '0.08s' }}>Tell us about your classes.</h1>
        <p className={`${styles.lead} anim-up`} style={{ '--d': '0.16s' }}>
          Whether you run a school, a training centre or a single course, send
          a few details and we will get back to you by email.
        </p>

        <h2 className={styles.subhead}>Helpful to include</h2>
        <ul className={styles.list}>
          <li>The name of your school or centre</li>
          <li>Roughly how many students and teachers you have</li>
          <li>How you manage courses and assignments today</li>
        </ul>

        <p className={styles.direct}>
          Prefer email? Write to <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>

      <form className={`${styles.form} anim-up`} style={{ '--d': '0.2s' }} onSubmit={handleSubmit}>
        {status === 'sent' && (
          <p className={styles.success} role="status">
            Thanks, your message has been received.
          </p>
        )}

        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" className={styles.input}
            value={form.name} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={styles.input}
            value={form.email} onChange={handleChange} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="6" className={styles.input}
            value={form.message} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </section>
  );
}