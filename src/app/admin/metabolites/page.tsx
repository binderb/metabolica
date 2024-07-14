import { db } from "@/db";
import AddMetabolite from "../components/AddMetabolite";
import MetaboliteList from "../components/MetaboliteList";
import Link from "next/link";

export default async function Metabolites () {

  const metabolites = await db.query.metabolites.findMany();

  return (
    <main className='flex flex-col gap-2 p-4'>
      <section>
        <Link href='/admin' className='dark-link'>&larr; Back</Link>
      </section>
      <AddMetabolite />
      <MetaboliteList metabolites={metabolites} />
    </main>
  );
}