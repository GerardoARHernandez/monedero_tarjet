import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from './context/ThemeContext';
import { BusinessProvider } from './context/BusinessContext';

function App() {
  return (
    <BrowserRouter>
      <BusinessProvider>
        <ThemeProvider>
          <AppRoutes />        
        </ThemeProvider>
      </BusinessProvider>
    </BrowserRouter>
  );
}

export default App;