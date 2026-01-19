import React from 'react'

interface ContainerProps{
    children:React.ReactNode;
    className?: string;
}

function container({children,className}:ContainerProps) {
  return (
    <div className={`max-w-5xl items-center mx-auto ${className}`}>
        {children}
    </div>
  )
}

export default container