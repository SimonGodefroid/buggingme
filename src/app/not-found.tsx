// not-found.js

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2>Not Found</h2>
      <a
        className="border-1 rounded-lg p-2 hover:text-background hover:bg-foreground"
        href="/"
      >
        Return Home
      </a>
    </div>
  );
}
