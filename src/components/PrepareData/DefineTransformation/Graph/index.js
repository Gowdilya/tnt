import React, { useEffect, useState, useRef } from "react";
import './graph.scss';
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

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  useEffect(() => {
    if ( chartInstance && props.data.length > 0) {
      var data = props.data.map((value, index) => ({ x: index, y: value }));
      updateDataset(0, data);
      chartInstance.update();
    }
  }, [props.data ])

  const updateDataset = (datasetIndex, newData) => {
    chartInstance.data.datasets[datasetIndex].data = newData;
    chartInstance.update();
  };

  return (
    <div className='graph-container2'>
      <div>
        <canvas ref={chartContainer} />
      </div>
    </div>

  )
}


