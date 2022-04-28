const humanizeDuration = (seconds) => {
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600);
  var mins = ~~((seconds % 3600) / 60);
  var secs = ~~seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  ret += "" + (hrs < 10 ? "0" : "") + hrs + ":";
  ret += "" + (mins < 10 ? "0" : "") + mins + ":";
  ret += "" + (secs < 10 ? "0" : "") + secs + "";
  return ret;
};

export default humanizeDuration;
