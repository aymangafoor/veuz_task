import React, { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";


const MultiRangeSlider = forwardRef(({ min, max, onChange }, ref) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);
    const [value, setValue] = useState(value)

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );
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

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // // Get min and max values when their state changes
    const childFunction = () => {
        console.log("called")
        onChange({ min: minVal, max: maxVal });
    };
    useImperativeHandle(ref, () => ({
        childFunction
    }));
    useEffect(() => {

    }, [minVal, maxVal])
    return (
        <div className="w-full h-15">
            <div className="flex justify-center gap-x-2.5 mb-4">
                <div className="slider__left-value">{convertMinutesToTime(minVal)}</div>
                -
                <div className="slider__right-value">{convertMinutesToTime(maxVal)}</div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 && "5" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />
            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range bg-[#e0e0e0]" />
            </div>
        </div>
    );
});

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;