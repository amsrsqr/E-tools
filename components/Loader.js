import React, {useEffect, useState} from 'react';
import '../css/Loader.css';
import '../css/style.css';
import loader from '../assets/Images/loader.png'


export default(props) => {

   

    return (
        <div>        
        <div  style= {{opacity:"85%"}}className="loading d-flex flex-row justify-content-center align-items-center" v-if="loading">     
        <div className="spinner">
        <div className="spinner-text"><b>Loading...</b></div>
         <div className="spinner-sector spinner-sector-blue"></div> 
         <div className="spinner-sector spinner-sector-red"></div> 
        </div>
        </div> 
        </div>       
            
    );

}
