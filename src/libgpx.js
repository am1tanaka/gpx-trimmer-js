/**
 * GPXファイル操作のページ用のJavaScript
 * @copyright 2015 YuTanaka
 * @license MIT
 */

var gpxtrim = require('./gpx-trimmer');
var strGPX = "";
var fileGPX = "";
var rangeGPX = {};

// イベント設定
$('#fileGpx').change(changeFile);
$('submit').click(submitGpx);

/** SUBMITボタン*/
function submitGpx() {
  var result;

  if (strGPX.length === 0) {
    alert('GPXファイルを選択してください。');
    return ;
  }

  // 変換
  var dtst = Date.parse($('#textStart').val());
  var dted = Date.parse($('#textEnd').val());

  // 空欄
  if (isNaN(dtst)) {
    dtst = rangeGPX.first.getTime();
  }
  if (isNaN(dted)) {
    dted = rangeGPX.last.getTime();
  }
  // 入れ替えチェック
  if (dtst > dted) {
    alert("開始日時の方が、終了日時より後の時間になっています。");
    return;
  }
  // 開始時間がGPXより遅い
  if (dtst > rangeGPX.last.getTime()) {
    alert("開始日時がGPXの時間を過ぎています。");
    return;
  }
  // 終了時間がGPXより早い
  if (dted < rangeGPX.first.getTime()) {
    alert('終了日時がGPXの開始時間より早くなっています。');
    return;
  }

  // 変換実行
  result = gpxtrim.trim(strGPX, new Date(dtst), new Date(dted));
  // 結果表示
  $('#resultst').html(gpxtrim.getStatus().replace(/\n/g, "<br/>"));
  // ダウンロード
  downloadGPX(result);
}

/** GPXをダウンロードする*/
function downloadGPX(result){
  var blob = new Blob([result],{type:'text/xml'});
  var $btn = $('#btnDownload');
  $btn.attr('href',URL.createObjectURL(blob));
  $btn.attr('target','_blank');
  $btn.attr('download',fileGPX.name);
  $btn.text("変換したGPXファイルをダウンロード");
}


/** ファイル設定*/
function changeFile() {
  // 機能チェック
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert('The File APIs are not fully supported in this browser.');
  }

  // 初期化
  strGPX = "";
  fileGPX = "";
  rangeGPX = {};
  $('#btnDownload').text("");
  $('#resultst').text("");

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
}

/** GPXファイルの開始と終了時間を読み取って、ページに反映させる*/
function detectGPX(data) {
  rangeGPX = gpxtrim.getTime(data);
  $('#gpxstatus').html("開始日時:"+strDate(rangeGPX.first)+"<br/>終了日時:"+strDate(rangeGPX.last));
  $('#textStart').val(strDate(rangeGPX.first));
  $('#textEnd').val(strDate(rangeGPX.last));
}

function strDate(dt) {
  return ""+dt.getFullYear()+"/"+(dt.getMonth()+1)+"/"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
}
