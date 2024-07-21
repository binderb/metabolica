'use client';
import { Fragment, useEffect, useState } from 'react';

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
  valence: number;
  x: number;
  y: number;
  z: number;
  charge: number;
};

type Bond = {
  atom1: number;
  atom2: number;
  order: number;
  stereo: number;
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
          charge: 0,
          valence: getValence(line.slice(31, 34).trim()),
        } as Atom;
        newMolObject.atoms.push(atom);
      } else if (!line.includes('.') && line.length > 0 && !line.startsWith('M') && !line.includes('V2000') && i > 2) {
        const bond = {
          atom1: parseInt(line.slice(0, 3)),
          atom2: parseInt(line.slice(3, 6)),
          order: parseInt(line.slice(6, 9)),
          stereo: parseInt(line.slice(9, 12)),
        } as Bond;
        newMolObject.bonds.push(bond);
      }
      // if the line starts with 'M  CHG' then it is a charge line
      // modify the charge of the atom with the corresponding atom number
      if (line.startsWith('M  CHG')) {
        const atomNumber = parseInt(line.slice(10, 15));
        const charge = parseInt(line.slice(15, 18));
        const atom = newMolObject.atoms.find((atom) => newMolObject.atoms.indexOf(atom) + 1 === atomNumber);
        if (atom) atom.charge = charge;
        console.log(`atom ${atomNumber} has charge ${charge}`);
      }
    }
    return newMolObject;
  }

  function getValence(element: string) {
    switch (element) {
      case 'H':
        return 1;
      case 'C':
        return 4;
      case 'N':
        return 3;
      case 'O':
        return 2;
      case 'F':
        return 1;
      case 'P':
        return 3;
      case 'S':
        return 2;
      case 'Cl':
        return 1;
      case 'Br':
        return 1;
      case 'I':
        return 1;
      default:
        return 0;
    }
  }

  return (
    <>
      <svg
        viewBox={molObject.atoms.length > 0 ? `${Math.min(...molObject.atoms.map((atom) => atom.x)) - 1.2} ${Math.min(...molObject.atoms.map((atom) => atom.y)) - 1.2} ${Math.max(...molObject.atoms.map((atom) => atom.x)) - Math.min(...molObject.atoms.map((atom) => atom.x)) + 2.4} ${Math.max(...molObject.atoms.map((atom) => atom.y)) - Math.min(...molObject.atoms.map((atom) => atom.y)) + 2.4}` : `0 0 0 0`}
        style={{ width: `${(Math.max(...molObject.atoms.map((atom) => atom.x)) - Math.min(...molObject.atoms.map((atom) => atom.x)) + 2.4) * scale}`, height: `${(Math.max(...molObject.atoms.map((atom) => atom.y)) - Math.min(...molObject.atoms.map((atom) => atom.y)) + 2.4) * scale}` }}>
        {molObject.atoms.map((atom, index) => {
          let element = atom.element;
          let textAnchor = 'middle';
          let dx = 0;
          let dy = 0;

          const bondsToThisAtom = molObject.bonds.filter((bond) => bond.atom1 === index + 1 || bond.atom2 === index + 1);
          // Determine number of hydrogens to add.
          // This is the difference between the valence of the atom (adjusted by the charge) and the number of bonds to the atom (each multiplied by bond order).
          const valence = atom.valence + atom.charge;
          const bonds = bondsToThisAtom.reduce((acc, bond) => acc + bond.order, 0);
          const hydrogens = valence - bonds;
          // Format the hydrogens, using unicode subscripts for the number.
          let hydrogensString = '';
          if (hydrogens > 0) {
            if (hydrogens === 1) hydrogensString = 'H';
            else
              hydrogensString = `H${hydrogens
                .toString()
                .split('')
                .map((char) => String.fromCharCode(8320 + parseInt(char)))
                .join('')}`;
          }

          // Add unicode superscript for charge
          let chargeString = '';
          if (atom.charge !== 0) {
            if (Math.abs(atom.charge) > 1) {
              chargeString += Math.abs(atom.charge).toString().split('').map((char) => String.fromCharCode(8320 + parseInt(char))).join('');
              
            }
            // Add unicode superscript + or - for charge
            chargeString += atom.charge > 0 ? String.fromCharCode(8314) : String.fromCharCode(8315);
            dx += 0.15;
            dy -= 0.05;
          }

          if (atom.element !== 'C') {
            // Decide which side to place the hydrogens on. If most bonds are on the right side, place the hydrogens on the left side.
            let leftBonds = 0;
              let rightBonds = 0;
              bondsToThisAtom.forEach((bond) => {
                if (bond.atom1 === index + 1) {
                  if (molObject.atoms[bond.atom2 - 1].x < atom.x) leftBonds++;
                  else rightBonds++;
                } else {
                  if (molObject.atoms[bond.atom1 - 1].x < atom.x) leftBonds++;
                  else rightBonds++;
                }
              });
            if (hydrogens > 0) {
              
              if (leftBonds > rightBonds) {
                textAnchor = 'start';
                dx = -0.22;
                element = `${element}${hydrogensString}${chargeString}`;
              } else {
                textAnchor = 'end';
                dx = 0.22;
                element = `${chargeString}${hydrogensString}${element}`;
              }
            } else {
              if (leftBonds > rightBonds) {
                element = `${element}${chargeString}`;
              } else {
                element = `${chargeString}${element}`;
                if (chargeString !== '') dx -= 0.32;
              }
            }
            
          } else {
            element = '';
          }

          return (
            <text key={index} x={atom.x} dx={dx} y={atom.y} dy={dy} fontSize={0.7} textAnchor={textAnchor} baselineShift={-0.25}>
              {element}
            </text>
          );
        })}
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

          if (bond.order === 1) {
            if (bond.stereo === 0) {
              // standard bond
              return <line key={index} x1={startX} y1={startY} x2={endX} y2={endY} stroke='black' strokeWidth={0.05} strokeLinecap='round' />;
            }
            if (bond.stereo === 1) {
              // wedge bond
              // create a triangle with the point at the start atom and the base at the end atom
              const dx = endX - startX;
              const dy = endY - startY;
              const angle = Math.atan2(dy, dx);
              const perpAngle = angle + Math.PI / 2;
              const perpDx = 0.1 * Math.cos(perpAngle);
              const perpDy = 0.1 * Math.sin(perpAngle);
              const points = [
                [startX, startY],
                [endX - perpDx, endY - perpDy],
                [endX + perpDx, endY + perpDy],
              ];
              return <polygon key={index} points={points.map((point) => point.join(',')).join(' ')} stroke='black' strokeWidth={0.05} fill='black' />;
            }
            if (bond.stereo === 4) {
              // wavy bond
              // create a sine wave with 4 periods and a small amplitude
              const dx = endX - startX;
              const dy = endY - startY;
              const angle = Math.atan2(dy, dx);
              const amplitude = 0.1;
              const period = 4 * Math.PI;
              const numPoints = 100;
              const points = Array.from({ length: numPoints }, (_, i) => {
                const x = startX + i * dx / numPoints;
                const y = startY + i * dy / numPoints;
                return [x, y + amplitude * Math.sin(i * period / numPoints)];
              });
              return <polyline key={index} points={points.map((point) => point.join(',')).join(' ')} stroke='black' strokeWidth={0.05} fill='none' />;
            }
          }

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
                <Fragment key={index}>
                  <line x1={startX - perpDx} y1={startY - perpDy} x2={endX - perpDx} y2={endY - perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                  <line x1={startX + perpDx} y1={startY + perpDy} x2={endX + perpDx} y2={endY + perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                </Fragment>
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

              if (prevBond && nextBond) {
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
                // if distance1 is greater than distance2, flip the direction of perpDx and perpDy
                if (distance1 > distance2) {
                  perpDx *= -1;
                  perpDy *= -1;
                }
              }

              // shorten the double bond slightly on each end
              const startXdouble = startX + 0.25 * Math.cos(angle);
              const startYdouble = startY + 0.25 * Math.sin(angle);
              const endXdouble = endX - 0.25 * Math.cos(angle);
              const endYdouble = endY - 0.25 * Math.sin(angle);

              return (
                <Fragment key={index}>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                  <line x1={startXdouble + perpDx} y1={startYdouble + perpDy} x2={endXdouble + perpDx} y2={endYdouble + perpDy} stroke='black' strokeWidth={0.05} strokeLinecap='round' />
                </Fragment>
              );
            }
          }
        })}
      </svg>
    </>
  );
}
