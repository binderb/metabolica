'use client';

import SubmitButton from '@/app/(_global components)/SubmitButton';
import { addMetabolite, addReaction } from '../actions';
import { useEffect, useRef, useState } from 'react';
import MetaboliteModal from '@/app/(_modal panels)/MetaboliteModal';
import { Metabolite } from '@/db/schema_metabolites';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';

type SubReaction = {
  before: Metabolite[];
  after: Metabolite[];
};

type Props = {
  metabolites: Metabolite[];
};

export default function AddReaction({ metabolites }: Props) {
  const [subReactions, setSubReactions] = useState([{ before: [], after: [] }] as SubReaction[]);
  const [showModal, setShowModal] = useState(false);
  const [currentRxnIndex, setCurrentRxnIndex] = useState(0);
  const [currentRxnSide, setCurrentRxnSide] = useState('before' as 'before' | 'after');

  async function handleAddReaction(formData: FormData) {
    try {
      await addReaction(formData, subReactions);
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleAddSubRxn () {
    const newSubReactions = [...subReactions];
    newSubReactions.push({ before: [], after: [] });
    setSubReactions(newSubReactions);
  }

  function handleAddRxnMetabolite(metabolite: Metabolite) {
    const newSubReactions = [...subReactions];
    if (currentRxnSide === 'before') newSubReactions[currentRxnIndex].before.push(metabolite);
    else newSubReactions[currentRxnIndex].after.push(metabolite);
    setSubReactions(newSubReactions);
  }

  function handleRemoveMetabolite(subRxnIndex: number, metaboliteIndex: number, side: 'before' | 'after') {
    const newSubReactions = [...subReactions];
    if (side === 'before') newSubReactions[subRxnIndex].before.splice(metaboliteIndex, 1);
    else newSubReactions[subRxnIndex].after.splice(metaboliteIndex, 1);
    setSubReactions(newSubReactions);
  }

  return (
    <>
      <section className='bg-white/50 rounded-md p-4 w-full'>
        <form action={handleAddReaction} className='flex flex-col gap-2'>
          <section className='flex justify-between items-center'>
            <h1 className='text-lg font-bold text-primary'>New Reaction</h1>
            <SubmitButton text='Add Reaction' pendingText='Adding Reaction...' />
          </section>
          <h2 className='font-bold pl-1'>Details:</h2>
          <table className='w-full text-left border-separate border-spacing-1'>
            <thead>
              <tr>
                <th className='w-[20%]'></th>
                <th className='w-[80%]'></th>
              </tr>
            </thead>
            <tbody>
              {/* Identifier */}
              <tr>
                <td className='bg-white/50 p-1 font-bold'>
                  <div>Identifier:</div>
                </td>
                <td className='bg-white/50 p-1'>
                  <input className='std-input w-full' name='identifier' />
                </td>
              </tr>
              {/* Delta G */}
              <tr>
                <td className='bg-white/50 p-1 font-bold'>
                  <div>Delta G:</div>
                </td>
                <td className='bg-white/50 p-1'>
                  <input className='std-input w-full' name='deltaG' />
                </td>
              </tr>
              {/* Description */}
              <tr>
                <td className='bg-white/50 p-1 font-bold'>
                  <div>Description:</div>
                </td>
                <td className='bg-white/50 p-1'>
                  <textarea className='std-input w-full resize-none' name='description' />
                </td>
              </tr>
              {/* Reverse Description */}
              <tr>
                <td className='bg-white/50 p-1 font-bold'>
                  <div>Reverse Description:</div>
                </td>
                <td className='bg-white/50 p-1'>
                  <textarea className='std-input w-full resize-none' name='reverseDescription' />
                </td>
              </tr>
            </tbody>
          </table>
          <h2 className='font-bold pl-1'>Sub-Reactions:</h2>
          <section className='flex items-center gap-2'>
            <button className='std-button-lite' onClick={(e)=>{e.preventDefault();handleAddSubRxn();}}>Add Sub-Reaction</button>
          </section>
          <table className='w-full text-center border-separate border-spacing-1'>
            <thead>
              <tr>
                <th className='w-[40%]'></th>
                <th className='w-[20%]'></th>
                <th className='w-[40%]'></th>
              </tr>
            </thead>
            <tbody>
              {subReactions.map((subRxn, subRxnIndex) => (
                <tr key={subRxnIndex}>
                  <td className='bg-white/50 p-1 flex flex-col justify-center items-start gap-2'>
                    {subRxn.before.map((metabolite, metaboliteIndex) => (
                      <div key={metaboliteIndex} className='flex items-center gap-2'>
                        <div className='py-1 px-2 bg-white/50 rounded-md border border-dark'>{metabolite.name}</div>
                        <button className='danger-button-lite' onClick={(e)=>{e.preventDefault();handleRemoveMetabolite(subRxnIndex, metaboliteIndex, 'before')}}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                    <button
                      className='std-button-lite'
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentRxnIndex(subRxnIndex);
                        setCurrentRxnSide('before');
                        setShowModal(true);
                      }}>
                      <FaPlus />
                    </button>
                  </td>
                  <td className='bg-white/50 p-1'>&rarr;</td>
                  <td className='bg-white/50 p-1 flex flex-col justify-center items-start gap-2'>
                    {subRxn.after.map((metabolite, metaboliteIndex) => (
                      <div key={metaboliteIndex} className='flex items-center gap-2'>
                        <div className='py-1 px-2 bg-white/50 rounded-md border border-dark'>{metabolite.name}</div>
                        <button className='danger-button-lite' onClick={(e)=>{e.preventDefault();handleRemoveMetabolite(subRxnIndex, metaboliteIndex, 'before')}}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                    <button
                      className='std-button-lite'
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentRxnIndex(subRxnIndex);
                        setCurrentRxnSide('after');
                        setShowModal(true);
                      }}>
                      <FaPlus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </section>
      <MetaboliteModal metabolites={metabolites} showModal={showModal} setShowModal={setShowModal} confirmSearchFunction={handleAddRxnMetabolite} />
    </>
  );
}
