export default function Debug({ debug }: { debug: any }) {
  console.log('debug' + '>'.repeat(200), debug);
  return (
    <>
      <pre>{JSON.stringify(debug, null, '\t')}</pre>
    </>
  );
}
