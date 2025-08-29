import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex space-x-4 *:p-4 bg-gray-800 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/datapipeline">Data Pipeline</Link>
        </li>
        <li>
          <Link href="/modeltraining">Model Training</Link>
        </li>
        <li>
          <Link href="/modelevaluation">Model Evaluation</Link>
        </li>
      </ul>
    </nav>
  );
}
