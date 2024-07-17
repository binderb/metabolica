import Link from "next/link";
import AddPathway from "../components/AddPathway";
import { db } from "@/db";

export default async function Pathways () {
  const metabolites = await db.query.metabolites.findMany();
  const reactions = await db.query.reactions.findMany();

  return (
    <main className='flex flex-col gap-2 p-4'>
      <section>
        <Link href='/admin' className='dark-link'>&larr; Back</Link>
      </section>
      <AddPathway metabolites={metabolites} reactions={reactions} />
    </main>
  );
}