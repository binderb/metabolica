'use client';

import SubmitButton from '@/app/(global components)/SubmitButton';
import { addMetabolite } from '../actions';
import { Jsme } from 'jsme-react';
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
      }
    }
  }, []);

  useEffect(() => {
    console.log('mol:',JSON.stringify(mol));
  
  },[mol])

  async function handleAddMetabolite(formData: FormData) {
    try {
      // add structure to formData
      formData.append('structure', mol);
      await addMetabolite(formData);
    } catch (err:any) {
      alert(err.message);
    } 
  }

  return (
    <>
    <Script src='jsme/jsme.nocache.js' />
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
            {/* Structure */}
            <tr>
              <td className='bg-white/50 p-1 font-bold'>
                <div>Structure:</div>
              </td>
              <td className='bg-white/50 p-1'>
                {/* <Jsme ref={jsmeRef} src='jsme/jsme.nocache.js' height="300px" width="400px" options="polarnitro,noquery,oldlook,noatommovebutton"  onChange={()=>console.log(jsmeRef)}/> */}
                <div id='jsme-container' ref={jsmeRef}></div>
                {/* <input className='std-input w-full' name='structure' /> */}
              </td>
            </tr>
            <tr>
              <td className='bg-white/50 p-1 font-bold'>
                <div>SVG:</div>
              </td>
              <td className='bg-white/50 p-1'>
                <input className='std-input w-full' name='svg' />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </section>
    </>
  );
}
