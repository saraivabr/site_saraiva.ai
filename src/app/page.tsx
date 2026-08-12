import styles from "./coming-soon.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title} aria-label="Saraiva.AI is coming.">
        Saraiva.AI is coming<span aria-hidden="true">.</span>
      </h1>
    </main>
  );
}
