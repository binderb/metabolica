'use client';

import SubmitButton from '@/app/(_global components)/SubmitButton';
import { addMetabolite } from '../actions';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function AddMetabolite() {

  const [mol, setMol] = useState('');
  const jsmeRef = useRef(null);

  useEffect(() => { 
    if (typeof window !== 'undefined') {
      window.jsmeOnLoad = function () {
        const jsme = new window.JSApplet.JSME('jsme-container' || '', '500px', '300px');
        jsme.setCallBack('AfterStructureModified', function() {
          setMol(jsme.molFile(false));
        });
        window.jsme = jsme;
      }
      
    }
  }, []);

  useEffect(() => {
    console.log('mol:',JSON.stringify(mol));
  
  },[mol])

  async function handleAddMetabolite(formData: FormData) {
    try {
      formData.append('structure', mol);
      await addMetabolite(formData);
    } catch (err:any) {
      alert(err.message);
    } 
  }

  return (
    <>
    <Script src='/jsme/jsme.nocache.js' async />
    <section className='bg-white/50 rounded-md p-4 w-full'>
      <form action={handleAddMetabolite} className='flex flex-col gap-2'>
        <section className='flex justify-between items-center'>
          <h1 className='text-lg font-bold text-primary'>Add Metabolite</h1>
          <SubmitButton text='Add Metabolite' pendingText='Adding Metabolite...' />
        </section>
        <table className='w-full text-left border-separate border-spacing-1'>
          <thead>
            <tr>
              <th className='w-[20%]'></th>
              <th className='w-[80%]'></th>
            </tr>
          </thead>
          <tbody>
            {/* Name */}
            <tr>
              <td className='bg-white/50 p-1 font-bold'>
                <div>Name:</div>
              </td>
              <td className='bg-white/50 p-1'>
                <input className='std-input w-full' name='name' />
              </td>
            </tr>
            {/* Short Name */}
            <tr>
              <td className='bg-white/50 p-1 font-bold'>
                <div>Short Name (optional):</div>
              </td>
              <td className='bg-white/50 p-1'>
                <input className='std-input w-full' name='shortName' />
              </td>
            </tr>
            {/* Structure */}
            <tr>
              <td className='bg-white/50 p-1 font-bold'>
                <div>Structure:</div>
              </td>
              <td className='bg-white/50 p-1'>
                <div id='jsme-container' ref={jsmeRef}></div>
              </td>
            </tr>    
          </tbody>
        </table>
      </form>
    </section>
    </>
  );
}
