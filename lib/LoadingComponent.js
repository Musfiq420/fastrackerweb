import React from 'react';
import { css } from '@emotion/react';
import { Audio, TailSpin, ThreeDots, Watch } from 'react-loader-spinner';

const LoadingComponent = () => {
    

    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>
    <div style={{display:"flex", flexDirection:"column"}}>
                <TailSpin
                    height="80"
                    width="80"
                    color="#0C9C00"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    />
                    <br/>
        <h3 style={{color:"#0C9C00"}} >LOADING</h3>
    </div>
    
    </div>
}

export default LoadingComponent;