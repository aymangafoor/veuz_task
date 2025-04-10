import React, { useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Chart.css';
import MultiRangeSlider from '../components/MultiSlider';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Chart = () => {
    const childRef = useRef();
    // State for tracking data
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showOfflineModal, setShowOfflineModal] = useState(false);
    const [selectedTimeRange, setSelectedTimeRange] = useState({ start: '04:19:18 PM', end: '04:37:35 PM', index: 0 });
    const [FinalTimeRange, setFinalTimeRange] = useState({ start: '00:00:00 PM', end: '00:00:00 PM' });
    const [selectedProductivity, setSelectedProductivity] = useState('productive');

    // Generate time labels for x-axis (5-minute intervals)
    const generateTimeLabels = () => {
        const labels = [];
        for (let hour = 7; hour <= 23; hour++) {
            const displayHour = hour > 12 ? hour - 12 : hour;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            labels.push(`${displayHour}${ampm}`);
        }
        return labels;
    };

    // Generate 5-minute interval data
    const generateIntervalData = () => {
        const intervals = [];
        for (let hour = 7; hour < 23; hour++) {
            for (let min = 0; min < 60; min += 5) {
                intervals.push(`${hour}:${min.toString().padStart(2, '0')}`);
            }
        }
        return intervals;
    };

    // Generate random productivity data
    const generateProductivityData = () => {
        return Array(192).fill().map((_, i) => {
            const productive = i > 25 && i < 145 ? Math.random() * 0.8 : 0;
            const neutral = i > 25 && i < 145 ? Math.random() * (1 - productive) * 0.7 : 0;
            const unproductive = i > 25 && i < 145 ? 1 - productive - neutral : 0;
            return { productive, neutral, unproductive };
        });
    };

    // Generate data for the vertical stacked bar chart (Graph A)
    const verticalChartData = {
        labels: generateIntervalData(),
        datasets: [
            {
                label: 'Productive',
                data: generateProductivityData().map(d => d.productive),
                backgroundColor: 'rgb(104, 183, 104)',
                stack: 'Stack 0',
            },
            {
                label: 'Neutral',
                data: generateProductivityData().map(d => d.neutral),
                backgroundColor: 'rgb(192, 192, 192)',
                stack: 'Stack 0',
            },
            {
                label: 'Unproductive',
                data: generateProductivityData().map(d => d.unproductive),
                backgroundColor: 'rgb(247, 163, 92)',
                stack: 'Stack 0',
            },
        ],
    };
    const Horizontaldata = [
        { label: "Idle", hour: 2 },
        { label: "Online", hour: 0.1 },
        { label: "Idle", hour: .3 },
        { label: "Online", hour: 2.5 },
        { label: "Idle", hour: .05 },
        { label: "Online", hour: .2 },
        { label: "Idle", hour: .1 },
        { label: "Online", hour: .5 },
        { label: "Idle", hour: .05 },
        { label: "Online", hour: 1 },
        { label: "Idle", hour: .05 },
        { label: "Online", hour: 1 },
        { label: "Idle", hour: .05 },
        { label: "Online", hour: 1 },
        { label: "Idle", hour: .3 },
        { label: "Online", hour: 2 },
        { label: "Idle", hour: .05 },
        { label: "Online", hour: .5 },
        { label: "Idle", hour: 1 },
        { label: "offline", hour: .3 },
        { label: "Idle", hour: .2 },
        { label: "Online", hour: .05 },
        { label: "offline", hour: 3 }
    ]
    const [horizontalData, setHorizontalData] = useState(Horizontaldata)
    // Generate data for the horizontal stacked bar chart (Graph B)
    const horizontalChartData = {
        labels: [''],
        datasets: horizontalData.map((item, index) => ({
            label: item.label,
            data: [item.hour],
            backgroundColor: item.label == "Idle" ? "rgb(192, 192, 192)" : item.label == "Online" ? "darkblue" : "lightblue",
        }))
    };


    // Options for the vertical chart
    const verticalChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                display: true,
                ticks: {
                    callback: function (value, index) {
                        // Show only hour labels
                        const intervalData = generateIntervalData();
                        return intervalData[index].endsWith(':00') ? (parseInt(intervalData[index]) > 12 ? intervalData[index].split(':')[0] - 12 : intervalData[index].split(':')[0]) + (parseInt(intervalData[index]) >= 12 ? 'PM' : 'AM') : '';
                    },
                },
                grid: {
                    display: false
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 1,
                grid: { display: false, drawBorder: false, },
                ticks: {
                    callback: function (value) {
                        return (value * 100) + '%';
                    },
                    stepSize: .25,
                    tickLength: 0,
                    tickWidth: 0,
                },
                border: {
                    display: false
                }
            },
        },
        plugins: {
            tooltip: {
                enabled: false, // Disable default tooltip
                external: (context) => {
                    // We'll use custom tooltip
                },
            },
            title: {
                display: true,
                text: "Tracked Hours",
                align: 'start',
                color: 'black',
                font: {
                    size: 18,
                }
            },
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    boxHeight: 16,
                    boxWidth: 16,
                    borderRadius: 4,
                    useBorderRadius: true
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
            },
        },
        onHover: (event, elements) => {
            // When hovering over the chart
            if (elements.length > 0) {
                // console.log("hoverEle", elements[0])
                const { datasetIndex, index, element } = elements[0];
                const label = verticalChartData.datasets[datasetIndex].label;

                // Example app usage data for tooltip
                const appData = {
                    'Productive': [
                        { name: 'stackoverflow.com', time: '26s' },
                        { name: 'google.com', time: '1min' },
                        { name: 'chrome', time: '20s' },
                    ],
                    'Neutral': [
                        { name: 'mail.com', time: '1min' },
                        { name: 'calendar', time: '25s' },
                    ],
                    'Unproductive': [
                        { name: 'youtube.com', time: '3min' },
                        { name: 'reddit.com', time: '45s' },
                    ],
                };

                setTooltipData({
                    label,
                    apps: appData[label] || [],
                    percentage: element.height,
                    totalTime: '01:49',
                    timeRange: '03:55 PM - 03:40 PM',
                });

                setTooltipPosition({
                    x: event.native.clientX,
                    y: event.native.clientY,
                });

                setTooltipVisible(true);
            } else {
                setTooltipVisible(false);
            }
        },
    };

    // Options for the horizontal chart
    const horizontalChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                min: 0,
                max: 17,
                ticks: {
                    callback: function (value, index) {
                        const intervalData = generateTimeLabels();
                        return intervalData[index];
                    },
                    stepSize: 1
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                stacked: true,
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
        },
        plugins: {
            tooltip: {
                displayColors: false,
                rtl: false,
                yAlign: 'bottom',
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.x || 0;
                        return `${value}h ${Math.round((value % 1) * 60)}m - ${label}`;
                    },
                },
            },
            legend: {
                display: false
            },
            title: {
                display: false
            },
            subtitle: {
                display: false
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
            },
        },
        onClick: (event, elements) => {
            console.log("", elements)
            // When clicking on the chart
            if (elements.length > 0) {
                const { datasetIndex, index } = elements[0];
                // Get the y-value (horizontalChartData point)
                const yValue = horizontalChartData.datasets[datasetIndex].data[index];

                console.log(`Clicked on: ${datasetIndex}, Value: ${yValue}`);
                const label = horizontalChartData.datasets[datasetIndex].label;
                const data = horizontalChartData.datasets[datasetIndex].data
                let start = horizontalData.slice(0, datasetIndex).reduce((acc, curr) => acc + curr.hour, 0)
                let end = start + Number(yValue)
                setSelectedTimeRange({ start: getTimeFrom7AM(start), end: getTimeFrom7AM(end), index: datasetIndex })
                console.log("clicked", elements[0], "start is", start, "end value is", end)
                if (label === 'Idle' || label === 'Offline') {
                    setShowOfflineModal(true);
                }
            }
        },
    };
    function getTimeFrom7AM(hours) {
        const baseHour = 7; // 7 AM
        const totalMinutes = hours * 60;
        const date = new Date();
        date.setHours(0, 0, 0, 0); // Reset time to midnight
        date.setMinutes(baseHour * 60 + totalMinutes);

        // Format to HH:MM AM/PM
        let hours12 = date.getHours() % 12 || 12;
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${hours12}:${minutes} ${ampm}`;
    }
    function getHoursSince7AM(timeStr) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const totalMinutes = hours * 60 + minutes;
        const minutesSince7AM = totalMinutes - (7 * 60);

        return minutesSince7AM / 60;
    }
    // Custom tooltip component
    const CustomTooltip = () => {
        if (!tooltipVisible || !tooltipData) return null;

        return (
            <div
                className="custom-tooltip"
                style={{
                    left: tooltipPosition.x + 10,
                    top: tooltipPosition.y + 10,
                }}
            >
                <div className="tooltip-header">
                    <div className={`tooltip-type ${tooltipData.label.toLowerCase()}`}>
                        {tooltipData.label}
                    </div>
                    <div className="tooltip-percentage">{Math.trunc(Number(tooltipData.percentage))}%</div>
                </div>

                <div className="tooltip-apps">
                    {tooltipData.apps.map((app, index) => (
                        <div key={index} className="tooltip-app">
                            <div className="app-name">{app.name}</div>
                            <div className="app-time">{app.time}</div>
                        </div>
                    ))}
                    <div className="tooltip-app">
                        <div className="app-name">Total</div>
                        <div className="app-time">{tooltipData.totalTime}</div>
                    </div>
                </div>

                <div className="tooltip-footer">
                    <div>{tooltipData.timeRange}</div>
                </div>
            </div>
        );
    };
    const convertTimeToMinutes = (timeString) => {
        const [time, period] = timeString.split(' ');
        let [hours, minutes, seconds] = time.split(':').map(Number);

        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    // Convert minutes back to time format
    const convertMinutesToTime = (totalMinutes) => {
        let hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.floor((totalMinutes % 1) * 60);

        let period = 'AM';
        if (hours >= 12) {
            period = 'PM';
            if (hours > 12) {
                hours -= 12;
            }
        } else if (hours === 0) {
            hours = 12;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
    };
    // Offline time modal component
    const OfflineTimeModal = () => {
        if (!showOfflineModal) return null;
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header mb-6">
                        <span className="modal-title gap-x-2">
                            <div className='offline-icon border border-gray-400 rounded h-8 w-8 grid place-items-center'>
                                <svg viewBox="0 0 100 100" className='h-4 w-4' xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#DD4C4C" stroke-width="8" />
                                    <line x1="20" y1="80" x2="80" y2="20" stroke="#DD4C4C" stroke-width="8" stroke-linecap="round" />
                                </svg>
                            </div>
                            <p className='font-semibold'>Offline Time</p>
                        </span>
                        <button className="close-button" onClick={() => setShowOfflineModal(false)}>×</button>
                    </div>
                    <MultiRangeSlider
                        min={convertTimeToMinutes(selectedTimeRange.start)}
                        max={convertTimeToMinutes(selectedTimeRange.end)}
                        onChange={({ min, max }) => { setFinalTimeRange({ start: convertMinutesToTime(min), end: convertMinutesToTime(max) }) }}
                        ref={childRef}
                    />

                    <div className="description-input">
                        <input type="text" placeholder="Description" />
                    </div>

                    <div className="productivity-selection mb-8">
                        <div className="section-title">Productivity</div>
                        <div className="options">
                            <div
                                className={`option productive ${selectedProductivity === 'productive' ? 'selected' : ''}`}
                                onClick={() => setSelectedProductivity('productive')}
                            >
                                <i className="check-icon"></i> Productive
                            </div>
                            <div
                                className={`option unproductive ${selectedProductivity === 'unproductive' ? 'selected' : ''}`}
                                onClick={() => setSelectedProductivity('unproductive')}
                            >
                                <i className="check-icon"></i> Unproductive
                            </div>
                            <div
                                className={`option neutral ${selectedProductivity === 'neutral' ? 'selected' : ''}`}
                                onClick={() => setSelectedProductivity('neutral')}
                            >
                                <i className="check-icon"></i> Neutral
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions w-full">
                        <button className="h-8 bg-white border border-gray-400 px-4 text-gray-900 rounded-lg" onClick={() => setShowOfflineModal(false)}>Cancel</button>
                        <button className="h-8 bg-[#f0914a] px-4 text-white rounded-lg" onClick={() => saveData()}>Save</button>
                    </div>
                </div>
            </div>
        );
    };
    const saveData = () => {
        childRef.current?.childFunction();
        if (selectedTimeRange.start == FinalTimeRange.start && selectedTimeRange.end == FinalTimeRange.end) {
            let data = horizontalData
            data[selectedTimeRange.index].label = "Online"
            setHorizontalData(data)
            setShowOfflineModal(false)
            console.log("working")
        }
        else if (selectedTimeRange.start == FinalTimeRange.start) {
            let data = horizontalData
            let end_date = FinalTimeRange.end
        }
        else {
            console.log("else is working")

        }
    }
    // Add markers for Offline and Idle times
    const renderTimeMarkers = () => {
        return (
            <div className="time-markers">
                <div className="time-marker offline" style={{ left: '40%', width: '80px' }}>
                    02h:39m(40s) - Offline
                </div>
                <div className="time-marker idle" style={{ left: '60%', width: '80px' }}>
                    00h:60m(17s) - Idle
                </div>
            </div>
        );
    };

    return (
        <div className="app">
            <div className="chart-container vertical">
                <Bar data={verticalChartData} options={verticalChartOptions} height={250} />
                {renderTimeMarkers()}
            </div>

            <div className="chart-container horizontal">
                <Bar data={horizontalChartData} options={horizontalChartOptions} height={100} />
            </div>

            <CustomTooltip />
            <OfflineTimeModal />
        </div>
    );
};

export default Chart;