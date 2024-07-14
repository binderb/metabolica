import Link from "next/link";
import AddReaction from "../components/AddReaction";
import { db } from "@/db";

export default async function Reactions () {

  const metabolites = await db.query.metabolites.findMany();

  return (
    <main className='flex flex-col gap-2 p-4'>
      <section>
        <Link href='/admin' className='dark-link'>&larr; Back</Link>
      </section>
      <AddReaction metabolites={metabolites} />
    </main>
  );
}