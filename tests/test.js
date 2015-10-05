/**
 * nodeunit テストプログラム
 * nodeunit tests/test.js で実行
 */
var fs = require('fs');
var gpxtrim = require('../src/gpx-trimmer');

/*　データ読み込み
    sample/gpx00.gpx 範囲チェックデータ
        セグメント1: 2013-08-05T03:31:13Z〜2013-08-05T03:31:30Z x5
        セグメント2: 2013-08-05T03:31:34Z〜2013-08-05T03:31:50Z x5
    sample/gpx01.gpx 重複削除データ
        セグメント1：すべて2重にする。x10
        セグメント2：少しずらして二重にする。x10
    sample/gpx02.gpx データとびデータ
        セグメント1：中央に1つ異常値 x6
        セグメント2：中央に1つ異常値 x6
*/
var data = [];
data.push(fs.readFileSync('./sample/gpx00.gpx', 'utf8'));// 0
data.push(fs.readFileSync('./sample/gpx01.gpx', 'utf8'));// 1
data.push(fs.readFileSync('./sample/gpx02.gpx', 'utf8'));// 2
data.push(fs.readFileSync('./sample/gpx00_ans.gpx', 'utf8'));// 3
data.push(fs.readFileSync('./sample/gpx01_ans.gpx', 'utf8'));// 4
data.push(fs.readFileSync('./sample/gpx00_ans5.gpx', 'utf8'));// 5
data.push(fs.readFileSync('./sample/gpx00_ans6.gpx', 'utf8'));// 6
data.push(fs.readFileSync('./sample/gpx00_ans7.gpx', 'utf8'));// 7

/** 範囲のテスト*/
exports.range = {
  // トリミングテスト
  testTrim: function(test) {
    test.expect(1);
    var dt = gpxtrim.removeSegment(data[0]);
    test.equal(gpxtrim.removeSegment(data[0])+"\n", data[3], "trimSegment");
    test.done();
  },
  // 前後2つをカット
  testZengo: function(test) {
    var dt1 = new Date('2013-08-05T03:31:14Z');
    var dt2 = new Date('2013-08-05T03:31:49Z');
    test.expect(1);
    test.equal(gpxtrim.trim(data[0], dt1, dt2)+"\n", data[4], "trimming");
    test.done();
    console.log("testZengo:"+gpxtrim.getStatus());
  },
  // オーバー追加テスト
  testAdd: function(test) {
    var dt1 = new Date('2013-08-05T03:31:00Z');
    var dt2 = new Date('2013-08-05T03:32:00Z');
    test.expect(1);
    test.equal(gpxtrim.trim(data[0], dt1, dt2)+"\n", data[5], "add out time");
    test.done();
    console.log("testAdd:"+gpxtrim.getStatus());
  },
  // nullテスト
  testNull: function(test) {
    test.expect(2);
    var dt1 = new Date('2013-08-05T03:31:14Z');
    var dt2 = new Date('2013-08-05T03:31:49Z');
    test.expect(2);
    test.equal(gpxtrim.trim(data[0], null, dt2)+"\n", data[6], "before null.");
    console.log("testNull.Remove Last:"+gpxtrim.getStatus());
    test.equal(gpxtrim.trim(data[0], dt1, "")+"\n", data[7], "after empty.");
    console.log("testNull.Remove First:"+gpxtrim.getStatus());
    test.done();
  },
  // 時間取得チェック
  testGetTime: function(test) {
    var dt1 = new Date('2013-08-05T03:31:13Z');
    var dt2 = new Date('2013-08-05T03:31:50Z');
    test.expect(2);
    var ret = gpxtrim.getTime(data[0]);
    test.equal(ret.first.toUTCString(), dt1.toUTCString(), "first time.");
    test.equal(ret.last.toUTCString(), dt2.toUTCString(), "last time.");
    test.done();
  }
};

/** 重複テスト*/
/*
exports.choufuku = {

};
*/

/** データとびテスト*/
/*
exports.tobi = {

};
*/
