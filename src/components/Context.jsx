import React, { createContext, useState } from "react";

export const ValueContext = createContext();

const ValueProvider = ({ children }) => {
    const [value, setValue] = useState({ min: "", max: "" });
    return <ValueContext value={{ value, setValue }}>{children}</ValueContext>;
};

export default ValueProvider;