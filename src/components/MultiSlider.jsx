import React, { useCallback, useEffect, useState, useRef, forwardRef, useContext } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";
import { ValueContext } from "./Context";

const MultiRangeSlider = forwardRef(({ min, max, onChange }, ref) => {
    // Use refs instead of state to avoid re-renders
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);
    const { setValue } = useContext(ValueContext);

    // State only for display purposes
    const [displayValues, setDisplayValues] = useState({ min, max });

    // Flag to avoid initial update
    const isInitialRender = useRef(true);

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

    // Update the range slider visuals
    const updateRangeVisuals = useCallback(() => {
        if (!range.current) return;

        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxValRef.current);

        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;

        // Update the display values without triggering re-renders
        setDisplayValues({
            min: minValRef.current,
            max: maxValRef.current
        });
    }, [getPercent]);

    // Notify parent of changes when slider stops
    const notifyChanges = useCallback(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        // // Use a timeout to avoid synchronous updates
        // setTimeout(() => {
        // onChange({ min: minValRef.current, max: maxValRef.current });
        console.log(`value is changing min:${minValRef.current} max:${maxValRef.current}`,)
        setValue({ min: minValRef.current, max: maxValRef.current });
        // }, 0);
    }, [setValue]);

    // Handle slider thumb movements
    const handleMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), maxValRef.current - 1);
        minValRef.current = newMin;
        updateRangeVisuals();
    };

    const handleMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), minValRef.current + 1);
        maxValRef.current = newMax;
        updateRangeVisuals();
    };

    // Initialize visuals on mount
    useEffect(() => {
        updateRangeVisuals();
    }, [updateRangeVisuals]);

    return (
        <div className="w-full h-15">
            <div className="flex justify-center gap-x-2.5 mb-4">
                <div className="slider__left-value">{convertMinutesToTime(displayValues.min)}</div>
                -
                <div className="slider__right-value">{convertMinutesToTime(displayValues.max)}</div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={displayValues.min}
                onChange={handleMinChange}
                onMouseUp={() => { notifyChanges(); console.log("mouse up") }}
                onTouchEnd={() => { notifyChanges(); console.log("touch ends") }}
                className="thumb thumb--left"
                style={{ zIndex: displayValues.min > max - 100 ? 5 : undefined }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={displayValues.max}
                onChange={handleMaxChange}
                onMouseUp={() => { notifyChanges(); console.log("mouse up") }}
                onTouchEnd={() => { notifyChanges(); console.log("touch ends") }}
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