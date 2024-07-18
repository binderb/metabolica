import { db } from "@/db";
import Link from "next/link";

export default async function Admin () {

  return (
    <main className='flex gap-2 p-4'>
      <Link href='/admin/metabolites' className='std-button-lite'>Metabolites</Link>
      <Link href='/admin/reactions' className='std-button-lite'>Reactions</Link>
      <Link href='/admin/pathways' className='std-button-lite'>Pathways</Link>
      <Link href='/admin/structure-test' className='std-button-lite'>Structure Test</Link>
    </main>
  );
}