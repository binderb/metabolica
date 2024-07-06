import AddMetabolite from "./components/AddMetabolite";
import MetaboliteList from "./components/MetaboliteList";

export default async function Admin () {

  return (
    <main className='flex flex-col gap-2 p-4'>
      <AddMetabolite />
      <MetaboliteList />
    </main>
  );
}