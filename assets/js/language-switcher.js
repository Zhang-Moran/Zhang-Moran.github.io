(function () {
  "use strict";

  var sourceLanguage = "zh-CN";
  var select = document.getElementById("language-select");

  if (!select) {
    return;
  }

  function getCookie(name) {
    var prefix = name + "=";
    return document.cookie.split(";").map(function (cookie) {
      return cookie.trim();
    }).find(function (cookie) {
      return cookie.indexOf(prefix) === 0;
    });
  }

  function getSelectedLanguage() {
    var translation = getCookie("googtrans");
    return translation ? translation.split("/").pop() : sourceLanguage;
  }

  function setTranslation(language) {
    var value = language === sourceLanguage ? "" : "/" + sourceLanguage + "/" + language;
    var expires = "expires=" + new Date(Date.now() + 31536000000).toUTCString();
    var cookie = "googtrans=" + value + "; path=/; " + expires + "; SameSite=Lax";

    document.cookie = cookie;
    if (window.location.hostname) {
      document.cookie = cookie + "; domain=" + window.location.hostname;
    }
    window.location.reload();
  }

  select.value = getSelectedLanguage();
  select.addEventListener("change", function () {
    setTranslation(select.value);
  });

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: sourceLanguage,
      includedLanguages: "zh-CN,en",
      autoDisplay: false
    }, "google-translate-element");
  };

  var container = document.createElement("div");
  container.id = "google-translate-element";
  container.hidden = true;
  document.body.appendChild(container);

  var script = document.createElement("script");
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}());
