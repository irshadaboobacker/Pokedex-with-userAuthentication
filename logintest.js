const loginSection = document.querySelector(".login-section");
var loginBox = document.createElement("div");
loginBox.classList.add("login-box");
loginSection.append(loginBox);
var loginheader = document.createElement("h2");
loginheader.textContent = "Login";
loginBox.append(loginheader);
var form = document.createElement("form");
form.id = "loginuserDataForm";
form.classList.add("login-form");
var input = document.createElement("input");
input.id = "nameoremail";
input.classList.add("login-input");
input.placeholder = "Username or Email";
input.required = true;

var passwordbox = document.createElement("div");
passwordbox.classList.add("password-box");
var inputpassword = document.createElement("input");
inputpassword.id = "password";
inputpassword.classList.add("password-input");
inputpassword.placeholder = "Password";
inputpassword.type = "password";
inputpassword.required = true;
passwordbox.append(inputpassword);

var toggleIcon = document.createElement("img");
toggleIcon.classList.add("eyebtn");
toggleIcon.src = "eyeicon.png";
passwordbox.append(toggleIcon);

toggleIcon.addEventListener("click", function () {
  togglePasswordVisibility();
});

function togglePasswordVisibility() {
  if (inputpassword.type === "password") {
    inputpassword.type = "text";
  } else {
    inputpassword.type = "password";
  }
}

var inputButton = document.createElement("button");
inputButton.type = "submit";
inputButton.textContent = "Login";
inputButton.classList.add("login-button");

var regboxLogin = document.createElement("div");
regboxLogin.classList.add("regboxLogin");
var inputreg = document.createElement("h4");
inputreg.textContent = "Not registered?";
var regboxOpen = document.createElement("h4");
regboxOpen.textContent = "SignUp";
regboxOpen.classList.add("reglink-login");
var errormsg = document.createElement("h4");
errormsg.textContent = "Incorrect Username or Password, Try Again!";
errormsg.classList.add("userfound-errormsg");
var forgotPassword = document.createElement("a");
forgotPassword.textContent = "Forgot Password?";
forgotPassword.classList.add("forgotPassword");
forgotPassword.href = "/resetpassword"

regboxOpen.addEventListener("click", function () {
  window.location.href = "/register";
});

loginBox.append(form);
form.append(input);
form.append(passwordbox);
form.appendChild(inputButton);
form.appendChild(regboxLogin);
regboxLogin.append(inputreg);
regboxLogin.append(regboxOpen);
loginBox.append(errormsg);
loginBox.append(forgotPassword);

document.getElementById('loginuserDataForm').setAttribute('autocomplete', 'off');

document.addEventListener("DOMContentLoaded", function () {
  var userDataForm = document.getElementById("loginuserDataForm");
  userDataForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var password = document.getElementById("password").value;
    var nameorEmail = document.getElementById("nameoremail").value;

    var userData = {
      nameorEmail: nameorEmail,
      password: password,
    };

    fetch("/submitloginUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.setItem("authenticatedUser", "granted");

          window.location.href = "/mypage";
        } else if (response.status === 400) {
          errormsg.style.display = "block";

          setTimeout(function () {
            errormsg.style.display = "none";
          }, 3000);
          console.log("not fouund!!!!!");
        } else {
          throw new Error("Server Error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
