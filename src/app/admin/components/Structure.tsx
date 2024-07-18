"use client";
import { useEffect, useState } from "react";

type Props = {
  mol: string;
};

type MolObject = {
  atoms: Atom[];
  bonds: Bond[];
};

type Atom = {
  element: string;
  x: number;
  y: number;
  z: number;
  charge: number;
};

type Bond = {
  atom1: number;
  atom2: number;
  order: number;
  stereo: string;
};

export default function Structure({ mol }: Props) {
  const [molObject, setMolObject] = useState({
    atoms: [],
    bonds: [],
  } as MolObject);

  useEffect(() => {
    try {
      const newMol = parseMol();
      setMolObject(newMol);
    } catch (err) {
      console.log(err);
      setMolObject({ atoms: [], bonds: [] } as MolObject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mol]);

  function parseMol() {
    const newMolObject = { atoms: [], bonds: [] } as MolObject;
    const lines = mol.split("\n");
    if (!lines[3].includes("V2000") && !lines[2].includes("V2000")) {
      throw new Error("Invalid mol format");
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('.') && i > 2) {
        const atom = {
          element: line.slice(31, 34).trim(),
          x: parseFloat(line.slice(0, 10)),
          y: parseFloat(line.slice(10, 20))*-1, // flip coordinate system for svg
          z: parseFloat(line.slice(20, 30)),
        } as Atom;
        newMolObject.atoms.push(atom);
      } else if (!line.includes('.') && line.length > 0 && !line.startsWith('M') && !line.includes('V2000') && i > 2) {
        const bond = {
          atom1: parseInt(line.slice(0, 3)),
          atom2: parseInt(line.slice(3, 6)),
          order: parseInt(line.slice(6, 9)),
          stereo: line.slice(9, 12).trim(),
        } as Bond;
        newMolObject.bonds.push(bond);
      }
    }
    console.log(JSON.stringify(newMolObject));
    return newMolObject;
  }

  return (
    <>
      <svg viewBox={`${Math.min(...molObject.atoms.map((atom) => atom.x)) - 0.2} ${Math.min(...molObject.atoms.map((atom) => atom.y)) - 0.2} ${Math.max(...molObject.atoms.map((atom) => atom.x)) - Math.min(...molObject.atoms.map((atom) => atom.x)) + 0.4} ${Math.max(...molObject.atoms.map((atom) => atom.y)) - Math.min(...molObject.atoms.map((atom) => atom.y)) + 0.4}`} className='h-full'>
        {molObject.atoms.map((atom, index) => (
          // <circle
          //   key={index}
          //   cx={atom.x}
          //   cy={atom.y}
          //   r={0.1}
          //   fill='black'
          // />
          
          <text key={index} x={atom.x} y={atom.y} fontSize={0.5} textAnchor="middle" baselineShift={-0.165}>
            {atom.element !== 'C' ? atom.element : ''}
          </text>
        ))}
        {molObject.bonds.map((bond, index) => {
          const atom1 = molObject.atoms[bond.atom1 - 1];
          const atom2 = molObject.atoms[bond.atom2 - 1];
          // if the first atom is not carbon, adjust line coordinates to leave some space at the start point for an element symbol
          let startX = atom1.x;
          let startY = atom1.y;
          let endX = atom2.x;
          let endY = atom2.y;
          if (atom1.element !=='C') {
            const dx = atom2.x - atom1.x;
            const dy = atom2.y - atom1.y;
            const angle = Math.atan2(dy, dx);
            startX += 0.25 * Math.cos(angle);
            startY += 0.25 * Math.sin(angle);
          }
          // if the second atom is not carbon, adjust line coordinates to leave some space at the end point for an element symbol
          if (atom2.element !=='C') {
            const dx = atom1.x - atom2.x;
            const dy = atom1.y - atom2.y;
            const angle = Math.atan2(dy, dx);
            endX += 0.25 * Math.cos(angle);
            endY += 0.25 * Math.sin(angle);
          }


          return (
            <line
              key={index}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke='black'
              strokeWidth={0.05}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </>
  );
}
