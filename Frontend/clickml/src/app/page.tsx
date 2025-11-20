import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center w-screen h-screen text-4xl">
        <h1>Welcome to ClickML</h1>
        <p>Your one-stop solution for machine learning workflows.</p>
      </div>
    </>
  );
}
