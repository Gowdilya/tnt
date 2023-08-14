import React from "react";

function Home(props) {
    if (props.isAuthenticated === true)
    {
        return <div>Welcome!</div>;
    }
    else
    {
        return <div>Please Login</div>;
    }
  
}

export default Home;