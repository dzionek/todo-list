import React from 'react'

import ItemsFetcher from "./components/ItemsFetcher";

/**
 * The main app component.
 */
const App: React.FC = () => (
    <div className="container">
        <ItemsFetcher />
    </div>
)

export default App