import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className='flex justify-center items-center p-6 gap-6'>
      <Link href='/'>Home</Link>
      <Link href='/admin'>Admin</Link>
    </main>
  );
}
