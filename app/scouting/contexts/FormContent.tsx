// app/contexts/FormContext.js
"use client";

import React, { createContext, useState, useContext } from "react";

// @ts-ignore
const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    matchType: "",
    matchNumber: 0,
    alliance: "",
    team: 0,
    scouter: "",
    endAndAfterGame: {
      stopStatus: "",
      comments: "",
    },
    teleop: {
      coralCount: {
        l4: 0,
        l3: 0,
        l2: 0,
        l1: 0,
        dropOrMiss: 0,
      },
      algaeCount: {
        netShot: 0,
        processor: 0,
        dropOrMiss: 0,
      },
    },
    autonomous: {
      autoStart: "",
      coralCount: {
        l4: 0,
        l3: 0,
        l2: 0,
        l1: 0,
        dropOrMiss: 0,
      },
      algaeCount: {
        netShot: 0,
        processor: 0,
        dropOrMiss: 0,
      },
    }
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
