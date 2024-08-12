export default async function Playground() {
  return (
    <div className="grid grid-cols-4 border-3 border-blue-400">
      <div className="col-span-4 lg:col-span-2 border-3 border-green-200">col-span-1</div>
      <div className="col-span-4 sm:col-span-2 border-3 border-yellow-300">col-span-1</div>
    </div>
  );
}
