import Link from "next/link";

export default function Navbar() {
  return (
      <nav className="bg-gray-800 flex items-center w-screen">
          <div className="px-32 text-white">
              <h1>ClickML</h1>
          </div>

          <ul className="flex justify-center space-x-4 *:p-4 bg-gray-800 text-white">
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
