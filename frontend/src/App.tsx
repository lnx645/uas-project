import { Outlet } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="898047629674-ul9mrk4iq7vb9e61vl53es6dolhruu4o.apps.googleusercontent.com">
      <Outlet />
    </GoogleOAuthProvider>
  );
}

export default App;
