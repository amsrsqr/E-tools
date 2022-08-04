//import React,{useRef,useState,useEffect} from 'react';

import React, { Fragment ,useState,useEffect,useRef} from "react";

import { InputGroup, InputGroupAddon, Label } from "reactstrap";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";


const FormDatePicker1 = (props)=> {

    const [startDate, setStartDate] = useState(new Date())
    const [dateValue, setDateValue] = useState("")
    const [minDateS, setMinDateS] = useState(new Date("1-12-1845"))
    const [maxDate, setMaxDate] = useState(new Date("1-12-9999"))
  
    const refCalendar = useRef()
  
    useEffect(() => {
        
      if(props.dateValue != ""){
        setStartDate(new Date(props.dateValue))
     }
     if(props.minDate && props.minDate!=null){
       let minDate = props.minDate
       if(typeof minDate == "string")
       minDate = new Date(minDate)
       setMinDateS(minDate)
     }
  
     if(props.maxDate && props.maxDate!=null){
      let maxDate = props.maxDate
      if(typeof maxDate == "string")
      maxDate = new Date(maxDate)
      setMaxDate(maxDate)
     }
    }, [])
  
    useEffect(() => {
     if(props.minDate && props.minDate!=null && props.dateValue != ""){
       
      let date = props.dateValue
      let minDate = props.minDate
      if(Date.parse(date) < Date.parse(minDate)){
        if(typeof minDate == "string")
          minDate = new Date(minDate)
      setStartDate(minDate)
      }
      
      if(typeof minDate == "string")
        minDate = new Date(minDate)
      setMinDateS(minDate)
    }
    }, [props.minDate])
  
    useEffect(() => {
      if(props.maxDate && props.maxDate!=null ){
        let maxDate = props.maxDate
        if(typeof maxDate == "string")
        maxDate = new Date(maxDate)
        setMaxDate(maxDate)
     }
     }, [props.maxDate])
  
   const handleChange = (date)=> {
      props.getDate(date)
      setStartDate(date)
    }
  
    const openDatePicker = () => {
      refCalendar.current.setOpen(true)
    }
  
      return (
        
        <Fragment>
        <InputGroup>
     
        <DatePicker maxDate={maxDate} minDate={minDateS} className="form-control input-sm" 
              dateFormatCalendar={props.dateFormatCalendar} 
             // showMonthDropdown={props.showMonthDropdown} 
              //showYearDropdown={props.showYearDropdown} 
              //dropdownMode={props.dropdownMode}
               selected={startDate} 
               onChange={handleChange} 
               dateFormat="dd/MM/yyyy" 
               ref={refCalendar} />
          {/* <InputGroupAddon addonType="prepend"> */}
            <div onClick={openDatePicker} className="input-group-text">
              <FontAwesomeIcon  icon={faCalendarAlt} />
            </div>
          {/* </InputGroupAddon> */}
        </InputGroup>
      </Fragment>
        
      );
  }
  
  export default FormDatePicker1;
  