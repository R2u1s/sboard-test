import React from 'react';
import { TInputValues } from '../types/types';


export function useForm(inputValues:TInputValues):{
  values:typeof inputValues,
  handleChange:(event:React.ChangeEvent<HTMLInputElement>)=>void,
  setValues:(values:TInputValues)=>void
} {
  const [values, setValues] = React.useState<TInputValues>(inputValues);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const {value, name} = event.target;
    setValues({...values, [name]: value});
  };
  
  return {values, handleChange, setValues};
}