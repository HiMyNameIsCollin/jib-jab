import React from 'react'
import Loader from 'react-loader-spinner'
import './_loading.sass'

const Loading = () => {
  return(
    <div className='loading'>
      <Loader type="Circles" color="#00BFFF" height={80} width={80}/>      
    </div>
  )
}

export default Loading