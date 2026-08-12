import type { Metadata } from "next";
import styles from "../coming-soon.module.css";

export const metadata: Metadata = {
  title: "Saraiva.AI is coming.",
  description: "Uma nova Saraiva.AI está sendo preparada.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title} aria-label="Saraiva.AI is coming.">
        Saraiva.AI is coming<span aria-hidden="true">.</span>
      </h1>
    </main>
  );
}
