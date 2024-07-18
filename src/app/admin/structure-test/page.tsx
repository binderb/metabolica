import Link from "next/link";
import MolParsePanel from "../components/MolParsePanel";

export default async function StructureTest () {

  return (
    <>
    <main className='flex flex-col gap-2 p-4'>
      <section>
        <Link href='/admin' className='dark-link'>&larr; Back</Link>
      </section>
      <MolParsePanel />
    </main>
    </>
  )
}