const resetcontentSection = document.querySelector(".resetcontent-section");
var searchAccountBox = document.createElement("div");
searchAccountBox.classList.add("searchaccount-box");

resetcontentSection.append(searchAccountBox);
var loginheader = document.createElement("h2");
loginheader.textContent = "Find Your Account";
searchAccountBox.append(loginheader);
var form = document.createElement("form");
form.id = "searchaccountnameorEmail";
form.classList.add("login-form");
var searchBoxheader = document.createElement("p");
searchBoxheader.textContent =
  "Please enter your email address or username to search for your account";
var input = document.createElement("input");
input.classList.add("login-input");
input.placeholder = "Email address or Username";
input.id = "searchnameorEmail";
input.required = true;

var inputcontentButton = document.createElement("button");
inputcontentButton.type = "submit";
inputcontentButton.textContent = "Search";
inputcontentButton.classList.add("login-button");

var backtologinButton = document.createElement("button");
backtologinButton.textContent = "Cancel";
backtologinButton.classList.add("search-button");

backtologinButton.addEventListener("click", function () {
  window.location.href = "/login";
});
var errormsg = document.createElement("h4");
errormsg.textContent = "No search results, Please Try Again!";
errormsg.classList.add("userfound-errormsg");

var sendemailBox = document.createElement("div");
sendemailBox.classList.add("sendmail-box");
resetcontentSection.append(sendemailBox);
var resetheader = document.createElement("h2");
resetheader.textContent = "Account Found";
sendemailBox.append(resetheader);
var sendmailform = document.createElement("form");
sendmailform.id = "searchaccountnameorEmail";
sendmailform.classList.add("login-form");
var sendmailBoxheader = document.createElement("p");
sendmailBoxheader.textContent =
  "We'll send you a Code to your email to get back into your account.";
var inputemail = document.createElement("h5");

var sendmailButton = document.createElement("button");
sendmailButton.type = "submit";
sendmailButton.textContent = "Send Login Link";
sendmailButton.classList.add("login-button");

var gobacktologinButton = document.createElement("a");
gobacktologinButton.textContent = "Back to Login Page";
gobacktologinButton.classList.add("gobacktologin");

var or = document.createElement("p");
or.textContent = "----- OR -----";

var lineBreak = document.createElement("br");
var lineBreakone = document.createElement("br");
var backtosignupButton = document.createElement("a");
backtosignupButton.textContent = "Create new account";
backtosignupButton.classList.add("gobacktologin");

backtologinButton.addEventListener("click", function () {
  window.location.href = "/login";
});

gobacktologinButton.addEventListener("click", function () {
  window.location.href = "/login";
});

backtosignupButton.addEventListener("click", function () {
  window.location.href = "/register";
});
searchAccountBox.append(form);
form.append(searchBoxheader);
form.append(input);
form.appendChild(inputcontentButton);
form.appendChild(backtologinButton);

searchAccountBox.append(errormsg);

sendemailBox.append(sendmailform);
sendmailform.append(sendmailBoxheader);
sendmailform.append(inputemail);
sendemailBox.appendChild(sendmailButton);
sendemailBox.append(lineBreakone);
sendemailBox.append(lineBreakone);
sendemailBox.append(lineBreakone);
sendemailBox.append(gobacktologinButton);
sendemailBox.append(lineBreak);
sendemailBox.append(or);
sendemailBox.append(backtosignupButton);

document.getElementById('searchaccountnameorEmail').setAttribute('autocomplete', 'off');


let matcheduseremail;

document.addEventListener("DOMContentLoaded", function () {
  var userDataForm = document.getElementById("searchaccountnameorEmail");
  userDataForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var searchnameorEmail = document.getElementById("searchnameorEmail").value;

    console.log(searchnameorEmail);

    var usernameorEmail = {
      searchnameorEmail: searchnameorEmail,
    };

    fetch("/searchUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usernameorEmail),
    })
      .then((response) => {
        if (response.ok) {
          searchAccountBox.style.display = "none";
          sendemailBox.style.display = "block";

          fetch("/showUsermail")
            .then((response) => response.json())
            .then((data) => {
              // console.log("data got", data);
               matcheduseremail = data.matcheduseremail;
              inputemail.textContent += matcheduseremail;
            })
            .catch((error) => console.error("Error:", error));
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

sendmailButton.addEventListener("click", function () {
  // alert("sent")

  const to = matcheduseremail;
      

      fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to}),
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));


      inputemail.textContent = "Email has been sent✅";

      setTimeout(function () {
        console.log("page changed");

        window.location.href = "/updatenewpassword";
      }, 1300);
});


// nanoid 