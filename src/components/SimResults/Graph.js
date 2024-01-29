import * as React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';


export default class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.graphData = {
            labels: [],
            datasets: [
                {
                    label: "No graph to display yet",
                    data: [],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                }
            ]
        };

        this.options = {
            scales: {
                x: {
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                        text: "Wavelength (nm)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                        text: "Fluoresence Intensity"
                    },
                },
            },
            legend: {
                display: false
            },
            responsive: true,
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            }
        };

        this.graphColors = []
    }

    componentDidMount = () => {
        if (window !== undefined) {
            ChartJS.register(
                CategoryScale,
                LinearScale,
                PointElement,
                LineElement,
                Title,
                Tooltip,
                Legend,
            );
        }
    }

    getRandomColor = () => {
        const red = Math.floor(Math.random() * 128) + 128;
        const green = Math.floor(Math.random() * 128) + 128;
        const blue = Math.floor(Math.random() * 128) + 128;
        return `rgb(${red}, ${green}, ${blue})`;
    };

    getDarkerColor = (color) => {
        const red = Math.floor(parseInt(color.slice(4, -1).split(',')[0]) * 0.8);
        const green = Math.floor(parseInt(color.slice(4, -1).split(',')[1]) * 0.8);
        const blue = Math.floor(parseInt(color.slice(4, -1).split(',')[2]) * 0.8);
        return `rgb(${red}, ${green}, ${blue})`;
    };

    componentDidUpdate() {
        const allData = this.props.data;

        if (allData.length !== 0) {
            let graphDataset = []
            let x = []

            for (let i = 0; i < allData.length; i++) {
                let borderColor = ''
                if (i === this.graphColors.length) {
                    borderColor = this.getDarkerColor(this.getRandomColor());
                    this.graphColors.push(borderColor)
                } else {
                    borderColor = this.graphColors[i]
                }

                const currData = allData[i];
                const dataXY = currData.xyData;
                const y = dataXY[1]
                x = dataXY[0]
                const graphName = currData.name;
                const currDataset = {
                    label: graphName,
                    fill: true,
                    borderColor: borderColor,
                    data: y,
                }
                graphDataset.push(currDataset)
            }

            const graphData = {
                labels: x,
                datasets: graphDataset
            };
            this.graphData = graphData;
        }

        this.options = {
            scales: {
                x: {
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                        text: "Wavelength (nm)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        font: {
                            size: 24,
                        },
                        text: "Fluoresence Intensity"
                    },
                },
            },
            legend: {
                display: false
            },
            responsive: true,
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            }
        };
    }

    render() {
        return (
            <Line id="graph" data={this.graphData} options={this.options} />
        );
    }
}
