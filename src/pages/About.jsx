import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';
import Reveal from '../components/Reveal.jsx';
import styles from './About.module.css';

const audiences = [
  {
    title: 'Students',
    text: 'A clear list of what to do next, what is late and how they are doing, without hunting through chat groups and shared folders.',
  },
  {
    title: 'Teachers',
    text: 'One place to publish material, collect work and give feedback, so evenings go to teaching instead of sorting files.',
  },
  {
    title: 'Administrators',
    text: 'A simple view of which courses are running and how classes are progressing, without chasing every teacher for an update.',
  },
];

const principles = [
  {
    title: 'Keep it simple',
    text: 'If a teacher needs a manual to post an assignment, we have designed it wrong. We cut steps until the everyday tasks take seconds.',
  },
  {
    title: 'Build with the people who use it',
    text: 'We talk to teachers and students before adding a feature, and we remove the ones nobody touches.',
  },
  {
    title: 'Be honest about progress',
    text: 'Grades and completion should show how a student is really doing, early enough to help, not only at the end of term.',
  },
];

export default function About() {
  usePageTitle('About');

  return (
    <>
      <section className={`container ${styles.intro}`}>
        <p className="eyebrow anim-up">About BICSXM</p>
        <h1 className="anim-up" style={{ '--d': '0.08s' }}>
          Software that stays out of the way of learning.
        </h1>
        <p className="anim-up" style={{ '--d': '0.16s' }}>
          BICSXM is a technology company. We build a learning management
          system: the place where a class keeps its lessons, deadlines,
          submissions and results. It is made for schools, training centres and
          the students who attend them.
        </p>
      </section>

      <section className="container section">
        <Reveal>
          <h2 className={styles.heading}>Who we build for</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className={styles.audience}>
            {audiences.map((a) => (
              <div key={a.title} className={styles.audienceItem}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container section">
        <div className={styles.principles}>
          <Reveal>
            <div className={styles.sticky}>
              <p className="eyebrow">How we work</p>
              <h2 className={styles.heading}>Three habits we hold ourselves to</h2>
            </div>
          </Reveal>

          <div>
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className={styles.principle}>
                  <span className={styles.no}>0{i + 1}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`container ${styles.end}`}>
        <h2>Wondering how it would work for your classes?</h2>
        <Link to="/contact" className="btn btn--primary">Get in touch</Link>
      </section>
    </>
  );
}