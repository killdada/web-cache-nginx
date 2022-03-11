function getScriptAddress(scriptStr) {
  var jsTagReg = /^\x3Cscript(\s|.)+src="(.*\.js)"(\s|.)+\x3C\/script>$/;
  var match = jsTagReg.exec(scriptStr);
  if (match) return match[2];
  return false;
}

function getCssAddress(cssStr) {
  var cssTagReg = /^<link(\s|.)+href="(.*\.css)"(\s|.)*>$/;
  var match = cssTagReg.exec(cssStr);
  if (match) return match[2];
  return false;
}

window.addEventListener(
  'error',
  function (event) {
    // js,css 404返回的都是html标签，并没有 loading chunk 那种error抛出，那个error在import有抛出
    console.log('addEventListener', event);
    // 如果是 / 这种绝对路径的js、css文件那么说明就是当前站点的文件
    var absoulteJsCssReg = /^\/.+\.(css|js)$/;
    var tagStr = event.target.outerHTML;
    var address = getScriptAddress(tagStr) || getCssAddress(tagStr);
    debugger;
    // 错误源是js、css并且绝对路径是当前站点路径，那么直接重定向，文件 404问题
    if (address && absoulteJsCssReg.test(address)) {
      debugger;
      window.location.reload();
    }
  },
  true,
);
