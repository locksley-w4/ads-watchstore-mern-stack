import "./App.css";
import AppRouterProvider from "./router/router";
import AuthContextProvider from "./context/AuthContextProvider";
import UserContextProvider from "./context/UserContextProvider";
import ProductContextProvider from "./context/ProductContextProvider";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <UserContextProvider>
          <ProductContextProvider>
            <AppRouterProvider />
          </ProductContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
