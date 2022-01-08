import tinycolor from 'tinycolor2';

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
    if (channelList[i] !== currentVal) {
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
  }
  return returnStr;
};

/**
 * Returns white or black color based on which contrasts most with input color
 * @param {String} color
 * @returns {String} either #FFFFFF or #000000
 */
export const whiteOrBlack = (color) =>
  tinycolor(color).isValid() && tinycolor(color).isDark()
    ? '#FFFFFF'
    : '#000000';

export const parseQueryString = (query) => {
  const strippedQuery = query.replace(
    /^[^a-zA-z0-9]+|[^a-zA-Z0-9,/-]|[^a-zA-z0-9]+$/g,
    ''
  );
  if (!strippedQuery.length) {
    return [];
  } else {
    return strippedQuery.split(',').map((query) =>
      query
        .replace(/(?<=-).*-/g, '')
        .split('-')
        .map((query) => (!Number.isNaN(+query) ? +query : query))
    );
  }
};
