window.addEventListener("load", function () {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("ServiceWorker.js");
    }
});

var viewContent = document.querySelector("#viewContent");
var canvas = document.querySelector("#unity-canvas");
var loading = document.querySelector("#loading");
var warningBanner = document.querySelector("#warningBanner");
var unityInstance;
var buildUrl = "Build";
var loaderUrl = buildUrl + "/bourekas-web.loader.js";
var config = {
    dataUrl: buildUrl + "/bourekas-web.data",
    frameworkUrl: buildUrl + "/bourekas-web.framework.js",
    codeUrl: buildUrl + "/bourekas-web.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Bourekas",
    productVersion: "0.0.2"
};

viewContent.style.background = "url(Build/bourekas-web.jpg) center / cover;";

const webApp = getTelegramWebApp();
if (true) {
    showLoading();

    //webApp.enableClosingConfirmation();
    //webApp.disableVerticalSwipes();
    //webApp.expand();

    var script = document.createElement("script");
    script.src = loaderUrl;
    let unityLogoDurationMs = 3000;

    script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
            
        }).then((uInstance) => {
        
        window.setTimeout(function () { // do not display unity logo in the middle of html loading screen
            hideLoadingScreen();
            console.log("#index unity logo hidden");
        }, unityLogoDurationMs);
        
            unityInstance = uInstance;
        }).catch(function (message) {
            console.log("#index createUnityInstance catch: " + message);
            alert(message);
        });
    };
    document.body.appendChild(script);
}

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
}

function hasTgData() {
    showMessage(`${webApp} - ${webApp?.platform?.toLowerCase()} - ${webApp?.platform?.toLowerCase() == "android"}`, 'warning')
    if (!(webApp && (webApp.platform.toLowerCase() == "android" || webApp.platform.toLowerCase() == "ios"))) {
        canvas.remove();
        showQR();
        return false;
    }
    return true;
}

function showQR() {
    var qr = `<div id="qr"><main class="main-center"><div class="content-no-telegram"><p>Play on your mobile</p><a href="https://t.me/bourekas_game_bot"><img src="TemplateData/images/qr.png" alt="@bourekas_game_bot"></a><a href="https://t.me/bourekas_game_bot">@bourekas_game_bot</a><p>${webApp?.platform?.toLowerCase()}</p></div></main></div>`;
    viewContent.innerHTML = qr;
}

function showLoading() {
    viewContent.style.opacity = 0;
}

function hideLoadingScreen() {
    viewContent.style.opacity = 1;
}

function showMessage(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
}

function getTelegramWebApp() {
    return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
}

function handleTelegramWebApp(callback) {
    if (webApp) {
        callback(webApp);
        return true;
    }
    else {
        showMessage ("web app is null", "error");
        return false;
    }
}
