import './App.css';
import React from 'react';
import { useState } from 'react';
import {random_rotations_avro, grid_rotations_spiral} from './algorithms'
import MainCanvas from './ThreeApp'

const AVRO = 'avro', SPIRAL = 'spiral';
const defaultMethod = AVRO;
const defaultAvro = { num_rots: 100 };
const defaultSpiral = { num_sphere_pts: 100, num_xy_rots: 3 }

function AvroSettings(props) {
  const [val, setVal] = useState(defaultAvro.num_rots);
  const onClick = () => {
    props.onSettingChange(AVRO, { num_rots: parseInt(val) });
  }
  return <>
    <label htmlFor='num_rots'>Number of Rotations:</label>
    <input type='text' id='num_rots' value={val}
      onChange={(e) => setVal(e.target.value)}></input>
    <button onClick={onClick}>Refresh</button>
  </>
}

function SpiralSettings(props) {
  const [sphereVal, setSphereVal] = useState(defaultSpiral.num_sphere_pts);
  const [xyVal, setXyVal] = useState(defaultSpiral.num_xy_rots);
  const onClick = () => {
    props.onSettingChange(SPIRAL,
      { num_sphere_pts: parseInt(sphereVal), num_xy_rots: parseInt(xyVal) });
  }
  return <>
    <div>
      <label htmlFor='num_sphere_pts'>Number of Sphere Points:</label>
      <input type='text' id='num_sphere_pts' value={sphereVal}
        onChange={(e) => setSphereVal(e.target.value)}></input>
    </div>
    <div>
      <label htmlFor='num_xy_pts'>Number of XY Rotations:</label>
      <input type='text' id='num_xy_rots' value={xyVal}
        onChange={(e) => setXyVal(e.target.value)}></input>
      <button onClick={onClick}>Refresh</button>
    </div>
  </>
}

function DetailedSettings(props) {
  if (props.method === AVRO) {
    return <AvroSettings onSettingChange={props.onSettingChange} />
  } else if (props.method === SPIRAL) {
    return <SpiralSettings onSettingChange={props.onSettingChange} />
  }
}

function Selections(props) {
  const [method, setMethod] = useState(defaultMethod);
  const onChange = (e) => {
    const new_method = e.target.value;
    setMethod(new_method)
    if (new_method === AVRO) { props.onSettingChange(new_method, defaultAvro); }
    else if (new_method === SPIRAL) { props.onSettingChange(new_method, defaultSpiral); }
  };
  return <div style={{ color: 'white', backgroundColor: 'transparent', position: 'absolute', top: '0px' }}>
    <div>
      <label htmlFor="method-select">Generation Method:</label>
      <select id="method-select" onChange={onChange}>
        <option value={AVRO}>Random-Avro</option>
        <option value={SPIRAL}>Spiral</option>
      </select>
    </div>
    <DetailedSettings method={method} onSettingChange={props.onSettingChange}/>
  </div>
}

function Reference() {
  return <div style={{ color: 'white', backgroundColor: 'transparent', position: 'absolute', bottom: '0px' }}>
    <p>Reference:</p>
    <ol>
      <li>J Avro. "Fast Random Rotation Matrices." (1992)</li>
      <li><a href="https://gist.github.com/zhifanzhu/a1d2a108ad6ea81b853a67d2420b01be">Spiral method.</a></li>
    </ol>
  </div>
}

class App extends React.Component {
  state = {
    rot_mats: random_rotations_avro(defaultAvro.num_rots),
    num_rots: defaultAvro.num_rots,
  }
  onSettingChange(method, settings) {
    if (method === AVRO) {
      const rot_mats = random_rotations_avro(settings.num_rots);
      this.setState({num_rots: settings.num_rots});
      this.setState({rot_mats: rot_mats});
    } else if (method === SPIRAL) {
      const rot_mats = grid_rotations_spiral(
        settings.num_sphere_pts, settings.num_xy_rots);
      this.setState({num_rots: settings.num_sphere_pts * settings.num_xy_rots});
      this.setState({rot_mats: rot_mats});
    }
  }
  render() {
    return <div style={{ width: window.innerWidth, height: window.innerHeight }}>
      <MainCanvas rot_mats={this.state.rot_mats} num_rots={this.state.num_rots} />
      <Selections onSettingChange={this.onSettingChange.bind(this)}/>
      <Reference />
    </div>
  }
}

export default App;
