'use client';
import { useEffect } from "react";
import { Kekule } from "kekule";
import 'kekule/theme/default'; 

type Props = {
  id: number;
  structure: string;
}

export default function MoleculeViewer ({structure, id}: Props) {
  useEffect(() => {
    const chemViewer = new Kekule.ChemWidget.Viewer(document.getElementById(`chemViewer-${id}`));
    const mol = Kekule.IO.loadFormatData(structure, 'mol');
    chemViewer.setChemObj(mol);
    chemViewer
    // .setEnableDirectInteraction(false)
    // .setEnableEdit(false)
    // .setEnableToolbar(true)
    // .setToolButtons([])
    .setAutoSize(true);
    const configs = chemViewer.getRenderConfigs();
    // configs.getTextFontConfigs().setSupFontSizeRatio(1);
    // configs.getLengthConfigs().setAtomFontSize(10);
    // configs.getMoleculeDisplayConfigs().setDefChargeMarkType(3);
    // configs.getMoleculeDisplayConfigs().setDefMoleculeDisplayType(1);
    // configs.getMoleculeDisplayConfigs().setAutoCreateChargeAndRadicalMarker(false);
    // configs.autoCreateChargeAndRadicalMarker = true;
    // const displayConfigs = configs.getMoleculeDisplayConfigs();
    // console.log(configs);
    console.log(Kekule.Render.getRender2DConfigs())
    chemViewer.repaint();
    
  }, [structure, id]);
  

  return (<div id={`chemViewer-${id}`} className='w-full block bg-white' ></div>);
};