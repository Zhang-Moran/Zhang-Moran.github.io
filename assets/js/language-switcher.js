(function () {
  "use strict";

  var sourceLanguage = "zh-CN";
  var select = document.getElementById("language-select");
  var translatedNodes = [];

  if (!select) {
    return;
  }

  function textNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!node.nodeValue.trim() || !parent || parent.closest("[data-no-translate], script, style, code, pre")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var node;

    while ((node = walker.nextNode())) {
      nodes.push(node);
    }
    return nodes;
  }

  function restoreChinese() {
    translatedNodes.forEach(function (entry) {
      entry.node.nodeValue = entry.original;
    });
    translatedNodes = [];
    document.documentElement.lang = sourceLanguage;
  }

  function translateToEnglish() {
    var endpoint = window.glmTranslationEndpoint;
    var nodes = textNodes();

    if (!endpoint) {
      window.alert("英文自动翻译尚未配置 GLM 安全代理地址。");
      select.value = sourceLanguage;
      return;
    }

    select.disabled = true;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_language: sourceLanguage,
        target_language: "en",
        texts: nodes.map(function (node) { return node.nodeValue; })
      })
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Translation request failed");
      }
      return response.json();
    }).then(function (result) {
      if (!Array.isArray(result.translations) || result.translations.length !== nodes.length) {
        throw new Error("Invalid translation response");
      }
      translatedNodes = nodes.map(function (node, index) {
        return { node: node, original: node.nodeValue };
      });
      result.translations.forEach(function (translation, index) {
        nodes[index].nodeValue = translation;
      });
      document.documentElement.lang = "en";
    }).catch(function () {
      window.alert("英文翻译失败，请稍后重试。");
      select.value = sourceLanguage;
    }).finally(function () {
      select.disabled = false;
    });
  }

  select.value = sourceLanguage;
  select.addEventListener("change", function () {
    if (select.value === sourceLanguage) {
      restoreChinese();
    } else {
      translateToEnglish();
    }
  });
}());
