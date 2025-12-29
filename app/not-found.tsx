import Link from "next/link";


export default function NotFound() {
  
     
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Go to Home
      </Link>
    </div>
  );
}
