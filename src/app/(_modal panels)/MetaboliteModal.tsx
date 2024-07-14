import Modal from '@/app/(_global components)/Modal';
import { FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
// import { addClient, generateClientCode } from '../actions';
import { useState, useEffect, createRef } from 'react';
import { Metabolite } from '@/db/schema_metabolites';

type Props = {
  metabolites: Metabolite[];
  fallbackContents?: React.ReactNode;
  buttonContents?: React.ReactNode;
  showModal: boolean;
  setShowModal: Function;
  confirmSearchFunction: (metabolite: Metabolite) => void;
};

export default function MetaboliteModal({metabolites, fallbackContents, buttonContents, showModal, setShowModal, confirmSearchFunction }: Props) {
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState('');

  const [search, setSearch] = useState('');
  const [matchingList, setMatchingList] = useState<Metabolite[]>(metabolites);
  const [selected, setSelected] = useState<Metabolite | null>(null);

  useEffect(() => {
    const regex = new RegExp(`${search}`, 'gi');
    const filteredList = metabolites.filter((metabolite) => metabolite.name.match(regex));
    if (selected && filteredList.indexOf(selected) < 0) setSelected(null);
    setMatchingList(filteredList);
  }, [setMatchingList, search, metabolites, selected]);

  function handleCancel() {
    setStatus('');
    setSearch('');
    setShowModal(false);
  }

  function handlePickSearchResult() {
    if (selected) {
      try {
        confirmSearchFunction(selected);
        setStatus('');
        setSearch('');
        setShowModal(false);
      } catch (err: any) {
        setStatus(err.message);
      }
    }
  }

  return (
    <>
      <Modal showModal={showModal} className='w-[90vw] md:w-[60%]'>
        <h2 className='text-primary text-lg font-bold'>Metabolites</h2>
        {loading && <FaSpinner className='animate-spin' />}
        {!loading && (
          <>
            <div className='flex items-center gap-2'>
              <FaSearch />
              <input className='std-input w-full' name='name' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Start typing a metabolite name...' />
            </div>
            {matchingList.length > 0 ? (
              <div className='flex flex-col gap-2'>
                <div>{`Select an address:`}</div>
                <div className='border border-dark/80 w-full h-[200px] mb-2 overflow-y-scroll bg-white/50'>
                  <>
                    {matchingList.map((metabolite, index: number) => (
                      <button key={`contact-${index}`} className={`flex w-full px-2 py-2 border border-dark/80 border-b-1 border-l-0 border-r-0 border-t-0 last:border-b-0 cursor-pointer ${selected === metabolite ? `bg-primary text-white` : ``}`} onClick={() => setSelected(metabolite)}>
                        {metabolite.name}
                      </button>
                    ))}
                  </>
                </div>
              </div>
            ) : (
              <>
                <div className='italic h-[230px]'>No results.</div>
              </>
            )}
            <div className='flex items-center gap-2'>
              <button
                className='std-button-lite'
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}>
                Cancel
              </button>
              <button className='std-button-lite' disabled={!selected} onClick={handlePickSearchResult}>
                Confirm Selection
              </button>
            </div>
            <div className='text-[#800]'>{status}</div>
          </>
        )}
      </Modal>
    </>
  );
}
