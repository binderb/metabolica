"use client";

import { useState } from "react";
import Structure from "./Structure";

export default function MolParsePanel() {
  const [mol, setMol] = useState(
`glucose.mol
  ChemDraw07032409282D

 12 12  0  0  1  0  0  0  0  0999 V2000
   -0.6740    0.5082    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1510    0.5082    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0865   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.5635   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6740   -0.9207    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1510   -0.9207    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3885   -0.2062    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6740    1.3332    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.3885    1.7457    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0770   -1.3464    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6740   -0.0957    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.1510   -1.7457    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0      
  1  3  1  0      
  2  4  1  0      
  3  5  1  1      
  5  6  1  0      
  4  6  1  1      
  4  7  1  4      
  1  8  1  0      
  8  9  1  0      
  3 10  1  0      
  5 11  1  0      
  6 12  1  0      
M  END`
  );

  return (
    <>
      <section className="bg-white/50 rounded-md p-4 w-full flex flex-col gap-2">
        <section className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary">
            Structure Parse Test
          </h1>
        </section>
        <section className='h-[100px]'>
          <Structure mol={mol} />
        </section>
        <section className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-primary">Mol Input</h1>
        </section>
        <section>
          <textarea
            value={mol}
            onChange={(e) => setMol(e.target.value)}
            className="std-input w-full resize-none h-[400px] font-mono"
          />
        </section>
      </section>
    </>
  );
}
