import { useState } from 'react';
import './App.css'
import Box from './Box';


function App() {

  const [boxList, setBoxList] = useState([])

  const AddBox = () => {
    setBoxList((boxList as any).concat(<Box key={boxList.length} />))
  }


  return (
    <div>
      <button className='button' onClick={AddBox}>
        <svg viewBox="0 0 100 100" className='svg-circleplus'>
          <line x1="32.5" y1="50" x2="67.5" y2="50" strokeWidth="5" />
          <line x1="50" y1="32.5" x2="50" y2="67.5" strokeWidth="5" />
        </svg>
      </button>
      <div>
        {boxList}
      </div>
    </div>
  )
}

export default App;
