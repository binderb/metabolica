import { db } from '@/db';
import MoleculeViewer from './MoleculeViewer';

export default async function MetaboliteList() {
  const metabolites = await db.query.metabolites.findMany();

  return (
    <section className='bg-white/50 rounded-md p-4 w-full'>
      <section className='flex justify-between items-center'>
        <h1 className='text-lg font-bold text-primary'>Metabolites</h1>
      </section>
      {metabolites.length === 0 && <div className='italic'>No metabolites found.</div>}
      {metabolites.length > 0 && (
        <table className='w-full text-left border-separate border-spacing-1'>
          <thead>
            <tr>
              <th className='w-[50%]'></th>
              <th className='w-[50%]'></th>
            </tr>
          </thead>
          <tbody>
            {metabolites.map((metabolite, index) => (
              <tr key={index}>
                <td className='bg-white/50 p-1 font-bold'>
                  <div>{metabolite.name}</div>
                </td>
                <td className='bg-white/50 p-1'>
                  {/* {metabolite.svg || 'No SVG available'} */}
                  <MoleculeViewer id={index} structure={metabolite.structure || ''} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
