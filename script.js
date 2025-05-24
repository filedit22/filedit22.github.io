// Restore saved values on load
window.addEventListener("load", () => {
  chrome.storage.local.get([
    "noOtpUsername", "noOtpMaster", "noOtpSite",
    "username", "masterPassword", "siteName",
    "otpMenuVisible"
  ], (result) => {
    // Restore No OTP inputs
    if (result.noOtpUsername) document.getElementById("noOtpUsername").value = result.noOtpUsername;
    if (result.noOtpMaster) document.getElementById("noOtpMaster").value = result.noOtpMaster;
    if (result.noOtpSite) document.getElemehttps://1319-34-16-247-67.ngrok-free.appntById("noOtpSite").value = result.noOtpSite;

    // Restore OTP inputs
    if (result.username) document.getElementById("username").value = result.username;
    if (result.masterPassword) document.getElementById("masterPassword").value = result.masterPassword;
    if (result.siteName) document.getElementById("siteName").value = result.siteName;

    // Show correct menu based on stored state
    if (result.otpMenuVisible) {
      
      showOtpMenu();
    } else {
      showNoOtpMenu();
    }

    // Auto-fill site name fields with active tab's hostname if empty
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return; // no active tab
      try {
        const url = new URL(tabs[0].url);

        if (url.protocol === "http:" || url.protocol === "https:") {
          const hostname = url.hostname;
          chrome.storage.local.set({ siteName: hostname });
          chrome.storage.local.set({ noOtpSite: hostname });
          const noOtpSiteInput = document.getElementById("noOtpSite");
          const siteNameInput = document.getElementById("siteName");
          if (!noOtpSiteInput) {
            noOtpSiteInput.value = hostname;
          }

          if (noOtpSiteInput) {
            // Autofill noOtpSite if empty
            if (noOtpSiteInput.value !=  hostname) {
              noOtpSiteInput.value = hostname;
            }
            if (!noOtpSiteInput.value) {
              noOtpSiteInput.value = hostname;
            }
            // Sync siteName to noOtpSite value
            if (siteNameInput && noOtpSiteInput.value) {
              siteNameInput.value = noOtpSiteInput.value;
            } else if (siteNameInput && !siteNameInput.value) {
              // If noOtpSite is empty and siteName is empty, autofill siteName with hostname
              siteNameInput.value = hostname; 
            }
          }
        }
      } catch (e) {
        console.error("Invalid URL in active tab", e);
      }
    });
  });
});

function showOtpMenu() {
  document.getElementById("noOtpMenu").style.display = "none";
  document.getElementById("otpMenu").style.display = "block";
  chrome.storage.local.set({ otpMenuVisible: true }); // only saving otpMenuVisible here
}

function showNoOtpMenu() {
  document.getElementById("noOtpMenu").style.display = "block";
  document.getElementById("otpMenu").style.display = "none";
  chrome.storage.local.set({ otpMenuVisible: false }); // only saving otpMenuVisible here
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
  fetch("https://1319-34-16-247-67.ngrok-free.app/send_otp", {
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

  fetch("https://1319-34-16-247-67.ngrok-free.app/verify_otp", {
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


  fetch("https://1319-34-16-247-67.ngrok-free.app/generate_password", {
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


  fetch("https://a5b2-34-16-247-67.ngrok-free.app/generateno_password", {
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
