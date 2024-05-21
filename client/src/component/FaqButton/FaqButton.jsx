import React from 'react'
import "./faqButton.scss"
const FaqButton = ({text,active}) => {
  return (
    <div className={`faq-button ${active?"active":""}`}>
      {text}
    </div>
  )
}

export default FaqButton
