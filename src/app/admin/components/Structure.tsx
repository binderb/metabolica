'use client';
import { useEffect, useState } from 'react';

type Props = {
  mol: string;
  scale: number;
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

export default function Structure({ mol, scale }: Props) {
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
    const lines = mol.split('\n');
    if (!lines[3].includes('V2000') && !lines[2].includes('V2000')) {
      throw new Error('Invalid mol format');
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('.') && i > 2) {
        const atom = {
          element: line.slice(31, 34).trim(),
          x: parseFloat(line.slice(0, 10)),
          y: parseFloat(line.slice(10, 20)) * -1, // flip coordinate system for svg
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
      <svg
        viewBox={`${Math.min(...molObject.atoms.map((atom) => atom.x)) - 0.6} ${Math.min(...molObject.atoms.map((atom) => atom.y)) - 0.6} ${Math.max(...molObject.atoms.map((atom) => atom.x)) - Math.min(...molObject.atoms.map((atom) => atom.x)) + 1.2} ${Math.max(...molObject.atoms.map((atom) => atom.y)) - Math.min(...molObject.atoms.map((atom) => atom.y)) + 1.2}`}
        style={{ width: `${(Math.max(...molObject.atoms.map((atom) => atom.x)) - Math.min(...molObject.atoms.map((atom) => atom.x)) + 1.2) * scale}`, height: `${(Math.max(...molObject.atoms.map((atom) => atom.y)) - Math.min(...molObject.atoms.map((atom) => atom.y)) + 1.2) * scale}` }}>
        {molObject.atoms.map((atom, index) => (

          <text key={index} x={atom.x} y={atom.y} fontSize={0.7} textAnchor='middle' baselineShift={-0.25}>
            {atom.element !== 'C' ? atom.element : ''}
            {/* {index+1} */}
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
          if (atom1.element !== 'C') {
            const dx1 = atom2.x - atom1.x;
            const dy1 = atom2.y - atom1.y;
            const angle1 = Math.atan2(dy1, dx1);
            startX += 0.35 * Math.cos(angle1);
            startY += 0.35 * Math.sin(angle1);
          }
          // if the second atom is not carbon, adjust line coordinates to leave some space at the end point for an element symbol
          if (atom2.element !== 'C') {
            const dx2 = atom1.x - atom2.x;
            const dy2 = atom1.y - atom2.y;
            const angle2 = Math.atan2(dy2, dx2);
            endX += 0.35 * Math.cos(angle2);
            endY += 0.35 * Math.sin(angle2);
          }

          if (bond.order === 1) return <line key={index} x1={startX} y1={startY} x2={endX} y2={endY} stroke='black' strokeWidth={0.05} strokeLinecap='round' />;

          if (bond.order === 2) {
            // check both atoms to determine if this is a terminal bond or not.
            let terminal = false;
            if (molObject.bonds.filter((b) => b.atom1 === bond.atom1 || b.atom2 === bond.atom1).length === 1) terminal = true;
            if (molObject.bonds.filter((b) => b.atom1 === bond.atom2 || b.atom2 === bond.atom2).length === 1) terminal = true;
            if (terminal) {
              // terminal double bond. Draw two paralell lines with a small separation, centered on the line between the two atoms.
              const dx = endX - startX;
              const dy = endY - startY;
              const angle = Math.atan2(dy, dx);
              const perpAngle = angle + Math.PI / 2;
              const perpDx = 0.1 * Math.cos(perpAngle);
              const perpDy = 0.1 * Math.sin(perpAngle);
              return (
                <>
                  <line x1={startX - perpDx} y1={startY - perpDy} x2={endX - perpDx} y2={endY - perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                  <line x1={startX + perpDx} y1={startY + perpDy} x2={endX + perpDx} y2={endY + perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                </>
              );



            } else {
              // non-terminal double bond. Draw a bond just like the single bonded case. Then draw a second line parallel to the first, but with a small separation and shortened slightly on each end
              const dx = endX - startX;
              const dy = endY - startY;
              const angle = Math.atan2(dy, dx);
              const perpAngle = angle + Math.PI / 2;
              let perpDx = 0.2 * Math.cos(perpAngle);
              let perpDy = 0.2 * Math.sin(perpAngle);
              const prevBond = molObject.bonds.find((b) => b.atom2 === bond.atom1);
              let nextBond = molObject.bonds.find((b) => b.atom1 === bond.atom2);
              // This may occur if the next bond is closing a ring
              if (!nextBond) {
                nextBond = molObject.bonds.find((b) => b.atom2 === bond.atom2 && b.atom1 !== bond.atom1);
                // Need to flip atom1 and atom2 in this context
                if (nextBond) {
                  const temp = nextBond.atom1;
                  nextBond.atom1 = nextBond.atom2;
                  nextBond.atom2 = temp;
                }
              }
              console.log(`bond: ${bond.atom1} to ${bond.atom2}`);
                console.log(`prevBond: ${prevBond?.atom1 || '(null)'} to ${prevBond?.atom2 || '(null)'}`);
                console.log(`nextBond: ${nextBond?.atom1 || '(null)'} to ${nextBond?.atom2 || '(null)'}`);
              
              if (prevBond && nextBond) {
                console.log(`bond: ${bond.atom1} to ${bond.atom2}`);
                console.log(`prevBond: ${prevBond.atom1} to ${prevBond.atom2}`);
                console.log(`nextBond: ${nextBond.atom1} to ${nextBond.atom2}`);
                const prevAtom1 = molObject.atoms[prevBond.atom1 - 1];
                const prevAtom2 = molObject.atoms[prevBond.atom2 - 1];
                const nextAtom1 = molObject.atoms[nextBond.atom1 - 1];
                const nextAtom2 = molObject.atoms[nextBond.atom2 - 1];
                const currentAtom1 = prevAtom2;
                const currentAtom2 = nextAtom1;
                // find the midpoint between prevAtom1 and nextAtom2
                const midX = (prevAtom1.x + nextAtom2.x) / 2;
                const midY = (prevAtom1.y + nextAtom2.y) / 2;
                // find the midpoint between currentAtom1 and currentAtom2
                const currentMidX = (currentAtom1.x + currentAtom2.x) / 2;
                const currentMidY = (currentAtom1.y + currentAtom2.y) / 2;
                // find coordinates of [currentMidX, currentMidY] adjusted by perpDx and perpDy
                const adjustedMidX = currentMidX + perpDx;
                const adjustedMidY = currentMidY + perpDy;
                // find the same coordinates adjusted by -perpDx and -perpDy
                const adjustedMidX2 = currentMidX - perpDx;
                const adjustedMidY2 = currentMidY - perpDy;
                // find the distance between each adjusted midpoint and the midpoint between prevAtom1 and nextAtom2
                const distance1 = Math.sqrt((adjustedMidX - midX) ** 2 + (adjustedMidY - midY) ** 2);
                const distance2 = Math.sqrt((adjustedMidX2 - midX) ** 2 + (adjustedMidY2 - midY) ** 2);
                console.log(`distance1: ${distance1}`);
                console.log(`distance2: ${distance2}`);
                // if distance1 is greater than distance2, flip the direction of perpDx and perpDy
                if (distance1 > distance2) {
                  perpDx *= -1;
                  perpDy *= -1;
                }

                // const prevAngle = Math.atan2(prevAtom1.y - currentAtom1.y, prevAtom1.x - currentAtom1.x) - Math.atan2(currentAtom2.y - currentAtom1.y, currentAtom2.x - currentAtom1.x);
                // const nextAngle = Math.atan2(nextAtom2.y - currentAtom2.y, nextAtom2.x - currentAtom2.x) - Math.atan2(currentAtom1.y - currentAtom2.y, currentAtom1.x - currentAtom2.x);
                // if ((prevAngle < Math.PI && nextAngle < Math.PI) || (prevAngle > Math.PI && nextAngle > Math.PI)) {
                //   console.log(`concave corner between atoms ${molObject.atoms.indexOf(currentAtom1) + 1} and ${molObject.atoms.indexOf(currentAtom2) + 1}`);
                //   // perpDx *= -1;
                //   // perpDy *= -1;
                // }
              }
              

              // shorten the double bond slightly on each end
              const startXdouble = startX + 0.25 * Math.cos(angle);
              const startYdouble = startY + 0.25 * Math.sin(angle);
              const endXdouble = endX - 0.25 * Math.cos(angle);
              const endYdouble = endY - 0.25 * Math.sin(angle);
              
              



              return (
                <>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                  <line x1={startXdouble + perpDx} y1={startYdouble + perpDy} x2={endXdouble + perpDx} y2={endYdouble + perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                </>
              );
            } 


            
          }
        })}
      </svg>
    </>
  );
}
