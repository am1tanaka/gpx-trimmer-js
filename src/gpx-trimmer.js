/**
 * GPXの整理を行うライブラリ
 */
var DOMParser = require('xmldom').DOMParser;

/**
 * trksegタグを削除
 * @param string gpx GPX文字列
 * @return string タグを削除した後のGPXを文字列で返す。
 */
exports.removeSegment = function (gpx) {
  // 改行を削除
  var rep = gpx
    .replace(/\r|\n|<trkseg>|<\/trkseg>/gi, "")
    .replace(/ *</g,"<")
    .replace(/> */g,">")
    .replace(/ *\?>/g,"?>")
    .replace(/\t/i," ");
  // タグを削除
  return rep;
};

/**
 * 指定の範囲にGPXデータを丸め込む。
 * @param string gpx GPX文字列
 * @param Date start 開始時間
 * @param Date end 終了時間
 * @return string UTF8でGPX文字列を返す。改行は削除
 */
exports.trim = function (gpx, start, end) {
  var tm;
  var parent;
  var parser = new DOMParser();
  var doc = parser.parseFromString(gpx, "application/xml");
  var times = doc.getElementsByTagName('time');
  var isFirst = true;
  var lasttrk = 0;
  var clone;
  var noStart = false;
  var noEnd = false;

  // データのチェック
  if (!(start instanceof Date)) {
    noStart = true;
  }
  if (!(end instanceof Date)) {
    noEnd = true;
  }

  // データがなかったら何もせずに返す
  if (times.length === 0) {
    return exports.removeSegment(doc.toString());
  }

  // データをトリミング
  for (var i=0 ; i<times.length ; i++) {
    if (times[i].parentNode.tagName !== "trkpt") continue;

    // 最初の1つめがstartより後ろだったら、最初にデータを追加する
    if (  isFirst &&
          !noStart &&
          (new Date(times[i].firstChild) > start)) {
      clone = getCloneTrkpt(times[i], doc.createTextNode(ISODateString(start)));
      times[i].parentNode.parentNode.insertBefore(clone, times[i].parentNode);
      isFirst = false;
      continue;
    }
    isFirst = false;

    // 最後のデータ
    lasttrk = i;

    // 時間より前か
    tm = new Date(times[i].firstChild);
    if (  ((tm < start) && !noStart) ||
          ((tm > end) && !noEnd)) {
      // このデータを削除
      times[i].parentNode.parentNode.removeChild(times[i].parentNode);
    }
  }

  // 最後の時間がendより前だったら追加
  if ((tm < end) && (!noEnd)) {
    clone = getCloneTrkpt(times[lasttrk], doc.createTextNode(ISODateString(end)));
    times[lasttrk].parentNode.parentNode.appendChild(clone, times[lasttrk].parentNode);
  }

  return exports.removeSegment(doc.toString());
};

/**
 * 指定のtimeエレメントを含むtrkptエレメントを複製して、指定の時間に差し替える
 * @param element elemtm 複製するDOMElement
 * @param element time 差し替える時間をTextNodeに設定したエレメント
 * @return element クローンして時間を差し替えたDOMElement
 */
function getCloneTrkpt(elemtm, time) {
  var clone = elemtm.parentNode.cloneNode(true);
  var clonetime = clone.getElementsByTagName('time')[0];
  clonetime.removeChild(clonetime.firstChild);
  clonetime.appendChild(time);
  return clone;
}


/**
 * 指定の距離以内の点をまとめる。
 * @param string gpx GPX文字列
 * @param number dist 距離をメートル単位で指定。この距離以内の点をまとめる
 * @param bool leftLast true=最初と最後の点を残す / false=最初の点のみ残す。初期値はtrue
 * @param bool useEle true=高度データを利用 / false=標高を無視 / 初期値はtrue
 * @return string UTF8でGPX文字列を返す。改行は削除
 */
exports.group = function(gpx, dist, leftLast, useEle) {
  return "<gpx></gpx>";
};

/**
 * 異常値の削除。指定の秒速よりも速い移動で1つだけはみ出す点があったら削除する
 * @param string gpx GPX文字列
 * @param number vel 異常値を秒速で指定
 * @return string UTF8でGPX文字列を返す。改行は削除
 */
exports.cut = function(gpx, vel) {
    return "<gpx></gpx>";
};

/**
 * 時間を取得して、オブジェクトで返す
 * @param string gpx GPXのUTF8文字列
 * @return first=開始時間 / last=終了時間のDateオブジェクト
 */
exports.getTime = function(gpx) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(gpx, "application/xml");
  var times = doc.getElementsByTagName('time');
  var ret = {};
  for (var i=0 ; i<times.length ; i++) {
    if (times[i].parentNode.tagName !== "trkpt") {
      continue;
    }
    // 最初のデータ
    if (!ret.hasOwnProperty('first')) {
      ret.first = new Date(times[i].firstChild);
    }
    else {
      ret.last = new Date(times[i].firstChild);      
    }
  }
  return ret;
};

/* 望まれる正確な形式のために関数を使用します...
https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
*/
function ISODateString(d){
  function pad(n){return n<10 ? '0'+n : n;}
  return d.getUTCFullYear()+'-' +
    pad(d.getUTCMonth()+1)+'-' +
    pad(d.getUTCDate())+'T' +
    pad(d.getUTCHours())+':' +
    pad(d.getUTCMinutes())+':' +
    pad(d.getUTCSeconds())+'Z';
}
