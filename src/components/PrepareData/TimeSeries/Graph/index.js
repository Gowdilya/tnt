import React, { useEffect, useState, useRef } from "react";
import './graph.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Chartjs from 'chart.js';


Chartjs.defaults.global.defaultFontFamily = "Lato";
Chartjs.defaults.global.defaultFontSize = 12;


export default function Graph(props) {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
 

  const chartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Scatter Dataset',
            data: props.data.map((value, index) => ({ x: index, y: value })),
            borderColor: '#8884d8'
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
  };
  //console.log(props.data);
  //const data = props.data.map((value, index) => ({ x: index, y: value }))
  //console.log(data);
  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  useEffect(()=>{
    if(chartInstance && props.data.length > 0){
      var data = props.data.map((value, index) => ({ x: index, y: value }));
      updateDataset(0, data);
      chartInstance.update();
    }
  },[props.data])

  const updateDataset = (datasetIndex, newData) => {
    chartInstance.data.datasets[datasetIndex].data = newData;
    chartInstance.update();
    props.loadedGraph();
  };

  return (
    <div className='graph-container'>
      <div>
      <canvas ref={chartContainer} />
    </div>

      {/* <ResponsiveContainer>
        <LineChart

          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" onAnimationEnd={props.loadedGraph} />

        </LineChart>
      </ResponsiveContainer> */}
    </div>

  )
}