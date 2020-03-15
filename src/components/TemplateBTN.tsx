import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StateType, DispatchType } from '../types';
import { Button, Progress, Menu } from 'antd';
import { iStoryline } from 'iStoryline';
import axios from 'axios';
import {
  getCurrentStoryFlowProtoc,
  getCurrentStoryFlowLayout,
  getHistoryPointer
} from '../store/selectors';
import {
  addAction,
  newPredictAction,
  setTool,
  recordPointerAction
} from '../store/actions';
import ReactSVG from 'react-svg';

const mapStateToProps = (state: StateType) => {
  return {
    storyProtoc: getCurrentStoryFlowProtoc(state),
    storyLayout: getCurrentStoryFlowLayout(state),
    pointer: getHistoryPointer(state)
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    addAction: (protoc: any, layout: any, scale: number) =>
      dispatch(addAction(protoc, layout, scale)),
    newPredictAction: (newPredictQueue: any[]) =>
      dispatch(newPredictAction(newPredictQueue)),
    recordPointerAction: (originalPointer: number) =>
      dispatch(recordPointerAction(originalPointer)),
    activateTool: (name: string, use: boolean) => dispatch(setTool(name, use))
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  serverPredictUrl: string;
  storyLayouter: any;
  percent: number;
  predictSignal: boolean;
};

const stringdata =
  '{"data":{"array":[{"character_id":0,"name":"荒原狼","points":[{"item1":0,"item2":20,"item3":4.274193405645775},{"item1":90,"item2":110,"item3":204.0000006727605},{"item1":180,"item2":200,"item3":328.0000009046671},{"item1":270,"item2":280,"item3":328.0000009046671},{"item1":350,"item2":370,"item3":328.0000009046671},{"item1":440,"item2":450,"item3":337.88853931518304},{"item1":520,"item2":540,"item3":475.05783489748234},{"item1":610,"item2":630,"item3":479.2302849518415},{"item1":700,"item2":720,"item3":495.96214599857086},{"item1":790,"item2":820,"item3":536.0000007949548},{"item1":890,"item2":940,"item3":411.0815249241607},{"item1":1010,"item2":1020,"item3":197.24691889465564},{"item1":1090,"item2":1110,"item3":136.17806840182067},{"item1":1180,"item2":1200,"item3":184.39085327232488},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":1,"name":"海王亚瑟","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":288.0000008228635},{"item1":180,"item2":200,"item3":343.10215146299265},{"item1":270,"item2":280,"item3":348.0000008228635},{"item1":350,"item2":370,"item3":348.0000008228635},{"item1":440,"item2":450,"item3":359.01156771993186},{"item1":520,"item2":540,"item3":430.4647749008325},{"item1":610,"item2":630,"item3":471.4069411493219},{"item1":700,"item2":720,"item3":517.0851744286153},{"item1":790,"item2":820,"item3":590.0000008943425},{"item1":890,"item2":940,"item3":569.8752116409167},{"item1":1010,"item2":1020,"item3":347.6488251303242},{"item1":1090,"item2":1110,"item3":202.98164159159091},{"item1":1180,"item2":1200,"item3":251.19442646209512},{"item1":1270,"item2":1280,"item3":389.3581259126163},{"item1":1350,"item2":1370,"item3":715.4646332901999}]},{"character_id":2,"name":"蝙蝠侠韦恩","points":[{"item1":0,"item2":20,"item3":306.0000008745719},{"item1":90,"item2":110,"item3":306.0000008745719},{"item1":180,"item2":200,"item3":539.8333345260394},{"item1":270,"item2":280,"item3":456.0000009155792},{"item1":350,"item2":370,"item3":456.0000009155792},{"item1":440,"item2":450,"item3":387.95793995036627},{"item1":520,"item2":540,"item3":490.70452257473676},{"item1":610,"item2":630,"item3":494.8769726290959},{"item1":700,"item2":720,"item3":531.1671934135154},{"item1":790,"item2":820,"item3":626.0000010412241},{"item1":890,"item2":940,"item3":592.4586855947783},{"item1":1010,"item2":1020,"item3":389.8952570703192},{"item1":1090,"item2":1110,"item3":245.22807353158584},{"item1":1180,"item2":1200,"item3":293.44085840209004},{"item1":1270,"item2":1280,"item3":401.60455785261126},{"item1":1350,"item2":1370,"item3":720.9074920079225}]},{"character_id":3,"name":"恐惧工兵","points":[{"item1":0,"item2":20,"item3":322.0000009207979},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":4,"name":"神奇女侠","points":[{"item1":0,"item2":20,"item3":566.0000009893847},{"item1":90,"item2":110,"item3":566.0000009893847},{"item1":180,"item2":200,"item3":586.0000010218919},{"item1":270,"item2":280,"item3":556.0000010218919},{"item1":350,"item2":370,"item3":556.0000010218919},{"item1":440,"item2":450,"item3":427.07465923485455},{"item1":520,"item2":540,"item3":498.5278664157551},{"item1":610,"item2":630,"item3":502.7003164701143},{"item1":700,"item2":720,"item3":538.9905372545336},{"item1":790,"item2":820,"item3":646.0000010218919},{"item1":890,"item2":940,"item3":605.0050599502731},{"item1":1010,"item2":1020,"item3":396.69883033598103},{"item1":1090,"item2":1110,"item3":252.03164679724773},{"item1":1180,"item2":1200,"item3":300.244431667752},{"item1":1270,"item2":1280,"item3":408.40813111827316},{"item1":1350,"item2":1370,"item3":727.7110652735844}]},{"character_id":5,"name":"恐怖分子","points":[{"item1":0,"item2":20,"item3":582.0000009999458},{"item1":90,"item2":110,"item3":582.0000009999458},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":6,"name":"闪电侠巴里","points":[{"item1":0,"item2":20,"item3":436.0000009666601},{"item1":90,"item2":110,"item3":436.0000009666601},{"item1":180,"item2":200,"item3":436.0000009666601},{"item1":270,"item2":280,"item3":436.0000009666601},{"item1":350,"item2":370,"item3":436.0000009666601},{"item1":440,"item2":450,"item3":380.134596121767},{"item1":520,"item2":540,"item3":482.88117873484197},{"item1":610,"item2":630,"item3":487.0536287892011},{"item1":700,"item2":720,"item3":523.3438495736206},{"item1":790,"item2":820,"item3":606.0000010634285},{"item1":890,"item2":940,"item3":579.9123112410853},{"item1":1010,"item2":1020,"item3":353.0916838056343},{"item1":1090,"item2":1110,"item3":208.42450026690096},{"item1":1180,"item2":1200,"item3":256.63728513740523},{"item1":1270,"item2":1280,"item3":394.80098458792645},{"item1":1350,"item2":1370,"item3":874.8242905197203}]},{"character_id":7,"name":"巴里父亲","points":[{"item1":0,"item2":20,"item3":455.80645248396456},{"item1":90,"item2":110,"item3":445.9838717986966},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":8,"name":"钢骨维克多","points":[{"item1":0,"item2":20,"item3":874.4569911091036},{"item1":90,"item2":110,"item3":666.0000010106396},{"item1":180,"item2":200,"item3":596.7365602350942},{"item1":270,"item2":280,"item3":576.0000010106396},{"item1":350,"item2":370,"item3":576.0000010106396},{"item1":440,"item2":450,"item3":434.89800307903346},{"item1":520,"item2":540,"item3":506.351210259934},{"item1":610,"item2":630,"item3":510.5236603142932},{"item1":700,"item2":720,"item3":546.8138810987126},{"item1":790,"item2":820,"item3":666.0000010106396},{"item1":890,"item2":940,"item3":617.5514343108366},{"item1":1010,"item2":1020,"item3":403.5024036043916},{"item1":1090,"item2":1110,"item3":258.8352200656583},{"item1":1180,"item2":1200,"item3":307.0480049361625},{"item1":1270,"item2":1280,"item3":415.21170438668366},{"item1":1350,"item2":1370,"item3":734.5146385419949}]},{"character_id":9,"name":"维克多父亲","points":[{"item1":0,"item2":20,"item3":905.7365623199335},{"item1":90,"item2":110,"item3":879.5430138258855},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":10,"name":"超人","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":720.0000012163782},{"item1":790,"item2":820,"item3":774.9354849898393},{"item1":890,"item2":940,"item3":795.306453032625},{"item1":1010,"item2":1020,"item3":843.3999464703621},{"item1":1090,"item2":1110,"item3":757.2410826135807},{"item1":1180,"item2":1200,"item3":401.4275495467093},{"item1":1270,"item2":1280,"item3":641.6078502100231},{"item1":1350,"item2":1370,"item3":747.3550071737288}]},{"character_id":11,"name":"克拉克","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":725.0322591875024},{"item1":1010,"item2":1020,"item3":906.1774209724736},{"item1":1090,"item2":1110,"item3":828.1559154000525},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":12,"name":"RABBIT","points":[{"item1":0,"item2":20,"item3":-89},{"item1":90,"item2":110,"item3":-89},{"item1":180,"item2":200,"item3":1},{"item1":270,"item2":280,"item3":1},{"item1":350,"item2":370,"item3":1},{"item1":440,"item2":450,"item3":1},{"item1":520,"item2":540,"item3":1},{"item1":610,"item2":630,"item3":1},{"item1":700,"item2":720,"item3":1},{"item1":790,"item2":820,"item3":1},{"item1":890,"item2":940,"item3":1},{"item1":1010,"item2":1020,"item3":-149},{"item1":1090,"item2":1110,"item3":-239},{"item1":1180,"item2":1200,"item3":-239},{"item1":1270,"item2":1280,"item3":-179},{"item1":1350,"item2":1370,"item3":1}]}],"perm":[[1,1,1,1,1,1,2,2,1,1,1,1,1,1,-1,-1],[-1,2,2,2,2,2,1,1,2,2,2,2,2,2,1,2],[2,3,4,4,4,4,4,4,4,4,4,4,4,4,3,3],[3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[6,6,5,5,5,5,5,5,5,5,5,5,5,5,4,4],[7,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,1],[5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,8,6,6,6,6,6,6,6,6,6,6,6,6,5,5],[9,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,7,7,7,7,7,7,6,6],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,8,8,-1,-1,-1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"sessionTable":[[1,1,7,7,7,13,15,16,17,17,21,23,26,27,-1,-1],[-1,6,7,7,7,14,14,16,18,20,21,24,26,27,28,29],[2,6,8,10,10,10,15,16,18,20,21,24,26,27,28,29],[2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,3,8,11,12,12,15,16,18,20,21,24,26,27,28,29],[3,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,4,9,10,10,10,15,16,18,20,21,24,26,27,28,30],[4,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[5,5,8,11,12,12,15,16,18,20,21,24,26,27,28,29],[5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,19,20,22,25,25,27,28,29],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,22,25,25,-1,-1,-1],[9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999]]},"protoc":{"groupIds":[],"id":"JusticeLeague.xml","interaction":"","majorCharacters":[],"orderTable":[],"orders":[],"relateInfo":[],"scaleInfo":[],"selectedSessions":[],"sessionBreaks":[],"sessionInnerGap":18,"sessionInnerGaps":[],"sessionOuterGap":54,"sessionOuterGaps":[],"stylishInfo":[]}}';
const secstring =
  '{"data":{"array":[{"character_id":0,"name":"荒原狼","points":[{"item1":0,"item2":20,"item3":141.32463768688467},{"item1":90,"item2":110,"item3":141.32463768688467},{"item1":180,"item2":200,"item3":289.0000000082309},{"item1":270,"item2":280,"item3":289.0000000082309},{"item1":350,"item2":370,"item3":289.0000000082309},{"item1":440,"item2":450,"item3":111.00000000511864},{"item1":520,"item2":540,"item3":262.3913043262819},{"item1":610,"item2":630,"item3":270.3913043466655},{"item1":700,"item2":720,"item3":167.53416148527322},{"item1":790,"item2":820,"item3":167.53416148527322},{"item1":890,"item2":940,"item3":57.0000000087166},{"item1":1010,"item2":1020,"item3":249.3913039129693},{"item1":1090,"item2":1110,"item3":228.8913046433845},{"item1":1180,"item2":1200,"item3":246.39130433197715},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":1,"name":"海王亚瑟","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":211.3246376944753},{"item1":180,"item2":200,"item3":294.20000000916843},{"item1":270,"item2":280,"item3":294.20000000916843},{"item1":350,"item2":370,"item3":294.20000000916843},{"item1":440,"item2":450,"item3":57.00000000349246},{"item1":520,"item2":540,"item3":57.00000000349246},{"item1":610,"item2":630,"item3":254.39130432919228},{"item1":700,"item2":720,"item3":248.0579710059901},{"item1":790,"item2":820,"item3":275.5341614909721},{"item1":890,"item2":940,"item3":127.00000001095941},{"item1":1010,"item2":1020,"item3":271.39130393327105},{"item1":1090,"item2":1110,"item3":244.89130465350718},{"item1":1180,"item2":1200,"item3":262.3913043463308},{"item1":1270,"item2":1280,"item3":254.39130432945967},{"item1":1350,"item2":1370,"item3":248.05797100273958}]},{"character_id":2,"name":"蝙蝠侠韦恩","points":[{"item1":0,"item2":20,"item3":211.32463769243077},{"item1":90,"item2":110,"item3":195.3246376916286},{"item1":180,"item2":200,"item3":402.2000000128046},{"item1":270,"item2":280,"item3":235.0000000072887},{"item1":350,"item2":370,"item3":235.0000000072887},{"item1":440,"item2":450,"item3":235.0000000072887},{"item1":520,"item2":540,"item3":294.3913043631819},{"item1":610,"item2":630,"item3":302.3913043677494},{"item1":700,"item2":720,"item3":280.0579710306574},{"item1":790,"item2":820,"item3":307.53416150069097},{"item1":890,"item2":940,"item3":267.0000000136679},{"item1":1010,"item2":1020,"item3":303.39130395880784},{"item1":1090,"item2":1110,"item3":276.8913046640446},{"item1":1180,"item2":1200,"item3":294.39130436273445},{"item1":1270,"item2":1280,"item3":286.39130435780316},{"item1":1350,"item2":1370,"item3":264.0579710175207}]},{"character_id":3,"name":"恐惧工兵","points":[{"item1":0,"item2":20,"item3":206.12463768440466},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":4,"name":"神奇女侠","points":[{"item1":0,"item2":20,"item3":265.3246376966308},{"item1":90,"item2":110,"item3":265.3246376966308},{"item1":180,"item2":200,"item3":418.20000001552944},{"item1":270,"item2":280,"item3":348.2000000155731},{"item1":350,"item2":370,"item3":402.200000012288},{"item1":440,"item2":450,"item3":402.200000012288},{"item1":520,"item2":540,"item3":310.3913043780558},{"item1":610,"item2":630,"item3":318.39130437887434},{"item1":700,"item2":720,"item3":296.0579710385591},{"item1":790,"item2":820,"item3":323.53416150596604},{"item1":890,"item2":940,"item3":337.0000000148466},{"item1":1010,"item2":1020,"item3":319.39130397592635},{"item1":1090,"item2":1110,"item3":292.89130466814095},{"item1":1180,"item2":1200,"item3":310.39130437021413},{"item1":1270,"item2":1280,"item3":302.3913043677694},{"item1":1350,"item2":1370,"item3":280.0579710267739}]},{"character_id":5,"name":"恐怖分子","points":[{"item1":0,"item2":20,"item3":299.32463769797687},{"item1":90,"item2":110,"item3":299.32463769797687},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":6,"name":"闪电侠巴里","points":[{"item1":0,"item2":20,"item3":439.3246377030373},{"item1":90,"item2":110,"item3":439.3246377030373},{"item1":180,"item2":200,"item3":348.20000001086373},{"item1":270,"item2":280,"item3":219.00000000626642},{"item1":350,"item2":370,"item3":219.00000000626642},{"item1":440,"item2":450,"item3":219.00000000626642},{"item1":520,"item2":540,"item3":278.3913043482662},{"item1":610,"item2":630,"item3":286.3913043577886},{"item1":700,"item2":720,"item3":264.057971021266},{"item1":790,"item2":820,"item3":291.5341614958761},{"item1":890,"item2":940,"item3":197.00000001243825},{"item1":1010,"item2":1020,"item3":287.3913039461986},{"item1":1090,"item2":1110,"item3":260.891304659448},{"item1":1180,"item2":1200,"item3":278.3913043552493},{"item1":1270,"item2":1280,"item3":270.39130434668004},{"item1":1350,"item2":1370,"item3":366.0579710526981}]},{"character_id":7,"name":"巴里父亲","points":[{"item1":0,"item2":20,"item3":455.3246377074811},{"item1":90,"item2":110,"item3":455.3246377074811},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":8,"name":"钢骨维克多","points":[{"item1":0,"item2":20,"item3":369.3246376999832},{"item1":90,"item2":110,"item3":369.3246376999832},{"item1":180,"item2":200,"item3":434.20000002063716},{"item1":270,"item2":280,"item3":353.4000000272972},{"item1":350,"item2":370,"item3":418.2000000180524},{"item1":440,"item2":450,"item3":418.2000000180524},{"item1":520,"item2":540,"item3":326.39130439999826},{"item1":610,"item2":630,"item3":334.3913043965622},{"item1":700,"item2":720,"item3":312.0579710465645},{"item1":790,"item2":820,"item3":339.534161512669},{"item1":890,"item2":940,"item3":407.0000000161144},{"item1":1010,"item2":1020,"item3":335.3913040289699},{"item1":1090,"item2":1110,"item3":308.8913046721682},{"item1":1180,"item2":1200,"item3":326.39130437913445},{"item1":1270,"item2":1280,"item3":318.3913043788907},{"item1":1350,"item2":1370,"item3":296.057971034621}]},{"character_id":9,"name":"维克多父亲","points":[{"item1":0,"item2":20,"item3":385.32463770067807},{"item1":90,"item2":110,"item3":353.32463769933383},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":0},{"item1":1010,"item2":1020,"item3":0},{"item1":1090,"item2":1110,"item3":0},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":10,"name":"超人","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":366.0579710566799},{"item1":790,"item2":820,"item3":355.5341615239795},{"item1":890,"item2":940,"item3":531.0000000207256},{"item1":1010,"item2":1020,"item3":362.89130467659743},{"item1":1090,"item2":1110,"item3":362.89130467659743},{"item1":1180,"item2":1200,"item3":342.39130439356086},{"item1":1270,"item2":1280,"item3":334.3913043962857},{"item1":1350,"item2":1370,"item3":312.0579710425973}]},{"character_id":11,"name":"克拉克","points":[{"item1":0,"item2":20,"item3":0},{"item1":90,"item2":110,"item3":0},{"item1":180,"item2":200,"item3":0},{"item1":270,"item2":280,"item3":0},{"item1":350,"item2":370,"item3":0},{"item1":440,"item2":450,"item3":0},{"item1":520,"item2":540,"item3":0},{"item1":610,"item2":630,"item3":0},{"item1":700,"item2":720,"item3":0},{"item1":790,"item2":820,"item3":0},{"item1":890,"item2":940,"item3":515.0000000176951},{"item1":1010,"item2":1020,"item3":378.89130468531584},{"item1":1090,"item2":1110,"item3":378.89130468531584},{"item1":1180,"item2":1200,"item3":0},{"item1":1270,"item2":1280,"item3":0},{"item1":1350,"item2":1370,"item3":0}]},{"character_id":12,"name":"RABBIT","points":[{"item1":0,"item2":20,"item3":1},{"item1":90,"item2":110,"item3":1},{"item1":180,"item2":200,"item3":1},{"item1":270,"item2":280,"item3":1},{"item1":350,"item2":370,"item3":1},{"item1":440,"item2":450,"item3":1},{"item1":520,"item2":540,"item3":1},{"item1":610,"item2":630,"item3":1},{"item1":700,"item2":720,"item3":1},{"item1":790,"item2":820,"item3":1},{"item1":890,"item2":940,"item3":1},{"item1":1010,"item2":1020,"item3":1},{"item1":1090,"item2":1110,"item3":1},{"item1":1180,"item2":1200,"item3":1},{"item1":1270,"item2":1280,"item3":1},{"item1":1350,"item2":1370,"item3":1}]}],"perm":[[1,1,1,3,3,2,2,2,1,1,1,1,1,1,-1,-1],[-1,3,2,4,4,1,1,1,2,2,2,2,2,2,1,1],[3,2,4,2,2,4,4,4,4,4,4,4,4,4,3,2],[2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,4,5,5,5,5,5,5,5,5,5,5,5,5,4,3],[5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[8,8,3,1,1,3,3,3,3,3,3,3,3,3,2,6],[9,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[6,7,6,6,6,6,6,6,6,6,6,6,6,6,5,4],[7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,7,7,8,7,7,7,6,5],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,8,-1,-1,-1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],"sessionTable":[[1,1,7,7,7,13,15,16,17,17,21,23,26,27,-1,-1],[-1,6,7,7,7,14,14,16,18,20,21,24,26,27,28,29],[2,6,8,10,10,10,15,16,18,20,21,24,26,27,28,29],[2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[3,3,8,11,12,12,15,16,18,20,21,24,26,27,28,29],[3,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[4,4,9,10,10,10,15,16,18,20,21,24,26,27,28,30],[4,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[5,5,8,11,12,12,15,16,18,20,21,24,26,27,28,29],[5,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,19,20,22,25,25,27,28,29],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,22,25,25,-1,-1,-1],[9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999,9999]]},"protoc":{"groupIds":[],"id":"JusticeLeague.xml","interaction":"sort","majorCharacters":[],"orderTable":[{"item1":0,"item2":[1,-1,3,2,4,5,8,9,6,7,-1,-1,0]},{"item1":1,"item2":[1,3,2,-1,5,6,4,9,7,8,-1,-1,0]},{"item1":2,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,-1,-1,0]},{"item1":3,"item2":[3,4,2,-1,5,-1,1,-1,6,-1,-1,-1,0]},{"item1":4,"item2":[3,4,2,-1,5,-1,1,-1,6,-1,-1,-1,0]},{"item1":5,"item2":[2,1,4,-1,5,-1,3,-1,6,-1,-1,-1,0]},{"item1":6,"item2":[2,1,4,-1,5,-1,3,-1,6,-1,-1,-1,0]},{"item1":7,"item2":[2,1,4,-1,5,-1,3,-1,6,-1,-1,-1,0]},{"item1":8,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,7,-1,0]},{"item1":9,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,7,-1,0]},{"item1":10,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,8,7,0]},{"item1":11,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,7,8,0]},{"item1":12,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,7,8,0]},{"item1":13,"item2":[1,2,4,-1,5,-1,3,-1,6,-1,7,-1,0]},{"item1":14,"item2":[-1,1,3,-1,4,-1,2,-1,5,-1,6,-1,0]},{"item1":15,"item2":[-1,1,2,-1,3,-1,6,-1,4,-1,5,-1,0]},{"item1":1,"item2":[1,3,2,-1,4,5,8,9,7,6,-1,-1,0]}],"orders":[],"selectedSessions":[],"sessionBreaks":[{"frame":1,"session1":1,"session2":7},{"frame":4,"session1":7,"session2":13},{"frame":5,"session1":13,"session2":15},{"frame":6,"session1":15,"session2":16},{"frame":7,"session1":16,"session2":17},{"frame":9,"session1":17,"session2":21},{"frame":10,"session1":21,"session2":23},{"frame":11,"session1":23,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":1,"session1":6,"session2":7},{"frame":4,"session1":7,"session2":14},{"frame":6,"session1":14,"session2":16},{"frame":7,"session1":16,"session2":18},{"frame":8,"session1":18,"session2":20},{"frame":9,"session1":20,"session2":21},{"frame":10,"session1":21,"session2":24},{"frame":11,"session1":24,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":29},{"frame":0,"session1":2,"session2":6},{"frame":1,"session1":6,"session2":8},{"frame":2,"session1":8,"session2":10},{"frame":5,"session1":10,"session2":15},{"frame":6,"session1":15,"session2":16},{"frame":7,"session1":16,"session2":18},{"frame":8,"session1":18,"session2":20},{"frame":9,"session1":20,"session2":21},{"frame":10,"session1":21,"session2":24},{"frame":11,"session1":24,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":29},{"frame":1,"session1":3,"session2":8},{"frame":2,"session1":8,"session2":11},{"frame":3,"session1":11,"session2":12},{"frame":5,"session1":12,"session2":15},{"frame":6,"session1":15,"session2":16},{"frame":7,"session1":16,"session2":18},{"frame":8,"session1":18,"session2":20},{"frame":9,"session1":20,"session2":21},{"frame":10,"session1":21,"session2":24},{"frame":11,"session1":24,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":29},{"frame":1,"session1":4,"session2":9},{"frame":2,"session1":9,"session2":10},{"frame":5,"session1":10,"session2":15},{"frame":6,"session1":15,"session2":16},{"frame":7,"session1":16,"session2":18},{"frame":8,"session1":18,"session2":20},{"frame":9,"session1":20,"session2":21},{"frame":10,"session1":21,"session2":24},{"frame":11,"session1":24,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":30},{"frame":1,"session1":5,"session2":8},{"frame":2,"session1":8,"session2":11},{"frame":3,"session1":11,"session2":12},{"frame":5,"session1":12,"session2":15},{"frame":6,"session1":15,"session2":16},{"frame":7,"session1":16,"session2":18},{"frame":8,"session1":18,"session2":20},{"frame":9,"session1":20,"session2":21},{"frame":10,"session1":21,"session2":24},{"frame":11,"session1":24,"session2":26},{"frame":12,"session1":26,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":29},{"frame":8,"session1":19,"session2":20},{"frame":9,"session1":20,"session2":22},{"frame":10,"session1":22,"session2":25},{"frame":12,"session1":25,"session2":27},{"frame":13,"session1":27,"session2":28},{"frame":14,"session1":28,"session2":29},{"frame":10,"session1":22,"session2":25}],"sessionInnerGap":18,"sessionInnerGaps":[{"item1":21,"item2":72},{"item1":2,"item2":7.2},{"item1":3,"item2":36},{"item1":11,"item2":7.2},{"item1":7,"item2":7.2}],"sessionOuterGap":54,"sessionOuterGaps":[{"item1":{"item1":10,"item2":13},"item2":{"item1":108,"item2":-1}},{"item1":{"item1":17,"item2":20},"item2":{"item1":108,"item2":-1}},{"item1":{"item1":23,"item2":24},"item2":{"item1":21.6,"item2":-1}},{"item1":{"item1":7,"item2":12},"item2":{"item1":108,"item2":-1}},{"item1":{"item1":24,"item2":25},"item2":{"item1":21.6,"item2":-1}},{"item1":{"item1":3,"item2":4},"item2":{"item1":108,"item2":-1}},{"item1":{"item1":21,"item2":22},"item2":{"item1":108,"item2":-1}}]}}';
let flag = 1;
let trickcnt = 0;
class TemplateBTN extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      serverPredictUrl: 'api/predict',
      storyLayouter: new iStoryline(),
      percent: 0,
      predictSignal: false
    };
  }

  increase = () => {
    let percent = this.state.percent + 1;
    if (percent > 98) {
      percent = 98;
    }
    this.setState({ percent });
  };
  clickCancel() {
    if (this.state.predictSignal) {
      this.setState({
        predictSignal: false
      });
      this.props.activateTool('Setting', false);
    }
  }
  checkData(data: any) {
    if (!data) return data;
    let ret = JSON.parse(JSON.stringify(data));
    let minY = 0;
    for (let i = 0; i < data.array.length; i++) {
      for (let j = 0; j < data.array[i].points.length; j++) {
        if (data.perm[i][j] !== -1) {
          if (data.array[i].points[j].item3 < minY) {
            minY = data.array[i].points[j].item3;
          }
        }
      }
    }
    for (let i = 0; i < data.array.length; i++) {
      if (data.array[i].name === 'RABBIT') {
        for (let j = 0; j < data.array[i].points.length; j++) {
          data.array[i].points[j].item3 = 1;
        }
      }
    }
    if (minY >= 1) return ret;
    for (let i = 0; i < data.array.length; i++) {
      for (let j = 0; j < data.array[i].points.length; j++) {
        if (data.perm[i][j] !== -1 && data.array[i].name !== 'RABBIT') {
          ret.array[i].points[j].item3 += -minY + 2;
        }
      }
    }
    return ret;
  }
  async clickAi() {
    const originalPointer = this.props.pointer;
    this.setState({
      percent: 0,
      predictSignal: true
    });
    this.props.recordPointerAction(originalPointer);
    //console.log(originalPointer);
    let tmpID = setInterval(() => this.increase(), 1000);
    const protoc = this.props.storyProtoc;
    let data = this.checkData(this.props.storyLayout);
    this.props.activateTool('Setting', true);
    let postReq = { data: data, protoc: protoc };
    if (!flag) {
      if (!trickcnt) {
        postReq = JSON.parse(stringdata);
        trickcnt++;
      } else if (trickcnt === 1) {
        postReq = JSON.parse(secstring);
        trickcnt++;
      }
    }
    console.log(JSON.stringify(postReq));
    const postUrl = this.state.serverPredictUrl;
    const postRes = await axios.post(postUrl, postReq);
    clearInterval(tmpID);
    if (this.state.predictSignal) {
      let newPredictQueue = [];
      for (let i = 0; i < postRes.data.data.length; i++) {
        newPredictQueue[i] = {
          layout: postRes.data.data[i],
          protoc: postRes.data.protoc[i]
        };
      }
      this.setState({
        percent: 100,
        predictSignal: false
      });
      const graph = this.state.storyLayouter._layout(
        postRes.data.data[0],
        postRes.data.protoc[0]
      );
      this.props.addAction(
        postRes.data.protoc[0],
        postRes.data.data[0],
        graph.scaleRate
      );
      this.props.newPredictAction(newPredictQueue);
    }
  }

  render() {
    let { percent, predictSignal } = this.state;
    let myProgress = (
      <Progress
        percent={percent}
        type="circle"
        strokeWidth={6}
        width={300}
        strokeColor="#6376cc"
        style={{
          position: 'fixed',
          left: '38vw',
          bottom: '32vh',
          background: 'rgba(52,55,62,0.6)',
          borderRadius: '3px'
        }}
      />
    );
    const AI = predictSignal ? (
      <img src="icons/AI_generator_active.png" width="50px" height="50px" />
    ) : (
      <img src="icons/AI_generator.png" width="50px" height="50px" />
    );
    const CANCEL = predictSignal ? (
      <img src="icons/terminate_active.png" width="50px" height="50px" />
    ) : (
      <img src="icons/terminate_deactivate.png" width="50px" height="50px" />
    );
    return (
      <div className="ai-btn">
        <Button
          type="link"
          ghost
          style={{
            position: 'absolute',
            bottom: '150px',
            left: '60px'
          }}
          size="large"
          shape="circle"
          onClick={() => this.clickAi()}
        >
          {AI}
        </Button>
        <Button
          type="link"
          ghost
          style={{
            position: 'absolute',
            bottom: '95px',
            left: '60px'
          }}
          size="large"
          shape="circle"
          onClick={() => this.clickCancel()}
        >
          {CANCEL}
        </Button>
        {predictSignal ? myProgress : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateBTN);
