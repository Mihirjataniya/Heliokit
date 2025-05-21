import React, { useEffect, useState } from 'react'
const Home: React.FC = () => {

  const [isLightMode, setIsLightMode] = useState(false)

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'))
  }, [])

  return (
    <div className=''>
    
    </div>
  )
}

export default Home