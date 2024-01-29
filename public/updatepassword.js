const loginSection = document.querySelector(".updatepassword-section");
var loginBox = document.createElement("div");
loginBox.classList.add("updatepassword-box");
loginSection.append(loginBox);
var loginheader = document.createElement("h2");
loginheader.textContent = "Reset Password";
loginBox.append(loginheader);
var form = document.createElement("form");
form.id = "userdetails";
form.classList.add("login-form");
var input = document.createElement("input");
input.id = "temporarycode";
input.classList.add("login-input");
input.placeholder = "Enter the Code";
input.required = true;

var passwordbox = document.createElement("div");
passwordbox.classList.add("password-box");
var inputpassword = document.createElement("input");
inputpassword.id = "password";
inputpassword.classList.add("password-input");
inputpassword.minLength = 6;
inputpassword.placeholder = "Enter New Password";
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

var newpasswordbox = document.createElement("div");
newpasswordbox.classList.add("password-box");
var inputpasswordagain = document.createElement("input");
inputpasswordagain.id = "newpassword";
inputpasswordagain.classList.add("password-input");
inputpasswordagain.placeholder = "Re Enter New Password";
inputpasswordagain.type = "password";
inputpasswordagain.required = true;
newpasswordbox.append(inputpasswordagain);

var toggleIcontwo = document.createElement("img");
toggleIcontwo.classList.add("eyebtn");
toggleIcontwo.src = "eyeicon.png";
newpasswordbox.append(toggleIcontwo);

toggleIcontwo.addEventListener("click", function () {
  togglePasswordVisibilitytwo();
});

function togglePasswordVisibilitytwo() {
  if (inputpasswordagain.type === "password") {
    inputpasswordagain.type = "text";
  } else {
    inputpasswordagain.type = "password";
  }
}

var inputButton = document.createElement("button");
inputButton.type = "submit";
inputButton.textContent = " Reset";
inputButton.classList.add("login-button");

var errormsg = document.createElement("h4");
errormsg.textContent = "Passwords not matching!";
errormsg.classList.add("userfound-errormsg");
var inputemail = document.createElement("h5");

loginBox.append(form);
form.append(input);
form.append(passwordbox);
form.append(newpasswordbox);
form.appendChild(inputButton);
loginBox.append(errormsg);
loginBox.append(inputemail);

document.getElementById("userdetails").setAttribute("autocomplete", "off");


document.addEventListener("DOMContentLoaded", function () {
  var userDataForm = document.getElementById("userdetails");
  userDataForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var temporarycode = document.getElementById("temporarycode").value;
    var password = document.getElementById("password").value;
    var newpassword = document.getElementById("newpassword").value;

    if (password === newpassword) {
      var userData = {
        temporarycode: temporarycode,
        password: password,
      };

      fetch("/updateNewpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {

            inputemail.textContent = "Password Updated Successfully✅";

      setTimeout(function () {
        console.log("page changed");

        window.location.href = "/login";
      }, 600);
            // window.location.href = "/login";
          } else if (response.status === 404) {
            errormsg.textContent = "Incorrect Recovery Code";
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
    } else {
      errormsg.textContent = "Passwords not matching!";

      errormsg.style.display = "block";

      setTimeout(function () {
        errormsg.style.display = "none";
      }, 3000);
    }
  });
});
