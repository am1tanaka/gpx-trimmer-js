/**
 * GPXの整理を行うライブラリ
 */

$ = require('jquery');

/**
 * trksegタグを削除
 * @param string gpx GPX文字列
 * @return string タグを削除した後のGPXを文字列で返す。
 */
exports.removeSegment = function (gpx) {
  // 改行を削除
  var rep = gpx
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/<trkseg>/gi,"")
    .replace(/<\/trkseg>/gi,"")
    .replace(/ *</g,"<")
    .replace(/> */g,">");
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
  var trimseg = exports.removeSegment(gpx);
  return trimseg;
};

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
