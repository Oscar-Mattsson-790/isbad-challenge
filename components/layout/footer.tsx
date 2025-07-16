import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pb-[75px] bg-[#242422] border-none">
      <div className="container flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-white">
          &copy; {new Date().getFullYear()} All rights reserved
          <br />
          ISBAD Challenge – isbad.com <br />
          <Link
            href="https://www.isbad.se"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by ISBAD.se
          </Link>
        </p>
      </div>
    </footer>
  );
}
