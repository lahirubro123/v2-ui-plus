let ONE_KB = 1024;
let ONE_MB = ONE_KB * 1024;
let ONE_GB = ONE_MB * 1024;
let ONE_TB = ONE_GB * 1024;
let ONE_PB = ONE_TB * 1024;
let SEQ = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window = {
  docCookies,
  isEmpty,
  isArrEmpty,
  findAndSet,
  base64,
  safeBase64,
  execute,
  clone,
  deepClone,
  deepSearch,
  sizeFormat,
  randomIntRange,
  randomInt,
  randomString,
  randomLowerAndNum,
  randomUUID,
};

var docCookies = {
  getItem: function (sKey) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            "(?:(?:^|.*;)\\s*" +
              encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
              "\\s*\\=\\s*([^;]*).*$)|^.*$"
          ),
          "$1"
        )
      ) || null
    );
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=" +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "") +
      (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return new RegExp(
      "(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\="
    ).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    let aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

function isEmpty(obj) {
  return obj === null || obj === undefined || obj === "";
}

function isArrEmpty(arr) {
  return !isEmpty(arr) && arr.length === 0;
}

function findAndSet(obj, key, val) {
  if (obj instanceof Array) {
    obj = obj.map((o) => findAndSet(o, key, val));
  } else if (obj instanceof Object) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = val;
    } else {
      for (let k in obj) {
        findAndSet(obj[k], key, val);
      }
    }
  }
}

function base64(str) {
  return Base64.encode(str);
}

function safeBase64(str) {
  return base64(str).replace(/\+/g, "-").replace(/=/g, "").replace(/\//g, "_");
}

function execute(func, ...args) {
  if (!isEmpty(func) && typeof func === "function") {
    func(...args);
  }
}

function copyArr(dest, src) {
  dest.splice(0);
  for (const item of src) {
    dest.push(item);
  }
}

function clone(obj) {
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    copyArr(newObj, obj);
  } else if (obj instanceof Object) {
    newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = obj[key];
    }
  } else {
    newObj = obj;
  }
  return newObj;
}

function deepClone(obj) {
  let newObj;
  if (obj instanceof Array) {
    newObj = [];
    for (const item of obj) {
      newObj.push(deepClone(item));
    }
  } else if (obj instanceof Object) {
    newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = deepClone(obj[key]);
    }
  } else {
    newObj = obj;
  }
  return newObj;
}

function deepSearch(obj, val) {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; ++i) {
      if (deepSearch(obj[i], val)) {
        return true;
      }
    }
  } else if (obj instanceof Object) {
    for (let key in obj) {
      if (deepSearch(obj[key], val)) {
        return true;
      }
    }
  } else {
    return obj.toString().indexOf(val) >= 0;
  }
  return false;
}

function sizeFormat(size) {
  if (size < ONE_KB) {
    return size.toFixed(0) + " B";
  } else if (size < ONE_MB) {
    return (size / ONE_KB).toFixed(2) + " KB";
  } else if (size < ONE_GB) {
    return (size / ONE_MB).toFixed(2) + " MB";
  } else if (size < ONE_TB) {
    return (size / ONE_GB).toFixed(2) + " GB";
  } else if (size < ONE_PB) {
    return (size / ONE_TB).toFixed(2) + " TB";
  } else {
    return (size / ONE_PB).toFixed(2) + " PB";
  }
}

function randomIntRange(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
}

function randomInt(n) {
  return randomIntRange(0, n);
}

function randomString(count) {
  let str = "";
  for (let i = 0; i < count; ++i) {
    str += SEQ[randomInt(62)];
  }
  return str;
}

function randomLowerAndNum(count) {
  let str = "";
  for (let i = 0; i < count; ++i) {
    str += SEQ[randomInt(36)];
  }
  return str;
}

function randomUUID() {
  let d = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
}
