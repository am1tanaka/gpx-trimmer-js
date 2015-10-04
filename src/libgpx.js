/**
 * GPXファイル操作のページ用のJavaScript
 * @copyright 2015 YuTanaka
 * @license MIT
 */

var gpxtrim = require('./gpx-trimmer');
var strGPX = "";
var fileGPX = "";

// パラメータ設定
$('#fileGpx').change(function() {
  // 機能チェック
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
  }

  // ファイル取得
  fileGPX = $(this).prop('files')[0];
  var reader = new FileReader();
  reader.onload = (function(fdata) {
    return function(e) {
      strGPX = e.target.result;
      detectGPX(strGPX);
    };
  })(fileGPX);

  // 読み込み開始
  reader.readAsText(fileGPX);
});

/** GPXファイルの開始と終了時間を読み取って、ページに反映させる*/
function detectGPX(data) {
  var span = gpxtrim.getTime(data);
  $('#gpxstatus').html("開始日時:"+strDate(span.first)+"<br/>終了日時:"+strDate(span.last));
  $('#textStart').val(strDate(span.first));
  $('#textEnd').val(strDate(span.last));
}

function strDate(dt) {
  return ""+dt.getFullYear()+"-"+dt.getMonth()+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
}
