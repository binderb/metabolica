'use client';
import { db } from '@/db';
import MoleculeViewer from './MoleculeViewer';
import { Metabolite } from '@/db/schema_metabolites';
import { useEffect, useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import Modal from '@/app/(_global components)/Modal';
import { FaAtom } from 'react-icons/fa';

type Props = {
  metabolites: Metabolite[];
};

export default function MetaboliteList({ metabolites }: Props) {
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState(metabolites);
  const [showMolfile, setShowMolFile] = useState(false);
  const [currentMolFile, setCurrentMolFile] = useState('');

  useEffect(() => {
    // Apply name text filter
    let newFilteredList = metabolites.filter((metabolite) => metabolite.name.toLowerCase().indexOf(search.toLowerCase()) > -1);

    setFilteredList(newFilteredList);
    // console.log('filtered leads:', newFilteredLeads);
  }, [search, metabolites]);

  return (
    <>
      <section className='bg-white/50 rounded-md p-4 w-full'>
        <section className='flex justify-between items-center'>
          <h1 className='text-lg font-bold text-primary'>Metabolites</h1>
        </section>
        <MoleculeViewer id={10} structure={metabolites[2].structure || ''} />
        <section className='flex items-center gap-2'>
          <div className='font-bold'>Name Search:</div>
          <input type='text' className='std-input flex-grow' value={search} onChange={(e) => setSearch(e.target.value)} />
        </section>
        {filteredList.length === 0 && <div className='italic'>No metabolites found.</div>}
        {filteredList.length > 0 && (
          <table className='w-full text-left border-separate border-spacing-1'>
            <thead>
              <tr>
                <th className='w-[30%]'></th>
                <th className='w-[50%]'></th>
                <th className='w-[20%]'></th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((metabolite, index) => (
                <tr key={index}>
                  <td className='bg-white/50 p-1 font-bold'>
                    <div>{metabolite.name}</div>
                  </td>
                  <td className='bg-white/50 p-1'>
                    <MoleculeViewer id={index} structure={metabolite.structure || ''} />
                  </td>
                  <td className='bg-white/50 p-1 flex flex-col items-start justify-center gap-2 h-full'>
                    <button className='std-button-lite' onClick={() => window.jsme.readMolFile(metabolite.structure)}>
                      <FiCopy /> Copy to Editor
                    </button>
                    <button className='std-button-lite' onClick={() => {setCurrentMolFile(metabolite.structure);setShowMolFile(true);console.log(currentMolFile)}}>
                      <FaAtom /> View Molfile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <Modal showModal={showMolfile}>
        <section className='flex flex-col gap-2'>
          <textarea className='std-input h-[200px] min-w-[500px] resize-none whitespace-pre' value={currentMolFile} readOnly />
          <button className='std-button-lite' onClick={() => setShowMolFile(false)}>
            Close
          </button>
        </section>
      </Modal>
    </>
  );
}
