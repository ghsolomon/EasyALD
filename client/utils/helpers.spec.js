import { expect } from 'chai';
import { ch, stringifyChannelList } from './helpers';

describe('helpers', () => {
  describe('channel template tag', () => {
    it('should wrap a channel in parantheses', () => {
      expect(ch`${12}`).to.equal('(12)');
    });
    it('should allow for a string before', () => {
      expect(ch`the channel is ${12}`).to.equal('the channel is (12)');
    });
    it('should allow for a string after', () => {
      expect(ch`${12} is the channel`).to.equal('(12) is the channel');
    });
    it('should allow for a string before and after', () => {
      expect(ch`channel ${12} is the best`).to.equal(
        'channel (12) is the best'
      );
    });
    it('should convert a null channel to an X', () => {
      expect(ch`channel ${null} is null`).to.equal('channel (X) is null');
    });
  });

  describe('stringifyChannelList', () => {
    it('should convert a range of channels', () => {
      const list = [1, 2, 3, 4, 5];
      expect(stringifyChannelList(list)).to.equal('(1)-(5)');
    });
    it('should convert a range of channels with a gap', () => {
      const list = [1, 2, 4, 5];
      const list2 = [null, 2, 3, 4, 5];
      const list3 = [1, 2, 3, 12, 14, 15, 16];
      const list4 = [1, 2, 3, 12, 15];
      expect(stringifyChannelList(list)).to.equal('(1)-(2), (4)-(5)');
      expect(stringifyChannelList(list2)).to.equal('(X), (2)-(5)');
      expect(stringifyChannelList(list3)).to.equal('(1)-(3), (12), (14)-(16)');
      expect(stringifyChannelList(list4)).to.equal('(1)-(3), (12), (15)');
    });
    it('should convert a range of channels with nulls', () => {
      const list = [null, null, 201, 289];
      expect(stringifyChannelList(list)).to.equal('(X), (201), (289)');
    });
    it('should convert a range of channels with duplicates', () => {
      const list = [201, 201, 202, 202, 204];
      expect(stringifyChannelList(list)).to.equal('(201)-(202), (204)');
    });
  });
});
