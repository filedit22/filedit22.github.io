let otpMenuVisible = false
let iptest = "https://ec2793e3ba57.ngrok-free.app";
window.addEventListener("load", () => {
// change IP depend on grok ip
    // example : let iptest = "https://f3d7-180-244-166-224.ngrok-free.app";
    
    // Show correct menu based on stored state
    if (otpMenuVisible) {
      
      showOtpMenu();
    } else {
      showNoOtpMenu();
    }

  });

//reset cookie
window.addEventListener("unload", function () {
  document.cookie.split(";").forEach(function (cookie) {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });
});


//slider shit
var slider = document.getElementById("noOtplengthpass");
var slider2 = document.getElementById("lengthpass");

slider.oninput = function() {
  document.getElementById('noOtppasslengthtext').value=slider.value
}
slider2.oninput = function() {
  document.getElementById('passlengthtext').value=slider2.value
}

var silder = document.getElementById("noOtppasslengthtext");
var silder2 = document.getElementById("passlengthtext");

silder.oninput = function() {
  slider.value=silder.value
  } 

silder.onBlur = silder.onchange = function() {
  let value = parseInt(silder.value)
  if (isNaN(value) || value<8) value=8;
  if (isNaN(value) || value>20) value=20; 
    silder.value=value
    slider.value=silder.value
}  

silder2.oninput = function() {
  slider2.value=silder2.value
  } 

silder2.onBlur = silder2.onchange = function() {
  let value = parseInt(silder2.value)
  if (isNaN(value) || value<8) value=8;
  if (isNaN(value) || value>20) value=20; 
    silder2.value=value
    slider2.value=silder2.value
}  

// otp shit
  
function showOtpMenu() {
  document.getElementById("noOtpMenu").style.display = "none";
  document.getElementById("otpMenu").style.display = "block";
}

function showNoOtpMenu() {
  document.getElementById("noOtpMenu").style.display = "block";
  document.getElementById("otpMenu").style.display = "none";
}

// Toggle menus with buttons
document.getElementById("btnUseOtp").addEventListener("click", () => {
  showOtpMenu();
  });


document.getElementById("btnNoOtp").addEventListener("click", () => {
  showNoOtpMenu();
 
});


// Copy password on click
document.getElementById("generatedPassword").addEventListener("click", () => {
  copyToClipboard(document.getElementById("generatedPassword").textContent);
});
document.getElementById("gen").addEventListener("click", () => {
  copyToClipboard(document.getElementById("generatedPassword").textContent);
});

document.getElementById("genno").addEventListener("click", () => {
  copyToClipboard(document.getElementById("generatednoPassword").textContent);
});
document.getElementById("generatednoPassword").addEventListener("click", () => {
  copyToClipboard(document.getElementById("generatednoPassword").textContent);
});


function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const notice = document.getElementById("copiedNotice");
    notice.style.display = "inline";
    setTimeout(() => { notice.style.display = "none"; }, 1500);
    const notice2 = document.getElementById("copiedNotice2");
    notice2.style.display = "inline";
    setTimeout(() => { notice2.style.display = "none"; }, 1500);
  });


  
}

function sendOTP() {
  const email = document.getElementById("emailInput").value;
  const status = document.getElementById("otpSendStatus");
  console.log("Email btw:", email);
  if (!email.includes("@")) {
      status.innerText = "Invalid email address.";
      status.style.color = "pink";
      setTimeout(() => {
    status.innerText = "";
  }, 3000);
      return;
  }else {
    status.innerText = "Sending OTP";
    status.style.color = "white";

  // SEND fetch
  fetch(`${iptest}/send_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
  })
      .then(res => res.json())
      .then(data => {
          status.innerText = "OTP sent!"; otpInput
          //statusDiv.innerText = data.message;
          //statusDiv.style.color = data.message.includes("OTP sent") ? "green" : "red";
          document.getElementById("otpContain").style.display = "block";
      });
}
}


function verifyOTP() {
  const otp = document.getElementById("otpInput").value;

  fetch(`${iptest}/verify_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput.value, otp: otp })
  })
      .then(res => res.json())
      .then(data => {
          const otpStatus = document.getElementById("otpStatus");
          console.log("otpstatus btw:", otpStatus);
          otpStatus.innerText = data.message;

          if (data.message === "OTP Verified!") {
              otpStatus.style.color = "green";
              const email = document.getElementById("emailInput").value;
              document.getElementById("passwordSection").style.display = "block";
              document.getElementById("emailInput").readOnly = true;
              const input = document.getElementById("emailInput");
              const observer = new MutationObserver(() => {
                input.value = `${email}`;
                input.disabled = true;
});

observer.observe(input, { attributes: true, childList: false, subtree: false });

          } else {
              otpStatus.style.color = "red"; 
          }
      });

}

function generatePassword() {
  const payload = {
      username: document.getElementById("username").value,
      master_password: document.getElementById("masterPassword").value,
      site: document.getElementById("siteName").value,
      length: document.getElementById("passlengthtext").value,
      sc: document.getElementById("sc").checked,
      email: emailInput.value
  };


  if(payload.sc == false){
  fetch(`${iptest}/generate_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  })
      .then(res => res.json())
      .then(data => {
          document.getElementById("generatedPassword").innerText = data.password;
      });
} else if(payload.sc == true){
  fetch(`${iptest}/generate_passwordsc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  })
      .then(res => res.json())
      .then(data => {
          document.getElementById("generatedPassword").innerText = data.password;
      });
}
}

function generateNoOtpPassword() {
  const payloadno = {
      usernameno: document.getElementById("noOtpUsername").value,
      masterno: document.getElementById("noOtpMaster").value,
      siteno: document.getElementById("noOtpSite").value,
      lengthno: document.getElementById("noOtppasslengthtext").value,
      
  };

  const nosc = document.getElementById("nosc").checked;
  const endpoint = nosc ? "/generateno_passwordsc" : "/generateno_password";

  fetch(`${iptest}${endpoint}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payloadno)
})
.then(res => res.json())
.then(datano => {
  document.getElementById("generatednoPassword").innerText = datano.password;
});

  }

document.getElementById("btnSendOtp").addEventListener("click", function(event) {
  event.preventDefault();
  sendOTP();
});

document.getElementById("btnVerifyOtp").addEventListener("click", function(event) {
  event.preventDefault();
  verifyOTP();
});

document.getElementById("btnGeneratePwd").addEventListener("click", function(event) {
  event.preventDefault();
  generatePassword();
});
document.getElementById("btnGenerateNoOtpPwd").addEventListener("click", generateNoOtpPassword);
