const loginSection = document.querySelector(".login-section");
var signinBox = document.createElement("div");
signinBox.classList.add("signin-box");

loginSection.append(signinBox);

var signinheader = document.createElement("h2");
signinheader.textContent = "SignIn";

signinBox.append(signinheader);
var formsignin = document.createElement("form");
formsignin.id = "userDataForm";
formsignin.classList.add("login-form");
var inputsign = document.createElement("input");
inputsign.id = "username";
inputsign.classList.add("login-input");
inputsign.placeholder = "Username";
inputsign.name = "username";
inputsign.required = true;

var inputEmail = document.createElement("input");
inputEmail.id = "email";
inputEmail.classList.add("login-input");
inputEmail.placeholder = "Email";
inputEmail.name = "email";
inputEmail.type = "email";
inputEmail.required = true;

// var inputpasswordsign = document.createElement('input');
// inputpasswordsign.classList.add('login-input')
// inputpasswordsign.placeholder = "Password";
// inputpasswordsign.type = "password";
// inputpasswordsign.required = true;

var passwordboxsign = document.createElement("div");
passwordboxsign.classList.add("password-box");
var inputpasswordsign = document.createElement("input");
inputpasswordsign.minLength = 6;
inputpasswordsign.id = "password";
inputpasswordsign.name = "password";
inputpasswordsign.classList.add("password-input");
inputpasswordsign.placeholder = "Password";
inputpasswordsign.type = "password";

inputpasswordsign.required = true;
passwordboxsign.append(inputpasswordsign);

var toggleIconsign = document.createElement("img");
toggleIconsign.classList.add("eyebtn");
toggleIconsign.src = "eyeicon.png";
passwordboxsign.append(toggleIconsign);

toggleIconsign.addEventListener("click", function () {
  togglePasswordVisibilitySign();
});

function togglePasswordVisibilitySign() {
  if (inputpasswordsign.type === "password") {
    inputpasswordsign.type = "text";
  } else {
    inputpasswordsign.type = "password";
  }
}

var inputButtonsign = document.createElement("button");
inputButtonsign.type = "submit";
inputButtonsign.textContent = "Sign In";
inputButtonsign.classList.add("login-button");

var logboxsignin = document.createElement("div");
logboxsignin.classList.add("regboxLogin");
var inputlog = document.createElement("h4");
inputlog.textContent = "Already Registered?";
var logboxOpen = document.createElement("h4");
logboxOpen.textContent = "Log In";
logboxOpen.classList.add("reglink-login");

var errormsg = document.createElement("h4");
errormsg.textContent = "Username or email already exists";
errormsg.classList.add("userfound-errormsg");

var registeredmsg = document.createElement("h4");
registeredmsg.textContent = "Registered✅";
registeredmsg.classList.add("userfound-errormsg");

logboxOpen.addEventListener("click", function () {
  window.location.href = "/login";
});

signinBox.append(formsignin);
formsignin.append(inputsign);
formsignin.append(inputEmail);
formsignin.append(passwordboxsign);
formsignin.appendChild(inputButtonsign);
formsignin.appendChild(logboxsignin);
logboxsignin.append(inputlog);
logboxsignin.append(logboxOpen);
signinBox.append(errormsg);
signinBox.append(registeredmsg);

document.getElementById('userDataForm').setAttribute('autocomplete', 'off');

document.addEventListener("DOMContentLoaded", function () {
  var userDataForm = document.getElementById("userDataForm");

  userDataForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var userData = {
      username: username,
      password: password,
      email: email,
    };

    fetch("/submitUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          userDataForm.reset();
          errormsg.style.display = "none";
          registeredmsg.style.display = "block";

          setTimeout(function () {
            // console.log("page changed");
            localStorage.setItem("authenticatedUser", "granted");

            window.location.href = "/mypage";
          }, 500);

          return response.json();
        } else if (response.status === 400) {
          errormsg.style.display = "block";
          registeredmsg.style.display = "none";

          return response.json();
        } else {
          throw new Error("Server Error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
