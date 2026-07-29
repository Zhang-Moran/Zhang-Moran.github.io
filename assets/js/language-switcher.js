(function () {
  "use strict";

  var select = document.getElementById("language-select");

  if (!select || !window.siteLanguageUrls) {
    return;
  }

  select.addEventListener("change", function () {
    var target = window.siteLanguageUrls[select.value];
    if (target) {
      window.location.href = target + window.location.hash;
    }
  });
}());
