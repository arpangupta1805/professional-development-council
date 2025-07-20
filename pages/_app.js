import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthWrapper from "../components/AuthWrapper";
import GoogleAuth from "../components/GoogleAuth";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/index.css";
import "../styles/glassmorphism.css"; // Add glassmorphism theme
import "../styles/responsive.css";
import "../styles/events.css"; // Import the global CSS file here
import "../styles/prepmat.css"; // Import the PrepMat professional styles
import "aos/dist/aos.css"; // Import AOS CSS for animations
import { Analytics } from "@vercel/analytics/next" // From web Analytics

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAuth>
        <AuthProvider>
          <AuthWrapper>
            <div>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </div>
          </AuthWrapper>
        </AuthProvider>
      </GoogleAuth>
      <Analytics />
    </>
  );
}

export default MyApp;
