'use client';
import { useEffect } from "react";
import { Kekule } from "kekule";

type Props = {
  id: number;
  structure: string;
}

export default function MoleculeViewer ({structure, id}: Props) {
  useEffect(() => {
    const chemViewer = new Kekule.ChemWidget.Viewer(document.getElementById(`chemViewer-${id}`));
//     const mol = Kekule.IO.loadFormatData(`glucose.mol\n  ChemDraw07032409282D
  
//  12 12  0  0  1  0  0  0  0  0999 V2000
//    -0.6740    0.5082    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//     0.1510    0.5082    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//    -1.0865   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//     0.5635   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//    -0.6740   -0.9207    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//     0.1510   -0.9207    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//     1.3885   -0.2062    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//    -0.6740    1.3332    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
//    -1.3885    1.7457    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//    -1.0770   -1.3464    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//    -0.6740   -0.0957    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//     0.1510   -1.7457    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
//   1  2  1  0      
//   1  3  1  0      
//   2  4  1  0      
//   3  5  1  1      
//   5  6  1  0      
//   4  6  1  1      
//   4  7  1  4      
//   1  8  1  0      
//   8  9  1  0      
//   3 10  1  0      
//   5 11  1  0      
//   6 12  1  0      
// M  END`, 'mol');
    console.log('structure',structure);
    const mol = Kekule.IO.loadFormatData(structure, 'mol');
    chemViewer.setChemObj(mol);
    chemViewer.setEnableDirectInteraction(false).setEnableToolbar(false)
    .setEnableDirectInteraction(false)
    .setEnableEdit(false)
    .setToolButtons([]).setAutoSize(true);
    const configs = chemViewer.getRenderConfigs();
    configs.getLengthConfigs().setAtomFontSize(10);
    
  }, [structure, id]);
  

  return (<div id={`chemViewer-${id}`} className=''></div>);
};