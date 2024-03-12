import Link from "next/link";

export default async function Page() {
  return (
    <main>
      <div className="bg-[#edf6f8] lg:flex m-auto justify-center">
        <div className="md:w-[100%] lg:w-1/2 my-80 justify-center flex">
          <Link
            className="text-cyan-50 text-4xl bg-blue-500 rounded-lg p-4 "
            href="/10012?utm=123123"
          >
            Click here to Start
          </Link>
        </div>
      </div>
    </main>
  );
}
