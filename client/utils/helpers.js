/**
 * Channel Template Tag
 * @param {[String]} strings
 * @param {String} channel
 * @returns {String}
 */
export const ch = (strings, channel) =>
  `${strings[0] || ''}(${channel || 'X'})${strings[1] || ''}`;

/**
 * Accepts a list of channels and return a string
 * i.e. stringifyChannelList([1,2,3,5]) => '(1)-(3), (5)'
 * @param {[Number]} channelList
 * @returns {String}
 */
export const stringifyChannelList = (channelList) => {
  if (!channelList.length) {
    return null;
  }
  let returnStr = ch`${channelList[0]}`;
  let currentVal = channelList[0];
  let inRange = false;
  for (let i = 1; i < channelList.length; i++) {
    if (channelList[i] === currentVal) break;
    if (channelList[i] !== currentVal + 1) {
      if (inRange) {
        returnStr += ch`-${currentVal}`;
        inRange = false;
      }
      returnStr += ch`, ${channelList[i]}`;
    } else if (i === channelList.length - 1) {
      returnStr += ch`-${channelList[i]}`;
    } else {
      inRange = true;
    }
    currentVal = channelList[i];
  }
  return returnStr;
};
