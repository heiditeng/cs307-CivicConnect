import React, { useEffect, useState } from 'react'

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    ).catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {(typeof backendData.members === 'undefined') ? (
        <p> Names loading... </p>
      ) : (
        backendData.members.map((member, i) => (
          <p key={i}>{member}</p>
        ))
      )}
    </div>
  );
}

export default App