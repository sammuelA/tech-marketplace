import React from 'react';

export const NavigationBar = (props) => {
  return <div>



    <nav className="navbar"> 
    <h1 className="brand-name">Tech-Marketplace</h1>
    <nav>
            <span> <li><a className="balance"><span>{props.cUSDBalance}</span>cUSD</a></li>
            </span>
            </nav>
         
    </nav>
  </div>;
};
