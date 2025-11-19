/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import Styles from "./form.module.css";
import { useEffect, useState } from "react";
import { Form, redirect, useNavigation, useLoaderData, useActionData } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { loginUser } from "./api";
import Swal from "sweetalert2";

export const loginLoader = ({ request }) => {
  return new URL(request.url).searchParams.get("message");
};

// choosing the action function does not matter.
// the action function will intercept the request made when submitting the form

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  // const phone = formData.get("phone");
  // const email = formData.get("email");

  const pathname =
    new URL(request.url).searchParams.get("redirectTo") || "/trivia";

  try {
    if(name === ""){
      return {error: "Name is required"}
    }

    // if(phone === ""){
    //   return {error: "Phone number is required"}
    // }

    // if(email === ""){
    //   return {error: "Email is required"}
    // }
    const data = await loginUser({ name });
    console.log(data, "user data login")
    localStorage.setItem("user", JSON.stringify(data));
    return redirect(pathname);
  } catch (err) {
    // Return error message to be displayed by the component
    if (err && err.message) {
      // Check for specific error types and return appropriate message
      // if (err.message.phone) {
      //   return { error: err.message.phone };
      // }
      if (err.message.name) {
        return { error: err.message.name };
      }
      if (err.message.validate) {
        return { error: err.message.validate };
      }
      // if (err.message.played) {
      //   return { error: err.message.played };
      // }
      console.log(err, "error occurred")
      // Generic error
      return { error: "Something went wrong. Please try again." };
    }
    // Network/fetch error
    return { error: "Failed to connect. Please check your internet connection." };
  }
};

const LoginPage = () => {
  // code for logging status with useNavigation hook
  const [applyClass, setApplyClass] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigation = useNavigation();
  const loginMssgError = useLoaderData(); // From protected route redirect
  const actionData = useActionData(); // From form submission
  const [lastShownError, setLastShownError] = useState(null);

  // Modern error display configuration
  const showModernError = (message) => {
    if (!message) return;

    const htmlContent = `
      <div class="error-modal-wrapper">
        <div class="error-icon-custom">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="error-title">Oops!</div>
        <div class="error-message">${message}</div>
      </div>
    `;

    Swal.fire({
      html: htmlContent,
      showConfirmButton: true,
      confirmButtonText: "Got it",
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
      customClass: {
        popup: 'modern-error-popup',
        htmlContainer: 'modern-error-content',
        confirmButton: 'modern-error-button',
        actions: 'modern-error-actions'
      }
    });
  };

  // Heartbeat animation toggle
  useEffect(() => {
    const interval = setInterval(() => setApplyClass((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle errors from loader (protected route redirect)
  useEffect(() => {
    if (loginMssgError) {
      const errorKey = `loader_${loginMssgError}_${Date.now()}`;
      if (errorKey !== lastShownError) {
        setLastShownError(errorKey);
        showModernError(loginMssgError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginMssgError]);

  // Handle errors from action (form submission)
  useEffect(() => {
    if (actionData?.error) {
      const errorKey = `action_${actionData.error}_${Date.now()}`;
      if (errorKey !== lastShownError) {
        setLastShownError(errorKey);
        showModernError(actionData.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <>
      {showWelcome ? (
        // Welcome Screen
        <div className={`${Styles.login_container} ${Styles.welcome_screen}`}>
          <div className={Styles.welcome_content}>
            {/* Animated particles/circles in background */}
            <div className={Styles.particles}>
              <div className={`${Styles.particle} ${Styles.particle1}`}></div>
              <div className={`${Styles.particle} ${Styles.particle2}`}></div>
              <div className={`${Styles.particle} ${Styles.particle3}`}></div>
              <div className={`${Styles.particle} ${Styles.particle4}`}></div>
              <div className={`${Styles.particle} ${Styles.particle5}`}></div>
            </div>

            {/* Main welcome text */}
            <div className={Styles.welcome_text}>
              <h1 className='animate__animated animate__fadeInDown animate__slow'>
                <span className={Styles.text_highlight}>Discover Your</span>
                <span className={Styles.text_main}>Perfect Mix</span>
              </h1>

              {/* Brand showcase */}
              <div className={Styles.brands_showcase}>
                <div className={`${Styles.brand_item} ${Styles.brand_smirnoff} animate__animated animate__fadeInLeft animate__delay-1s`}>
                  <span className={Styles.brand_name}>SMIRNOFF</span>
                  <span className={Styles.brand_subtitle}>Cosmopolitan</span>
                </div>

                <div className={`${Styles.brand_divider} animate__animated animate__fadeIn animate__delay-1s`}>×</div>

                <div className={`${Styles.brand_item} ${Styles.brand_gilbeys} animate__animated animate__fadeInUp animate__delay-1s`}>
                  <span className={Styles.brand_name}>GILBEY'S</span>
                  <span className={Styles.brand_subtitle}>Berry Bramble</span>
                </div>

                <div className={`${Styles.brand_divider} animate__animated animate__fadeIn animate__delay-1s`}>×</div>

                <div className={`${Styles.brand_item} ${Styles.brand_captain} animate__animated animate__fadeInRight animate__delay-1s`}>
                  <span className={Styles.brand_name}>CAPTAIN MORGAN</span>
                  <span className={Styles.brand_subtitle}>Long Island Iced Tea</span>
                </div>
              </div>

              <p className='animate__animated animate__fadeIn animate__delay-2s'>
                Take the quiz and discover your signature cocktail
              </p>
            </div>

            {/* Start button */}
            <button
              onClick={() => setShowWelcome(false)}
              className={`${Styles.start_button} animate__animated animate__bounceIn animate__delay-2s ${
                applyClass ? "animate__pulse" : ""
              }`}
            >
              <span className={Styles.button_content}>
                <span className={Styles.button_icon}>🍹</span>
                <span className={Styles.button_text}>Start the Quiz</span>
                <span className={Styles.button_arrow}>→</span>
              </span>
            </button>
          </div>
        </div>
      ) : (
        // Registration Form
        <div className={`${Styles.login_container} animate__animated animate__fadeIn`}>
          <Form className={Styles.form} method="post" replace>
            <div className="row input-field">
              <input type="text" name="name" id="name" placeholder="Name" />
            </div>
            <div className='row input-field button-style'>
              <button
                type="submit"
                className={`${Styles.button} animate__animated ${
                  applyClass ? "animate__pulse" : ""
                }`}
                disabled={navigation.state === "submitting"}>
                {navigation.state === "submitting"
                  ? "Registering..."
                  : "Take the quiz"}
              </button>
            </div>
          </Form>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default LoginPage;
