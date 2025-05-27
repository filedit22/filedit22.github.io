let otpMenuVisible = false
let iptest = "https://f3d7-180-244-166-224.ngrok-free.app";
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
    const noOtpSiteValue = document.getElementById("noOtpSite").value;
  const siteNameInput = document.getElementById("siteName");
  if (siteNameInput) {
    siteNameInput.value = noOtpSiteValue || siteNameInput.value;
  }
  showOtpMenu();
  // Open popup window for OTP
  chrome.runtime.sendMessage("open_otp_window", (response) => {
    console.log("OTP popup window status:", response.status);
   
  });
});

document.getElementById("btnNoOtp").addEventListener("click", () => {
  showNoOtpMenu();
 
});


// Copy password on click
document.getElementById("generatedPassword").addEventListener("click", () => {
  copyToClipboard(document.getElementById("generatedPassword").textContent);
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
  });


  
}

function sendOTP() {
  const email = document.getElementById("emailInput").value;
  const status = document.getElementById("otpSendStatus");

  if (!email.includes("@")) {
      status.innerText = "Invalid email address.";
      status.style.color = "red";
      return;
  }

  // SEND fetch
  fetch(`${iptest}/send_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email })
  })
      .then(res => res.json())
      .then(data => {
          status.innerText = "OTP sent!"; otpInput
          status.style.color = "green";
          //statusDiv.innerText = data.message;
          //statusDiv.style.color = data.message.includes("OTP sent") ? "green" : "red";
          document.getElementById("otpContain").style.display = "block";
      });
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
          otpStatus.innerText = data.message;

          if (data.message === "OTP Verified!") {
              otpStatus.style.color = "green";
              document.getElementById("passwordSection").style.display = "block";
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
      email: emailInput.value
  };
  console.log("Username:", payload.username);
  console.log("Master Password:", payload.master_password);
  console.log("Site:", payload.site);
  console.log("Email:", payload.email);


  fetch(`${iptest}/generate_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  })
      .then(res => res.json())
      .then(data => {
          document.getElementById("generatedPassword").innerText = data.password;
      });
}

function generateNoOtpPassword() {
  const payloadno = {
      usernameno: document.getElementById("noOtpUsername").value,
      masterno: document.getElementById("noOtpMaster").value,
      siteno: document.getElementById("noOtpSite").value,
  };

  console.log("Username:", payloadno.usernameno);
  console.log("Master Password:", payloadno.masterno);
  console.log("Site:", payloadno.siteno);


  fetch(`${iptest}/generateno_password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadno)
            })
      .then(res => res.json())
      .then(datano => {
          document.getElementById("generatednoPassword").innerText = datano.password;
      });
    }
  
document.getElementById("btnSendOtp").addEventListener("click", sendOTP);
document.getElementById("btnVerifyOtp").addEventListener("click", verifyOTP);
document.getElementById("btnGeneratePwd").addEventListener("click", generatePassword);
document.getElementById("btnGenerateNoOtpPwd").addEventListener("click", generateNoOtpPassword);
